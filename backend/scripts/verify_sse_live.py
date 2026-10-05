import asyncio
import json
import sys
import time
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import Base
from app import models, auth
from app.ai_chat import stream_chat_with_coach
from app.ai.providers.base import BaseLLMProvider

class MockDelayedProvider(BaseLLMProvider):
    def __init__(self, chunks):
        self.chunks = chunks

    async def generate_response(self, messages):
        return "".join(self.chunks)

    async def stream_response(self, messages):
        for c in self.chunks:
            await asyncio.sleep(0.05)
            yield c

async def test_live_sse(user, db, message, lang_label):
    print("=" * 80)
    print(f"RAW SSE STREAM OUTPUT [{lang_label.upper()}] - Prompt: '{message}'")
    print("=" * 80)

    chunks = ["Hello! ", "For your muscle gain goal, ", "keep pushing your squats!"] if lang_label == "en" else ["مرحباً! ", "لتحقيق هدف بناء العضلات، ", "استمر في تطوير تمرين السكوات!"]
    provider = MockDelayedProvider(chunks)

    start_time = time.time()
    
    async for line in stream_chat_with_coach(
        user_message=message,
        conversation_history=[],
        user=user,
        db=db,
        provider=provider
    ):
        elapsed = time.time() - start_time
        timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        print(f"[{timestamp} (+{elapsed:.3f}s)] {line.strip()}")

async def test_client_disconnect_live(user, db):
    print("\n" + "=" * 80)
    print("TESTING CLIENT DISCONNECT MID-STREAM")
    print("=" * 80)

    class DisconnectingProvider(BaseLLMProvider):
        async def generate_response(self, messages):
            return "ok"

        async def stream_response(self, messages):
            yield "Chunk 1: Hello athlete..."
            await asyncio.sleep(0.05)
            yield "Chunk 2: Here is your routine..."
            await asyncio.sleep(0.05)
            raise asyncio.CancelledError()

    provider = DisconnectingProvider()
    start_time = time.time()
    
    try:
        async for line in stream_chat_with_coach(
            user_message="Disconnect test",
            conversation_history=[],
            user=user,
            db=db,
            provider=provider
        ):
            elapsed = time.time() - start_time
            timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
            print(f"[{timestamp} (+{elapsed:.3f}s)] {line.strip()}")
    except Exception as e:
        print(f"UNCAUGHT EXCEPTION: {e}")

async def main():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    u = models.User(
        id=1,
        email="sse_test@apexfit.ai",
        password_hash="hash",
        age=26,
        weight_kg=78.0,
        height_cm=178.0,
        gender="male",
        goal="gain_muscle",
        activity_level="moderate",
        training_experience_months=14,
        days_per_week=4
    )
    db.add(u)
    db.commit()

    await test_live_sse(u, db, "What is my recommended workout split?", "en")
    print()
    await test_live_sse(u, db, "ما هي الخطة التدريبية الموصى بها لي؟", "ar")
    print()
    await test_client_disconnect_live(u, db)

if __name__ == "__main__":
    asyncio.run(main())
