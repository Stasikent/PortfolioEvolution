"""Download changed Colab notebooks from a Google Drive folder.

This module deliberately only handles Drive -> local files. Parsing, chunking
and Qdrant indexing remain in index_notebooks.py.

Authentication supports either a short-lived GOOGLE_DRIVE_ACCESS_TOKEN or,
for unattended production sync, a refresh-token flow using credentials supplied
only through the runtime environment.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path

import httpx

DRIVE_API = "https://www.googleapis.com/drive/v3"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


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


async def resolve_access_token() -> str:
    """Return a usable Drive access token without persisting credentials."""
    refresh_token = os.getenv("GOOGLE_DRIVE_REFRESH_TOKEN")
    client_id = os.getenv("GOOGLE_DRIVE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_DRIVE_CLIENT_SECRET")
    if refresh_token and client_id and client_secret:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "refresh_token": refresh_token,
                    "grant_type": "refresh_token",
                },
            )
        response.raise_for_status()
        token = response.json().get("access_token")
        if not isinstance(token, str) or not token:
            raise RuntimeError("Google OAuth refresh response did not contain an access token")
        return token

    access_token = os.getenv("GOOGLE_DRIVE_ACCESS_TOKEN")
    if access_token:
        return access_token
    raise RuntimeError(
        "Google Drive credentials are not configured: provide a refresh token, client id and client secret, "
        "or GOOGLE_DRIVE_ACCESS_TOKEN for a one-off sync"
    )


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


async def download_changed(folder_id: str, destination: Path, token: str | None = None, force: bool = False) -> tuple[int, int]:
    destination.mkdir(parents=True, exist_ok=True)
    state_path = destination / ".drive-state.json"
    state = load_state(state_path)
    access_token = token or await resolve_access_token()
    headers = {"Authorization": f"Bearer {access_token}"}
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
    if not args.folder_id:
        parser.error("--folder-id or GOOGLE_DRIVE_FOLDER_ID is required")
    try:
        total, changed = asyncio.run(download_changed(args.folder_id, args.destination, force=args.force))
    except RuntimeError as exc:
        parser.error(str(exc))
    print(f"done: {total} notebooks discovered, {changed} downloaded")


if __name__ == "__main__":
    main()
