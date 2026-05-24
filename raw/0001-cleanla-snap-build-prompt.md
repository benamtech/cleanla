# CleanLA Snap — One-Shot Build Prompt (Revised May 2026)

> Source: pasted into the LLM Wiki bootstrap session on 2026-05-24 as the first raw deposit.
> Original framing: a copy-paste-ready prompt for Claude Code (or Claude.ai) to scaffold an entire MVP in one response.

---

You are an expert full-stack React Native + Expo + Firebase engineer. Build a complete, production-ready MVP for **CleanLA Snap** — a nonpartisan civic transparency app for reporting and tracking street issues in Los Angeles (encampments, illegal dumping, graffiti, biohazards, overgrown lots, etc.).

The app must be brand-neutral and reference no political candidate, party, or campaign anywhere in the codebase, copy, UI, or shared content. It is a civic tool, not a campaign asset.

## Locked tech stack

- Expo SDK 52+, TypeScript, Expo Router for navigation
- NativeWind (Tailwind) for styling
- Firebase v10+ (Firestore, Storage, Auth — anonymous and email)
- **Maps: `@rnmapbox/maps`** with the official Expo config plugin. Do NOT use `react-native-maps` or `expo-maps`.
- **Camera + on-device privacy pipeline: `react-native-vision-camera`** with frame processors, plus Google ML Kit Face Detection (Android) and Apple Vision framework (iOS) for on-device face + license plate detection and blurring
- `expo-location`, `expo-sharing`, `expo-image-manipulator`

## Privacy & safety (REQUIRED — implement, do not stub)

This is the non-negotiable part of the build. The app aggregates citizen photos of public spaces; without this layer it creates real harm and legal exposure.

1. Every captured photo runs through an on-device blur pipeline BEFORE upload:
   - Detect all faces (ML Kit / Vision)
   - Detect license plates (use ML Kit object detection with a license-plate-trained model, or fall back to a custom TF Lite model bundled in the app)
   - Apply Gaussian blur to all detected bounding boxes
   - The raw, unblurred photo never leaves the device and never touches Firebase Storage
2. Submission screen UX:
   - Header copy: *"Photograph the issue, not the people. Faces and plates are auto-blurred — review before submitting."*
   - Show the blurred preview full-screen with a "Retake" and "Submit" button
   - If the user tries to submit a photo where >40% of frame area is detected as human bodies (not just faces), block submission with: *"This looks like a photo of people. Please reframe to focus on the issue."*
3. Public moderation:
   - Every public report has a "Report this post" button → writes to a `flags` subcollection
   - Cloud Function (or client-side rule) auto-hides any report with `flagCount >= 3` pending human review
   - Reports default to a 5-minute soft hold before appearing publicly (prevents real-time abuse)

## Core features

- **2-tap report flow:** open camera → capture → auto-blur → auto GPS + timestamp → optional service type dropdown + 1-line note → submit
- **Firestore schema** per report:
  ```
  {
    id, photoURL, geoPoint, timestamp, status,
    serviceType, note, userId, flagCount, isHidden,
    cleanedPhotoURL?, cleanedAt?, cleanedByUserId?
  }
  ```
  `status` ∈ `"Open" | "InProgress" | "Cleaned"`
- **Public map screen** (`@rnmapbox/maps`): clustered pins styled by status (open/in-progress/cleaned). Tap a pin → bottom sheet with full details, before/after photos, status timeline.
- **Feed screen:** chronological, pull-to-refresh, filter by status + service type
- **"I cleaned this" flow:** capture a new photo through the same blur pipeline → updates the report status to Cleaned + stores before/after
- **Share button:** generates a deep link to the specific report. Does NOT auto-tag any account or compose any text — opens the OS share sheet with just the URL. Users write their own captions.
- **"Also submit to MyLA311":** deep-links to `https://myla311.lacity.gov` with whatever query params their form accepts pre-filled (service type, lat, lng, description). If params aren't honored, open in an in-app WebView with the user's report data shown alongside so they can copy/paste.
- **Bottom tabs:** Report · Map · Feed · Me

## Visual design

- Earth/green palette: deep forest green primary, warm sand neutrals, soft terracotta for "needs attention" states
- Civic-modern aesthetic — think Citizen app meets a public-library design system
- No emoji-heavy copy, no punitive language, no shaming
- Status colors: Open = warm amber, InProgress = blue, Cleaned = green

## Deliverables (output everything in one response)

1. Exact `npx create-expo-app` command + complete `package.json` with all dependencies including `@rnmapbox/maps`, its Expo config plugin, `react-native-vision-camera`, frame processor packages, ML Kit modules
2. `app.json` / `app.config.ts` with all required plugin configs and permissions strings (camera, photo library, location — both iOS `NSCameraUsageDescription` etc. and Android equivalents)
3. `firebase/config.ts` setup + env var conventions (`EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`, `EXPO_PUBLIC_FIREBASE_*`)
4. Full Expo Router folder structure
5. Complete working code for every key file:
   - `app/(tabs)/report.tsx`, `map.tsx`, `feed.tsx`, `me.tsx`
   - `components/BlurredCameraView.tsx` (the privacy pipeline — full frame processor implementation)
   - `components/ReportCard.tsx`, `ReportBottomSheet.tsx`, `StatusBadge.tsx`
   - `hooks/useReports.ts`, `useGeoCluster.ts`
   - `firebase/config.ts`, `firebase/reports.ts`
6. Firestore security rules (anonymous read, authenticated write, flag subcollection rules, hidden-report visibility)
7. Cloud Function for flag auto-hide (or note that it's client-side enforced)
8. `README.md` with: install, env setup, Firebase project creation steps, Mapbox token creation, EAS prebuild + dev client build commands, and a "Phase 2" section noting future work on a Playwright-based MyLA311 submission agent

## Phase 2 note (do not build now, but mention in README)

The MyLA311 portal is Salesforce Service Cloud and has no public submit API. Phase 2 will introduce a server-side Playwright agent (running on the developer's own infrastructure) that submits reports on the user's behalf and returns the official Service Request number. Caveats: check ToS, expect CAPTCHA under load, queue submissions to stay polite.

Output the full codebase now. I should be able to copy-paste and have a running app in under 30 minutes after creating my Firebase + Mapbox accounts.
