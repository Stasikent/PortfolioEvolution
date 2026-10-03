"""Validate production dependencies before running coursework ingestion."""
from __future__ import annotations

import asyncio
import os
import sys

import httpx

from app.ingestion.drive_download import resolve_access_token


async def check() -> list[str]:
    errors: list[str] = []

    folder_id = os.getenv("GOOGLE_DRIVE_FOLDER_ID", "").strip()
    if not folder_id:
        errors.append("GOOGLE_DRIVE_FOLDER_ID is missing")

    if not os.getenv("EMBEDDING_API_KEY", "").strip():
        errors.append("EMBEDDING_API_KEY is missing")

    try:
        await resolve_access_token()
    except Exception as exc:
        errors.append(f"Google Drive credentials are not usable: {type(exc).__name__}: {str(exc)[:200]}")

    qdrant_url = os.getenv("QDRANT_URL", "http://qdrant:6333").rstrip("/")
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(f"{qdrant_url}/readyz")
            response.raise_for_status()
    except Exception as exc:
        errors.append(f"Qdrant is not ready at {qdrant_url}: {type(exc).__name__}: {str(exc)[:200]}")

    return errors


def main() -> None:
    errors = asyncio.run(check())
    if errors:
        print("coursework sync preflight FAILED", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        raise SystemExit(1)
    print("coursework sync preflight OK")


if __name__ == "__main__":
    main()
