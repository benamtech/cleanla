# Raw Deposit — International Civic-App Precedents (Research Findings)

> Source: research agent dispatched on 2026-05-24 to investigate civic reporting apps outside the US that have achieved meaningful scale. Brief: cover Singapore OneService, India Swachhata, Estonia, Brazil Colab.re; surface adjacent precedents (Germany, Taiwan, South Korea, Australia, Africa); identify patterns that translate to LA.

---

## Singapore — OneService

**Scale:** Exact downloads unknown. Government-operated, launched 2015. Integrated with 17 Town Councils and 10 government agencies. AI chatbot feature launched 2021+. Sources: [oneservice.gov.sg](https://www.oneservice.gov.sg/) · [MDDI announcement](https://www.mddi.gov.sg/newsroom/new-ai-powered-oneservice/).

**Institutional form:** Government-run (Municipal Services Office, under Ministry of Digital Development and Information).

**Mechanically distinctive:**
- **Intelligent routing via multimodal AI** — text, geolocation, image analysis (with object detection for lampposts, cigarette butts, trees) auto-routes to the correct agency. Achieves 85% correct first-assignment rate. [Source](https://medium.com/dsaid-govtech/training-the-oneservice-chatbot-to-analyse-feedback-on-municipal-issues-using-natural-language-4302aa5a3946) Eliminates the "know which agency" friction.
- **Conversational interface** — recent AI chatbot supports messaging-based reporting via WhatsApp/Telegram, not just the app.

**Translates to LA:** The multimodal routing algorithm is directly applicable. Requires only open data on agency jurisdictions (LA has this).

**Doesn't translate:** Singapore relies on a unified government hierarchy (17 Town Councils → national agency). LA's 88+ incorporated cities + unincorporated county areas create harder routing logic. Centralized government can mandate adoption; LA would need coalition-building.

---

## India — Swachhata-MoHUA

**Scale:** 24M+ cumulative complaints across 4,900+ towns/cities. ~230K monthly active users with 93% resolution rate (210K complaints redressed/month). **Confidence: medium** on aggregated claims — government figures with a known history of inflated Swachh Bharat Mission metrics. [Source](https://www.threads.com/@labourlawadvisor/post/DOsesupCOWY/) [Janaagraha (developer)](https://www.janaagraha.org/work/swachhata-technology-platform/) likely has more reliable independent data.

**Institutional form:** Government-run (Ministry of Housing and Urban Affairs) + nonprofit developer (Janaagraha). Mandatory-use scenario — cities required to meet resolution targets.

**Mechanically distinctive:**
- **Mandatory resolution SLAs** — complaints must be actioned within 6 hours to 1 week depending on type, with automatic escalation if not resolved at lower levels. [Source](https://www.gstsuvidhakendra.org/swachhata-app-lets-know-how-this-app-works/) Creates *enforced* accountability that voluntary systems lack.
- **Sanitary inspector integration** — field worker captures resolution photo, sent back to citizen via push notification. Closes the feedback loop.
- **Narrow scope** — only sanitation/cleanliness complaints (not potholes, lights, etc.). Focused scope aids enforcement.

**Translates to LA:** Mandatory SLAs are politically difficult in the US but could be negotiated with individual agencies as a trial (start with DPW). The resolution-photo feedback loop is low-cost and high-impact.

**Doesn't translate:** Mandatory aspect only works because MoHUA can enforce on city mayors. LA City Council / County Supervisors have less direct field-level control. Also, India's sanitation-crisis urgency justifies SLAs in a way LA potholes don't.

---

## Brazil — Colab.re

**Scale:** 500K+ users across 150+ municipalities. 200K+ problems solved. 100+ official partnerships with city halls (Curitiba, Porto Alegre, Recife, Salvador). Still actively operating (Feb-July 2025 campaigns mentioned). [colab.com.br](https://www.colab.com.br/en/) · [CUSP analysis](https://medium.com/cusp-civic-analytics-urban-intelligence/social-network-for-citizen-engagement-in-brazil-colab-re-5bb165026085).

**Institutional form:** Commercial (venture-backed via Unreasonable Group). Freemium model: free to citizens, municipalities pay for integration/customization. B2G revenue.

**Mechanically distinctive:**
- **Two-sided marketplace** — citizens report issues AND propose solutions (road crossings, bike parking, railings). City halls respond and prioritize in public.
- **"Journeys" (engagement funnels)** — tailored activity sequences move users from reporters to civic participants. Addresses cold-start problem common in civic apps.
- **Social/gamification layer** — problems are visible, voteable, commentable. Not just routed into a black box.

**Translates to LA:** The two-sided proposal model could differentiate from FixMyStreet — not just "report potholes," but "suggest solutions." Journey-based onboarding is proven. Commercial model shows civic tech can be sustainable without municipal subsidy.

**Doesn't translate:** Colab's growth has been through city-hall partnerships, not viral adoption. Brazilian city halls have stronger motivation to adopt (budget + modernization pressure). LA might be slower; political risk of being seen as outsourcing to a private company.

---

## UK — FixMyStreet (already in wiki; included for comparison)

**Scale:** 1M reports by 2017. 12K+ reports/month by recent count. 50K+ monthly viewers. [Source](https://www.fixmystreet.com/about/understanding-report-data).

**Institutional form:** Nonprofit (mySociety). Open-source. PaaS model.

**Mechanically distinctive:**
- **Postcode-based entry** — reduces friction by starting with address, not map.
- **Public, persistent issue feed** — reports remain visible even after resolution.
- **Post-resolution survey** — asks users if the problem was actually fixed.
- **Flexible routing** — email-based council submission works without APIs; Open311 support optional.

**Translates to LA:** Public-feed mechanics directly applicable. Post-resolution survey could yield powerful data on agency performance.

**Doesn't translate:** 12K reports/month across all of UK (~67M people) is ~0.018 reports per capita per year. Useful monitoring tool, not a citywide civic engagement platform.

---

## Australia — Snap Send Solve

**Scale:** 700K downloads, 550K active users, 4.5M+ cumulative reports. 4.7-star average rating. Integrated with 850+ organizations (councils, water authorities, telcos, power companies). [snapsendsolve.com](https://www.snapsendsolve.com/) · [Play Store](https://play.google.com/store/apps/details?id=com.outware.snapsendsolve&hl=en_AU).

**Institutional form:** Commercial SaaS (founded Melbourne 2013). Free to citizens; councils and utilities pay annual license fees.

**Mechanically distinctive:**
- **Integrated audience** — routes to councils, water authorities, power companies, private businesses. Citizens report downed power lines to utilities, not councils. Broad scope = high utility.
- **Photo-first interface** — snap first, annotate second.
- **B2B motion** — success driven by council adoption, funded by utility companies (water, power) who benefit from crowdsourced infrastructure monitoring.

**Translates to LA:** Multi-stakeholder model is promising. LA could partner with LADWP (water + power), Metro (transit), private property managers. Broader utility = faster critical-mass adoption.

**Doesn't translate:** Australian councils are smaller and more coordinated. LA's fragmentation makes the "unified app for all agencies" pitch harder.

---

## Germany — Mängelmelder

**Scale:** Deployed across multiple cities (Essen, Bremen, Mannheim, Görlitz, Ulm, Witten, Konstanz, Darmstadt). No aggregate user figures in public sources. [Play Store](https://play.google.com/store/apps/details?id=de.maengelmelder.app).

**Institutional form:** Civic-tech platform (appears nonprofit or public-private). City-level deployment, not nationally unified.

**Mechanically distinctive:**
- **GPS + photo + description** — standard now, but early. Geo-tagging prevents duplicates.
- **City-level customization** — different categories per city.

**Translates to LA:** City-level deployment is actually *more* realistic for LA. Start with one council (Santa Monica, West Hollywood, Venice) and iterate.

**Doesn't translate:** Never achieved FixMyStreet-level scale. Viable niche product, not a breakout.

---

## Taiwan — g0v / vTaiwan

**Scale:** g0v is a decentralized volunteer community (no user counts). vTaiwan launched 2014 and has resolved major online disputes (Uber legalization, online alcohol sales). No public MAU. [g0v.tw](https://g0v.tw/intl/en/) · [vTaiwan case](https://congress.crowd.law/case-vtaiwan.html).

**Institutional form:** Nonprofit community (g0v) collaborating with government. vTaiwan is government-supported but community-managed.

**Mechanically distinctive:**
- **Deliberative, not reporting-based** — vTaiwan debates future policy, not current problems.
- **Hackathon-driven community** — g0v runs 2-month hackathons to prototype civic tools.
- **Open-data-first** — g0v tools assume government will publish data; g0v builds on top. Inverts the usual relationship.

**Translates to LA:** Deliberative model could complement CleanLA Snap ("vote on repair priority" for reported potholes). Hackathon model shows rapid prototyping pattern.

**Doesn't translate:** Success relies on Taiwan's small size, high digital literacy, government receptivity to criticism. vTaiwan hasn't scaled to become the primary civic engagement platform; it's supplementary.

---

## South Korea — Seoul Smart City

**Scale:** No public user figures. Seoul Ansimi + Smart City Comprehensive Portal are official government infrastructure. Metaverse Seoul launched with mobile app. [smartcity.go.kr](https://smartcity.go.kr/en/) · [Seoul English](https://english.seoul.go.kr/policy/smart-city/).

**Institutional form:** Government-run (Seoul Metropolitan Government).

**Mechanically distinctive:**
- **Integrated incident response** — Ansimi app button triggers alarm + links monitoring center + CCTV review + auto-dispatch. Not just "report received"; full closure loop visible to user.
- **Digital Civic Mayor's Office** — backend connects hundreds of admin systems + field workers via voice/video. Real-time response.
- **Metaverse integration** — early experiment with 3D spatial interfaces for government services.

**Translates to LA:** Integrated response architecture (app → monitoring → dispatch → user notification) is the gold standard. Could be piloted within one council or one department (LAPD, LADWP).

**Doesn't translate:** Seoul's integration is expensive and requires unified municipal IT. LA's decentralized governance makes citywide adoption unrealistic.

---

## Kenya / global — Ushahidi

**Scale:** 45K initial users in Kenya (2007-2008 post-election). Since then: 100K+ deployments in 160+ countries. Used for disaster response, violence monitoring, harassment reporting. [ushahidi.com](https://www.ushahidi.com/) · [SSRC analysis](https://kujenga-amani.ssrc.org/2014/09/26/ushahidi-crowdsourcing-platform-a-people-centered-approach-to-conflict-transformation-in-kenya/).

**Institutional form:** Open-source platform (initially Kenyan nonprofit, now global). Used by NGOs, media, citizen groups — not primarily by governments.

**Mechanically distinctive:**
- **SMS + web submission** — works in low-connectivity contexts.
- **Crisis-focused, not municipal** — designed for real-time crisis response, not routine potholes.
- **NGO/media deployment** — usually deployed by journalists or human-rights orgs to aggregate third-party reports.

**Translates to LA:** SMS fallback is irrelevant for LA's smartphone penetration, but the *principle* (multimodal submission) is sound.

**Doesn't translate:** Never became a municipal civic-engagement tool. It's a crisis-response and advocacy tool. Wrong template for routine reporting.

---

## Patterns that translate to LA

1. **Multimodal routing (text + image + geo)** — OneService's 85% correct first-assignment rate proves AI-powered routing eliminates the "know which agency" friction. Build from day one.
2. **Public, persistent issue feed** — FixMyStreet and Colab show visibility drives engagement. Users report more when they see prior reports persist.
3. **Resolution photo feedback loop** — Swachhata's field-worker photo closing the loop is low-cost and high-impact.
4. **Two-sided model (solutions, not just problems)** — Colab's proposal/voting layer differentiates from passive reporting.
5. **Multi-stakeholder, multi-category scope** — Snap Send Solve routes to utilities, power, water. Broader scope = faster critical mass.
