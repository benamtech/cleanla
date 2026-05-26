---
title: Wiki Index
tags: [index, meta]
created: 2026-05-24
updated: 2026-05-25
---

The canonical map of this wiki. Every page must be linked from here under exactly one cluster. Start here when answering any question; load the candidate pages before responding.

For the operating rules, see [[../AGENT]]. For the human-facing overview, see [[../README]].

---

## Civic Tech / 311 Apps (US precedents)

- [[concepts/snapcrap-case-study]] — the closest direct precedent for CleanLA Snap; SF, 2018; viral then stagnated
- [[concepts/cleanlawithme-movement]] — Juan Eduardo Naula's cleanup movement in LA; org snapshot
- [[concepts/clwm-partnership-prep]] — **Phase 1.5 tactical prep** for the partnership conversation with Naula; latest CLWM state, ask/offer/avoid, the critical "ownership vs use" question
- [[concepts/myla311-system]] — LA's official 311 system: channels, scale, the 2025 relaunch, open-data availability
- [[concepts/myla311-integration]] — strategic options for a third-party app integrating with MyLA311 (deep-link / agent / partnership) and their tradeoffs
- [[concepts/open311-standard]] — the API standard, the cities that adopted it, why it functionally died in the US
- [[concepts/seeclickfix-civicplus]] — the dominant B2G 311 vendor in 2026
- [[concepts/fixmystreet-uk]] — the durable nonprofit-run UK alternative; the institutional-form lesson
- [[concepts/civic-app-patterns-and-failure-modes]] — cross-cutting synthesis of what works and what kills civic apps (US-focused)
- [[concepts/civic-app-legal-considerations]] — doxxing, defamation, campaign-finance, UGC liability — the categories that need a real lawyer review
- [[concepts/civic-app-retention-benchmarks]] — what "good" looks like for MAU, DAU/MAU, 30-day retention in this app category
- [[concepts/la-civic-tech-competitive-landscape]] — who else is in the LA street-issue civic-tech space in 2026; MyLA311 + SeeClickFix dominate; less crowded than feared
- [[concepts/la-city-partnership-mechanics]] — the path to formal LA city partnerships for civic tech; post-Innovation-Commission landscape; three channels (ITA / Mayor's office / RAMPLA)
- [[concepts/civic-tech-founder-org-handoff-patterns]] — cross-case patterns from civic-tech founders handing off / co-building with community orgs; the "listening first" rule and the failure modes (Snapcrap, Tauberer)
- [[concepts/cleanla-clean-streets-mayor-scenario]] — **scenario** for a future Pratt-style "Clean The Streets" mayor; CTS-plank → CleanLA-feature map; 100-day activation sequence; cross-admin durability

## Civic Tech / 311 Apps (international precedents)

- [[concepts/oneservice-singapore]] — government-run, multimodal AI routing, 85% correct first-assignment rate
- [[concepts/swachhata-india]] — largest-scale civic app globally; mandatory SLAs; resolution-photo feedback loop
- [[concepts/colab-brazil]] — commercial freemium B2G; two-sided "report + propose solution" model
- [[concepts/snap-send-solve-australia]] — commercial; multi-stakeholder routing across councils + utilities + telcos
- [[concepts/seoul-smart-city]] — aspirational integrated-response architecture (app → monitoring → dispatch → user)
- [[concepts/international-civic-app-patterns]] — synthesis: five patterns worth borrowing, three that won't translate

## Mobile / React Native

- [[concepts/rn-maps-landscape-2026]] — four-way comparison of `@rnmapbox/maps`, `expo-maps`, `react-native-maplibre`, `react-native-maps`
- [[concepts/on-device-photo-privacy]] — face + plate blur pipeline, why it must run on-device, when the pattern applies

## Institutional / Funding

- [[concepts/la-civic-tech-funding-landscape]] — which foundations actually write checks for LA civic tech; fiscal-sponsorship paths; realistic Year-1 pipeline
- [[concepts/california-nonprofit-legal-mechanics]] — CA 501(c)(3) incorporation vs fiscal sponsorship; the 27-month rule; founder IP transfer; Year-1 admin budget; pre-attorney-conversation prep

## LLM Workflow Patterns

- [[concepts/llm-wiki-pattern]] — the Karpathy method this wiki is built on, including its scaling ceiling and when it breaks
- [[playbooks/one-shot-app-prompt]] — template for prompts that ask a single LLM session to scaffold an entire MVP

## Projects

- [[projects/cleanla-snap]] — nonpartisan civic transparency app for LA street issues; v1 architecture, distribution strategy, open questions

## Decisions

- [[decisions/2026-05-web-stack-over-mobile]] — **current stack**; Next.js + Supabase + PostGIS web; Expo + Firebase mobile retired for v1
- [[decisions/2026-05-on-device-blur-restored]] — **CURRENT (2026-05-25 PM)** — MediaPipe Tasks Web restores on-device blur as floor; Phase 5 moderation kept as defense in depth; engineering ~4 days for Tier 1 (face)
- [[decisions/2026-05-ai-moderation-over-on-device-blur]] — **superseded same day** — brief moderation-only architecture; preserved as historical record
- [[decisions/2026-05-magic-link-auth]] — Phase 3 picked Supabase magic-link (no OAuth, no passwords) for v1
- [[decisions/2026-05-x-only-sharing]] — Phase 6 ships X-only intent-link sharing + Web Share API + COPY LINK
- [[decisions/2026-05-mapbox-over-google-maps]] — Mapbox vendor choice survives the web pivot; library now `mapbox-gl` (was `@rnmapbox/maps`)
- [[decisions/2026-05-deep-link-not-direct-submit]] — CleanLA v1 deep-links to MyLA311, does not direct-submit (stack-agnostic, still active)
- [[decisions/2026-05-no-candidate-branding]] — CleanLA is and remains brand-neutral; no candidate, party, or campaign reference anywhere
- [[decisions/2026-05-on-device-face-blur-required]] — **superseded** by `ai-moderation-over-on-device-blur` (2026-05-25); principle preserved via moderation, implementation reversed

---

## Open questions (tracked across pages)

- **[Phase 1.5 gating]** Does Clean LA With Me want to formally adopt or co-brand the app? (Target: 30-60 min call by 2026-06-07) — tracked in [[projects/cleanla-snap]] and [[concepts/clwm-partnership-prep]]
- **[Phase 1.5 gating]** Legal options for nonprofit ownership / fiscal sponsorship in CA civic tech in 2026? (Needs attorney review) — tracked in [[concepts/california-nonprofit-legal-mechanics]]
- **[Phase 1.5]** Is Clean LA With Me actually incorporated as a 501(c)(3)? Confirm via IRS EIN lookup before the call — tracked in [[concepts/clwm-partnership-prep]]
- What's the actual ToS posture of MyLA311 on browser-automation submissions? (Need a lawyer read.) — tracked in [[concepts/myla311-integration]]
- Is there a CivicPlus partnership lane for a feeder app that drives volume into their 311 CRM? — tracked in [[concepts/seeclickfix-civicplus]]
- Could mySociety's FixMyStreet codebase be adapted as a backend rather than building greenfield? — tracked in [[concepts/fixmystreet-uk]]
- What is the legal status of a third party submitting MyLA311 requests on behalf of a user? — tracked in [[concepts/civic-app-legal-considerations]]
- Does Naula / Clean LA With Me want to formally own or co-brand CleanLA Snap? — tracked in [[projects/cleanla-snap]] and [[concepts/la-civic-tech-funding-landscape]]
- Trademark check: does "CleanLA Snap" survive USPTO + App Store search, given Snap Inc.'s aggressive enforcement (per the [[concepts/snapcrap-case-study|Snapcrap precedent]])? — tracked in [[projects/cleanla-snap]]
- App Store policy on apps that publicly display photos of encampments? — tracked in [[projects/cleanla-snap]]
- MyLA311 actual annual request volume: Ted Ross says ~2.5M, xtown.la says ~1.4M for 2024. Scope difference? — tracked in [[concepts/myla311-system]] and [[concepts/civic-app-retention-benchmarks]]

## Recently resolved (or substantially reduced)

- ~~Is grant runway realistic as the institutional sustainability path?~~ → Yes, $30K-$150K Year-1 pipeline via LA2050 + Annenberg is realistic; fiscal-sponsorship path via Community Partners LA unlocks grant eligibility in 4-8 weeks. See [[concepts/la-civic-tech-funding-landscape]]
- ~~What does "good" retention look like for a civic app?~~ → See [[concepts/civic-app-retention-benchmarks]]: 2-5% MAU/serviceable-pop, 1-3% D30, plan around 60-80% one-time-reporter distribution
- ~~Does LA's ITA accept formal proposals for third-party Open311-style write access?~~ → No public API exists. Empirical test 2026-05-24 found all endpoints return 401; LA absent from Open311 server registry; no developer portal. Partnership path requires negotiated Salesforce data agreement, not endpoint discovery. See `raw/0008-myla311-api-empirical-test.md` and [[concepts/la-city-partnership-mechanics]]
