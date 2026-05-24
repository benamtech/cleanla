---
title: LLM Wiki Pattern (Karpathy Method)
tags: [llm-workflow, knowledge-management, meta]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../playbooks/one-shot-app-prompt.md
---

A personal knowledge system in which raw source material is "compiled" by an LLM into a structured set of interlinked plain-markdown concept pages, and queried by loading those pages back into an LLM's context window. Articulated by Andrej Karpathy in April 2026 (`llm-wiki.md` gist).

## The premise

Most knowledge tools (Evernote, Notion, Obsidian) treat *input* as the artifact — the user files, tags, and links their own notes. RAG systems invert that: they treat raw input as a chunkable corpus and rely on vector similarity to retrieve fragments at query time.

The LLM Wiki occupies a third position. Raw input is *fuel*, not the artifact. The compiled wiki page is the artifact, written by an LLM through synthesis and refinement. The structure of the wiki is the index — there is no separate retrieval layer.

## The compile loop

```
raw/  ──ingest──►  wiki/  ──query──►  context window
```

1. User drops material into `raw/`
2. User says "ingest"
3. LLM reads new raw files, surveys existing wiki, synthesizes — creating, updating, splitting, and cross-linking pages
4. To query, LLM loads relevant `wiki/` pages directly into context and answers from them

## Why it compounds

- Every ingestion makes the wiki *denser*, not longer. Synthesis means duplicate ideas merge, related ideas cross-link, contradictions surface explicitly.
- The wiki replaces the cold-start cost of every future conversation. The LLM no longer needs the user to re-explain their project, their stack, or their decisions — the wiki *is* the context.
- The user is the curator, the LLM is the compiler. Roles are clear.

## When it breaks

- **At scale.** Somewhere between 1,000 and 10,000 pages, loading "the relevant pages" stops fitting in a single context window, and you need retrieval. At that point, retrofit a vector index over the compiled wiki — you'll get dramatically better RAG results than over the raw corpus because every chunk is a deliberate concept page.
- **At ingestion rate.** If raw deposits arrive faster than synthesis can keep up, the wiki goes stale and the user loses trust. The cure is either to ingest more frequently in smaller batches, or to triage raw material before it enters `raw/`.
- **Under contradiction churn.** If the underlying domain changes faster than the wiki can be refined, pages become stale. The fix is the `## Revised (YYYY-MM-DD)` convention plus periodic "tidy" passes.

## Key design rules (from [[../AGENT]])

- Atomic concept pages: one idea per file, 150–600 words
- Immutable decisions, dated and supersedable
- Obsidian-style `[[wikilinks]]` and bidirectional `## Backlinks`
- Synthesis, not transcription — wiki pages are compiled artifacts, raw text stays in `raw/`
- `wiki/index.md` is the canonical map; every page is linked from there under exactly one cluster

## Why not RAG?

For a personal wiki below the scale ceiling, compilation produces dramatically more coherent answers than vector retrieval. Vector search returns chunks that are *textually similar* to a query; compiled pages contain ideas the user has already validated. Coherence wins on small-to-medium corpora; retrieval wins above the ceiling.

## Sources

- Karpathy, A. *llm-wiki.md* gist, April 2026 (referenced in the bootstrap prompt that created this wiki)
- This wiki's own [[../AGENT]] and [[../README]]

## Backlinks

- [[../README]]
- [[../AGENT]]
