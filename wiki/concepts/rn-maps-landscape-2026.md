---
title: React Native Maps Landscape (2026)
tags: [mobile, react-native, mapping, vendor-comparison]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../projects/cleanla-snap.md
  - ../decisions/2026-05-mapbox-over-google-maps.md
---

A four-way comparison of mapping libraries available to React Native + Expo projects as of May 2026, written to support the [[../decisions/2026-05-mapbox-over-google-maps]] decision for [[../projects/cleanla-snap]].

## The four contenders

### `@rnmapbox/maps`
- **Tile provider:** Mapbox
- **Native modules:** uses Mapbox iOS/Android SDKs under the hood
- **Expo support:** official config plugin
- **Clustering:** built-in symbol clustering, GPU-accelerated
- **Styling:** Mapbox Studio — drop-dead easy custom map styles (earth/green palettes, civic-modern aesthetics)
- **Cost:** Mapbox tile pricing — generous free tier, predictable above it
- **Caveats:** API token required. Bundle size larger than `expo-maps`. Requires EAS dev client (not Expo Go).

### `expo-maps`
- **Tile provider:** Apple Maps on iOS, Google Maps on Android
- **Expo support:** native first-party Expo SDK package
- **Clustering:** not built-in; must implement manually
- **Styling:** minimal — system map appearance, limited customization
- **Cost:** free (uses OS-provided maps)
- **Caveats:** Cross-platform parity is poor by design (different tile sources). Visual identity will differ between iOS and Android, which fights against a civic-modern brand.

### `react-native-maplibre` (formerly `react-native-mapbox-gl`)
- **Tile provider:** any MapLibre-compatible vector tile source (self-hosted, MapTiler, Stadia Maps, AWS Location)
- **Expo support:** community config plugin
- **Clustering:** supported via MapLibre style expressions
- **Styling:** full MapLibre Style Spec — fully customizable
- **Cost:** depends on tile source. Self-hosting is free-ish but operationally non-trivial.
- **Caveats:** MapLibre community has fragmented since the original Mapbox v1 fork. Documentation quality lags `@rnmapbox/maps`. The right pick if vendor independence is a hard requirement.

### `react-native-maps` (the legacy default)
- **Tile provider:** Apple Maps on iOS, Google Maps on Android
- **Expo support:** works with config plugin, has been in the ecosystem for years
- **Clustering:** community add-ons (`react-native-map-clustering`)
- **Styling:** Google Maps style JSON (Android side); essentially no styling on iOS
- **Cost:** free OS maps + Google Maps API costs if you use Google features
- **Caveats:** Same cross-platform parity issue as `expo-maps`. Maintenance has slowed in 2024-2025. Was the obvious default in 2022; in 2026, mostly chosen out of inertia.

## Recommendation for civic apps

`@rnmapbox/maps` wins on three axes that matter for [[../projects/cleanla-snap]]:

1. **Cross-platform visual parity** — Mapbox renders the same map style on iOS and Android. Critical for civic-modern brand consistency.
2. **Custom styling** — Mapbox Studio makes the earth/green palette trivial. The other options either don't style at all (`expo-maps`) or require manual style spec authoring (`react-native-maplibre`).
3. **Built-in clustering** — public reports will pile up on the map quickly; first-class clustering is a major perf win.

The cost (token management, EAS dev client requirement) is acceptable for a project that already requires native modules for [[on-device-photo-privacy]].

`react-native-maplibre` is the second choice if Mapbox's pricing or vendor dependence becomes a problem later. The migration path between them is shorter than from `@rnmapbox/maps` to either Google/Apple option, because both use the same Style Spec.

Decision recorded in [[../decisions/2026-05-mapbox-over-google-maps]].

## Backlinks

- [[../projects/cleanla-snap]]
- [[../decisions/2026-05-mapbox-over-google-maps]]
