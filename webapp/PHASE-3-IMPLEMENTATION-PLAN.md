# CleanLA Phase 3 Implementation Plan

Phase 3 builds the authenticated Report MVP on top of the completed Phase 2 map: signed-in users can create new problem spots from live photo capture, GPS metadata, upload to Supabase Storage, and a trusted pending-verification handoff.

This phase keeps public map browsing anonymous. Contribution is gated by Supabase Auth. Google and Apple sign-in are explicitly out of scope for this pass; magic link is the only auth method for Phase 3.

## Current Starting Point

- `/` renders the Phase 2 read-only Mapbox map.
- `GET /api/spots` loads spots by viewport bounds through `spots_in_bounds`.
- Hosted Supabase has `spots`, `spot_media`, seeded sample data, and public read RLS.
- Anonymous writes to `spots` are blocked.
- The existing Supabase Storage bucket `report-photos` already exists from Phase 1.5 and can be reused.
- `NEXT_PUBLIC_MAPBOX_TOKEN` is configured locally, but hosted/Vercel env still needs independent confirmation.

## Architecture Decision

Use the existing conventional webapp structure:

```text
webapp/src/
  app/
  features/
    auth/
    capture/
    map/
    spots/
  lib/
    supabase/
    geo/
```

Do not introduce a new app architecture. Phase 3 should extend the current map-first experience with a report flow, not replace the map.

The visual layer continues to follow the safe 369 rules: square panels, 1px gray borders, token colors only, uppercase labels/buttons, no shadows/gradients/emoji/icon libraries, and spacing in multiples of 3.

## Locked Decisions

- Supabase Auth gates contribution.
- Magic link is the only Phase 3 sign-in method.
- Public map browsing remains anonymous.
- Live camera capture is required for the primary report path.
- Library upload is deferred by default; if added, it must be clearly unverified.
- New report pins auto-place from captured GPS coordinates.
- Phase 3 records capture metadata and starts report media as `pending`.
- Full GPS/timestamp/distance verification is Phase 3.5.
- The client never writes final verification status.
- Server time is authoritative.
- Verification language must avoid claiming tamper-proof proof.

## Data Model And Migrations

### Auth And Profiles

Add a migration for:

- `profiles`
  - `id uuid primary key references auth.users(id) on delete cascade`
  - `display_name text`
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`

Default implementation: create/update the profile from a trusted first-login server path. Use a database signup trigger only if it is simpler during implementation.

### Spot Ownership And Report Metadata

Extend `spots` with:

- `created_by uuid references auth.users(id)`
- `severity smallint`

Rules:

- `severity` is nullable for legacy/seed spots.
- If provided, `severity` must be between 1 and 5.
- Existing seeded spots remain valid.

### Media Capture Metadata

Extend `spot_media` with:

- `created_by uuid references auth.users(id)`
- `capture_source text not null default 'library'`
- `captured_lat double precision`
- `captured_lng double precision`
- `gps_accuracy_m double precision`
- `client_captured_at timestamptz`
- `server_received_at timestamptz`
- `distance_to_spot_m double precision`
- `device_context jsonb`

Rules:

- `capture_source` allowed values: `live`, `library`.
- `gps_accuracy_m` must be positive when present.
- Client-created media starts as `pending`.
- Trusted server code sets `verification_reason = awaiting_phase_3_5_verification`.
- Phase 3 stores enough metadata for Phase 3.5 verification but does not decide final `verified` / `location_mismatch` outcomes.

### Storage

Reuse the existing Supabase Storage bucket:

- bucket id: `report-photos`
- currently public-read from the Phase 1.5 validation prototype

Phase 3 should not create a new `spot-media` bucket by default. Reuse `report-photos` with a cleaner path convention:

```text
{user_id}/{spot_id}/{media_id}.webp
```

Storage policy update:

- authenticated users can upload to their own `user_id/*` prefix
- current public read may remain for Phase 3 MVP continuity
- `spot_media.verification_status` and UI copy must make clear that public-readable does not mean verified

If a private media posture is required before moderation, make that a separate migration/decision and document how existing `report-photos` objects are handled.

## RLS Policy Plan

Keep existing public read behavior:

- public can select visible `spots`
- public can select allowed `spot_media` metadata for visible spots

Add authenticated write behavior:

- authenticated users can create `spots` only with `created_by = auth.uid()`
- authenticated users can create `spot_media` only with `created_by = auth.uid()`
- authenticated users can read their own pending/private media rows
- users cannot update final verification fields directly
- users cannot set `verification_status` to `verified`, `location_mismatch`, or `rejected`

Trusted submit path uses service role or equivalent server privileges to:

- validate the authenticated user
- create spot/media rows
- set `server_received_at`
- set initial `verification_status = pending`
- set initial `verification_reason = awaiting_phase_3_5_verification`

## App Flow

### Auth UI

Add:

- sign-in button reachable from the map shell
- magic-link email form
- sign-out control when signed in
- session-aware UI state

Behavior:

- anonymous users can browse the map
- anonymous users tapping report are prompted to sign in
- signed-in users can start the report flow

### Report Flow

Add a report entry point to the map UI using a 369-styled panel or sheet.

Steps:

1. Start report.
2. Capture live photo using `getUserMedia`.
3. Capture GPS using `navigator.geolocation.getCurrentPosition`.
4. Show GPS accuracy.
5. Let user retry photo or GPS capture.
6. Choose category.
7. Choose severity from 1 to 5.
8. Add description.
9. Submit.
10. Show pending verification result.

Required report fields:

- live photo blob
- captured latitude
- captured longitude
- GPS accuracy
- client capture timestamp
- category
- severity
- description

Description rules:

- minimum 3 characters
- maximum 240 characters

Category uses the existing `spot_category` enum:

- `illegal_dumping`
- `trash`
- `graffiti`
- `encampment_debris`
- `biohazard`
- `overgrowth`

### Live Camera Capture

Implement in `src/features/capture`.

Requirements:

- use `navigator.mediaDevices.getUserMedia`
- prefer rear camera with `facingMode: { ideal: "environment" }`
- show explicit permission/loading/error states
- capture video frame to canvas
- convert canvas to Blob
- allow retry
- stop media tracks when capture is complete or component unmounts

### Geolocation Capture

Requirements:

- use `navigator.geolocation.getCurrentPosition`
- use high accuracy
- timeout after 15 seconds
- show latitude/longitude and accuracy before submit
- allow retry
- block submit when location is missing
- warn when accuracy is worse than `MAX_GPS_ACCURACY_M`

Constants, shared with Phase 3.5:

- `VERIFY_RADIUS_M = 50`
- `MAX_GPS_ACCURACY_M = 100`
- `MAX_UPLOAD_AGE_MIN = 10`

## Trusted Submit

Default implementation path: Next.js server route or server action backed by Supabase service role. Supabase Edge Function remains acceptable if implementation prefers it, but do not build both in Phase 3.

Recommended endpoint:

- `POST /api/reports`

Submit sequence:

1. Validate authenticated user.
2. Validate category, severity, description, GPS, and live capture metadata.
3. Create `spots` row at captured coordinates with `created_by = user.id`.
4. Upload compressed media to `report-photos/{user_id}/{spot_id}/{media_id}.webp`.
5. Create `spot_media` row with raw capture metadata, `verification_status = pending`, and `verification_reason = awaiting_phase_3_5_verification`.
6. Return a pending report result to the client.
7. Client refetches current map bounds so the new spot appears.

For Phase 3, automated moderation and final verification decisions are not required. Use UI language like `PENDING REVIEW` or `AWAITING VERIFICATION`, not `LOCATION-VERIFIED`.

## Library Upload

Library upload is optional for Phase 3.

Default: defer library upload until the live camera path works end to end.

If added for usability:

- mark `capture_source = library`
- never present it as verified
- show copy: `LIBRARY PHOTO - UNVERIFIED`

## Expected Files

Likely new files:

- `src/features/auth/*`
- `src/features/capture/*`
- `src/features/spots/report-*`
- `src/app/api/reports/route.ts`
- `supabase/migrations/*_auth_profiles.sql`
- `supabase/migrations/*_media_capture_metadata.sql`
- `supabase/migrations/*_storage_policies.sql`

## Acceptance Criteria

- A user can sign in with magic link.
- A signed-in user can create a report from a live photo.
- Anonymous users cannot create spots or media.
- Public browsing still works without sign-in.
- The app captures GPS and shows accuracy before submission.
- The new spot auto-places at captured coordinates.
- Media uploads to the existing `report-photos` Supabase Storage bucket.
- A `spot_media` row records capture metadata.
- The trusted server path sets initial verification status to `pending`.
- The client cannot directly set final verification fields.
- The UI clearly shows the report is pending verification.
- After submit, the new spot appears on the map after refetch.

## Verification Plan

Run:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Database checks:

- Confirm `profiles` exists.
- Confirm `spots.created_by` exists.
- Confirm `spot_media` capture metadata columns exist.
- Confirm uploads land in `report-photos`.
- Confirm RLS blocks anonymous inserts.
- Confirm authenticated insert policies only allow owner-scoped writes.
- Confirm direct client attempts to set final verification fields fail.

Browser/device checks:

- Test magic-link auth locally and on HTTPS deployment.
- Test camera in a real mobile browser.
- Test geolocation in a real mobile browser.
- Test denied camera permission.
- Test denied geolocation permission.
- Test poor GPS accuracy messaging.
- Test successful report submission.

## Phase 3 Done Means

Phase 3 is complete when a signed-in user can create a report from a live photo, the media lands in the existing `report-photos` Supabase Storage bucket, the spot appears on the map, and the server records the capture metadata with a pending verification state that Phase 3.5 can evaluate.
