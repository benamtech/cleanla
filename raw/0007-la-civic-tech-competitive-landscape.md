# LA Civic-Tech Competitive Landscape (2026)

> Research compiled 2026-05-24 for the CleanLA project's Phase 1.5 partnership-conversation prep. Goal: know who's adjacent, who overlaps, who's complementary.

## Executive summary

Los Angeles has a fractured but active civic-tech ecosystem: the city's own MyLA311 (revamped March 2025) is the dominant, well-resourced reporting platform covering street issues (graffiti, potholes, illegal dumping). SeeClickFix offers a second-track alternative with voting and prioritization features. Beyond these, the space is dominated by single-issue trackers (encampments, homelessness, transparency dashboards) and grassroots mutual aid networks — most lack the street-issue-reporting focus CleanLA targets. The transparency/dashboard layer (ControllerLA data portal, DataLA, GeoHub) is rich but government-facing. The strongest adjacent play is **Clean LA With Me**, Naula's volunteer cleanup org with deep community trust; partnership here would complement CleanLA's tech with hyperlocal execution and amplified reach. University civic-tech labs (USC Annenberg Civic Media Fellowship, UCLA ShadeLA, Caltech PHOENIX) exist but lean research/climate/arts rather than street-issue triage. No direct competitor to CleanLA's specific form factor has emerged.

---

## Direct overlap (same problem, similar form factor)

| Name | URL | Status | Description | Partnership signal |
|------|-----|--------|-------------|-------------------|
| **MyLA311** | https://lacity.gov/myla311 | Active (launched Mar 2025) | City of LA's official service-request platform; 96+ service types, 243-language support, map-based location tagging, request tracking via email. Covers graffiti removal, illegal dumping, street repairs, homeless encampments, street trees. | Direct complement: CleanLA could feed into MyLA311 (open question: does LA accept third-party data? not found). MyLA311 is the incumbent; CleanLA's value must be *ease-of-reporting* or *community-driven verification* rather than replacement. |
| **SeeClickFix** | https://seeclickfix.com/los-angeles | Active (2025-2026) | National 311 alternative active in LA County and city neighborhoods. Map-based reporting, photo upload, public voting to prioritize issues, status tracking. | Less integrated than MyLA311. Could be a validation channel if CleanLA reports get tracked there; potential integration point if SeeClickFix adds encampment-specific categories. |

---

## Adjacent (different problem, same audience / infrastructure)

| Name | URL | Status | Description | Partnership signal |
|------|-----|--------|-------------|-------------------|
| **Mutual Aid LA Network** | https://mutualaidla.org/ | Active (2025-2026) | Connector hub for LA mutual aid efforts, including community cleanup and care initiatives. Monthly "Dispatch" newsletter. | Complementary: MALAN coordinates volunteers; CleanLA could integrate or cross-promote reporting to help MALAN prioritize cleanup logistics. |
| **Clean LA With Me** | https://cleanlawithme.org/, https://cleanlawithme.com/ | Active (Instagram ~69K followers) | Juan Naula-led volunteer cleanup nonprofit; focus on dignity, safety, neighborhood restoration. Community-powered environmental cleanups. | **CLOSEST PARTNERSHIP OPPORTUNITY:** Already doing ground-truth cleanups; CleanLA's reporting tool would give them real-time issue visibility to plan campaigns. Could power their logistics. |
| **Street Watch LA** | https://streetwatchla.com/ | Active (2025) | DSA-LA + LA Community Action Network coalition; focuses on tracking encampment sweeps, tenant rights, unhoused populations. Not a 311-type reporting tool but public issue tracker. | Adjacent audience (unhoused/encampment tracking); different mission (rights advocacy vs. service-request routing). Low overlap. |
| **LA Metro Transit Watch App** | https://apps.apple.com/us/app/la-metro-transit-watch/id1490951184 | Active (2025-2026) | Report safety and maintenance concerns on transit system. Anonymous submission, SMS alerts. | Different infrastructure (transit-specific) but same UX pattern. Not a threat; separate domain. |

---

## Transparency / dashboard layer

| Name | URL | Status | Description | Partnership signal |
|------|-----|--------|-------------|-------------------|
| **Los Angeles Open Data Portal (DataLA)** | https://data.lacity.org/ | Active (2025-2026) | Official city open data; 500+ datasets including 311 service requests, permits, crime, parks. Interactive dashboards (capital projects, parking, general fund). | One-way: CleanLA could *consume* this data (311 request patterns, completion rates) to show users what's in-flight. Building permits data is available. |
| **LA GeoHub** | https://lacity.gov/government/open-data | Active (2025-2026) | Searchable GIS-based directory of LA city datasets (farmers markets, construction projects, crime, streams). | Same as DataLA: CleanLA could visualize this; not a competitor. |
| **ControllerLA Data Portal** | https://controller.lacity.gov/data | Active (2025-2026) | City Controller's transparency site; financial and performance dashboards. | Out-of-scope for CleanLA (government accountability, not street-issue reporting). |
| **Open Data Los Angeles** | https://opendatalosangeles.com/ | Active (2025-2026) | Independent visualization dashboard; 1.5M+ building permits from 2006–2025 with property use, zoning, estimated value. | Not a direct competitor; different use case (construction/development, not street issues). |

---

## Grassroots / activist tech

| Name | URL | Status | Description | Partnership signal |
|------|-----|--------|-------------|-------------------|
| **Vision Zero LA (LADOT Livable Streets)** | https://ladotlivablestreets.org/programs/vision-zero | Active (2025) | City initiative to eliminate traffic deaths. Street Teams gather community input on safety risks. GeoHub integration. | Non-overlapping mission (traffic safety, not street cleanliness). No direct partnership value. |
| **UA Homeless Encampment Dashboard** | https://homeless.lacounty.gov/ua-homeless-encampment-dashboard/ | Active (2025-2026) | LA County tracker of encampments on unincorporated road rights-of-way; automated request system (HEARS) for planned interventions. | Encampment-specific; CleanLA could integrate data or cross-link if CleanLA reports encampments. Government-owned; integration unclear. |
| **LA-HOP (LA Homeless Outreach Pilot)** | https://www.lahsa.org/portal/apps/la-hop/request | Active (2025) | System for requesting homeless outreach services. | Different pathway (connects to services, not street reporting). Complementary but not directly competitive. |
| **Caltech PHOENIX Air Quality Monitoring** | (post-fire 2025 initiative; no persistent URL found) | Active (2025 post-fire response) | Solar-powered sensors for real-time air quality data post-fire. Community education webinars. | Out-of-scope (environmental monitoring, not street triage). Research project, not a reporting platform. |
| **ShadeLA Initiative** | https://ladotlivablestreets.org/ (partner org) | Active (2025-2026) | USC Dornsife + UCLA Luskin + LA City + LA28 partnership to expand shade access in heat-vulnerable neighborhoods. | Different problem (heat equity, not street issues). No partnership signal. |

---

## Government-side reporters (the apps CleanLA would feed into or compete with)

| Name | URL | Status | Description | Integration opportunity |
|------|-----|--------|-------------|-----------|
| **MyLA311** (revamped) | https://lacity.gov/myla311 | Active (Mar 2025) | **THE incumbent.** 96 service types, map-based, email tracking, 243 languages. Covers graffiti, dumping, encampments, street repairs. | **Critical question not resolved:** Does LA311 have an API for third-party apps to push data? Does it accept crowdsourced reports? If yes, CleanLA could be a *collection layer* that feeds into 311. If no, CleanLA competes for user attention. |
| **Bureau of Street Services (StreetsLA)** | https://streets.lacity.gov/ | Active (2025) | Manages 23,000 lane miles, 660K street trees. Data-driven pavement preservation program. Feeds from 311 requests. | Data consumer, not a reporting platform. CleanLA reports would eventually reach this agency. |
| **LA County Public Works Report Tool** | https://pw.lacounty.gov/explore-public-works/report-a-problem/ | Active (2025) | County-level issue reporting (separate from city 311). | Separate jurisdiction; only relevant if CleanLA covers unincorporated LA County. |
| **LADWP Water Quality Dashboard** | https://ladwpnews.com/ | Active (Feb 2025 launch) | Interactive dashboard for water quality issues (launched for Pacific Palisades water quality crisis). | Out-of-scope (water-only, not street cleanliness). |

---

## Research-led / educational civic-tech

| Name | URL | Status | Description | Relevance |
|------|-----|--------|-------------|-----------|
| **USC Annenberg Civic Media Fellowship** | https://www.annenberglab.com/about-civic-media-fellowship/ | Active (2026-27 cohort launching Sep 2026) | 8-month fellowship for artists, creators, organizers working at media + technology + culture intersection. Macarthur-funded. | Research + training, not a deployed product. Could be a *thought partner* for CleanLA on community-centered design but not a competitor. |
| **UCLA ShadeLA** | https://luskin.ucla.edu/ (Luskin School) | Active (2025-2026) | Partnership project on heat equity; not street-issue focused. | Out-of-scope. |
| **Civic Tech USC** | https://communicationleadership.usc.edu/projects/impact/ctsc/ | Active (ongoing) | Researchers + civic hackers exploring tech + civic engagement. | Potential partner for research/case-study documentation; not a deployed platform. |

---

## Named candidates checked / not found

| Candidate | Status | Notes |
|-----------|--------|-------|
| **STMRP** (Solid Tides Mobilization Research Project) | Not found | No public web presence or mention in 2025-2026 sources. May be discontinued, renamed, or private. |
| **FuckLAPD.com** | Active (advocacy tool, not civic reporting) | Facial recognition tool for LAPD officer identification; leverages public records. Not relevant to street-issue reporting. |
| **Vision Zero LA apps** | Partial (LADOT Street Teams, no dedicated app) | LADOT runs Street Teams for input but no public Vision Zero reporting app beyond web surveys. |
| **StreetWatchLA** | Active (grassroots advocacy, not a reporting platform) | Tracks encampment sweeps and tenant rights; different mission and audience than CleanLA. |
| **FixIt Beverly Hills / Santa Monica / WeHo / Long Beach** | Not found | No standardized "FixIt" app found for these cities. Each city uses MyLA311 (LA city) or separate municipal systems. Santa Monica, Beverly Hills, Long Beach have their own portals but not via a unified "FixIt" brand. |
| **LA Tech Council projects** | Partial (LA-Tech.org, not civic projects) | LA-Tech.org focuses on workforce development and tech career access, not civic-tech platforms. |
| **UCLA CITRIS** | Not found | CITRIS (Center for Information Technology Research in the Interest of Society) not found as active in LA 2025-2026. UCLA Civic Engagement programs exist but no CITRIS-specific civic-tech output. |
| **Caltech civic-tech output** | Partial (PHOENIX air quality, not street issues) | Caltech's public facing 2025 work is PHOENIX air quality (post-fire response), not street-issue triage. |
| **r/LosAngeles, r/AskLosAngeles aggregation** | Not found | No formal integration of Reddit reporting into 311 or civic platforms found. Reddits serve as informal complaint boards but no systematic escalation tool. |

---

## Competitive heatmap (closest to CleanLA's mission)

1. **MyLA311 (LA City)** — THE incumbent. Controls the primary input channel for street-issue routing. CleanLA must either integrate with it, complement it (e.g., add community verification), or offer a better UX for specific issue types (e.g., encampments, illegal dumping).

2. **Clean LA With Me (Naula)** — NOT a competitor; strongest partnership play. Has ground-truth execution, community trust, and 69K Instagram followers. Tech + boots-on-ground alignment.

3. **SeeClickFix** — Second-track 311 alternative; active but less integrated with city systems. Could validate CleanLA reports or become a reporting destination if CleanLA surfaces high-priority issues.

4. **Mutual Aid LA Network** — Grassroots coordination; complementary volunteer logistics. Low direct overlap but high partnership synergy.

5. **Everything else** — Either out-of-scope (water, transit, heat, traffic safety) or research-phase (university labs, advocacy orgs like Street Watch LA).

---

## Gaps / open questions

1. **MyLA311 API / third-party integration:** We don't know if LA's 311 system accepts crowdsourced data or has a public API for third-party apps to push reports into it. This is **critical** to CleanLA's positioning. If yes, CleanLA could be a collection layer. If no, CleanLA is a separate-track complaint tool. *(Note: the 0006 city-partnership research found Open311 GeoReport v2 may be exposed; cross-check.)*

2. **STMRP status:** Could not find any public record of "Solid Tides Mobilization Research Project" in 2025-2026. May be defunct, private, or misnamed. Worth follow-up.

3. **University civic-tech scale:** USC Annenberg and UCLA have active research and fellowship programs but no deployed public platforms competing with CleanLA. They're thought-partners, not threats.

4. **Encampment tracking standardization:** UA Dashboard (county) and LA-HOP (outreach) exist but no unified public encampment API across city/county jurisdictions. CleanLA could fill a reporting/visibility gap here, but jurisdictional complexity is high.

5. **Reddit + official systems:** r/LosAngeles and r/AskLosAngeles host thousands of informal street-issue complaints yearly but no systematic escalation to 311 or city agencies. Opportunity for CleanLA to bridge that channel.

6. **Municipal app landscape for satellite cities:** Beverly Hills, Santa Monica, Long Beach each have their own portals, not a "FixIt" unified brand. CleanLA would need city-by-city partnerships if expanding beyond LA proper.

---

## Source URLs

- https://lacity.gov/myla311
- https://lacity.gov/news/request-city-services-report-problems-new-myla311-app-site
- https://mayor.lacity.gov/news/mayor-bass-announces-launch-new-myla311-system-make-la-cleaner-and-safer-improved-city
- https://seeclickfix.com/los-angeles
- https://homeless.lacounty.gov/ua-homeless-encampment-dashboard/
- https://www.lahsa.org/portal/apps/la-hop/request
- https://data.lacity.org/
- https://controller.lacity.gov/data
- https://opendatalosangeles.com/
- https://ladotlivablestreets.org/programs/vision-zero
- https://visionzero.geohub.lacity.org/
- https://la-tech.org/
- https://streets.lacity.gov/
- https://pw.lacounty.gov/explore-public-works/report-a-problem/
- https://ladwp.com/
- https://ladwpnews.com/ladwp-launches-interactive-water-quality-restoration-dashboard/
- https://streetwatchla.com/
- https://dsa-la.org/campaigns-and-projects/street-watch/
- https://apps.apple.com/us/app/la-metro-transit-watch/id1490951184
- https://mutualaidla.org/
- https://www.laforward.org/mutualaid
- https://www.annenberglab.com/about-civic-media-fellowship/
- https://communicationleadership.usc.edu/projects/impact/ctsc/
- https://luskin.ucla.edu/
- https://civictech.guide/
- https://www.seedtable.com/best-civic-technology-startups
- https://wellfound.com/startups/industry/civic-tech-1
- https://cleanlawithme.org/
- https://fucklapd.com/ (noted for reference; advocacy tool, not street-issue reporting)

---

**Report compiled by Claude Code subagent, 2026-05-24.**
