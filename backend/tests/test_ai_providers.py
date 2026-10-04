import pytest
import os
from unittest.mock import AsyncMock, patch, MagicMock
from app.ai.factory import get_llm_provider
from app.ai.providers.base import BaseLLMProvider, GeminiContentBlockedError, GeminiEmptyResponseError
from app.ai.providers.ollama import OllamaProvider
from app.ai.providers.gemini import GeminiProvider
from app import ai_chat

def test_factory_default_ollama(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    provider = get_llm_provider()
    assert isinstance(provider, OllamaProvider)

def test_factory_explicit_gemini(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "dummy_test_key")
    provider = get_llm_provider("gemini")
    assert isinstance(provider, GeminiProvider)
    assert provider.api_key == "dummy_test_key"

def test_factory_missing_gemini_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    with pytest.raises(ValueError, match="GEMINI_API_KEY environment variable or argument is required"):
        get_llm_provider("gemini")

def test_factory_unsupported_provider():
    with pytest.raises(ValueError, match="Unsupported LLM provider"):
        get_llm_provider("unsupported_llm")

@pytest.mark.asyncio
async def test_ollama_provider_generate_success():
    provider = OllamaProvider(base_url="http://localhost:11434", model="llama3:latest")
    messages = [{"role": "user", "content": "Hello coach"}]

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"message": {"content": "Hello athlete!"}}

    with patch.object(provider.client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        reply = await provider.generate_response(messages)

        assert reply == "Hello athlete!"
        mock_post.assert_called_once()
        _, kwargs = mock_post.call_args
        assert kwargs["json"]["model"] == "llama3:latest"
        assert kwargs["json"]["stream"] is False

    await provider.close()

@pytest.mark.asyncio
async def test_ollama_provider_stream_success():
    provider = OllamaProvider(base_url="http://localhost:11434", model="llama3:latest")
    messages = [{"role": "user", "content": "Hello"}]

    class MockStreamResponse:
        def raise_for_status(self):
            pass
        async def aiter_lines(self):
            yield '{"message": {"content": "Chunk 1 "}}'
            yield '{"message": {"content": "Chunk 2"}}'

    class MockStreamContext:
        async def __aenter__(self):
            return MockStreamResponse()
        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

    with patch.object(provider.client, "stream", return_value=MockStreamContext()):
        chunks = []
        async for chunk in provider.stream_response(messages):
            chunks.append(chunk)

        assert chunks == ["Chunk 1 ", "Chunk 2"]

    await provider.close()

@pytest.mark.asyncio
async def test_gemini_header_authentication():
    secret_key = "secret_api_key_12345"
    provider = GeminiProvider(api_key=secret_key, model="gemini-2.5-flash")
    messages = [{"role": "user", "content": "Hello"}]

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "Hello user"}]}}]
    }

    with patch.object(provider.client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        reply = await provider.generate_response(messages)

        assert reply == "Hello user"
        url_called = mock_post.call_args[0][0]
        # Secret key must NOT be in the URL query string
        assert secret_key not in url_called
        # Client headers must contain x-goog-api-key
        assert provider.client.headers.get("x-goog-api-key") == secret_key

    await provider.close()

@pytest.mark.asyncio
async def test_gemini_secret_masking():
    secret_key = "sensitive_key_999"
    provider = GeminiProvider(api_key=secret_key, model="gemini-2.5-flash")

    masked = provider._mask_secret(f"Error connecting to https://api.com?key={secret_key}")
    assert secret_key not in masked
    assert "***MASKED_API_KEY***" in masked

    await provider.close()

@pytest.mark.asyncio
async def test_gemini_content_blocked_safety():
    provider = GeminiProvider(api_key="test_key", model="gemini-2.5-flash")
    messages = [{"role": "user", "content": "Dangerous topic"}]

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "candidates": [{"finishReason": "SAFETY"}]
    }

    with patch.object(provider.client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        reply = await provider.generate_response(messages)

        assert "safety guardrails" in reply.lower()

    await provider.close()

@pytest.mark.asyncio
async def test_gemini_empty_response():
    provider = GeminiProvider(api_key="test_key", model="gemini-2.5-flash")
    messages = [{"role": "user", "content": "Hello"}]

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"candidates": []}

    with patch.object(provider.client, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        reply = await provider.generate_response(messages)

        assert "unable to generate a response" in reply.lower()

    await provider.close()

@pytest.mark.asyncio
async def test_provider_client_reuse_and_close():
    provider = OllamaProvider()
    client1 = provider.client
    client2 = provider.client
    assert client1 is client2
    assert not client1.is_closed

    await provider.close()
    assert client1.is_closed
