---
title: Swachhata-MoHUA (India)
tags: [civic-tech, case-study, international, asia, enforcement]
created: 2026-05-24
updated: 2026-05-24
related:
  - international-civic-app-patterns.md
  - ../projects/cleanla-snap.md
---

India's national sanitation-complaint app, operated by the Ministry of Housing and Urban Affairs in partnership with the nonprofit [Janaagraha](https://www.janaagraha.org/work/swachhata-technology-platform/). The largest-scale 311-style civic app in the world by absolute volume, and the only major precedent built around *mandatory* resolution SLAs.

## Scale (with confidence caveat)

Claimed numbers: **24M+ cumulative complaints across 4,900+ towns/cities. ~230K monthly active users. 93% resolution rate (~210K complaints redressed/month).**

These are government figures, and the broader Swachh Bharat Mission has a history of inflated metrics. Janaagraha (the technical developer) likely has more reliable independent data. Treat the raw numbers as directional, not precise. Even at 50% confidence, this is an order of magnitude beyond any US 311 app.

## Mechanically distinctive

- **Mandatory resolution SLAs.** Complaints must be actioned within 6 hours to 1 week depending on type, with automatic escalation if not resolved at lower levels. This creates *enforced* accountability that voluntary systems lack. ([source](https://www.gstsuvidhakendra.org/swachhata-app-lets-know-how-this-app-works/))
- **Sanitary inspector integration.** Field workers capture a resolution photo, which is pushed back to the citizen via notification. Closes the loop in a way that the [[civic-app-patterns-and-failure-modes|"status loop = retention"]] hypothesis predicts is high-leverage.
- **Narrow scope.** Only sanitation/cleanliness complaints — not potholes, lights, or general infrastructure. Focused scope simplifies enforcement and routing.

## What translates to [[../projects/cleanla-snap]]

- **The resolution-photo feedback loop.** City workers already document their work; piping that photo back to the citizen via the app is low-cost, high-impact, and the kind of feature [[seeclickfix-civicplus]] points to as the retention lever. CleanLA Snap's "I cleaned this" flow already encodes the user-side version of this; pulling agency-side resolution photos in (when available from MyLA311 data) would extend the loop.
- **Narrow scope at launch.** Swachhata's focused taxonomy is a positive lesson — civic apps that try to handle every 311 category at once dilute the routing and the brand.

## What doesn't translate

The mandatory-SLA model is a direct consequence of MoHUA's ability to enforce on city mayors. LA City Council and LA County Supervisors have nothing close to that level of operational control over field execution. Mandatory SLAs as a US v1 feature would be politically impossible.

The urgency context is also different: India's sanitation situation is a public-health emergency in a way LA potholes are not, which justifies (and politically enables) the SLA framework.

## Sources

- Aggregate figures (low confidence on precision): https://www.threads.com/@labourlawadvisor/post/DOsesupCOWY/
- Janaagraha (technical developer): https://www.janaagraha.org/work/swachhata-technology-platform/
- SLA mechanics: https://www.gstsuvidhakendra.org/swachhata-app-lets-know-how-this-app-works/

## Backlinks

- [[international-civic-app-patterns]]
- [[../projects/cleanla-snap]]
- [[civic-app-patterns-and-failure-modes]]
