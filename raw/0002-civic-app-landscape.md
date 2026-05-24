# Raw Deposit — Civic Cleanup App Landscape

> Source: pasted into the LLM Wiki bootstrap session on 2026-05-24 as the second raw deposit.

---

## 1. Snapcrap (San Francisco, 2018) — the closest direct precedent

**Founder:** Sean Miller, 24 years old at launch, moved to SF from Vermont after college.

**Concept:** "Snapchat for street filth." Opens directly to camera; one tap captures photo, one more tap submits it with GPS to SF Public Works. Built specifically because the official SF311 app required too many steps (mandatory comment field, multiple screens) for what is essentially a photo + location problem.

**Tech / submission path:** Photos forwarded to SF Public Works for cleanup dispatch. Not a direct Open311 write integration in the launch version — Miller acted as the intermediary.

**Launch trajectory:**
- Released October 2018 for iOS over a weekend
- Initial downloads "a few hundred"
- Miller created a Snapcrap Twitter account and followed SF311's existing 15K followers to bootstrap visibility
- Within 24 hours: local media interview request
- NBC Bay Area evening news piece → cascade coverage in LA Times, NY Times, Vice, Fox News, NY Post

**Friction points encountered:**
- **Trademark pressure from Snap Inc.** — outside counsel demanded changes. Miller compromised by changing color and logo but kept the name. They continued demanding a name change anyway.
- **Apple App Store moderation** — initial cartoon poop icon was rejected; he replaced it with a pixelated version
- **Public Works ambivalence** — "I don't think the people at Public Works are super psyched. It's creating quite a few more tickets for them." (Direct Miller quote.) Lowering reporting friction increased queue volume the agency had to service.
- **Prewritten comment templates** — to handle SF311's required comment field, the app provided canned options like "I see poop" and "Help. I can't hold my breath much longer."

**Scale context at launch:** SF had 24,300+ human waste cleanup requests in 2017. SF Public Works had a dedicated six-person "poop patrol."

**Key takeaway for CleanLA Snap:** The two-tap UX is the entire product. Any extra step (login, category dropdown, comment field) destroys adoption. Bootstrap virality by piggybacking on the existing official channel's audience.

**Sources:**
- AP/CBS coverage: https://www.cbsnews.com/sanfrancisco/news/san-francisco-snapcrap-app-used-to-report-poop-on-city-streets
- Vice writeup: https://www.vice.com/en/article/snapcrap-app-san-francisco-report-poop-to-311-vgtrn/
- Miller's own retrospective on Medium: https://medium.com/@miller.stowe/snapcrap-why-i-built-an-app-to-report-poop-on-the-streets-of-san-francisco-aac12382a7ce
- NBC Bay Area walkthrough: https://www.nbcbayarea.com/news/local/walking-san-franciscos-dirtiest-block-with-snapcrap-app-creator/204130/
- GovTech profile: https://www.govtech.com/civic/snapcrap-creator-provides-visual-tool-to-help-sf-clean-up-its-sidewalks.html

---

## 2. CleanLAwithMe / Juan Eduardo Naula — the LA partner / inspiration

**Founder:** Juan Eduardo Naula, Ecuadorian native. Moved to LA from Virginia in October 2024 originally to develop a rideshare app with an LA investor — was scammed out of $8,000 in his first two weeks. His wife told him not to leave. He started cleaning streets as therapy in November 2024.

**Organization:** Clean LA With Me is a registered 501(c)(3) nonprofit. Official sites: cleanlawithme.org and cleanlawithme.com. Daily solo cleanups; Saturday volunteer meetups in different LA neighborhoods.

**Scale (rough current figures, mid-2025 to early 2026):**
- ~69K Instagram followers (@cleanlawithme) and growing
- ~45K Facebook page following
- 100,000+ pounds of trash hauled
- 1,500+ filled bags
- Daily content on TikTok/IG showing before/after of specific LA blocks
- Built physical receptacle stations (compost / trash / cans / batteries) in Boyle Heights with intention to expand
- Quit his hardwood flooring day job to do this full-time, relies on donations + GoFundMe

**Strategy / model:**
- Hashtag-driven movement (#CleanLAwithMe), explicitly modeled on the ice bucket challenge's viral mechanic — users post their own cleanup videos using the tag
- "Show up, clean, post, repeat" — extremely simple content formula that travels well on short-form video
- Pairs activism with a critique of city government: "I started cleaning because the city wouldn't"
- Calls for city-level systemic change: long-term education programs on waste disposal, permanent neighborhood cleanup stations

**Friction:**
- Two hit-and-run collisions damaging his vehicle (fundraising for a pickup truck since)
- Limited equipment, donation-dependent
- No technology platform — purely social media + IRL meetups

**Strategic alignment with a CleanLA Snap app:**
- Juan's audience IS the natural user base — already engaged, already documenting cleanups
- His "before/after" content format maps perfectly onto the app's status-change feature ("Open" → "Cleaned" with photo proof)
- A volunteer-event feature in the app could replace the ad-hoc Instagram-DM coordination he currently relies on for Saturday meetups
- Building physical receptacle stations is a city-partnership ambition that the app's report data could directly justify (heatmaps of high-trash blocks)

**Sources:**
- Clean LA With Me official: https://www.cleanlawithme.org/ and https://cleanlawithme.com/
- LA Public Press profile (April 2025): https://lapublicpress.org/2025/04/la-trash-parks-clean/
- NBC LA (June 2025): https://www.nbclosangeles.com/news/local/new-angeleno-starts-nonprofit-to-clean-up-trash-across-los-angeles/3729068/
- ABC7 LA (Sept 2025): https://abc7.com/post/clean-la-mes-juan-eduardo-naula-makes-cleaning-streets-full-time-job/17776212/
- KFI AM 640 (Aug 2025): https://kfiam640.iheart.com/content/2025-08-15-how-clean-la-with-me-is-transforming-los-angeles-city-streets/
- Fox LA on the hit-and-runs (Aug 2025): https://www.foxla.com/news/la-influencer-continues-city-cleanup-campaign-despite-2-hit-and-runs
- Instagram: https://www.instagram.com/cleanlawithme/
- Facebook: https://www.facebook.com/cleanlawithme/

---

## 3. MyLA311 — the system any LA civic app must coexist with

**What it is:** LA's official non-emergency service request system. Three channels: call center (dial 311, or +1-213-473-3231), web at https://myla311.lacity.gov, and mobile apps for iOS + Android.

**Scale:** Processes roughly 2.5 million requests per year (per Ted Ross, LA City IT Agency General Manager, at the 2025 MyLA311 relaunch).

**Service catalog:** Covers 1,500+ city services. The post-2025 relaunch normalized the submission form down to 96 service request types (15 new, 25 consolidated from prior versions). Most popular: graffiti removal, pothole repair, bulky-item pickup, illegal dumping.

**2025 relaunch — what's new:**
- New iOS app (App Store ID 6740093512)
- "Drop a pin" for locations without addresses (LA River, alleys, obscure spots)
- Estimated service completion time after submission
- User-tracked request status
- Optional user registration (anonymous submission still allowed)
- Mixed user reception — App Store reviews critique the new version as benefiting the city's backend more than residents

**Open data:** Annual service request datasets published on data.lacity.org via Tyler Data & Insights / Socrata, e.g. "MyLA311 Service Request Data 2024" and prior years. **READ-only.** Public dashboards exist (e.g. neighborhood-level call rates).

**Write API status:** Los Angeles does not currently publish an active public Open311 GeoReport v2 write endpoint for third-party submissions. The backend appears to be Salesforce Service Cloud (consistent with the form structure on myla311.lacity.gov). Implication: any third-party app that wants to actually submit on the user's behalf must either:
1. Deep-link to the official portal with prefilled query params (politest option, lowest reliability)
2. Run a browser-automation agent (Playwright or similar) that fills the official form — fragile, possibly against ToS, vulnerable to CAPTCHA
3. Negotiate a formal partnership / API access with the LA Information Technology Agency

**Notable signal in the open data:** Illegal dumping reports were up 36% in the first two months of 2025 versus the same period in 2024 (cited by Naula via MyLA311 data).

**Sources:**
- City landing page: https://lacity.gov/myla311
- New launch announcement: https://lacity.gov/news/request-city-services-report-problems-new-myla311-app-site
- CBS LA on the new system: https://www.cbsnews.com/amp/losangeles/news/los-angeles-city-service-myla311-app-311-requests
- Open data portal: https://data.lacity.org/ (search "MyLA311 Service Request Data")
- App Store listing: https://apps.apple.com/us/app/myla-3-1-1/id6740093512
- Academic context on 311 systems generally: https://la.myneighborhooddata.org/2024/02/311-service-requests/

---

## 4. Open311 — the standard, and why most cities have walked away

**What it is:** Open311 (specifically the GeoReport v2 specification, finalized March 11, 2011) is an open, read/write API standard for non-emergency civic service requests. Originally developed by the nonprofit OpenPlans. Maintained at open311.org. The premise: a citizen's app should work in any city without rewriting integration code for each one.

**Cities that implemented it (historically):** Chicago, Toronto, San Francisco, Washington D.C., Boston, NYC, Baltimore, plus international (Cologne, Turku, Zurich).

**Reference implementations:**
- **FixMyStreet** (UK) — built by mySociety, the prototypical Open311 client
- **SeeClickFix** (US) — now rebranded as CivicPlus 311 CRM

**Current status (per the r311 package maintainers, 2024-2026):** "It is way past the golden age of open311 APIs and much of development in civic issue tracking has shifted to less open-access and less standardized alternatives. Many former prime examples have abandoned or severely limited their open311 endpoints."

**Why it died (working hypothesis):**
- Cities discovered that vendor SaaS (CivicPlus, Salesforce-based systems, custom builds) offered better internal workflow tooling than the open standard required
- The "open ecosystem" benefit was theoretical for most cities — few third-party citizen apps actually launched, so the cost of maintaining a public write API wasn't justified by external usage
- Liability, abuse, and moderation concerns around accepting arbitrary external submissions
- Procurement inertia — once a city signs a vendor, exposing a parallel open API becomes deprioritized

**What this means for new civic apps in 2026:** Don't plan on Open311 write access existing in your target city. Plan on either deep-linking to the official portal, partnering with the city directly, or operating purely as a parallel transparency layer that doesn't depend on official ingestion.

**Sources:**
- Open311 home: https://www.open311.org/ and https://www.open311.org/learn/
- Developer resources: https://www.open311.org/develop/
- Open Civic Data Standards summary: https://azavea.gitbooks.io/open-data-standards/content/standards/domain_specific_standards/open311.html
- r311 R package documentation: https://ropengov.github.io/r311/

---

## 5. SeeClickFix → CivicPlus 311 CRM — the dominant vendor

**What it is:** Originally SeeClickFix, an independent platform launched to let residents file 311 issues via app/web with photos and GPS. Acquired by and rebranded as CivicPlus 311 CRM.

**Business model:** B2G SaaS. Cities license the platform; CivicPlus provides:
- Resident-facing mobile app + web portal
- Internal CRM for city staff to triage, route, and respond
- Workflow automation, departmental routing
- Two-way communication threads with residents
- Reporting/analytics for city leadership

**Notable case studies cited by CivicPlus:**
- City of Lawrence (KS) — relaunched the system in 2024 after a 2019 implementation; key insight: "we put the software before the processes" the first time, had to redesign internal workflows before the software could deliver
- City of New Haven (CT) — earliest documented case study, integrated with Cityworks for asset management
- City of Newnan (GA) — frequently cited in reviews

**Strengths cited by city customers:**
- Replaced ad-hoc complaint management (email, phone trees) with a single funnel
- Transparency loop — residents see status updates, which reduces follow-up call volume
- Helps cities triage during storm events / EOC activations

**Weaknesses:**
- Heavy dependency on city staff actually working tickets — without process change, the software alone doesn't help
- Reporting/export capabilities have been criticized (one reviewer noted that previously useful submission-source breakdowns are no longer available in current report formats)
- Vendor lock-in concerns

**Strategic note:** SeeClickFix/CivicPlus is the obvious B2G acquirer or partner for a successful citizen-facing reporting app. They've already done the city-procurement legwork; a viral consumer app that demonstrates demand could be a strong upstream feeder.

**Sources:**
- CivicPlus 311 CRM page: https://www.civicplus.com/seeclickfix-311-crm/
- SeeClickFix landing: https://seeclickfix.com/
- New Haven case study PDF: https://seeclickfix.com/media/seeslickfix_case_study.pdf
- Lawrence case study: https://www.civicplus.com/case-studies/crm/lawrence-resident-engagement-service-seeclickfix-311-crm/
- Capterra reviews: https://www.capterra.com/p/202342/SeeClickFix/reviews/

---

## 6. FixMyStreet (UK) — the durable nonprofit alternative

**What it is:** Built and maintained by mySociety, a UK civic-tech nonprofit. Open-source codebase. Lets UK residents report potholes, broken streetlights, graffiti, etc. and routes to the appropriate council. Operates without per-city contracts — uses Open311 where available, falls back to email-based council integrations otherwise.

**Why it persists where others have faded:**
- Nonprofit operating model removes the need for B2G sales cycles
- Single national footprint reduces the per-city integration cost
- Open-source codebase has been forked and adapted internationally (FixMyStreet for Norway, Germany, others)

**Pattern lesson for CleanLA Snap:** A nonprofit-operated, single-region civic app can outlast both viral consumer launches (which fade when the founder loses interest) and B2G SaaS (which dies when a city procurement changes). The institutional form matters.

**Sources:**
- Open311 reference: https://www.open311.org/learn/
- Open Civic Data Standards: https://azavea.gitbooks.io/open-data-standards/content/standards/domain_specific_standards/open311.html

---

## 7. Chicago Open311 ecosystem (historical) — what's possible when the API is open

When the City of Chicago published an Open311 write API, an ecosystem of third-party apps appeared. Documented examples (per Smart Chicago Collaborative):

- **311 Super Mayor Emanuel** — gamified 8-bit visualization of incoming service requests in real time, with a hopping mayor sprite. Pure attention/PR play.
- **311 Request System** — submit and view service requests across 14 data types
- Multiple analytics dashboards, neighborhood briefs, and civic-engagement micro-apps

**Lesson:** A public submit API doesn't just enable one competing app; it enables a whole creative layer that drives engagement (and, indirectly, civic participation metrics that justify the city's investment). This is the argument to make if pitching an LA-specific Open311 endpoint.

**Source:** https://smartchicagocollaborative.org/incomplete-list-of-apps-using-the-open311-api-in-chicago

---

## 8. Cross-cutting patterns and failure modes

**Patterns that worked across these case studies:**

- **One-tap UX wins.** Snapcrap's success came directly from cutting reporting time from minutes (official SF311) to seconds. Any extra field is a 50%+ adoption tax.
- **Piggyback on an existing audience to launch.** Snapcrap followed SF311's Twitter followers. CleanLA Snap should pre-coordinate with @cleanlawithme.
- **Transparency layer > submission layer.** Even when a third-party app couldn't submit directly to official systems, just making reports publicly visible drove behavior change on both sides (residents kept reporting; agencies felt pressure to resolve).
- **Status loop = retention.** SeeClickFix's biggest cited benefit was the resident-facing "your report status changed" notification. Without this loop, users file once and never return.
- **Before/after photos are the unit of virality.** Every successful cleanup movement (Naula, Pratt's power-washing content) uses this format. Building it into the app's data model is high-leverage.

**Failure modes to avoid:**

- **Reliance on an open city API that may not exist.** Don't architect around Open311 write access in LA. Assume deep-link + Playwright-agent worst case.
- **Trademark / brand collision.** Snapcrap got a lawyer letter from Snap Inc. day-one for surface resemblance. Avoid any UI/name that visually echoes a major consumer app.
- **Agency resentment.** "Public Works wasn't super psyched" — lowering submission friction increases agency queue volume without giving them more resources. Design the agency-facing side too, even if it's just a CSV export they can ingest.
- **Doxxing and vulnerable-population harm.** Reports of encampments inherently surface people who haven't consented to being photographed. This is the single biggest reputational and legal risk and it's the one most discussed civic apps gloss over.
- **Founder-burnout collapse.** Snapcrap's coverage cooled within a year of launch and the app stagnated. Solo-developer civic apps die without an institutional sponsor (nonprofit, city partnership, foundation grant). Plan the institutional form on day one.
- **"We'll get an API if we go viral."** This rarely works on the city side — procurement and security review timelines are 12-24 months. By the time access is granted, the app may already have lost momentum.

---

## 9. Suggested decision log entries

- `decisions/2026-05-deep-link-not-direct-submit.md` — why we're not building Open311 write integration into v1
- `decisions/2026-05-no-candidate-branding.md` — keeping the app nonpartisan despite organic political alignment
- `decisions/2026-05-on-device-face-blur-required.md` — privacy floor for any photo of public space

---

## 10. Open questions the wiki should track

- Does LA's ITA accept formal proposals for third-party Open311-style write access? (Action: email 311@lacity.org)
- What's the actual ToS posture of MyLA311 on browser-automation submissions? (Need a lawyer read.)
- Is there a CivicPlus partnership lane for a feeder app that drives volume into their 311 CRM in cities that use it? (Worth a discovery call.)
- Could mySociety's open-source FixMyStreet codebase be adapted as a backend rather than building from scratch? (Cost/benefit of fork vs. greenfield.)
- What is the legal status of a third party submitting MyLA311 requests on behalf of a user — agency relationship, ToS, false-report liability?
