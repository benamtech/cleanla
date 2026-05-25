# CleanLA Webapp Status - May 25, 2026, Phase 4 Complete

When someone marks a spot as cleaned in CleanLA, the app now captures a live after-photo, verifies it on the server using the same 6-step GPS+PostGIS check as reports, and immediately tells the user whether the spot was marked cleaned — before the form closes. Cleaned spots appear with a green-stroked pin on the map. A new profile page shows each user's submitted reports, verified reports, and cleanups completed.

This note updates `memory/webapp-status-5-25-2026-9-53am.md` and reflects the Phase 4 Cleanup Flow implementation completed in this session.

## Plain-English Summary

Phase 4 Cleanup Flow is now implemented, tested, and live in hosted Supabase.

Users can now close the civic loop: report a problem, then come back and document that they cleaned it. The cleanup flow requires a live after-photo and GPS — the same trust model as reporting. The server only marks a spot `cleaned` if the after-photo passes the full verification check. Unverified or mismatched GPS leaves the spot status unchanged and explains why.

Cleaned spots show a green stroke on the map. Tapping a cleaned spot in the detail sheet shows the before photo and the after photo side by side. The profile page at `/profile` shows real contribution counts derived from server-confirmed data — never client-maintained counters.

Phase 5 (Moderation Queue) is the logical next step.

## What Changed Since The Last Memory Note

The previous `5-25-2026 9:53 AM` note said Phase 3.5 was complete and Phase 4 should focus on the cleanup flow. That work is now done.

Completed since that note:

- Created `supabase/migrations/20260525000500_phase4_cleanup.sql`:
  - Added `'reopened'` value to the `spot_status` enum
  - Created `contribution_history` table with RLS — service role writes, users can read their own rows
  - Replaced `spots_in_bounds` RPC (must DROP + recreate because return columns changed): now returns `report_media_url` (first verified report/before photo) and `after_media_url` (first verified after photo) instead of the old single `media_url`
  - Added `get_profile_contributions(p_user_id)` RPC — returns `submitted_reports`, `verified_reports`, `cleanups_completed` counts from server-confirmed data
- Created `src/features/reports/validation.ts` — extracted `parseFiniteNumber`, `parseDeviceContext`, `validateUploadAge` from `reports/route.ts` into a shared module; both report and cleanup routes import from here
- Updated `src/app/api/reports/route.ts` to import helpers from the shared validation module (no behavior change)
- Created `src/app/api/cleanup/route.ts` — `POST /api/cleanup`:
  - Auth-gated; validates `spot_id`, webp photo, lat/lng, GPS accuracy, capture timestamp
  - Rejects if spot is already `cleaned` (409) or `hidden` (409)
  - Uploads after-photo to `report-photos` bucket at `{user_id}/{spot_id}/{media_id}.webp`
  - Inserts `spot_media` row with `media_kind = 'after'`
  - Calls `verifyMedia()` synchronously — reuses the same function as reports
  - If verified: updates `spots.status = 'cleaned'` via admin client, inserts `contribution_history` row with `action = 'cleanup_submitted'`
  - Returns `{ spot_id, verification_status, verification_reason }` — same shape as reports response
- Created `src/app/api/profile/stats/route.ts` — `GET /api/profile/stats`:
  - Auth-gated; calls `get_profile_contributions` RPC via admin client
  - Returns `{ submitted_reports, verified_reports, cleanups_completed }`
- Created `src/features/spots/CleanupSheet.tsx`:
  - Green header (`bg-[#228B22]`) to distinguish from ReportSheet's navy
  - Shows spot description read-only at the top
  - Live camera + GPS capture (identical logic to ReportSheet — same 6-step camera flow)
  - No category / severity / description fields — those belong to the spot
  - Same 7-variant `SubmitState` + result banners as ReportSheet
  - `verified` result: `LOCATION VERIFIED — SPOT MARKED CLEANED.`
  - `unverified`/`location_mismatch`: plain-language explanation that spot status is unchanged
  - `onSubmitted()` called on any non-error server response to trigger map refetch
- Created `src/app/profile/page.tsx` — server component at `/profile`:
  - Redirects unauthenticated users to `/`
  - Calls `get_profile_contributions` RPC directly via server Supabase client
  - Three stat cards: SUBMITTED REPORTS, VERIFIED REPORTS, CLEANUPS COMPLETED (green number)
  - `[BACK TO MAP]` link, user email display
  - 369 design system throughout
- Updated `src/features/spots/types.ts`:
  - Added `'reopened'` to `SPOT_STATUSES`
  - Renamed `media_url` → `report_media_url` on `SpotSummary`, added `after_media_url`
- Updated `src/features/spots/display.ts`:
  - Added `reopened: "REOPENED"` to `STATUS_LABELS` (required by `Record<SpotStatus, string>`)
- Updated `src/features/map/CleanLAMap.tsx`:
  - `spotLayer` paint: cleaned pins get `circle-stroke-color: #228B22` and `circle-stroke-width: 2` via Mapbox expression on `status` property
  - `SpotDetailSheet`: new `user` and `onMarkCleaned` props; shows BEFORE and AFTER photo blocks separately; `[MARK CLEANED]` button for authed users on non-cleaned/non-hidden spots
  - Added `showCleanup` state; `CleanupSheet` renders in place of `SpotDetailSheet` when active; on submit: closes sheet, deselects spot, refetches map
  - Header: `[PROFILE]` link shown when user is signed in
- Applied Phase 4 migration to hosted Supabase — confirmed via MCP:
  - `spot_status` enum includes `reopened`
  - `contribution_history` table with correct schema and RLS
  - `spots_in_bounds` updated and callable
  - `get_profile_contributions` callable
- Ran and passed lint and production build (`npm run lint`, `npm run build`)
- Committed as `23f5901` and pushed to `origin/main`

## Current Webapp Reality

The app is now a Phase 4 Cleanup Flow MVP.

What exists:

- Next.js App Router webapp
- Mapbox-based public LA spot map with pitched 3D camera
- Supabase-backed `spots`, `spot_media`, `profiles`, `contribution_history`
- PostGIS location storage and distance computation
- Bounded `/api/spots` (viewport-based fetch, 500-spot cap)
- Public map browsing while signed out
- Supabase magic-link auth
- Session refresh through `src/proxy.ts`
- First-login profile creation
- Authenticated report sheet on the map — live camera, GPS, category, severity, description
- Trusted report submission through `POST /api/reports`
- Upload to `report-photos` bucket under `{user_id}/{spot_id}/{media_id}.webp`
- Synchronous server-side media verification on both report and cleanup submissions
- Result banners: LOCATION VERIFIED / UNVERIFIED / LOCATION MISMATCH / PENDING REVIEW / ERROR
- `spot_media.distance_from_spot_m` computed and stored on every verified or location-mismatch result
- `spots.verification_status` updated to `verified` when at least one verified media row exists
- **Cleanup flow** — `[MARK CLEANED]` button in spot detail sheet for authed users
- **Green-stroked map pins** for cleaned spots
- **Before/after photo display** in spot detail sheet
- **Profile page** at `/profile` — submitted reports, verified reports, cleanups completed
- `contribution_history` audit log of all cleanup submissions
- `'reopened'` status in DB enum (transitions not yet exposed in UI — Phase 5+)

What does not exist yet:

- Moderation queue (Phase 5)
- Public share pages (Phase 6)
- Google or Apple sign-in
- Library upload path
- Automated content screening
- `in_progress` and `reopened` status transitions in the UI
- Realtime updates on spot detail views
- Production mobile/HTTPS full end-to-end test pass for cleanup flow

## Hosted Supabase Status

Hosted Supabase project:

- Name: `cleanla-sb`
- Project ref: `wibryaumouxojphjmyni`
- Region: `us-east-2`
- Status at time of migration: active/healthy

Migration table is now fully in sync:

| Version | Name |
|---|---|
| 20260524233031 | enable_postgis |
| 20260525000300 | phase3_report_mvp |
| 20260525021606 | reports_table |
| 20260525022034 | phase2_spots |
| 20260525164801 | phase3_5_verification |
| 20260525000500 | phase4_cleanup |

Verified live:

- `spot_status` enum includes `'reopened'`
- `contribution_history` table exists with correct schema
- `spots_in_bounds` updated — returns `report_media_url` and `after_media_url`
- `get_profile_contributions` RPC callable

## Known Open Issue — Supabase Security Advisory

The `report-photos` storage bucket has a broad `SELECT` policy (`bucket_id = 'report-photos'`) that allows clients to list all files in the bucket, not just read them by URL. This is a WARN-level advisory.

For a civic app where photos are intentionally public, the practical risk is low (all paths are UUIDs, not guessable). However the correct fix before public launch is:

- Make the bucket private.
- Serve media via signed URLs generated server-side.

This is a Phase 5 / Phase 7 (Launch) item. Do not address it prematurely — it requires reworking how `media_url` is stored and served.

## Current Env Notes

Local `webapp/.env.local` should remain uncommitted.

No new environment variables were added in Phase 4. The same five vars from Phase 3 are required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## What Has Been Verified

Code checks passed:

- `npm run lint` — clean
- `npm run build` — clean, TypeScript passed inside build

Supabase checks passed:

- Phase 4 migration applied successfully via MCP
- All four RPCs confirmed live
- `contribution_history` table confirmed with correct schema

## What Still Needs Real-World Verification

The following should be tested on HTTPS deployment and a real mobile device:

- Full cleanup flow end-to-end: report a spot → tap pin → [MARK CLEANED] → live photo + GPS at correct location → `LOCATION VERIFIED — SPOT MARKED CLEANED` banner → pin shows green stroke on map
- Cleanup from wrong GPS location → `GPS DID NOT MATCH SPOT LOCATION — SPOT STATUS UNCHANGED` banner, spot stays `reported`
- Cleanup with stale photo (>10 min old) → `stale_upload` unverified result
- Cleanup with poor GPS accuracy → `location_unconfirmed` unverified result
- Double-submit guard: `[SUBMIT AFTER PHOTO]` button stays disabled after any terminal success state
- `contribution_history` row written correctly in Supabase dashboard after a verified cleanup
- `spots.status = 'cleaned'` in dashboard after a verified cleanup
- SpotDetailSheet before/after photos display correctly for a cleaned spot
- `/profile` page shows correct counts after submitting reports and cleanups
- Unauthenticated user: `[MARK CLEANED]` button not visible, `/profile` redirects to map
- Direct client attempt to set `spots.status = 'cleaned'` blocked by RLS

## First Steps For Phase 5

Phase 5 is the Moderation Queue. Before starting it, complete the real-device test list above.

When ready, Phase 5 should focus on:

1. **Moderation status on spot_media** — `moderation_status` field: `pending`, `approved`, `rejected`
2. **Admin moderation queue** — server-only view of unmoderated media, approve/reject actions
3. **Media visibility gating** — public map only shows media with `moderation_status = 'approved'`
4. **Bucket access hardening** — move to private bucket + signed URLs (ties into moderation approval)
5. **Automated content screening** — optional hook for image moderation API before manual review

## What Not To Do Next

Do not jump ahead to:

- Public share pages (Phase 6)
- Google/Apple sign-in
- Leaderboards or streaks
- Analytics or observability (Sentry, PostHog)
- City/311 submission
- `in_progress` / `reopened` UI transitions
- Fixing the bucket listing advisory before Phase 5 moderation work is scoped

## Useful Files To Know

- `webapp/src/features/spots/CleanupSheet.tsx`: the "mark as cleaned" form — mirrors ReportSheet structure.
- `webapp/src/app/api/cleanup/route.ts`: trusted cleanup submission — validates spot state, uploads after-photo, calls `verifyMedia`, conditionally transitions `spots.status`.
- `webapp/src/features/reports/validation.ts`: shared form parsing helpers (`parseFiniteNumber`, `validateUploadAge`, `parseDeviceContext`) — used by both report and cleanup routes.
- `webapp/src/app/profile/page.tsx`: server component profile page — reads `get_profile_contributions` RPC.
- `webapp/src/app/api/profile/stats/route.ts`: profile stats API endpoint for client-side use.
- `webapp/src/features/map/CleanLAMap.tsx`: map shell — `SpotDetailSheet` now has before/after display and `[MARK CLEANED]` button; `spotLayer` paint uses `status` for green stroke on cleaned pins.
- `webapp/src/features/spots/types.ts`: `SpotSummary` now has `report_media_url` and `after_media_url` (renamed from `media_url`).
- `webapp/supabase/migrations/20260525000500_phase4_cleanup.sql`: Phase 4 schema — `contribution_history`, updated `spots_in_bounds`, `get_profile_contributions`.

## Quick Update Prompt For Claude Code

Use this prompt whenever you want Claude Code to give a quick project update:

```text
You are helping on the CleanLA repo. Please inspect the current git status, latest commit, Phase 4 cleanup files, and Supabase migration state, then give me a plain-English update for a non-expert collaborator.

Focus on:
- whether local main is aligned with origin/main
- whether the Phase 4 cleanup flow still builds
- whether contribution_history and get_profile_contributions exist in hosted Supabase
- whether CleanupSheet and the profile page are present in the source
- what the next 1-3 practical tasks should be

Please run only safe read/check commands unless I explicitly ask you to edit files. Use concise language and explain any technical issue in plain English.
```

## One-Sentence Version

CleanLA now lets users document that they cleaned a reported spot — with a live verified after-photo, a green-stroked map pin, side-by-side before/after evidence, and a profile page showing each user's real contribution counts.
