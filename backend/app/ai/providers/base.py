from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncGenerator, Optional

class LLMProviderError(Exception):
    """Base exception for LLM provider errors."""
    pass

class GeminiContentBlockedError(LLMProviderError):
    """Raised when Gemini response is blocked due to safety or policy."""
    def __init__(self, finish_reason: str):
        self.finish_reason = finish_reason
        super().__init__(f"Gemini response blocked. Finish reason: {finish_reason}")

class GeminiEmptyResponseError(LLMProviderError):
    """Raised when Gemini returns a candidate-less or empty response."""
    def __init__(self, message: str = "Gemini returned an empty response with no candidates."):
        super().__init__(message)

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_response(self, messages: List[Dict[str, str]]) -> str:
        """Generates a complete response text for a list of chat message dictionaries."""
        pass

    @abstractmethod
    async def stream_response(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """Streams response text chunks as an async generator."""
        pass

    async def close(self):
        """Clean up underlying network client resources."""
        pass
