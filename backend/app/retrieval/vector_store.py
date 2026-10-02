"""Qdrant-backed semantic retrieval for Portfolio Copilot.

The module keeps vector DB concerns outside FastAPI routes so ingestion and
retrieval can evolve independently. Embeddings are requested through an
OpenAI-compatible endpoint, which allows the project to use VseGPT or another
compatible provider without coupling the code to one vendor.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

import httpx
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams


@dataclass(slots=True)
class SourceDocument:
    id: str
    text: str
    title: str
    url: str
    kind: str
    metadata: dict[str, Any]


class EmbeddingClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("EMBEDDING_API_KEY") or os.getenv("LLM_API_KEY")
        self.base_url = os.getenv("EMBEDDING_BASE_URL", os.getenv("LLM_BASE_URL", "https://api.vsegpt.ru/v1")).rstrip("/")
        self.model = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not self.api_key:
            raise RuntimeError("EMBEDDING_API_KEY/LLM_API_KEY is not configured")
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                f"{self.base_url}/embeddings",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model, "input": texts},
            )
        response.raise_for_status()
        rows = sorted(response.json()["data"], key=lambda item: item["index"])
        return [row["embedding"] for row in rows]


class VectorStore:
    def __init__(self) -> None:
        self.collection = os.getenv("QDRANT_COLLECTION", "portfolio_knowledge")
        self.client = AsyncQdrantClient(
            url=os.getenv("QDRANT_URL", "http://localhost:6333"),
            api_key=os.getenv("QDRANT_API_KEY") or None,
        )
        self.embeddings = EmbeddingClient()

    async def ensure_collection(self, vector_size: int) -> None:
        if not await self.client.collection_exists(self.collection):
            await self.client.create_collection(
                collection_name=self.collection,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
            )

    async def upsert(self, documents: list[SourceDocument]) -> int:
        if not documents:
            return 0
        vectors = await self.embeddings.embed([document.text for document in documents])
        await self.ensure_collection(len(vectors[0]))
        points = [
            PointStruct(
                id=document.id,
                vector=vector,
                payload={
                    "text": document.text,
                    "title": document.title,
                    "url": document.url,
                    "kind": document.kind,
                    **document.metadata,
                },
            )
            for document, vector in zip(documents, vectors, strict=True)
        ]
        await self.client.upsert(collection_name=self.collection, points=points, wait=True)
        return len(points)

    async def search(self, query: str, limit: int = 6) -> list[dict[str, Any]]:
        vector = (await self.embeddings.embed([query]))[0]
        if not await self.client.collection_exists(self.collection):
            return []
        result = await self.client.query_points(
            collection_name=self.collection,
            query=vector,
            limit=limit,
            with_payload=True,
        )
        return [
            {"score": point.score, **(point.payload or {})}
            for point in result.points
        ]
