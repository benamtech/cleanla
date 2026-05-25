# CleanLA Webapp Status - May 25, 2026, 7:45 AM

CleanLA has crossed an important product threshold: the app is no longer only a public map for looking at cleanup/problem spots. It now has the first version of a signed-in reporting path, so a person can start from the map, prove they are a real user through email, capture a live photo and location, and submit a new spot for later verification. The photo is public-readable for MVP continuity, but the app labels new media as pending rather than treating it as verified.

This note updates `memory/webapp-status-5-25-2026-6-41am.md` and reflects the Phase 3 Report MVP implementation, hosted Supabase migration, and GitHub push completed after that note.

## Plain-English Summary

Phase 3 Report MVP is now implemented and pushed.

Public map browsing still works without signing in. The `[REPORT]` button now asks signed-out users for a Supabase magic link. Signed-in users get a report sheet that supports live camera capture, high-accuracy GPS capture, category, severity, description, and submit. Submitted reports create a new `spots` row and a pending `spot_media` row with the capture metadata needed for Phase 3.5 verification.

Phase 3.5 is still separate. The app records evidence for later verification, but it does not yet make final `verified`, `unverified`, or `location_mismatch` decisions.

## What Changed Since The Last Memory Note

The previous `5-25-2026 6:41 AM` memory note said Phase 2 was complete and Phase 3 should begin with auth-gated live report creation. That work is now done at MVP level.

Completed since that note:

- Added Supabase magic-link auth UI from the map.
- Preserved anonymous public map browsing.
- Added first-login profile creation through a trusted server route.
- Recreated the server-only Supabase service-role helper at `webapp/src/lib/supabase/admin.ts`.
- Added `POST /api/reports` for trusted report submission.
- Added `POST /api/profile` for profile upsert after sign-in.
- Added `/auth/callback` for magic-link session exchange.
- Added Next 16 `proxy.ts` session refresh support.
- Added Phase 3 shared constants:
  - `VERIFY_RADIUS_M = 50`
  - `MAX_GPS_ACCURACY_M = 100`
  - `MAX_UPLOAD_AGE_MIN = 10`
- Added a map-integrated report sheet:
  - live camera capture with rear-camera preference
  - track cleanup on unmount
  - WebP capture through canvas
  - GPS capture with high accuracy and 15s timeout
  - poor GPS accuracy warning
  - required category, severity, description, photo, and location before submit
- Added a hosted Supabase migration for:
  - `profiles`
  - `spots.created_by`
  - nullable `spots.severity`
  - `spot_media.created_by`
  - `capture_source`
  - captured coordinates
  - GPS accuracy
  - client capture timestamp
  - server received timestamp
  - distance placeholder
  - `device_context`
  - authenticated upload policy for the existing `report-photos` bucket
  - refreshed `spots_in_bounds` RPC with `severity`
  - `create_phase3_report_spot` RPC
- Applied the Phase 3 migration to hosted Supabase project `cleanla-sb`.
- Verified hosted schema and RPC behavior.
- Removed the old Phase 2 handoff/implementation docs from the webapp directory.
- Added Phase 3 and Phase 3.5 plan documents.
- Committed and pushed everything to GitHub as:
  - `dd505bd Implement phase 3 report MVP`

## Current Webapp Reality

The app is now a Phase 3 Report MVP.

What exists:

- Next.js App Router webapp
- Mapbox-based public LA spot map
- Supabase-backed `spots` and `spot_media`
- PostGIS location storage
- bounded `/api/spots`
- public map browsing while signed out
- Supabase magic-link auth
- session refresh through `src/proxy.ts`
- first-login profile creation
- authenticated report sheet on the map
- live photo capture
- GPS capture
- category, severity, and description fields
- trusted report submission through `POST /api/reports`
- upload to existing `report-photos` bucket under `{user_id}/{spot_id}/{media_id}.webp`
- pending `spot_media` rows with Phase 3.5 capture metadata
- public-read media behavior preserved for MVP continuity

What does not exist yet:

- final media verification decisions
- EXIF/timestamp comparison
- distance verification between claimed spot and captured media
- moderation queue
- cleanup/before-after flow
- public share pages
- Google or Apple sign-in
- library upload path
- production mobile/HTTPS camera and GPS verification pass

## Hosted Supabase Status

Hosted Supabase project:

- name: `cleanla-sb`
- project/ref: `wibryaumouxojphjmyni`
- region: `us-east-2`
- status at time of migration: active/healthy

The Phase 3 migration was applied to hosted Supabase.

Verified live:

- `profiles` exists.
- `spots.created_by` exists.
- `spots.severity` exists.
- `spot_media.capture_source` exists.
- `spot_media.gps_accuracy_m` exists.
- `create_phase3_report_spot` exists.
- authenticated own-prefix upload policy exists for `report-photos`.
- `spots_in_bounds(-118.67, 33.7, -118.15, 34.34, 3)` returns rows including `severity`.

Important implementation note:

- The first migration attempt hit Postgres error `42P13` because `spots_in_bounds` changed return shape.
- The migration was fixed by adding `drop function if exists public.spots_in_bounds(...)` before recreating it.
- The corrected migration was applied successfully and is what is now committed.

## Current Env Notes

Local `webapp/.env.local` should still remain uncommitted.

Phase 3 now depends on these env vars being present locally and in hosting:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` is now required for trusted profile/report server paths. Without it, public map browsing can still work, but authenticated report submission will fail.

Supabase Auth also needs the deployed site URL and redirect URLs configured so magic links work outside local development.

## What Has Been Verified

Local checks passed:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Browser check passed:

- `http://localhost:3000` loaded.
- Public map shell rendered.
- Signed-out `[REPORT]` opened the magic-link prompt.

Hosted Supabase checks passed:

- Phase 3 schema objects exist.
- Storage policy exists.
- `spots_in_bounds` works with the new `severity` field.

Git status after push:

- local `main` is aligned with `origin/main`
- latest commit is `dd505bd Implement phase 3 report MVP`
- working tree was clean immediately after push

## What Still Needs Real-World Verification

The following should be tested on HTTPS deployment and a real mobile device:

- magic-link email delivery
- magic-link redirect back into the app
- signed-in session persistence
- first-login profile creation
- rear-camera capture
- camera denied state
- GPS capture
- geolocation denied state
- poor GPS accuracy warning
- successful report submission end to end
- uploaded WebP path in `report-photos`
- pending `spot_media` row with capture metadata
- new spot appearing after map refetch

## First Steps For Phase 3.5

Phase 3.5 should focus on media verification, not new product scope.

Recommended next steps:

1. **Verify Phase 3 on real devices first**
   - Confirm the MVP flow works on mobile HTTPS.
   - Confirm camera and geolocation permissions behave clearly.
   - Confirm submitted rows have all expected metadata.

2. **Design final verification rules**
   - Use `VERIFY_RADIUS_M = 50`.
   - Use `MAX_GPS_ACCURACY_M = 100`.
   - Use `MAX_UPLOAD_AGE_MIN = 10`.
   - Decide how strict to be when timestamp, GPS accuracy, or device context is missing.

3. **Implement trusted verification**
   - Keep final status changes server-side.
   - Compare captured coordinates to spot coordinates.
   - Record distance in `spot_media.distance_from_spot_m`.
   - Update `verification_status` and `verification_reason`.

4. **Add test fixtures**
   - good location, good timestamp
   - stale upload
   - poor GPS accuracy
   - location mismatch
   - missing or malformed device context

## What Not To Do Next

Do not jump ahead to:

- cleanup verification
- volunteer coordination
- leaderboards
- city/311 submission
- moderation dashboards
- analytics
- visual redesign
- Google/Apple sign-in

Those can come later. The next important step is proving the Phase 3 report flow works on real devices, then making Phase 3.5 verification decisions trustworthy.

## Useful Files To Know

- `webapp/src/features/map/CleanLAMap.tsx`: map UI, auth state, report entry point.
- `webapp/src/features/reports/ReportSheet.tsx`: live photo/GPS report form.
- `webapp/src/features/reports/constants.ts`: shared Phase 3/3.5 verification constants.
- `webapp/src/app/api/reports/route.ts`: trusted report submission.
- `webapp/src/app/api/profile/route.ts`: trusted profile upsert.
- `webapp/src/app/auth/callback/route.ts`: magic-link callback.
- `webapp/src/lib/supabase/admin.ts`: service-role Supabase client.
- `webapp/src/proxy.ts`: Supabase session refresh.
- `webapp/supabase/migrations/20260525000300_phase3_report_mvp.sql`: Phase 3 schema/policy migration.
- `webapp/PHASE-3-IMPLEMENTATION-PLAN.md`: Phase 3 plan.
- `webapp/PHASE-3.5-MEDIA-VERIFICATION-PLAN.md`: Phase 3.5 plan.

## Quick Update Prompt For Claude Code

Use this prompt whenever you want Claude Code to give a quick project update:

```text
You are helping on the CleanLA repo. Please inspect the current git status, latest commit, Phase 3 report MVP files, and Supabase migration state, then give me a plain-English update for a non-expert collaborator.

Focus on:
- whether local main is aligned with origin/main
- whether the Phase 3 report MVP still builds
- whether the Supabase Phase 3 migration appears applied
- whether auth-gated reporting, photo capture, GPS capture, and pending media metadata are present in code
- what the next 1-3 practical tasks should be

Please run only safe read/check commands unless I explicitly ask you to edit files. Use concise language and explain any technical issue in plain English.
```

## One-Sentence Version

CleanLA now has a pushed Phase 3 Report MVP: the public map remains open, signed-in users can submit live photo/GPS reports, hosted Supabase is migrated for ownership and capture metadata, and the next focus is real-device testing followed by Phase 3.5 media verification.

