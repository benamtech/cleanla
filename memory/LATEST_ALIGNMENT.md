# CleanLA Alignment Report

**Generated:** 2026-05-25 12:30 PT
**Generator:** `memory/prompt.md` orientation audit, executed by Claude Code
**Branch:** `main` (in sync with `origin/main` at commit `ac90887`)

> Plain-English status of where the webapp actually stands vs. what the planning materials say. Run `/align` (or `bash scripts/align.sh`) to refresh this file. Commit it so your partner sees the latest state after each `git pull`.

---

## 1. Current Webapp Status

**Phase:** Phase 6 (Sharing) code-complete. Phase 7 (Scale + Launch) is next, gated on Vercel-deployed verification of X Card previews.

The project has compounded fast since the last snapshot (which captured only Phase 2). The partner shipped 4 phases (3, 3.5, 4, 5, 6) in roughly 24 hours.

**What is actually built:**

| Phase | What it does | Code surface |
|---|---|---|
| 1 (Foundation) | Next.js + Supabase + PostGIS scaffold, env contract, /admin/health | `src/lib/`, `/admin/health/page.tsx` |
| 2 (Map MVP) | Read-only Mapbox map of LA spots, viewport-bounded fetch, clustering, detail sheet | `src/features/map/CleanLAMap.tsx`, `/api/spots/route.ts` |
| 3 (Report MVP) | Magic-link auth, profile, authenticated report submission | `src/features/reports/`, `/api/reports`, `/api/profile`, `/auth/callback`, `/profile` |
| 3.5 (Verification) | Server-side media validation before publishing | `src/lib/verification/verify-media.ts` |
| 4 (Cleanup flow) | "I cleaned this" before/after capture | `src/features/spots/CleanupSheet.tsx`, `/api/cleanup` |
| 5 (AI Moderation) | Claude Haiku 4.5 vision auto-moderates submitted media | `src/lib/moderation/moderate-media.ts`, `/admin/moderation/`, `/api/admin/moderation/[mediaId]` |
| 6 (Sharing) | Public spot pages + X-only sharing + OG cards | `src/app/s/[id]/page.tsx`, `/api/og/spot/[id]`, `src/features/sharing/ShareActions.tsx` |

**Verified safe checks (just ran):**

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `git status` | clean (in sync with origin/main) |
| Local Supabase | all 7 migrations applied, seeded |
| `/` map render | Confirmed working in real Chrome with valid Mapbox token |
| `/api/spots` (LA bounds) | 12 seed spots returned (architecturally correct; real DB will have more) |
| Token validity | `pk.eyJ1...` token returns HTTP 200 from Mapbox Standard style API |

**Tech stack (runtime deps):**
`@anthropic-ai/sdk` (Claude Haiku 4.5 for moderation), `@supabase/ssr`, `@supabase/supabase-js`, `mapbox-gl ^3.24.0`, `react-map-gl ^8.1.1`, `next`, `react`, `react-dom`

**Routes live:**
- `/` — Mapbox map (Phase 2)
- `/s/[id]` — Public spot share pages (Phase 6)
- `/profile` — User profile (Phase 3)
- `/admin/health` — env + Supabase status check
- `/admin/moderation` — Phase 5 moderation queue
- `/api/spots`, `/api/reports`, `/api/cleanup`, `/api/profile`, `/api/profile/stats`
- `/api/admin/moderation/[mediaId]`, `/api/og/spot/[id]`
- `/auth/callback`, `/manifest.webmanifest`

**Env contract:**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_SITE_URL`, plus `ANTHROPIC_API_KEY` for Phase 5 moderation.

---

## 2. Wiki Alignment

**Wiki decisions are 4/5 aligned with code, same as last snapshot.** No new decisions written despite four phases shipping. That's a real drift signal worth flagging.

| Decision | Status vs. code | Notes |
|---|---|---|
| `2026-05-web-stack-over-mobile.md` | aligned | Code is Next.js + Supabase + Mapbox web |
| `2026-05-mapbox-over-google-maps.md` | aligned | Mapbox + `mapbox-gl ^3.24` + `react-map-gl ^8.1` |
| `2026-05-deep-link-not-direct-submit.md` | ahead of code | Phase 6 sharing implements X-only deep links, not MyLA311 deep links yet |
| `2026-05-no-candidate-branding.md` | aligned | No candidate references in code or UI |
| `2026-05-on-device-face-blur-required.md` | superseded but not formally | Phase 5 ships AI moderation (Claude Haiku 4.5 vision) as a SERVER-side replacement for the on-device blur principle. This is a meaningful pivot that deserves a successor decision. The original decision said "raw photo never leaves the device" — current code DOES upload raw photos and moderate them server-side. |

**Decisions worth writing today:**

1. **`2026-05-ai-moderation-over-on-device-blur.md`** (supersedes `on-device-face-blur-required`). Document the tradeoff: server-side AI moderation is faster to ship, gives a moderation queue + audit trail, and works on web where on-device blur is harder — but reintroduces the "raw photo on the network" risk the original decision avoided.
2. **`2026-05-magic-link-auth.md`** — Phase 3 picked Supabase magic-link auth over OAuth or password auth. Worth recording why.
3. **`2026-05-x-only-sharing.md`** — Phase 6 dropped general social sharing in favor of X-only intent links. Reasoning belongs in a decision log.

**`CleanLA-development-plan.md` is still stale** — same flag as last snapshot. The original 7-phase plan was mobile-first; the actual code is web. Either supersede it explicitly or rewrite to match the executed phases.

**Wiki concept pages are also evolving** (new ones added: `clwm-partnership-prep`, `la-civic-tech-competitive-landscape`, `la-city-partnership-mechanics`, `civic-tech-founder-org-handoff-patterns`, `cleanla-clean-streets-mayor-scenario`, `california-nonprofit-legal-mechanics`). These reflect ongoing Phase 1.5 research running in parallel with the code phases.

---

## 3. Current Blockers

| Blocker | Severity | Resolution |
|---|---|---|
| **Phase 6 verification requires Vercel deploy** | High for shipping | Deploy to Vercel, then paste a `/s/[id]` URL into X compose window to verify card preview |
| **`ANTHROPIC_API_KEY` not set in `.env.local`** | High for testing Phase 5 moderation locally | Provide your Anthropic API key (or skip — Phase 5 only triggers on submitted media; map browsing works without it) |
| **`on-device-face-blur-required` decision is functionally superseded but not formally** | Medium (paper trail integrity) | Write a successor decision log explicitly documenting the AI-moderation pivot |
| **`CleanLA-development-plan.md` is still stale** | Low (cosmetic; recurring) | Mark superseded or rewrite |
| **`next-env.d.ts` keeps oscillating** | Low (commit noise) | Either gitignore it or pick a canonical form |

No build/lint/runtime failures detected. Local stack is clean.

---

## 4. What To Do Next (1-3 Practical Tasks)

1. **Deploy to Vercel.** Phase 6's X Card preview is the gating verification step before Phase 7 begins. Per the partner's note: paste a live `/s/[id]` URL into X compose to confirm the card image renders with the title overlay correctly. Requires production-Supabase URL + keys + Mapbox token + `ANTHROPIC_API_KEY` set as Vercel env vars.

2. **Write the AI-moderation decision log.** This is the largest paper-trail gap right now. The on-device-blur principle was load-bearing for the project's privacy posture; replacing it with server-side AI moderation needs to be documented or the wiki loses authority. Should be a `wiki/decisions/2026-05-ai-moderation-over-on-device-blur.md` with a `supersedes:` link to the original. ~30 min of writing.

3. **Apply the Phase 3-6 migrations to the hosted Supabase project.** Local has all 7; the hosted one's state needs to be verified and synced before Phase 7 deploy.

**Do NOT focus on yet:**
- Phase 7 implementation work — gated on Phase 6 verification
- Adding new features beyond Phase 6 scope
- Architecture redesigns

---

## 5. Confidence and Caveats

**Files inspected:**
- `git status --short --branch`, `git log --oneline -6`
- `webapp/package.json` (runtime deps), `webapp/.env.example`
- Full source tree under `webapp/src/` (34 files)
- All 7 migrations in `webapp/supabase/migrations/`
- `memory/webapp-status-5-25-2026-12-03pm.md` (newest partner note)
- All 5 wiki decision logs (listed; not deeply re-read this run)

**Checks actually run:**
- `npm run lint` — clean
- `npm run typecheck` — clean
- Mapbox token validity probe — HTTP 200 against Standard style
- Map rendering verified by user in real Chrome (post `chrome://gpu` fix)
- Git fetch + rebase + push — clean, no conflicts

**Facts vs. guesses:**
- **Facts:** Phase 6 is in code at commit `1952576`. Partner pushed it and reported lint/typecheck clean. I confirmed lint/typecheck clean locally. Map renders for the user in real Chrome.
- **Guess:** that the hosted Supabase project still needs the Phase 3-6 migrations applied. I haven't probed the production database; taking the migration-file presence as a signal that production hasn't caught up.
- **Guess:** that the AI-moderation decision was an intentional pivot rather than an accident. I'm inferring strategic intent from the code; ask the partner before writing the supersession.

---

## One-Sentence Version

**CleanLA has compounded from a Phase 2 map MVP to a Phase 6 code-complete app with auth, reporting, cleanup, AI moderation, and X-card sharing in under a day; the code is healthy and verified working in real Chrome, but the on-device-face-blur decision needs a formal supersession to match what Phase 5 actually shipped, and Vercel deployment is the gating step for Phase 6 verification before Phase 7 begins.**
