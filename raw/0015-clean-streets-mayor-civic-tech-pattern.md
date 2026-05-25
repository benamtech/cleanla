# "Clean The Streets" Mayor Admin Pattern — Civic-Tech Buying Behavior (2026)

> Compiled 2026-05-24 for CleanLA's scenario planning. A hypothetical "Pratt"-style mayor (Clean The Streets platform, pro-tech, pro-data, pro-enforcement, coalition-of-volunteers framing) wins LA. Maps the precedents (Adams, Bloomberg, Bratton, Caruso, Wu, Breed), what they actually buy, and the positioning levers.

## Executive summary

When a "Clean The Streets" mayor takes office — combining visible-impact beautification, enforcement-first homeless policy, 311 modernization, and public-private partnerships under a pro-tech, pro-data ideology — civic-tech vendors face a distinct playbook and set of risks.

The pattern emerges from Eric Adams (NYC, 2022-), Michael Bloomberg (NYC, 2002-2013), Bill Bratton's CompStat (NYPD, 1994-), Rick Caruso's 2022 LA platform, and others: these admins demand *immediate* visible results, consolidate tech decision-making under a single Chief Technology Officer, use data dashboards as political cover, lean on public-private cleanup partnerships (especially BIDs), and struggle with vendor selection and accountability.

**The opportunity for CleanLA:** pitch as civic infrastructure (not vendor), land grassroots validation and photo evidence *before* the admin enters office, position privacy-first automation as *force-multiplication* for enforcement (not obstruction), and prepare 100-day outreach targets (Office of Technology + Department of Sanitation + BID coalition).

**The risk:** visible-impact measurement (before/after photos) collides with privacy protection (on-device blur for encampment subjects). Enforcement-first admin may politicize encampment imagery; nonprofit status can be mistaken for underfunding/unreliability.

## Precedent admins

### Eric Adams (NYC, 2022-)

**The "Day 1 consolidation play":** Executive Order 3 (Jan 2022) consolidated DoITT, the Office of Data Analytics, Office of Cyber Command, and Office of Information Privacy into a single Office of Technology and Innovation (OTI), reporting to the First Deputy Mayor. Centralized tech decision-making into one budget + one CTO (Matthew Fraser, ex-NYPD IT deputy).

**MyCity portal** (Mar 2023): omnibus one-stop-shop for city services and benefits. ~$100M budget. Non-competitive contractor awards to M/WBEs, each up to $1.5M. Components rolled out incrementally. Became "$100M question mark": "mostly walls of text, external links, and piecemeal components" with no coherence across constituencies. Vendor over-reliance: BetaNYC noted Adams's team believed "outside vendors could solve [problems] faster than they really could."

**Lesson for CleanLA:** MyCity failed partly because it tried to be omnibus. Be focused (street reporting). Show results within 90 days, not 3 years. Avoid the $100M trap.

### Michael Bloomberg (NYC, 2002-2013)

**NYC BigApps Challenge (2009-2013):** annual competition with $300K in prizes, 500+ submissions/year. Opened municipal datasets via NYC OpenData. Mentored winners through agency partnerships. *Not* government procurement — crowdsourced civic innovation, deliberately avoiding RFP red tape.

**NYC OpenData initiative:** foundational open-data policy; by 2013, millions of rows of municipal data accessible to civic developers.

**311 modernization (2003):** Accenture + Siebel consolidated 45 fragmented city call centers into one unified 311 system. Traditional procurement — expensive, vendor-locked, ongoing licensing.

**Lesson for CleanLA:** BigApps model shows "coalition of civic-minded volunteers" infrastructure *works* when you give developers + community volunteers direct data access + light prize incentives + agency mentorship. CleanLA should mirror this: open API, public leaderboard, small monthly prizes. Avoid the Siebel trap: lightweight cloud-native tech multiple agencies can integrate without major platform swap.

### Bratton/Giuliani CompStat (NYPD, 1994-2001)

The original "civic tech" of the broken-windows era: geographic crime database + management dashboard + accountability theater.

Built in-house by NYPD under Bratton and Deputy Commissioner Jack Maple. Combined mapping, crime statistics, performance metrics. The innovation: public accountability dashboards that ranked precincts against each other. Precinct commanders publicly grilled on data — political theater that aligned enforcement behavior with measurable outcomes.

**Critical insight: CompStat was NOT public-facing.** It was *internal* accountability. A Clean Streets admin will want *internal* dashboards for sanitation performance regardless of what civic-tech does.

**Lesson for CleanLA:** Don't try to be the admin's internal accountability tool. Be the *citizen-side complement* — let volunteers report, let crews see what's next, let the city's *internal* CompStat-like system consume that data.

### Rick Caruso (LA mayoral campaign, 2022, lost)

**THE closest US precedent to the Pratt scenario.** Billionaire businessman, "fixer" brand, explicit Clean LA Streets focus, encampment-removal first, visible-impact beautification.

**Platform:**
- "Clean LA Streets" with 500 new sanitation workers (explicit plank)
- Encampment removal + housing: "No one should be sleeping on our streets, that is inhumane and cruel"
- Day-1 state of emergency to override City Council authority over shelter placement (a power he *didn't actually have* — LA City Charter reserves land-use to Council)
- 30,000 shelter beds in 300 days, creating "comfortable, safe encampments" with services
- Business / real-estate coalition: building owners, BIDs, BID leaders
- Did NOT emphasize nonprofit homelessness services or Housing First

**Civic-tech endorsements:** NONE explicit in the campaign. No BigApps-style challenge, no 311 modernization pledge, no open-data initiative. $34M+ in traditional media ads, not civic innovation.

**Why he lost:** "State of emergency" was legally incoherent. Experts called it "disingenuous." Lost the general to Bass (Nov 2022). Pure enforcement + visible-impact without viable legal mechanisms lost to housing-first.

**Lesson for CleanLA:** A Clean Streets admin *needs* a legitimate legal/operational framework (Council-approved sweeps, contracted cleanups, BID-funded crews). CleanLA helps *operationalize* that framework. Position as the *operational tool* — measurable cleanup builds political cover for the admin's enforcement program. **Caruso's loss means that network dispersed but is still available to a future Clean Streets candidate.**

### Michelle Wu (Boston, 2022-)

Less explicit Clean Streets branding, more infrastructure-focused. Pothole-fix mantra; 18K potholes filled in first term.

**Automated pothole detection (Mercedes-Benz pilot):** anonymized vehicle data to identify potholes. Not major procurement; a pilot with a vendor.

**Lesson:** "Visible infrastructure" (potholes, street quality) is low-risk mayoral platform but doesn't generate massive civic-tech adoption on its own. Need *coalition* (BIDs, nonprofits, volunteers) + *enforcement* (visible cleanup of high-impact locations) to get the admin's attention and budget.

### London Breed (SF, 2018-)

**Tenderloin Emergency Initiative** (Dec 2021): published *daily* 311 data for the Tenderloin tracking service requests, outreach outcomes, safety metrics. Radical transparency for *messaging* — independent analysis of DataSF's own data showed metrics didn't support her claims.

**Lesson:** Admins use public data *instrumentally*, not to be held accountable. The data is for messaging, not truth. CleanLA's data should belong to the community (volunteers/residents), not the admin. Position as the *community's* source of truth about street conditions — not the admin's PR tool.

## What "Clean Streets" admins actually procure

### 311 Modernization Vendors

Pattern: consolidation (Garcetti had 4 separate systems; Bloomberg had 45 call centers) → unify under one CIO + one platform → large RFP, multi-year, typically $100M+ (Adams MyCity) or moderate (Boston).

Vendors: Accenture (Bloomberg), Salesforce (Chicago), CGI. Cloud-native is newer but less proven in gov.

**CleanLA positioning:** Don't be a 311 replacement; be a *supplement*. Data flows *into* 311 (as source of reports), but you're not the backend. Insulates from megacontract risk.

### Performance Dashboards

- **CompStat-style (internal):** for department heads measuring cleaning speed, graffiti removal time. Vendors: CrimeScan derivatives, Tableau, PowerBI.
- **Transparency dashboards (public):** London Breed's Tenderloin, Boston's infrastructure metrics. Often built in-house by city data team.

**CleanLA positioning:** Create a *partner* dashboard (accessible to volunteers AND city staff) showing real-time street conditions, cleanup crew status, pending reports. Don't hide behind a city firewall.

### Computer Vision for Code Enforcement

Some admins adopting CV for automated graffiti / illegal dumping detection. **Politically sensitive when identifying *encampment locations*** — enables rapid enforcement sweeps but raises privacy concerns about subject ID.

**CleanLA positioning:** If you adopt CV for litter/graffiti, be explicit it does *not* identify people. Blur faces + plates before any admin sees imagery. **Non-negotiable in pro-enforcement admin context.**

### Encampment-Tracking Systems

No major vendor has built a general-purpose "encampment management" platform. Caruso implied he'd create one but lost. Sparse because *encampment tracking is politically toxic* — data can be weaponized.

**CleanLA positioning:** Do NOT position as encampment-tracking platform even if Clean Streets admin asks. Track environmental conditions (trash, hazards) in neighborhoods where encampments exist, but don't build a database of people. **Core privacy insurance.**

### Trash / Litter Optimization + Route Planning

Vendors like Salesforce optimize truck routes. Relatively uncontroversial procurements.

**CleanLA positioning:** Partner with the city's existing Salesforce / logistics system. Don't try to be the dispatch system; be the *demand signal* (volunteers reporting where the trash is).

### BID Support Tools

BIDs (Business Improvement Districts) manage cleanup crews in commercial districts. A Clean Streets admin will *fund* BID expansion. They need: coordination tools, data integration, photo documentation.

**CleanLA positioning:** BID partnerships are *gold*. If CleanLA generates data *compatible* with BID operations (same APIs, formats), the admin funds BID partnerships AND CleanLA becomes essential infrastructure.

## "Coalition of civic-minded volunteers" framing

### Bloomberg's BigApps as template

Bloomberg created *infrastructure* (open data) + *incentives* (prizes, recognition) + *mentorship* (agency partners helping developers). Developers self-organized around the data. The platform became the *identity*: "NYC BigApps participants."

He did NOT create a "coalition" as a membership org. He created a *platform*.

### Adams's "We Love NYC" (partial)

Adams campaigned on "We Love NYC" as quality-of-life coalition. Upon taking office, downshifted coalition language in favor of vendor partnerships (MyCity). The coalition framing was campaign rhetoric, not operational infrastructure.

### CleanLA's approach for a Clean Streets admin

1. **Brand:** "CleanLA Volunteer Corps" or "Love LA, Clean LA" — simple, repeatable, nonpartisan
2. **Operational tier (core):** 300-500 active weekly reporters from neighborhood associations, BIDs, environmental groups
3. **Operational tier (secondary):** 50-200 organized cleanup crews coordinated with BIDs, local environmental nonprofits, city departments
4. **Operational tier (visibility):** Monthly "visible impact" reports (photo galleries, metrics) — feeds admin PR machine + builds volunteer morale
5. **Tool stack:**
   - Public: CleanLA app (report + leaderboard + crew status)
   - City-facing: API / dashboard (daily data feed to Sanitation, DPW)
   - BID-facing: Partner portal (logistics, impact reports)
   - Volunteer-facing: Slack channel + monthly town hall
6. **Funding model (CRITICAL for optics):** civic infrastructure, not vendor. Foundations + municipal partnership fees (cost-recovery only) + volunteer donations. **No VC. No corporate sponsorships** that complicate nonpartisan brand.

## Privacy-first vs enforcement-friendly tension

### The "on-device blur" solution

- **What works:** capture on volunteer device (phone) with automatic face blurring + person detection. Metadata stripped before upload. City sees clean-streets data; people not identified.
- **Why defensible in enforcement context:** Blur doesn't prevent enforcement (city still sees where trash/graffiti was, where cleanup happened). Blur protects individual dignity. Pro-enforcement admin that cares about tech and data will understand this.
- **Pitch language:** "We give you environmental data you need for visible impact and performance metrics. We protect individual privacy so your cleanup program can't be weaponized against people. Good governance + good politics."

### Tools that navigated the tension

- **SeeClickFix:** anonymous reporting; agencies see issue (pothole, graffiti) without reporter identity. Red AND blue cities. Issue-focused, not person-focused.
- **Citizen app:** controversial — early versions enabled protest surveillance. Has downscaled. Lesson: tools that identify *people* (especially in enforcement context) create backlash.
- **NextRequest:** automates FOIA; adoption in red AND blue cities because it's infrastructure, not enforcement-focused.
- **Facial recognition bans (Portland, Seattle):** even blue cities want privacy protections from government surveillance.

### Positioning rules for CleanLA in enforcement context

- **Position on-device blur as force-multiplication**, not obstruction. Clean Streets admins care about visible output; blurred data still shows output. Operational advantage.
- **Publish simple privacy policy:** "CleanLA captures environmental conditions, not people."
- **Get legal counsel to bake privacy into terms of service.** Make it binding on city if they ever use CleanLA data in enforcement against individuals. Insurance.
- **Market privacy as *operational integrity*** ("our data is clean, admissible, defensible") — not as moral stance.
- **Don't hide the blur feature.** Make it visible, default, explained in onboarding.

## First-100-days outreach map

### Transition period (Sep-Nov pre-inauguration)

Target the incoming mayor's transition advisory team. Contacts:

1. Tech subcommittee chair(s)
2. Chief Innovation Officer / equivalent
3. Outgoing city leaders still in office (Sanitation director, DPW chief, IT director — they brief the incoming team)
4. BID coalition leaders

Stay in touch through Nov-Dec. Prepare one-page briefing for the transition team.

### First 100 days (Days 1-100 after inauguration)

**Week 1:** Send congratulations note + data briefing to CTO/OTI director the day after inauguration. Offer demo on Day 5. Keep it 30 min.

**Weeks 2-4:** Meet with Sanitation director + DPW chief. Bring 3 months of CleanLA data. Offer integration with existing systems (no RFP needed).

**Weeks 5-8:** Offer CleanLA as *operational tool* for measuring visible impact. Pitch to Mayor's Chief of Staff: "Show your cleanup progress. Here's the dashboard."

**Weeks 9-12:** Respond to RFPs that touch street reporting / environmental data / volunteer coordination. Don't bid for megavendor (MyCity-style 311); bid for *specialty* integration.

### Contact map by role

| Role | When | What to Say | Success Metric |
|------|------|-----------|---|
| Transition Tech Subcommittee Chair | Sep-Oct | "6 months of street data, 500 volunteers ready to scale. Let's talk before you take office." | Meeting scheduled before Dec 1 |
| Chief Technology Officer (incoming) | Nov-Dec | "Integrates with your existing systems (Salesforce, 311). Zero procurement overhead." | Post-inauguration demo scheduled |
| Sanitation Director | Day 20-30 | "Crews waste time on cold calls. We give daily demand signal. Close tickets faster." | Pilot data feed in 30 days |
| DPW Chief | Day 20-30 | "Pothole reports, street damage, code enforcement priority. Daily refresh." | Pilot data feed in 30 days |
| Mayor's Chief of Staff | Day 45-60 | "Visible impact dashboard. Real-time cleanup metrics. Shows quality-of-life progress." | Monthly dashboard deployed |
| City IT Director | Day 30-45 | "API. Integrates with your existing stack. No new platform, no RFP." | Technical integration plan in 45 days |
| BID Coalition Leaders | Day 60-90 | "Volunteer network aligned with cleanup crews. Data flow between ops." | Formal partnership MOU drafted |
| Council Member (admin-aligned district) | Day 90-120 | "CleanLA driving visible improvement in your district. Consider public support." | Co-authored op-ed or public statement |

## The Caruso parallel: where his network is now

Caruso himself: still active in LA real estate + philanthropy. Caruso Foundation launched post-election focused on disaster relief (LA fires 2025-2026).

Ace Smith (Bearstar Strategies, Caruso's political consultant): works with multiple candidates, not Caruso-specific operative.

**LA BID coalition (Downtown LA, Silver Lake, Los Feliz, others) continues to grow.** Always interested in new tools to coordinate cleanup.

**Pro-business, pro-cleanup coalition that supported Caruso is intact — just looking for a new candidate or channel.**

**Implication for CleanLA:** Build relationships with *current* BID leaders, not with Caruso's past campaign. **BIDs are the stable counterparty in LA politics; they exist across administrations.** When a new Clean Streets candidate emerges in 2028-2030, the BID coalition will coalesce around them. CleanLA should be embedded in that network by then: "We've been working with LA BIDs for 4+ years; we're the de facto coordination tool."

## Recommended CleanLA pitch deck outline (10 slides)

1. **Executive summary** — Headline + 3-bullet proof (volunteers, reports, debris removed) + ask (data-sharing + integration)
2. **The problem (for the admin)** — Crews lack visibility; 311 backlogged; visible impact hard to measure
3. **The CleanLA solution** — Daily volunteer reports; crew dispatch coordination; visible-impact dashboard
4. **How it works (tech team)** — API integration; no new platform; no RFP; volunteer data ownership
5. **Results to date** — 500 volunteers, 10K reports, 200 tons trash, 500 tags. Cost to city: $0.
6. **Scale scenario** — 500 → 5K volunteers, 100K reports/year, 10x visible impact. City cost: $500K one-time + ~$50-100K/yr cost recovery
7. **Privacy + governance** — On-device blur; data-sharing terms; quarterly accountability reviews; "good governance + politics"
8. **BID integration** — Already coordinating with LA BID leaders; volunteer network aligned with BID crews
9. **Nonpartisan + durable** — Exists across administrations; works in red/blue/purple precedent cities; won't become a liability under next mayor
10. **Call to action** — Week 1 pilot data-sharing → Week 4 Sanitation dispatch integration → Week 8 public dashboard → Month 6 formal partnership

## Risk-mitigation

### Risk 1: Encampment politicization
- Data design: report environmental data separately from location data; no "encampment" labels in schema
- Public comms: "We report environmental conditions. We don't categorize or label people."
- Legal terms of service: "CleanLA data may not be used to track, identify, or target individuals or groups. Violation terminates the city's data license."
- Community accountability: volunteer council with homeless-services advocates; quarterly public reviews

### Risk 2: Vendor squeeze
- API-first architecture; don't embed in admin's choice of 311 platform
- Data ownership: volunteer-generated data belongs to volunteers/CleanLA, not city
- Partnership agreements not vendor contracts
- Exit clause: ability to export all data + shut down cleanly

### Risk 3: Visible-impact pressure on privacy
- Volunteer control: volunteers own + control photos
- Legal: volunteers retain copyright; CleanLA shares blurred publicly; unblurred stays private
- Monthly "Visible Impact" report with blurred photos only
- Alternative metrics if photos too sensitive: tons of trash, report counts, location heatmaps without subjects

### Risk 4: Nonprofit status exploited
- Public sustainability plan: "Civic infrastructure, not charity. Cost recovery legitimate."
- Cost transparency: $1M/yr for 500 active volunteers — sanitation crew costs 10x
- Diversified funding: foundations + nonprofits + volunteer donations + municipal fees + international replicas

## Gaps / open questions

1. **Encampment subject protection precedent in civic-tech** — surfaced the tension; no definitive legal/operational solve. Minneapolis 2024 encampment-removal ordinance worth monitoring.
2. **Caruso network specifics** — campaign likely had civic-tech consultants not named in public records. Bearstar (Ace Smith) + Downtown LA business leaders might surface names.
3. **Admin 100-day playbook standardization** — Bass published; Caruso published; not all mayors do. Research opportunity: compile 20 mayors' 100-day plans.
4. **Nonprofit vs vendor positioning line** — Code for America (nonprofit, well-funded, professional); SeeClickFix (nonprofit → for-profit). Line between civic infrastructure and vendor is blurry. Recommend legal + brand positioning workshop.
5. **International precedent** — London cleanup initiatives, Tokyo encampment policies, European broken-windows approaches. Research opportunity.

## Source URLs

- https://www.nyc.gov/mayors-office/news/2022/01/mayor-adams-creates-more-efficient-government-consolidating-city-tech-agencies-under-new-office
- https://nysfocus.com/2025/03/19/mycity-eric-adams-child-care
- https://d3.harvard.edu/platform-rctom/submission/nyc-bigapps-crowdsourcing-civic-innovation/
- https://en.wikipedia.org/wiki/NYC_BigApps
- https://publications.iadb.org/publications/english/document/Innovations-in-Public-Service-Delivery-Issue-No-01-Can-311-Call-Centers-Improve-Service-Delivery-Lessons-from-New-York-and-Chicago.pdf
- https://en.wikipedia.org/wiki/CompStat
- https://laist.com/news/politics/2022-election-california-general-los-angeles-mayor-rick-caruso-homelessness-land-use
- https://www.boston.gov/departments/analytics-team/automated-pothole-detection-0
- https://data.sfgov.org/City-Infrastructure/Tenderloin-Emergency-311-Calls/bu6n-b562
- https://medium.com/datala/modernizing-311-myla311-links-city-departments-and-civic-tech-through-open-data-59dd7cfca5ce
- https://www.beta.nyc/2025/11/18/dear-mayor-elect-8-gov-tech-ideas/
- https://www.opb.org/article/2023/02/13/portland-adopts-surveillance-technology-policy-2-years-after-banning-facial-recognition-software/
- https://www.pps.org/article/bid-2
- https://www.civicplus.com/seeclickfix/citizen-request-management
- https://www.nbcnews.com/tech/tech-news/citizen-public-safety-app-pushing-surveillance-boundaries-rcna1058
- https://www.gep.com/industries/government-non-profit
- https://labusinesscouncil.org/election-2022-la-mayor-elect-bass-announces-transition-advisory-team/
- https://ballotpedia.org/Rick_Caruso
- https://caseguard.com/articles/blurring-faces-and-the-truth-about-body-worn-camera-privacy/
- https://technical.ly/civics/data-privacy-guide-for-protesters-and-journalists/
- https://lims.minneapolismn.gov/Download/FileV2/46810/Encampment-Removal-Reporting-Ordinance-FAQ-Handout_Sep-11-2024.pdf

---

**Compiled by Claude Code subagent, 2026-05-24.**
