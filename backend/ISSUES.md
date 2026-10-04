# Known Issues and Architectural Audit Findings

This document tracks known flaws, edge cases, and design issues identified during code auditing of the Apex Fit AI backend core modules.

---

### ISSUE-002: Fixed Macro Percentages
- **Location**: `backend/app/nutrition.py` (`calculate_macros`)
- **Description**: Macro percentages for non-protein calories are hardcoded (`55%/45%` for fat loss, `65%/35%` for muscle gain, `60%/40%` for maintenance).
- **Impact**: Does not accommodate user dietary preferences (e.g. low-carb, ketogenic, high-fat, or custom macros set by a trainer).
- **Recommendation**: Allow optional `macro_split_preference` parameter on user profile with validated custom percentage overrides.

---

### ISSUE-003: Fragile String Replacement in Workout Volume Scaling
- **Location**: `backend/app/workout.py` (`get_workout_recommendation`)
- **Description**: In Tier 3 (Advanced), set volume is increased using string replacement: `ex["sets_reps"] = ex["sets_reps"].replace("3 sets", "4 sets")`.
- **Impact**: If exercise definitions in `exercises.py` use different formatting (e.g., `"3-4 sets"` or `"3x8-12"`), the replacement fails silently without updating the volume.
- **Recommendation**: Store `sets` and `reps` as structured integers/ranges in `exercises.py` schema (e.g., `{"sets": 3, "min_reps": 8, "max_reps": 12}`) instead of freeform formatted strings.

---

### ISSUE-004: Missing Target Rep Completion Validation in Progression
- **Location**: `backend/app/adaptive.py` (`get_adaptive_recommendation`)
- **Description**: Weight progression is triggered solely based on `difficulty_rating` string (`"easy"` / `"moderate"`). It does not verify whether `actual_reps >= target_reps`.
- **Impact**: If a user logs 2 reps out of a target 12 reps but rates it "moderate", the algorithm would still incorrectly recommend a weight increase.
- **Recommendation**: Validate `actual_reps >= target_reps` across all sets in a session before recommending progressive overload weight increases.

---

### ISSUE-005: Double Progression Model Proposal
- **Location**: `backend/app/adaptive.py`
- **Description**: The progressive overload engine currently increments weight immediately after a single session marked "easy" or "moderate".
- **Impact**: Can lead to premature weight jumps before mastering a weight across multiple sessions.
- **Recommendation**: Implement a formal Double Progression Model:
  1. Hold weight constant until the user achieves the upper bound of the target rep range across all sets for 2 consecutive workouts.
  2. Increase weight by relative percentage (`2.5%–5%`), rounded to standard equipment increments (`1.0kg` for isolation, `2.5kg` for compound).
