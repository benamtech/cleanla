# LLM Wiki

A personal knowledge base in the style of Andrej Karpathy's April 2026 `llm-wiki.md` gist. Plain markdown, compiled from raw source material by an LLM agent, queried by loading pages back into an LLM's context.

It is **not** a RAG system. There is no vector database, no embedding pipeline, no retrieval layer. The structure is the index. Compilation is the indexing.

## The compile loop

```
raw/  ──ingest──►  wiki/  ──query──►  context window
```

1. **Drop** raw material into `raw/` — articles, transcripts, papers, code, screenshots, notes. Anything.
2. **Open** this repo in Claude Code and say "ingest". The agent will read every new raw file, survey existing wiki pages, and synthesize the new material into concept pages, project pages, decisions, or playbooks — updating existing pages where appropriate.
3. **Query** by asking Claude Code a question. The agent reads `wiki/index.md`, identifies relevant pages, loads them into context, and answers.

Over time the wiki compounds. You don't re-explain context every conversation. The wiki *is* the context.

## Repository layout

```
.
├── AGENT.md              # Operating manual for the LLM agent — read this if you're Claude
├── raw/                  # Drop zone for source material
└── wiki/
    ├── index.md          # The map. Start here.
    ├── concepts/         # Atomic ideas, one per file
    ├── projects/         # Project-scoped aggregates
    ├── decisions/        # Dated, immutable decision logs
    └── playbooks/        # Reusable how-tos and prompt patterns
```

## How to use it

### Add new material

```bash
# Save your source into raw/ with a sequential number prefix
cp ~/Downloads/some-article.md raw/0007-some-article.md

# Open Claude Code in this directory and say "ingest"
```

### Ask a question

```bash
# Open Claude Code in this directory and just ask:
# "What did we decide about Mapbox vs Google Maps for CleanLA?"
# "Summarize what we know about MyLA311's API surface."
# "Find all decisions related to civic-app privacy."
```

The agent will navigate `wiki/index.md`, load the relevant pages, and answer from them.

### Tidy up

```bash
# Periodically, ask Claude Code: "tidy the wiki"
# This triggers: consolidating duplicates, fixing broken backlinks, splitting overgrown pages.
```

## Why not RAG?

RAG retrieves *chunks similar to a query*. Compilation produces *concept pages that a human-supervised LLM curated through synthesis*. For a personal wiki — a few hundred to a few thousand pages — compilation produces dramatically more coherent answers because every page is a deliberate, edited artifact rather than a noisy fragment.

The ceiling is real: somewhere around 10,000+ pages or when raw deposits start arriving faster than the agent can synthesize, retrieval becomes necessary. Below that ceiling, compilation wins on coherence, speed, and trust.

Karpathy's original framing: *"The wiki is the source of truth; the LLM is the compiler."*

## Conventions

See `AGENT.md` for the full operating manual (page format, ingestion rules, backlinks, decision-log immutability, etc). If you're a human reading this, the short version:

- Concept pages are atomic — 150–600 words, one idea per file.
- Decisions are dated and immutable. New circumstances mean a new dated decision that supersedes the old one.
- Every page is linked from `wiki/index.md` under exactly one cluster.
- Filenames are kebab-case.
- `[[wikilinks]]` are Obsidian-style and resolve to `wiki/**/<name>.md`.
