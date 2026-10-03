"""Post-deployment smoke test for Portfolio Evolution RAG API."""
from __future__ import annotations

import argparse
import json
import sys

import httpx


def fail(message: str) -> None:
    print(f"SMOKE FAILED: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Verify deployed health and grounded MiniChat retrieval")
    parser.add_argument("base_url", help="Public backend URL, e.g. https://api.example.com")
    parser.add_argument("--question", required=True, help="Question known to be supported by indexed coursework")
    parser.add_argument("--language", default="en")
    parser.add_argument("--allow-not-started", action="store_true", help="Allow health before first coursework sync")
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/")

    with httpx.Client(timeout=60) as client:
        health_response = client.get(f"{base_url}/api/health")
        if health_response.status_code != 200:
            fail(f"health returned HTTP {health_response.status_code}")
        health = health_response.json()
        if health.get("status") != "ok":
            fail(f"service health is {health.get('status')!r}")
        sync = health.get("coursework_sync", {})
        sync_status = sync.get("status")
        allowed = {"ok"}
        if args.allow_not_started:
            allowed.add("not_started")
        if sync_status not in allowed:
            fail(f"coursework sync status is {sync_status!r}: {json.dumps(sync, ensure_ascii=False)}")

        chat_response = client.post(
            f"{base_url}/api/chat",
            json={"question": args.question, "language": args.language},
        )
        if chat_response.status_code != 200:
            fail(f"chat returned HTTP {chat_response.status_code}: {chat_response.text[:300]}")
        chat = chat_response.json()
        answer = chat.get("answer")
        sources = chat.get("sources")
        if not isinstance(answer, str) or not answer.strip():
            fail("chat returned an empty answer")
        if chat.get("grounded") is not True:
            fail("known-answer question was not grounded")
        if not isinstance(sources, list) or not sources:
            fail("grounded answer returned no sources")
        if not any(source.get("kind") == "coursework" for source in sources if isinstance(source, dict)):
            fail("grounded answer did not include a coursework source")

    print("RAG smoke test OK")
    print(f"  coursework_sync: {sync_status}")
    print(f"  sources: {len(sources)}")
    print(f"  answer_chars: {len(answer)}")


if __name__ == "__main__":
    main()
