# CleanLA Phase 3.5 Media Verification Plan

Phase 3.5 turns Phase 3's pending report media into server-decided verification states. It focuses on GPS, timestamp, source, and distance checks. It does not add cleanup flow, moderation queue, sharing, or city/311 submission.

## Objective

Verify report media as a strong on-site signal without pretending it is tamper-proof. The server decides final verification status; the client only submits evidence.

## Inputs From Phase 3

Phase 3 must already store:

- `spot_media.capture_source`
- `spot_media.captured_lat`
- `spot_media.captured_lng`
- `spot_media.gps_accuracy_m`
- `spot_media.client_captured_at`
- `spot_media.server_received_at`
- `spot_media.device_context`
- `spots.location`
- `spots.created_by`
- `spot_media.created_by`

Phase 3 media should enter this phase as:

- `verification_status = pending`
- `verification_reason = awaiting_phase_3_5_verification`

## Verification Constants

Use these defaults unless mobile testing proves they are too strict:

- `VERIFY_RADIUS_M = 50`
- `MAX_GPS_ACCURACY_M = 100`
- `MAX_UPLOAD_AGE_MIN = 10`

## Verification Statuses And Reasons

Use the existing enum:

- `pending`
- `verified`
- `unverified`
- `location_mismatch`
- `rejected`

Recommended reasons:

- `verified_on_site`
- `library_upload`
- `stale_upload`
- `missing_capture_metadata`
- `location_unconfirmed`
- `location_mismatch`
- `server_error`

## Trusted Execution Path

Default path: a single trusted server implementation.

Choose one during implementation:

- Next.js trusted server route/action using Supabase service role
- Supabase Edge Function `verify-media`

Do not implement both in Phase 3.5.

The trusted path must:

- validate the authenticated user or service role caller
- load the target `spot_media` and parent `spots` row
- refuse to verify media owned by another user unless called as service role
- set `server_received_at` if missing
- compute `distance_to_spot_m`
- update final `verification_status`
- update `verification_reason`
- return an understandable result for the UI

## Verification Algorithm

Run checks in this exact order:

1. **Source check**
   - If `capture_source = library`, set `unverified`.
   - Reason: `library_upload`.

2. **Required metadata check**
   - If captured coordinates, GPS accuracy, or client capture timestamp are missing, set `unverified`.
   - Reason: `missing_capture_metadata`.

3. **Freshness check**
   - Compare `server_received_at` or current server time to `client_captured_at`.
   - If older than `MAX_UPLOAD_AGE_MIN`, set `unverified`.
   - Reason: `stale_upload`.

4. **GPS accuracy check**
   - If `gps_accuracy_m > MAX_GPS_ACCURACY_M`, set `unverified`.
   - Reason: `location_unconfirmed`.

5. **Distance check**
   - Compute distance between captured coordinates and `spots.location` using PostGIS.
   - Store result in `distance_to_spot_m`.
   - If `distance_to_spot_m <= VERIFY_RADIUS_M + gps_accuracy_m`, set `verified`.
   - Reason: `verified_on_site`.
   - Otherwise set `location_mismatch`.
   - Reason: `location_mismatch`.

6. **Error fallback**
   - On unexpected trusted-path failure, keep or return `pending`.
   - Reason: `server_error`.

## Database Changes

If not already added in Phase 3, add:

- `spot_media.server_received_at`
- `spot_media.distance_to_spot_m`
- `spot_media.verification_reason`
- index on `spot_media(verification_status, created_at)`

Optional audit table:

- `media_verification_events`
  - `id`
  - `spot_media_id`
  - `previous_status`
  - `next_status`
  - `reason`
  - `distance_to_spot_m`
  - `created_at`

Default: defer audit table unless debugging or trust requirements demand it.

## UI Requirements

The report result UI must show:

- `LOCATION-VERIFIED`
- `UNVERIFIED`
- `LOCATION MISMATCH`
- `PENDING REVIEW`
- `ERROR - TRY AGAIN`

Copy must avoid the word `proof`. Prefer:

- `location-verified`
- `verified on site`
- `unverified`
- `location could not be confirmed`

## Acceptance Criteria

- Live media with fresh timestamp, acceptable GPS accuracy, and close coordinates becomes `verified`.
- Library media becomes `unverified`.
- Stale media becomes `unverified`.
- Poor-accuracy GPS becomes `unverified`.
- Media captured away from the spot becomes `location_mismatch`.
- Client-side attempts to directly set final verification fields fail.
- UI explains each result in plain language.

## Verification Tests

Run:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Database/server tests:

- fresh live capture inside radius -> `verified`
- live capture with old timestamp -> `unverified/stale_upload`
- live capture with poor accuracy -> `unverified/location_unconfirmed`
- library upload -> `unverified/library_upload`
- live capture far from spot -> `location_mismatch`
- missing metadata -> `unverified/missing_capture_metadata`

Manual mobile tests:

- real mobile live photo
- real mobile GPS allowed
- GPS denied
- camera denied
- low-signal GPS environment if available

## Phase 3.5 Done Means

Phase 3.5 is complete when pending Phase 3 report media can be evaluated by trusted server code into `verified`, `unverified`, or `location_mismatch`, with distance/timestamp reasoning stored in the database and explained clearly in the UI.
