# CleanLA

A nonpartisan civic transparency app for Los Angeles street issues — encampments, illegal dumping, graffiti, biohazards, overgrown lots. Two taps from "I see a problem" to a public, deep-linked report to MyLA311. Faces and license plates redacted in-browser before upload.

> **Status:** Phase 1 foundation in place. Validation landing page next — partnership and legal review gate the Map MVP.

## Stack

- **Next.js** (app router) + React + TypeScript
- **Supabase** — Auth, Postgres + PostGIS, Storage
- **Mapbox GL JS**
- Tailwind, ESLint, Prettier

## Repository layout

```
.
├── webapp/              # The app (Next.js + Supabase + PostGIS)
│   ├── src/             # app/, lib/, components/
│   ├── supabase/        # local dev config + migrations
│   └── README.md        # dev quickstart
├── wiki/                # LLM-compiled knowledge base — civic-tech research,
│   │                    # tech-stack analysis, legal terrain, dated decisions
│   └── index.md         # start here
├── raw/                 # Source material (articles, transcripts, prompts)
├── AGENT.md             # Operating manual for the LLM agent
└── CLAUDE.md            # Auto-loaded session pointer for Claude Code
```

## Quickstart

```bash
cd webapp
cp .env.example .env.local        # fill Supabase + Mapbox values
npm install
npx supabase start                # local Postgres + Studio
npm run dev                       # http://localhost:3000
```

Required env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_SITE_URL`.

## Product principles

- **Nonpartisan.** No candidate, party, or campaign reference anywhere in code, copy, UI, or shared content.
- **Privacy first.** Every uploaded photo runs through an in-browser blur pipeline — faces and license plates redacted; raw images never leave the browser.
- **Public by default.** Every report is public unless flagged + auto-hidden via moderation.
- **Nonprofit-owned.** Designed to be owned by a 501(c)(3) — [Clean LA With Me](https://www.instagram.com/cleanlawithme/) is the natural fit, pending a partnership conversation. Not owned by any individual or campaign.

## Current focus (week of 2026-05-24)

Pre-engineering validation pass. The Map MVP is paused until two gating actions complete:

1. **Partnership conversation with [Clean LA With Me](https://www.cleanlawithme.org/).** The app's design assumes Naula's operation will adopt and recommend it — that assumption needs testing before more engineering ships. Goal: 30-60 min call within 14 days.
2. **Legal counsel review.** Nonprofit ownership, fiscal sponsorship options, and the partnership structure all need an attorney's read before any formal commitments or co-branding decisions.

While those happen: build the smallest possible landing-page version of the v1 mechanic — photo + location + chronological feed + CSV export. Web-only, no mobile yet, no auth, no in-browser face blur yet. The point is a concrete artifact for the partnership conversation, not a public launch.

Full diagnostic, agreed premises, and approach analysis live in the office-hours design doc (maintainer's local `~/.gstack/projects/benamtech-cleanla/` tree; not committed). Downstream `/plan-ceo-review` and `/plan-eng-review` skills discover it automatically.

## Roadmap

**Phase 1 — done.** Next.js + Supabase + PostGIS scaffold, env contract, health dashboard at `/`.

**Phase 1.5 — validation (current).** Landing-page prototype + partnership conversation + legal review. No further engineering on Phase 2 until this completes. See *Current focus* above.

**Phase 2 — conditional on validation.** Map MVP: capture surface (camera + on-device redaction), report submit, public clustered map, "I cleaned this" before/after. Shape may change based on what the partnership conversation reveals.

**Phase 3.** MyLA311 integration. Deep-link in v1; server-side submission agent later (see wiki for tradeoffs).

## Wiki

The wiki under `wiki/` is the project's compiled knowledge base — civic-tech precedents, legal considerations, tech-stack analysis, and dated immutable decisions. Start at [`wiki/index.md`](wiki/index.md).

Drop new sources into `raw/` and say "ingest" to Claude Code to compile them into the wiki. See [`AGENT.md`](AGENT.md) for the agent's operating rules.

> *Heads-up: parts of the wiki still reflect an earlier stack choice (Expo mobile + Firebase). They need new dated decisions that supersede the old ones to match the actual Next.js + Supabase direction.*

## License

TBD. Source-available pre-1.0.
