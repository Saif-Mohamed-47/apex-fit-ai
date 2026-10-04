from sqlalchemy.orm import Session
from . import models, workout, nutrition
from .ai.factory import get_llm_provider
from .ai.providers.base import BaseLLMProvider
from datetime import date
from typing import Optional, List, Any

def build_system_prompt(user: models.User, db: Session) -> str:
    # 1. Get recommendation
    rec = workout.get_workout_recommendation(user.training_experience_months, user.days_per_week)
    split = rec.get("split", "N/A")
    schedule = rec.get("schedule", [])
    
    # Format schedule to be concise for the prompt
    schedule_str = "; ".join([f"{day['day']}: {', '.join([ex['exercise_name'] for ex in day['exercises']])}" for day in schedule])
    
    # 2. Get nutrition targets
    targets = nutrition.calculate_macros(
        user.weight_kg, user.age, user.height_cm, user.gender, user.activity_level, user.goal
    )
    
    # 3. Get logged meals for today
    today = date.today()
    total_calories = sum(meal.calories for meal in db.query(models.Meal).filter(
        models.Meal.user_id == user.id,
        models.Meal.date == today
    ).all())
    
    prompt = (
        f"You are a knowledgeable, encouraging fitness and nutrition coach. "
        f"User Profile: goal={user.goal}, experience={user.training_experience_months} months. "
        f"Current Workout Split: {split}. "
        f"Weekly Schedule: {schedule_str}. "
        f"Daily Nutrition Targets: {targets['target_calories']} kcal ({targets['protein_g']}g P, {targets['carbs_g']}g C, {targets['fat_g']}g F). "
        f"Logged Today: {total_calories} kcal. "
        f"Instructions: Answer specifically what the user asks. If they ask about workouts, focus on workouts; only mention nutrition if relevant to the question. Stay on topic. Keep responses concise (3-5 sentences). Never give medical diagnoses."
    )
    return prompt

async def chat_with_coach(
    user_message: str, 
    conversation_history: List[Any], 
    system_prompt: str,
    provider: Optional[BaseLLMProvider] = None
) -> str:
    if provider is None:
        provider = get_llm_provider()
        
    messages = [{"role": "system", "content": system_prompt}]
    for msg in conversation_history:
        role = getattr(msg, "role", None) or (msg.get("role") if isinstance(msg, dict) else "user")
        content = getattr(msg, "content", None) or (msg.get("content") if isinstance(msg, dict) else str(msg))
        messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": user_message})
    
    return await provider.generate_response(messages)
