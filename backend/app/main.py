import os
from typing import Literal

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Portfolio Evolution AI", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class Source(BaseModel):
    title: str
    url: str
    excerpt: str = ""
    kind: Literal["github", "coursework", "portfolio"] = "github"

class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)

class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
    grounded: bool

SYSTEM_PROMPT = """You are the source-grounded assistant for Stanislav's developer portfolio.
Answer ONLY from the evidence supplied in CONTEXT. Never invent experience, employers, technologies,
results, dates, or proficiency. If the evidence is insufficient, say that the portfolio does not contain
enough evidence. Be concise and useful to a recruiter. Mention which sources support the answer.
"""

async def github_context(question: str) -> list[Source]:
    # Phase 1 deliberately uses public GitHub search as live evidence. Phase 2 replaces/ranks this
    # with embeddings + a vector database and adds coursework ingestion.
    repo = os.getenv("PORTFOLIO_REPO", "Stasikent/PortfolioEvolution")
    token = os.getenv("GITHUB_TOKEN")
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    query = " ".join(question.replace("/", " ").split()[:6])
    url = "https://api.github.com/search/code"
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params={"q": f"{query} repo:{repo}"}, headers=headers)
    if response.status_code == 401:
        return []
    if response.status_code >= 400:
        return []
    items = response.json().get("items", [])[:5]
    return [
        Source(title=item["path"], url=item["html_url"], excerpt=f"Matching file in {repo}", kind="github")
        for item in items
    ]

async def call_llm(question: str, sources: list[Source]) -> str:
    api_key = os.getenv("LLM_API_KEY")
    base_url = os.getenv("LLM_BASE_URL", "https://api.vsegpt.ru/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")
    if not api_key:
        raise HTTPException(status_code=503, detail="LLM_API_KEY is not configured")
    context = "\n".join(f"[{i+1}] {s.title} — {s.url} — {s.excerpt}" for i, s in enumerate(sources))
    if not context:
        return "В доступных источниках пока не найдено достаточно подтверждений для уверенного ответа."
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"QUESTION:\n{question}\n\nCONTEXT:\n{context}"},
        ],
        "temperature": 0.1,
    }
    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(f"{base_url}/chat/completions", headers={"Authorization": f"Bearer {api_key}"}, json=payload)
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="LLM provider request failed")
    return response.json()["choices"][0]["message"]["content"].strip()

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "portfolio-evolution-ai", "phase": "github-grounded-mvp"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    sources = await github_context(request.question)
    answer = await call_llm(request.question, sources)
    return ChatResponse(answer=answer, sources=sources, grounded=bool(sources))
