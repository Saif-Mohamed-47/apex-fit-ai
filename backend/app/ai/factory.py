import os
from typing import Optional
from .providers.base import BaseLLMProvider
from .providers.ollama import OllamaProvider
from .providers.gemini import GeminiProvider

def get_llm_provider(provider_name: Optional[str] = None) -> BaseLLMProvider:
    """Factory function to instantiate LLM providers based on env var or parameter."""
    name = (provider_name or os.getenv("LLM_PROVIDER", "ollama")).lower().strip()
    
    if name == "ollama":
        return OllamaProvider()
    elif name == "gemini":
        return GeminiProvider()
    else:
        raise ValueError(f"Unsupported LLM provider: '{name}'. Supported providers: 'ollama', 'gemini'.")
