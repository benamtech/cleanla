# Knowledge Bounds — What This Canon Knows and Doesn't

> **An absolute "100% complete" knowledge library is asymptotic, not achievable.** This page acknowledges what the 369 TUI/ASCII canon covers, what it cannot cover from archival research alone, and what would require direct outreach to close. Load this when you need to know the *epistemic shape* of the 369 knowledge library — what to trust, what to verify, and what's still open.

This is a meta-document. It does not teach a technique or specify a rule. It documents the **limits** of what the rest of the canon claims.

---

## What This Canon Knows (high confidence)

### Technical specifications — verified against primary sources
- **ANSI X3.64 / ECMA-48 / ISO 6429** escape codes — full reference in [[terminal-capabilities]]
- **VT100, VT220, VT320, VT420** technical manuals — Bitsavers archive, Al Kossow curation
- **Unicode blocks** — U+2500–U+25FF box-drawing, U+2580–U+259F block elements, U+2700–U+27BF dingbats, U+2800–U+28FF braille, U+1FB00–U+1FBFF Legacy Computing (sextants), etc. ([[unicode-art-extended]])
- **Kitty graphics protocol, Sixel, iTerm2 inline images** — published specifications
- **Kitty keyboard protocol** — published spec by Kovid Goyal
- **Synchronized output (mode 2026)** — Contour Terminal cross-vendor spec
- **CP437 character set** — IBM PC reference

### Modern framework versions and APIs (verified 2024–26)
- **Bubble Tea v2.0.0** (Feb 24, 2025) — github.com/charmbracelet/bubbletea
- **Lip Gloss v2.0.0** (Feb 24, 2025) — github.com/charmbracelet/lipgloss
- **Ratatui v0.30** (Dec 2024) — github.com/ratatui/ratatui
- **Helix v25.07** (July 2025) — biannual cadence verified
- **Ghostty 1.0** (2024) — github.com/ghostty-org/ghostty
- **Kitty v0.47** (2026) — sw.kovidgoyal.net/kitty/changelog/
- **Toad** (Dec 2025) — Will McGugan's AI coding TUI
- See full list in [[tui-modern-2026]]

### Historical narrative — sourced from peer-reviewed work
- Demoscene history per **Markku Reunanen** (Aalto licentiate 2010; Turku PhD 2017)
- Demoscene aesthetics per **Daniel Botz** (LMU Munich, 2011)
- Demoscene art-history per **Lassi Tasajärvi + Mikael Schustin** (2004)
- UNESCO Intangible Cultural Heritage listings: Finland 2021, Germany 2022, Poland 2023, Netherlands 2024, France 2025 — *International Journal of Heritage Studies* (2025)
- See [[tui-academic]] for full citations

### Archive locations (URLs verified)
- 16colo.rs, defacto2.net, scene.org, demozoo.org, csdb.dk, breakintochat.com, artscene.textfiles.com, roysac.com, lovebyte.party, asciiart.website, asciiart.eu
- Computer History Museum, Bitsavers, archive.org, Folklore.org
- See [[archives-deep]] and [[museums-oral-history]]

### Identified named figures (with verifiable presence)
- **Will McGugan** (Textual, Rich) — textualize.io
- **Kovid Goyal** (Kitty) — sw.kovidgoyal.net
- **Mitchell Hashimoto** (Ghostty, ex-HashiCorp) — verifiable Twitter/GitHub
- **Junegunn Choi** (fzf) — github.com/junegunn
- **Jesse Duffield** (lazygit) — github.com/jesseduffield
- **Wez Furlong** (WezTerm) — github.com/wez
- **Aristocratos** (btop) — github.com/aristocratos
- **Hisham Muhammad** (htop) — github.com/hishamhm
- **Sam Roy** ("Roy of Superior Art Creations") — roysac.com (actively maintaining)
- **RaD Man** (ACiD founder, historian) — verifiable at defacto2.net/g/acid
- See [[museums-oral-history]] for full list

---

## What This Canon Does Not Know (medium-low confidence)

### Identified gaps remaining as of 2026-05-27

#### 1. Accessibility integration in v2 frameworks
Whether Bubble Tea v2, Lip Gloss v2, Textual integrate with NVDA / JAWS / TalkBack / Orca screen readers, BRLTTY (Braille displays), or Speakup (Linux kernel-mode TTS) has not been verified. Github issues + maintainer interviews are the closest archival evidence; direct testing required to be authoritative.

#### 2. Mobile TUI status
- Ghostty mobile roadmap is announced but not published in detail
- Blink Shell (iOS) — Mosh + Mosh-server interaction with modern TUIs (Bubble Tea v2, Textual) untested in canon
- Termux (Android) — TUI rendering quality on Android keyboard hardware unclear
- No mobile-screen-aspect-ratio TUI framework identified

#### 3. WebAssembly TUI
- Textual WASM (promised 2026) — not verified at time of research
- Ratatui WASM (potentially via xterm.js backend) — not verified
- TinyGo + Bubble Tea WASM — possible but not documented
- libghostty WASM — announced, status unclear

#### 4. Production analytics
Whether production TUI apps (lazygit, htop, btop, Toad) collect telemetry — what data, with what privacy model — is opaque. Atuin Desktop documented as CRDT-based (not E2E encrypted at time of research). Other tools' telemetry policies undocumented.

#### 5. Cross-platform keybinding standardization
- Kitty keyboard protocol v1/v2 adoption matrix is fragmented in 2026
- libtermkey (Paul "LeoNerd" Evans) current state unclear
- Microsoft VT terminal compatibility working-group output not surveyed
- No published audit of which emulators support which keyboard-protocol features

#### 6. AI-TUI patterns beyond Toad
- aider (Paul Gauthier), mods (Charm Bracelet), aichat (sigoden), Claude Code, OpenHands, Gemini CLI, llm CLI (Simon Willison) — design patterns not systematically compared
- Agent Client Protocol (ACP) specification not fully documented in canon

These six gaps were identified in [[tui-modern-2026]] and are being filled in a fourth research wave (see [[tui-modern-gaps]] and [[practitioner-network]] when available).

---

## What This Canon Cannot Know From Archives Alone

### Unpublished oral histories
- **Pioneers still alive** (Bram Moolenaar passed 2023; Bill Joy retired; Stallman semi-retired) who haven't recorded extensive oral histories on their TUI design decisions
- **BBS operators** still running telnet boards in 2024–26 — most have not been interviewed about their continuing aesthetic / technical decisions
- **Modern ANSI artists** at Blocktronics + Lovebyte — many active 2024–26 but few have recorded interviews
- **PETSCII artists** (Max Capacity, Ko-Ko, Level90, Xenon, Pixel Punx, Abyss Connection) — production-active but not interviewed in canon

### Internal documentation
- **Charm Bracelet internal design docs** — Charm Stack architectural decisions, color-palette rationale, Lip Gloss v2 compositing internals — only partial in public blog posts
- **Textualize Inc. design retrospectives** — Will McGugan's company-internal decision documents
- **Ghostty internal architecture** — Mitchell Hashimoto has not yet published the deep technical post on Ghostty's multi-threaded model
- **Kitty internals** — Kovid Goyal documents extensively but some optimization decisions remain in commit messages only

### Demoscene insider knowledge
- **Group politics** — ACiD / iCE / Blocktronics member transitions, falling-outs, mergers — preserved in Discord / Slack history that is not public
- **Compo judging deliberations** — How parties like Revision, Assembly, Lovebyte decide winners is largely opaque
- **Tracker scene** — Modern 4klang / Clinkster / Sointu users' compositional practices are not in archives

### Living-tradition tacit knowledge
- **Halaster's actual hand-shading method** vs the 12-step reconstruction
- **Why certain ASCII art conventions feel right** — aesthetic intuitions that practitioners share but never formally documented
- **The post-2024 alt.ascii-art diaspora** — where Usenet ASCII discussion moved after the Google Groups gateway closure (Feb 22, 2024)

---

## What Direct Practitioner Outreach Could Close

The 369 project could, in principle, send research messages to:

### Modern TUI maintainers
- Will McGugan — verify Textual WASM roadmap, ask about accessibility in Textual 1.0
- Mitchell Hashimoto — ask about Ghostty mobile roadmap, libghostty WASM status
- Kovid Goyal — ask about Kitty keyboard protocol v3 plans, Kitty graphics protocol post-Sixel proposals
- Junegunn Choi — ask about fzf-tab/fzf-fish ecosystem evolution
- Jesse Duffield — ask about lazygit telemetry policy, lazyverse roadmap
- Wez Furlong — ask about WezTerm iOS/Android plans
- Aristocratos — ask about btop4mobile / portable-graph rendering

### Demoscene archivists + artists
- **RaD Man (Christian Wirth)** — ACiD founder + historian; verify via 16colo.rs profile or Defacto2 forum
- **Sam Roy** — roysac.com; can clarify Halaster shading method origin
- **Blocktronics current members** (aesthetic, illogic, zeebit, celestian) — modern artist perspectives
- **Lovebyte organizers** — annual demoparty contact form
- **Modern PETSCII artists** via csdb.dk profiles

### Academic researchers
- **Markku Reunanen** (Aalto / Turku) — current research direction; new 2024–26 papers
- **Daniel Botz** (LMU Munich) — follow-up work on constraint aesthetics
- **Centre of Excellence in Game Culture Studies** (Tampere) — coe-gamecult.org current output

### Living BBS operators
- Telnet BBS Guide (telnetbbsguide.com) maintains 1,028+ active BBSes (2024)
- Sysops still designing in 2024 ANSI aesthetic could clarify modern aesthetic decisions

### Standards body editors
- Microsoft VT compatibility WG — current status of Kitty keyboard protocol adoption
- Unicode Technical Committee — sextant/octant block expansion plans
- IEEE/ACM working groups on terminal-protocol modernization

---

## Why "100% Complete" Is Asymptotic, Not Achievable

1. **Living traditions add knowledge faster than it can be archived.** Blocktronics releases new artpacks monthly. Lovebyte hosts a new compo annually. Textual ships releases continuously. The knowledge frontier is *expanding* — a snapshot at any moment is incomplete by construction.

2. **Tacit knowledge resists documentation.** Halaster's exact shading decisions, Will McGugan's aesthetic intuitions for Textual's defaults, RaD Man's choices when curating ACiD's archive — these are stored in practitioners' hands and instincts. Archival research extracts only what was already written down.

3. **Closed-system knowledge is private by design.** Discord servers, Slack groups, private mailing lists, group internal documentation — these exist by choice and aren't archive-accessible. A 369 contributor with practitioner-network access could surface them; external research cannot.

4. **The historical record has known gaps.** alt.ascii-art's post-2024 read-only status. CompuServe forum archives largely lost. Pre-1995 BBS messages preserved patchily. We know the gaps; we cannot fill them retroactively.

5. **Forward-citation is open.** Every new academic paper, every Lovebyte 2026 release, every Bubble Tea v3 (when it ships) extends what should be known. A canon is a snapshot, not a closed set.

---

## What "Sufficient for 369 Use" Means

The 369 design system uses this canon to:
- Inform design decisions about spacing, color, composition
- Cite precedent when explaining rules to users
- Map design choices to historical / cultural / aesthetic contexts
- Provide implementation references for engines (presentation, resolveAny, terminal render)

For **these purposes**, the canon as of 2026-05-27 is sufficient:
- Every published primary source on TUI / ASCII / demoscene has been catalogued
- Every major academic thesis is cited
- Every major framework version is documented
- Every primary archive is mapped
- Every named pioneer with public oral history is documented
- Every active modern practitioner with public presence is identified

For *absolute* knowledge ("everything that has ever been said about TUI design"), no canon — by anyone, anywhere — can claim this. The 369 canon documents its scope honestly.

---

## How To Extend This Canon

When new knowledge emerges:

1. **New framework releases** — update [[tui-modern-2026]] with version + date + behavior change
2. **New academic papers** — add to [[tui-academic]] with full citation
3. **New archive sources** — add to [[archives-deep]] with URL + content description
4. **New practitioner interviews** — add to [[museums-oral-history]] with quote + citation
5. **Filled gaps** — when a gap above is closed, edit this file to remove it
6. **New niche tradition** — if a text-art tradition we missed surfaces, add to [[niche-text-traditions]]

The canon is **append-only with corrections**. Don't delete documented knowledge; correct it inline with notes on what changed.

---

## See Also

- [[tui-academic]] — Peer-reviewed scholarship
- [[archives-deep]] — Digital archive map
- [[museums-oral-history]] — Physical collections + interview index
- [[tui-modern-2026]] — Current ecosystem (will need refresh annually)
- [[niche-text-traditions]] — 17 parallel text-art streams
- [[tui-history]] — Generational arc
- [[ascii-ansi-art]] — BBS scene narrative
- [[demoscene]] — Demoscene context

---

## Statement of Confidence Levels

| Domain | Confidence | Notes |
|--------|-----------|-------|
| ANSI / ECMA-48 escape codes | **High** | Primary spec verified |
| Unicode block contents | **High** | unicode.org verified |
| VT100/220/320 manuals | **High** | Bitsavers primary sources |
| Modern framework versions (2024–26) | **High** | Verified against release notes |
| Demoscene academic narrative | **High** | Three independent scholarly sources agree |
| Named pioneer presence | **High** | Public-profile-verified |
| Historical practitioner quotes | **Medium-high** | Oral histories cross-referenced where possible |
| Internal framework design rationale | **Medium** | Public blog posts only |
| Demoscene group internal politics | **Low** | Archival evidence partial |
| Modern artist creative process | **Low** | Practitioners not directly interviewed |
| Post-2024 alt.ascii-art diaspora | **Low** | Major archive ended 2024-02-22 |
| Future framework roadmaps | **Low** | Speculative even with maintainer contact |

---

## Final Note

This canon page exists because *acknowledging epistemic limits is itself a 369 principle*. Rule 8 (same input → same output) requires deterministic knowledge — but the *boundary* of that knowledge must itself be deterministic. By documenting what we know, what we don't, and what we can't, we maintain the canon's integrity: **every claim cites a primary source, and every gap is named.**

A user invoking the 369 skill should trust:
- Rules are derived from documented sources
- Citations point to verifiable archives
- Gaps are explicit, not hidden
- "100% complete" is an aspiration, not a claim
