import os
import re
from typing import List, Dict, Any, Optional
from datetime import date
from sqlalchemy.orm import Session
from .. import models, workout, nutrition, adaptive

ARABIC_RE = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')

def detect_language(text: str) -> str:
    """Returns 'ar' if Arabic character ratio is >= 0.20, otherwise 'en'."""
    if not text:
        return "en"
    cleaned = text.strip()
    if not cleaned:
        return "en"
    arabic_count = len(ARABIC_RE.findall(cleaned))
    ratio = arabic_count / len(cleaned)
    return "ar" if ratio >= 0.20 else "en"

def estimate_weighted_chars(text: str) -> float:
    """Estimates weighted character count (Arabic characters weighted 2.5x due to token density)."""
    if not text:
        return 0.0
    arabic_count = len(ARABIC_RE.findall(text))
    non_arabic_count = len(text) - arabic_count
    return (non_arabic_count * 1.0) + (arabic_count * 2.5)

def build_system_instructions(language: str = "en") -> str:
    """Returns core system instructions with safety guardrails and medical referral rules."""
    base_instructions = (
        "You are an expert, encouraging AI fitness and sports nutrition coach for Apex Fit AI.\n"
        "SCOPE & BOUNDARIES:\n"
        "- Assist strictly with workout routines, exercise technique, sports nutrition, macro/calorie targets, and fitness progress.\n"
        "- Politely decline and refuse to answer non-fitness, medical, political, or out-of-scope questions.\n"
        "SAFETY & MEDICAL REFERRAL RULE:\n"
        "- NEVER diagnose medical conditions, prescribe medical treatment, or advise on pain/injuries.\n"
        "- If the user mentions pain, injury, joint problems, medical conditions, or prescription drugs, you MUST immediately advise them to consult a qualified physician or doctor before proceeding.\n"
        "RESPONSE STYLE:\n"
        "- Keep responses concise, direct, and practical (3-5 sentences unless detailed workout steps are requested).\n"
        "- Base your advice strictly on the user profile data provided in the <USER_CONTEXT> block."
    )
    
    if language == "ar":
        language_rule = (
            "\nLANGUAGE REQUIREMENT:\n"
            "- The user is communicating in Arabic. You MUST respond in fluent, natural, encouraging Arabic using standard fitness and nutrition terminology."
        )
    else:
        language_rule = (
            "\nLANGUAGE REQUIREMENT:\n"
            "- Respond in English using clear, motivating, professional language."
        )
        
    return base_instructions + language_rule

def build_user_context_block(user: models.User, db: Session) -> str:
    """Builds a clearly delimited <USER_CONTEXT> block containing user metrics, targets, meals, and performance logs."""
    rec = workout.get_workout_recommendation(user.training_experience_months, user.days_per_week)
    split = rec.get("split", "N/A")
    schedule = rec.get("schedule", [])
    schedule_str = "; ".join([f"{day['day']}: {', '.join([ex['exercise_name'] for ex in day['exercises']])}" for day in schedule])
    
    targets = nutrition.calculate_macros(
        user.weight_kg, user.age, user.height_cm, user.gender, user.activity_level, user.goal
    )
    
    today = date.today()
    today_meals = db.query(models.Meal).filter(
        models.Meal.user_id == user.id,
        models.Meal.date == today
    ).all()
    logged_calories = sum(m.calories for m in today_meals)
    
    recent_logs = (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == user.id)
        .order_by(models.WorkoutLog.logged_at.desc())
        .limit(5)
        .all()
    )
    
    if recent_logs:
        logs_str = "; ".join([
            f"{l.exercise_name}: {l.actual_weight_kg}kg x {l.actual_reps} reps ({l.difficulty_rating.value if hasattr(l.difficulty_rating, 'value') else l.difficulty_rating})"
            for l in reversed(recent_logs)
        ])
    else:
        logs_str = "No recent workout logs recorded."

    context_str = (
        "<USER_CONTEXT>\n"
        f"User Profile: goal={user.goal}, gender={user.gender}, age={user.age}, weight={user.weight_kg}kg, height={user.height_cm}cm, experience={user.training_experience_months} months.\n"
        f"Workout Split: {split}\n"
        f"Weekly Schedule: {schedule_str}\n"
        f"Daily Nutrition Targets: {targets['target_calories']} kcal ({targets['protein_g']}g Protein, {targets['carbs_g']}g Carbs, {targets['fat_g']}g Fat)\n"
        f"Logged Today: {logged_calories} kcal across {len(today_meals)} meals\n"
        f"Recent Performance Logs: {logs_str}\n"
        "</USER_CONTEXT>"
    )
    return context_str

def trim_history_sliding_window(
    history: List[Any], 
    max_budget_chars: float = 4000.0
) -> List[Dict[str, str]]:
    """
    Trims conversation history using a sliding window.
    - IGNORES any history message whose role is NOT 'user' or 'assistant'.
    - Keeps as many recent valid messages as fit within max_budget_chars.
    """
    valid_messages: List[Dict[str, str]] = []
    
    for msg in history:
        role = getattr(msg, "role", None) or (msg.get("role") if isinstance(msg, dict) else None)
        content = getattr(msg, "content", None) or (msg.get("content") if isinstance(msg, dict) else None)
        
        if role in ("user", "assistant") and content:
            valid_messages.append({"role": role, "content": str(content)})

    trimmed: List[Dict[str, str]] = []
    accumulated_chars = 0.0

    for msg in reversed(valid_messages):
        msg_cost = estimate_weighted_chars(msg["content"])
        if accumulated_chars + msg_cost <= max_budget_chars:
            trimmed.append(msg)
            accumulated_chars += msg_cost
        else:
            break

    trimmed.reverse()
    return trimmed

def build_coach_messages(
    user: models.User,
    db: Session,
    user_message: str,
    raw_history: List[Any],
    max_budget_chars: Optional[float] = None
) -> List[Dict[str, str]]:
    """Constructs the complete formatted message array for the LLM provider."""
    if max_budget_chars is None:
        max_budget_chars = float(os.getenv("MAX_CONTEXT_CHARS", "4000"))
        
    language = detect_language(user_message)
    system_instructions = build_system_instructions(language=language)
    user_context = build_user_context_block(user, db)
    
    combined_system_prompt = f"{system_instructions}\n\n{user_context}"
    
    trimmed_history = trim_history_sliding_window(raw_history, max_budget_chars=max_budget_chars)
    
    messages = [{"role": "system", "content": combined_system_prompt}]
    messages.extend(trimmed_history)
    messages.append({"role": "user", "content": user_message})
    
    return messages
