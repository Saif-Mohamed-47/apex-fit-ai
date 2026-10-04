import pytest
from app.nutrition import calculate_tdee, calculate_macros

def test_calculate_tdee_male():
    # Mifflin-St Jeor: (10 * 80) + (6.25 * 180) - (5 * 25) + 5 = 800 + 1125 - 125 + 5 = 1805
    # Moderate activity (1.55): 1805 * 1.55 = 2797.75 -> round = 2798
    tdee = calculate_tdee(weight_kg=80, height_cm=180, age=25, gender="male", activity_level="moderate")
    assert tdee == 2798

def test_calculate_tdee_female():
    # Mifflin-St Jeor: (10 * 60) + (6.25 * 165) - (5 * 30) - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
    # Sedentary activity (1.2): 1320.25 * 1.2 = 1584.3 -> round = 1584
    tdee = calculate_tdee(weight_kg=60, height_cm=165, age=30, gender="female", activity_level="sedentary")
    assert tdee == 1584

def test_calculate_tdee_fallback_activity():
    # Unknown activity defaults to 1.2
    tdee_unknown = calculate_tdee(weight_kg=80, height_cm=180, age=25, gender="male", activity_level="unknown")
    tdee_sedentary = calculate_tdee(weight_kg=80, height_cm=180, age=25, gender="male", activity_level="sedentary")
    assert tdee_unknown == tdee_sedentary

def test_calculate_macros_lose_fat():
    # Weight: 80kg, TDEE ~2798
    # Target: TDEE - 500 = 2298
    # Protein: 2 * 80 = 160g (640 kcal)
    # Remaining: 2298 - 640 = 1658 kcal
    # Carbs: (1658 * 0.55) / 4 = 227.975 -> 228g
    # Fat: (1658 * 0.45) / 9 = 82.9 -> 83g
    macros = calculate_macros(weight_kg=80, age=25, height_cm=180, gender="male", activity_level="moderate", goal="lose_fat")
    assert macros["target_calories"] == 2298
    assert macros["protein_g"] == 160
    assert macros["carbs_g"] == 228
    assert macros["fat_g"] == 83

def test_calculate_macros_gain_muscle():
    # Weight: 70kg, TDEE calculation
    # Target: TDEE + 300
    # Protein: 2 * 70 = 140g
    macros = calculate_macros(weight_kg=70, age=22, height_cm=175, gender="male", activity_level="active", goal="gain_muscle")
    tdee = calculate_tdee(70, 175, 22, "male", "active")
    assert macros["target_calories"] == tdee + 300
    assert macros["protein_g"] == 140
    assert macros["carbs_g"] > 0
    assert macros["fat_g"] > 0

def test_calculate_macros_maintain():
    macros = calculate_macros(weight_kg=70, age=22, height_cm=175, gender="male", activity_level="moderate", goal="maintain")
    tdee = calculate_tdee(70, 175, 22, "male", "moderate")
    assert macros["target_calories"] == tdee
    assert macros["protein_g"] == round(1.8 * 70)

def test_calculate_macros_calorie_floor():
    # Very small female (40kg, 140cm, 60yr) with lose_fat goal
    # TDEE ~1000, TDEE - 500 would be 500 kcal, but floor is 1200 kcal
    macros = calculate_macros(weight_kg=40, age=60, height_cm=140, gender="female", activity_level="sedentary", goal="lose_fat")
    assert macros["target_calories"] >= 1200
