import sys
import json

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)
    except Exception:
        pass

with open("backend/scripts/eval_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

refusal_failures = []
script_art_failures = []

for run in data.get("runs", []):
    pass_num = run["pass_number"]
    for res in run["results"]:
        case_id = res.get("case_id")
        category = res.get("category")
        eval_checks = res.get("eval_checks", {})
        
        if "refusal" in eval_checks and not eval_checks["refusal"]["passed"]:
            refusal_failures.append({
                "case_id": case_id,
                "category": category,
                "pass_num": pass_num,
                "message": eval_checks["refusal"]["message"],
                "response": res.get("response")
            })
            
        if "script_artifacts" in eval_checks and not eval_checks["script_artifacts"]["passed"]:
            script_art_failures.append({
                "case_id": case_id,
                "category": category,
                "pass_num": pass_num,
                "message": eval_checks["script_artifacts"]["message"],
                "response": res.get("response")
            })

print(f"=== REFUSAL FAILURES ({len(refusal_failures)}) ===")
for idx, item in enumerate(refusal_failures, 1):
    print(f"\nFailure #{idx}: Case ID={item['case_id']} | Category={item['category']} | Pass={item['pass_num']}")
    print(f"Check Message: {item['message']}")
    print(f"Raw Response Text:\n{item['response']}")

print("\n" + "=" * 80 + "\n")

print(f"=== SCRIPT ARTIFACT FAILURES ({len(script_art_failures)}) ===")
for idx, item in enumerate(script_art_failures, 1):
    print(f"\nFailure #{idx}: Case ID={item['case_id']} | Category={item['category']} | Pass={item['pass_num']}")
    print(f"Check Message: {item['message']}")
    print(f"Raw Response Text:\n{item['response']}")
