import pytest
from pydantic import ValidationError
from app.nutrition import calculate_macros
from app.schemas import UserCreate

def test_calculate_macros_lose_fat_branch():
    res = calculate_macros(80.0, 25, 180.0, "male", "moderate", "lose_fat")
    # 2.0 * 80 = 160g protein
    assert res["protein_g"] == 160

def test_calculate_macros_gain_muscle_branch():
    res = calculate_macros(80.0, 25, 180.0, "male", "moderate", "gain_muscle")
    # 2.0 * 80 = 160g protein
    assert res["protein_g"] == 160

def test_calculate_macros_maintain_branch():
    res = calculate_macros(80.0, 25, 180.0, "male", "moderate", "maintain")
    # 1.8 * 80 = 144g protein
    assert res["protein_g"] == 144

def test_calculate_macros_unknown_goal_raises():
    with pytest.raises(ValueError, match="Unknown goal"):
        calculate_macros(80.0, 25, 180.0, "male", "moderate", "become_superman")

def test_schema_rejects_invalid_goal():
    invalid_user_payload = {
        "email": "invalid_goal@test.com",
        "password": "Password123!",
        "age": 25,
        "weight_kg": 75.0,
        "height_cm": 175.0,
        "gender": "male",
        "goal": "invalid_goal_xyz",
        "activity_level": "moderate",
        "training_experience_months": 12,
        "days_per_week": 4
    }
    with pytest.raises(ValidationError):
        UserCreate(**invalid_user_payload)
