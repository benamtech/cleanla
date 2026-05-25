# CleanLA Webapp Status - May 24, 2026, 7:02 PM

This note is for a collaborating developer who may not be deep in the codebase. The goal is to make it clear what has already been built, what still needs help, and what not to spend time on yet.

## Plain-English Summary

CleanLA is currently moving from the early validation prototype into the Phase 2 map MVP.

The webapp now opens to a read-only Los Angeles map instead of the old report form/feed landing page. The map is meant to show public cleanup/problem spots across LA. It uses Mapbox, fetches spots only inside the visible map area, clusters nearby pins, and opens a detail panel when a spot is selected.

The app is not ready for public reporting yet. Phase 2 is only about browsing the map.

## What Is Already Implemented

- The Phase 2 plan was written in `webapp/PHASE-2-IMPLEMENTATION-PLAN.md`.
- A handoff note was written in `webapp/PHASE-2-HANDOFF.md`.
- The home page at `/` now renders the map MVP.
- Mapbox dependencies were added:
  - `mapbox-gl`
  - `react-map-gl`
- The app has a Mapbox token helper that reads `NEXT_PUBLIC_MAPBOX_TOKEN`.
- If the Mapbox token is missing, the app shows a clear error panel instead of crashing.
- A new API endpoint exists at `GET /api/spots`.
- The API expects map bounds:
  - `west`
  - `south`
  - `east`
  - `north`
  - optional `limit`
- The API rejects invalid bounds with a `400` response.
- A Supabase migration was added for the new map data model:
  - `spots`
  - `spot_media`
  - category/status/verification enums
  - spatial index
  - public read policies
  - `spots_in_bounds` database function
- The migration also converts old Phase 1.5 `reports` rows into Phase 2 `spots`.
- Seed data was added for realistic LA spots in `webapp/supabase/seed.sql`.
- The map UI includes:
  - pitched LA camera
  - clustered pins
  - category-colored markers
  - custom `[+]` and `[-]` zoom controls
  - visible spot count/status strip
  - spot detail sheet
- PWA basics were added:
  - manifest route
  - square CleanLA SVG icon
- The implementation follows the safe parts of the 369 visual design system:
  - square panels
  - 1px gray borders
  - no shadows or gradients
  - uppercase labels
  - strict color palette

## What Has Been Verified

These checks passed locally:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `/` returned HTTP 200 from the local dev server.
- `/manifest.webmanifest` returned valid JSON.
- `/api/spots` correctly rejected bad bounds with a `400`.

## Important Current Blocker

The code is pushed, but the connected Supabase database still needs the new Phase 2 migration applied.

Until `webapp/supabase/migrations/20260525000200_phase2_spots.sql` is applied to the Supabase project, the valid `/api/spots` request will fail because the database does not yet know about `spots_in_bounds`.

In plain English: the map code exists, but the database has to catch up before real spots can load.

## What The Collaborating Dev Should Help With Next

Best next tasks:

- Apply the Phase 2 Supabase migration to the correct Supabase project.
- Run or apply `webapp/supabase/seed.sql` so the map has test spots.
- Confirm `NEXT_PUBLIC_MAPBOX_TOKEN` is set locally and in Vercel.
- Confirm the map loads with real pins after the migration is applied.
- Test the map on desktop and mobile screen sizes.
- Click clustered pins and individual pins to confirm the detail panel opens correctly.
- Confirm old prototype reports appear as map spots after migration.

## What Not To Focus On Yet

Do not spend time building these yet unless the project lead explicitly asks:

- user login
- new report submission
- camera capture
- photo uploads
- cleanup verification
- moderation queue
- public sharing pages
- analytics
- redesigning the app architecture

Those are later phases. Phase 2 is browse-only map work.

## Useful Files To Know

- `webapp/src/app/page.tsx`: home page entry point for the map.
- `webapp/src/features/map/CleanLAMap.tsx`: main map UI.
- `webapp/src/app/api/spots/route.ts`: bounded spots API.
- `webapp/src/features/spots/types.ts`: spot TypeScript types.
- `webapp/src/features/spots/display.ts`: category colors and labels.
- `webapp/supabase/migrations/20260525000200_phase2_spots.sql`: Phase 2 database migration.
- `webapp/supabase/seed.sql`: test LA spot data.
- `webapp/PHASE-2-HANDOFF.md`: implementation handoff.

## Quick Update Prompt For Claude Code

Use this prompt whenever you want Claude Code to give a quick project update:

```text
You are helping on the CleanLA repo. Please inspect the current git status and the webapp Phase 2 map MVP files, then give me a plain-English update for a non-expert collaborator.

Focus on:
- what changed since the last commit
- whether the Phase 2 map MVP still builds
- whether migrations/seed data appear applied or still pending
- whether `/api/spots` and the map shell look healthy
- what the next 1-3 practical tasks should be

Please run only safe read/check commands unless I explicitly ask you to edit files. Use concise language and explain any technical issue in plain English.
```

## One-Sentence Version

CleanLA webapp Phase 2 is now a read-only Mapbox-based LA cleanup map in code, but the Supabase database migration and seed data still need to be applied before the map can show real spots from the backend.
