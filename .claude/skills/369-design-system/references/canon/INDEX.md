# 369 Canon — Master Index

> **30 canon files, ~612KB, 6 research waves.** A topical map of every reference in the 369 design-system canon, organized so you can find what you need in three reading paths: by **topic**, by **task**, or by **wave**. This is the index document — load it when you need to locate a reference without already knowing its filename.

For the top-level routing logic, see `SKILL.md` in the parent directory.

---

## By Topic — 9 Clusters

### 1. Design System Fundamentals
- [[tui-design]] — Terminal rendering model + Elm Architecture + framework archetypes + 369→TUI rule mapping (T1–T7)
- [[ascii-composition]] — Algorithms for charts/sparklines/tables on `medium: 'terminal'`

### 2. Terminal Protocol Layer
- [[terminal-capabilities]] — ANSI/VT/xterm fundamentals — common subset + concepts
- [[escape-codes-complete]] — Exhaustive reference: every documented CSI/OSC/DCS/APC code + Kitty/Sixel/iTerm2 extensions + 2026 emulator support matrix
- [[unicode-art-extended]] — 11 Unicode blocks, 1500+ codepoints catalogued (block elements, box drawing, braille, sextants, dingbats, etc.)

### 3. TUI Frameworks + Modern Ecosystem
- [[tui-frameworks-complete]] — 18 frameworks across 7 languages with selection guide
- [[tui-modern-2026]] — 2024–26 verified versions, active maintainers (Charm v2, Ratatui no-std, Toad, Ghostty, Kitty drag-drop)
- [[tui-modern-gaps]] — 6 gaps filled: accessibility, mobile, WASM, analytics, keyboard standardization, AI-TUI patterns
- [[final-sweep]] — Open-access academic + practitioner blogs (Brandur Leach, Julia Evans) + niche tool catalog
- [[tui-patterns]] — Interaction patterns: modal/modeless, command palette, focus, animation, accessibility, testing

### 4. Internationalization
- [[tui-i18n]] — CJK width (TR11), BiDi (TR9), emoji ZWJ, complex scripts, wcwidth divergence, IMEs, font matrix
- [[unix-cli-principles]] — ESR's 17 rules + CLIG, output design, signal handling

### 5. ASCII / ANSI Art — Practitioner Layer
- [[ascii-ansi-art]] — BBS scene history, art groups (ACiD/iCE/Blocktronics), techniques
- [[ascii-tools]] — 21 tools (figlet, chafa, jp2a, asciinema, libcaca, etc.)
- [[ascii-rendering-algorithms]] — 8 image-to-ASCII algorithms with implementations
- [[banner-fonts]] — ~3,000 named fonts across 8 systems (FIGlet, TOIlet, TAAG, cowsay, ponysay, boxes, TheDraw, Moebius)
- [[artist-roster]] — 150+ named practitioners chronologically (1989–2026)
- [[archives-deep]] — 26+ digital archives indexed beyond the obvious three
- [[pre-1995-archives]] — Pre-organized era (1985–89), warez group lineage, hacker zines

### 6. Historical TUI Lineage
- [[tui-history]] — Generational arc RTTY → glass-TTY → curses era → ANSI/BBS → renaissance
- [[historical-tuis]] — 20 landmark TUIs (WordStar, VisiCalc, Norton Commander, Vim, Emacs, htop, lazygit, btop) with verdicts
- [[niche-text-traditions]] — 17 parallel streams (NAPLPS, RIPscrip, PRESTEL, Minitel, BTX, Captain, BBC Mode 7, MouseText, Plan 9 Rio)

### 7. Demoscene Context
- [[demoscene]] — Future Crew, Farbrausch, demoparties, size-coding, tracker lineage, UNESCO ICH
- [[demoparty-results]] — Year-by-year ANSI/ASCII compo results at 11 major parties (~25% exhaustive — acknowledged)
- [[regional-scenes-diskmags]] — Eastern European scenes (Polish/Hungarian/Russian) + Hugi/Imphobia/PAiN diskmags

### 8. Academic + Museum Layer
- [[tui-academic]] — Markku Reunanen (Aalto/Turku), Daniel Botz (LMU), Lassi Tasajärvi, UNESCO, "Terminal Is All You Need" (arXiv)
- [[academic-extended]] — MIT/CMU/Stanford/UCSC/ProQuest/JSTOR/IEEE survey with access-barrier notes
- [[museums-oral-history]] — CHM catalog (Bill Joy, Knuth, Kernighan oral histories with #s), YUCoM, Bletchley, Smithsonian, Bitsavers

### 9. Meta-Documentation
- [[knowledge-bounds]] — What canon knows / doesn't / cannot. Confidence-level table.
- [[practitioner-network]] — Verified-active 2024–26 contacts; phased outreach plan

---

## By Task — "I want to…"

### Build a TUI
1. Start: [[tui-frameworks-complete]] (pick framework) → [[tui-design]] (architecture)
2. Pattern: [[tui-patterns]] (interactions) → [[unix-cli-principles]] (CLI conventions)
3. Render: [[ascii-composition]] (data → terminal HTML) → [[terminal-capabilities]] (protocol)
4. Test: [[tui-patterns]] §Testing Methodology
5. i18n: [[tui-i18n]]

### Render data / build a chart
1. [[ascii-composition]] — algorithm for each intent
2. [[unicode-art-extended]] — glyph vocabulary
3. [[ascii-rendering-algorithms]] — when you need image→ASCII

### Draw / generate a banner
1. [[banner-fonts]] — pick a font + system
2. [[ascii-tools]] §FIGlet / TOIlet — tool usage
3. [[unicode-art-extended]] — fallback to manual Unicode

### Display an image in terminal
1. [[ascii-tools]] §Image → terminal (chafa, viu, timg)
2. [[terminal-capabilities]] §Graphics protocols (Sixel/Kitty/iTerm2)
3. [[ascii-rendering-algorithms]] if implementing your own

### Pick a terminal emulator
1. [[tui-modern-2026]] §Terminal emulators
2. [[terminal-capabilities]] §Terminal support matrix

### Find an exact escape code
1. [[escape-codes-complete]] (exhaustive)
2. [[terminal-capabilities]] (common subset)

### Understand ANSI art history
1. [[ascii-ansi-art]] — narrative
2. [[artist-roster]] — named individuals
3. [[archives-deep]] — where to find more
4. [[pre-1995-archives]] — pre-organized era
5. [[regional-scenes-diskmags]] — Eastern European parallel
6. [[demoscene]] — demoscene context
7. [[demoparty-results]] — compo results

### Cite an academic source
1. [[tui-academic]] (primary)
2. [[academic-extended]] (database survey + access barriers)
3. [[museums-oral-history]] (oral histories with catalog numbers)
4. [[knowledge-bounds]] (confidence levels)

### Reach a living practitioner
1. [[practitioner-network]] (verified 2024–26 contact paths)
2. [[knowledge-bounds]] §What direct outreach would close

### Understand a niche tradition
1. [[niche-text-traditions]] — NAPLPS/RIPscrip/Videotex/MSX/Plan 9/etc.
2. [[ascii-ansi-art]] — mainline tradition
3. [[regional-scenes-diskmags]] — Eastern European

### Audit canon completeness
1. [[knowledge-bounds]] — explicit confidence table
2. [[final-sweep]] §Acknowledged gaps after this final sweep

---

## By Wave — Provenance

### Wave 1 (commit `5cef468`) — Foundation
The first comprehensive pass. Established the canon shape.
- [[ascii-tools]]
- [[unicode-art-extended]]
- [[terminal-capabilities]]
- [[tui-frameworks-complete]]
- [[ascii-ansi-art]]
- [[ascii-rendering-algorithms]]
- [[tui-history]]

### Wave 2 (commit `97a9035`) — Patterns + culture
- [[tui-patterns]]
- [[tui-i18n]]
- [[demoscene]]
- [[historical-tuis]]

### Wave 3 (commit `8267dd1`) — Academic + niche
- [[tui-academic]]
- [[archives-deep]]
- [[museums-oral-history]]
- [[tui-modern-2026]]
- [[niche-text-traditions]]

### Wave 4 (commit `e9cdbc0`) — Gaps + meta
- [[tui-modern-gaps]]
- [[academic-extended]]
- [[practitioner-network]]
- [[knowledge-bounds]] ← meta-document explicitly acknowledging asymptotic limits

### Wave 5 (commit `a91e1a3`) — Concrete enumeration
- [[demoparty-results]]
- [[escape-codes-complete]]
- [[banner-fonts]]
- [[artist-roster]]

### Wave 6 (commit `8332fbe`) — Open-access final sweep
- [[regional-scenes-diskmags]]
- [[pre-1995-archives]]
- [[final-sweep]]

### Pre-existing (in canon at session start)
- [[tui-design]]
- [[unix-cli-principles]]
- [[ascii-composition]]

### This index (commit final)
- INDEX.md (this file)

---

## Confidence + Coverage Snapshot

| Domain | Files | Confidence |
|--------|-------|-----------|
| Terminal protocol | [[terminal-capabilities]] + [[escape-codes-complete]] | **High** |
| Unicode vocabulary | [[unicode-art-extended]] | **High** |
| Modern frameworks (2024–26) | [[tui-frameworks-complete]] + [[tui-modern-2026]] + [[tui-modern-gaps]] + [[final-sweep]] | **High** |
| Historical TUI lineage | [[tui-history]] + [[historical-tuis]] | **High** |
| Mainline ANSI art history | [[ascii-ansi-art]] + [[archives-deep]] + [[artist-roster]] | **High** |
| Demoscene academic narrative | [[demoscene]] + [[tui-academic]] | **High** |
| Niche text traditions | [[niche-text-traditions]] | **High** |
| Banner fonts + tools | [[banner-fonts]] + [[ascii-tools]] | **High** |
| Rendering algorithms | [[ascii-rendering-algorithms]] | **High** |
| Interaction patterns | [[tui-patterns]] | **High** |
| i18n | [[tui-i18n]] | **High** |
| CLI principles | [[unix-cli-principles]] | **High** |
| Pre-1989 BBS art | [[pre-1995-archives]] | **Medium** (much lost to time) |
| Demoparty year-by-year results | [[demoparty-results]] | **Medium** (~25% exhaustive; needs Demozoo API) |
| Regional Eastern European scenes | [[regional-scenes-diskmags]] | **Medium** (native-language unreachable) |
| Modern practitioner intent | [[museums-oral-history]] + [[practitioner-network]] | **Medium** (needs direct outreach) |
| Internal framework rationale | (mentioned in [[tui-modern-2026]]) | **Low** (blog posts only) |
| Pre-2024 paywalled HCI papers | [[academic-extended]] §gaps | **Low** (ProQuest/JSTOR institutional needed) |

**Aggregate saturation estimate:** ~92–95% web-accessible 2024–26 TUI/ASCII/demoscene knowledge.

See [[knowledge-bounds]] for the full confidence table + epistemic-limits analysis.

---

## How to Extend the Canon

When new knowledge surfaces:

1. **New framework release** → update [[tui-modern-2026]] with version + date + behavior change
2. **New academic paper** → add to [[tui-academic]] or [[academic-extended]] with full citation
3. **New archive source** → add to [[archives-deep]] with URL + content description
4. **New practitioner interview** → add to [[museums-oral-history]] with quote + citation
5. **Filled gap** → edit [[knowledge-bounds]] to remove the entry
6. **New niche tradition** → add to [[niche-text-traditions]]
7. **New scene magazine** → add to [[regional-scenes-diskmags]]
8. **New artist active 2025+** → add to [[artist-roster]]
9. **New escape code** → add to [[escape-codes-complete]]
10. **New font/tool** → add to [[banner-fonts]] / [[ascii-tools]]

The canon is **append-only with corrections.** Don't delete documented knowledge; correct inline with notes on what changed.

---

## Final Statement

This canon represents what 6 progressive waves of systematic archival web research can produce for the 369 design system. It is comprehensive across every dimension web-accessible:

- **Conceptual:** rules, design philosophy, BASE/PILLARS/ROOF
- **Technical:** complete terminal protocol, escape codes, frameworks, Unicode
- **Cultural:** BBS scene, demoscene, regional scenes, academic legitimacy, museum collections
- **Historical:** RTTY → modern; pre-organized era; landmark TUIs; warez/hacker zine lineage
- **Practical:** tools, fonts, algorithms, patterns
- **Niche:** 17 parallel traditions; Eastern European diskmags
- **Modern:** 2024–26 ecosystem; six gaps filled; final sweep
- **Enumerative:** demoparty results; 150+ artists; ~3,000 fonts; exhaustive escape codes
- **Meta:** knowledge bounds + practitioner-outreach map

Absolute "100% complete" is by definition unachievable for any living knowledge domain. [[knowledge-bounds]] documents this explicitly. The 5–8% remaining gap requires capabilities (ACM institutional access, corporate internal docs, direct practitioner outreach, native-language regional sources) that are outside the bounds of archival web research.

The canon **is sufficient for 369 design-system use** — every claim cites a primary source, every gap is named.

---

## See Also

The complete list of canon files is at the top of this index. SKILL.md (parent directory) contains the routing logic that triggers canon-file loading on demand.
