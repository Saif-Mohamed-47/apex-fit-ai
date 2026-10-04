from sqlalchemy.orm import Session
from typing import Optional, List, Any
from . import models
from .ai.factory import get_llm_provider
from .ai.providers.base import BaseLLMProvider
from .ai.context_builder import build_coach_messages, build_system_instructions, build_user_context_block

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
        # Fallback if user/db objects are not provided explicitly
        prompt = system_prompt or "You are a fitness coach."
        messages = [{"role": "system", "content": prompt}]
        for msg in conversation_history:
            role = getattr(msg, "role", None) or (msg.get("role") if isinstance(msg, dict) else None)
            content = getattr(msg, "content", None) or (msg.get("content") if isinstance(msg, dict) else None)
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": str(content)})
        messages.append({"role": "user", "content": user_message})

    return await provider.generate_response(messages)
