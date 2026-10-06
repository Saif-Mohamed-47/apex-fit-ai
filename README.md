# Apex Fit AI

Apex Fit AI is an AI-powered fitness coaching web application designed to help users reach their fitness goals efficiently. It offers personalized workout split recommendations (Full Body, PPL, Arnold Split) tailored to user experience, nutrition/macro calculations, adaptive progressive overload tracking, and an intelligent SSE streaming AI chat coach.

---

## Tech Stack

- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **AI Architecture:** Provider abstraction (Ollama & Gemini), token-budgeted context builder with history role filtering, SSE stream with `verified-targets` event, and number fidelity validator.
- **Recommended Local Model:** `qwen2.5:7b` (Requires ~4.7 GB VRAM, suitable for GPUs with 6GB+ VRAM).
- **Database Infrastructure:** Docker Desktop (PostgreSQL 15 bound to `127.0.0.1:5433:5432` for local development only).

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker Desktop
- Ollama (for local LLM execution)

### 1. Clone Repository
```bash
git clone https://github.com/Sarab-47/apex-fit-ai.git
cd "Apex Fit Ai"
```

### 2. Database Setup (Local Dev Only)
Start the PostgreSQL container:
```bash
docker compose up -d
```
*Note: DB port is bound strictly to `127.0.0.1:5433` for local development security.*

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

#### Environment Configuration (`backend/.env`):
Copy `backend/.env.example` to `backend/.env`:
```bash
# Security
JWT_SECRET=generate_strong_secret_hex_key_here

# Database
DATABASE_URL=postgresql://apexuser:apexpassword@localhost:5433/apexfit

# LLM Configuration
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# Gemini (Optional)
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```
*To generate a strong JWT_SECRET, run:* `python -c "import secrets; print(secrets.token_hex(32))"`

#### Start Backend:
```bash
uvicorn app.main:app --reload
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## Running Tests & Evaluations

### Automated Test Suite (Pytest)
Run unit and integration tests from the project root:
```bash
python -m pytest -q
```

### AI Coach Evaluation Suite
Ensure Ollama is running, then evaluate a local LLM model across synthetic test fixtures:
```bash
python backend/scripts/eval_coach.py --model qwen2.5:7b --passes 3
```

---

## AI Architecture

1. **Provider Abstraction Layer (`app/ai/providers/`)**:
   - Decoupled `BaseLLMProvider` interface supporting `OllamaProvider` and `GeminiProvider` with typed error handling and configurable retry/backoff parameters.
2. **Context Builder (`app/ai/context_builder.py`)**:
   - Assembles system prompt instructions, user weight/height/experience context, and sliding-window conversation history.
   - Strictly strips any `"system"` role injections from raw conversation history for security.
3. **SSE Streaming (`app/ai_chat.py` & `/chat/stream`)**:
   - Emits a deterministic `verified-targets` event *first* ($t=0.002\text{s}$) containing calculated macros and assigned workout split, before streaming LLM response tokens.
4. **Fidelity Validator (`app/ai/validator.py`)**:
   - Isolates daily nutritional target mentions, normalizes Arabic-Indic digits (`٠١٢٣٤٥٦٧٨٩`), and validates stated protein/calories against context targets.

---

## Known Limitations

- **Cloud Provider (Gemini):** Single-request smoke testing (`smoke_gemini.py`) passed successfully, but multi-pass batch evaluations were inconclusive due to free-tier rate limits (`429 Too Many Requests`) and server capacity errors (`503 Service Unavailable`).
- **Local LLMs:** Models (`llama3:latest`, `aya-expanse:8b`) exhibit minor technique or prompt echo weaknesses; `qwen2.5:7b` is the recommended default.
- **Evaluation Checks:** Evaluators use pattern matching and regex rules; Arabic language quality checks measure script letter ratios.
- **Data Privacy:** When using cloud providers (such as Gemini), user fitness parameters and chat messages cross third-party network boundaries.
