import os
import sys
import asyncio
from dotenv import load_dotenv

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

from app.ai.providers.gemini import GeminiProvider

load_dotenv()

async def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is not set.")
        print("Please set GEMINI_API_KEY in your environment or backend/.env file.")
        sys.exit(1)

    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    print(f"--- Gemini API Smoke Test (Model: {model}) ---")
    
    provider = GeminiProvider(api_key=api_key, model=model)
    messages = [
        {"role": "system", "content": "You are a helpful fitness coach AI."},
        {"role": "user", "content": "Hello! Give me 3 quick tips for a beginner starting bench press."}
    ]
    
    print("\n1. Testing generate_response():")
    try:
        response = await provider.generate_response(messages)
        print("RESPONSE:\n" + response)
    except Exception as e:
        print(f"generate_response FAILED: {e}")

    print("\n2. Testing stream_response():")
    try:
        print("STREAM OUTPUT: ", end="", flush=True)
        async for chunk in provider.stream_response(messages):
            print(chunk, end="", flush=True)
        print("\nSTREAM COMPLETED SUCCESSFULLY")
    except Exception as e:
        print(f"\nstream_response FAILED: {e}")

    await provider.close()

if __name__ == "__main__":
    asyncio.run(main())
