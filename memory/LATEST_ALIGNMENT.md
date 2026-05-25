# CleanLA Alignment Report

**Generated:** 2026-05-24 19:23 PT
**Generator:** `memory/prompt.md` orientation audit, executed by Claude Code
**Branch:** `main` (in sync with `origin/main` at commit `0334f70`)

> Plain-English status of where the webapp actually stands vs. what the planning materials say. Run `/align` (or `bash scripts/align.sh`) to refresh this file. Commit it so your partner sees the latest state after each `git pull`.

---

## 1. Current Webapp Status

**Phase:** Phase 2 Map MVP — read-only Mapbox map of LA cleanup spots. The Phase 1.5 validation landing page (form + feed + CSV) was retired in commit `0334f70` after the Phase 2 author shipped `d2e1396`.

**What is actually built and verified:**

- **Home (`/`)** renders `CleanLAMap` — a Mapbox-based pitched-camera view of LA with clustered category-colored pins, a spot count strip, a detail sheet, and custom `[+] / [-]` zoom controls.
- **`GET /api/spots`** accepts `west,south,east,north,limit` bounds; returns spots filtered by viewport via the `spots_in_bounds` PostGIS RPC. Rejects bad bounds with HTTP 400.
- **`/admin/health`** is an internal env/Supabase status check.
- **`/manifest.webmanifest`** is the PWA manifest.
- **`globals.css`** enforces the 369 baseline: `border-radius: 0` everywhere, Helvetica Neue, white bg / navy text.
- **3 migrations**, all applied locally:
  - `20260524234500_enable_postgis.sql` — enables PostGIS in the `extensions` schema
  - `20260525000100_reports_table.sql` — Phase 1.5 reports table + photo bucket (kept; Phase 2 reads FROM it)
  - `20260525000200_phase2_spots.sql` — Phase 2 `spots` + `spot_media` + enums + spatial index + `spots_in_bounds` RPC + report-to-spot conversion
- **Seed data** loads 12 realistic LA spots across categories and neighborhoods.

**Verified safe checks (all clean after `.next` cache clear):**

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean (after `rm -rf .next tsconfig.tsbuildinfo`) |
| `npm run build` | clean — 4 routes: `/`, `/admin/health`, `/api/spots`, `/manifest.webmanifest` |
| `GET /api/spots?west=...&south=...&east=...&north=...` | HTTP 200, returns 12 LA seed spots |
| `GET /api/spots` (no params) | HTTP 400 with validation error |
| `GET /admin/health` | HTTP 200 |
| `GET /` (no Mapbox token) | HTTP 200, renders 369 "MAPBOX TOKEN MISSING" panel (graceful) |

**Tech stack actually in `package.json` dependencies:**
`@supabase/ssr`, `@supabase/supabase-js`, `mapbox-gl`, `next`, `react`, `react-dom`, `react-map-gl`

**Env contract (`.env.example`):**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_SITE_URL`

---

## 2. Wiki Alignment

**Wiki is fresh and aligned with the code on every active decision.** The 5 decision logs in `wiki/decisions/` reflect the current direction:

| Decision | Status vs. code | Notes |
|---|---|---|
| `2026-05-web-stack-over-mobile.md` | ✅ aligned | Code is Next.js + Supabase + Mapbox web; supersedes the old mobile/Firebase path |
| `2026-05-mapbox-over-google-maps.md` | ✅ aligned (per its `superseded_by` note) | Mapbox vendor choice survives the web pivot; library is now `mapbox-gl` not `@rnmapbox/maps` |
| `2026-05-deep-link-not-direct-submit.md` | ⚠️ ahead of code | Wiki says deep-link to MyLA311; Phase 2 is map-only and doesn't deep-link yet. Not drift — it's a future feature, but flag it. |
| `2026-05-no-candidate-branding.md` | ✅ aligned | No candidate references anywhere in code, copy, or UI |
| `2026-05-on-device-face-blur-required.md` | ⏸ paused | Principle stands (raw never leaves device), but the web implementation is TBD. Phase 2 has no capture flow yet, so this is dormant rather than violated. |

**`CleanLA-development-plan.md` is STALE.** It still describes the original 7-phase mobile-first plan: Foundation → Map MVP → Report MVP → Cleanup Flow → Moderation → Sharing → Scale. The current code:

- Is web-first, not mobile (per `web-stack-over-mobile` decision)
- Skipped straight to "Map MVP" (Phase 2 in the doc) without doing Report MVP, Cleanup Flow, or Moderation
- The "I cleaned this" before/after capture flow described in the plan does not exist in code

**Mismatch classification:** *code is intentionally ahead of the dev plan; wiki decisions reflect the actual direction.* The dev plan should either be archived or rewritten to match Phase 2's actual trajectory. Recommend marking it `## Status: SUPERSEDED — see wiki/decisions/2026-05-web-stack-over-mobile.md`.

**Wiki pages that look stale because implementation moved past them:**
- The wiki's `civic-app-retention-benchmarks` page assumes a reporter-wedge product. Phase 2 is map-only; the retention question shifts to "do people open the map twice?" and the benchmarks need reframing.
- `civic-tech-founder-org-handoff-patterns` (new) is directly relevant but post-dates the current Phase 2 work — useful for the next partnership decision, not a misalignment.

**Wiki pages that are forward-looking and should NOT distract Phase 2:**
- `clwm-partnership-prep` — tactical prep for the Naula meeting; aligned with the design doc's gating action
- `la-city-partnership-mechanics` — the path to formal LA partnerships (12-24 mo timeline)
- `la-civic-tech-competitive-landscape` — environmental scan, useful for positioning but not blocking

---

## 3. Current Blockers

| Blocker | Severity | Resolution |
|---|---|---|
| **`NEXT_PUBLIC_MAPBOX_TOKEN` not set in `webapp/.env.local`** | High (blocks the map UI; route still 200s but renders error panel) | Free token from https://account.mapbox.com/access-tokens; paste into `.env.local`; dev server hot-reloads |
| **Remote Supabase migration not applied** (per memory note) | High for production; non-blocker locally | Run `npx supabase db push` against the connected hosted project to apply migrations including the search_path fix in `20260525000200_phase2_spots.sql` |
| **`CleanLA-development-plan.md` is stale** | Low (cosmetic) | Mark superseded or rewrite to match Phase 2's actual roadmap |
| **`.next` cache can produce false typecheck failures** | Low (caught by build) | `align` script clears it before checking |

No build/lint/runtime failures detected. The webapp is healthy end-to-end on localhost.

---

## 4. What To Do Next (1-3 Practical Tasks)

1. **Set `NEXT_PUBLIC_MAPBOX_TOKEN` in `webapp/.env.local`.** Grab a free public token (`pk.*`) at https://account.mapbox.com/access-tokens. The dev server hot-reloads `.env.local`, so the map appears within seconds. Without this, you and your partner can both run the app but neither sees the actual map.

2. **Apply the search-path-fixed `20260525000200_phase2_spots.sql` to the hosted Supabase project.** The memory note specifically called this out as the production blocker. Local works; production doesn't yet.

3. **Decide what to do about `CleanLA-development-plan.md`.** It's the largest stale doc and any new collaborator will read it and get confused. Options: (a) prepend a `> SUPERSEDED — see wiki/decisions/2026-05-web-stack-over-mobile.md and webapp/PHASE-2-IMPLEMENTATION-PLAN.md` banner, (b) rewrite to match Phase 2, or (c) move to `wiki/decisions/_archive/` with a redirect note.

**Do NOT focus on yet** (per Phase 2 scope in `memory/webapp-status-5-24-2026-7-02pm.md`):
- User login or authentication
- New report submission UI
- Camera capture or photo upload
- Cleanup verification flow
- Moderation queue
- Public sharing pages
- Analytics
- Architecture redesign

---

## 5. Confidence and Caveats

**Files inspected (confirmed-read):**
- `git status --short --branch`, `git log --oneline -10`
- `webapp/package.json`, `webapp/.env.example`
- `webapp/src/app/page.tsx`, `layout.tsx`, `globals.css`
- `webapp/src/app/api/spots/route.ts`
- `webapp/src/features/map/CleanLAMap.tsx` (tree-listed)
- `webapp/src/features/spots/{types,display,geojson}.ts` (tree-listed)
- `webapp/src/lib/{env,mapbox,supabase}/*.ts` (tree-listed)
- `webapp/supabase/migrations/*.sql` (all 3)
- `webapp/supabase/seed.sql` (verified loads 12 spots)
- `webapp/README.md`
- `webapp/PHASE-2-HANDOFF.md`, `PHASE-2-IMPLEMENTATION-PLAN.md` (listed)
- `CleanLA-development-plan.md` (headers only)
- `wiki/index.md`, all 5 decision logs (listed)
- `memory/prompt.md`, `memory/webapp-status-5-24-2026-7-02pm.md`

**Checks actually run:**
- `npm run lint` — clean
- `npm run typecheck` — clean after `.next` cache clear
- `npm run build` — clean, 4 routes
- HTTP probes on `/`, `/admin/health`, `/manifest.webmanifest`, `/api/spots?bounds=…`, `/api/spots` (no params)
- `supabase status` and `supabase db reset --local` — succeeded

**Facts vs. guesses:**
- **Facts:** the routes return what I said, the migrations apply cleanly with the search_path fix, the build is green, the wiki decision logs match the code direction on 4 of 5 items.
- **Guess:** that the hosted Supabase project still needs the migration. I did not connect to it; I'm taking the memory note at face value.
- **Guess:** that `clwm-partnership-prep`, `la-city-partnership-mechanics`, and `la-civic-tech-competitive-landscape` are accurate — I listed them but didn't verify their content this run.

---

## One-Sentence Version

**CleanLA Phase 2 is a healthy, building, lint-clean Mapbox map of LA cleanup spots backed by a PostGIS spots table; it works locally with a Mapbox token, the wiki decisions agree with the code direction, the only stale doc is `CleanLA-development-plan.md`, and the hosted Supabase project still needs the search-path-fixed migration applied.**
