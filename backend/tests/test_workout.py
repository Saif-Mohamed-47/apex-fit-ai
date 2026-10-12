import pytest
from datetime import datetime, timedelta, date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app import models, workout

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_recommendation_beginner():
    rec = workout.get_workout_recommendation(experience_months=3, days_per_week=3)
    assert rec["split"] == "Full Body"
    assert len(rec["schedule"]) == 1

def test_recommendation_intermediate():
    rec_low_days = workout.get_workout_recommendation(experience_months=12, days_per_week=3)
    assert rec_low_days["split"] == "Full Body"

    rec_high_days = workout.get_workout_recommendation(experience_months=12, days_per_week=4)
    assert rec_high_days["split"] == "Push/Pull/Legs (Intermediate)"
    assert len(rec_high_days["schedule"]) == 3

def test_recommendation_advanced():
    rec = workout.get_workout_recommendation(experience_months=24, days_per_week=5)
    assert rec["split"] == "Push/Pull/Legs (Advanced)"
    # Check that sets were bumped to 4 sets
    for day in rec["schedule"]:
        for ex in day["exercises"]:
            assert "4 sets" in ex["sets_reps"]

def test_recommendation_pro():
    rec_6days = workout.get_workout_recommendation(experience_months=48, days_per_week=6)
    assert rec_6days["split"] == "Arnold Split (Pro)"
    assert len(rec_6days["schedule"]) == 3

    rec_4days = workout.get_workout_recommendation(experience_months=48, days_per_week=4)
    assert rec_4days["split"] == "Push/Pull/Legs (Advanced)"

def test_todays_focus_day_index_no_logs(db_session):
    schedule = [
        {"day": "Push", "exercises": [{"exercise_name": "Bench Press"}]},
        {"day": "Pull", "exercises": [{"exercise_name": "Pull-Ups"}]},
        {"day": "Legs", "exercises": [{"exercise_name": "Squats"}]}
    ]
    index = workout.get_todays_focus_day_index(user_id=1, db=db_session, schedule=schedule)
    assert index == 0

def test_todays_focus_day_index_logged_today(db_session):
    schedule = [
        {"day": "Push", "exercises": [{"exercise_name": "Bench Press"}]},
        {"day": "Pull", "exercises": [{"exercise_name": "Pull-Ups"}]},
        {"day": "Legs", "exercises": [{"exercise_name": "Squats"}]}
    ]
    log = models.WorkoutLog(
        user_id=1,
        exercise_name="Bench Press",
        logged_at=datetime.now(),
        actual_weight_kg=80.0,
        actual_reps=8,
        set_number=1,
        difficulty_rating="moderate"
    )
    db_session.add(log)
    db_session.commit()

    index = workout.get_todays_focus_day_index(user_id=1, db=db_session, schedule=schedule)
    assert index == 0

def test_todays_focus_day_index_logged_yesterday(db_session):
    schedule = [
        {"day": "Push", "exercises": [{"exercise_name": "Bench Press"}]},
        {"day": "Pull", "exercises": [{"exercise_name": "Pull-Ups"}]},
        {"day": "Legs", "exercises": [{"exercise_name": "Squats"}]}
    ]
    yesterday = datetime.now() - timedelta(days=1)
    log = models.WorkoutLog(
        user_id=1,
        exercise_name="Bench Press",
        logged_at=yesterday,
        actual_weight_kg=80.0,
        actual_reps=8,
        set_number=1,
        difficulty_rating="moderate"
    )
    db_session.add(log)
    db_session.commit()

    # Next day after Push (index 0) should be Pull (index 1)
    index = workout.get_todays_focus_day_index(user_id=1, db=db_session, schedule=schedule)
    assert index == 1

def test_female_workout_recommendation_splits():
    # 3 days female
    rec_3d = workout.get_workout_recommendation(experience_months=4, days_per_week=3, gender="female")
    assert "Female" in rec_3d["split"]
    assert len(rec_3d["schedule"]) == 3
    # Check that glute / lower exercises are prioritized
    all_ex_names = [ex["exercise_name"] for day in rec_3d["schedule"] for ex in day["exercises"]]
    assert any("Hip Thrust" in name or "Squat" in name or "RDL" in name or "Glute" in name for name in all_ex_names)

    # 4 days female
    rec_4d = workout.get_workout_recommendation(experience_months=12, days_per_week=4, gender="female")
    assert "Female" in rec_4d["split"]
    assert len(rec_4d["schedule"]) == 4

    # 5 days female
    rec_5d = workout.get_workout_recommendation(experience_months=24, days_per_week=5, gender="female")
    assert "Female" in rec_5d["split"]
    assert len(rec_5d["schedule"]) == 5
