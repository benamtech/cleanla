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

## Design system — NON-NEGOTIABLE

This project uses the **369 design system** for all UI, design, and data-visualisation work — including the `webapp/` Next.js surface, any HTML the wiki renders, and any visual artifact this project produces.

**Hard rule:** Before writing any component, any CSS class, any inline style, any Tailwind utility, or any visual decision, invoke `369-design-system` via the Skill tool. Skipping the skill is a bug. Output that violates the 8 non-negotiable rules in the skill is a bug, not a preference, and must not ship.

This applies to: new components, existing component edits, charts, dashboards, tables, landing pages, marketing surfaces, the Map MVP, the validation landing page (Phase 1.5), and any HTML rendered from wiki content. The validation prototype is not exempt because "it's just a prototype" — the 369 rules are cheap to follow correctly the first time and expensive to retrofit.

**Skill location:** [`.claude/skills/369-design-system/SKILL.md`](.claude/skills/369-design-system/SKILL.md) — thin router with 8 non-negotiable rules + a reference table that points to `.claude/skills/369-design-system/references/` (loaded on demand: `visual-rules.md`, `architecture.md`, `engines.md`, `cards.md`, `tufte.md`, `tufte-principles.md`, `analytical-design.md`).

**The 8 non-negotiable rules at a glance** (full text in the skill):
1. Spacing — multiples of 3 ONLY (3, 6, 9, 12, 15, 18, …); never 4, 5, 7, 8, 10, 14, 16, 20
2. Border radius — `0` everywhere; one exception is `50%` for circular pins
3. Borders — `1px solid #999999` on every container; no 2px, no thick, no colored except success/warning
4. Typography — Helvetica Neue eText Pro, 12px body, scale `{9, 12, 15, 18, 24, 30, 33, 36}`, UPPERCASE labels
5. Colors — 8 core tokens + 8 SSM pin colors; **never** Tailwind defaults (`gray-100`, `blue-500`, etc. are bugs)
6. Decoration — NONE (no shadows, no gradients, no blur, no icon libraries; text glyphs only `★ ✓ ✕ → ← • [+] [−] [×] i`)
7. Run engines, don't guess — for data use `presentation()`; for entities use `resolveAny()`; hand-picking a chart defeats the system
8. Same input → same output — the system is deterministic; if the HTML differs across runs, something is wrong

**Enforcement workflow:**
- Before any UI/data-visualization task: invoke the skill, even if you "remember" the rules
- During: keep the rules-table reference open
- Before shipping: run the self-check at the bottom of `SKILL.md` (Red flags / Stop and Fix table)
- After: if a rule was violated, it's a defect — file an issue or fix in-place

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
