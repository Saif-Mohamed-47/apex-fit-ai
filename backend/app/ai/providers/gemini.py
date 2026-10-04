import os
import json
import httpx
import logging
from typing import List, Dict, Any, AsyncGenerator, Optional
from .base import BaseLLMProvider, GeminiContentBlockedError, GeminiEmptyResponseError

logger = logging.getLogger(__name__)

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, timeout: Optional[float] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable or argument is required for GeminiProvider.")
        self.model = model or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
        env_timeout = os.getenv("LLM_TIMEOUT_SECONDS")
        if timeout is not None:
            self.timeout = timeout
        elif env_timeout is not None:
            self.timeout = float(env_timeout)
        else:
            self.timeout = 30.0
            
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        self._client: Optional[httpx.AsyncClient] = None

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            headers = {"x-goog-api-key": self.api_key}
            self._client = httpx.AsyncClient(headers=headers, timeout=self.timeout)
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    def _convert_messages(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Converts OpenAI-style message dicts to Gemini API format."""
        system_instruction = None
        contents = []
        
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            
            if role == "system":
                system_instruction = {"parts": [{"text": content}]}
            elif role == "assistant":
                contents.append({"role": "model", "parts": [{"text": content}]})
            else:  # "user"
                contents.append({"role": "user", "parts": [{"text": content}]})
                
        payload = {"contents": contents}
        if system_instruction:
            payload["system_instruction"] = system_instruction
            
        return payload

    def _mask_secret(self, text: str) -> str:
        """Sanitizes text to prevent API key leakage in error messages."""
        if self.api_key and self.api_key in text:
            return text.replace(self.api_key, "***MASKED_API_KEY***")
        return text

    def _extract_text_from_candidate(self, candidate: Dict[str, Any]) -> str:
        finish_reason = candidate.get("finishReason")
        if finish_reason and finish_reason not in ("STOP", "MAX_TOKENS", None):
            raise GeminiContentBlockedError(finish_reason=finish_reason)
            
        parts = candidate.get("content", {}).get("parts", [])
        if not parts:
            raise GeminiEmptyResponseError("Candidate returned no text parts.")
            
        return parts[0].get("text", "")

    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        url = f"{self.base_url}/models/{self.model}:generateContent"
        payload = self._convert_messages(messages)
        
        try:
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            candidates = data.get("candidates", [])
            if not candidates:
                # Check for prompt-level block
                prompt_feedback = data.get("promptFeedback", {})
                block_reason = prompt_feedback.get("blockReason")
                if block_reason:
                    raise GeminiContentBlockedError(finish_reason=f"PROMPT_BLOCKED_{block_reason}")
                raise GeminiEmptyResponseError()
                
            return self._extract_text_from_candidate(candidates[0])
            
        except GeminiContentBlockedError as e:
            logger.warning("Gemini content blocked: %s", e)
            return "The coach response was blocked due to safety guardrails. Please rephrase your query."
        except GeminiEmptyResponseError as e:
            logger.warning("Gemini empty response: %s", e)
            return "The coach was unable to generate a response for this query."
        except httpx.TimeoutException:
            return "The coach is taking too long to respond, please try again."
        except Exception as e:
            safe_error = self._mask_secret(str(e))
            logger.error("Gemini provider error: %s", safe_error)
            return f"Error connecting to coach (Gemini): {safe_error}"

    async def stream_response(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        url = f"{self.base_url}/models/{self.model}:streamGenerateContent?alt=sse"
        payload = self._convert_messages(messages)
        
        try:
            async with self.client.stream("POST", url, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        raw_json = line[len("data: "):].strip()
                        if raw_json == "[DONE]":
                            break
                        try:
                            data = json.loads(raw_json)
                            candidates = data.get("candidates", [])
                            if candidates:
                                text_chunk = self._extract_text_from_candidate(candidates[0])
                                if text_chunk:
                                    yield text_chunk
                        except (json.JSONDecodeError, GeminiEmptyResponseError):
                            continue
                        except GeminiContentBlockedError as e:
                            logger.warning("Gemini stream content blocked: %s", e)
                            yield "\n[Response truncated due to safety guardrails]"
                            break
        except httpx.TimeoutException:
            yield "The coach is taking too long to respond, please try again."
        except Exception as e:
            safe_error = self._mask_secret(str(e))
            logger.error("Gemini stream error: %s", safe_error)
            yield f"Error streaming from coach (Gemini): {safe_error}"
