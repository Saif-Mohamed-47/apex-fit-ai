from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models
from .data.exercises import EXERCISES
# ISSUE-001: Adaptive Overload Increment Tuning
# Fixed +2.5kg increment for all exercises causes excessive jumps (+25%+) on small isolation movements
# (e.g. Lateral Raises, Bicep Curls). Isolation lifts use micro-increments (1.0kg), while compound lifts use 2.5kg.
ISOLATION_EXERCISES = {
    "Lateral Raises",
    "Bicep Curls",
    "Triceps Pushdowns",
    "Calf Raises",
    "Rear Delt Fly",
    "Hammer Curls",
}

def get_weight_increment(exercise_name: str, current_weight_kg: float) -> float:
    """Returns progressive overload weight increment in kg based on exercise type."""
    if exercise_name in ISOLATION_EXERCISES:
        return 1.0
    return 2.5

def get_adaptive_recommendation(user_id: int, exercise_name: str, db: Session) -> Dict[str, Any]:

    # 1. Find the most recent session date
    latest_log = (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == user_id)
        .filter(models.WorkoutLog.exercise_name == exercise_name)
        .order_by(models.WorkoutLog.logged_at.desc())
        .first()
    )

    # 2. No history case
    if not latest_log:
        # Find starting note from exercises.py
        note = None
        for category in EXERCISES.values():
            for ex in category:
                if ex["exercise_name"] == exercise_name:
                    note = ex.get("starting_weight_note")
                    break
            if note: break
        
        return {
            "recommended_weight_kg": None,
            "reasoning": note or "Start light and focus on form.",
            "has_history": False
        }

    # 3. Query all logs for that specific session date
    latest_date = latest_log.logged_at.date()
    logs = (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == user_id)
        .filter(models.WorkoutLog.exercise_name == exercise_name)
        .filter(func.date(models.WorkoutLog.logged_at) == latest_date)
        .order_by(models.WorkoutLog.logged_at.asc(), models.WorkoutLog.set_number.asc())
        .all()
    )


    # Use the weight from the last set of the session
    latest_weight = logs[-1].actual_weight_kg
    
    # Analyze session difficulties
    difficulties = [log.difficulty_rating for log in logs]
    
    if "failed" in difficulties:
        new_weight = max(0, latest_weight * 0.9)
        return {
            "recommended_weight_kg": round(new_weight, 2),
            "reasoning": "Some sets failed, reducing weight by 10% to prioritize form.",
            "has_history": True
        }
    
    if "hard" in difficulties:
        return {
            "recommended_weight_kg": latest_weight,
            "reasoning": "You found the last session hard. Sticking with same weight to solidify.",
            "has_history": True
        }
    
    # Otherwise easy/moderate
    if latest_weight > 0:
        increment = get_weight_increment(exercise_name, latest_weight)
        new_weight = latest_weight + increment
        return {
            "recommended_weight_kg": round(new_weight, 2),
            "reasoning": f"You crushed the last session! Increasing weight by {increment}kg.",
            "has_history": True
        }
    else:
        return {
            "recommended_weight_kg": 0,
            "reasoning": "Bodyweight exercise. Focus on adding more reps this session.",
            "has_history": True
        }

