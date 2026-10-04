import pytest
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app import models, adaptive

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_weight_increment_by_exercise_type():
    # Isolation exercises should use 1.0kg micro-increments
    assert adaptive.get_weight_increment("Lateral Raises", 10.0) == 1.0
    assert adaptive.get_weight_increment("Bicep Curls", 12.0) == 1.0
    assert adaptive.get_weight_increment("Triceps Pushdowns", 20.0) == 1.0

    # Compound exercises should use standard 2.5kg plate increments
    assert adaptive.get_weight_increment("Bench Press", 80.0) == 2.5
    assert adaptive.get_weight_increment("Squats", 100.0) == 2.5
    assert adaptive.get_weight_increment("Barbell Rows", 70.0) == 2.5

def test_adaptive_no_history(db_session):
    rec = adaptive.get_adaptive_recommendation(user_id=1, exercise_name="Bench Press", db=db_session)
    assert rec["has_history"] is False
    assert rec["recommended_weight_kg"] is None
    assert "starting" in rec["reasoning"].lower() or "light" in rec["reasoning"].lower()

def test_adaptive_failed_set_causes_10pct_deload(db_session):
    # Log 3 sets where set 3 failed
    now = datetime.now()
    for s in [1, 2]:
        db_session.add(models.WorkoutLog(
            user_id=1, exercise_name="Squats", logged_at=now,
            actual_weight_kg=100.0, actual_reps=8, set_number=s, difficulty_rating="moderate"
        ))
    db_session.add(models.WorkoutLog(
        user_id=1, exercise_name="Squats", logged_at=now,
        actual_weight_kg=100.0, actual_reps=5, set_number=3, difficulty_rating="failed"
    ))
    db_session.commit()

    rec = adaptive.get_adaptive_recommendation(user_id=1, exercise_name="Squats", db=db_session)
    assert rec["has_history"] is True
    # 100 * 0.9 = 90.0
    assert rec["recommended_weight_kg"] == 90.0
    assert "reducing weight by 10%" in rec["reasoning"]

def test_adaptive_hard_set_maintains_weight(db_session):
    now = datetime.now()
    for s in [1, 2, 3]:
        db_session.add(models.WorkoutLog(
            user_id=1, exercise_name="Bench Press", logged_at=now,
            actual_weight_kg=80.0, actual_reps=8, set_number=s, difficulty_rating="hard"
        ))
    db_session.commit()

    rec = adaptive.get_adaptive_recommendation(user_id=1, exercise_name="Bench Press", db=db_session)
    assert rec["has_history"] is True
    assert rec["recommended_weight_kg"] == 80.0
    assert "hard" in rec["reasoning"].lower()

def test_adaptive_easy_compound_increases_by_2_5kg(db_session):
    now = datetime.now()
    for s in [1, 2, 3]:
        db_session.add(models.WorkoutLog(
            user_id=1, exercise_name="Squats", logged_at=now,
            actual_weight_kg=100.0, actual_reps=10, set_number=s, difficulty_rating="easy"
        ))
    db_session.commit()

    rec = adaptive.get_adaptive_recommendation(user_id=1, exercise_name="Squats", db=db_session)
    assert rec["has_history"] is True
    assert rec["recommended_weight_kg"] == 102.5

def test_adaptive_easy_isolation_increases_by_1_0kg(db_session):
    now = datetime.now()
    for s in [1, 2, 3]:
        db_session.add(models.WorkoutLog(
            user_id=1, exercise_name="Lateral Raises", logged_at=now,
            actual_weight_kg=10.0, actual_reps=12, set_number=s, difficulty_rating="moderate"
        ))
    db_session.commit()

    rec = adaptive.get_adaptive_recommendation(user_id=1, exercise_name="Lateral Raises", db=db_session)
    assert rec["has_history"] is True
    # 10.0 + 1.0 = 11.0 (not 12.5)
    assert rec["recommended_weight_kg"] == 11.0

def test_adaptive_bodyweight_exercise(db_session):
    now = datetime.now()
    db_session.add(models.WorkoutLog(
        user_id=1, exercise_name="Pull-Ups", logged_at=now,
        actual_weight_kg=0.0, actual_reps=10, set_number=1, difficulty_rating="easy"
    ))
    db_session.commit()

    rec = adaptive.get_adaptive_recommendation(user_id=1, exercise_name="Pull-Ups", db=db_session)
    assert rec["has_history"] is True
    assert rec["recommended_weight_kg"] == 0
    assert "reps" in rec["reasoning"].lower()
