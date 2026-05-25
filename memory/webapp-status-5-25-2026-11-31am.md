# CleanLA Webapp Status - May 25, 2026, Phase 5 Complete

Phase 5 AI Moderation is now implemented and live. Every photo uploaded to CleanLA is now screened by Claude Haiku 4.5 vision synchronously in the same API request as the upload — the same pattern as `verifyMedia()`. Photos that pass are immediately public on the map. Photos that fail or can't be parsed land in a human admin queue. The map now only surfaces approved media.

This note updates `memory/webapp-status-5-25-2026-9-53am.md` and supersedes any earlier reference to the moderation queue being unimplemented.

---

## Plain-English Summary

Before this session: every uploaded photo was public the moment it hit storage. There was no content screening.

After this session: every photo is evaluated by Claude Haiku 4.5 vision in under a second before it appears on the map. The AI decides approved, rejected, or pending (for uncertainty or API errors). Rejected and pending items go to a human admin queue at `/admin/moderation`. The map's `spots_in_bounds` RPC now filters out any media that hasn't been approved — a spot with no approved media shows null photo URLs until at least one clears.

The full loop now looks like:

1. User submits report → photo uploaded → `verifyMedia()` runs → `moderateMedia()` runs → map shows pin if media approved
2. User marks spot cleaned → after-photo uploaded → same dual-check → cleaned pin only shows after-photo if approved
3. Admin sees `/admin/moderation` queue → approves or rejects → map updates on next load

---

## What Changed Since The Last Memory Note

The previous `5-25-2026 9:53 AM` note reflected Phase 3.5 complete. Between that note and this one, Phase 4 (Cleanup Flow) was also completed. This note covers the full Phase 5 implementation completed today.

**Phase 5 work completed this session:**

- Created `supabase/migrations/20260525000600_phase5_moderation.sql`:
  - New `moderation_status` enum: `pending`, `approved`, `rejected`
  - Four new columns on `spot_media`: `moderation_status` (default `pending`), `moderation_reason` (text, nullable), `moderated_by` (uuid FK to `auth.users`, null = AI decision, uuid = human decision), `moderated_at` (timestamptz)
  - Index on `(moderation_status, created_at ASC)` for queue queries
  - `is_admin boolean NOT NULL DEFAULT false` added to `profiles`
  - `spots_in_bounds` RPC replaced: both `report_media_url` and `after_media_url` subqueries now require `AND sm.moderation_status = 'approved'`
  - Applied to hosted Supabase project `wibryaumouxojphjmyni` via MCP connector

- Created `src/lib/moderation/moderate-media.ts`:
  - `moderateMedia(admin, { spotMediaId, category, imageUrl })` — mirrors `verifyMedia()` exactly in shape
  - Calls `claude-haiku-4-5` with the moderation system prompt; category is interpolated at call time
  - Parses JSON response: `approved: true` → `approved`, `approved: false` → `rejected`, parse failure → `pending`
  - Updates `spot_media` in place: `moderation_status`, `moderation_reason`, `moderated_at`, `moderated_by = null` (AI)
  - On any thrown error: catches, stamps `moderation_reason = 'ai_call_error'`, returns `pending` — never throws, never auto-approves
  - Installed `@anthropic-ai/sdk` as a dependency

- Updated `POST /api/reports` (`src/app/api/reports/route.ts`):
  - Calls `moderateMedia()` synchronously after `verifyMedia()`
  - Returns `moderation_status` in the 201 response

- Updated `POST /api/cleanup` (`src/app/api/cleanup/route.ts`):
  - Selects `category` from the spot (previously only `id, status`)
  - Calls `moderateMedia()` synchronously after `verifyMedia()`
  - Returns `moderation_status` in the 200 response
  - Note: spot status transition to `cleaned` remains gated on `verification.status === 'verified'` only — moderation controls media visibility, not spot lifecycle

- Created `src/app/admin/moderation/page.tsx`:
  - Server component, auth-gated: checks `supabase.auth.getUser()` then `profiles.is_admin` via admin client
  - Non-admin and unauthenticated users are redirected to `/`
  - Lists `spot_media` rows with `moderation_status IN ('pending', 'rejected')` ordered by `created_at ASC`
  - 369-compliant table: `#94a3d6` window bar, `#f8eac7` header row, `1px solid #999999` borders, 12px body, UPPERCASE labels, no rounded corners, no shadows
  - Columns: thumbnail (48×48), category, kind, status (color-coded), AI reason, description, timestamp, action buttons

- Created `src/app/admin/moderation/ModerationActions.tsx`:
  - Client component (`"use client"`) — APPROVE and REJECT buttons
  - POSTs to `/api/admin/moderation/[mediaId]` then calls `router.refresh()` to update the queue without a full page reload
  - Busy state disables both buttons during the request

- Created `src/app/api/admin/moderation/[mediaId]/route.ts`:
  - POST only; reads `{ action, reason }` from JSON body
  - Double auth gate: `auth.getUser()` → 401, then `profiles.is_admin` check → 403
  - Updates `spot_media`: `moderation_status`, `moderation_reason`, `moderated_by = user.id`, `moderated_at`
  - `moderated_by` is the admin's UUID — distinguishes human decisions from AI decisions at the column level

- Updated `.env.example`: added `ANTHROPIC_API_KEY` with server-only annotation

- Created `docs/content-policy.md`: what photos must show, what gets rejected, how moderation works, takedown contact path

---

## Moderation Architecture

```
POST /api/reports or /api/cleanup
  → upload photo to storage
  → insert spot_media row (moderation_status = 'pending')
  → verifyMedia()  — GPS/freshness checks
  → moderateMedia() — Haiku 4.5 vision
      approved  → moderation_status = 'approved'  → appears on map immediately
      rejected  → moderation_status = 'rejected'  → human queue
      pending   → moderation_status = 'pending'   → human queue (AI error fallback)
  → return { verification_status, moderation_status } in response
```

```
spots_in_bounds RPC
  WHERE sm.moderation_status = 'approved'   ← both subqueries
```

```
/admin/moderation
  → is_admin gate
  → lists pending + rejected
  → APPROVE / REJECT → POST /api/admin/moderation/[mediaId]
      → updates moderation_status, moderated_by = user.id
      → router.refresh() shows updated queue
```

---

## AI Moderation Details

- **Model:** `claude-haiku-4-5` (vision)
- **Cost:** ~$0.001–0.002 per image at 1024px — negligible at civic scale
- **Input:** image URL from Supabase storage (public bucket) + spot category
- **Output:** JSON `{ approved, reason, category_match }`
- **Approve threshold:** any outdoor photo plausibly showing civic blight — trash, graffiti, illegal dumping, overgrowth, encampment debris, biohazard — even if minor
- **Reject triggers:** blank/black image, screenshot, photo of photo, completely unrelated, intentionally offensive
- **Failure behavior:** any API error, network failure, or unparseable JSON → `pending` → human queue. Auto-approval on error is impossible by design.
- **`moderated_by` audit trail:** `null` for all AI decisions, user UUID for all human decisions

---

## Hosted Supabase Status

Project: `wibryaumouxojphjmyni` (us-east-2)

All 7 migrations applied and in sync:

| Version | Name |
|---|---|
| 20260524233031 | enable_postgis |
| 20260525000300 | phase3_report_mvp |
| 20260525021606 | reports_table |
| 20260525022034 | phase2_spots |
| 20260525164801 | phase3_5_verification |
| 20260525175007 | phase4_cleanup |
| 20260525000600 | phase5_moderation |

Phase 5 migration applied via Supabase MCP connector (not CLI). Confirmed `success: true`.

---

## Environment Variables

Six vars now required:

| Var | Side | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | unchanged |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | unchanged |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | public | unchanged |
| `NEXT_PUBLIC_SITE_URL` | public | unchanged |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | unchanged |
| `ANTHROPIC_API_KEY` | server-only | **new in Phase 5** |

Add `ANTHROPIC_API_KEY` to `.env.local` before testing moderation locally.

---

## Admin Setup

The `profiles` table now has `is_admin boolean NOT NULL DEFAULT false`. No migration seeds this — it defaults false for everyone. To give yourself admin access:

1. Go to Supabase Table Editor → `profiles`
2. Find your row (match by `email` or `id`)
3. Set `is_admin = true`
4. `/admin/moderation` will now work for your session

---

## Code Quality

- `npm run typecheck` — clean (zero errors)
- `npm run lint` — clean (exit code 0)

---

## What Still Needs Real-World Verification

Before treating Phase 5 as fully validated:

- Submit a genuine outdoor blight photo and confirm `moderation_status = 'approved'` in the DB and the photo appears on the map
- Submit a blank or clearly unrelated image and confirm it lands in `rejected` or `pending` and does not appear on the map
- Set `ANTHROPIC_API_KEY` to a bad value and confirm the media lands in `pending`, not `approved`
- Access `/admin/moderation` as a non-admin user and confirm redirect to `/`
- POST `/api/admin/moderation/[mediaId]` without admin credentials and confirm 403
- As admin, approve a `pending` item and confirm the map shows it on next load
- As admin, reject an `approved` item and confirm the map hides it
- Confirm `moderated_by = null` for AI decisions and a real UUID for human decisions in the DB

---

## First Steps For Phase 6

Phase 6 is Sharing: public spot pages at `/s/[id]`, Open Graph image generation with `@vercel/og`, and Web Share API integration.

**Before starting Phase 6:**
- Complete the real-device Phase 5 verification list above
- Confirm `ANTHROPIC_API_KEY` is set in the deployment environment (Vercel env vars)
- Flip `is_admin` for at least one account and do a full admin queue test pass

**Phase 6 first steps, in order:**

1. **Public spot page** — `src/app/s/[id]/page.tsx`
   - Server component, no auth required
   - Reads `spots` + approved `spot_media` — must filter `moderation_status = 'approved'` on the query (do not reuse `spots_in_bounds` which is optimized for the map, not detail pages)
   - Two layouts: cleanup variant (before + after side by side) and problem-spot variant (single report photo + current status)
   - Shows category, approximate location (neighborhood label, not exact coordinates), verified badge when `verification_status = 'verified'`, severity, description
   - `noindex` meta tag when `spot.status = 'hidden'` or media is not approved
   - This is the foundation everything else in Phase 6 depends on — build and test it first

2. **OG metadata on the public page** — in the same `page.tsx` via Next.js `generateMetadata`
   - `title`: "Illegal Dumping on [neighborhood] · CleanLA" (or equivalent for other categories)
   - `description`: the spot's description field, truncated to 160 chars
   - `og:image`: point to the OG image route (step 3), not the raw storage URL
   - `twitter:card: summary_large_image`
   - `canonical` URL pointing to `NEXT_PUBLIC_SITE_URL/s/[id]`

3. **OG image endpoint** — `src/app/api/og/spot/[id]/route.tsx`
   - Uses `@vercel/og` (`ImageResponse`) — install as a dependency
   - Two variants driven by whether an after-photo exists: cleanup card shows before/after thumbnails, problem-spot card shows the report photo
   - Include: category label (UPPERCASE), neighborhood, verified badge if applicable, CleanLA wordmark, timestamp
   - Dimensions: 1200×630 (standard OG); keep JSX simple, `@vercel/og` has a limited subset of CSS
   - Filter to approved media only — never render unmoderated photos in OG cards

4. **Share actions** — `src/features/sharing/ShareActions.tsx` (client component)
   - Web Share API (`navigator.share`) for URL sharing — works on iOS Safari and Android Chrome
   - Web Share API file sharing (`navigator.share({ files })`) where `navigator.canShare({ files })` is true — for image sharing direct to apps
   - Copy link fallback (clipboard API) for desktop
   - X intent link: `https://twitter.com/intent/tweet?url=...&text=...`
   - Facebook share link: `https://www.facebook.com/sharer/sharer.php?u=...`
   - Download image button as last resort (fetch the OG image URL, trigger download)
   - Feature-detect everything — do not assume Web Share is available

5. **Validate previews** before declaring Phase 6 complete:
   - LinkedIn Post Inspector, Twitter Card Validator, Facebook Sharing Debugger
   - Test Web Share on a real iOS and Android device
   - Confirm rejected/hidden spots do not expose OG image or spot data

---

## What Not To Do Next

Do not jump ahead to:

- Phase 7 (performance, observability, PWA hardening, custom domain)
- Face blur or license plate redaction (deferred to Phase 7 if needed)
- Google or Apple sign-in
- 311 / city submission
- Leaderboards or streaks
- Signed URLs for storage (still the Phase 5/7 deferred item — bucket listing advisory remains low risk for now)

---

## Useful Files To Know

- `webapp/src/lib/moderation/moderate-media.ts` — Haiku 4.5 vision screening; mirrors `verifyMedia()` in shape
- `webapp/src/lib/verification/verify-media.ts` — 6-step GPS/freshness verification
- `webapp/src/app/api/reports/route.ts` — calls verifyMedia then moderateMedia; returns both statuses
- `webapp/src/app/api/cleanup/route.ts` — same pattern for after-photos
- `webapp/src/app/admin/moderation/page.tsx` — admin queue (is_admin gated)
- `webapp/src/app/api/admin/moderation/[mediaId]/route.ts` — approve/reject endpoint
- `webapp/src/features/reports/constants.ts` — VERIFY_RADIUS_M, MAX_GPS_ACCURACY_M, MAX_UPLOAD_AGE_MIN
- `webapp/supabase/migrations/20260525000600_phase5_moderation.sql` — moderation schema
- `docs/content-policy.md` — public content policy

---

## One-Sentence Version

CleanLA now screens every uploaded photo with Claude Haiku 4.5 vision synchronously on upload — approved photos appear on the map immediately, anything else goes to a human admin queue at `/admin/moderation`, and the map's RPC filters out all unapproved media.
