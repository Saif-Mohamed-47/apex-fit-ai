from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from enum import Enum

class DifficultyRating(str, Enum):
    EASY = "easy"
    MODERATE = "moderate"
    HARD = "hard"
    FAILED = "failed"

class GoalEnum(str, Enum):
    LOSE_FAT = "lose_fat"
    GAIN_MUSCLE = "gain_muscle"
    MAINTAIN = "maintain"

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    email: str
    age: int
    weight_kg: float
    height_cm: float
    gender: str
    goal: GoalEnum
    activity_level: str
    training_experience_months: int
    days_per_week: int
    role: Optional[str] = "client"
    invite_code: Optional[str] = None
    coach_id: Optional[int] = None

class UserCreate(UserBase):
    password: str
    coach_invite_code: Optional[str] = None

class User(UserBase):
    id: int
    custom_calories: Optional[int] = None
    custom_protein_g: Optional[float] = None
    custom_carbs_g: Optional[float] = None
    custom_fat_g: Optional[float] = None
    subscription_tier: Optional[str] = "free"
    ai_messages_today: Optional[int] = 0
    ai_daily_limit: Optional[int] = 5

    class Config:
        from_attributes = True

class MacroOverrideRequest(BaseModel):
    custom_calories: int
    custom_protein_g: float
    custom_carbs_g: float
    custom_fat_g: float

class CheckInCreate(BaseModel):
    weight_kg: float
    sleep_hours: Optional[float] = None
    energy_rating: Optional[int] = None
    soreness_rating: Optional[int] = None
    client_notes: Optional[str] = None

class CheckIn(CheckInCreate):
    id: int
    user_id: int
    coach_id: Optional[int] = None
    logged_at: datetime
    coach_feedback: Optional[str] = None

    class Config:
        from_attributes = True

class ClientSummary(BaseModel):
    id: int
    email: str
    goal: str
    weight_kg: float
    last_log_date: Optional[str] = None
    has_custom_macros: bool = False
    gender: Optional[str] = "male"

class Login(BaseModel):
    email: str
    password: str

class MealBase(BaseModel):
    name: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float

class MealCreate(MealBase):
    date: date

class Meal(MealBase):
    id: int
    user_id: int
    date: date

    class Config:
        from_attributes = True

class WorkoutLogBase(BaseModel):
    exercise_name: str
    target_weight_kg: Optional[float] = None
    target_reps: Optional[int] = None
    actual_weight_kg: float
    actual_reps: int
    set_number: int
    difficulty_rating: DifficultyRating

class WorkoutLogCreate(WorkoutLogBase):
    pass

class WorkoutLog(WorkoutLogBase):
    id: int
    user_id: int
    logged_at: datetime

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class CheckoutRequest(BaseModel):
    plan_id: str  # 'pro' or 'vip_coach'
    payment_method: str  # 'vodafone_cash' or 'card'
    sender_phone: Optional[str] = None
    transfer_ref: Optional[str] = None
    card_number: Optional[str] = None
    card_expiry: Optional[str] = None


