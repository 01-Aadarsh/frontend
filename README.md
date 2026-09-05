# IP-SAKTI Sahayak

A RAG-based AI assistant that answers Ayurveda-related IP and regulatory questions by retrieving from official government and international documents and citing exactly which document, page and section each part of the answer came from — never letting the model write its own citation. Built for **SIH26045** (Ministry of Ayush).

Before any free-form question, the user picks a **jurisdiction** (India / International) and, if known, a **formulation category** (classical medicine, proprietary medicine, new/non-classical drug, phytopharmaceutical, Ayurveda-Aahar/nutraceutical, cosmetic) — the correct IP/ABS posture for an Ayurvedic product depends on both, so that's Step 0, not an afterthought.

If the retrieved documents don't contain the answer, the system says so instead of guessing.

[`docs/technical_execution_guide.pdf`](docs/technical_execution_guide.pdf) is the original build plan (narrower than the actual PS in places — this README and `docs/API_CONTRACT.md` are the current source of truth for status).

## Pipeline

```
User query (+ jurisdiction, + optional formulation category)
  → Query rewriter (standalone question; category prepended as context)
  → Hybrid retrieval — BM25 + dense embeddings, fused via RRF, filtered by jurisdiction  → top 40
  → Cross-encoder reranker                                                                → top 5
  → Grounded generation (LLM answers only from retrieved text)
  → Citation attacher (code-attached, never LLM-generated; includes a confidence score)
  → Answer + sources  |  or an honest abstention
```

Orchestrated as a deterministic LangGraph DAG (not an autonomous agent loop), with exactly one bounded conditional retry after a weak rerank score.

## Status

- **Backend**: ingestion, hybrid retrieval (jurisdiction-filterable), reranking, grounded generation, code-attached citations with confidence scores, LangGraph wiring, FastAPI layer with static source-PDF serving — done, verified live.
- **Frontend**: Next.js + Tailwind + shadcn, dark console UI — Step 0 intake screen, context-aware chat, split-screen source viewer that opens the exact cited PDF page — done, verified live against the real backend.
- **Eval** (`eval/`): 15-case held-out set — see [`eval/scored_results.json`](eval/scored_results.json) for the latest scored run. Headline: 10/11 correctly cited in-scope answers, 4/4 correct abstentions on out-of-scope questions.
- **Corpus**: 17 documents indexed (~1,480 chunks) — solid national coverage across Patents, GI, Biological Diversity/ABS, clinical-trial rules, and TKDL background; international coverage is currently thin (one WIPO treaty).
- **Open**: several national Acts still unindexed (Trade Marks, Designs, Copyright, PPV&FR, Drugs and Cosmetics Act itself, Drugs and Magic Remedies Act, FSSAI Ayurveda-Aahar rules), deeper international treaty coverage, multilingual (Bhashini/Sarvam), and the fully-offline demo path (blocked by a known Ollama/CUDA issue on the dev machine — see `backend/generation/llm_client.py`).

## Preview

**Frontend (UI only):** http://localhost:3000 — after running `npm run dev`
in `frontend/` (see below). No live/hosted deployment exists; this is
local-only, and it's just the frontend — the backend must be running
separately too for the chat to actually answer anything.

## Running locally

All backend commands run from `backend/` — `.env` paths are relative to it.

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL (Neon/Supabase pgvector) and GROQ_API_KEY at minimum
python -m ingestion.indexer   # builds the pgvector store + BM25 index from data/
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload
```

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

Backend health check: `curl http://127.0.0.1:8000/health`. Backend dev servers tend not to survive a session restart — if the health check fails, just restart uvicorn.

To re-run the eval set: `python -m eval.run_eval` (from repo root — it `chdir`s into `backend/` itself).

## Docs

| File | What it's for |
|---|---|
| [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) | Backend HTTP request/response shapes |
| [`docs/source_documents.md`](docs/source_documents.md) | Module 1 checklist of national source documents |
| [`docs/international_documents_plan.pdf`](docs/international_documents_plan.pdf) | Where to download the still-missing international treaty texts |
| [`docs/technical_execution_guide.pdf`](docs/technical_execution_guide.pdf) | Original build plan (superseded in places — this README is current) |
