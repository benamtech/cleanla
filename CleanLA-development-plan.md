# CleanLA Development Plan

Working name. CleanLA is a mobile-first civic cleanup PWA for Los Angeles: a semi-3D map of reported problem spots, verified photo reporting, cleanup documentation, and shareable public proof of progress.

This plan is designed for agentic engineering. Each phase is intentionally bounded, dependency-aware, and acceptance-tested before the next phase begins.

---

## Product Summary

CleanLA helps people browse, report, verify, clean, and share neighborhood problem spots such as trash piles, illegal dumping, and visible blight.

The core loop:

1. Browse a pitched, semi-3D Los Angeles map.
2. Report a problem spot with live camera capture and GPS metadata.
3. Mark a spot cleaned with a verified after-photo.
4. Share a public before/after page or generated social card.

The product differentiator is trust. CleanLA should never imply perfect proof, but it should make casual fraud harder by requiring live in-app capture, server-side verification, location checks, and clear labeling of verified versus unverified media.

---

## Integrity Model

### Principles

- Verified media must be captured live in-app using `getUserMedia`.
- Library uploads may be allowed for report context, but they are never verified.
- The server decides verification state. The client only submits evidence.
- Server time is authoritative. Client capture time is advisory.
- Verification means "strong on-site signal," not tamper-proof provenance.

### Capture Metadata

Collected client-side at capture time:

- `capture_source`: `live` or `library`
- `media_kind`: `report`, `before`, or `after`
- `captured_lat`
- `captured_lng`
- `gps_accuracy_m`
- `client_captured_at`
- `device_context`, optional lightweight browser/device hints

Recorded server-side:

- `server_received_at`
- `distance_to_spot_m`
- `verification_status`
- `verification_reason`
- `ip_region_result`, coarse and optional
- `moderation_status`

### Verification Statuses

Use a constrained enum:

- `pending`
- `verified`
- `unverified`
- `location_mismatch`
- `rejected`

Suggested tunable constants:

- `VERIFY_RADIUS_M = 50`
- `MAX_GPS_ACCURACY_M = 100`
- `MAX_UPLOAD_AGE_MIN = 10`

### Verification Rule

The verification function applies checks in order:

1. Source check: `library` media becomes `unverified` with reason `library_upload`.
2. Freshness check: stale client capture time becomes `unverified` with reason `stale_upload`.
3. GPS accuracy check: poor accuracy becomes `unverified` with reason `location_unconfirmed`.
4. Distance check: compute distance between captured point and spot using PostGIS. If `distance_to_spot_m <= VERIFY_RADIUS_M + gps_accuracy_m`, mark `verified`; otherwise mark `location_mismatch`.
5. Coarse IP-region check: if IP region clearly contradicts GPS region, mark or queue for review with reason `region_contradiction`.
6. Moderation check: media that fails automated or human moderation cannot be public even if location-verified.

A spot is considered verified once it has at least one public, verified `report` or `before` media item. A spot can be marked cleaned only after a verified `after` media item is accepted.

### Honest Limitations

The integrity model raises the bar against casual abuse, but it is not cryptographic proof. GPS can be spoofed, browser capture can be manipulated, and IP checks are coarse. Product copy should use language like "verified on site" or "location-verified submission," not "proof."

If provenance-grade verification becomes necessary later, evaluate C2PA Content Credentials as a separate product and infrastructure project.

---

## Locked Stack

- App: Next.js App Router, TypeScript, Tailwind CSS
- Hosting: Vercel
- PWA: Next.js manifest plus Serwist if custom service-worker behavior is needed
- Map: `react-map-gl` with Mapbox GL JS v3 and Mapbox Standard style
- Database: Supabase Postgres with PostGIS
- Auth: Supabase Auth, starting with magic link and OAuth as configured
- Storage: Supabase Storage
- Server functions: Supabase Edge Functions in Deno/TypeScript
- Realtime: Supabase Realtime where it materially improves UX
- Sharing: public spot pages, Open Graph metadata, Twitter Card metadata, `@vercel/og`, Web Share API
- Observability: Sentry and PostHog

---

## Engineering Operating Rules

For each phase:

- Start by checking the current repo state and existing conventions.
- Implement in dependency order: schema, server/API, data access, UI, tests, verification.
- Keep work scoped to the phase. Do not build later-phase features early unless they are required scaffolding.
- Add or update `.env.example` whenever environment variables change.
- Add database migrations for schema changes. Do not make untracked dashboard-only schema changes.
- Keep RLS policies close to the data model they protect.
- Prefer server-side validation over client-only checks.
- Use realistic seed data early so UI and queries can be verified.
- End the phase with acceptance checks and a short implementation note.

Recommended repo structure:

```text
src/
  app/
  components/
  features/
    map/
    spots/
    capture/
    sharing/
    moderation/
  lib/
    supabase/
    geo/
    env/
  types/
supabase/
  migrations/
  functions/
  seed.sql
public/
```

---

## Phase 1: Foundation

### Objective

Create a deployable, typed, PostGIS-enabled application skeleton with working local and hosted environments.

### Dependencies

None.

### Locked Decisions

- Use Next.js App Router with TypeScript.
- Use Tailwind CSS for styling.
- Use Supabase for database, auth, storage, and Edge Functions.
- Enable PostGIS before any geospatial schema is created.
- Deploy early to Vercel over HTTPS.

### Work Items

1. Initialize the Next.js project with:
   - TypeScript
   - App Router
   - Tailwind CSS
   - ESLint
   - `src/` directory
   - `@/*` import alias
2. Add Prettier and the Tailwind Prettier plugin.
3. Create the base folder structure:
   - `src/app`
   - `src/components`
   - `src/features`
   - `src/lib`
   - `src/lib/supabase`
   - `src/types`
   - `supabase/migrations`
   - `supabase/functions`
4. Install Supabase client dependencies.
5. Create typed Supabase browser and server client helpers.
6. Create `.env.example` with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `NEXT_PUBLIC_SITE_URL`
7. Create local `.env.local`, not committed.
8. Initialize Supabase locally or connect to a hosted Supabase project.
9. Enable the `postgis` extension through a migration.
10. Replace the default home page with a minimal health screen:
    - app name
    - environment label
    - Supabase connectivity result
    - deployment status hint
11. Deploy to Vercel and configure matching environment variables.

### Expected Files

- `src/app/page.tsx`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/env/*`
- `supabase/migrations/*_enable_postgis.sql`
- `.env.example`
- `README.md`

### Acceptance Criteria

- The app runs locally.
- The app deploys to Vercel over HTTPS.
- The home page confirms Supabase connectivity.
- PostGIS is enabled through a migration.
- `.env.example` documents all required variables.
- No feature tables or product UI exist yet.

### Verification

- Run lint.
- Run typecheck.
- Run the app locally.
- Confirm the deployed app loads over HTTPS.
- Confirm `postgis` is enabled in the database.

---

## Phase 2: Map MVP

### Objective

Build the read-only map experience: a pitched Los Angeles map, seeded spots, viewport-bounded fetching, clustered category pins, and a spot detail sheet.

### Dependencies

Phase 1 complete.

### Locked Decisions

- Use Mapbox GL JS v3 through `react-map-gl`.
- Use Mapbox Standard style.
- Center the default camera on Los Angeles.
- Use PostGIS for spot geography.
- Fetch spots through a bounded server/RPC query, not by loading all rows.

### Work Items

1. Add Mapbox dependencies.
2. Add a Mapbox token env check.
3. Create initial database schema:
   - `spots`
   - `spot_media`
   - relevant enums for category/status/media kind
4. Add PostGIS geography or geometry column for spot location.
5. Add spatial indexes.
6. Add public read RLS policies for visible spots and public media metadata.
7. Create seed data across Los Angeles:
   - multiple categories
   - multiple statuses
   - enough density to test clustering
8. Implement `spots_in_bounds` as a database function or server-side query.
9. Add a typed spot data access layer.
10. Build the map shell:
    - full-screen mobile-first layout
    - pitched camera
    - terrain or 3D style configuration where supported
    - loading and error states
11. On debounced viewport movement, fetch visible spots.
12. Render pins as a GeoJSON source with clustering.
13. Color pins by category.
14. Render cluster bubbles with counts.
15. Add a bottom sheet spot detail panel:
    - category
    - status
    - description
    - verification state placeholder
    - media placeholder
16. Add basic PWA manifest and app icons.

### Expected Files

- `src/features/map/*`
- `src/features/spots/*`
- `src/lib/geo/*`
- `supabase/migrations/*_spots.sql`
- `supabase/seed.sql`
- `src/app/manifest.ts` or `public/manifest.webmanifest`

### Acceptance Criteria

- The map loads centered on Los Angeles.
- The map has a pitched, semi-3D feel.
- Seeded spots appear as category-colored pins.
- Pins cluster when zoomed out.
- Panning or zooming refetches only visible spots.
- Tapping a pin opens a detail sheet.
- The site has a valid manifest and installability basics.

### Verification

- Run lint and typecheck.
- Verify seeded spots appear locally.
- Verify the database query returns only spots inside the viewport.
- Test map interaction on desktop and mobile viewport sizes.
- Confirm no auth is required for read-only browsing.

---

## Phase 3: Report MVP

### Objective

Allow signed-in users to create new problem spots with live photo capture, GPS metadata, storage upload, and server-side verification for report media.

### Dependencies

Phase 2 complete.

### Locked Decisions

- Supabase Auth gates contribution.
- Report media can be live or library uploaded, but only live media can become verified.
- New report pins auto-place from captured GPS coordinates.
- Verification runs in a Supabase Edge Function or trusted server path.
- The client never writes its own final verification status.

### Work Items

1. Implement Supabase Auth:
   - magic link first
   - Google and Apple if credentials are ready
   - session-aware layout
   - sign-in/sign-out UI
2. Add `profiles` table and signup trigger or first-login profile creation.
3. Harden RLS:
   - public read for visible spots
   - authenticated create for reports
   - owner-scoped writes where appropriate
   - no client-side writes to final verification fields
4. Create a Storage bucket for spot media.
5. Add Storage RLS policies:
   - authenticated uploads to user-scoped paths
   - public reads only for approved public media, or signed URLs until moderation exists
6. Build live camera capture:
   - `getUserMedia`
   - rear camera preference
   - explicit permission states
   - capture frame to canvas/blob
   - retry flow
7. Add geolocation capture:
   - `navigator.geolocation.getCurrentPosition`
   - accuracy display
   - retry for poor accuracy
8. Add client-side image compression before upload.
9. Build report flow:
   - start report
   - capture photo
   - collect GPS
   - choose category and severity
   - add description
   - submit
10. On submit, create the spot at captured coordinates.
11. Upload media to Storage.
12. Create a `spot_media` row with raw metadata and `pending` verification state.
13. Invoke verification function.
14. Verification function:
   - validates authenticated user
   - records server timestamp
   - checks source, freshness, GPS accuracy, and distance
   - updates media verification fields
   - updates spot verified aggregate state
15. Show report result:
   - verified
   - unverified
   - location mismatch
   - pending/error
16. Add library upload only as an unverified report-media option if needed for usability.

### Expected Files

- `src/features/auth/*`
- `src/features/capture/*`
- `src/features/spots/report-*`
- `supabase/functions/verify-media/*`
- `supabase/migrations/*_auth_profiles.sql`
- `supabase/migrations/*_media_verification.sql`
- `supabase/migrations/*_storage_policies.sql`

### Acceptance Criteria

- A user can sign in.
- A signed-in user can create a report from a live photo.
- The app captures GPS and shows accuracy before submission.
- The new spot auto-places at captured coordinates.
- Media uploads to Supabase Storage.
- The server sets verification status.
- A library-uploaded report, if enabled, is clearly marked unverified.
- A photo taken away from the created spot is not incorrectly verified.

### Verification

- Run lint and typecheck.
- Test the auth flow locally and on HTTPS deployment.
- Test camera and geolocation in a real mobile browser.
- Confirm RLS prevents anonymous writes.
- Confirm clients cannot update final verification fields directly.
- Confirm failed verification produces understandable UI.

---

## Phase 4: Cleanup Flow

### Objective

Allow users to mark spots cleaned using verified after-photos, display before/after evidence, and track profile contribution counts.

### Dependencies

Phase 3 complete.

### Locked Decisions

- Cleaning a spot requires a verified live `after` photo.
- Spot status transitions are server-controlled.
- Before/after display should prefer verified media.
- Profile counts are derived from accepted contributions, not client-maintained counters.

### Work Items

1. Expand status model:
   - `reported`
   - `in_progress`
   - `cleaned`
   - `reopened`
   - `hidden`
2. Add server-controlled status transition logic.
3. Add media pairing fields or query logic:
   - best report/before media
   - best after media
4. Build "Mark as cleaned" flow:
   - requires auth
   - requires live capture
   - requires GPS
   - captures `after` media
   - invokes verification
5. Update verification logic so `after` media must be live and within range of the existing spot.
6. Change spot status to `cleaned` only after verified after-media exists.
7. Add optimistic UI only where safe; reconcile with server result.
8. Build before/after display in spot detail sheet.
9. Add cleaned-state map styling.
10. Add user profile page:
    - submitted reports
    - verified reports
    - cleanups completed
    - recent contributions
11. Add live update behavior where useful:
    - refetch on status change
    - Supabase Realtime for active spot detail views if simple
12. Add audit/history table if status transitions need traceability.

### Expected Files

- `src/features/spots/cleanup-*`
- `src/features/profile/*`
- `supabase/migrations/*_spot_status_transitions.sql`
- `supabase/migrations/*_contribution_history.sql`

### Acceptance Criteria

- A signed-in user can mark a spot cleaned only with a live after-photo.
- The server refuses cleanup status if after-media is unverified.
- Cleaned spots display before/after evidence.
- Profile counts reflect real accepted contributions.
- Map and detail views reflect cleaned status.

### Verification

- Run lint and typecheck.
- Test cleanup flow on HTTPS with mobile camera and geolocation.
- Confirm library media cannot mark a spot cleaned.
- Confirm direct client attempts to set `cleaned` fail.
- Confirm profile counts are correct after multiple contributions.

---

## Phase 5: Trust + Moderation

### Objective

Gate public visibility behind AI-powered content screening before broad public sharing. Claude Haiku 4.5 vision screens every photo on upload. Anything it rejects or cannot confidently evaluate goes to a human admin queue. Humans are the fallback, not the primary path.

### Dependencies

Phase 3 complete. Preferably Phase 4 complete before final acceptance.

### Locked Decisions

- Moderation ships before public launch.
- Public visibility depends on moderation state — `spots_in_bounds` and all public queries only return media with `moderation_status = 'approved'`.
- AI screening is the primary path. Human review is the fallback for uncertain or rejected content only.
- Provider is Claude Haiku 4.5 vision (Anthropic). No abstraction layer needed — committing to one provider keeps the implementation simple.
- Screening runs synchronously in the same API request as upload, the same way verification does. No Edge Functions, no background jobs, no polling.
- All CleanLA photos are taken outdoors in public spaces. Face blur, license plate redaction, and private property policy are deferred to Phase 7 (Launch) if they become necessary.
- On any AI call failure the media falls back to `moderation_status = 'pending'` — never auto-approved on error.

### AI Screening Design

**Model:** `claude-haiku-4-5` (vision)

**Cost:** ~$0.001–0.002 per image at 1024px. Negligible at civic app scale.

**System prompt (to keep in `src/lib/moderation/moderate-media.ts`):**

```
You are a content moderator for CleanLA, a civic app where users photograph
public blight in Los Angeles. All photos are taken outdoors in public spaces.

The user's claimed category: {category}

Respond with JSON only — no explanation, no markdown:
{
  "approved": true | false,
  "reason": "one short phrase if rejected, null if approved",
  "category_match": true | false
}

Approve if: an outdoor photo plausibly showing civic blight — trash, graffiti,
illegal dumping, overgrowth, encampment debris, or biohazard — even if minor.

Reject if: blank or black image, screenshot of a screen, photo of a photo,
completely unrelated to outdoor civic conditions, or intentionally offensive content.
```

**Outcomes:**
- `approved: true` → `moderation_status = 'approved'`, media is immediately public
- `approved: false` → `moderation_status = 'rejected'`, goes to human admin queue for review
- API call throws or returns unparseable JSON → `moderation_status = 'pending'`, goes to human admin queue

**Call location:** after `verifyMedia()` in both `POST /api/reports` and `POST /api/cleanup`. Same synchronous pattern. Result returned in the API response alongside `verification_status`.

### Work Items

1. Add moderation fields to `spot_media` via migration:
   - `moderation_status` — enum: `pending`, `approved`, `rejected` (default: `pending`)
   - `moderation_reason` — text, nullable (AI-generated phrase or human note)
   - `moderated_by` — uuid nullable, FK to `auth.users` — null means AI, uuid means human admin
   - `moderated_at` — timestamptz nullable
2. Update `spots_in_bounds` RPC to filter out media with `moderation_status != 'approved'`:
   - `report_media_url` subquery: add `AND sm.moderation_status = 'approved'`
   - `after_media_url` subquery: same
   - A spot with no approved media shows `null` URLs until at least one photo clears
3. Create `src/lib/moderation/moderate-media.ts`:
   - `moderateMedia(input: { mediaId, category, imageUrl })` — calls Haiku 4.5 vision
   - Parses JSON response into `{ status: 'approved' | 'rejected' | 'pending', reason: string | null }`
   - Updates `spot_media.moderation_status`, `moderation_reason`, `moderated_at` via admin client
   - Falls back to `pending` on any error — never throws
4. Call `moderateMedia()` in `POST /api/reports` after `verifyMedia()` — pass `category` and `publicUrl`
5. Call `moderateMedia()` in `POST /api/cleanup` after `verifyMedia()` — same pattern
6. Add `ANTHROPIC_API_KEY` to env vars (server-only). Add to `.env.example`.
7. Build admin moderation queue at `src/app/admin/moderation/page.tsx`:
   - Server component, gated to admin users only (check `profiles.is_admin` boolean or a simple hardcoded uid list for MVP)
   - Lists `spot_media` rows where `moderation_status IN ('pending', 'rejected')`, ordered by `created_at ASC`
   - Shows thumbnail, category, verification status, AI reason (if any), spot description
   - APPROVE and REJECT buttons — POST to `/api/admin/moderation/[mediaId]`
8. Create `POST /api/admin/moderation/[mediaId]/route.ts`:
   - Admin-only (validate user is admin server-side)
   - Accepts `{ action: 'approved' | 'rejected', reason?: string }`
   - Updates `spot_media` via admin client: `moderation_status`, `moderation_reason`, `moderated_by = user.id`, `moderated_at`
9. Add `moderation_status` index to `spot_media` for queue queries
10. Add brief content policy to `docs/content-policy.md`:
    - what CleanLA photos must show (outdoor civic blight)
    - what will be rejected (unrelated content, offensive material)
    - takedown contact path

### Expected Files

- `src/lib/moderation/moderate-media.ts`
- `src/app/admin/moderation/page.tsx`
- `src/app/api/admin/moderation/[mediaId]/route.ts`
- `supabase/migrations/*_phase5_moderation.sql`
- `docs/content-policy.md`

### Acceptance Criteria

- Every uploaded photo is screened by Haiku 4.5 in the same API request that creates the spot.
- Approved photos appear on the public map immediately after upload.
- Rejected and uncertain photos are hidden from the public map until a human admin approves them.
- Admin queue shows all pending and rejected items with approve/reject controls.
- Non-admin users cannot access the admin queue or the moderation API route.
- AI call failures leave the media in `pending` state — never auto-approved.
- `moderated_by` is null for AI decisions and a user uuid for human decisions.

### Verification

- Run lint and typecheck.
- Submit a legitimate spot photo and confirm `moderation_status = 'approved'` in the DB and photo appears on map.
- Submit an obviously unrelated photo (e.g., a blank image) and confirm it lands in `rejected` or `pending` and does not appear on the map.
- Simulate an AI API failure (bad key) and confirm media lands in `pending`, not `approved`.
- Access the admin queue as a non-admin user and confirm 401/403.
- Approve a pending item as admin and confirm it appears on the map.
- Reject an approved item as admin and confirm it disappears from the map.

---

## Phase 6: Sharing

### Objective

Create trustworthy public spot pages and share assets for cleanups and problem spots across link previews, mobile share sheets, downloads, X, Facebook, and an Instagram fallback path.

### Dependencies

Phases 3 and 5 complete. Phase 4 complete for cleanup-specific sharing.

### Locked Decisions

- Public pages live at `/s/[id]`.
- Only approved public content appears on public pages and cards.
- Use one card-generation system for OG previews and downloadable/shareable images where practical.
- Treat Instagram Stories deep-linking as experimental. The reliable fallback is downloadable media plus Web Share API.

### Work Items

1. Build public spot page:
   - status
   - category
   - approximate location
   - verified badge when applicable
   - before/after display for cleanups
   - report-focused layout for unresolved spots
2. Add metadata generation:
   - Open Graph title/description/image
   - Twitter Card tags
   - canonical URL
3. Build `@vercel/og` image endpoint:
   - cleanup variant
   - problem-spot variant
   - verified badge
   - timestamp
   - approximate coordinates or neighborhood label
   - CleanLA branding
4. Add share actions:
   - native Web Share API URL sharing
   - native Web Share API file sharing when supported
   - image download fallback
   - copy link
   - X intent link
   - Facebook share link
5. Add Instagram fallback:
   - download image
   - use native share sheet where available
   - optionally experiment with deep link on supported devices only
6. Validate public pages against moderation state.
7. Add noindex behavior for hidden/rejected content.
8. Validate previews with external debuggers before launch.

### Expected Files

- `src/app/s/[id]/page.tsx`
- `src/app/api/og/spot/[id]/route.tsx`
- `src/features/sharing/*`
- `src/lib/public-url/*`

### Acceptance Criteria

- Every approved public spot has a working public page.
- Cleanup pages show before/after evidence.
- Problem-spot pages show current need without implying cleanup.
- Link previews render a branded card image.
- Web Share works on supported mobile browsers.
- Download/copy fallbacks work everywhere.
- X and Facebook sharing open correctly formed URLs.
- Instagram is handled through reliable fallback behavior, with deep-linking only if proven.

### Verification

- Run lint and typecheck.
- Test public page metadata.
- Test OG image generation locally and on Vercel.
- Test Web Share on mobile.
- Test fallback download and copy link on desktop.
- Confirm rejected/private spots do not expose public cards.

---

## Phase 7: Scale + Launch

### Objective

Prepare CleanLA for public usage: performance, observability, cost posture, iOS PWA hardening, SEO basics, custom domain, and launch readiness.

### Dependencies

Phases 1 through 6 complete.

### Locked Decisions

- Keep Mapbox unless cost or usage makes migration necessary.
- Keep MapLibre as a documented cost lever, not a pre-launch rewrite.
- Launch only after camera, geolocation, sharing, and moderation flows are tested on real devices.

### Work Items

1. Performance pass:
   - full-LA seed/load testing
   - viewport query tuning
   - clustering tuning
   - map render profiling
   - media image sizing and caching
2. Database hardening:
   - review indexes
   - review RLS policies
   - add query limits
   - add pagination where needed
   - review expensive functions
3. Observability:
   - Sentry client and server errors
   - PostHog analytics
   - key funnel events
   - privacy-conscious analytics settings
4. PWA hardening:
   - installability checks
   - offline shell
   - app icons and splash behavior
   - iOS installed-PWA camera test
   - iOS installed-PWA geolocation test
   - graceful handling of push limitations
5. Cost review:
   - Mapbox map loads
   - Supabase database/storage/egress
   - Claude Haiku 4.5 vision moderation cost (~$0.001–0.002 per image; model the monthly cost at projected submission volume)
   - Vercel function/image generation cost
6. Document MapLibre migration trigger:
   - monthly map cost threshold
   - expected engineering cost
   - tile provider candidate
7. Launch surface:
   - custom domain
   - basic landing/about page
   - SEO basics
   - privacy policy
   - terms/community guidelines
   - contact/takedown path
8. Security review:
   - env var exposure
   - service role usage
   - Storage policies
   - admin route protection
   - Edge Function auth checks
9. Final QA:
   - real mobile report flow
   - real mobile cleanup flow
   - public share flow
   - moderation flow
   - rejected content flow
10. Optional launch enhancements:
    - cleanup crew/org accounts
    - leaderboards
    - streaks
    - neighborhood filters
    - city partner export

### Expected Files

- `src/lib/analytics/*`
- `src/lib/sentry/*`
- `docs/launch-checklist.md`
- `docs/cost-model.md`
- `docs/maplibre-migration-trigger.md`
- `docs/security-review.md`

### Acceptance Criteria

- The app remains responsive with realistic full-LA data volume.
- Errors are captured in Sentry.
- Core product events are visible in analytics.
- Camera and geolocation work in mobile browsers and installed iOS PWA mode.
- Public pages, policies, and takedown path are live.
- Cost posture is documented.
- Launch checklist is complete.

### Verification

- Run lint, typecheck, and production build.
- Run mobile QA on iOS Safari, installed iOS PWA, Android Chrome, and desktop Chrome/Safari where available.
- Run a complete report-to-cleanup-to-share scenario.
- Confirm no private service keys are exposed client-side.
- Confirm hidden/rejected content cannot be accessed through public pages or OG endpoints.

---

## Recommended Build Order

Use this order when driving the project with an agent:

1. Ask the agent to complete exactly one phase.
2. Require it to inspect the repo before changing files.
3. Require migrations for schema changes.
4. Require lint/typecheck/build verification at the end of each phase.
5. Require a short handoff note listing:
   - what changed
   - how it was verified
   - known gaps
   - next recommended phase

Do not ask an agent to "build CleanLA" in one pass. Ask it to build the next phase and stop at the acceptance criteria.

---

## Phase Gate Checklist

Before moving to the next phase, confirm:

- Acceptance criteria are met.
- There are no known critical bugs.
- Environment variables are documented.
- Database migrations are committed.
- RLS behavior was tested for anonymous, authenticated, owner, and admin roles where applicable.
- Mobile UX was checked for any camera/geolocation phase.
- Public content paths respect moderation and privacy rules.
- The README or relevant docs were updated.

