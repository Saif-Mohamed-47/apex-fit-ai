import os
import json
import httpx
from typing import List, Dict, Any, AsyncGenerator
from .base import BaseLLMProvider

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str = None, model: str = None, timeout: float = 30.0):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable or argument is required for GeminiProvider.")
        self.model = model or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.timeout = timeout
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"

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

    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        payload = self._convert_messages(messages)
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                
                # Extract text response from Gemini structure
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
                return ""
        except httpx.TimeoutException:
            return "The coach is taking too long to respond, please try again."
        except Exception as e:
            return f"Error connecting to coach (Gemini): {e}"

    async def stream_response(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        url = f"{self.base_url}/models/{self.model}:streamGenerateContent?key={self.api_key}&alt=sse"
        payload = self._convert_messages(messages)
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream("POST", url, json=payload) as response:
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
                                    parts = candidates[0].get("content", {}).get("parts", [])
                                    if parts:
                                        chunk = parts[0].get("text", "")
                                        if chunk:
                                            yield chunk
                            except json.JSONDecodeError:
                                continue
        except Exception as e:
            yield f"Error streaming from coach (Gemini): {e}"
