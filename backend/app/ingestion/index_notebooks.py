"""Incremental CLI ingestion pipeline for downloaded Colab/Jupyter notebooks.

Usage:
    python -m app.ingestion.index_notebooks ./data/notebooks

The command indexes only new or changed notebooks. State contains file hashes,
not credentials, and may live on a persistent deploy volume.
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
from pathlib import Path

from app.ingestion.colab_parser import chunk_text, parse_notebook
from app.retrieval import SourceDocument, VectorStore


def stable_point_id(value: str) -> str:
    digest = hashlib.md5(value.encode("utf-8"), usedforsecurity=False).hexdigest()
    return f"{digest[:8]}-{digest[8:12]}-{digest[12:16]}-{digest[16:20]}-{digest[20:]}"


def file_digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_state(path: Path) -> dict[str, str]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_state(path: Path, state: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")


def notebook_documents(path: Path, public_url: str = "") -> list[SourceDocument]:
    source_id = path.stem
    documents: list[SourceDocument] = []
    for cell in parse_notebook(path.read_bytes(), source_id=source_id):
        for item in chunk_text(cell):
            documents.append(SourceDocument(id=stable_point_id(item["id"]), text=item["text"], title=source_id, url=public_url, kind="coursework", metadata={**item["metadata"], "file_name": path.name}))
    return documents


async def ingest(directory: Path, batch_size: int = 32, state_path: Path | None = None, force: bool = False) -> tuple[int, int, int]:
    store = VectorStore()
    files = sorted(directory.glob("*.ipynb"))
    state_path = state_path or directory / ".ingestion-state.json"
    state = load_state(state_path)
    changed = [(path, file_digest(path)) for path in files]
    changed = [(path, digest) for path, digest in changed if force or state.get(path.name) != digest]
    indexed = 0
    for path, digest in changed:
        docs = notebook_documents(path)
        for start in range(0, len(docs), batch_size):
            indexed += await store.upsert(docs[start:start + batch_size])
        state[path.name] = digest
        save_state(state_path, state)
        print(f"indexed {path.name}: {len(docs)} chunks")
    return len(files), len(changed), indexed


def main() -> None:
    parser = argparse.ArgumentParser(description="Incrementally index coursework notebooks into Qdrant")
    parser.add_argument("directory", type=Path)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--state", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    files, changed, chunks = asyncio.run(ingest(args.directory, args.batch_size, args.state, args.force))
    print(f"done: {files} notebooks, {changed} changed, {chunks} chunks indexed")


if __name__ == "__main__":
    main()
