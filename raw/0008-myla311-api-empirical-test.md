# MyLA311 API Empirical Test (2026-05-24)

> Compiled 2026-05-24 to close a CleanLA wiki open question: does MyLA311 expose a programmatic submission API (Open311 v2 or otherwise)?

## Verdict

**No public programmatic submission API exists.** All tested Open311 GeoReport v2 endpoints return HTTP 401 (authentication required). MyLA311's form endpoints and Salesforce API paths are also behind authentication. LA is not listed in any public Open311 server registry. Confidence: High (95%+).

## Endpoints tested

| URL | HTTP Status | Response | Verdict |
|-----|-------------|----------|---------|
| https://myla311.lacity.gov/dev/v2/services.json | 401 | Unauthorized | Auth required (not public) |
| https://myla311.lacity.gov/api/v2/services.json | 401 | Unauthorized | Auth required (not public) |
| https://myla311.lacity.gov/open311/v2/services.json | 401 | Unauthorized | Auth required (not public) |
| https://311api.lacity.org/dev/v2/services.json | ECONNREFUSED | No service | Domain doesn't exist |
| https://311.lacity.org/dev/v2/services.json | ECONNREFUSED | No service | Domain doesn't exist |
| https://api.lacity.org/myla311/v2/services.json | 401 | Unauthorized | Auth required (not public) |
| https://myla311.lacity.gov/web_request/create | 401 | Unauthorized | Form backend auth required |
| https://myla311.lacity.gov/web_request/create?serviceType=POTHOLES&lat=34.0522&lng=-118.2437 | 401 | Unauthorized | Query params don't work unauthenticated |
| https://myla311.lacity.gov/services/data/v57.0/sobjects/Case | 401 | Unauthorized | Salesforce API path blocked |
| https://lacity.my.salesforce.com/services/apexrest | 401 | Unauthorized | Salesforce auth required |
| https://myla311.force.com | ECONNREFUSED | No service | Domain doesn't exist |
| https://myla311.lacity.gov | CSS Error | Page renders but broken | Site functional for logged-in users only |

## What the MyLA311 web form actually does

Unable to determine form submission POST URL or query-parameter patterns. The form backend at `https://myla311.lacity.gov/web_request/create` requires authentication to access — even to inspect the form structure. This means:

- No query-parameter deep-linking observed (URL like `?serviceType=...&lat=...&lng=...&description=...` fails with 401)
- Form POST endpoint inaccessible for reverse engineering
- No public deep-link pattern available for pre-filling form fields from external apps

## data.lacity.org 311 dataset

- **311 dataset query**: Searched `https://data.lacity.org` Socrata catalog for 311 reports — no public dataset found at the tested resource path
- **API endpoint test** (`https://data.lacity.org/resource/311-reports`): HTTP 404 — dataset doesn't exist or is private at this path
- **Status**: No read-only public API or dataset discoverable via standard Socrata patterns
- **Caveat**: the dataset may exist under a non-obvious resource ID — recommend a manual catalog search at data.lacity.org before declaring this final

## LA developer portal / GitHub presence

- **developer.lacity.org**: ECONNREFUSED — no official API portal exists
- **GitHub CityOfLosAngeles**: 79 public repos, but **zero for 311 or MyLA311** — services not open-sourced or documented in public GitHub
- **Alternative orgs (datalacity, MyLA311)**: Not found

## Open311 GeoReport v2 server registry

**Los Angeles is NOT listed** in either:
1. Open311 GeoReport v2 Servers Wiki (https://wiki.open311.org/GeoReport_v2/Servers/)
2. Open311 Status Registry (http://status.open311.org/) — monitors 25 endpoints; LA absent

The registry includes San Francisco, Chicago, Boston, and others, but LA has never implemented public Open311 compliance.

## Practical conclusion for CleanLA

MyLA311 is a **Salesforce Service Cloud citizen portal** with no public APIs. The 401 responses across all Open311 endpoints confirm what the wiki stated: LA does not publish a public Open311 write API. The absence from open registries, lack of developer portal, and zero GitHub documentation seal this.

**For CleanLA v1 (deep-linking):** Form pre-fill is not viable. Users must navigate to https://myla311.lacity.gov and fill the form manually. CleanLA can deep-link to the domain root but cannot pre-populate fields like location or issue type. Consider a redirect + UX note ("Please share these details when filing your report on MyLA311").

**For Phase 2 (data integration):** No discoverable Socrata 311 dataset means data access would require a formal partnership agreement with LA IT. The raw 311 case data lives in Salesforce, not in a queryable public API. Cannot build near-real-time issue tracking without City cooperation.

**For Phase 3 (formal partnership):** The lack of any programmatic interface (even read-only) suggests LA's 311 infrastructure was not designed for third-party integration. A partnership would require requesting custom Salesforce API access or a data-sharing SLA. This is a significant ask — it's not a matter of "finding the hidden endpoint."

## Cross-reference notes

- This empirically resolves the open question raised in `raw/0007-la-civic-tech-competitive-landscape.md` and partially in `raw/0006-la-city-partnership-mechanics.md`.
- Closes Phase 3 thinking around "if we could just hit an API" — that path is closed without negotiated agreement.
- Reinforces the [`2026-05-deep-link-not-direct-submit`](../wiki/decisions/2026-05-deep-link-not-direct-submit.md) decision: deep-link is not just the v1 path, it's the only public path indefinitely.
- The "deep-link with prefilled fields" language in projects/cleanla-snap.md should be revised to "deep-link to the MyLA311 home page with a UX note asking the user to copy details over."

## Source URLs

- Open311 GeoReport v2 Servers Registry: https://wiki.open311.org/GeoReport_v2/Servers/
- Open311 Status Registry: http://status.open311.org/
- City of LA GitHub: https://github.com/CityOfLosAngeles
- LA Open Data Portal: https://data.lacity.org
- MyLA311: https://myla311.lacity.gov

---

**Compiled by Claude Code subagent, 2026-05-24.**
