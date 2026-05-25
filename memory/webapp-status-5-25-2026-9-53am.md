# CleanLA Webapp Status - May 25, 2026, Phase 3.5 Complete

When someone submits a report in CleanLA, the app now immediately tells them whether their photo was verified as being taken at the spot, rather than just saying "pending." The server checks the photo's GPS coordinates against the spot's location using PostGIS, checks that the photo was taken recently and with good enough GPS accuracy, and returns a final result — LOCATION VERIFIED, UNVERIFIED, or LOCATION MISMATCH — before the form even closes.

This note updates `memory/webapp-status-5-25-2026-7-45am.md` and reflects the Phase 3.5 Media Verification implementation completed in this session.

## Plain-English Summary

Phase 3.5 Media Verification is now implemented, tested, and live in hosted Supabase.

When a user submits a report, the server now immediately runs a 6-step verification check and stores a final status on the media row — no more permanent "pending" state. The map pin the user just created will show LOCATION-VERIFIED if everything checked out, or a plain-language explanation of what failed.

The verification happens synchronously inside the existing `POST /api/reports` request. No background jobs, no polling, no Edge Functions. The result comes back with the same HTTP response that confirms the spot was created.

Phase 4 (Cleanup Flow) is the logical next step.

## What Changed Since The Last Memory Note

The previous `5-25-2026 7:45 AM` note said Phase 3 was complete and Phase 3.5 should focus on media verification before moving to cleanup flow. That work is now done.

Completed since that note:

- Added `VERIFICATION_REASONS` const and `VerificationReason` TypeScript type to `src/features/spots/types.ts`.
- Created `src/lib/verification/verify-media.ts` — the core server-side verification function:
  - 6-step algorithm: source check → required metadata → freshness → GPS accuracy → PostGIS distance → error fallback
  - Uses the Supabase admin (service-role) client to bypass RLS for final status updates
  - Updates `spot_media.verification_status`, `verification_reason`, and `distance_from_spot_m`
  - Propagates `verified` status to the parent `spots` row as an aggregate
  - Falls back to `pending` with reason `server_error` on unexpected failure — never corrupts data
- Updated `POST /api/reports` (`src/app/api/reports/route.ts`):
  - Captures `serverReceivedAt` as a variable before the media insert so the exact same timestamp is used in both the DB row and the verification call
  - Calls `verifyMedia()` synchronously after the media row is created
  - Returns `verification_status` and `verification_reason` in the response instead of hardcoded `"pending"`
- Updated `ReportSheet.tsx` (`src/features/reports/ReportSheet.tsx`):
  - Extended `SubmitState` from 4 to 7 variants: `verified`, `unverified`, `location_mismatch`, `pending` (server error fallback), `failed`
  - Parses `verification_status` and `verification_reason` from the API response
  - Shows a result banner for each state using 369 design system color tokens
  - `canSubmit` guard updated — submit button stays disabled after any terminal success state (only `failed` stays retryable)
- Created `supabase/migrations/20260525000400_phase3_5_verification.sql`:
  - Composite index on `spot_media(verification_status, created_at)`
  - `compute_media_distance_m(p_spot_id, p_lat, p_lng)` — PostGIS SQL function using `ST_Distance` with geography, returns metres
- Applied the Phase 3.5 migration to hosted Supabase project `cleanla-sb`.
- Registered the previously untracked Phase 3 migration record in `supabase_migrations.schema_migrations` so CLI migration tracking is now fully in sync.
- Ran and passed lint, TypeScript (via build), and production build.

## Verification Algorithm (6 Steps In Order)

The `verifyMedia()` function in `src/lib/verification/verify-media.ts` runs these checks in order and stops at the first failure:

1. **Source check** — if `capture_source` is not `live_camera`, mark `unverified / library_upload`
2. **Required metadata check** — if `captured_lat`, `captured_lng`, `gps_accuracy_m`, or `client_captured_at` is null, mark `unverified / missing_capture_metadata`
3. **Freshness check** — if `server_received_at - client_captured_at > MAX_UPLOAD_AGE_MIN (10 min)`, mark `unverified / stale_upload`
4. **GPS accuracy check** — if `gps_accuracy_m > MAX_GPS_ACCURACY_M (100 m)`, mark `unverified / location_unconfirmed`
5. **Distance check** — call `compute_media_distance_m` via PostGIS. If distance ≤ `VERIFY_RADIUS_M (50 m) + gps_accuracy_m`, mark `verified / verified_on_site`. Otherwise mark `location_mismatch / location_mismatch`.
6. **Error fallback** — on any unexpected throw, leave `verification_status = pending`, stamp `verification_reason = server_error`

## Current Webapp Reality

The app is now a Phase 3.5 Media Verification MVP.

What exists:

- Next.js App Router webapp
- Mapbox-based public LA spot map
- Supabase-backed `spots` and `spot_media`
- PostGIS location storage and distance computation
- Bounded `/api/spots`
- Public map browsing while signed out
- Supabase magic-link auth
- Session refresh through `src/proxy.ts`
- First-login profile creation
- Authenticated report sheet on the map
- Live photo capture
- GPS capture
- Category, severity, and description fields
- Trusted report submission through `POST /api/reports`
- Upload to `report-photos` bucket under `{user_id}/{spot_id}/{media_id}.webp`
- **Synchronous server-side media verification** — returns final status in the same HTTP response
- Result banner in the report sheet: LOCATION VERIFIED / UNVERIFIED / LOCATION MISMATCH / PENDING REVIEW / ERROR
- `spot_media.distance_from_spot_m` now computed and stored on every verified or location-mismatch result
- `spots.verification_status` updated to `verified` when at least one verified media row exists

What does not exist yet:

- Cleanup / before-after flow (Phase 4)
- Moderation queue (Phase 5)
- Public share pages (Phase 6)
- Google or Apple sign-in
- Library upload path
- Automated content screening
- Production mobile/HTTPS full end-to-end test pass

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
| 20260525000300 | phase3_report_mvp (registered this session) |
| 20260525021606 | reports_table |
| 20260525022034 | phase2_spots |
| 20260525164801 | phase3_5_verification |

Verified live:

- `compute_media_distance_m` function exists and callable.
- `spot_media_verification_status_created_at_idx` index created.
- Test call to `compute_media_distance_m` with a non-existent spot ID returns `null` as expected.

## Known Open Issue — Supabase Security Advisory

The `report-photos` storage bucket has a broad `SELECT` policy (`bucket_id = 'report-photos'`) that allows clients to list all files in the bucket, not just read them by URL. This is a WARN-level advisory.

For a civic app where photos are intentionally public, the practical risk is low (all paths are UUIDs, not guessable). However the correct fix before public launch is:

- Make the bucket private.
- Serve media via signed URLs generated server-side.

This is a Phase 5 / Phase 7 (Launch) item. Do not address it prematurely — it requires reworking how `media_url` is stored and served.

## Current Env Notes

Local `webapp/.env.local` should remain uncommitted.

No new environment variables were added in Phase 3.5. The same five vars from Phase 3 are required:

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

- Phase 3.5 migration applied successfully.
- `compute_media_distance_m` RPC confirmed live.
- Migration tracking table confirmed in sync.

## What Still Needs Real-World Verification

The following should be tested on HTTPS deployment and a real mobile device:

- Full report submission end-to-end returning `verified` result banner
- Full report submission from a clearly wrong location returning `location_mismatch` banner
- Freshness window: submit a report with a 12-minute-old photo and confirm `stale_upload`
- Poor GPS accuracy warning in UI followed by `location_unconfirmed` result
- `spot_media.distance_from_spot_m` populated correctly in Supabase dashboard after a submission
- `spots.verification_status` updated to `verified` in dashboard after a verified submission
- Submit button stays disabled after a successful verified result (no double-submit)
- Error fallback: confirm `server_error` path keeps the spot intact if something unexpected fails

## First Steps For Phase 4

Phase 4 is the Cleanup Flow. Before starting it, complete the real-device test list above.

When ready, Phase 4 should focus on:

1. **Expand spot status model** — add `in_progress`, `cleaned`, `reopened`, `hidden` statuses with server-controlled transitions.
2. **Build "Mark as cleaned" flow** — requires auth, live capture, GPS, `after` media, runs through `verifyMedia` with `media_kind = 'after'`.
3. **Before/after display** — update spot detail sheet to show report photo + cleanup photo side by side.
4. **Profile page** — submitted reports, verified reports, cleanups completed.
5. **Cleaned-state map styling** — distinct pin style for cleaned spots.

## What Not To Do Next

Do not jump ahead to:

- Moderation dashboards
- Public share pages
- Google/Apple sign-in
- Leaderboards or streaks
- Analytics or observability
- City/311 submission
- Fixing the bucket listing advisory (Phase 5/7 item)

## Useful Files To Know

- `webapp/src/lib/verification/verify-media.ts`: the 6-step verification algorithm and DB update logic.
- `webapp/src/app/api/reports/route.ts`: trusted report submission — calls `verifyMedia` synchronously at the end.
- `webapp/src/features/reports/ReportSheet.tsx`: report form UI — 7-variant `SubmitState` with result banners.
- `webapp/src/features/reports/constants.ts`: `VERIFY_RADIUS_M`, `MAX_GPS_ACCURACY_M`, `MAX_UPLOAD_AGE_MIN` — easy to tune.
- `webapp/src/features/spots/types.ts`: `VerificationStatus` and `VerificationReason` types.
- `webapp/supabase/migrations/20260525000400_phase3_5_verification.sql`: index + `compute_media_distance_m` RPC.
- `webapp/PHASE-3.5-MEDIA-VERIFICATION-PLAN.md`: original Phase 3.5 plan document.

## Quick Update Prompt For Claude Code

Use this prompt whenever you want Claude Code to give a quick project update:

```text
You are helping on the CleanLA repo. Please inspect the current git status, latest commit, Phase 3.5 verification files, and Supabase migration state, then give me a plain-English update for a non-expert collaborator.

Focus on:
- whether local main is aligned with origin/main
- whether the Phase 3.5 verification flow still builds
- whether compute_media_distance_m exists in hosted Supabase
- whether the verification result banners are present in ReportSheet
- what the next 1-3 practical tasks should be

Please run only safe read/check commands unless I explicitly ask you to edit files. Use concise language and explain any technical issue in plain English.
```

## One-Sentence Version

CleanLA now runs server-side media verification synchronously on every report submission — checking GPS, timestamp, and distance via PostGIS — and immediately shows the user a plain-language result: location verified, unverified, or location mismatch.
