# CleanLA

A nonpartisan civic transparency app for Los Angeles street issues — encampments, illegal dumping, graffiti, biohazards, overgrown lots. Two taps from "I see a problem" to a public, deep-linked report to MyLA311. Faces and license plates redacted in-browser before upload.

> **Status:** Phase 1 foundation in place. Map MVP next.

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
- **Nonprofit-owned.** Designed to be owned by a 501(c)(3) (likely [Clean LA With Me](https://www.instagram.com/cleanlawithme/)), not any individual or campaign.

## Roadmap

**Phase 1 — done.** Next.js + Supabase + PostGIS scaffold, env contract, health dashboard at `/`.

**Phase 2 — next.** Map MVP: capture surface (camera + on-device redaction), report submit, public clustered map, "I cleaned this" before/after.

**Phase 3.** MyLA311 integration. Deep-link in v1; server-side submission agent later (see wiki for tradeoffs).

## Wiki

The wiki under `wiki/` is the project's compiled knowledge base — civic-tech precedents, legal considerations, tech-stack analysis, and dated immutable decisions. Start at [`wiki/index.md`](wiki/index.md).

Drop new sources into `raw/` and say "ingest" to Claude Code to compile them into the wiki. See [`AGENT.md`](AGENT.md) for the agent's operating rules.

> *Heads-up: parts of the wiki still reflect an earlier stack choice (Expo mobile + Firebase). They need new dated decisions that supersede the old ones to match the actual Next.js + Supabase direction.*

## License

TBD. Source-available pre-1.0.
