import sys
import json
import re
from typing import Tuple

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

def check_prompt_echo(prompt: str, response: str) -> Tuple[bool, str]:
    """
    Fails when response is mostly the user message (or starts with it without coaching content).
    Returns (is_echo: bool, reason: str).
    """
    if not response or not response.strip():
        return False, "Empty response (infra issue)"
        
    p_clean = prompt.strip().lower()
    r_clean = response.strip().lower()
    
    # Strip optional prefix role tokens if present
    for prefix in ["assistant", ".scalablytypedassistant", "system"]:
        if r_clean.startswith(prefix):
            r_clean = r_clean[len(prefix):].strip()

    if not r_clean:
        return False, "Empty after token strip"

    # Exact echo
    if r_clean == p_clean:
        return True, "FAIL (Exact echo of user prompt)"

    # Starts with prompt and length is less than 1.4x prompt length
    if r_clean.startswith(p_clean) and len(r_clean) < len(p_clean) * 1.4:
        return True, "FAIL (Response starts with user prompt without adding coaching text)"

    # High substring overlap
    if len(p_clean) > 10 and p_clean in r_clean and len(r_clean) < len(p_clean) * 1.3:
        return True, "FAIL (Prompt contains >80% user prompt echo)"

    return False, "PASS (No prompt echo detected)"

def run_echo_analysis(filename="backend/scripts/eval_results_llama3_latest.json"):
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)

    total_evaluated_responses = 0
    echo_count = 0
    echo_details = []

    for run in data.get("runs", []):
        pass_num = run["pass_number"]
        for res in run["results"]:
            case_id = res.get("case_id")
            category = res.get("category")
            prompt = res.get("prompt")
            resp = res.get("final_response") or res.get("response", "")

            # Ignore infra error timeouts
            if "taking too long to respond" in resp or not resp.strip():
                continue

            total_evaluated_responses += 1
            is_echo, reason = check_prompt_echo(prompt, resp)

            if is_echo:
                echo_count += 1
                echo_details.append({
                    "case_id": case_id,
                    "category": category,
                    "pass_num": pass_num,
                    "prompt": prompt,
                    "response": resp,
                    "reason": reason
                })

    echo_rate = (echo_count / total_evaluated_responses * 100) if total_evaluated_responses > 0 else 0.0

    print("=" * 80)
    print(f"PROMPT ECHO & LEAKAGE RE-GRADE FOR {filename}")
    print("=" * 80)
    print(f"Total Valid Evaluated Responses: {total_evaluated_responses}")
    print(f"Total Prompt Echoes Detected   : {echo_count}")
    print(f"Real Prompt Echo Rate          : {echo_rate:.1f}%")
    print("-" * 60)

    if echo_details:
        print("\n--- DETECTED PROMPT ECHOES ---")
        for idx, item in enumerate(echo_details, 1):
            print(f"#{idx} Case: {item['case_id']} | Category: {item['category']} | Pass: {item['pass_num']}")
            print(f"  Prompt  : {item['prompt']}")
            print(f"  Response: {item['response']}")
            print(f"  Reason  : {item['reason']}\n")

if __name__ == "__main__":
    run_echo_analysis()
