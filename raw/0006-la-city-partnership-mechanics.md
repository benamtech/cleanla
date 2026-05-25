# LA City Partnership Mechanics for Civic Tech (2026)

> Research compiled 2026-05-24 for CleanLA's Phase 3 city-partnership conversation (12-24 month timeline). Goal: sequence outreach properly, know who to talk to first, know what agreements look like.

## Executive summary

The City of Los Angeles does not have an active "Innovation Office" after Mayor Bass eliminated the Innovation & Performance Commission in the FY 2025-2026 budget. The city instead routes civic tech partnerships through **three parallel channels**: ITA (infrastructure/technical integration), the Mayor's Office of City Services (now led by Deputy Chief Rachel Brashier), and decentralized procurement via RAMPLA. Formal partnerships typically take 18-24 months via RFP, but faster paths exist: pilot MOUs (6-12 months), data-access agreements (3-6 months), and informal integration via Open311/Socrata API (no agreement needed). MyLA311 exposes service data via Socrata API but there is no known precedent for third-party write-back; feeder-app access would require negotiated data-use agreement. SeeClickFix operates in LA without formal city ownership. Boston's New Urban Mechanics and San Francisco's Mayor's Office of Innovation offer pilot models LA could adapt but has not formally adopted. The path is unclear because LA is still mid-reorganization (2026); success depends on finding the right entry point (ITA for technical, Mayor's office for political cover) and bundling as civic infrastructure, not vendor pitch.

---

## Who to talk to (mapped to outcome you want)

| Outcome | Office | Contact / Current Leader | Notes |
|---------|--------|-------------------------|-------|
| **Technical integration**: MyLA311 API access, Socrata data feeds, SANSTAR system | Information Technology Agency (ITA) — Enterprise Architecture / Service Integration | **Ted Ross**, CIO & General Manager of ITA (appointed 2015); **Tim Lee**, CISO | 465 employees, $90M budget. Ted Ross' office: (213) 473-XXXX. See ITA.lacity.gov. Start here for technical feasibility and data access. |
| **Political cover & city services alignment**: Positioning, departmental buy-in, pilot framing | Mayor's Office of City Services | **Rachel Brashier**, Deputy Chief of Staff for City Services (appointed Jan 2026) | Recently appointed, signal of Bass administration focus on street-level service delivery. LinkedIn: linkedin.com/in/rachelbrashier. Entry point: Mayor.lacity.gov or 213-473-3231. |
| **311 operations & service request routing**: Direct integration with MyLA311, call center policy | MyLA311 / Department of Public Services (embedded in ITA) | [Contact TBD] | MyLA311 uses Salesforce Service Cloud + proprietary SANSTAR system for field crew tracking. Data publicly available via Socrata (data.lacity.org), but write-access policies are unknown. |
| **Department liaison for specific issue vertical** (e.g., StreetsLA for street issues) | **Bureau of Street Services (StreetsLA)** | Office: 1149 S. Broadway, 4th Floor, LA. Phone: (213) 847-6000. | Handles pothole, sidewalk, street-light issues. Has procurement process; unclear if they use civic-tech vendors for app integration. |
| **Procurement & vendor registration** | **RAMPLA (Regional Alliance Marketplace for Procurement)** | [Self-serve platform] | Registration: www.rampla.org/s. Contact: bca.eeoe@lacity.org. Nonprofits may register without business tax; Vendor Registration Number (VRN) required. |
| **Public data & transparency** | **Controller's Office** | [Open Data Portal at controller.lacity.gov/data] | Hosts public datasets, dashboards. More data-forward than many CA cities; signal of openness to nonprofit data access partnerships. |
| **Community coordination** | Council District offices (15 districts) | Varies by district | CD representatives may champion pilot at local level; useful for neighborhood-specific phased rollout. |

---

## Agreement types in use

| Agreement Type | What It Is | When It Applies | Real LA Example | Notes |
|----------------|-----------|-----------------|-----------------|-------|
| **Memorandum of Understanding (MOU)** | Non-binding outline of intent, roles, responsibilities, timeline | Pilot projects, data-sharing partnerships, cross-departmental collaboration | Neighborhood Councils / LA Department of Water and Power (DWP) MOU Oversight Committee; Civic Innovation Lab / City of LA / Microsoft partnership | Typical LA pattern for initial partnerships. Non-binding but signals commitment. Usually 6-12 months. |
| **Data-Use Agreement (DUA)** | Governs access, permitted uses, security, retention of city data | API access, data feeds, integration with external systems | MyLA311 public service request data via Socrata API (no DUA required — fully open). Write-access or detailed service data would require DUA | Unknown if LA has a standard DUA template. Likely required for read-access to restricted MyLA311 fields or real-time feeds. |
| **Innovation Pilot Agreement** | Time-limited (6-12 months), small-scope project, joint success metrics, exit criteria | Proof-of-concept for new tools, integrations, or service models | LA's Innovation & Performance Commission funded 40+ pilots since 2016 (e.g., mobile nurse practitioner unit, employee payroll app, 3D printers for public works). Commission eliminated FY 2025-2026, so new pilot vehicle uncertain. | This was LA's fastest path but is dormant. Might be revived or replaced. Ask ITA / Mayor's office. |
| **Vendor contract (RFP-based)** | Formal procurement, SOW, SLA, payment schedule, compliance, IP terms | Acquisition of software, services, data licenses | LA Department of Water and Power SaaS subscription with StreetLight Data (travel patterns analytics, machine-learning); City of LA permits StreetsLA contractor portal vendors | 18-24 month timeline. Nonprofits can bid but require VRN. Often requires bonding and audit readiness. |
| **Open311 / GeoReport v2 API** | Standardized municipal service request API; no formal agreement needed | Feeding data into external apps, allowing third-party reporting tools | SeeClickFix operates in LA; allows public reporting and maps issues to MyLA311 internally. Mark-a-Spot, other civic-tech tools use Open311 | No formal agreement with City of LA required — Open311 is a published standard. However, integration quality depends on MyLA311's GeoReport v2 compliance. |

---

## Pilot pattern in LA (or absence thereof)

**Status as of 2026-05-24**: LA's Innovation & Performance Commission is being **eliminated** in FY 2025-2026 budget under Mayor Bass. This was the primary vehicle for rapid civic-tech pilot deployment (funded $1M annually, approved 40+ projects since 2016).

**The killed model** (2016-2025):
- 15-member commission (6 Mayor-appointed, 9 Council-appointed)
- ~$1M annual innovation fund
- Open call for city employee ideas + external partnerships
- Fast-track approval: 3-6 months typical
- Scope: Usually <$100k, 6-12 month pilot
- Example successes: mobile nurse practitioner unit, payroll app, 3D printers for public works

**Replacement model as of May 2026**: **Uncertain**. Mayor Bass administration has not announced a new innovation office or accelerated procurement pathway. Likely outcomes:
1. **ITA absorbs innovation function** — Ted Ross (CIO) may oversee pilots; contact ITA directly
2. **Mayor's office pilots through Rachel Brashier's City Services team** — Possible, but less formal than the old commission
3. **No formal pilot vehicle** — Apps go through standard 18-24 month RFP only

**Recommendation**: When CleanLA enters Phase 3, first question to ITA / Mayor's office should be: "What's the path for rapid pilots now that the Innovation & Performance Commission is gone?"

---

## Precedent: who has actually partnered with LA on civic tech

**Confirmed active partnerships:**

1. **SeeClickFix** (service reporting app)
   - Active in Los Angeles and LA County
   - Allows public to report issues (potholes, graffiti, street lights) and map them
   - Appears to integrate with MyLA311 via Open311
   - No public formal partnership announcement; operates as standard Open311 vendor
   - URL: seeclickfix.com/los-angeles

2. **StreetLight Data** (travel patterns analytics)
   - LA Department of Transportation (LADOT) has SaaS subscription
   - Acquired by Jacobs in Feb 2022
   - Uses machine-learning on anonymized mobility data
   - Known as Esri partner (GIS integration)
   - URL: esri.com/partners/streetlight-data-inc

3. **Civic Innovation Lab** (design/prototyping partnership)
   - Partners: Hub LA, City of LA, Microsoft, Columbia University (Learn Do Share)
   - Focus: Housing, education, small business, neighborhood stabilization, transportation
   - Model: Prototype new citizen-government collaboration workflows
   - Pro Bono Tech program bridges digital professionals with nonprofits
   - URL: la2050.org/organizations/civic-innovation-lab

4. **City Tech Collaborative** (project delivery)
   - Founded 2015; 30+ completed projects
   - Ecosystem: 100+ corporate, municipal, civic, philanthropic partners
   - No detailed case studies of LA-specific work found

**Precedent note**: Most partnerships are **not heavily publicized**. There is no curated "LA civic-tech partners" list; you discover them via press releases, Open Data portal, or RAMP procurement history. This is a signal: partnerships happen quietly; don't expect a PR campaign as validation.

---

## Procurement path

### Vendor Registration & Eligibility
- **Platform**: RAMPLA (formerly BAVN) at [www.rampla.org/s](https://www.rampla.org/s)
- **Nonprofit requirement**: Must have Vendor Registration Number (VRN) — issued by LA Controller's office for nonprofits without business tax
- **Eligibility verification**: RAMPLA asks for percentage of workforce in LA, minority/women-owned status, location verification
- **Support**: bca.eeoe@lacity.org for technical registration issues

### RFP Timeline & Scope
- **Typical procurement cycle**: 18-24 months (issuer → response window 30 days → evaluation → council approval → contract negotiation → start)
- **Faster models**: Some cities (Miami-Dade, San Francisco) have reduced to 6 weeks via "challenge-based procurement" or "RFP Bus" model. LA has not adopted.
- **Smallest known civic-tech contract**: No specific dollar floor found in research; LA publishes RFPs across all departments. Likely minimum contracts are <$50k for pilots or services, but bonding and audit readiness often required even for small amounts.

### Nonprofit-Specific Notes
- **Set-asides**: LA has no known specific "civic-tech nonprofit" set-aside, but community benefit programs exist
- **Bonding**: Smaller nonprofits may struggle with bonding requirements; ask at RAMPLA registration
- **Audit readiness**: Nonprofits must have 501(c)(3) status, clean financial audit, and IRS Form 990
- **Small business advantage**: Nonprofits that are also registered as local small businesses can benefit from local hiring / equity preferences in some RFPs

### How to find RFPs
- RAMPLA dashboard: [www.rampla.org](https://www.rampla.org)
- LA County Solicitations: [camisvr.co.la.ca.us/lacobids](https://camisvr.co.la.ca.us/lacobids)
- Individual department procurement pages (e.g., StreetsLA, LADOT, LACSD)

---

## MyLA311 third-party access posture

### What's Known
- **Public data**: MyLA311 service request data (2018-2025) is freely available on the [Los Angeles Open Data Portal (data.lacity.org)](https://data.lacity.org/City-Infrastructure-Service-Requests) via Socrata API
- **Datasets exposed**: Yearly snapshots of closed/open service requests, issue type, location, status, response time
- **Real-time access**: Unclear; Socrata supports real-time feeds, but LA may not expose live MyLA311 stream publicly

### Feeder-App / Write-Back Posture
- **No known precedent** for third-party apps writing back into MyLA311 service request queue
- **Technical architecture**: MyLA311 uses Salesforce Service Cloud + proprietary SANSTAR system (cloud-based mobility/tracking for field crews)
- **GeoReport v2 compliance**: Open311 GeoReport v2 is a published standard for municipal service submission; if MyLA311 exposes GeoReport v2 endpoint, SeeClickFix and other tools can post reports to it. This appears to be how SeeClickFix integrates in LA.
- **Restricted access**: Write-access to real MyLA311 queue (not just GeoReport API) would likely require negotiated Data-Use Agreement (DUA) + formal partnership agreement

### Implication for CleanLA
- **Phase 2 (current)**: Deep-linking to MyLA311 (read-only) is fine — no agreement needed; data is public
- **Phase 3 (desired)**: Write-back (CleanLA issues → MyLA311 queue) would require:
  1. Confirmation that MyLA311 exposes GeoReport v2 API (contact MyLA311 / ITA)
  2. DUA outlining data ownership, error handling, liability
  3. Possible pilot agreement with ITA / StreetsLA to test integration

---

## Common founder mistakes (avoid these)

1. **Pitching too early**. Founders often approach city before product is stable. Cities want to see 6-12 months of operational data, user feedback, and a clear ROI before even considering a pilot. **Fix**: Launch independently, gather metrics, then approach city.

2. **Asking for data before offering value**. "We need real-time MyLA311 data" is a vendor pitch, not a partnership. **Fix**: Show what you'll do with the data first (e.g., predictive pothole model), then ask.

3. **Generic pitch deck**. Using a one-size-fits-all pitch to multiple departments. City teams don't see overlap; they see a vendor trying to sell to everyone. **Fix**: Customize to ITA's infrastructure goals, StreetsLA's workload reduction, Mayor's service-delivery priorities. Ask each stakeholder what success looks like *for them*.

4. **Unclear roles and timelines**. "We'll integrate with MyLA311" without specifying who approves API changes, who runs tests, who owns the integration backlog. **Fix**: Draft a pilot agreement with specific milestones, approval gates, and decision-maker roles before presenting.

5. **Ignoring procurement reality**. Treating RAMPLA as optional or assuming you can work around procurement. **Fix**: Register on RAMPLA early, understand the timeline, budget 18-24 months for RFP-based contracts.

6. **Vague impact framing**. "Cleaner streets" is aspirational, not measurable. **Fix**: Know your specific KPI: "Reduce time from citizen report to crew dispatch by 20%," or "Increase pothole repair rate by 15%."

7. **No risk mitigation**. Cities are risk-averse; they want to know what happens if your app goes down, gets hacked, or you shut down. **Fix**: Have a contingency plan: data export protocols, 30-day wind-down, liability clauses.

8. **Not treating Mayor's office as political gatekeepers**. ITA says "yes," but if the Mayor's office doesn't back the project, it stalls in departmental infighting. **Fix**: Get the Mayor's office (now Rachel Brashier's team) aligned on vision *before* deep-diving with ITA on technical details.

---

## Borrowing pattern: NYC / Boston / SF civic-tech pilot models worth adapting

### Boston's New Urban Mechanics (Model: Flat, Fast, External to Bureaucracy)
- **Structure**: 5-person office outside departmental structure, reporting to Mayor
- **Process**: Crowdsource ideas (email, Twitter, hackathons) → rapid scoping (1-2 weeks) → pilot with private-sector or civic-tech partner (3-6 months) → monitor/refine → scale or sunset
- **Funding**: Very limited resources; relies heavily on pro-bono partnerships
- **Outcome**: Agile, nimble, high-visibility wins
- **Fit for LA**: LA could resurrect its Innovation Commission as a lean MONUM equivalent under Rachel Brashier's City Services office

### San Francisco's Mayor's Office of Innovation
- **Structure**: Department-level office within Mayor's cabinet
- **Process**: Data-driven problem definition → innovation procurement (RFPs that allow novel approaches, not just lowest bid) → pilot cohorts (3-4 projects at once) → scale proven models
- **Funding**: Integrated into city budget; no separate innovation fund
- **Outcome**: More sustainable than Boston's boutique model; can run larger pilots
- **Fit for LA**: SF's model would suit LA's scale, but LA would need to fund it formally (cut from elimination of Innovation Commission)

### NYC (Conceptual: TBD)
- Search for "NYC CivicService Lab" did not yield concrete results; likely superseded or rebranded
- NYC has robust **Civic Innovation Fellows** program and **NYC Planning Labs**
- Pattern: Embed civic designers/technologists in city agencies for 1-2 year rotations

---

## Recommended first 3-step playbook for CleanLA when Phase 3 begins

### Step 1: Situation Assessment (Month 1-2)
1. **Call ITA Enterprise Architecture** (contact via ita.lacity.gov or 213-473-XXXX)
   - Ask: "What's the current path for civic-tech pilots now that the Innovation Commission is eliminated?"
   - Ask: "Is MyLA311 exposing GeoReport v2 API? What's the process for third-party integration?"
   - Deliverable: 1-pager on ITA's pilot vehicle (if any) and technical roadmap
2. **Call Mayor's Office of City Services** (Rachel Brashier, via mayor.lacity.gov)
   - Ask: "Does the Mayor's office support civic-tech partnerships for street-level service delivery?"
   - Frame as: infrastructure, not vendor pitch
   - Deliverable: Indication of political appetite and any formal pilot program
3. **Register on RAMPLA** (www.rampla.org/s)
   - Get Vendor Registration Number (VRN) as nonprofit
   - Understand bonding and audit requirements
   - Deliverable: Baseline compliance readiness

### Step 2: Pilot Scoping (Month 2-4)
1. **Narrow to 1-2 specific departments** (e.g., StreetsLA for pothole/street issue vertical)
   - Contact Bureau of Street Services (213) 847-6000
   - Propose: "6-month pilot in 1-2 neighborhoods, focused on reducing dispatch time or improving crew efficiency"
   - Do NOT ask for data first; show how CleanLA's citizen reports improve their workflow
   - Deliverable: Memorandum of Understanding or informal pilot agreement
2. **Draft technical integration spec**
   - Document exactly what you need from MyLA311 (read-only data feeds? GeoReport v2 write-access?)
   - Propose security model (DUA, API key, rate limits)
   - Deliverable: 5-page technical spec
3. **Identify champion in Council District(s)** where you'll pilot
   - Local councilmember's office can expedite departmental alignment
   - Deliverable: Councilmember letter of support (optional but valuable)

### Step 3: Formalize & Fund (Month 4-12)
1. **If ITA says "yes" to pilot**: Draft formal pilot MOU
   - Timeline: 6 months
   - Scope: Specific neighborhood, specific issue types, defined success metrics
   - Funding: Clarify who pays for staffing, data, infrastructure
   - Deliverable: Signed MOU with ITA and StreetsLA
2. **If ITA says "no pilot program exists"**: Prepare for standard procurement
   - Begin building the case for procurement (success metrics, cost-benefit, LA precedent if available)
   - Plan for 18-24 month RFP cycle
   - Deliverable: Procurement strategy memo
3. **Secure Phase 3 funding** with a 12-18 month runway
   - City partnerships are slow; CleanLA needs operational independence while negotiating
   - Deliverable: Funding commitment for next 18 months

**Timing**: All three steps = 12-16 months. Plan Phase 3 kickoff for Q4 2026 if you want partnership operational by Q3 2027.

---

## Gaps / open questions

1. **Is a new pilot vehicle replacing the Innovation Commission?** As of May 2026, LA has not announced a successor. This is the single biggest uncertainty. Recommend calling ITA and Mayor's office directly to confirm.

2. **Does MyLA311 expose GeoReport v2 API?** Socrata data is public, but the standardized Open311 write-endpoint is not confirmed. This is critical for CleanLA's Phase 3 MVP; clarify with ITA before planning architecture.

3. **What is the standard DUA template for LA city data access?** No template found in search. Likely each department uses different language. Ask ITA if there's a standard or precedent.

4. **Has any nonprofit previously negotiated write-access to MyLA311?** No precedent found. This may be new territory for LA. Increases negotiation complexity and timeline.

5. **What is the smallest civic-tech contract LA has awarded?** No specific dollar floor found. Useful to know if CleanLA can start with <$50k pilot before scaling to larger procurement.

6. **Is there a "civic tech" or "nonprofits" set-aside in LA RFPs?** RAMPLA mentions equity/small-business preferences, but no explicit civic-tech or nonprofit carve-out. May exist in specific departments.

7. **Who owns the relationship between LADOT/StreetsLA and third-party apps** (SeeClickFix, etc.)? Likely no formal owner — apps just integrate via open standards. Could be a risk if integration breaks unexpectedly.

---

## Source URLs

- [Information Technology Agency (ITA) — About ITA](https://ita.lacity.gov/about/ita)
- [Information Technology Agency — Organization Overview](https://ita.lacity.gov/about/organization)
- [Information Technology Agency — Strategic Plan 2026-2027](https://ita.lacity.gov/about/strategic-plan)
- [Mayor Karen Bass Official Website](https://mayor.lacity.gov/)
- [Mayor Bass — New Executive Leadership Staff Announcement](https://mayor.lacity.gov/news/mayor-bass-announces-new-executive-leadership-staff)
- [Mayor Bass — FY 2025-2026 Budget Proposal](https://mayor.lacity.gov/news/mayor-bass-releases-balanced-budget-proposal-fy-2025-2026)
- [Los Angeles Open Data Portal — MyLA311 Service Request Data 2025](https://data.lacity.org/City-Infrastructure-Service-Requests/MyLA311-Service-Request-Data-2025/h73f-gn57)
- [Socrata API Foundry — MyLA311 Data 2025](https://dev.socrata.com/foundry/data.lacity.org/h73f-gn57/embed)
- [Los Angeles Controller — Open Data Portal](https://controller.lacity.gov/data)
- [SeeClickFix — Los Angeles](https://seeclickfix.com/los-angeles)
- [Vision Zero Los Angeles GeoHub](https://visionzero.geohub.lacity.org/)
- [Los Angeles Vision Zero Alliance](https://www.visionzeroalliance.org/)
- [Bureau of Street Services (StreetsLA) — Doing Business With Us](https://streets.lacity.gov/resources/doing-business-us)
- [RAMPLA (Regional Alliance Marketplace for Procurement)](https://www.rampla.org/s)
- [LA Business Navigator — Contract with the City](https://business.lacity.gov/grow-business/contract-city)
- [LA County Solicitations](https://camisvr.co.la.ca.us/lacobids/)
- [Los Angeles County Vendor Registration](https://camisvr.co.la.ca.us/webven/)
- [LA County Department of Water and Power — Vendor Information](https://lacovss.lacounty.gov/)
- [City Tech Collaborative — LinkedIn](https://www.linkedin.com/company/city-tech)
- [Civic Innovation Lab Los Angeles](https://la2050.org/organizations/civic-innovation-lab)
- [EmpowerLA — Partnerships](https://empowerla.org/partnerships/)
- [StreetLight Data Inc — Esri Partner](https://www.esri.com/partners/streetlight-data-inc-a2T5x000008DlnSEAS)
- [Boston's New Urban Mechanics — Boston.gov](https://www.boston.gov/departments/new-urban-mechanics)
- [New Urban Mechanics — Medium](https://newurbanmechanics.medium.com/)
- [San Francisco Mayor's Office of Innovation](https://www.sf.gov/departments--mayors-office-innovation)
- [SF Civic Tech](https://www.sfcivictech.org/)
- [Open311 — Standard & Applications](https://www.open311.org/)
- [Rachel Brashier — LinkedIn Profile](https://www.linkedin.com/in/rachelbrashier/)
- [Cities Today — It's Time to Reimagine the RFP](https://cities-today.com/its-time-to-reimagine-the-rfp/)
- [Civic IQ — Ultimate Guide to Government Procurement](https://blogs.civiciq.com/2026/04/22/the-ultimate-guide-to-government-procurement-how-cities-counties-schools-buy-technology/)
- [Rubicon — How Smart Cities Can Reduce Government Procurement Timeline](https://www.rubicon.com/blog/smart-cities-reduce-government-procurement-timeline/)
- [Aspen Institute — To Make Cities More Efficient, Fix Procurement To Welcome Startups](https://www.aspeninstitute.org/blog-posts/to-make-cities-more-efficient-fix-procurement-to-welcome-startups/)
- [Civic Marketplace](https://www.civicmarketplace.com/)
- [Nonprofit Partnership Red Flags — Josh Weaver](https://joshweaver.com/nonprofit-partnership-red-flags-corporate-rejections/)
- [5 Mistakes Nonprofits Make When Pitching — Ecodrive](https://www.ecodrive.community/updates/5-mistakes-nonprofits-make-when-pitching-to-corporate-partners-and-how-to-fix-them/)
- [Pitching for Good — The Beautiful Blog](https://www.beautiful.ai/blog/pitching-for-good-creating-nonprofit-pitch-decks-for-donors-volunteers-and-government/)
- [Nonprofit Partnership Outreach Tips](https://nonprofithub.org/nonprofit-partnership-outreach/)
- [Nonprofit Procurement Best Practices — MIP](https://www.mip.com/blog/creating-a-nonprofit-procurement-policy/)
- [Drafting an MOU — Nonprofit Risk Management Center](https://nonprofitrisk.org/resources/drafting-a-memorandum-of-understanding/)
