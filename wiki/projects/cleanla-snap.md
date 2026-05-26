---
title: CleanLA
tags: [project, civic-tech, los-angeles, web, supabase, nextjs]
created: 2026-05-24
updated: 2026-05-25
related:
  - ../concepts/myla311-system.md
  - ../concepts/myla311-integration.md
  - ../concepts/on-device-photo-privacy.md
  - ../concepts/civic-app-legal-considerations.md
  - ../concepts/rn-maps-landscape-2026.md
  - ../concepts/cleanlawithme-movement.md
  - ../concepts/snapcrap-case-study.md
  - ../concepts/civic-app-patterns-and-failure-modes.md
  - ../concepts/civic-app-retention-benchmarks.md
  - ../concepts/la-civic-tech-funding-landscape.md
  - ../concepts/international-civic-app-patterns.md
  - ../concepts/la-civic-tech-competitive-landscape.md
  - ../concepts/la-city-partnership-mechanics.md
  - ../concepts/clwm-partnership-prep.md
  - ../concepts/california-nonprofit-legal-mechanics.md
  - ../concepts/civic-tech-founder-org-handoff-patterns.md
  - ../concepts/cleanla-clean-streets-mayor-scenario.md
  - ../decisions/2026-05-web-stack-over-mobile.md
  - ../decisions/2026-05-on-device-blur-restored.md
  - ../decisions/2026-05-ai-moderation-over-on-device-blur.md
  - ../decisions/2026-05-magic-link-auth.md
  - ../decisions/2026-05-x-only-sharing.md
  - ../decisions/2026-05-mapbox-over-google-maps.md
  - ../decisions/2026-05-deep-link-not-direct-submit.md
  - ../decisions/2026-05-no-candidate-branding.md
  - ../decisions/2026-05-on-device-face-blur-required.md
---

A nonpartisan civic transparency app for reporting and tracking street issues in Los Angeles — encampments, illegal dumping, graffiti, biohazards, overgrown lots. Public spot pages, X-shareable OG cards, server-side AI moderation. Deep-links to [[../concepts/myla311-system|MyLA311]].

> **Naming note:** the original codename was "CleanLA Snap" (per `raw/0001-cleanla-snap-build-prompt.md`). Current shipping name on `benamtech/cleanla` is **CleanLA**. This page covers both — same project. "Snap" is a trademark risk per the [[../concepts/snapcrap-case-study|Snapcrap precedent]] and was retired.

## Overview

**Form factor:** web (Next.js, mobile-responsive). Mobile-app form factor explicitly deferred — see [[../decisions/2026-05-web-stack-over-mobile]].

**Core promise:** public, photo-verified record of street issues across LA, with a "I cleaned this" before/after loop. AI-moderated for safety. Shareable via X with native OG cards.

**Strategic posture:** transparency layer first, submission layer second. The app does not depend on official ingestion — see [[../decisions/2026-05-deep-link-not-direct-submit]].

**Institutional intent:** designed to be owned by a 501(c)(3) — most plausibly [[../concepts/cleanlawithme-movement|Clean LA With Me]] or via fiscal sponsorship through [[../concepts/la-civic-tech-funding-landscape|Community Partners LA]]. Pre-attorney prep in [[../concepts/california-nonprofit-legal-mechanics]].

**Brand neutrality:** no political candidate, party, or campaign reference. [[../decisions/2026-05-no-candidate-branding]].

## Current status (as of 2026-05-25)

**Phase 6 (Sharing) code-complete.** Phase 7 (Scale + Launch) is next, gated on Vercel-deployed verification of X Card previews.

Engineering shipped Phases 3, 3.5, 4, 5, 6 in roughly 24 hours after the original Phase 1.5 "validation pause" was set down. Validation work continues in parallel rather than as a gate.

### What is built

| Phase | What it does | Key code |
|---|---|---|
| 1 (Foundation) | Next.js + Supabase + PostGIS scaffold, env contract, `/admin/health` | `webapp/src/lib/`, `/admin/health/page.tsx` |
| 2 (Map MVP) | Read-only Mapbox map of LA spots, viewport-bounded fetch, clustering, detail sheet | `webapp/src/features/map/CleanLAMap.tsx`, `/api/spots/route.ts` |
| 3 (Report MVP) | Magic-link auth, profile, authenticated report submission | `webapp/src/features/reports/`, `/api/reports`, `/api/profile`, `/auth/callback`, `/profile` |
| 3.5 (Verification) | Server-side media validation (source, metadata, freshness, GPS accuracy, PostGIS distance, error fallback) | `webapp/src/lib/verification/verify-media.ts` |
| 4 (Cleanup) | "I cleaned this" before/after capture | `webapp/src/features/spots/CleanupSheet.tsx`, `/api/cleanup` |
| 5 (AI Moderation) | Claude Haiku 4.5 vision auto-moderates submitted media + `/admin/moderation/` review queue | `webapp/src/lib/moderation/moderate-media.ts`, `/api/admin/moderation/[mediaId]` |
| **5.5 (On-device blur) — PLANNED** | MediaPipe Tasks Web face blur on device → upload blurred → existing Phase 5 moderation as safety net. Restores "raw photo never leaves device" claim. ~4 days eng for Tier 1 (face); ~8 days total for Tier 2 (face + plate via PaddleOCR/YOLOv8 ONNX) | Per [[../decisions/2026-05-on-device-blur-restored]]; new files in `webapp/src/lib/blur/` (TBD), `webapp/public/workers/blur-worker.js` (TBD) |
| 6 (Sharing) | Public spot pages at `/s/[id]` + X-only sharing + OG cards | `webapp/src/app/s/[id]/page.tsx`, `/api/og/spot/[id]`, `webapp/src/features/sharing/ShareActions.tsx` |

Stack runtime deps: `@anthropic-ai/sdk` (Claude Haiku 4.5), `@supabase/ssr`, `@supabase/supabase-js`, `mapbox-gl ^3.24`, `react-map-gl ^8.1`, `next`, `react`, `react-dom`.

### Validation tracks (parallel to engineering)

The "Phase 1.5 validation pause" framing from 2026-05-24 was not honored as a hard gate — engineering kept shipping. Validation still matters; it just runs in parallel:

1. **Partnership conversation with [[../concepts/cleanlawithme-movement|Clean LA With Me]].** Target: 30-60 min call within 14 days of 2026-05-24. Tactical prep: [[../concepts/clwm-partnership-prep]].
2. **Legal counsel review.** Nonprofit ownership, fiscal sponsorship, founder IP transfer, board governance. Pre-attorney prep: [[../concepts/california-nonprofit-legal-mechanics]].
3. **Phase 6 X Card preview verification.** Requires a Vercel production deploy + paste of a live `/s/[id]` URL into X compose. Gates Phase 7.

## Architecture (current)

### Tech stack

- **Next.js 15+** (app router) + React + TypeScript
- **Supabase v2** — Magic-link Auth, Postgres 15 + PostGIS, Storage
- **Mapbox GL JS** (`mapbox-gl ^3.24`, `react-map-gl ^8.1`) — rationale: [[../decisions/2026-05-mapbox-over-google-maps]]
- **Claude Haiku 4.5 vision** for server-side AI moderation — rationale: [[../decisions/2026-05-ai-moderation-over-on-device-blur]]
- **X intent-link sharing + Next.js `ImageResponse` OG cards** — rationale: [[../decisions/2026-05-x-only-sharing]]
- **Tailwind, ESLint, Prettier, Vercel deploy** (`process.env.VERCEL` aware)

### Data model (current)

7 Supabase migrations live (`webapp/supabase/migrations/`). Reports table includes `compute_media_distance_m` RPC for PostGIS-based geo-verification (Phase 3.5).

### Routes

- `/` — Mapbox map of LA spots (Phase 2)
- `/s/[id]` — Public spot share page with OG card (Phase 6)
- `/profile` — User profile (Phase 3)
- `/admin/health` — env + Supabase status check
- `/admin/moderation` — Phase 5 moderation queue
- `/api/spots`, `/api/reports`, `/api/cleanup`, `/api/profile`, `/api/profile/stats`
- `/api/admin/moderation/[mediaId]`, `/api/og/spot/[id]`
- `/auth/callback`, `/manifest.webmanifest`

### Privacy / moderation pipeline (current direction)

Per [[../decisions/2026-05-on-device-blur-restored]] (supersedes [[../decisions/2026-05-ai-moderation-over-on-device-blur|the brief moderation-only architecture]]):

1. User captures photo on device
2. **Phase 5.5 (planned, 4-day eng):** MediaPipe Tasks Web detects faces → canvas Gaussian-blurs them → HEIC→JPEG → upload BLURRED image to Supabase
3. **Phase 6+ Tier 2:** PaddleOCR / custom YOLOv8 ONNX adds license-plate detection → blur plates too
4. **Phase 3.5 server-side verification** runs: source, metadata, freshness, GPS accuracy, PostGIS distance, error fallback
5. **Phase 5 Claude Haiku 4.5 vision moderation** classifies the blurred image (defense in depth)
6. Approved → public after 5-min soft hold; flagged → `/admin/moderation` queue
7. Public surfaces (`/`, `/s/[id]`, `/api/spots`) only show approved + non-hidden items

**Status:** Currently shipping moderation-only (Phase 5 live; Phase 5.5 on-device blur is the next engineering milestone, scoped at 4 days for face-only Tier 1). Raw photo currently IS uploaded; once Phase 5.5 ships, raw photo never leaves the device for supported browsers. Fallback path uploads raw with `redaction_method: "server_only"` flag for unsupported devices (logged as KPI).

Empirical feasibility study: `raw/0016-web-on-device-blur-feasibility.md`.

### Visual design — 369 design system

Per project CLAUDE.md, `369-design-system` skill is non-negotiable for all UI surfaces in `webapp/`. The button / card / type-scale rules apply to map controls, report sheet, cleanup sheet, share actions, OG card layout, moderation queue admin.

## Decisions log

- [[../decisions/2026-05-web-stack-over-mobile]] — **current stack** (Next.js + Supabase web)
- [[../decisions/2026-05-on-device-blur-restored]] — **CURRENT 2026-05-25 afternoon** — MediaPipe Tasks Web restores on-device blur as floor; Claude Haiku 4.5 stays as defense in depth. Empirical feasibility (`raw/0016`) flipped the engineering math from 2-4 weeks to 4 days for Tier 1
- [[../decisions/2026-05-ai-moderation-over-on-device-blur]] — **superseded same day** by `on-device-blur-restored`. Brief moderation-only architecture; preserved as historical record + tradeoffs analysis
- [[../decisions/2026-05-magic-link-auth]] — Supabase magic-link only for v1
- [[../decisions/2026-05-x-only-sharing]] — Phase 6 ships X-only intent links + Web Share API + COPY LINK
- [[../decisions/2026-05-mapbox-over-google-maps]] — Mapbox vendor; library is `mapbox-gl` on web
- [[../decisions/2026-05-deep-link-not-direct-submit]] — CleanLA v1 deep-links to MyLA311, does not direct-submit (stack-agnostic, still active)
- [[../decisions/2026-05-no-candidate-branding]] — CleanLA is and remains brand-neutral
- [[../decisions/2026-05-on-device-face-blur-required]] — original RN-specific decision; principle RESTORED via `on-device-blur-restored` with a web stack (MediaPipe Tasks Web)

## Distribution strategy

**Pre-launch coordination with [[../concepts/cleanlawithme-movement|Clean LA With Me]]'s social audience.** Conditional on the Phase 1.5 partnership conversation succeeding. Tactical prep: [[../concepts/clwm-partnership-prep]]. The [[../concepts/snapcrap-case-study]] launch playbook is the template — piggyback an existing engaged audience instead of building one from zero.

Marketing surface is carved out from any political content the developer publishes elsewhere ([[../decisions/2026-05-no-candidate-branding]]).

## Phase 7 (next)

- Vercel production deploy with all env vars (Supabase prod URL/keys + Mapbox + Anthropic)
- Apply Phase 3-6 migrations to hosted Supabase
- Verify X Card previews on a real domain
- Public launch coordinated with CLWM partnership conversation outcome
- Privacy policy / user-facing copy revision to reflect server-side moderation reality

## Phase 8 / later (speculative)

- **MyLA311 deep-link integration** (per [[../decisions/2026-05-deep-link-not-direct-submit]]) — the spot share page could add a "Also submit to MyLA311" affordance; gated on form-prefill empirical work (per `raw/0008-myla311-api-empirical-test.md` — currently no public API)
- **Volunteer-event coordination** — replaces Naula's Instagram-DM-based cleanup scheduling; native hub structure per [[../concepts/clwm-partnership-prep]]
- **Heatmaps for partner orgs** — aggregate report data; suppression of encampment-identifying detail per [[../concepts/civic-app-legal-considerations]]
- **City partnership conversation** (per [[../concepts/la-city-partnership-mechanics]]) — Phase 3 / 12-24 month timeline; reconnaissance, not pitching
- **Mobile app revisit** — at what scale or for what specific user behavior does a native app become necessary that a PWA can't cover?

## Open questions

**Phase 1.5 gating (still primary):**

- Does [[../concepts/cleanlawithme-movement|Naula / Clean LA With Me]] want to formally adopt or co-brand the app? (Conversation prep: [[../concepts/clwm-partnership-prep]])
- What are the actual legal options for nonprofit ownership / fiscal sponsorship in LA civic tech in 2026? (Pre-attorney prep: [[../concepts/california-nonprofit-legal-mechanics]])
- Is Clean LA With Me actually incorporated as a 501(c)(3)? Verify via IRS EIN lookup before the call

**Phase 6 / 7 (technical):**

- Does the X Card preview render correctly with the bottom 80px navy strip + X overlay on a real Vercel-deployed `/s/[id]`?
- What's the production-Supabase migration state and how does it diverge from local?
- What's the moderation false-negative rate at v1 model settings? (Establish baseline after first 100-1000 submissions)
- What's the privacy-policy language for "your photo is uploaded encrypted and reviewed by AI before appearing publicly"? (Legal review)

**Strategic / external:**

- ~~Which MyLA311 web-form query params are honored?~~ **CLOSED 2026-05-24** — empirically NO public API.
- Trademark check on the "CleanLA" name given Snap Inc.'s enforcement posture (per [[../concepts/snapcrap-case-study|Snapcrap precedent]])
- A future "Clean The Streets" mayor scenario — positioning prep in [[../concepts/cleanla-clean-streets-mayor-scenario]]

## Recently de-risked

- **Institutional form / sustainability path** — [[../concepts/la-civic-tech-funding-landscape|funding landscape research]] confirms grant runway is realistic ($30K-$150K Year-1 via LA2050 + Annenberg); fiscal sponsorship via Community Partners LA unlocks grant eligibility in 4-8 weeks. Question shifts from "is this viable?" to "Naula partnership vs. independent fiscal sponsorship — which, by when?"
- **Realistic engagement benchmarks** — [[../concepts/civic-app-retention-benchmarks]]: 2-5% MAU/serviceable-pop, 1-3% D30 retention, 60-80% one-time-reporter distribution. Plan for 2-5% lift, not a multiplier.
- **MyLA311 third-party API question** — empirically NO (per `raw/0008`). Deep-link is the only public path; partnership unlocks negotiated Salesforce data access.
- **Competitive positioning** — no direct competitor in LA street-issue civic-tech space per [[../concepts/la-civic-tech-competitive-landscape]]; partnership pitch with Naula has room.

## Related concepts

- [[../concepts/myla311-system]] — the official system the app deep-links into
- [[../concepts/myla311-integration]] — strategic options and tradeoffs
- [[../concepts/on-device-photo-privacy]] — historical principle now superseded for the web build
- [[../concepts/civic-app-legal-considerations]] — doxxing, defamation, campaign-finance, UGC liability
- [[../concepts/rn-maps-landscape-2026]] — historical RN map landscape (pre-pivot context)
- [[../concepts/cleanlawithme-movement]] — the natural distribution partner
- [[../concepts/snapcrap-case-study]] — the direct precedent; also the trademark warning
- [[../concepts/civic-app-patterns-and-failure-modes]] — what worked and what killed similar US apps
- [[../concepts/international-civic-app-patterns]] — patterns from non-US precedents
- [[../concepts/civic-app-retention-benchmarks]] — realistic engagement targets
- [[../concepts/la-civic-tech-funding-landscape]] — which foundations can fund Year 1
- [[../concepts/la-civic-tech-competitive-landscape]] — who else is in this space
- [[../concepts/la-city-partnership-mechanics]] — the path to formal LA city partnerships
- [[../concepts/clwm-partnership-prep]] — Phase 1.5 tactical prep for the Naula call
- [[../concepts/california-nonprofit-legal-mechanics]] — pre-attorney prep
- [[../concepts/civic-tech-founder-org-handoff-patterns]] — patterns from successful and failed handoffs
- [[../concepts/cleanla-clean-streets-mayor-scenario]] — scenario planning for a future pro-tech / pro-enforcement mayor
- [[../concepts/open311-standard]] — why we can't just hit an API
- [[../concepts/seeclickfix-civicplus]] — possible long-term partner outside LA
- [[../concepts/fixmystreet-uk]] — durable nonprofit-owned reference model

## Backlinks

- [[../concepts/myla311-system]]
- [[../concepts/myla311-integration]]
- [[../concepts/on-device-photo-privacy]]
- [[../concepts/civic-app-legal-considerations]]
- [[../concepts/rn-maps-landscape-2026]]
- [[../concepts/cleanlawithme-movement]]
- [[../concepts/snapcrap-case-study]]
- [[../concepts/civic-app-patterns-and-failure-modes]]
- [[../concepts/fixmystreet-uk]]
- [[../concepts/la-civic-tech-competitive-landscape]]
- [[../concepts/la-city-partnership-mechanics]]
- [[../concepts/clwm-partnership-prep]]
- [[../concepts/california-nonprofit-legal-mechanics]]
- [[../concepts/civic-tech-founder-org-handoff-patterns]]
- [[../concepts/cleanla-clean-streets-mayor-scenario]]
- [[../decisions/2026-05-web-stack-over-mobile]]
- [[../decisions/2026-05-ai-moderation-over-on-device-blur]]
- [[../decisions/2026-05-magic-link-auth]]
- [[../decisions/2026-05-x-only-sharing]]
- [[../decisions/2026-05-mapbox-over-google-maps]]
- [[../decisions/2026-05-deep-link-not-direct-submit]]
- [[../decisions/2026-05-no-candidate-branding]]
- [[../decisions/2026-05-on-device-face-blur-required]]
- [[../playbooks/one-shot-app-prompt]]
