import copy
from .data.exercises import EXERCISES
from . import models
from sqlalchemy.orm import Session
from datetime import date

def get_workout_recommendation(experience_months: int, days_per_week: int, gender: str = "male"):
    clean_gender = str(gender).lower().strip() if gender else "male"

    # Female Specific Workout Splits (Glute, Hamstring & Sculpting Focus)
    if clean_gender == "female":
        if days_per_week < 3:
            return {
                "split": "Female Full Body Sculpt",
                "schedule": [
                    {"day": "Full Body Sculpt & Glute Activation", "exercises": copy.deepcopy(EXERCISES["female_full_body"])}
                ]
            }
        elif days_per_week == 3:
            return {
                "split": "Female Glute & Sculpt 3-Day Split",
                "schedule": [
                    {"day": "Glute & Hamstring Focus", "exercises": copy.deepcopy(EXERCISES["female_glutes_lower"])},
                    {"day": "Upper Body & Core Sculpt", "exercises": copy.deepcopy(EXERCISES["female_upper_tone"])},
                    {"day": "Glute & Quad Shaping", "exercises": copy.deepcopy(EXERCISES["female_lower_quads"])}
                ]
            }
        elif days_per_week == 4:
            return {
                "split": "Glutes, Lower & Upper Tone (Female Focus)",
                "schedule": [
                    {"day": "Glute & Hamstring Focus", "exercises": copy.deepcopy(EXERCISES["female_glutes_lower"])},
                    {"day": "Upper Body & Core Sculpt", "exercises": copy.deepcopy(EXERCISES["female_upper_tone"])},
                    {"day": "Glute & Quad Shaping", "exercises": copy.deepcopy(EXERCISES["female_lower_quads"])},
                    {"day": "Full Body Athletic Tone", "exercises": copy.deepcopy(EXERCISES["female_full_body"])}
                ]
            }
        else:
            return {
                "split": "Glute Hypertrophy & Sculpt Split (Female 5-Day)",
                "schedule": [
                    {"day": "Glute & Hamstring Heavy", "exercises": copy.deepcopy(EXERCISES["female_glutes_lower"])},
                    {"day": "Upper Body & Posture", "exercises": copy.deepcopy(EXERCISES["female_upper_tone"])},
                    {"day": "Glute & Quad Focus", "exercises": copy.deepcopy(EXERCISES["female_lower_quads"])},
                    {"day": "Upper Tone & Core", "exercises": copy.deepcopy(EXERCISES["female_upper_tone"])},
                    {"day": "Glute Activation & Full Body Tone", "exercises": copy.deepcopy(EXERCISES["female_full_body"])}
                ]
            }

    # Male / Standard Workout Splits
    # Tier 1: Beginner (0-6 months) -> Full Body, 3 days
    if experience_months <= 6:
        return {
            "split": "Full Body",
            "schedule": [{"day": "Full Body", "exercises": copy.deepcopy(EXERCISES["full_body"])}]
        }
    
    # Tier 2: Intermediate (6-18 months)
    elif experience_months <= 18:
        if days_per_week < 4:
            return {
                "split": "Full Body",
                "schedule": [{"day": "Full Body", "exercises": copy.deepcopy(EXERCISES["full_body"])}]
            }
        else:
            return {
                "split": "Push/Pull/Legs (Intermediate)",
                "schedule": [
                    {"day": "Push (Chest/Shoulders/Triceps)", "exercises": copy.deepcopy(EXERCISES["push"])},
                    {"day": "Pull (Back/Rear Delts/Biceps)", "exercises": copy.deepcopy(EXERCISES["pull"])},
                    {"day": "Legs & Core", "exercises": copy.deepcopy(EXERCISES["legs"])}
                ]
            }
            
    # Tier 3: Advanced (18-36 months) -> PPL, 4-6 days, higher volume
    elif experience_months <= 36:
        ppl_schedule = [
            {"day": "Push (Chest/Shoulders/Triceps)", "exercises": copy.deepcopy(EXERCISES["push"])},
            {"day": "Pull (Back/Rear Delts/Biceps)", "exercises": copy.deepcopy(EXERCISES["pull"])},
            {"day": "Legs & Core", "exercises": copy.deepcopy(EXERCISES["legs"])}
        ]
        # Increase volume by adding one set to each exercise (4 sets)
        for day in ppl_schedule:
            for ex in day["exercises"]:
                ex["sets_reps"] = ex["sets_reps"].replace("3 sets", "4 sets")
        
        return {
            "split": "Push/Pull/Legs (Advanced)",
            "schedule": ppl_schedule
        }
        
    # Tier 4: Pro/Elite (36+ months)
    else:
        if days_per_week >= 6:
            arnold_chest_back = copy.deepcopy(EXERCISES["push"][:3] + EXERCISES["pull"][:3])
            arnold_shoulders_arms = copy.deepcopy([EXERCISES["push"][3], EXERCISES["push"][4], EXERCISES["pull"][3]] + EXERCISES["pull"][4:] + EXERCISES["push"][5:])
            arnold_legs = copy.deepcopy(EXERCISES["legs"])
            return {
                "split": "Arnold Split (Pro)",
                "schedule": [
                    {"day": "Chest & Back (Antagonist Focus)", "exercises": arnold_chest_back},
                    {"day": "Shoulders & Arms (Arnold Press Focus)", "exercises": arnold_shoulders_arms},
                    {"day": "Legs & Core", "exercises": arnold_legs}
                ]
            }
        else:
            ppl_schedule = [
                {"day": "Push (Chest/Shoulders/Triceps)", "exercises": copy.deepcopy(EXERCISES["push"])},
                {"day": "Pull (Back/Rear Delts/Biceps)", "exercises": copy.deepcopy(EXERCISES["pull"])},
                {"day": "Legs & Core", "exercises": copy.deepcopy(EXERCISES["legs"])}
            ]
            for day in ppl_schedule:
                for ex in day["exercises"]:
                    ex["sets_reps"] = ex["sets_reps"].replace("3 sets", "4 sets")
            return {
                "split": "Push/Pull/Legs (Advanced)",
                "schedule": ppl_schedule
            }

def get_todays_focus_day_index(user_id: int, db: Session, schedule: list):
    # Get the most recent log
    last_log = db.query(models.WorkoutLog).filter(
        models.WorkoutLog.user_id == user_id
    ).order_by(models.WorkoutLog.logged_at.desc()).first()

    if not last_log:
        return 0

    # Try to find the day index of the last logged exercise
    last_day_index = -1
    for i, day in enumerate(schedule):
        if any(ex['exercise_name'] == last_log.exercise_name for ex in day['exercises']):
            last_day_index = i
            break
            
    # If exercise not found in current schedule (e.g., split change), fallback to 0
    if last_day_index == -1:
        return 0

    # If logged today, show that day
    if last_log.logged_at.date() == date.today():
        return last_day_index
        
    # If logged yesterday or earlier, show next day (or 0 if last was last)
    return (last_day_index + 1) % len(schedule)
