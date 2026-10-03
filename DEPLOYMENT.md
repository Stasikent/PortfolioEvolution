# Publication preparation — 3 October 2026

The portfolio is a React/Vite frontend with an optional FastAPI RAG backend. The site itself serves as the author's resume; there is no separate CV download. Contact destinations confirmed by the author are GitHub, Telegram @stasikent and stasikent@gmail.com.

## Frontend build

Install dependencies with `npm ci`, then run `npm run build`. Publish the **contents of dist/** to a static host. `npm run preview` serves the build locally for inspection.

For the public URL, set `SITE_URL` to the complete HTTPS address. Set `VITE_AI_API_URL` to the public HTTPS address of the FastAPI backend so MiniChat 2009 can call `/api/chat`.

Example:

```text
SITE_URL=https://your-domain.example
VITE_AI_API_URL=https://api.your-domain.example
```

Do not commit real credentials or tokens to the repository.

## Production RAG activation

The Docker Compose stack contains `api`, `qdrant`, and an opt-in `coursework-sync` profile. Qdrant and the coursework cache use persistent Docker volumes.

Configure these runtime variables on the production host:

```text
LLM_API_KEY=...
EMBEDDING_API_KEY=...
CORS_ORIGINS=https://your-domain.example
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_DRIVE_REFRESH_TOKEN=...
GOOGLE_DRIVE_CLIENT_ID=...
GOOGLE_DRIVE_CLIENT_SECRET=...
```

Optional variables include `LLM_BASE_URL`, `LLM_MODEL`, `EMBEDDING_BASE_URL`, `EMBEDDING_MODEL`, `DRIVE_BATCH_SIZE`, and `COURSEWORK_SYNC_INTERVAL_SECONDS`. The default coursework interval is 21600 seconds (6 hours).

`GOOGLE_DRIVE_ACCESS_TOKEN` remains supported for a temporary/manual run, but production should use the renewable refresh-token credentials above.

Start the API and Qdrant first:

```sh
docker compose up -d api qdrant
```

Then enable scheduled coursework ingestion:

```sh
docker compose --profile coursework-sync up -d coursework-sync
```

The sync command performs a production preflight before ingestion. It verifies the Drive folder configuration, usable Google OAuth credentials, an embeddings API key, and Qdrant readiness. A failed preflight prevents that ingestion attempt from running; the scheduled service retries on the next interval.

## Verification

Check backend health after deployment:

```sh
curl -fsS https://api.your-domain.example/api/health
```

The response includes `coursework_sync`. Expected lifecycle values are `not_started`, `running`, `ok`, `error`, or `unreadable`. After the first successful ingestion, `ok` also includes Drive/local notebook counts and indexed notebook/chunk counts.

Check the sync container logs when activation fails:

```sh
docker compose --profile coursework-sync logs --tail=100 coursework-sync
```

Then test MiniChat 2009 with a question that is directly supported by one of the indexed notebooks. A grounded answer should return source entries; unsupported questions should not be presented as source-grounded.

## Navigation and unknown addresses

The site uses `?era=2009#mis-bot`, not a route per era. Serve `/` (or the configured base) and `/index.html` normally. Configure the host to serve `404.html` **with HTTP 404** for unknown paths, retaining the requested URL. The app shows a recovery page with a link to the correct base and adds noindex. Do not apply a blanket HTTP-200 rewrite to every path if correct 404 responses matter.

## Included public assets

- `social-preview.png`: 1200 × 630 preview, with editable SVG source.
- SVG favicon, PNG icons at 192 and 512 px, and 180 px Apple touch icon.
- `site.webmanifest` with relative start URL and icon paths.
- Basic no-JavaScript contact fallback.

## Local verification

`npm run test:deployment` builds into `.verification/` and checks both root hosting and a `/folio/` subdirectory on local temporary HTTP servers. It verifies all five eras, loaded assets, preview dimensions, canonical metadata, a 404 response and recovery navigation. Backend/RAG production health must additionally be checked with `/api/health` as described above.
