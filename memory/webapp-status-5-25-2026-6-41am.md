# CleanLA Webapp Status - May 25, 2026, 6:41 AM

This is the current handoff/status note for the CleanLA `webapp`. It updates the earlier `memory/webapp-status-5-24-2026-7-02pm.md` note and reflects the work completed since then.

## Plain-English Summary

Phase 2 is now done at the basic MVP level.

The webapp has a working read-only Mapbox GUI with sample LA spot data. The app loads spots through the bounded `/api/spots` endpoint instead of loading the whole database. The hosted Supabase database has the Phase 2 schema, seed data, and `spots_in_bounds` RPC applied. The Mapbox public token was supplied and set locally in `.env.local`, but it was not written into tracked repo files.

The next product phase is Phase 3: authenticated report creation with live photo capture, GPS metadata, Supabase Storage upload, and server-side verification.

## What Changed Since The Last Memory Note

The previous `5-24-2026 7:02 PM` memory note said Phase 2 code existed but the database still needed to catch up. That blocker is now resolved.

Completed since that note:

- Pulled latest `origin/main`.
- Hosted Supabase project `cleanla-sb` was identified and used.
- Hosted Supabase already had PostGIS enabled.
- Applied the baseline `reports_table` migration to hosted Supabase.
- Fixed the Phase 2 migration for hosted Supabase's `extensions` PostGIS schema.
- Applied the corrected Phase 2 `spots` migration to hosted Supabase.
- Loaded 12 seeded LA spots into hosted Supabase.
- Verified `spots_in_bounds(-118.67, 33.7, -118.15, 34.34, 5)` returns rows.
- Verified local `/api/spots?west=-118.67&south=33.7&east=-118.15&north=34.34&limit=5` returns HTTP `200` with spot JSON.
- Verified invalid bounds still return HTTP `400`.
- Verified RLS basics:
  - anonymous users can read visible spots
  - anonymous inserts into `spots` are blocked
- Set `NEXT_PUBLIC_MAPBOX_TOKEN` locally in `webapp/.env.local`.
- Cleaned a malformed non-`KEY=value` line out of local `.env.local`.
- Updated `webapp/PHASE-2-HANDOFF.md`.
- Committed and pushed the hosted Supabase SQL fix as `1255d4d Fix hosted Supabase phase 2 SQL`.

The latest pull also brought in new research/wiki context, including:

- `wiki/concepts/cleanla-clean-streets-mayor-scenario.md`
- new raw notes on Bass office civic-tech posture, B2G civic-tech sales motion, federal/state funding alignment, and clean-streets mayor patterns

Those wiki additions are strategic context. They do not change the immediate webapp Phase 3 engineering sequence.

## Current Webapp Reality

The app is now a Phase 2 read-only map MVP.

What exists:

- Next.js App Router webapp
- Supabase-backed `spots` and `spot_media` tables
- PostGIS location storage
- `spots_in_bounds` RPC
- `/api/spots` bounded API route
- Mapbox map shell on `/`
- clustered category pins
- spot detail sheet
- sample LA spot data
- PWA manifest basics
- 369-inspired square visual style

What does not exist yet:

- user sign-in
- report creation
- live camera capture
- GPS capture in a report flow
- Supabase Storage upload for Phase 3 media
- server-side verification function
- authenticated RLS create policies
- cleanup flow
- moderation queue
- public share pages

## Current Env Notes

Local `webapp/.env.local` now has `NEXT_PUBLIC_MAPBOX_TOKEN` set.

Do not commit `.env.local`.

`SUPABASE_SERVICE_ROLE_KEY` is still empty locally. That does not block the Phase 2 read-only map, but it will matter for legacy report/admin paths and may matter during Phase 3 depending on the trusted server/verification implementation.

Vercel/hosted environment variables still need to be checked separately:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` if server-side privileged paths are used

## Phase 2 Done Means

For practical purposes, Phase 2 is complete because:

- the basic GUI exists
- the map can load
- sample spot data exists in hosted Supabase
- the bounded spot-loading API works
- RLS allows public read but blocks anonymous writes
- the code builds, lints, and typechecks

Remaining Phase 2 polish is only verification/deployment hygiene:

- confirm Vercel has the Mapbox token
- confirm the deployed URL shows the actual map, not the missing-token panel
- do one visual pass on desktop and mobile

## First Steps For Phase 3

According to `CleanLA-development-plan.md`, Phase 3 is the Report MVP.

The objective is: allow signed-in users to create new problem spots with live photo capture, GPS metadata, storage upload, and server-side verification for report media.

Recommended first Phase 3 steps:

1. **Plan the auth boundary**
   - Add Supabase Auth with magic link first.
   - Add Google/Apple only if credentials are ready.
   - Decide where sign-in/sign-out UI lives in the current map-first interface.
   - Add session-aware layout behavior without disrupting public read-only browsing.

2. **Add profile/auth schema**
   - Add a `profiles` table.
   - Add either a signup trigger or first-login profile creation path.
   - Keep public spot browsing anonymous.
   - Gate report creation behind authenticated users.

3. **Harden write-side RLS**
   - Keep public read for visible spots.
   - Add authenticated create policies for reports/spots/media.
   - Add owner-scoped write policies where needed.
   - Prevent clients from directly setting final verification fields.

4. **Design the report flow before coding**
   - Start report
   - capture live photo
   - collect GPS
   - choose category/severity
   - add description
   - submit
   - show verification result

5. **Create media storage path**
   - Add a Supabase Storage bucket for spot media.
   - Add authenticated upload policy to user-scoped paths.
   - Decide whether public reads are allowed immediately or whether signed URLs are used until moderation exists.

6. **Build live capture and GPS carefully**
   - Use `getUserMedia`.
   - Prefer rear camera.
   - Capture frame to canvas/blob.
   - Use `navigator.geolocation.getCurrentPosition`.
   - Show GPS accuracy before submission.
   - Retry when permission, camera, or accuracy fails.

7. **Implement trusted verification**
   - Use a Supabase Edge Function or trusted server path.
   - Server records authoritative timestamp.
   - Server checks source, freshness, GPS accuracy, and distance.
   - Server updates `spot_media.verification_status`.
   - Client never writes final verification state.

## What Not To Do First In Phase 3

Do not start with:

- cleanup flow
- before/after sharing
- moderation queue
- analytics
- leaderboards
- redesigning the map
- city/311 direct submission

Those are later phases or strategic tracks. Phase 3 should begin with auth, report capture, storage, and verification.

## One-Sentence Version

Phase 2 is now functionally complete: CleanLA has a working Mapbox-based read-only map with hosted sample spot data and bounded loading, and the next engineering focus should be Phase 3 auth-gated live report creation with GPS/photo capture and server-side verification.
