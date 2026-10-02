# Portfolio Evolution AI backend

FastAPI backend for the source-grounded Portfolio Copilot.

## MVP

- `GET /api/health`
- `POST /api/chat`
- live retrieval from the public PortfolioEvolution GitHub repository
- OpenAI-compatible LLM endpoint (VseGPT by default)
- source links returned with every grounded answer
- explicit refusal to invent unsupported experience

## Local run

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Copy `.env.example` values into your deployment environment. Never commit real API keys.

Frontend configuration:

```env
VITE_AI_API_URL=http://localhost:8000
```

## Roadmap

1. Replace GitHub code search with an ingestion pipeline.
2. Add coursework/homework as a second evidence source.
3. Chunk documents and code; generate embeddings.
4. Store vectors in Qdrant/Chroma and metadata/conversations in PostgreSQL.
5. Add incremental GitHub webhook re-indexing.
6. Add n8n orchestration and Telegram Bot API as a second client.
7. Add vacancy analysis: requirements -> retrieved evidence -> supported/gap matrix.
8. Docker Compose, CI, structured logging, retries and health/status dashboard.

The assistant is intentionally evidence-first: unsupported skills should be reported as not evidenced rather than inferred.
