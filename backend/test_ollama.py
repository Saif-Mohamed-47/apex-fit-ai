import pytest
import requests

def is_ollama_available():
    try:
        res = requests.get("http://localhost:11434/api/tags", timeout=1.0)
        return res.status_code == 200
    except Exception:
        return False

@pytest.mark.integration
@pytest.mark.skipif(not is_ollama_available(), reason="Ollama service is not reachable at http://localhost:11434")
def test_ollama():
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3:latest",
        "prompt": "Hello! Are you ready to help with fitness coaching?",
        "stream": False
    }
    
    response = requests.post(url, json=payload, timeout=30.0)
    response.raise_for_status()
    assert "response" in response.json()

if __name__ == "__main__":
    if is_ollama_available():
        test_ollama()
        print("Ollama test passed!")
    else:
        print("Ollama is not running.")
