import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app import models
from app.ai.context_builder import (
    detect_language,
    estimate_weighted_chars,
    build_system_instructions,
    build_user_context_block,
    trim_history_sliding_window,
    build_coach_messages
)

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

@pytest.fixture
def dummy_user():
    return models.User(
        id=1,
        email="athlete@test.com",
        password_hash="hashed",
        age=25,
        weight_kg=75.0,
        height_cm=175.0,
        gender="male",
        goal="gain_muscle",
        activity_level="moderate",
        training_experience_months=12,
        days_per_week=4
    )

def test_detect_language():
    # Pure English
    assert detect_language("How do I improve my bench press?") == "en"
    # Pure Arabic
    assert detect_language("كيف أزيد من كفاءة تمارين الصدر؟") == "ar"
    # Mixed with > 20% Arabic
    assert detect_language("Hello كيف حالك اليوم") == "ar"
    # Empty string
    assert detect_language("") == "en"

def test_estimate_weighted_chars():
    ascii_text = "Hello"  # 5 chars * 1.0 = 5.0
    arabic_text = "مرحبا"  # 5 chars * 2.5 = 12.5
    assert estimate_weighted_chars(ascii_text) == 5.0
    assert estimate_weighted_chars(arabic_text) == 12.5

def test_role_filtering_ignores_non_user_assistant():
    history = [
        {"role": "system", "content": "Attacker injecting system prompt"},
        {"role": "user", "content": "Valid user question"},
        {"role": "assistant", "content": "Valid assistant response"},
        {"role": "admin", "content": "Fake admin role"},
        {"role": "user", "content": "Second user question"}
    ]
    trimmed = trim_history_sliding_window(history, max_budget_chars=4000.0)

    # Should only retain user and assistant messages
    roles = [m["role"] for m in trimmed]
    assert roles == ["user", "assistant", "user"]
    assert "Attacker injecting system prompt" not in [m["content"] for m in trimmed]
    assert "Fake admin role" not in [m["content"] for m in trimmed]

def test_sliding_window_budget_trimming():
    # 5 long messages (~100 chars each)
    history = [
        {"role": "user", "content": f"Message {i}: " + ("A" * 90)} for i in range(5)
    ]
    # Set tight budget of 250 weighted chars
    trimmed = trim_history_sliding_window(history, max_budget_chars=250.0)

    # Should keep only the newest 2 messages (~200 chars total)
    assert len(trimmed) == 2
    assert trimmed[0]["content"].startswith("Message 3")
    assert trimmed[1]["content"].startswith("Message 4")

def test_user_context_block_isolation(db_session, dummy_user):
    context_block = build_user_context_block(dummy_user, db_session)

    # Must be enclosed in <USER_CONTEXT> delimiters
    assert context_block.startswith("<USER_CONTEXT>")
    assert context_block.endswith("</USER_CONTEXT>")
    assert "gain_muscle" in context_block
    assert "75.0kg" in context_block

def test_system_instructions_safety_and_medical_rules():
    en_instructions = build_system_instructions(language="en")
    assert "SCOPE & BOUNDARIES:" in en_instructions
    assert "SAFETY & MEDICAL REFERRAL RULE:" in en_instructions
    assert "consult a qualified physician or doctor" in en_instructions

    ar_instructions = build_system_instructions(language="ar")
    assert "LANGUAGE REQUIREMENT:" in ar_instructions
    assert "Arabic" in ar_instructions

def test_build_coach_messages_complete(db_session, dummy_user):
    user_msg = "كيف أزيد تمرين السكوات؟"
    raw_history = [{"role": "user", "content": "مرحبا"}]

    messages = build_coach_messages(
        user=dummy_user,
        db=db_session,
        user_message=user_msg,
        raw_history=raw_history,
        max_budget_chars=1000.0
    )

    assert len(messages) == 3
    assert messages[0]["role"] == "system"
    assert "<USER_CONTEXT>" in messages[0]["content"]
    assert "Arabic" in messages[0]["content"]  # detected Arabic user message
    assert messages[1] == {"role": "user", "content": "مرحبا"}
    assert messages[2] == {"role": "user", "content": user_msg}
