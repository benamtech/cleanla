---
title: Pivot to web stack (Next.js + Supabase) — Expo + Firebase mobile path retired for v1
tags: [decision, stack, web, supabase, nextjs, validation]
created: 2026-05-24
updated: 2026-05-25
status: active
supersedes:
  - ./2026-05-mapbox-over-google-maps.md
  - ./2026-05-on-device-face-blur-required.md
related:
  - ../projects/cleanla-snap.md
  - ../concepts/civic-app-patterns-and-failure-modes.md
  - ../concepts/cleanlawithme-movement.md
  - ../concepts/snapcrap-case-study.md
---

## Context

The original framing of [[../projects/cleanla-snap]] (captured in `raw/0001-cleanla-snap-build-prompt.md` on 2026-05-24) specified a mobile-first stack: Expo + React Native + Firebase + `@rnmapbox/maps` + `react-native-vision-camera` + ML Kit/Vision. The mobile choice was driven by the "phone in hand, camera-native" capture pattern and the assumption that civic users would want an app.

Between that prompt and now, the project's actual first commit (`f95ec95` "Implement Phase 1 foundation" by `benamtech`, 2026-05-24) shipped a different stack: **Next.js + Supabase + PostGIS + Mapbox GL JS**, in `webapp/`. The de facto direction diverged from the wiki without a recorded decision.

Compounding factor: the partnership assumption — that [[../concepts/cleanlawithme-movement|Clean LA With Me]] would adopt and recommend the app — is unvalidated. Engineering against an unvalidated partnership before a partnership conversation is wasteful. See [[../concepts/snapcrap-case-study]] for what happens when a civic-tech project ships ahead of distribution alignment.

## Decision

**CleanLA's v1 is a Next.js web app, not a mobile app.** Stack:

- Next.js (app router) + React + TypeScript
- Supabase: Auth, Postgres 15 + PostGIS, Storage
- Mapbox GL JS
- Tailwind + ESLint + Prettier
- Vercel for deployment

**Phase 1.5 is a deliberate validation pause.** No Map MVP engineering proceeds until:

1. Partnership conversation with [[../concepts/cleanlawithme-movement|Clean LA With Me]] reaches a clear yes/no on adoption (target: 30–60 min call within 14 days of 2026-05-24)
2. Legal counsel reviews nonprofit ownership, fiscal sponsorship options, and the partnership structure

In parallel during Phase 1.5: ship the smallest landing-page prototype of the v1 mechanic — photo + location + chronological feed + CSV export. Web-only, no auth, no in-browser face blur yet. Artifact for the partnership conversation, not a public launch.

**One app, no mobile/admin split** as of 2026-05-24. The same Next.js codebase serves citizen reporting AND any partner / admin views. Splitting comes later, if at all.

## Rationale

1. **Faster time to first user.** Web ships without app-store review, no native build infrastructure, no EAS dev client, no TestFlight. A working landing page exists the moment Vercel deploys.
2. **Validation before investment.** The mobile stack's larger upfront cost (native modules, dev client builds, app-store policy review for encampment photos) doesn't make sense before the partnership question is answered. Web lets the project run the partnership test at minimum cost.
3. **Broader device reach for a civic-utility tool.** Anyone with a browser can use it — no install friction, no platform exclusion, no app-store gatekeeping (which is itself an open question for apps that publicly display encampment photos).
4. **PWA covers most of the mobile gap.** Service workers + camera API + geolocation + Web Push close the bulk of the native UX gap on modern phones. If a native app later proves necessary, the data layer (Supabase) and the privacy pipeline (browser ML) carry over.
5. **Supabase chosen because already wired.** Ben's Phase 1 commit shipped the Supabase scaffold with PostGIS migration. PostGIS is native to Supabase Postgres — no separate spatial service. Switching backends to recover the original Firebase choice would tear out load-bearing Phase 1 work.
6. **Mapbox vendor choice survives.** The reasoning in [[./2026-05-mapbox-over-google-maps]] (cross-platform parity, Mapbox Studio styling, native clustering, durable migration path to MapLibre) all applies equally on the web SDK. Library swaps: `@rnmapbox/maps` → `mapbox-gl`. The EAS dev client requirement disappears entirely on web.

## Alternatives considered

- **Stay mobile-first (Expo + Firebase per `raw/0001`).** Rejected — slow to first user. Mobile native costs (build infra, app-store review for encampment photos) don't pay back before the partnership test resolves. The original prompt was written before the partnership question was prioritized.
- **Web + mobile in parallel.** Rejected for Phase 1.5 — Phase 1.5 IS a validation pause; parallel mobile engineering is the opposite of pausing. Revisit after Phase 1.5 if partnership + legal both clear.
- **Firebase web (keep original backend, swap frontend only).** Rejected — Supabase is already wired in Phase 1. Switching backends to honor a non-load-bearing earlier framing is wasted motion.
- **Static site (no backend) for Phase 1.5.** Rejected — the Phase 1.5 landing-page prototype still needs photo + location + feed + CSV, which requires a backend. Supabase is the lightest path given Phase 1.

## Consequences

**Implementation deltas from the prior framing:**

- **Privacy pipeline must be re-architected for the browser.** The principle from [[./2026-05-on-device-face-blur-required]] survives in full: raw photo never uploaded, faces + plates redacted on-device, >40% body-area submission block, honest header copy. The implementation specifics (`react-native-vision-camera` frame processors, ML Kit, Apple Vision) do not. Browser candidates to evaluate when the capture surface ships: MediaPipe Tasks Web, `face-api.js`, `onnxruntime-web`, or a custom WebAssembly pipeline. License plate detection on web has no first-party SDK and likely needs a bundled YOLO-class model. **A separate dated decision will lock the web implementation when the capture surface is built.**
- **Mapbox library swap.** `@rnmapbox/maps` → `mapbox-gl`. Mapbox Studio styles port over without change. The native-module / EAS dev client clauses in [[./2026-05-mapbox-over-google-maps]] do not apply on web.
- **Auth layer.** Supabase Auth instead of Firebase Auth. Anonymous-auth pattern (anonymous → optional email upgrade) carries conceptually; tooling differs.
- **Data model.** Firestore document model → Postgres relational + PostGIS spatial. Better fit for clustered geospatial queries; requires migration discipline (Supabase migrations in `webapp/supabase/migrations/`).

**Strategic deltas:**

- [[../concepts/rn-maps-landscape-2026]] and [[../concepts/on-device-photo-privacy]] become historical context for the original framing. Both remain accurate as standalone concept pages but no longer drive implementation choices.
- `raw/0001-cleanla-snap-build-prompt.md` is now historical — it describes a path not taken. Per the wiki's "don't delete `raw/`" rule, it stays as audit trail.
- The [[./2026-05-deep-link-not-direct-submit]] decision is unaffected — deep-linking to MyLA311 from a web app is the same shape as from a mobile app.
- The [[./2026-05-no-candidate-branding]] decision is unaffected — nonpartisan posture is stack-agnostic.

**Open implementation questions** (deferred to a follow-on decision when Phase 2 starts):

- Web on-device face/plate detection library choice
- PWA vs. plain SPA for v1 (probably PWA — for service-worker caching of the map tiles and offline report-drafting)
- Anonymous Supabase auth vs. signed-cookie session for the no-auth Phase 1.5 prototype
- CSV export shape (per-report rows? aggregate? geo-bounded?)

## Re-evaluation triggers

Revisit this decision if any of:

- **Partnership conversation reveals a mobile app is required** (e.g., CLWM volunteers explicitly need an app, not a website, to coordinate during cleanup events)
- **PWA capability gap blocks core UX** (e.g., camera + on-device ML perf on common phones is unacceptable; iOS Safari restrictions break the capture flow)
- **A legal review concludes web hosting carries a worse risk posture than mobile** (unlikely but possible — e.g., GDPR / CCPA interpretation around web ML)
- **Phase 1.5 validation fails outright** — in which case re-evaluation goes broader than the stack, all the way back to whether the project ships at all

## Backlinks

- [[../projects/cleanla-snap]]
- [[./2026-05-mapbox-over-google-maps]]
- [[./2026-05-on-device-face-blur-required]]
- [[./2026-05-ai-moderation-over-on-device-blur]]
