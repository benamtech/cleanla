---
title: CleanLA
tags: [project, civic-tech, los-angeles, web]
created: 2026-05-24
updated: 2026-05-24
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
  - ../decisions/2026-05-web-stack-over-mobile.md
  - ../decisions/2026-05-mapbox-over-google-maps.md
  - ../decisions/2026-05-deep-link-not-direct-submit.md
  - ../decisions/2026-05-no-candidate-branding.md
  - ../decisions/2026-05-on-device-face-blur-required.md
---

A nonpartisan civic transparency app for reporting and tracking street issues in Los Angeles — encampments, illegal dumping, graffiti, biohazards, overgrown lots. Public reports, deep-linked to [[../concepts/myla311-system|MyLA311]], with photos redacted in-browser before upload.

> **Naming note:** the project's original codename was "CleanLA Snap" (per `raw/0001-cleanla-snap-build-prompt.md`). Current shipping name on `benamtech/cleanla` is just **CleanLA**. This page covers both — they refer to the same project. "Snap" is also a [[../concepts/snapcrap-case-study|trademark risk]] and may not survive a USPTO/App-Store check anyway.

## Overview

**Form factor:** web (Next.js, mobile-responsive). Mobile app form factor explicitly deferred — see [[../decisions/2026-05-web-stack-over-mobile]].

**Core promise:** simplest possible loop from "I see a problem" to "the city and my neighborhood know about it." Faces and license plates redacted on-device (in-browser) before upload — raw photo never leaves the device.

**Strategic posture:** transparency layer first, submission layer second. The app does not depend on official ingestion to work — see [[../decisions/2026-05-deep-link-not-direct-submit]] and the analysis in [[../concepts/myla311-integration]].

**Institutional intent:** designed to be owned by a 501(c)(3) — most plausibly [[../concepts/cleanlawithme-movement|Clean LA With Me]] or via fiscal sponsorship through [[../concepts/la-civic-tech-funding-landscape|Community Partners LA]]. Plan the institutional form on day one to avoid the [[../concepts/snapcrap-case-study|Snapcrap founder-burnout collapse]].

**Brand neutrality:** no political candidate, party, or campaign reference anywhere. Codified in [[../decisions/2026-05-no-candidate-branding]].

## Current status (as of 2026-05-24)

**Phase 1: done.** Next.js + Supabase + PostGIS scaffold shipped to `webapp/` on `main` via `benamtech/f95ec95`. Health dashboard at `/` confirms env wiring and Supabase reachability. No user-facing features yet.

**Phase 1.5: validation pause (current).** The Map MVP is intentionally NOT being built yet. Two gating actions must complete first:

1. **Partnership conversation with [[../concepts/cleanlawithme-movement|Clean LA With Me]].** The app's design assumes Naula's operation will adopt and recommend it — that assumption needs testing before more engineering ships. Goal: 30–60 min call within 14 days of 2026-05-24.
2. **Legal counsel review.** Nonprofit ownership, fiscal sponsorship options, and the partnership structure all need an attorney's read before formal commitments or co-branding decisions.

In parallel during Phase 1.5: build the smallest possible landing-page version of the v1 mechanic — **photo + location + chronological feed + CSV export**. Web-only, no auth, no in-browser face blur yet. The point is a concrete artifact for the partnership conversation, not a public launch.

## Architecture (v1, web)

### Tech stack (current)

- **Next.js** 15+ (app router) + React + TypeScript
- **Supabase** v2 — Auth, Postgres 15 + PostGIS, Storage
- **Mapbox GL JS** (rationale: [[../decisions/2026-05-mapbox-over-google-maps]] — Mapbox vendor choice survives; the library is now `mapbox-gl`, not `@rnmapbox/maps`)
- **Tailwind** for styling — but every UI surface must route through the [369 design system](../../.claude/skills/369-design-system/SKILL.md) per the project's CLAUDE.md (non-negotiable)
- **Vercel** for deployment (per ben's `process.env.VERCEL` check in `webapp/src/app/page.tsx`)
- ESLint + Prettier + TypeScript strict

Full stack-pivot rationale: [[../decisions/2026-05-web-stack-over-mobile]].

### Data model (planned — to be confirmed when Map MVP begins)

Supabase Postgres + PostGIS. Provisional `reports` table:

```sql
create table reports (
  id                 uuid primary key default gen_random_uuid(),
  photo_url          text not null,                              -- blurred only; raw never uploaded
  location           geography(point, 4326) not null,
  created_at         timestamptz default now(),
  status             text check (status in ('open','in_progress','cleaned')) default 'open',
  service_type       text,                                       -- from MyLA311 96-type catalog
  note               text,
  user_id            uuid references auth.users,
  flag_count         int default 0,
  is_hidden          boolean default false,
  cleaned_photo_url  text,
  cleaned_at         timestamptz,
  cleaned_by_user_id uuid references auth.users
);
```

PostGIS gives clustered map queries natively without a separate spatial service. Flag rows live in a `flags` table with FK to `reports`. The 5-minute soft hold (anti-abuse delay between submission and public visibility) becomes a `created_at + interval '5 minutes' < now()` filter on public feeds.

For Phase 1.5 landing-page prototype: the same `reports` table works, with `user_id` nullable and the auth/flag/hide columns left as defaults until needed.

### Navigation surface (planned)

- `/` — landing (Phase 1: health dashboard; Phase 1.5: replaced with the prototype)
- `/report` — capture surface (Phase 2)
- `/map` — public clustered map (Phase 2)
- `/feed` — chronological feed (Phase 1.5 prototype + Phase 2)
- `/me` — user's own reports + settings (Phase 2)
- `/export.csv` — CSV export (Phase 1.5 prototype)

Phase 1.5 prototype likely consolidates to `/` (landing + capture form), `/feed`, and `/export.csv` — just enough to demonstrate the v1 mechanic for the partnership conversation.

### Privacy pipeline (principle: locked; web implementation: TBD)

Per [[../decisions/2026-05-on-device-face-blur-required]]: every uploaded photo must have faces and license plates redacted on-device before any upload. The raw, unredacted photo must never leave the user's device. **This principle is non-negotiable.** The Phase 1.5 prototype is exempted ONLY because it explicitly does not yet accept public submissions (it is a partnership demo, not a launched product).

Web implementation candidates (to be selected when the Phase 2 capture surface ships, then locked in a follow-on dated decision):

- **MediaPipe Tasks Web** — Google's on-device face/object detection, WebGPU/WASM backends. First-class face detection. Likely first to try.
- **face-api.js** — pre-trained models, browser-only, simpler integration. Older but battle-tested.
- **onnxruntime-web** — broadest model selection. Could host the same TFLite license-plate models the mobile path would have used.
- **Custom WebAssembly pipeline** — fallback only if the above prove too slow on lower-spec laptops.

License plate detection on web is genuinely harder than on mobile — no first-party SDK exists. Likely requires a bundled YOLO-class model run via onnxruntime-web. Open question, not blocking until Phase 2.

Companion safeguards (still mandatory, per the original decision):

- **Body-area submission block:** if >40% of frame area is detected as human body, block with the reframe prompt
- **Honest header copy** on the capture surface
- **Public flag-and-hide moderation** for anything the model missed

### Visual design — 369 design system

Per the project CLAUDE.md, the `369-design-system` skill is **non-negotiable** for any UI surface in `webapp/`, including the Phase 1.5 prototype. The original color brief (earth/green palette, status colors amber/blue/green, civic-modern aesthetic) is superseded by the 369 token set — navy `#001089`, manila `#f8eac7`, grey `#999999`, success `#228B22`, warning `#a60315` — with the type scale `{9, 12, 15, 18, 24, 30, 33, 36}` and 1px solid `#999999` borders on every container.

Status colors map onto existing 369 tokens: Open → warning amber, InProgress → headerCurrent blue, Cleaned → success green.

## Distribution strategy

**Conditional on the Phase 1.5 partnership conversation succeeding.** Pre-launch coordination with [[../concepts/cleanlawithme-movement]]'s ~69K Instagram audience. The [[../concepts/snapcrap-case-study]] launch playbook is the template — piggyback an existing engaged audience instead of building one from zero.

Marketing surface is carved out from any political content the developer publishes elsewhere ([[../decisions/2026-05-no-candidate-branding]]).

## Phase 2 (conditional on Phase 1.5 validation succeeding)

- **Capture surface** with on-device blur (face + plate) — full Map MVP feature
- **Public map** with PostGIS clustering, status-styled markers
- **"I cleaned this" loop** with before/after photo flow
- **Anonymous auth** via Supabase, 5-minute soft hold, flag/moderation
- **MyLA311 deep-link** with prefilled fields where the form honors them

Shape may change materially based on what the partnership conversation reveals.

## Phase 3 / later

- **Server-side Playwright submission agent** for MyLA311 — closes the loop, fragile, ToS exposure, requires legal review. See [[../concepts/myla311-integration]].
- **Volunteer-event coordination** — replaces Naula's ad-hoc Instagram DM coordination for Saturday meetups. Native scheduling, RSVPs, location pins.
- **Heatmaps for partner organizations** — aggregate report data, with explicit suppression of encampment data from public layers per [[../concepts/civic-app-legal-considerations]].
- **City partnership conversation** with LA's ITA — pursue in parallel; 12–24 month timeline; do not block v1 on it.
- **Mobile app revisit** — at what scale (or for what specific user behavior) does a native app become necessary that a PWA can't cover?

## Open questions

**Phase 1.5 gating questions (primary):**

- Does [[../concepts/cleanlawithme-movement|Naula / Clean LA With Me]] want to formally adopt or co-brand the app?
- What are the actual legal options for nonprofit ownership / fiscal sponsorship in LA civic tech in 2026? (Needs attorney review; [[../concepts/la-civic-tech-funding-landscape|Community Partners LA]] is a likely shortcut.)
- Should v1 ship a multi-stakeholder routing layer (LADWP, Metro, etc.) or LA-city-only? See [[../concepts/snap-send-solve-australia]] for the multi-stakeholder pattern at scale.

**Implementation questions (deferred until Phase 2 starts):**

- Which web on-device face/plate redaction library wins on accuracy + perf in 2026?
- PWA vs. plain SPA for v1? (Probably PWA — for service-worker caching of map tiles, offline report-drafting.)
- Anonymous Supabase auth vs. signed-cookie session for the no-auth Phase 1.5 prototype?
- CSV export shape — per-report rows? aggregate? geo-bounded?

**Strategic / external:**

- Which MyLA311 web-form query params are actually honored?
- Web hosting policy on platforms that publicly display photos of encampments? (For web: Supabase Storage content policy plus the user's own moderation — cleaner risk surface than App Store review.)
- Trademark check on the "CleanLA" name (and the legacy "CleanLA Snap" name) given Snap Inc.'s enforcement posture (see the [[../concepts/snapcrap-case-study|Snapcrap precedent]]).

## Recently de-risked (was an open question, now substantially resolved)

- **Institutional form / 501(c)(3) sustainability path.** [[../concepts/la-civic-tech-funding-landscape]] confirms grant runway is realistic ($30K-$150K Year-1 via LA2050 + Annenberg) and [[../concepts/la-civic-tech-funding-landscape|Community Partners LA]] provides 4-8 week fiscal sponsorship that unlocks grants without immediate incorporation. The institutional-form gap is no longer load-bearing in the same way; the question shifts from "is this viable?" to "Naula partnership vs. independent fiscal sponsorship — which by when?"
- **Realistic engagement benchmarks.** [[../concepts/civic-app-retention-benchmarks]] sets targets: 2-5% of serviceable population as MAU, 1-3% D30 retention, 60-80% one-time-reporter distribution. The "status loop = retention" claim is plausible but unvalidated — plan for a 2-5% lift, not a multiplier.

## Related concepts

- [[../concepts/myla311-system]] — the official system the app deep-links into
- [[../concepts/myla311-integration]] — strategic options and tradeoffs
- [[../concepts/on-device-photo-privacy]] — privacy pipeline principles (RN-specific implementation details now historical; principles survive)
- [[../concepts/civic-app-legal-considerations]] — doxxing, defamation, campaign-finance, UGC liability
- [[../concepts/rn-maps-landscape-2026]] — RN map landscape (historical context for the pre-pivot framing)
- [[../concepts/cleanlawithme-movement]] — the natural distribution partner
- [[../concepts/snapcrap-case-study]] — the direct precedent
- [[../concepts/civic-app-patterns-and-failure-modes]] — what worked and what killed similar US apps
- [[../concepts/international-civic-app-patterns]] — patterns from non-US precedents worth borrowing
- [[../concepts/civic-app-retention-benchmarks]] — what realistic engagement targets look like
- [[../concepts/la-civic-tech-funding-landscape]] — which foundations can credibly fund Year 1
- [[../concepts/open311-standard]] — why we can't just hit an API
- [[../concepts/seeclickfix-civicplus]] — possible long-term acquirer/partner outside LA
- [[../concepts/fixmystreet-uk]] — the durable nonprofit-owned reference model

## Related decisions

- [[../decisions/2026-05-web-stack-over-mobile]] — **current** stack and Phase 1.5 validation pause
- [[../decisions/2026-05-mapbox-over-google-maps]] — vendor choice (now `mapbox-gl` for web)
- [[../decisions/2026-05-deep-link-not-direct-submit]] — MyLA311 strategy (stack-agnostic, still active)
- [[../decisions/2026-05-no-candidate-branding]] — nonpartisan posture (stack-agnostic, still active)
- [[../decisions/2026-05-on-device-face-blur-required]] — privacy floor (principle still active, RN implementation retired)

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
- [[../decisions/2026-05-web-stack-over-mobile]]
- [[../decisions/2026-05-mapbox-over-google-maps]]
- [[../decisions/2026-05-deep-link-not-direct-submit]]
- [[../decisions/2026-05-no-candidate-branding]]
- [[../decisions/2026-05-on-device-face-blur-required]]
- [[../playbooks/one-shot-app-prompt]]
