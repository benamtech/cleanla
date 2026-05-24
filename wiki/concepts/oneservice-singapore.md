---
title: OneService (Singapore)
tags: [civic-tech, case-study, international, asia, ai-routing]
created: 2026-05-24
updated: 2026-05-24
related:
  - international-civic-app-patterns.md
  - ../projects/cleanla-snap.md
---

Singapore's government-operated 311-equivalent app, launched 2015 by the Municipal Services Office (now under the Ministry of Digital Development and Information). The most-cited international example of AI-driven intelligent routing for civic complaints.

## What it does

Single app integrated with 17 Town Councils and 10 government agencies. Citizens submit a complaint — text, photo, geolocation — and the system auto-routes it to the responsible agency.

The routing is multimodal: text NLP for intent, image classification for object recognition (lampposts, cigarette butts, trees, etc.), and geolocation for jurisdictional boundary. The system [claims an 85% correct first-assignment rate](https://medium.com/dsaid-govtech/training-the-oneservice-chatbot-to-analyse-feedback-on-municipal-issues-using-natural-language-4302aa5a3946).

A later iteration (2021+) added a conversational AI chatbot that supports messaging-based reporting via WhatsApp and Telegram, not just the native app.

## Why this is interesting for [[../projects/cleanla-snap]]

The single largest UX friction in US 311 systems is "I don't know which agency to file with." LA has 88+ incorporated cities, an unincorporated county, plus utilities (LADWP), transit (Metro), schools, and private property — the wrong-agency tax is enormous. OneService's design eliminates that friction entirely by making routing a system concern, not a user concern.

The pattern is reproducible: it requires only published jurisdictional data (LA has this via [[myla311-system]]'s open data layer) and a multimodal classifier. Off-the-shelf models from 2026 can do object recognition cheaply enough that this is no longer a research project; it's an integration.

## What doesn't translate

Singapore can mandate that the 17 Town Councils + 10 agencies cooperate with a single national system. LA has no equivalent authority — adoption would require coalition-building with each council and agency independently. The technical pattern is portable; the institutional context isn't.

## Sources

- Official: https://www.oneservice.gov.sg/
- MDDI relaunch announcement: https://www.mddi.gov.sg/newsroom/new-ai-powered-oneservice/
- Routing implementation: https://medium.com/dsaid-govtech/training-the-oneservice-chatbot-to-analyse-feedback-on-municipal-issues-using-natural-language-4302aa5a3946

## Backlinks

- [[international-civic-app-patterns]]
- [[../projects/cleanla-snap]]
