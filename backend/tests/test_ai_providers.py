import pytest
import os
from unittest.mock import AsyncMock, patch, MagicMock
from app.ai.factory import get_llm_provider
from app.ai.providers.base import BaseLLMProvider
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

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        reply = await provider.generate_response(messages)

        assert reply == "Hello athlete!"
        mock_post.assert_called_once()
        _, kwargs = mock_post.call_args
        assert kwargs["json"]["model"] == "llama3:latest"
        assert kwargs["json"]["stream"] is False

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

    with patch("httpx.AsyncClient.stream", return_value=MockStreamContext()):
        chunks = []
        async for chunk in provider.stream_response(messages):
            chunks.append(chunk)

        assert chunks == ["Chunk 1 ", "Chunk 2"]

@pytest.mark.asyncio
async def test_gemini_provider_message_conversion():
    provider = GeminiProvider(api_key="test_key", model="gemini-2.5-flash")
    messages = [
        {"role": "system", "content": "You are a fitness coach."},
        {"role": "user", "content": "How to bench press?"},
        {"role": "assistant", "content": "Keep shoulders retracted."}
    ]

    converted = provider._convert_messages(messages)
    assert converted["system_instruction"] == {"parts": [{"text": "You are a fitness coach."}]}
    assert converted["contents"] == [
        {"role": "user", "parts": [{"text": "How to bench press?"}]},
        {"role": "model", "parts": [{"text": "Keep shoulders retracted."}]}
    ]

@pytest.mark.asyncio
async def test_gemini_provider_generate_success():
    provider = GeminiProvider(api_key="test_key", model="gemini-2.5-flash")
    messages = [{"role": "user", "content": "Hello"}]

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "candidates": [
            {"content": {"parts": [{"text": "Gemini response text"}]}}
        ]
    }

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        reply = await provider.generate_response(messages)

        assert reply == "Gemini response text"

@pytest.mark.asyncio
async def test_chat_with_coach_with_mock_provider():
    mock_provider = AsyncMock(spec=BaseLLMProvider)
    mock_provider.generate_response.return_value = "Mocked coach response"

    history = [{"role": "user", "content": "Previous msg"}]
    reply = await ai_chat.chat_with_coach(
        user_message="New question",
        conversation_history=history,
        system_prompt="System instructions",
        provider=mock_provider
    )

    assert reply == "Mocked coach response"
    mock_provider.generate_response.assert_called_once()
    called_messages = mock_provider.generate_response.call_args[0][0]
    assert len(called_messages) == 3
    assert called_messages[0] == {"role": "system", "content": "System instructions"}
    assert called_messages[1] == {"role": "user", "content": "Previous msg"}
    assert called_messages[2] == {"role": "user", "content": "New question"}
