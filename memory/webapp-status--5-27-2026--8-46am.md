# CleanLA Webapp Status - May 27, 2026, 8:46 AM

This note updates `memory/webapp-status-5-27-2026--8-19am.md`.

## Plain-English Summary

The game-like map exploration feature is now implemented. The previous memory note said this was the next unbuilt feature; it is no longer just planned.

CleanLA's satellite map can now be moved with `W/A/S/D` like a lightweight game camera. Movement is screen-relative, so `W` moves toward the top of the visible screen, `A` left, `S` down, and `D` right even when the map is rotated. Holding `Shift` changes the meaning of those same keys: `Shift + W/S` adjusts pitch, and `Shift + A/D` rotates the map bearing.

There are also visible controls. Desktop now has a small 369-style D-pad above the bottom report bar, with `W/A/S/D` labels around a center joystick. The buttons mirror the keyboard movement. The center joystick mirrors the pitch/rotate behavior. Mobile gets a smaller unlabeled joystick affordance above the report bar; it is intentionally not labeled because mobile users are not learning keyboard shortcuts there. Native touch map gestures remain primary.

The implementation is fully local to `webapp/src/features/map/CleanLAMap.tsx`. No database, API, Supabase, schema, or route changes were made.

`npm run typecheck` and `npm run lint` both passed after the feature was implemented.

## What Changed Since 8:19 AM

- Added game-camera constants and types:
  - `MapDirection`
  - desktop pan step: `120px`
  - mobile pan step: `72px`
  - pitch step: `6`
  - bearing step: `12`
  - camera animation duration: `120ms`
  - pitch clamp: `0` to `75`
- Added keyboard safety helpers:
  - Movement is ignored when focus is inside `input`, `textarea`, `select`, `button`, links, or content-editable elements.
  - Movement is ignored while overlays are open: report sheet, cleanup sheet, sign-in prompt, about modal, or spot detail modal.
  - Existing Escape overlay behavior remains separate and intact.
- Added map camera helpers:
  - `panMap(direction)` uses Mapbox `project()` and `unproject()` so movement is screen-relative.
  - `adjustCamera(direction)` uses `easeTo()` to change pitch or bearing.
- Added visible control components inside `CleanLAMap.tsx`:
  - `CameraJoystick`
  - `MapGameControls`
- Added desktop UI:
  - D-pad in the lower-right area above `[+] FILE A REPORT`.
  - `W/A/S/D` buttons pan the map.
  - Center joystick is labeled `SHIFT` and controls pitch/rotation by dragging.
- Added mobile UI:
  - Small joystick-only affordance above the report CTA.
  - No text label on mobile.
  - Dragging vertically adjusts pitch; dragging horizontally rotates bearing.

## Codegraph Notes

- `CleanLAMap.tsx` is still the whole feature surface.
- `mapRef` is the important integration point:
  - `mapRef.current?.getMap()` gives access to lower-level Mapbox `project()` / `unproject()`.
  - `mapRef.current?.easeTo()` animates pan, pitch, and bearing.
- `panMap(direction)`:
  - Reads current map center.
  - Projects center to screen point.
  - Offsets the screen point by the configured pan step.
  - Unprojects back to lng/lat.
  - Calls `easeTo({ center, duration })`.
- `adjustCamera(direction)`:
  - Reads current pitch and bearing.
  - `up` increases pitch.
  - `down` decreases pitch.
  - `left` decreases bearing.
  - `right` increases bearing.
  - Calls `easeTo({ pitch, bearing, duration })`.
- `CameraJoystick`:
  - Uses pointer events and `setPointerCapture`.
  - Tracks drag origin and visual knob offset.
  - Converts dominant drag axis into a `MapDirection`.
  - Throttles repeated adjustments to about one action every `90ms`.
  - Accepts optional `caption`; desktop uses `SHIFT`, mobile passes `null`.
- `MapGameControls`:
  - Renders the desktop D-pad on `md` and up.
  - Renders the compact mobile joystick below `md`.

## Current Interaction Contract

- Keyboard:
  - `W` = pan up
  - `A` = pan left
  - `S` = pan down
  - `D` = pan right
  - `Shift + W` = pitch up
  - `Shift + S` = pitch down
  - `Shift + A` = rotate left
  - `Shift + D` = rotate right
- Desktop controls:
  - `W/A/S/D` buttons match keyboard panning.
  - Center joystick matches Shift camera controls.
- Mobile controls:
  - Joystick is an affordance and light camera control.
  - Existing Mapbox drag/pinch/rotate/touch pitch gestures are not disabled.

## Verification Status

Passed after implementation:

- `npm run typecheck`
- `npm run lint`

Still worth checking manually in the browser:

- `W/A/S/D` movement feels good at satellite zoom 16.
- `Shift + W/A/S/D` does not interfere with normal browser behavior.
- The D-pad does not crowd the zoom buttons, header, legend, or report CTA.
- Mobile joystick does not block the report CTA or normal finger map gestures.

## One-Sentence Version

CleanLA now has game-like satellite map exploration: screen-relative `W/A/S/D` movement, `Shift + W/A/S/D` pitch/rotation, a desktop D-pad with center joystick, and an unlabeled mobile joystick affordance, all implemented locally in `CleanLAMap.tsx` with typecheck and lint passing.
