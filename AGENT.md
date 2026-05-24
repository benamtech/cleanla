# AGENT.md — Operating Manual for the LLM Wiki

You are opening a Karpathy-style LLM Wiki. This is not a RAG system. There is no vector database, no embedding pipeline, no retrieval layer. Knowledge lives as plain markdown files in `wiki/`, compiled from raw deposits in `raw/` by you (the LLM agent). When the user asks a question, you load the relevant wiki pages directly into your context window.

If the wiki ever grows past ~a few thousand pages, this approach breaks and a retrieval layer becomes necessary. Until then, compilation wins.

---

## The compile loop

```
raw/  ──ingest──►  wiki/concepts/   (atomic ideas)
                   wiki/projects/   (project-scoped aggregates)
                   wiki/decisions/  (immutable, dated, supersedable)
                   wiki/playbooks/  (reusable how-tos)
                   wiki/index.md    (the map, grouped by cluster)
```

1. The user drops raw material into `raw/` (articles, transcripts, papers, code, screenshots, notes — anything).
2. The user says **"ingest"** (or equivalent).
3. You read every new file in `raw/` fully.
4. You survey `wiki/index.md` and any pages it points to that look related.
5. You **synthesize**, not transcribe: update existing pages where they're relevant, create new pages where needed, add backlinks, refine prior summaries where the new material clarifies or contradicts them.
6. You update `wiki/index.md` for any new pages and bump `updated:` frontmatter on any touched page.

Synthesis means: the wiki page is *yours*, written in your own structure, with the raw material as evidence. Do not paste raw text into wiki pages — quote sparingly, cite always, but the page itself must be a compiled artifact.

---

## Page format rules

Every wiki page begins with YAML frontmatter:

```yaml
---
title: Human-readable title
tags: [tag-one, tag-two]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../projects/some-project.md
  - ../concepts/another-concept.md
---
```

Every wiki page ends with a `## Backlinks` section listing pages that reference it. You maintain this manually — when you add a `[[link]]` from page A to page B, you must also add A to B's backlinks list.

Inter-page references use Obsidian-style `[[wikilinks]]`:
- `[[snapcrap-case-study]]` resolves to `wiki/concepts/snapcrap-case-study.md`
- A `[[wikilink]]` that doesn't yet match a file is not an error — it's a TODO marker. Future ingestion may create that page.

Filenames are kebab-case. Lowercase. No spaces. No leading numbers (except `decisions/` which start with `YYYY-MM-`).

### Atomic concept pages (`concepts/`)

- One idea per file. If a page exceeds ~600 words or covers two distinct ideas, split it.
- Target 150–600 words.
- Lead with a one-paragraph "what is this" summary so a future reader can decide in 10 seconds whether to keep reading.
- Cite sources inline with URLs when the material came from external research.

### Project pages (`projects/`)

- Longer than concepts. Aggregate links to relevant concepts, decisions, and playbooks.
- Sections: Overview · Current architecture · Open questions · Related concepts · Related decisions.
- These are living documents — refactor freely as the project evolves.

### Decision logs (`decisions/`)

- Filename: `YYYY-MM-short-slug.md`.
- **Immutable once written.** If a decision is reversed or amended, write a *new* dated decision that supersedes the old one and link them with `supersedes:` / `superseded_by:` frontmatter fields.
- Sections: Context · Decision · Rationale · Alternatives considered · Consequences.

### Playbooks (`playbooks/`)

- Reusable how-to patterns. Templates, prompt patterns, repeated workflows.
- Should be copy-pasteable. Treat them like macros for future-you.

---

## Ingestion rules

1. **Read first, write second.** Read every new raw file fully before touching the wiki.
2. **Survey before creating.** Check `wiki/index.md` and grep concept names. Prefer updating an existing page over creating a near-duplicate.
3. **One concept per page.** If new material spans multiple concepts, split it into multiple updates rather than a single mega-page.
4. **Backlinks both ways.** When page A links to page B, page B's `## Backlinks` section must list A.
5. **Index is canonical.** Every page must be linked from `wiki/index.md` under exactly one cluster.
6. **Bump `updated:`** on any page you modify.
7. **Keep raw deposits as evidence.** Don't delete or rewrite `raw/` files after ingestion. They are the audit trail.
8. **Number raw deposits sequentially.** First deposit is `raw/0001-*.md`, second is `raw/0002-*.md`, etc.

---

## Refinement rules

- **Contradiction handling.** When new material contradicts an existing page, do not silently overwrite. Add a `## Revised (YYYY-MM-DD)` section with the new understanding and a one-line note about what changed and why. The reader should be able to see the wiki's belief evolve over time.
- **Tidy on request.** When the user says "tidy", consolidate redundant pages, fix broken backlinks, tighten the index, and split any page that has crept past 600 words.
- **Stale flags.** If a page references a project state, version, or external resource that may have changed, add a `## Verify` note at the bottom listing what to re-check before relying on the page.

---

## Query rules

When the user asks a question:

1. Skim `wiki/index.md` first to identify candidate pages.
2. Read those pages into context.
3. Answer from what you read. **Do not invent sources.**
4. If the wiki doesn't cover the question, say so explicitly and offer to research and ingest the answer.
5. After answering a non-trivial question, consider whether the answer itself should become a new wiki page or update an existing one. Ask the user before writing.

---

## What this wiki is NOT

- Not a journal. No daily notes, no stream-of-consciousness.
- Not a code repo. Code samples live as illustrations inside concept pages; full project code lives elsewhere.
- Not a search index. The structure *is* the index — `wiki/index.md` is the entry point.
- Not append-only. Pages are refined and rewritten over time. Only `decisions/` are immutable.

---

## Conventions for this specific wiki

- Calendar dates are absolute (`2026-05-24`), never relative (`yesterday`, `last Thursday`).
- All URLs preserved verbatim from source material — they are the citation layer.
- When in doubt, write a smaller page. Atomic over comprehensive.
- The wiki serves the human, not the agent. Optimize for re-reading by a person who hasn't been in this conversation.
