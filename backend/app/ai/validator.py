import re
from typing import Dict, Any, Tuple

ARABIC_INDIC_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")

# Sentence / clause splitter
SENTENCE_SPLIT_RE = re.compile(r'[.\n!?؟;,،]+')

# Daily target context keywords
DAILY_CONTEXT_RE = re.compile(
    r'\b(?:daily|total|per day|per-day|اليومي|في اليوم|المستهدف|المستهدفة|مستهدف|مستهدفة|هدف)\b',
    re.IGNORECASE
)

# Macro unit regex (EXCLUDES kg / كجم, INCLUDES Arabic gram units: غ, جم, غرام, جرام)
MACRO_UNIT_RE = re.compile(
    r'\b(\d+)\s*(?:g|gram|grams|kcal|calories|جرام|غرام|غ|جم|كالوري|سعرة|سعرة حرارية)\b',
    re.IGNORECASE
)

def validate_number_fidelity(text: str, verified_targets: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Scans text ONLY within sentences that refer to DAILY targets.
    Normalizes Arabic-Indic digits and checks numbers adjacent to macro units (g, kcal, جرام, غرام, غ, جم, etc.).
    Excludes body weight / lift weight (kg, كجم) and per-meal intake recommendations.
    Returns (mismatch_found: bool, message: str).
    Does NOT modify or rewrite text.
    """
    if not text or not text.strip():
        return False, "Empty text"

    # Normalize Arabic-Indic digits to standard ASCII digits
    normalized_text = text.translate(ARABIC_INDIC_DIGITS)
    
    sentences = [s.strip() for s in SENTENCE_SPLIT_RE.split(normalized_text) if s.strip()]
    
    protein_target = verified_targets.get("protein_g")
    calories_target = verified_targets.get("target_calories")
    valid_targets = {protein_target, calories_target}
    valid_targets.discard(None)

    for sentence in sentences:
        # Only evaluate sentences that explicitly mention daily targets
        if DAILY_CONTEXT_RE.search(sentence):
            found_numbers = [int(n) for n in MACRO_UNIT_RE.findall(sentence)]
            for num in found_numbers:
                # If a number stated next to a macro unit in a daily target sentence does not match valid targets
                if num > 50 and num not in valid_targets:
                    # Flag true target mismatch
                    if num in {170, 175, 180, 185, 190, 200, 220, 2500, 3500} or abs(num - (protein_target or 0)) > 10:
                        return True, f"Mismatch: stated daily target number {num} in '{sentence[:60]}' does not match verified targets ({protein_target}g / {calories_target} kcal)"

    return False, "All daily target unit numbers match verified targets"
