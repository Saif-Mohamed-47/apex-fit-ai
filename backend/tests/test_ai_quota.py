import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from unittest.mock import patch, AsyncMock

from app.main import app
from app.database import Base, get_db
from app import models, auth

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.pop(get_db, None)

def create_user(email="athlete@apex.fit", tier="free", messages_today=0, last_date=None):
    db = TestingSessionLocal()
    hashed_pw = auth.get_password_hash("Athlete123!")
    user = models.User(
        email=email,
        password_hash=hashed_pw,
        role="user",
        subscription_tier=tier,
        ai_messages_today=messages_today,
        last_ai_message_date=last_date or date.today(),
        age=25, weight_kg=75.0, height_cm=175.0,
        gender="male", goal="gain_muscle", activity_level="moderate",
        training_experience_months=6, days_per_week=4
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_access_token({"sub": user.email})
    db.close()
    return user, token

@patch("app.ai_chat.chat_with_coach", new_callable=AsyncMock)
def test_free_tier_quota_limit(mock_chat):
    mock_chat.return_value = "Keep pushing, champ!"
    
    # User with 4 messages today (1 remaining)
    user, token = create_user(email="free_user@apex.fit", tier="free", messages_today=4, last_date=date.today())
    
    # 5th message -> Allowed
    res5 = client.post(
        "/chat/",
        json={"message": "Can I eat oats before workout?", "history": []},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res5.status_code == 200

    # 6th message -> Blocked with 403 Forbidden
    res6 = client.post(
        "/chat/",
        json={"message": "What about post-workout?", "history": []},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res6.status_code == 403
    assert "استهلكت كوتة الرسائل اليومية المجانية" in res6.json()["detail"]

@patch("app.ai_chat.chat_with_coach", new_callable=AsyncMock)
def test_quota_resets_on_new_day(mock_chat):
    mock_chat.return_value = "Welcome back!"
    yesterday = date.today() - timedelta(days=1)
    
    # User had 5 messages yesterday
    user, token = create_user(email="reset_user@apex.fit", tier="free", messages_today=5, last_date=yesterday)

    # Message today -> Resets counter to 1 and succeeds
    res = client.post(
        "/chat/",
        json={"message": "Good morning coach", "history": []},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

    # Verify DB updated
    db = TestingSessionLocal()
    updated = db.query(models.User).filter(models.User.email == "reset_user@apex.fit").first()
    assert updated.ai_messages_today == 1
    assert updated.last_ai_message_date == date.today()
    db.close()

@patch("app.ai_chat.chat_with_coach", new_callable=AsyncMock)
def test_pro_tier_unlimited_chat(mock_chat):
    mock_chat.return_value = "Pro unlimited response"
    
    # User with Pro tier and 100 messages already sent
    user, token = create_user(email="pro_user@apex.fit", tier="pro", messages_today=100, last_date=date.today())

    res = client.post(
        "/chat/",
        json={"message": "Check my deadlift form", "history": []},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

def test_checkout_upgrades_subscription_and_resets_quota():
    user, token = create_user(email="upgrading_user@apex.fit", tier="free", messages_today=5, last_date=date.today())

    res = client.post(
        "/payments/checkout",
        json={
            "plan_id": "pro",
            "payment_method": "vodafone_cash",
            "sender_phone": "01012345678",
            "transfer_ref": "VF-TEST-123"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200

    # Verify user is now Pro with reset quota
    db = TestingSessionLocal()
    updated = db.query(models.User).filter(models.User.email == "upgrading_user@apex.fit").first()
    assert updated.subscription_tier == "pro"
    assert updated.ai_messages_today == 0
    db.close()
