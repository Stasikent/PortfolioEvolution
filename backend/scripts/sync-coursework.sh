#!/bin/sh
set -eu

CACHE_DIR="${COURSEWORK_CACHE_DIR:-/data/coursework}"
BATCH_SIZE="${DRIVE_BATCH_SIZE:-32}"

mkdir -p "$CACHE_DIR"

python -m app.ingestion.preflight

exec python -m app.ingestion.sync_coursework \
  "$CACHE_DIR" \
  --batch-size "$BATCH_SIZE" \
  "$@"
