# CLAUDE.md

This file is auto-loaded by Claude Code on every session in this directory. Read it first.

## What this repo is

A Karpathy-style **LLM Wiki**: plain markdown knowledge base, compiled from raw deposits in `raw/` into structured pages in `wiki/`, queried by loading pages into the LLM context window.

Not a RAG system. Not a journal. Not a code project. See `README.md` for the human-facing overview.

## What to do when the user says "ingest"

1. List `raw/` and identify any file newer than the most recent `updated:` timestamp in `wiki/`.
2. Read every new raw file fully.
3. Open `wiki/index.md` and identify candidate pages that may need updating.
4. Synthesize: update existing pages where the new material clarifies, extends, or contradicts them; create new pages where the material introduces something not yet covered.
5. Maintain `[[wikilinks]]` and `## Backlinks` sections both ways.
6. Update `wiki/index.md` for any new pages and bump `updated:` frontmatter on touched pages.
7. Confirm: list of files created/touched + one open question or gap noticed in the source material.

**Full ingestion rules are in `AGENT.md`. Read it before your first ingestion in a session.**

## What to do when the user asks a question

1. Skim `wiki/index.md`.
2. Read candidate pages into context.
3. Answer from them. Cite page paths.
4. If the wiki doesn't cover it, say so and offer to research.

## What to do when the user says "tidy"

Consolidate duplicates, fix broken `[[wikilinks]]` and backlinks, split any page that has crept past 600 words, tighten `wiki/index.md`.

## Hard rules

- **Atomic concept pages.** One idea per file in `concepts/`. 150–600 words. Split if longer.
- **Immutable decisions.** Files in `decisions/` are never rewritten. New circumstances → new dated decision that supersedes the old one (use `supersedes:` / `superseded_by:` frontmatter).
- **Backlinks both ways.** When page A links to page B, B's `## Backlinks` section must list A.
- **Synthesis, not transcription.** Wiki pages are *your* compiled artifacts. Quote raw material sparingly, cite always, but the page itself must be a deliberate composition.
- **Preserve URLs.** All source URLs from raw material must survive into the compiled wiki pages.
- **Absolute dates only.** `2026-05-24`, never "yesterday" or "last week".
- **Don't delete `raw/` files.** They are the audit trail.

## File conventions

- Filenames are kebab-case, no leading numbers (exception: `decisions/YYYY-MM-*.md`).
- Every wiki page has YAML frontmatter: `title`, `tags`, `created`, `updated`, `related`.
- Every wiki page ends with a `## Backlinks` section.
- `[[wikilink]]` resolves to `wiki/**/<name>.md`. A wikilink with no matching file is a TODO marker, not an error.

## Where to look first

- `AGENT.md` — full operating manual
- `wiki/index.md` — the map of compiled knowledge
- `raw/` — source material, numbered in order of arrival
