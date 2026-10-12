from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="client")  # "client" or "coach"
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    invite_code = Column(String, unique=True, nullable=True, index=True)
    age = Column(Integer)
    weight_kg = Column(Float)
    height_cm = Column(Float)
    gender = Column(String)
    goal = Column(String)
    activity_level = Column(String)
    training_experience_months = Column(Integer)
    days_per_week = Column(Integer)

    # Contact & Profile Info
    full_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)

    # Optional Coach Macro Overrides
    custom_calories = Column(Integer, nullable=True)
    custom_protein_g = Column(Float, nullable=True)
    custom_carbs_g = Column(Float, nullable=True)
    custom_fat_g = Column(Float, nullable=True)

    # Subscription & 24h AI Rate Limit Quota
    subscription_tier = Column(String, default="free")  # "free", "pro", "vip_coach"
    ai_messages_today = Column(Integer, default=0)
    last_ai_message_date = Column(Date, nullable=True)

    # Coach Specific Fields & Client Tracking
    is_coach_active = Column(Boolean, default=False)
    coach_bio = Column(String, nullable=True)
    coach_avatar_url = Column(String, nullable=True)
    coach_rating = Column(Float, default=4.9)
    coach_rating_count = Column(Integer, default=18)
    coach_joined_date = Column(Date, nullable=True)
    subscription_expires_at = Column(Date, nullable=True)

    meals = relationship("Meal", back_populates="user")
    workout_logs = relationship("WorkoutLog", back_populates="user")
    check_ins = relationship("CheckIn", foreign_keys="[CheckIn.user_id]", back_populates="user")

class Meal(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    calories = Column(Integer)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fat_g = Column(Float)
    date = Column(Date)
    user = relationship("User", back_populates="meals")

class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_name = Column(String, index=True)
    logged_at = Column(DateTime, default=func.now())
    target_weight_kg = Column(Float, nullable=True)
    target_reps = Column(Integer, nullable=True)
    actual_weight_kg = Column(Float)
    actual_reps = Column(Integer)
    set_number = Column(Integer)
    difficulty_rating = Column(String)
    user = relationship("User", back_populates="workout_logs")

class CheckIn(Base):
    __tablename__ = "check_ins"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    logged_at = Column(DateTime, default=func.now())
    weight_kg = Column(Float)
    sleep_hours = Column(Float, nullable=True)
    energy_rating = Column(Integer, nullable=True)  # 1-5 scale
    soreness_rating = Column(Integer, nullable=True)  # 1-5 scale
    client_notes = Column(String, nullable=True)
    coach_feedback = Column(String, nullable=True)

    user = relationship("User", foreign_keys=[user_id], back_populates="check_ins")

