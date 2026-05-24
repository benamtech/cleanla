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

## Design system

This project uses the **369 design system** for all UI, design, and data-visualisation work — relevant when the CleanLA Snap mobile app is built and for any visual artifacts the wiki itself produces. Before any UI, design, or data work, invoke `369-design-system`. Output that violates the rules in that skill is a bug, not a preference.

The skill lives at [`.claude/skills/369-design-system/SKILL.md`](.claude/skills/369-design-system/SKILL.md). Summary: spacing in multiples of 3 (Bauhaus + sacred geometry), 1px solid grey borders, zero border-radius (with one exception), Helvetica Neue at a fixed 9/12/15/18/24/30/33/36 scale, ten colour tokens only, no shadows/gradients/blur, no emoji codepoints, and a deterministic data → visualisation decision tree backed by Cleveland & McGill (1984) and Wilkinson (1999).

## Where to look first

- `AGENT.md` — full operating manual
- `wiki/index.md` — the map of compiled knowledge
- `raw/` — source material, numbered in order of arrival
- `.claude/skills/369-design-system/SKILL.md` — design rules for any UI/data work

## GBrain Configuration (configured by /setup-gbrain)
- Mode: local-stdio
- Engine: pglite
- Config file: ~/.gbrain/config.json (mode 0600)
- Setup date: 2026-05-24
- MCP registered: yes (user scope)
- Artifacts repo: https://github.com/navruhtra/gstack-artifacts-loveamerica
- Artifacts sync: artifacts-only
- Current repo policy: unset (no `origin` remote)

## GBrain Search Guidance (configured by /sync-gbrain)
<!-- gstack-gbrain-search-guidance:start -->

GBrain is set up and synced on this machine. The agent should prefer gbrain
over Grep when the question is semantic or when you don't know the exact
identifier yet. Two indexed corpora available via the `gbrain` CLI:
- This repo's code (registered as `gstack-code-<repo>` source).
- `~/.gstack/` curated memory (registered as `gstack-brain-<user>` source via
  the existing federation pipeline).

Prefer gbrain when:
- "Where is X handled?" / semantic intent, no exact string yet:
    `gbrain search "<terms>"` or `gbrain query "<question>"`
- "Where is symbol Y defined?" / symbol-based code questions:
    `gbrain code-def <symbol>` or `gbrain code-refs <symbol>`
- "What calls Y?" / "What does Y depend on?":
    `gbrain code-callers <symbol>` / `gbrain code-callees <symbol>`
- "What did we decide last time?" / past plans, retros, learnings:
    `gbrain search "<terms>" --source gstack-brain-<user>`

Grep is still right for known exact strings, regex, multiline patterns, and
file globs. The brain auto-syncs incrementally on every gstack skill start.
Run `/sync-gbrain` to force-refresh, `/sync-gbrain --full` for full reindex.

<!-- gstack-gbrain-search-guidance:end -->

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
