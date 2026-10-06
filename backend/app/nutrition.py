import logging

logger = logging.getLogger(__name__)

def calculate_tdee(weight_kg, height_cm, age, gender, activity_level):
    # Mifflin-St Jeor
    if gender.lower() == 'male':
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161
    
    # Activity Multipliers
    multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'extreme': 1.9
    }
    
    tdee = bmr * multipliers.get(activity_level.lower(), 1.2)
    return round(tdee)

def calculate_macros(weight_kg, age, height_cm, gender, activity_level, goal):
    tdee = calculate_tdee(weight_kg, height_cm, age, gender, activity_level)
    
    clean_goal = str(goal).lower().strip() if goal else ""

    if clean_goal == "lose_fat":
        target_calories = max(1200, tdee - 500) # Floor at 1200
        protein_g = 2.0 * weight_kg
        carbs_pct = 0.55
        fat_pct = 0.45
    elif clean_goal == "gain_muscle":
        target_calories = tdee + 300
        protein_g = 2.0 * weight_kg
        carbs_pct = 0.65
        fat_pct = 0.35
    elif clean_goal == "maintain":
        target_calories = tdee
        protein_g = 1.8 * weight_kg
        carbs_pct = 0.60
        fat_pct = 0.40
    else:
        raise ValueError(f"Unknown goal '{goal}'. Goal must be one of: 'lose_fat', 'gain_muscle', 'maintain'.")

    
    # Calculate protein calories and minimum fat floor (20% of target calories)
    protein_calories = protein_g * 4
    min_fat_calories = 0.20 * target_calories
    
    if (target_calories - protein_calories) < min_fat_calories:
        logger.warning(
            "Protein target (%sg = %s kcal) leaves less than 20%% for essential fats in %s kcal target. Adjusting protein.",
            round(protein_g, 1), round(protein_calories, 1), target_calories
        )
        fat_calories = min_fat_calories
        fat_g = fat_calories / 9.0
        protein_calories = target_calories - fat_calories
        protein_g = protein_calories / 4.0
        carbs_g = 0.0
    else:
        remaining_calories = target_calories - protein_calories
        carbs_g = (remaining_calories * carbs_pct) / 4.0
        fat_g = (remaining_calories * fat_pct) / 9.0
    
    return {
        "protein_g": round(protein_g),
        "carbs_g": round(carbs_g),
        "fat_g": round(fat_g),
        "target_calories": round(target_calories)
    }
