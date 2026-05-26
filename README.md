# CleanLA

A nonpartisan civic transparency app for Los Angeles street issues — encampments, illegal dumping, graffiti, biohazards, overgrown lots. Two taps from "I see a problem" to a public, shareable spot page. **Faces and license plates blurred on-device before upload** (Phase 5.5, planned this week). Server-side AI moderation (Claude Haiku 4.5 vision) reviews every submitted image as defense in depth.

> **Status:** Phase 6 (Sharing) code-complete. Phase 7 (Scale + Launch) is next, gated on Vercel-deployed verification of X Card previews.

## Stack

- **Next.js** (app router) + React + TypeScript
- **Supabase** — Auth (magic-link), Postgres 15 + PostGIS, Storage
- **Mapbox GL JS** (`mapbox-gl ^3.24`, `react-map-gl ^8.1`)
- **Claude Haiku 4.5 vision** for server-side AI moderation (`@anthropic-ai/sdk`)
- Tailwind, ESLint, Prettier
- Vercel for production deployment

## Repository layout

```
.
├── webapp/              # The app (Next.js + Supabase + PostGIS + Claude)
│   ├── src/             # app/, features/, lib/
│   ├── supabase/        # local dev config + 7 migrations
│   ├── PHASE-3-IMPLEMENTATION-PLAN.md
│   ├── PHASE-3.5-MEDIA-VERIFICATION-PLAN.md
│   └── README.md        # dev quickstart
├── memory/              # Per-phase engineering status notes + LATEST_ALIGNMENT.md
├── wiki/                # LLM-compiled knowledge base — research, decisions, scenarios
│   └── index.md         # start here
├── raw/                 # Source material (research dumps, build prompts, transcripts)
├── AGENT.md             # Operating manual for the LLM agent
└── CLAUDE.md            # Auto-loaded session pointer for Claude Code
```

## Live routes

- `/` — Mapbox map of LA spots (Phase 2)
- `/s/[id]` — Public spot share page with OG card (Phase 6)
- `/profile` — User profile (Phase 3)
- `/admin/health` — env + Supabase status check
- `/admin/moderation` — Phase 5 AI moderation queue
- `/api/spots`, `/api/reports`, `/api/cleanup`, `/api/profile`, `/api/profile/stats`
- `/api/admin/moderation/[mediaId]`, `/api/og/spot/[id]`
- `/auth/callback`, `/manifest.webmanifest`

## Quickstart

```bash
cd webapp
cp .env.example .env.local        # fill Supabase + Mapbox + Anthropic values
npm install
npx supabase start                # local Postgres + Studio
npm run dev                       # http://localhost:3000
```

Required env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `ANTHROPIC_API_KEY` (Phase 5 moderation).

## Product principles

- **Nonpartisan.** No candidate, party, or campaign reference anywhere in code, copy, UI, or shared content. (Decision: [`2026-05-no-candidate-branding`](wiki/decisions/2026-05-no-candidate-branding.md))
- **Privacy first (defense in depth).** Phase 5.5 (planned) blurs faces and license plates on-device via MediaPipe Tasks Web before any upload — raw photos never leave the device on supported browsers. Phase 5 Claude Haiku 4.5 vision moderation runs on the already-blurred image server-side as a safety net. A `/admin/moderation` queue lets a human override on edge cases. See [`2026-05-on-device-blur-restored`](wiki/decisions/2026-05-on-device-blur-restored.md) for the architecture and `raw/0016-web-on-device-blur-feasibility.md` for the empirical study that flipped the math.
- **5-minute soft hold + flag-and-hide.** Submitted spots don't appear publicly for 5 minutes; flagged items hide pending review.
- **Nonprofit-owned (planned).** Designed to be owned by a 501(c)(3) — [Clean LA With Me](https://www.instagram.com/cleanlawithme/) is the natural partner. Pre-attorney prep in [`wiki/concepts/california-nonprofit-legal-mechanics.md`](wiki/concepts/california-nonprofit-legal-mechanics.md).

## Phase history

| Phase | What it does | Status |
|---|---|---|
| **1 — Foundation** | Next.js + Supabase + PostGIS scaffold, env contract, `/admin/health` | done |
| **2 — Map MVP** | Read-only Mapbox map of LA spots, viewport-bounded fetch, clustering, detail sheet | done |
| **3 — Report MVP** | Magic-link auth, profile, authenticated report submission | done |
| **3.5 — Verification** | Server-side media validation (source, metadata, freshness, GPS, PostGIS distance) | done |
| **4 — Cleanup flow** | "I cleaned this" before/after capture | done |
| **5 — AI Moderation** | Claude Haiku 4.5 vision auto-moderates submitted media + review queue | done |
| **5.5 — On-device blur** | MediaPipe Tasks Web face-blur before upload; raw photo never leaves device | planned (4 days eng) |
| **6 — Sharing** | Public spot pages at `/s/[id]` + X-only sharing + OG cards | done (code) |
| **7 — Scale + Launch** | Vercel production deploy, monitoring, public launch | gated on Phase 5.5 + X Card preview verification |

Phase 7 is gated on Vercel-deployed verification of X Card previews (the X Card Validator is dead — only way to verify is paste a live `/s/[id]` URL into X compose).

## Validation tracks (parallel to engineering)

Engineering kept shipping while strategic validation runs in parallel. Two threads to close before public launch:

1. **Partnership conversation with [Clean LA With Me](https://www.cleanlawithme.org/).** The distribution thesis depends on Naula's operation adopting and recommending the app. Tactical prep: [`wiki/concepts/clwm-partnership-prep.md`](wiki/concepts/clwm-partnership-prep.md). Target: 30-60 min call within 14 days of 2026-05-24.
2. **Legal counsel review.** Nonprofit ownership, fiscal sponsorship options (Community Partners LA), founder IP transfer, board governance. Pre-attorney prep: [`wiki/concepts/california-nonprofit-legal-mechanics.md`](wiki/concepts/california-nonprofit-legal-mechanics.md).

## Wiki

The wiki under `wiki/` is the project's compiled knowledge base — civic-tech precedents, legal considerations, tech-stack analysis, dated immutable decisions, scenario planning. Start at [`wiki/index.md`](wiki/index.md).

Drop new sources into `raw/` and say "ingest" to Claude Code to compile them. See [`AGENT.md`](AGENT.md) for the agent's operating rules.

**Engineering status:** `memory/LATEST_ALIGNMENT.md` is the canonical engineering-state snapshot; per-phase notes live in `memory/webapp-status-*.md`.

## License

TBD. Source-available pre-1.0.
