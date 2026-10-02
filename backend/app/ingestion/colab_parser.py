"""Utilities for turning Google Colab/Jupyter notebooks into RAG documents.

The parser intentionally ignores cell outputs and embedded data URLs. This avoids
indexing huge base64 images and prevents false skill matches from binary payloads.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any
import json
import re


@dataclass(slots=True)
class NotebookChunk:
    source_id: str
    cell_index: int
    cell_type: str
    text: str


def _clean_source(source: str | list[str]) -> str:
    text = "".join(source) if isinstance(source, list) else source
    # Strip markdown images containing inline base64 payloads.
    text = re.sub(r"!\[[^\]]*\]\(data:[^)]+\)", "", text, flags=re.I | re.S)
    # Defensive cleanup for raw data URLs in code/markdown.
    text = re.sub(r"data:[^\s\"')]+;base64,[A-Za-z0-9+/=]+", "", text, flags=re.I)
    return text.strip()


def parse_notebook(raw: bytes | str, source_id: str) -> list[NotebookChunk]:
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8")
    notebook: dict[str, Any] = json.loads(raw)
    chunks: list[NotebookChunk] = []
    for index, cell in enumerate(notebook.get("cells", [])):
        cell_type = str(cell.get("cell_type", "unknown"))
        if cell_type not in {"markdown", "code"}:
            continue
        text = _clean_source(cell.get("source", ""))
        if not text:
            continue
        chunks.append(NotebookChunk(source_id, index, cell_type, text))
    return chunks


def chunk_text(chunk: NotebookChunk, max_chars: int = 2200, overlap: int = 250) -> list[dict[str, Any]]:
    """Split a cell while retaining provenance for source-grounded answers."""
    if max_chars <= overlap:
        raise ValueError("max_chars must be greater than overlap")
    result: list[dict[str, Any]] = []
    start = 0
    part = 0
    while start < len(chunk.text):
        end = min(len(chunk.text), start + max_chars)
        result.append({
            "id": f"{chunk.source_id}:cell-{chunk.cell_index}:part-{part}",
            "text": chunk.text[start:end],
            "metadata": {
                "source_id": chunk.source_id,
                "cell_index": chunk.cell_index,
                "cell_type": chunk.cell_type,
                "part": part,
            },
        })
        if end == len(chunk.text):
            break
        start = end - overlap
        part += 1
    return result
