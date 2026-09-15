# IP-SAKTI Sahayak — Frontend

Next.js + TypeScript + Tailwind chat UI for the IP-SAKTI Sahayak RAG backend.
Built directly against [`docs/API_CONTRACT.md`](../docs/API_CONTRACT.md) —
read that first if you're changing how this talks to the backend.

## Deploying

Deployed on Vercel. The only required configuration is the backend's URL:

1. Deploy the backend (see `../backend/`) somewhere reachable over HTTPS,
   and add this frontend's deployed domain to its `CORS_ORIGINS`.
2. In the Vercel project's **Settings → Environment Variables**, set
   `NEXT_PUBLIC_API_BASE_URL` to that backend's URL (e.g.
   `https://api.yourdomain.com`) — no trailing slash.
3. Deploy. `src/lib/api.ts` has no fallback URL baked in on purpose: if this
   variable isn't set, requests fail with a clear "backend isn't configured"
   error instead of silently trying to reach a machine that doesn't exist in
   production.

## Local development

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points NEXT_PUBLIC_API_BASE_URL at your local backend
npm run dev
```

Opens on `http://localhost:3000`, talking to whatever `NEXT_PUBLIC_API_BASE_URL`
in `.env.local` points at (a locally-running copy of `../backend/` by default).
This file is for local development only and is never read in production —
the deployed app uses the environment variable set in Vercel above.

## What's here

- **Step 0 intake** (`src/components/IntakeScreen.tsx`) — jurisdiction
  (required: India / International) and formulation category (optional,
  free-text-equivalent from a fixed list) collected before the first
  question, per the contract's requirement that jurisdiction always be sent
  as one of the two exact strings the backend expects.
- **Chat view** (`src/components/ChatView.tsx`) — sends `history` (prior
  turns, current question excluded) with every request; renders citations,
  confidence badges, and abstentions (`flags.abstained`) distinctly. Never
  string-matches the answer text to detect abstention.
- **Source viewer** (`src/components/SourceViewer.tsx`) — split-screen panel
  that opens a citation's exact PDF page via the backend's `/sources`
  static mount.
- **Loading state** (`src/components/LoadingState.tsx`) — answers can
  legitimately take up to ~60s (cold model load, Ollama-timeout-then-Groq
  fallback); this shows elapsed time and rotating status text instead of a
  bare spinner that looks broken after 10 seconds.
- **API client** (`src/lib/api.ts`) — client-side fetch timeout at 68s (just
  above the backend's 60s `REQUEST_TIMEOUT`), and error handling for the
  documented `422` / `503` / `504` / `500` shapes.

## Known gaps

- No automated tests yet.
- The backend isn't deployed yet — see "Deploying" above for what's needed
  once it is.
