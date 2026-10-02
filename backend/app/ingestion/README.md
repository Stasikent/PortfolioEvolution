# Coursework ingestion

This package converts the ML Engineer coursework stored as Google Colab notebooks into source-grounded RAG documents.

## Pipeline

Google Drive / Colab -> notebook JSON -> source cells only -> cleaning -> chunks + provenance -> embeddings -> vector database -> FastAPI retrieval -> LLM answer + sources.

## Important design decision

Notebook outputs and embedded `data:*;base64` images are not indexed. Besides making the index unnecessarily large, binary payloads can accidentally contain keyword-like byte sequences and create false evidence for technologies the candidate did not actually use.

Every indexed chunk retains:

- Drive file ID / source ID
- notebook number/title
- cell index
- cell type (`markdown` or `code`)
- chunk part

This metadata will be returned by Portfolio Copilot so answers such as “Have you used Hugging Face?” can link back to the actual coursework evidence.

## Current verified example

Homework 50 has been parsed and verified to contain Python/PyTorch, Hugging Face Transformers, Whisper ASR, MarianMT, TTS, pandas and VseGPT API usage.

The remaining notebooks are discovered in the Drive folder and will be classified through the same parser before their skills are marked as verified.

## Next

1. Add a Drive ingestion command using OAuth/service credentials supplied at deploy time (never commit credentials).
2. Add embeddings provider abstraction.
3. Add Qdrant collection and upsert logic.
4. Index GitHub repositories through the same document schema.
5. Make `/api/chat` retrieve from the vector store instead of only live GitHub evidence.
6. Add incremental sync using Drive modified timestamps and GitHub webhooks.
