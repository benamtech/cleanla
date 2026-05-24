---
title: CleanLA Snap
tags: [project, civic-tech, los-angeles, mobile]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../concepts/myla311-system.md
  - ../concepts/myla311-integration.md
  - ../concepts/on-device-photo-privacy.md
  - ../concepts/civic-app-legal-considerations.md
  - ../concepts/rn-maps-landscape-2026.md
  - ../concepts/cleanlawithme-movement.md
  - ../concepts/snapcrap-case-study.md
  - ../concepts/civic-app-patterns-and-failure-modes.md
  - ../decisions/2026-05-mapbox-over-google-maps.md
  - ../decisions/2026-05-deep-link-not-direct-submit.md
  - ../decisions/2026-05-no-candidate-branding.md
  - ../decisions/2026-05-on-device-face-blur-required.md
---

A nonpartisan civic transparency app for reporting and tracking street issues in Los Angeles — encampments, illegal dumping, graffiti, biohazards, overgrown lots. Two-tap reporting, on-device privacy redaction, public status loop, deep-link to [[../concepts/myla311-system|MyLA311]].

## Overview

**Form factor:** mobile (iOS + Android via Expo).

**Core promise:** the simplest possible loop from "I see a problem" to "the city and my neighborhood know about it." Two taps from launch to submission. Faces and plates redacted on-device before upload.

**Strategic posture:** transparency layer first, submission layer second. The app does not depend on official ingestion to work — see [[../decisions/2026-05-deep-link-not-direct-submit]] and the analysis in [[../concepts/myla311-integration]].

**Institutional intent:** designed to be owned by a 501(c)(3), most plausibly [[../concepts/cleanlawithme-movement|Clean LA With Me]] or a fiscal sponsor. Plan the institutional form on day one to avoid the [[../concepts/snapcrap-case-study|Snapcrap founder-burnout collapse]].

**Brand neutrality:** no political candidate, party, or campaign reference anywhere. Codified in [[../decisions/2026-05-no-candidate-branding]].

## Current architecture (v1)

### Tech stack (locked)

- Expo SDK 52+, TypeScript, Expo Router
- NativeWind (Tailwind) for styling
- Firebase v10+ (Firestore, Storage, Auth — anonymous + email)
- `@rnmapbox/maps` with the official Expo config plugin (rationale: [[../decisions/2026-05-mapbox-over-google-maps]])
- `react-native-vision-camera` + ML Kit (Android) / Apple Vision (iOS) for the on-device blur pipeline ([[../concepts/on-device-photo-privacy]])
- `expo-location`, `expo-sharing`, `expo-image-manipulator`

### Firestore data model

```ts
type Report = {
  id: string
  photoURL: string              // blurred only — raw never uploaded
  geoPoint: { lat: number, lng: number }
  timestamp: Timestamp
  status: 'Open' | 'InProgress' | 'Cleaned'
  serviceType: string           // from the MyLA311 96-type catalog
  note: string                  // one-line, optional
  userId: string                // anonymous Firebase Auth UID by default
  flagCount: number
  isHidden: boolean             // true when flagCount >= 3
  cleanedPhotoURL?: string
  cleanedAt?: Timestamp
  cleanedByUserId?: string
}
```

Flags live as a `flags/` subcollection on each report. A 5-minute soft hold delays public visibility after submission.

### Navigation surface

Bottom tabs: **Report · Map · Feed · Me**

- **Report (`app/(tabs)/report.tsx`):** opens camera → captures → runs on-device blur → previews blurred photo → user submits with auto GPS + timestamp + optional service type + optional one-line note
- **Map (`app/(tabs)/map.tsx`):** clustered Mapbox map. Pins styled by status (Open = warm amber, InProgress = blue, Cleaned = green). Tap a pin → bottom sheet with details, before/after photos, status timeline.
- **Feed (`app/(tabs)/feed.tsx`):** chronological list, pull-to-refresh, filter by status + service type
- **Me (`app/(tabs)/me.tsx`):** user's own reports, settings, "Delete my data" affordance

### Privacy pipeline (mandatory)

Per [[../decisions/2026-05-on-device-face-blur-required]] and [[../concepts/on-device-photo-privacy]]:

1. Capture frame via `react-native-vision-camera` frame processor
2. Detect faces (ML Kit / Vision) and license plates (ML Kit object detection or bundled TF Lite model)
3. Gaussian-blur all detected bounding boxes on-device
4. Show blurred preview full-screen with Retake/Submit buttons
5. Block submission if >40% of frame area is human body
6. Discard the unblurred frame; only the blurred result is uploaded

### Visual design

- Earth/green palette: deep forest green primary, warm sand neutrals, soft terracotta for needs-attention states
- Civic-modern aesthetic — Citizen-app crispness, public-library design system warmth
- No emoji-heavy copy, no punitive language, no shaming
- Status colors: Open = amber, InProgress = blue, Cleaned = green

## Distribution strategy

Pre-launch coordination with [[../concepts/cleanlawithme-movement]]'s ~69K Instagram audience. The [[../concepts/snapcrap-case-study]] launch playbook is the template — piggyback an existing engaged audience instead of building one from zero.

Marketing surface is carved out from any political content the developer publishes elsewhere ([[../decisions/2026-05-no-candidate-branding]]).

## Phase 2 (not in v1)

- **Server-side Playwright submission agent** for MyLA311 — closes the submission loop, fragile, ToS exposure. Requires legal review. See [[../concepts/myla311-integration]].
- **Volunteer-event coordination** — replaces Naula's ad-hoc Instagram DM coordination for Saturday meetups. Native scheduling, RSVPs, location pins.
- **Heatmaps for partner organizations** — aggregate report data for outreach groups, with explicit suppression of encampment data from public layers per [[../concepts/civic-app-legal-considerations]].
- **City partnership conversation** — pursue a formal partnership / API access lane with LA's ITA in parallel with shipping. 12–24 month timeline; do not block v1 on it.

## Open questions

- Does [[../concepts/cleanlawithme-movement|Naula / Clean LA With Me]] want to formally own or co-brand the app?
- Which MyLA311 web form query params (if any) are actually honored?
- What's the App Store policy on apps that publicly display photos of encampments? (Some moderator interpretations might consider this targeting vulnerable people.)
- Is there a fiscal sponsor available if the 501(c)(3) ownership path doesn't pan out immediately?
- Trademark check: does "CleanLA Snap" survive a search against the USPTO and the App Store? (Particularly with "Snap" in the name — see the [[../concepts/snapcrap-case-study|Snapcrap]] precedent on Snap Inc.'s aggressive enforcement posture.)

## Related concepts

- [[../concepts/myla311-system]] — the official system the app deep-links into
- [[../concepts/myla311-integration]] — strategic options and tradeoffs
- [[../concepts/on-device-photo-privacy]] — the redaction pipeline
- [[../concepts/civic-app-legal-considerations]] — doxxing, defamation, campaign-finance, UGC liability
- [[../concepts/rn-maps-landscape-2026]] — why Mapbox
- [[../concepts/cleanlawithme-movement]] — the natural distribution partner
- [[../concepts/snapcrap-case-study]] — the direct precedent
- [[../concepts/civic-app-patterns-and-failure-modes]] — what worked and what killed similar apps
- [[../concepts/open311-standard]] — why we can't just hit an API
- [[../concepts/seeclickfix-civicplus]] — possible long-term acquirer/partner outside LA
- [[../concepts/fixmystreet-uk]] — the durable nonprofit-owned reference model

## Related decisions

- [[../decisions/2026-05-mapbox-over-google-maps]]
- [[../decisions/2026-05-deep-link-not-direct-submit]]
- [[../decisions/2026-05-no-candidate-branding]]
- [[../decisions/2026-05-on-device-face-blur-required]]

## Backlinks

- [[../concepts/myla311-system]]
- [[../concepts/myla311-integration]]
- [[../concepts/on-device-photo-privacy]]
- [[../concepts/civic-app-legal-considerations]]
- [[../concepts/rn-maps-landscape-2026]]
- [[../concepts/cleanlawithme-movement]]
- [[../concepts/snapcrap-case-study]]
- [[../concepts/civic-app-patterns-and-failure-modes]]
- [[../concepts/fixmystreet-uk]]
- [[../decisions/2026-05-mapbox-over-google-maps]]
- [[../decisions/2026-05-deep-link-not-direct-submit]]
- [[../decisions/2026-05-no-candidate-branding]]
- [[../decisions/2026-05-on-device-face-blur-required]]
- [[../playbooks/one-shot-app-prompt]]
