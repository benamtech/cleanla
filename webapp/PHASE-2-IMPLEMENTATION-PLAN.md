# CleanLA Phase 2 Implementation Plan

Phase 2 builds the read-only map MVP for CleanLA: a pitched Los Angeles map, seeded public spots, viewport-bounded fetching, clustered category pins, and a spot detail sheet.

This plan follows the root `CleanLA-development-plan.md` Phase 2 scope and adopts the safe, reusable parts of the 369 design system as a visual standard. It does not adopt the ADN-specific `src/base`, `src/pillars`, `src/roof`, six-program model, or resolver engine architecture.

## Architecture Decision

CleanLA uses a conventional Next.js feature architecture because the product domains are civic and direct: map, spots, reports, capture, moderation, sharing, auth, and shared infrastructure.

The 369 system applies to visual implementation only:

- spacing uses multiples of 3
- border radius is 0 everywhere except circular map pins
- containers use `1px solid #999999`
- typography uses Helvetica/Arial fallback, 12px body, and the 9/12/15/18/24/30/33/36 scale
- labels, buttons, badges, and headers are uppercase
- colors use the 369 token set only
- no shadows, gradients, blur, decorative UI, emoji, or icon libraries
- responsive layouts use deterministic collapse patterns such as `repeat(auto-fit, minmax(...))`

## Target File Structure

```text
webapp/src/
  app/
    page.tsx
    manifest.ts
  components/
    layout/
    ui/
  features/
    map/
    spots/
  lib/
    env/
    geo/
    mapbox/
    supabase/
  types/
supabase/
  migrations/
  seed.sql
public/
```

`src/app` remains a thin routing shell. Product behavior belongs in `features/*`, shared service code in `lib/*`, reusable visual primitives in `components/ui`, and app-level layout in `components/layout`.

## Phase 2 Work Plan

### 1. Dependency And Environment Setup

- Install `react-map-gl` and `mapbox-gl`.
- Add Mapbox CSS import in the app shell or map module.
- Confirm `.env.example` documents `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Add a server/client-safe Mapbox token helper under `src/lib/mapbox`.
- Fail clearly when the token is missing, using a 369-compliant error panel.

Acceptance:

- App builds with Mapbox dependencies installed.
- Missing Mapbox token produces a clear UI state, not a runtime crash.

### 2. Spot Schema And Seed Data

- Add a migration for:
  - `spot_category` enum
  - `spot_status` enum
  - `media_kind` enum
  - `verification_status` enum placeholder
  - `spots`
  - `spot_media`
- Store spot location using PostGIS.
- Add spatial indexes for viewport queries.
- Add public read RLS policies for visible spots and public media metadata.
- Update `supabase/seed.sql` with realistic Los Angeles spots across neighborhoods, categories, and statuses.

Suggested Phase 2 spot categories:

- `illegal_dumping`
- `trash`
- `graffiti`
- `encampment_debris`
- `biohazard`
- `overgrowth`

Suggested Phase 2 statuses:

- `reported`
- `in_progress`
- `cleaned`
- `hidden`

Acceptance:

- Seeded data covers enough density to test clustering.
- Anonymous users can read visible spots.
- Anonymous users cannot write spots or media.

### 3. Viewport-Bounded Spot Query

- Implement `spots_in_bounds` as a Postgres function or server-side query.
- Inputs:
  - west longitude
  - south latitude
  - east longitude
  - north latitude
  - optional limit
- Return only public, visible spots inside the requested bounds.
- Add TypeScript types in `src/features/spots/types.ts`.
- Add data access in `src/features/spots/queries.ts` or `src/lib/geo` where geography math is shared.

Acceptance:

- Query returns no rows outside the viewport.
- Query has a limit.
- Query uses the spatial index.

### 4. Map Shell

- Replace the current validation prototype home page with the Phase 2 map experience.
- Build a mobile-first full-viewport map shell.
- Center default camera on Los Angeles.
- Use a pitched camera and Mapbox Standard style.
- Provide loading, empty, missing-token, and error states.
- Keep overlays 369-compliant:
  - square panels
  - 1px gray borders
  - token colors
  - uppercase controls
  - spacing in multiples of 3

Acceptance:

- The map loads centered on Los Angeles.
- The default camera has a pitched, semi-3D feel.
- UI works on desktop and mobile viewports.

### 5. Visible Spot Fetching

- Track viewport bounds from the map.
- Debounce movement before fetching.
- Fetch spots only for the current bounds.
- Avoid loading all rows into the browser.
- Show a compact 369 status strip with visible count, fetch status, and error state.

Acceptance:

- Panning or zooming refetches visible spots.
- The request payload contains bounds.
- The UI remains usable while data refreshes.

### 6. Pins And Clusters

- Convert visible spots to GeoJSON.
- Render spots with a Mapbox GeoJSON source.
- Enable clustering in Mapbox.
- Color pins by category using only approved 369-compatible tokens.
- Render cluster bubbles with counts.
- Use circular pins only for functional map markers, the one allowed border-radius exception.

Category color mapping should stay small and legible:

- illegal dumping: `#a60315`
- trash: `#001089`
- graffiti: `#c7a87d`
- encampment debris: `#999999`
- biohazard: `#228B22`
- overgrowth: `#b8dae8`

Acceptance:

- Individual pins render by category.
- Clusters render counts when zoomed out.
- Marker styling does not introduce shadows, gradients, or icon libraries.

### 7. Spot Detail Sheet

- Tapping a pin opens a bottom sheet.
- The sheet displays:
  - category
  - status
  - description
  - neighborhood or approximate coordinates
  - verification placeholder
  - media placeholder
- The sheet uses 369 visual rules:
  - square edges
  - 1px gray border
  - manila or white surface
  - uppercase labels
  - 9px metadata and 12px body
- Add close control using a text glyph such as `[x]`.

Acceptance:

- Tapping a pin opens the correct spot.
- Closing the sheet returns to the map.
- The sheet is usable on mobile without covering the whole map unless viewport height requires it.

### 8. PWA Basics

- Add `src/app/manifest.ts` or `public/manifest.webmanifest`.
- Add minimal app icons in `public/`.
- Set app name, short name, theme color, background color, and standalone display mode.
- Keep icon artwork simple and compatible with the square 369 visual direction.

Acceptance:

- Manifest is valid.
- Browser recognizes installability basics.

### 9. Verification And Handoff

- Run lint.
- Run typecheck.
- Run production build if dependencies and env permit.
- Verify local map interaction in desktop viewport.
- Verify local map interaction in mobile viewport.
- Verify the bounded query directly against the database.
- Confirm no auth is required for read-only browsing.
- Write a short Phase 2 implementation note with:
  - what changed
  - how it was verified
  - known gaps
  - recommended Phase 3 entry point

## Out Of Scope For Phase 2

- User sign-in
- Creating reports
- Camera capture
- Media upload
- Live verification
- Cleanup flow
- Moderation queue
- Public share pages
- Analytics and observability

## Phase 2 Done Means

- The app opens directly into a Los Angeles map.
- Seeded public spots appear without auth.
- Spots cluster and uncluster naturally as the user zooms.
- Panning and zooming fetch only visible spots.
- A tapped spot opens a useful detail sheet.
- The app has PWA manifest basics.
- The UI follows the safe 369 visual rules without adopting ADN-specific app architecture.
