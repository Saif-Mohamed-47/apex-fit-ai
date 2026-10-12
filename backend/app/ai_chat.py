import json
import logging
import asyncio
from sqlalchemy.orm import Session
from typing import Optional, List, Any, AsyncGenerator
from . import models, nutrition, workout
from .ai.factory import get_llm_provider
from .ai.providers.base import BaseLLMProvider
from .ai.context_builder import build_coach_messages, build_system_instructions, build_user_context_block
from .ai.validator import validate_number_fidelity

logger = logging.getLogger(__name__)

def build_system_prompt(user: models.User, db: Session) -> str:
    """Legacy helper maintained for backwards compatibility."""
    instructions = build_system_instructions(language="en")
    user_context = build_user_context_block(user, db)
    return f"{instructions}\n\n{user_context}"

async def chat_with_coach(
    user_message: str, 
    conversation_history: List[Any], 
    system_prompt: Optional[str] = None,
    provider: Optional[BaseLLMProvider] = None,
    user: Optional[models.User] = None,
    db: Optional[Session] = None
) -> str:
    if provider is None:
        provider = get_llm_provider()

    if user is not None and db is not None:
        messages = build_coach_messages(
            user=user,
            db=db,
            user_message=user_message,
            raw_history=conversation_history
        )
    else:
        prompt = system_prompt or "You are a fitness coach."
        messages = [{"role": "system", "content": prompt}]
        for msg in conversation_history:
            role = getattr(msg, "role", None) or (msg.get("role") if isinstance(msg, dict) else None)
            content = getattr(msg, "content", None) or (msg.get("content") if isinstance(msg, dict) else None)
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": str(content)})
        messages.append({"role": "user", "content": user_message})

    return await provider.generate_response(messages)

async def stream_chat_with_coach(
    user_message: str,
    conversation_history: List[Any],
    user: models.User,
    db: Session,
    provider: Optional[BaseLLMProvider] = None
) -> AsyncGenerator[str, None]:
    """
    Streams AI coach response over SSE:
    1. Emits 'targets' event first with verified macros & split.
    2. Streams 'chunk' events with text tokens directly.
    3. Evaluates number validator at end and emits 'flag' event (flag only, no rewrite).
    4. Handles client disconnects gracefully.
    """
    if provider is None:
        provider = get_llm_provider()

    # 1. Calculate verified targets deterministically
    calc_goal = "gain_muscle" if "USER_CONTEXT" in user.goal else user.goal
    macros = nutrition.calculate_macros(
        user.weight_kg, user.age, user.height_cm, user.gender, user.activity_level, calc_goal
    )
    rec = workout.get_workout_recommendation(
        user.training_experience_months, 
        user.days_per_week, 
        getattr(user, "gender", "male")
    )

    verified_targets = {
        "protein_g": macros["protein_g"],
        "target_calories": macros["target_calories"],
        "carbs_g": macros["carbs_g"],
        "fat_g": macros["fat_g"],
        "workout_split": rec["split"]
    }

    try:
        # Event 1: Verified Targets FIRST
        targets_payload = json.dumps({"event": "targets", "data": verified_targets}, ensure_ascii=False)
        yield f"data: {targets_payload}\n\n"

        # Construct LLM message array
        messages = build_coach_messages(
            user=user,
            db=db,
            user_message=user_message,
            raw_history=conversation_history
        )

        accumulated_text = ""

        # Stream tokens
        async for chunk in provider.stream_response(messages):
            accumulated_text += chunk
            chunk_payload = json.dumps({"event": "chunk", "content": chunk}, ensure_ascii=False)
            yield f"data: {chunk_payload}\n\n"

        # Final Event: Flag mismatches if unit-adjacent numbers differ from verified targets
        mismatch, msg = validate_number_fidelity(accumulated_text, verified_targets)
        flag_payload = json.dumps({"event": "flag", "mismatch": mismatch, "message": msg}, ensure_ascii=False)
        yield f"data: {flag_payload}\n\n"

    except (asyncio.CancelledError, GeneratorExit):
        logger.info("Client disconnected from SSE chat stream gracefully.")
        return
    except Exception as e:
        logger.error("Error during SSE chat streaming: %s", e)
        err_payload = json.dumps({"event": "error", "message": "An error occurred while streaming coach response."}, ensure_ascii=False)
        yield f"data: {err_payload}\n\n"
