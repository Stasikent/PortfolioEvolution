"""CLI ingestion pipeline for Google Colab/Jupyter notebooks.

Usage:
    python -m app.ingestion.index_notebooks ./data/notebooks

Notebook files are parsed without outputs/base64 payloads, split into provenance-
preserving chunks and written to the same Qdrant collection used by Portfolio
Copilot.
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
from pathlib import Path

from app.ingestion.colab_parser import chunk_text, parse_notebook
from app.retrieval import SourceDocument, VectorStore


def stable_point_id(value: str) -> str:
    """Return a deterministic UUID-like hex ID accepted by Qdrant."""
    digest = hashlib.md5(value.encode("utf-8"), usedforsecurity=False).hexdigest()
    return f"{digest[:8]}-{digest[8:12]}-{digest[12:16]}-{digest[16:20]}-{digest[20:]}"


def notebook_documents(path: Path, public_url: str = "") -> list[SourceDocument]:
    source_id = path.stem
    documents: list[SourceDocument] = []
    for cell in parse_notebook(path.read_bytes(), source_id=source_id):
        for item in chunk_text(cell):
            documents.append(
                SourceDocument(
                    id=stable_point_id(item["id"]),
                    text=item["text"],
                    title=source_id,
                    url=public_url,
                    kind="coursework",
                    metadata={
                        **item["metadata"],
                        "file_name": path.name,
                    },
                )
            )
    return documents


async def ingest(directory: Path, batch_size: int = 32) -> tuple[int, int]:
    store = VectorStore()
    files = sorted(directory.glob("*.ipynb"))
    indexed = 0
    for path in files:
        docs = notebook_documents(path)
        for start in range(0, len(docs), batch_size):
            indexed += await store.upsert(docs[start : start + batch_size])
        print(f"indexed {path.name}: {len(docs)} chunks")
    return len(files), indexed


def main() -> None:
    parser = argparse.ArgumentParser(description="Index coursework notebooks into Qdrant")
    parser.add_argument("directory", type=Path)
    parser.add_argument("--batch-size", type=int, default=32)
    args = parser.parse_args()
    files, chunks = asyncio.run(ingest(args.directory, args.batch_size))
    print(f"done: {files} notebooks, {chunks} chunks")


if __name__ == "__main__":
    main()
