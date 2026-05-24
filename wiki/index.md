---
title: Wiki Index
tags: [index, meta]
created: 2026-05-24
updated: 2026-05-24
---

The canonical map of this wiki. Every page must be linked from here under exactly one cluster. Start here when answering any question; load the candidate pages before responding.

For the operating rules, see [[../AGENT]]. For the human-facing overview, see [[../README]].

---

## Civic Tech / 311 Apps

- [[concepts/snapcrap-case-study]] — the closest direct precedent for CleanLA Snap; SF, 2018; viral then stagnated
- [[concepts/cleanlawithme-movement]] — Juan Eduardo Naula's 501(c)(3) cleanup movement in LA, ~69K Instagram followers, the natural distribution partner
- [[concepts/myla311-system]] — LA's official 311 system: channels, scale, the 2025 relaunch, open-data availability
- [[concepts/myla311-integration]] — strategic options for a third-party app integrating with MyLA311 (deep-link / agent / partnership) and their tradeoffs
- [[concepts/open311-standard]] — the API standard, the cities that adopted it, why it functionally died in the US
- [[concepts/seeclickfix-civicplus]] — the dominant B2G 311 vendor in 2026
- [[concepts/fixmystreet-uk]] — the durable nonprofit-run UK alternative; the institutional-form lesson
- [[concepts/civic-app-patterns-and-failure-modes]] — cross-cutting synthesis of what works and what kills civic apps
- [[concepts/civic-app-legal-considerations]] — doxxing, defamation, campaign-finance, UGC liability — the categories that need a real lawyer review

## Mobile / React Native

- [[concepts/rn-maps-landscape-2026]] — four-way comparison of `@rnmapbox/maps`, `expo-maps`, `react-native-maplibre`, `react-native-maps`
- [[concepts/on-device-photo-privacy]] — face + plate blur pipeline, why it must run on-device, when the pattern applies

## LLM Workflow Patterns

- [[concepts/llm-wiki-pattern]] — the Karpathy method this wiki is built on, including its scaling ceiling and when it breaks
- [[playbooks/one-shot-app-prompt]] — template for prompts that ask a single LLM session to scaffold an entire MVP

## Projects

- [[projects/cleanla-snap]] — nonpartisan civic transparency app for LA street issues; v1 architecture, distribution strategy, open questions

## Decisions

- [[decisions/2026-05-mapbox-over-google-maps]] — use `@rnmapbox/maps` for CleanLA Snap's map screen
- [[decisions/2026-05-deep-link-not-direct-submit]] — CleanLA Snap v1 deep-links to MyLA311, does not direct-submit
- [[decisions/2026-05-no-candidate-branding]] — CleanLA Snap is and remains brand-neutral; no candidate, party, or campaign reference anywhere
- [[decisions/2026-05-on-device-face-blur-required]] — on-device face + plate blur is mandatory; raw photo never leaves the device

---

## Open questions (tracked across pages)

- Does LA's ITA accept formal proposals for third-party Open311-style write access? (Action: email 311@lacity.org) — tracked in [[concepts/myla311-integration]]
- What's the actual ToS posture of MyLA311 on browser-automation submissions? (Need a lawyer read.) — tracked in [[concepts/myla311-integration]]
- Is there a CivicPlus partnership lane for a feeder app that drives volume into their 311 CRM? — tracked in [[concepts/seeclickfix-civicplus]]
- Could mySociety's FixMyStreet codebase be adapted as a backend rather than building greenfield? — tracked in [[concepts/fixmystreet-uk]]
- What is the legal status of a third party submitting MyLA311 requests on behalf of a user? — tracked in [[concepts/civic-app-legal-considerations]]
- Does Naula / Clean LA With Me want to formally own or co-brand CleanLA Snap? — tracked in [[projects/cleanla-snap]]
- Trademark check: does "CleanLA Snap" survive USPTO + App Store search, given Snap Inc.'s aggressive enforcement (per the [[concepts/snapcrap-case-study|Snapcrap precedent]])? — tracked in [[projects/cleanla-snap]]
- App Store policy on apps that publicly display photos of encampments? — tracked in [[projects/cleanla-snap]]
