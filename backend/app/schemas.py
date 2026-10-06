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

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

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
        orm_mode = True

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
        orm_mode = True

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
