# Sandaniaina Tsinjo Nantosoa — AI Engineer Portfolio

A React portfolio for AI engineering, RAG systems, governed agents, and automation. It includes **Tsinjo AI**, a public, read-only RAG assistant that answers from curated portfolio evidence and returns source links.

## Architecture

```text
Visitor → React/Vite widget → short-lived public JWT → FastAPI on Render
                                                      ├─ OpenAI embeddings
                                                      ├─ Qdrant portfolio_knowledge
                                                      └─ OpenAI Responses API → SSE
```

The widget is loaded only after the visitor clicks **Ask my AI**. It stores its token and up to 20 messages in browser `sessionStorage`; it has no permanent frontend secret and creates no server-side conversation history. The API fixes the tenant to `portfolio`, allows only explicit CORS origins, rate-limits IPs and sessions, and exposes no tools or write operations.

## Frontend

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Frontend environment:

```env
VITE_CONTACT_API_URL=
VITE_PORTFOLIO_AI_API_URL=http://localhost:8000
```

If `VITE_CONTACT_API_URL` is unset, the contact form uses Netlify Forms. Never put an OpenAI key, Qdrant key, session signing secret, or long-lived API token in a `VITE_*` variable.

## Portfolio AI API

Requires Python 3.11+.

```powershell
Set-Location portfolio-ai-api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item .env.example .env
python scripts/ingest_portfolio.py --dry-run
python scripts/ingest_portfolio.py
uvicorn app.main:app --reload --port 8000
```

Required production secrets are `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, and `SESSION_SECRET`. `SESSION_SECRET` must be at least 32 random characters. Set `CORS_ORIGINS` to comma-separated deployed frontend origins. The default collection is `portfolio_knowledge`; use `--recreate` only when deliberately rebuilding it.

The only public endpoints are:

- `GET /health`
- `POST /api/public/session`
- `POST /api/public/chat/stream` with `Authorization: Bearer <short-lived-token>`

## Public knowledge boundary

[`public_portfolio.json`](portfolio-ai-api/app/knowledge/public_portfolio.json) is the sole ingestion source. It is curated from claims already published in `src/data/projects.ts` and `src/data/experience.ts`. The ingestion script never crawls the repository, CV files, local directories, databases, or the legacy corporate chatbot archive. Review this JSON in every content update before ingesting.

## Tests and checks

```powershell
npm run lint
npm run build
Set-Location portfolio-ai-api
python -m pytest
```

Backend tests cover health, session claims, expired/wrong-scope tokens, message limits, rate limiting, streaming, grounded sources, prompt-injection and unrelated-query guards, CORS, and production secret validation.

## Deployment

- **Frontend — Vercel:** import this repository, use the root directory, build command `npm run build`, output `dist`, and set `VITE_PORTFOLIO_AI_API_URL` to the Render service URL. [`vercel.json`](vercel.json) preserves SPA routes such as `/work/:slug`.
- **Frontend — Netlify:** the existing [`netlify.toml`](netlify.toml) remains supported.
- **API — Render:** create a Blueprint from [`render.yaml`](render.yaml), configure the three external secrets, add the final frontend domain to `CORS_ORIGINS`, deploy, then run `python scripts/ingest_portfolio.py` from a trusted environment with the same Qdrant credentials.
- **Qdrant Cloud:** create a private cluster and keep its API key only in Render and the trusted ingestion environment.

Render may spin down an idle service. The widget surfaces connection and retry states while a cold instance wakes up.

## Privacy and contact

The visitor-facing policy is [`public/privacy.html`](public/privacy.html). Contact: [tsinjonantosoa@gmail.com](mailto:tsinjonantosoa@gmail.com) · [GitHub](https://github.com/TsinjoNantosoa) · [LinkedIn](https://www.linkedin.com/in/sandaniaina-tsinjo-nantosoa-b6209a330/)
