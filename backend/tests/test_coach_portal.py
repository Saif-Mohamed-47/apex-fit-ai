import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
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

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def create_test_coach(email="coach@apex.fit"):
    db = TestingSessionLocal()
    hashed_pw = auth.get_password_hash("CoachPass123!")
    coach = models.User(
        email=email,
        password_hash=hashed_pw,
        role="coach",
        invite_code="COACH-TEST-1234",
        age=30, weight_kg=85.0, height_cm=180.0,
        gender="male", goal="maintain", activity_level="active",
        training_experience_months=48, days_per_week=5
    )
    db.add(coach)
    db.commit()
    db.refresh(coach)
    token = auth.create_access_token({"sub": coach.email})
    db.close()
    return coach, token

def test_coach_generate_invite_code():
    coach, token = create_test_coach("coach1@apex.fit")
    response = client.post(
        "/coach/invite-code",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "invite_code" in response.json()
    assert response.json()["invite_code"] == "COACH-TEST-1234"

def test_client_signup_with_coach_invite_code():
    coach, coach_token = create_test_coach("coach2@apex.fit")
    
    # Signup client with coach invite code
    client_payload = {
        "email": "trainee@apex.fit",
        "password": "TraineePass123!",
        "age": 25,
        "weight_kg": 75.0,
        "height_cm": 175.0,
        "gender": "male",
        "goal": "lose_fat",
        "activity_level": "moderate",
        "training_experience_months": 12,
        "days_per_week": 4,
        "coach_invite_code": "COACH-TEST-1234"
    }

    signup_res = client.post("/users/", json=client_payload)
    assert signup_res.status_code == 200
    client_data = signup_res.json()
    assert client_data["coach_id"] == coach.id

    # Coach lists clients
    clients_res = client.get("/coach/clients", headers={"Authorization": f"Bearer {coach_token}"})
    assert clients_res.status_code == 200
    clients_list = clients_res.json()
    assert len(clients_list) == 1
    assert clients_list[0]["email"] == "trainee@apex.fit"

def test_coach_macro_override_flow():
    coach, coach_token = create_test_coach("coach3@apex.fit")
    
    db = TestingSessionLocal()
    hashed_pw = auth.get_password_hash("Pass123!")
    trainee = models.User(
        email="trainee2@apex.fit", password_hash=hashed_pw,
        coach_id=coach.id, role="client", age=22, weight_kg=70.0, height_cm=170.0,
        gender="female", goal="gain_muscle", activity_level="light",
        training_experience_months=6, days_per_week=3
    )
    db.add(trainee)
    db.commit()
    db.refresh(trainee)
    trainee_token = auth.create_access_token({"sub": trainee.email})
    db.close()

    # Client fetches default AI targets
    target_res1 = client.get("/nutrition-target/", headers={"Authorization": f"Bearer {trainee_token}"})
    assert target_res1.status_code == 200
    assert target_res1.json()["is_custom_coach_override"] is False

    # Coach overrides macros
    override_payload = {
        "custom_calories": 2400,
        "custom_protein_g": 160.0,
        "custom_carbs_g": 280.0,
        "custom_fat_g": 65.0
    }
    override_res = client.post(
        f"/coach/clients/{trainee.id}/override-macros",
        json=override_payload,
        headers={"Authorization": f"Bearer {coach_token}"}
    )
    assert override_res.status_code == 200

    # Client fetches updated target
    target_res2 = client.get("/nutrition-target/", headers={"Authorization": f"Bearer {trainee_token}"})
    assert target_res2.status_code == 200
    data2 = target_res2.json()
    assert data2["is_custom_coach_override"] is True
    assert data2["target_calories"] == 2400
    assert data2["protein_g"] == 160

    # Coach resets macros
    reset_res = client.delete(f"/coach/clients/{trainee.id}/override-macros", headers={"Authorization": f"Bearer {coach_token}"})
    assert reset_res.status_code == 200

    # Target returns to AI default
    target_res3 = client.get("/nutrition-target/", headers={"Authorization": f"Bearer {trainee_token}"})
    assert target_res3.json()["is_custom_coach_override"] is False

def test_client_submit_checkin():
    coach, coach_token = create_test_coach("coach4@apex.fit")
    
    db = TestingSessionLocal()
    hashed_pw = auth.get_password_hash("Pass123!")
    trainee = models.User(
        email="trainee3@apex.fit", password_hash=hashed_pw,
        coach_id=coach.id, role="client", age=28, weight_kg=80.0, height_cm=178.0,
        gender="male", goal="lose_fat", activity_level="moderate",
        training_experience_months=18, days_per_week=4
    )
    db.add(trainee)
    db.commit()
    trainee_token = auth.create_access_token({"sub": trainee.email})
    db.close()

    checkin_payload = {
        "weight_kg": 79.2,
        "sleep_hours": 7.5,
        "energy_rating": 4,
        "soreness_rating": 2,
        "client_notes": "Feeling great this week!"
    }

    res = client.post("/check-ins/", json=checkin_payload, headers={"Authorization": f"Bearer {trainee_token}"})
    assert res.status_code == 201
    assert res.json()["weight_kg"] == 79.2
