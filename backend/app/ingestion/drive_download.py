"""Download changed Colab notebooks from a Google Drive folder.

This module deliberately only handles Drive -> local files. Parsing, chunking
and Qdrant indexing remain in index_notebooks.py.

Environment:
  GOOGLE_DRIVE_ACCESS_TOKEN  short-lived OAuth access token
  GOOGLE_DRIVE_FOLDER_ID     source folder id (or pass --folder-id)
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path

import httpx

DRIVE_API = "https://www.googleapis.com/drive/v3"


def load_state(path: Path) -> dict[str, str]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_state(path: Path, state: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, indent=2, sort_keys=True), encoding="utf-8")


def safe_name(file_id: str) -> str:
    return f"drive-{file_id}.ipynb"


async def list_files(client: httpx.AsyncClient, folder_id: str) -> list[dict]:
    result: list[dict] = []
    page_token: str | None = None
    while True:
        params = {
            "q": f"'{folder_id}' in parents and trashed = false",
            "fields": "nextPageToken,files(id,name,mimeType,modifiedTime)",
            "pageSize": 1000,
        }
        if page_token:
            params["pageToken"] = page_token
        response = await client.get(f"{DRIVE_API}/files", params=params)
        response.raise_for_status()
        payload = response.json()
        result.extend(file for file in payload.get("files", []) if file.get("mimeType") == "application/vnd.google.colaboratory")
        page_token = payload.get("nextPageToken")
        if not page_token:
            return result


async def download_changed(folder_id: str, destination: Path, token: str, force: bool = False) -> tuple[int, int]:
    destination.mkdir(parents=True, exist_ok=True)
    state_path = destination / ".drive-state.json"
    state = load_state(state_path)
    headers = {"Authorization": f"Bearer {token}"}
    changed = 0
    async with httpx.AsyncClient(headers=headers, timeout=120) as client:
        files = await list_files(client, folder_id)
        for file in files:
            file_id = str(file["id"])
            modified = str(file.get("modifiedTime", ""))
            target = destination / safe_name(file_id)
            if not force and target.exists() and state.get(file_id) == modified:
                continue
            response = await client.get(f"{DRIVE_API}/files/{file_id}", params={"alt": "media"})
            response.raise_for_status()
            target.write_bytes(response.content)
            state[file_id] = modified
            save_state(state_path, state)
            changed += 1
            print(f"downloaded {file.get('name', file_id)} -> {target.name}")
    return len(files), changed


def main() -> None:
    parser = argparse.ArgumentParser(description="Download changed Colab notebooks from Google Drive")
    parser.add_argument("destination", type=Path)
    parser.add_argument("--folder-id", default=os.getenv("GOOGLE_DRIVE_FOLDER_ID"))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    token = os.getenv("GOOGLE_DRIVE_ACCESS_TOKEN")
    if not args.folder_id:
        parser.error("--folder-id or GOOGLE_DRIVE_FOLDER_ID is required")
    if not token:
        parser.error("GOOGLE_DRIVE_ACCESS_TOKEN is required")
    total, changed = asyncio.run(download_changed(args.folder_id, args.destination, token, args.force))
    print(f"done: {total} notebooks discovered, {changed} downloaded")


if __name__ == "__main__":
    main()
