"""One-command Drive -> notebook cache -> Qdrant coursework sync."""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from app.ingestion.drive_download import download_changed
from app.ingestion.index_notebooks import ingest


def write_status(destination: Path, status: str, **details: object) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    payload = {"status": status, "updated_at": datetime.now(timezone.utc).isoformat(), **details}
    target = destination / ".sync-status.json"
    temporary = destination / ".sync-status.json.tmp"
    temporary.write_text(json.dumps(payload, indent=2, sort_keys=True), encoding="utf-8")
    temporary.replace(target)


async def sync_coursework(
    folder_id: str,
    destination: Path,
    token: str | None = None,
    batch_size: int = 32,
    force_download: bool = False,
    force_index: bool = False,
) -> dict[str, int]:
    write_status(destination, "running")
    try:
        total, downloaded = await download_changed(
            folder_id=folder_id,
            destination=destination,
            token=token,
            force=force_download,
        )
        notebooks, changed, chunks = await ingest(
            directory=destination,
            batch_size=batch_size,
            state_path=destination / ".ingestion-state.json",
            force=force_index,
        )
        result = {
            "drive_notebooks": total,
            "downloaded": downloaded,
            "local_notebooks": notebooks,
            "indexed_notebooks": changed,
            "indexed_chunks": chunks,
        }
        write_status(destination, "ok", **result)
        return result
    except Exception as exc:
        write_status(destination, "error", error=type(exc).__name__, message=str(exc)[:500])
        raise


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync Google Drive coursework into the portfolio RAG index")
    parser.add_argument("destination", type=Path, nargs="?", default=Path("./data/notebooks"))
    parser.add_argument("--folder-id", default=os.getenv("GOOGLE_DRIVE_FOLDER_ID"))
    parser.add_argument("--batch-size", type=int, default=int(os.getenv("DRIVE_BATCH_SIZE", "32")))
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force-index", action="store_true")
    args = parser.parse_args()

    if not args.folder_id:
        parser.error("--folder-id or GOOGLE_DRIVE_FOLDER_ID is required")

    result = asyncio.run(sync_coursework(
        folder_id=args.folder_id,
        destination=args.destination,
        batch_size=args.batch_size,
        force_download=args.force_download,
        force_index=args.force_index,
    ))
    print("coursework sync complete")
    for key, value in result.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
