"""One-command Drive -> notebook cache -> Qdrant coursework sync."""
from __future__ import annotations

import argparse
import asyncio
import os
from pathlib import Path

from app.ingestion.drive_download import download_changed
from app.ingestion.index_notebooks import ingest


async def sync_coursework(
    folder_id: str,
    destination: Path,
    token: str,
    batch_size: int = 32,
    force_download: bool = False,
    force_index: bool = False,
) -> dict[str, int]:
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
    return {
        "drive_notebooks": total,
        "downloaded": downloaded,
        "local_notebooks": notebooks,
        "indexed_notebooks": changed,
        "indexed_chunks": chunks,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync Google Drive coursework into the portfolio RAG index")
    parser.add_argument("destination", type=Path, nargs="?", default=Path("./data/notebooks"))
    parser.add_argument("--folder-id", default=os.getenv("GOOGLE_DRIVE_FOLDER_ID"))
    parser.add_argument("--batch-size", type=int, default=int(os.getenv("DRIVE_BATCH_SIZE", "32")))
    parser.add_argument("--force-download", action="store_true")
    parser.add_argument("--force-index", action="store_true")
    args = parser.parse_args()

    token = os.getenv("GOOGLE_DRIVE_ACCESS_TOKEN")
    if not args.folder_id:
        parser.error("--folder-id or GOOGLE_DRIVE_FOLDER_ID is required")
    if not token:
        parser.error("GOOGLE_DRIVE_ACCESS_TOKEN is required")

    result = asyncio.run(sync_coursework(
        folder_id=args.folder_id,
        destination=args.destination,
        token=token,
        batch_size=args.batch_size,
        force_download=args.force_download,
        force_index=args.force_index,
    ))
    print("coursework sync complete")
    for key, value in result.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
