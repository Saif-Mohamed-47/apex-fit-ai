# Apex Fit AI — Automated LLM Coach Evaluation Report

This document records the automated evaluation benchmark results across local LLM candidate models and summarizes cloud provider verification.

---

## Benchmark Results Table

The evaluation suite runs 17 standardized synthetic test cases over 3 passes (51 total executions, 87 evaluated criteria):

| Metric / Check | `qwen2.5:7b` ⭐ (Recommended) | `llama3:latest` * | `aya-expanse:8b` | `Gemini` (Cloud API) |
| :--- | :---: | :---: | :---: | :---: |
| **Headline Arabic Pass Rate (NO RETRY)** | **87.2%** (34/39) | **53.8%** (21/39) | **69.2%** (27/39) | *Smoke Test Only* |
| **Arabic Pass Rate (Post-Retry)** | **100.0%** (39/39) | 76.9% (30/39) | 76.9% (30/39) | *Smoke Test Only* |
| **Script Artifact Pass Rate (No CJK/Cyrillic)** | 93.1% (81/87) | 96.6% (84/87) | 89.7% (78/87) | *Smoke Test Only* |
| **Prompt Echo Rate** | **0.0%** (0/87) | 7.8% (7/87) | **0.0%** (0/87) | *Smoke Test Only* |
| **Refusal Breakdown (Pass / Fail / Review)** | PASS: 24, FAIL: 0, REV: 12 | PASS: 30, FAIL: 0, REV: 6 | PASS: 23, FAIL: 6, REV: 3 | *Smoke Test Only* |
| **Data Fidelity — Protein Target** | **100.0%** (18/18) | 83.3% (15/18) | **100.0%** (18/18) | *Smoke Test Only* |
| **Data Fidelity — Workout Split** | 94.4% (17/18) | 77.8% (14/18) | **100.0%** (18/18) | *Smoke Test Only* |
| **Squat Technique Accuracy** | **100.0%** (3/3) | 0.0% (0/3) | 66.7% (2/3) | *Smoke Test Only* |
| **Average Latency** | 10.23s | **3.85s** | 16.69s | ~2.44s (TTFT) |
| **P95 Latency** | 29.09s | **12.10s** | 30.28s | N/A |
| **Hardware Fit** | 4.7 GB (100% GPU) | 4.7 GB (100% GPU) | 6.6 GB (64% GPU) | N/A |

*\*Note: Figures for `llama3:latest` predate the canonical goal-fixture normalization fix (`fat_loss` $\rightarrow$ `lose_fat`).*

---

## Model Summaries & Recommendations

1. **`qwen2.5:7b` (Recommended Default)**:
   - Achieves 100% Arabic language pass post-retry (87.2% baseline), 100% protein fidelity, 94.4% split fidelity, 0% echo rate, 0 refusal fails, and 100% squat technique pass. Fits comfortably within 8GB VRAM (4.7 GB).

2. **`llama3:latest`**:
   - Fast inference (~3.85s avg), but struggles with Arabic language retention without retries (53.8% baseline) and squat technique accuracy.

3. **`aya-expanse:8b`**:
   - High fidelity (100% protein and split), but succumbed to prompt injection harm markers (6 failures) and higher latency (16.69s avg).

4. **`Google Gemini`**:
   - **Smoke Test Only**: Single-request smoke testing (`smoke_gemini.py`) passed with Time-To-First-Token (TTFT) of 2.44s. Multi-pass batch evaluation hit severe server-side rate limits (`429`) and capacity errors (`503`), making full batch evaluation inconclusive.
