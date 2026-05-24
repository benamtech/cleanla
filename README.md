# CleanLA

A nonpartisan civic transparency app for reporting and tracking street issues in Los Angeles — encampments, illegal dumping, graffiti, biohazards, overgrown lots.

Two taps from launch to submission. Faces and license plates redacted on-device before upload. Deep-links into MyLA311 so the city sees every report.

> **Status:** research and planning phase. The MVP build prompt (`raw/0001-cleanla-snap-build-prompt.md`) is ready to scaffold the app. Architecture, key decisions, and supporting research live in `wiki/`. App code lands in a follow-on directory once building begins.

## What this project is

**CleanLA Snap** is the mobile app — the first artifact of a broader CleanLA project intended to be owned by a 501(c)(3) (most plausibly [Clean LA With Me](https://www.instagram.com/cleanlawithme/)) rather than any individual or campaign. The codebase, copy, UI, and shared content are strictly brand-neutral; no political candidate, party, or campaign is referenced anywhere.

The core thesis: LA already has a 311 system, an engaged grassroots cleanup movement, and a citizenry holding phones. What's missing is a privacy-respecting, public-by-default transparency layer that closes the loop between *I see a problem* → *the city knows* → *the neighborhood can see whether anything happened*.

Full project page: [`wiki/projects/cleanla-snap.md`](wiki/projects/cleanla-snap.md).

## The repo today

This repository is currently a **Karpathy-style LLM wiki** — a plain-markdown knowledge base, compiled by an LLM agent from raw source material, used to drive design decisions for the app.

```
.
├── AGENT.md              # Operating manual for the LLM agent — read this if you're Claude
├── CLAUDE.md             # Auto-loaded session pointer for Claude Code
├── raw/                  # Source material (articles, transcripts, build prompts, research)
└── wiki/
    ├── index.md          # The map. Start here.
    ├── concepts/         # Atomic ideas (civic-tech precedents, tech-stack analysis, legal terrain)
    ├── projects/         # Project-scoped aggregates — currently just CleanLA Snap
    ├── decisions/        # Dated, immutable decision logs
    └── playbooks/        # Reusable how-tos and prompt patterns
```

App scaffolding (`app/`, `firebase/`, etc.) will live alongside the wiki once we run the MVP prompt.

## Locked architecture

- **Mobile:** Expo SDK 52+, TypeScript, Expo Router, NativeWind
- **Backend:** Firebase v10+ (Firestore, Storage, Anonymous + Email Auth)
- **Maps:** `@rnmapbox/maps` with the official Expo config plugin — [decision](wiki/decisions/2026-05-mapbox-over-google-maps.md)
- **Camera + on-device privacy:** `react-native-vision-camera` + ML Kit (Android) / Apple Vision (iOS) for face + license-plate detection and blurring
- **MyLA311:** deep-link only in v1; server-side Playwright submission agent is Phase 2 — [decision](wiki/decisions/2026-05-deep-link-not-direct-submit.md)

## Non-negotiable: on-device privacy

The app aggregates citizen photos of public spaces. Without rigorous on-device redaction it creates real harm and legal exposure. The mandatory pipeline — [decision](wiki/decisions/2026-05-on-device-face-blur-required.md):

1. Capture frame via vision-camera frame processor
2. Detect every face and license plate on-device
3. Gaussian-blur all detected regions before any preview or upload
4. Discard the raw frame; only the blurred photo touches Firebase
5. Block submission if >40% of the frame is human body

The raw, unblurred photo never leaves the device.

## Key decisions

- [`2026-05-no-candidate-branding`](wiki/decisions/2026-05-no-candidate-branding.md) — the app is and remains nonpartisan and brand-neutral
- [`2026-05-on-device-face-blur-required`](wiki/decisions/2026-05-on-device-face-blur-required.md) — on-device face + plate blur is mandatory
- [`2026-05-deep-link-not-direct-submit`](wiki/decisions/2026-05-deep-link-not-direct-submit.md) — v1 deep-links to MyLA311, does not direct-submit
- [`2026-05-mapbox-over-google-maps`](wiki/decisions/2026-05-mapbox-over-google-maps.md) — use `@rnmapbox/maps` for the map surface

Decisions are immutable. New circumstances mean a new dated decision that supersedes the old one.

## Roadmap

**v1 (build now)**
- 2-tap report flow, public clustered map, feed, "I cleaned this" before/after loop
- On-device privacy pipeline (faces + plates)
- Deep-link to MyLA311 with prefilled fields
- Anonymous auth, 5-minute soft hold, flag/moderation system

**Phase 2**
- Server-side Playwright submission agent for MyLA311 (closes the loop, requires legal review)
- Volunteer-event coordination (replaces ad-hoc Instagram DM scheduling)
- Heatmaps for partner orgs, with explicit suppression of encampment data from public layers per the [legal considerations](wiki/concepts/civic-app-legal-considerations.md)
- City partnership / formal API access conversation with LA's ITA

## Open questions

- Does Clean LA With Me want to formally own or co-brand the app?
- Which MyLA311 web-form query params are actually honored?
- App Store policy on apps that publicly display photos of encampments?
- Trademark check on "CleanLA Snap" given Snap Inc.'s enforcement posture (see the [Snapcrap precedent](wiki/concepts/snapcrap-case-study.md))
- Fiscal-sponsor fallback if direct 501(c)(3) ownership is delayed

Live list tracked in [`wiki/index.md`](wiki/index.md).

## Working in this repo

**If you are a human contributor:** read this README, then `wiki/index.md`. Most working knowledge lives in `wiki/concepts/`.

**If you are an LLM agent (Claude Code or similar):** read [`AGENT.md`](AGENT.md) before doing anything. It defines the ingestion, synthesis, and refinement rules for the wiki itself.

Common operations:

```bash
# Add a new source document
cp ~/path/to/source.md raw/0005-short-slug.md
# Then open Claude Code in this directory and say: "ingest"

# Ask a question
# Open Claude Code in this directory and just ask. The agent will load
# the relevant wiki pages and answer from them.

# Tidy the wiki (consolidate dupes, fix backlinks, split overgrown pages)
# Open Claude Code in this directory and say: "tidy"
```

## License

TBD — pending the institutional ownership decision. Treat this repository as source-available pre-1.0; contributions welcome by invitation.
