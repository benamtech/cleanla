---
title: Use Mapbox (@rnmapbox/maps) over Google/Apple Maps for CleanLA Snap
tags: [decision, mobile, mapping]
created: 2026-05-24
updated: 2026-05-24
status: active
related:
  - ../concepts/rn-maps-landscape-2026.md
  - ../projects/cleanla-snap.md
---

## Context

[[../projects/cleanla-snap]] needs a mapping library for its primary map screen. Four options were evaluated: `@rnmapbox/maps`, `expo-maps`, `react-native-maplibre`, and `react-native-maps`. Full comparison in [[../concepts/rn-maps-landscape-2026]].

The map screen is a primary surface: clustered pins styled by report status (Open / InProgress / Cleaned), tap-to-open bottom sheets, and a strong civic-modern visual identity (earth/green palette).

## Decision

Use **`@rnmapbox/maps`** with the official Expo config plugin. Require an EAS dev client build (no Expo Go).

## Rationale

1. **Cross-platform visual parity.** Mapbox renders the same map style on iOS and Android. `expo-maps` and `react-native-maps` use Apple Maps on iOS and Google Maps on Android, producing visibly different tile sets — incompatible with a unified civic-modern brand.
2. **Custom styling via Mapbox Studio.** Trivially produce the earth/green palette specified in the design brief. Style updates ship without app updates.
3. **First-class clustering.** Built-in symbol clustering with GPU acceleration. The map will accumulate thousands of pins; manual clustering implementations don't scale.
4. **Official Expo config plugin.** Maintained directly by Mapbox.
5. **Native modules already required.** [[../concepts/on-device-photo-privacy]] forces an EAS dev client anyway, so Mapbox's native-module requirement is not an incremental cost.

## Alternatives considered

- **`expo-maps`** — rejected for poor cross-platform parity and minimal styling. The "free" advantage is moot when brand consistency matters.
- **`react-native-maplibre`** — viable second choice. Same MapLibre Style Spec as `@rnmapbox/maps` (short migration path if vendor pricing or independence becomes a problem). Rejected for v1 due to weaker docs, fragmented community, and the operational cost of self-hosting tiles or picking a third-party tile provider. Re-evaluate if Mapbox tile costs exceed expected levels.
- **`react-native-maps`** — the legacy default. Rejected for the same cross-platform parity issue as `expo-maps`, plus slowing maintenance through 2024-2025.

## Consequences

- **Operational:** A Mapbox account and access token (`EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`) become a hard launch dependency. Token rotation and quota monitoring become an operations task.
- **Cost:** Mapbox tile pricing applies. Free tier is generous; monitor monthly active users (MAU) against the free tier threshold.
- **Migration path:** If vendor pricing later becomes a problem, `react-native-maplibre` is the shortest hop (same Style Spec). Migrating to Google/Apple later would require a near-total rewrite of the map layer.
- **Locked out of Expo Go.** Developers must use the EAS dev client. This is already required by [[../concepts/on-device-photo-privacy]], so the marginal pain is zero.

## Re-evaluation trigger

Revisit this decision if any of the following occur:
- Mapbox MAU cost exceeds $X/month (set threshold when launching)
- Mapbox materially changes pricing terms
- A blocking bug appears in `@rnmapbox/maps`' Expo plugin that the maintainers don't fix within 30 days

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/rn-maps-landscape-2026]]
