# CleanLA Webapp Status - May 27, 2026, 8:19 AM

This note updates `memory/LATEST_ALIGNMENT.md` and the prior hand-written status note `memory/webapp-status-5-25-2026-11-31am.md`.

## Plain-English Summary

CleanLA is now a working web app centered on the live Mapbox map. The app still has the Phase 1-6 foundation described in the last memory notes: Supabase-backed public spots, reporting, cleanup, AI moderation, profiles/usernames, public share pages, and OG/X sharing.

Since the latest alignment note, the biggest change is that the map experience has been pushed much closer to the intended visual direction. The default map is now satellite imagery instead of Mapbox Standard, and it opens very close to the ground at zoom 16. The map therefore feels more like exploring Los Angeles from above instead of looking at a flat civic dashboard.

The map UI also received a lot of 369-style cleanup. The app has a WebGL fallback message, a more visible FILE A REPORT bottom bar, a simplified top control panel, map legend, sign-in/profile/username controls, zoom buttons, and a centered spot detail modal. The spot detail modal now shows the report photo when available, but the photo no longer takes over the whole modal; the description and detail table are visible again underneath.

The current branch is `main`, pushed to `origin/main` at commit `c36bf7f`. `git status` is clean except for a local Git warning about `C:\Users\wigge/.config/git/ignore` permissions. Recent `npm run typecheck` and `npm run lint` both passed after the latest map/detail changes.

The next planned feature has not been implemented yet: game-like map movement with `W/A/S/D`, pitch controls with a modifier such as `Ctrl + W/A/S/D`, and equivalent on-screen controls/joystick UI for desktop and mobile.

## What Changed Since `LATEST_ALIGNMENT.md`

- The alignment note said the repo was at `ac90887`. Current `main` is `c36bf7f`.
- Map default view changed in `webapp/src/features/map/CleanLAMap.tsx`:
  - `LOS_ANGELES_VIEW.zoom` is now `16`.
  - `mapStyle` is now `mapbox://styles/mapbox/satellite-v9`.
  - Existing max zoom is still `17`.
- Spot detail modal was adjusted:
  - Report photo/no-photo area changed from `aspect-[3/4]` to fixed responsive heights: `h-[180px] sm:h-[240px]`.
  - This restores immediate visibility of description, location, verification, severity, photo status, reporter, and cleaner rows.
  - Clean/after-photo section still uses its existing portrait image layout when present.
- Map UI work that happened after the alignment snapshot includes:
  - WebGL-unavailable fallback panel.
  - More visible report CTA treatment.
  - Mobile report CTA visibility fixes.
  - Mobile map exploration UI improvements.
  - Spot detail modal design iterations using the 369 design system.
  - Map legend and readable category/status controls.
- Deployment config work landed:
  - Vercel framework declaration.
  - Vercel ignore rules.
  - Vercel Web Analytics install/config from PR branch.
- Documentation/wiki/memory drift improved but still needs discipline:
  - `memory/LATEST_ALIGNMENT.md` was refreshed by Claude but is now behind current `main`.
  - Wiki decisions were expanded for magic-link auth, X-only sharing, and AI moderation/on-device blur tradeoffs.
  - Phase 5.5/6.5 planning docs exist for on-device blur and license plate blur, but those are not current active implementation work.

## Current Codegraph For Map Work

- `webapp/src/features/map/CleanLAMap.tsx`
  - Main map screen and most current UI state.
  - Imports `Map`, `Layer`, `Source`, and map event types from `react-map-gl/mapbox`.
  - `LOS_ANGELES_VIEW` defines initial center, zoom, pitch, and bearing.
  - `DEFAULT_BOUNDS` is used before real map bounds are available.
  - `clusterLayer`, `clusterCountLayer`, and `spotLayer` define map visuals for clusters and spot pins.
  - `SpotDetailSheet` is inside this file; it owns the centered modal for selected spots.
  - `MapLegend`, `SignInPrompt`, status/error panels, map buttons, and the FILE A REPORT CTA are also in this component file.
  - `selectedSpot` controls whether `SpotDetailSheet` is open.
  - `showReport` controls `ReportSheet`.
  - `showCleanup` controls `CleanupSheet`.
  - `mapRef` is the important hook for future map movement controls; it already calls methods like `zoomIn`, `zoomOut`, `flyTo`, and `easeTo`.
- `webapp/src/features/reports/ReportSheet.tsx`
  - Current report flow is a 3-tap camera/GPS flow.
  - Accepts `fallbackLocation` from the map center when browser geolocation is unavailable.
  - Calls back to `CleanLAMap` with `{ spotId, lat, lng }` after submit so the map can fly to the new pin.
- `webapp/src/features/spots/CleanupSheet.tsx`
  - Mark-cleaned flow for selected spots.
  - Opened only when there is a selected spot and a signed-in user.
- `webapp/src/features/spots/types.ts`
  - `SpotSummary` is the shape used by the map and detail modal.
  - Includes category, status, description, neighborhood, severity, lat/lng, verification status, report/after media URLs, and public usernames.
- `webapp/src/features/spots/display.ts`
  - Shared formatting helpers for category/status/verification labels.

## Current Map UI Behavior

- Map starts over Los Angeles at longitude `-118.2437`, latitude `34.0522`, zoom `16`, pitch `60`, bearing `-18`.
- Map style is satellite imagery: `mapbox://styles/mapbox/satellite-v9`.
- User interactions already enabled through Mapbox/react-map-gl:
  - drag pan
  - drag rotate
  - pitch with rotate
  - touch pitch
  - touch zoom/rotate
  - scroll zoom
  - double click zoom
  - keyboard
- Visible controls:
  - Top-left panel with app name, status count, basic instructions, legend toggle, sign-in/profile controls, and about button.
  - Top/right zoom buttons.
  - Bottom full-width `[+] FILE A REPORT` CTA.
  - Empty viewport encouragement when a fetch succeeds with zero spots.
  - Centered `SpotDetailSheet` when a pin is selected.
- Known limitation before the next feature:
  - There is not yet any custom `W/A/S/D` movement, `Ctrl + W/A/S/D` pitching, desktop D-pad, or mobile joystick.

## Current Spot Detail Modal Behavior

- Opens from a selected map pin.
- Header: `SPOT DETAIL` with close button.
- Status strip shows category and status.
- Report photo area:
  - Shows `spot.report_media_url` when present.
  - Shows `NO REPORT PHOTO` for demo/seed spots without photos.
  - Height is capped at `180px` on small screens and `240px` on `sm` and up.
- Body shows:
  - description
  - clean/after-photo section only when relevant
  - location or coordinates
  - verification status
  - severity
  - report photo presence
  - clean photo presence
  - reported by username or anonymous
  - cleaned by username or anonymous when relevant
- Footer shows `[MARK CLEANED]` only for signed-in users when the spot is not already cleaned or hidden.

## Verification Status

Recently passed:

- `npm run typecheck`
- `npm run lint`
- `git push origin main`

Current git state:

- Branch: `main`
- Remote: `origin/main`
- Latest commit: `c36bf7f Adjust spot detail photo height`
- Working tree: clean
- Local warning: Git cannot access `C:\Users\wigge/.config/git/ignore`; this has not blocked commits or pushes.

Visual verification caveat:

- The in-app browser blocked local preview access to `localhost:3000` / `127.0.0.1:3000` during the latest modal fix, so the final modal tweak was verified by code inspection plus typecheck/lint rather than by a browser screenshot.

## Next Feature To Build

Requested next feature:

- Desktop keyboard movement:
  - `W/A/S/D` moves around the map like a game.
  - A modifier combo, probably `Ctrl + W/A/S/D`, pitches the map in four directions.
- Desktop on-screen control:
  - D-pad-style four arrows around a central joystick.
  - The four arrows should be labeled `W`, `A`, `S`, `D` to teach the keyboard controls.
  - The central joystick should perform the pitch equivalent.
- Mobile equivalent:
  - Users can already move the map with fingers, so the mobile control should not fight native touch gestures.
  - Add a best-practices joystick-like affordance, less restrictive than arrows, that signals the map is meant to be explored.

Implementation hint for the next agent:

- Start in `CleanLAMap.tsx`.
- Reuse `mapRef.current` camera methods instead of adding a new map state system unless necessary.
- Keep controls above the map as lightweight overlays, not cards inside cards.
- Preserve existing Mapbox gestures.
- Be careful with keyboard events so typing in email/profile/report fields does not move the map.

## One-Sentence Version

CleanLA is pushed and clean on `main`; since the last alignment note the map became a close-zoom satellite-first experience, the map UI/CTA/detail modal were tightened, the spot details are visible again under photos, and the next unbuilt feature is game-like map navigation with keyboard, desktop D-pad/joystick, and a mobile joystick-style exploration affordance.
