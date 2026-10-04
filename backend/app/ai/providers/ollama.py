import os
import json
import httpx
import logging
from typing import List, Dict, Any, AsyncGenerator, Optional
from .base import BaseLLMProvider

logger = logging.getLogger(__name__)

class OllamaProvider(BaseLLMProvider):
    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None, timeout: Optional[float] = None):
        self.base_url = (base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")).rstrip('/')
        self.model = model or os.getenv("OLLAMA_MODEL", "llama3:latest")
        
        env_timeout = os.getenv("LLM_TIMEOUT_SECONDS")
        if timeout is not None:
            self.timeout = timeout
        elif env_timeout is not None:
            self.timeout = float(env_timeout)
        else:
            self.timeout = 30.0
            
        self._client: Optional[httpx.AsyncClient] = None

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=self.timeout)
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False
        }
        
        try:
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("message", {}).get("content", "")
        except httpx.TimeoutException:
            return "The coach is taking too long to respond, please try again."
        except Exception as e:
            logger.error("Ollama provider error: %s", e)
            return f"Error connecting to coach (Ollama): {e}"

    async def stream_response(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True
        }
        
        try:
            async with self.client.stream("POST", url, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line:
                        data = json.loads(line)
                        chunk = data.get("message", {}).get("content", "")
                        if chunk:
                            yield chunk
        except httpx.TimeoutException:
            yield "The coach is taking too long to respond, please try again."
        except Exception as e:
            logger.error("Ollama stream error: %s", e)
            yield f"Error streaming from coach (Ollama): {e}"
