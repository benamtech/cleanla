# Niche Text-Mode Art Traditions — 17 Parallel Streams Beyond ANSI

> **ANSI / PETSCII / ATASCII are the popular three — but they aren't the whole story.** Bell Canada's NAPLPS, TeleGrafix's RIPscrip, British Telecom's PRESTEL, France's Minitel, West Germany's BTX, Japan's Captain, the BBC Micro's Mode 7, Apple's MouseText, the TRS-80 CoCo's SG-24 mode, MGR (pre-X11 graphics window system), Plan 9's Rio — each is a distinct text-mode art tradition with its own protocol, character set, and aesthetic. This page catalogs all 17 we've identified and what each contributes to the 369 design canon.

For ANSI/PETSCII/ATASCII directly, see [[ascii-ansi-art]]. For Unicode glyph vocabulary, see [[unicode-art-extended]]. For history broadly, see [[tui-history]].

---

## The 17 Traditions — Indexed

| # | Tradition | Years | Region / Origin | Protocol Type |
|---|-----------|-------|------------------|---------------|
| 1 | **NAPLPS / Telidon** | 1978–95 | Bell Canada / North America | Vector instructions over ASCII stream |
| 2 | **RIPscrip** | 1992–2005 | TeleGrafix, USA | Vector + text page description |
| 3 | **PRESTEL** | 1979–2014 | British Telecom, UK | Block-mosaic teletext-style |
| 4 | **Minitel** | 1980–2012 | France Télécom | 6-pixel block "mosaic mode" |
| 5 | **Bildschirmtext / BTX** | 1983–2001 | West German Bundespost | Videotex regional variant |
| 6 | **Captain** | 1984–2002 | NTT, Japan | Raster-as-protocol (kanji rendered, not encoded) |
| 7 | **TRS-80 CoCo semigraphics** | 1980–91 | Tandy, USA | 2×3 block subdivisions (SG-4, SG-6, SG-8, SG-12, SG-24) |
| 8 | **ZX Spectrum / ZX81** | 1981–95 | Sinclair, UK | 2×2 block char set (0x80–0x8F) |
| 9 | **BBC Micro Mode 7** | 1982–98 | Acorn, UK | SAA 5050 teletext chip; 1 KB graphics buffer |
| 10 | **Apple II MouseText** | 1983–95 | Apple, USA | 32 graphical chars (Tognazzini design) |
| 11 | **Commodore PET** | 1977–82 | Commodore, USA | First production graphical char set; parent of PETSCII |
| 12 | **MSX semigraphics** | 1983–2005 | ASCII Corp / Microsoft Japan | Regional char-set fragmentation |
| 13 | **Oric-1 / Atmos** | 1983–86 | Tangerine, UK + France | Serial-attribute inline styling; PCG |
| 14 | **Sharp X1 / MZ** | 1982–91 | Sharp, Japan | Programmable Character Generator (PCG) |
| 15 | **Sinclair QL** | 1984–94 | Sinclair, UK | **Bitmap-first** (rejected character mode) |
| 16 | **MGR Window System** | 1984–2000+ | Bellcore (Stephen A. Uhler), USA | Pre-X11 unified text+graphics window |
| 17 | **Plan 9 Rio (8½)** | 1989–2020+ | Bell Labs (Pike, Thompson, Presotto) | Everything-is-a-file; orthogonal streams |

---

## Videotex Networks (5 traditions)

### 1. NAPLPS — North American Presentation Level Protocol Syntax
**Years:** 1978–95
**Standard:** CSA T500-1983 + ANSI X3.110-1983
**Architecture:** Vector graphics encoded as ASCII characters → terminal interprets at display

**Technical specifics:**
- Coordinates encoded in 6-bit strings in printable ASCII range
- **Dynamically Redefinable Character Sets (DRCS)** — terminal could be reprogrammed by stream
- Geometric primitives: lines, circles, polygons, filled regions
- Color: 8-bit palette indexes

**Deployments:**
- Bell Canada Telidon project (1978–94)
- Vista — $10M government-Bell Canada deal (1979, **abandoned 1983**)
- Bell Canada's **Alex** dial-up service (1988–94)
- Prodigy BBS adopted NAPLPS for its graphical online service (1990s)
- ~50+ North American videotex trial deployments (1978–89)

**Named figures:** Herb Bown (Communications Research Centre Canada lead)

**Preservation:** Internet Archive holds CSA T500-1983 standard; limited artwork archives. UVic Library subject index has the deepest collection.

**369 lesson:** **Vector-as-text-protocol is a parallel design choice to ANSI's bitmap-character approach.** Both valid. NAPLPS proved character streams could encode 2D graphics without bitmap character sets. Influenced later RIPscrip and modern SVG-over-text thinking.

### 2. RIPscrip — Remote Imaging Protocol Script
**Years:** 1992–2005
**Creator:** TeleGrafix Communications (Huntington Beach, CA) — Jeff Reeder, Jim Bergman, Mark Hayton
**Hardware:** MS-DOS BBSes; 640×350 EGA graphics mode (16 colors)
**Protocol:** ASCII descriptions of vector graphics; similar to PostScript/HPGL as a page description language

**Tools:**
- **RIPterm** — terminal emulator
- **RIPaint** — graphics editor
- **RIPtek** — viewer
- **RIPtermJS** (2024 GitHub revival): github.com/cgorringe/RIPtermJS

**BBS support:**
- ~200+ RIP-enabled BBSes
- Primary support in RemoteAccess + PCBoard (with RIP module)
- **Serion BBS** — RIP-enabled server still running 2024

**Protocol evolution:**
- RIPscrip 1.5x — most common in production
- 2.0 / 3.0 — planned but unfulfilled

**369 lesson:** **Split-screen graphics+text paradigm** — graphics in viewport, text input in separate pane. First widespread DOS BBS graphics standard. Mouse interaction *pioneered on bulletin board systems*. Architecturally comparable to ANSI escape sequences + box-drawing chars: a dual-layer rendering model.

### 3. PRESTEL — British Telecom Videotex
**Years:** 1979–2014
**Hardware:** TV sets with keypads + dedicated terminals
**Display:** 40×24 character matrix; 6 colors + 6 grey shades

**Coverage:**
- Launched **September 11, 1979** — UK's first public online service
- Peak ~95,500 terminals (1985)
- 450+ technical support forums by early 1990s
- Prestel Gateway (1982) linked external computers
- Documented home banking, online shopping, telesoftware delivery
- **Discontinued** when BT sold assets

**Notable art:**
- 1980s artist workshop (Geoff Davis + others)
- Dithering experiments + halftoning to simulate 18-color palette
- **First documented systematic exploration of subcharacter-level shading on constrained palette**

**Preservation:**
- aldricharchive.co.uk/videotex — Michael Aldrich Archive
- archive.org/details/Welcome-to-Prestel-Gateway
- BT archives at archivesit.org.uk/bt/

**369 lesson:** PRESTEL's dithering predates modern Unicode block art. Character-level constraints drove invention of compositional color techniques — the same techniques now core to 369's shading layer.

### 4. Minitel — French Videotex
**Years:** 1980–2012 (June 30, 2012 shutdown)
**Hardware:** Dedicated monochrome terminal (25 lines × 40 columns); **distributed free** to all French households via France Télécom

**Display:** 6-pixel block graphics ("mosaic mode") — similar to PETSCII inverse-video principle

**Cultural footprint:**
- Pilot July 1980 (Saint-Malo)
- 32-year national infrastructure — longest-lived videotex
- ~25 million terminals at peak
- Art Accès magazine (1984–87, founded by **ORLAN + Frédéric Develay**)
- Centre Pompidou exhibition "Les Immatériaux" (1985)

**Preservation:**
- BnF (Bibliothèque Nationale de France) archives
- minitel.fr community site
- goto10.fr (last refresh June 2024)
- forum.museeminitel.fr — Musée du Minitel
- GitHub Videotex Pages Repository: github.com/XReyRobert/VideotexPagesRepository

**Modern artists:**
- ORLAN — performance artist who created Minitel-based works
- Frédéric Develay — Art Accès co-founder
- Academic revival projects (Auxerre students, 2019–2020)

**369 lesson:** Minitel's longevity + artistic legitimacy (museum exhibitions) demonstrate that text-art is **sustainable as a major medium when institutionally backed**. Cultural validation lesson for 369: character art deserves institutional recognition beyond nostalgia.

### 5. Bildschirmtext / BTX — West German Videotex
**Years:** 1983–2001
**Operator:** West German Bundespost → Deutsche Telekom → T-Online (succession)
**Hardware:** TV sets with adapters; Commodore 64 decoder cartridge (1986); dedicated terminals

**Coverage:**
- Launched September 1, 1983 (IFA Berlin)
- ~2 million terminals by 1990s

**Character set:** Videotex block mosaic — West German standard variant

**Preservation:**
- Commodore Museum (decoder cartridge artifacts)
- artsandculture.google.com/story/bildschirmtext (Google Arts + Museum für Kommunikation Nürnberg)
- Limited online archive

**369 lesson:** **BTX → T-Online transition shows institutional text-art rarely survives corporate consolidation.** 369 must design for platform independence to avoid proprietary lock-in.

---

## Japanese Systems (2)

### 6. Captain — Japanese Videotex (NTT)
**Years:** 1984–2002
**Operator:** NTT
**Subscribers:** ~2 million by 1995

**Architecture — the radical innovation:**
**No traditional character set.** Kanji (3,500+ characters) transmitted as **pre-rendered dot patterns** (facsimile-like encoding). Data Syntax 1 (ISO standard) supported JIS X 0201 + JIS X 0208 + fallback for Arabic + Korean Hangul.

**369 lesson:** **Captain proves character art ≠ character set limitation.** When character sets fail (CJK explosion problem), systems transmit rasters. 369's Unicode approach sidesteps this, but Captain's pragmatism is instructive: **fall back to images when text fails.** This is exactly the modern Sixel/Kitty graphics protocol approach.

### 7. Sharp X1 / Sharp MZ Series
**Years:** 1982–91
**Hardware:** Zilog Z80 CPU
**Character set:** Programmable Character Generator (PCG); 4-bit color; Japanese Kanji support (MZ-700+)
**Installed base:** ~500,000 X1 / MZ units (Japan)

**Design philosophy:** **The character set IS the graphics API.** X1's PCG model: characters *define* graphics; the graphics layer reuses character-rendering hardware. Inverse of the ANSI model (where codes *control* pre-set characters).

**Influence:** NES / SNES tile-based architecture descends from this approach.

**369 lesson:** Two architectural inverses coexist:
- **Character redefinition** (X1, NES, SNES) — characters are graphics primitives
- **Code-driven character mode** (ANSI, CP437) — codes manipulate fixed characters

369 should support both paradigms as optional extensions.

---

## Home Computer Semigraphics (6)

### 8. TRS-80 Color Computer (Tandy CoCo)
**Years:** 1980–91
**Hardware:** Motorola 6809; 6847 video chip; 40/80 character resolution
**Installed base:** ~400,000 CoCo (US/Canada)

**Semigraphics modes:**
- **SG-4** — 9 colors, 64×32 res
- **SG-6** — 6 colors (proposed)
- **SG-8 / SG-12 / SG-24** — virtual modes using SAM timing tricks

**Character set:** 2×3 pixel block subdivisions per character cell

**Innovation:** SG-24 mode used only **6 KB RAM** but achieved 4× resolution through SAM timing tricks. Pioneered sub-character precision on 8-bit hardware.

**369 lesson:** CoCo's SG-4 mode shows **color + granular positioning coexist in character grid**. ANSI's half-block technique borrowed this principle. Template for hybrid text/graphics in constrained memory.

### 9. ZX Spectrum / ZX81 (Sinclair)
**Years:** 1981–95
**Hardware:** Zilog Z80; 8×8 character matrix; 16-color mode (Spectrum 128K)
**Installed base:** ~5 million Spectrum sold (peak 1982–87); UK market dominance

**Character set:** 2×2 block graphics (unique encoding, 0x80–0x8F mapping)

**Demoscene:** Active Z80 demoscene (1985–present); 10,000+ releases
**Preservation:** World of Spectrum (WoS); ZXDB; Demozoo (3,000+ Spectrum entries)

**369 lesson:** Spectrum's character set is **different from CP437**. Regional fragmentation. 369's Unicode approach consolidates this — but the historical lesson: **support legacy codepage fallback for emulation/preservation contexts**.

### 10. BBC Micro / Master — Mode 7 (Acorn)
**Years:** 1982–98
**Hardware:** 6502 CPU; SAA 5050 teletext chip; 40×25 text-only mode
**Display:** Teletext-compatible; inline color control codes embedded in character stream
**Installed base:** ~1 million BBC Micros (UK educational standard)

**Mode 7 innovation:** **1 KB video RAM total.** Revolutionary memory efficiency: full screen in 1 KB.

**Notable art:** Teletext Elite (BBC Micro port of Elite, the seminal space game). GitHub: github.com/markmoxon/teletext-elite

**Preservation:** Stardot.org forum; BBCSoft archives.

**369 lesson:** Mode 7's **"control-code-as-character"** model embeds styling inline (CSI-style codes as actual character cells, not out-of-band escape sequences). Directly parallels ANSI CSI but choosing inline rather than out-of-band. **Lesson: protocol-design trade-off** — inline = character-based parsing; out-of-band = stream-based.

### 11. Apple II / Apple IIc — MouseText
**Years:** 1983–95
**Hardware:** 6502; 80-column card (Apple IIc); ROM upgrades (Apple IIe Enhanced, 1985)
**Designer:** **Bruce Tognazzini** (1984)
**MouseText:** 32 graphical characters; 8×8 grid; box-drawing compatible with Macintosh UI

**Innovation:** **8× speed increase** for mouse-driven TUI vs bitmap graphics. Bridged GUI/TUI performance gap; influenced HyperCard design.

**Modern legacy:** Unicode 13.0+ added MouseText to **Symbols for Legacy Computing** block (codepoints around U+1FB94). See [[unicode-art-extended]].

**369 lesson:** **GUI-parity via character art.** MouseText proved text mode could achieve Macintosh-grade interface speed. Institutional backing (Apple, now Unicode Consortium) accelerated canonicalization.

### 12. Commodore PET (Pre-PETSCII)
**Years:** 1977–82
**Designers:** Chuck Peddle + Leonard Tramiel
**Hardware:** MOS 6502; 40-character display
**Installed base:** ~700,000 units

**The first production graphical character set.** 64 block/line characters at codepoints 0xA0–0xDF. Intentional graphics focus — no separate bitmap mode.

**Design philosophy:** Character sets can *contain* graphics, not merely text. Parent concept of PETSCII.

**369 lesson:** PET's decision to include graphics in the character set (not as escape codes) shaped PETSCII philosophy. **369's layered approach** (base Unicode + semantic codes) continues this tradition: characters first, codes second.

### 13. Oric-1 / Oric Atmos (Tangerine)
**Years:** 1983–86
**Hardware:** MOS 6502; 28×40 character matrix; teletext-influenced design
**Installed base:** ~160,000 Oric-1 (UK), ~50,000 (France)

**Innovations:**
- **Programmable Character Generator (PCG)** — define glyphs at runtime
- **Serial attribute** inline styling — color control codes embedded per character cell (teletext-like)
- LORES — text + redefinable graphics
- HIRES — 200×240 pixels + 3-line text footer

**369 lesson:** Oric's inline-vs-out-of-band attribute choice illustrates **protocol design trade-off**. Inline = character-based parsing (BBC Mode 7, Oric); out-of-band = stream-based (ANSI). 369 documents both paradigms.

---

## MSX Cross-Platform Standard (1)

### 14. MSX (Multi-System eXtension)
**Years:** 1983–2005
**Hardware:** Zilog Z80; regional variants (Japan, Europe, North America)
**Installed base:** ~9 million units (Japan dominant)

**Character set fragmentation:**
- German DIN
- International
- Japanese Kanji ROM (Shift JIS)
- MSX-Kanji ROM support (MSX2+, TurboR) for double-byte kanji
- Block characters + 60 "sextant" characters (Unicode legacy)

**Preservation:** msx.org community; MSX Computer Magazine archives.

**369 lesson:** MSX's **regional character-set fragmentation** (European machines show garbage for Japanese software) is **cautionary**. Lesson: single-encoding-layer (Unicode) beats multi-encoding fallback chains. 369's Unicode-first approach learned from MSX's pain.

---

## The Niche Counterpoint (1)

### 15. Sinclair QL — Bitmap-First Philosophy
**Years:** 1984–94
**Hardware:** Motorola 68008; **bitmap-only graphics — no character mode**
**Installed base:** ~100,000 units (modest, UK/Europe)

**Display modes:**
- 256×256 (8 RGB colors)
- 512×256 (4 colors: RGBW)

**Design philosophy:** Sir Clive Sinclair **deliberately rejected** gaming and character mode. Text was slow (bitmap-rendered).

**Prescient:** Later systems moved to bitmap terminals (xterm, modern GUI).

**369 lesson:** QL's rejection of character mode is a **philosophical rejection of 369's premise**. Important counterpoint: **character art is optimization, not necessity.** 369 should frame itself as "efficient alternative," not "only way." A 369 TUI is a choice; the QL proves the choice isn't forced.

---

## Research Systems (2)

### 16. MGR Window System (Pre-X11)
**Years:** 1984–2000+
**Creator:** **Stephen A. Uhler** (Bellcore, 1984)
**Hardware:** Sun 2/120 (original); later Macintosh, Atari ST, Linux, BSD

**Architecture:**
- **Text terminal AND graphics in single window**
- Network transparent
- Predates X11 standardization

**Preservation:** hack.org/~mc/mgr/ (active site)

**369 lesson:** MGR's unified text+graphics window model **40 years prior to modern terminal graphics protocols** (Sixel, iTerm2, Kitty). MGR proved text and graphics could coexist in single window system before X11 standardized. **Modern terminal image protocols implement MGR's principle 40 years later.**

### 17. Plan 9 — Rio Window System
**Years:** 1989–2020+
**Creators:** **Rob Pike, Ken Thompson, Dave Presotto** (Bell Labs)
**Architecture:** Everything-is-a-file paradigm; mouse, cons (console), bitblt as pseudo-files

**Design philosophy:** Programs don't know if they're talking to real hardware or a window manager (abstraction layer). The mouse, console, framebuffer are all just file paths in a namespace.

**Window system evolution:** 8½ (original) → Rio (Plan 9 from User Space)
- **Concurrent, not event-driven** — separate processes per window
- **Composition-over-inheritance** via file interface
- Influenced **Go's concurrency model** + modern microservices architecture

**Preservation:**
- 9p.io documentation
- Plan 9 from Bell Labs repo
- Go language descendant
- Rio Lecture by Rob Pike — herpolhode.com/rob/lec5.pdf
- Plan 9 USENIX (1995) — usenix.org/legacy/publications/compsystems/1995/sum_pike.pdf

**369 lesson:** Rio's philosophy — **text I/O + graphics I/O as orthogonal streams** — directly applicable to 369 protocol design. **Separate concerns (text, graphics, input) as independent layers**, not monolithic terminal state. Plan 9's elegance proves this works.

---

## Synthesis — Architectural Patterns

### 1. Vector vs Bitmap Encoding
- **Vector text-protocol:** NAPLPS, RIPscrip — instructions encoded as ASCII; terminal interprets
- **Bitmap-character:** ANSI, CP437 — pre-set characters selected and positioned
- **Both valid.** 369 supports both via the engines layer (presentation() for ANSI; reasonable extension paths for vector).

### 2. Inline vs Out-of-Band Control
- **Inline (per-character attribute):** BBC Mode 7, Oric, teletext
- **Out-of-band (escape sequence):** ANSI, modern terminals
- No universal winner; context determines.

### 3. Character Set as Graphics Canvas
- **Character is graphics:** PET, X1 (PCG) — char redefinition for everything
- **Character + code = graphics:** ANSI, CP437 — codes control characters
- MSX shows **regional fragmentation costs** when multiple encodings collide.

### 4. Protocol Longevity Requires Institutions
- Minitel (32 years), PRESTEL (35 years), BTX (18 years) — survived because of state/postal backing
- Pure-community traditions (ANSI scene, BBS) died with their hardware substrate
- **369 needs cultural validation, not just technical elegance.**

### 5. Efficiency Under Constraint
- BBC Mode 7 (1 KB), CoCo SG-24 (6 KB), TRS-80 — character art thrives under memory pressure
- Modern systems should **celebrate this efficiency**, not view it as legacy compromise

### 6. Regional Fragmentation
- MSX's character-set chaos
- Captain's kanji-as-raster workaround
- BTX's local standards
- **369's Unicode-first approach avoids the pain.** Single-encoding-layer wins.

### 7. Graceful Obsolescence
- MGR (1984) → modern Sixel + Kitty graphics (2018+) — same architectural insight, 40-year gap
- Plan 9 Rio (1989) → modern stream-based terminals — same orthogonal-stream principle
- **Character graphics protocols can *coexist* with bitmap graphics.** 369 designs for **superset inclusion**, not replacement.

---

## 369 Design Implications

- **Support legacy codepage fallback** (CP437, PETSCII, ATASCII, MSX variants) as **optional compatibility layer** — never the default.
- **Separate text / graphics / input streams** (Plan 9 / Rio philosophy) — don't monolith terminal state.
- **Document vector-as-text encoding** (NAPLPS, RIPscrip) as an extension mechanism for situations where bitmap-character is insufficient.
- **Preserve institutional memory** — Minitel's art archives matter. 369 should advocate for archival.
- **Teach efficiency first** — character art is not nostalgia; it is optimization. Frame accordingly.

---

## Statistics

- **17 traditions** documented + ANSI/PETSCII/ATASCII canon = **20 total streams**
- **Geographic spread:** North America (NAPLPS, RIPscrip), UK (PRESTEL, BBC, Sinclair), France (Minitel, Oric), Germany (BTX), Japan (Captain, X1, MSX), plus 3+ Bell Labs / Unix research systems
- **Time span:** 1977–2012 (35 years of active innovation)
- **Total users:** 100M+ (Minitel ~25M, BTX 2M+, MSX 9M, CoCo 400K, Spectrum 5M, MGR research-scale, PET 700K, BBC ~1M)
- **Preservation status:** Most archived; Minitel / PRESTEL / Captain largely lost (institutional shutdowns); demoscene assets well-preserved (WoS, Demozoo, GitHub)

---

## See Also

- [[ascii-ansi-art]] — Mainline ANSI / PETSCII / ATASCII art history
- [[archives-deep]] — Archive locator including these niche traditions
- [[unicode-art-extended]] — Unicode block mapping (sextants U+1FB00 came from these traditions)
- [[terminal-capabilities]] — Modern Sixel / Kitty graphics that descend from MGR + Plan 9
- [[tui-history]] — Generational arc placing these in context
- [[demoscene]] — Demoscene legitimization parallel to videotex preservation

---

## Sources

- handwiki.org/wiki/NAPLPS — NAPLPS technical reference
- en.wikipedia.org/wiki/NAPLPS
- dspace.library.uvic.ca — NAPLPS / Telidon docs
- scruss.com/blog/2023/09/18/the-glorious-futility-of-generating-naplps-in-2023/
- en.wikipedia.org/wiki/Remote_Imaging_Protocol — RIPscrip
- breakintochat.com/wiki/Remote_Imaging_Protocol_(RIP)
- wiki.preterhuman.net/RIPscrip_Graphics_Protocol_Specification
- github.com/cgorringe/RIPtermJS — Modern RIPscrip JS emulator
- en.wikipedia.org/wiki/Prestel
- paleotronic.com/2020/06/02/videotex-an-early-experiment-in-art-delivered-digitally/
- microartsgroup.com/prestel-videotex-teletext/
- en.wikipedia.org/wiki/Minitel
- ekac.org/VDTminitel.html — Minitel art history
- researchgate.net/publication/364982058 — Art Accès (1984–87) research
- collections.vam.ac.uk/item/O1428755 — V&A Minitel exhibit
- en.wikipedia.org/wiki/Bildschirmtext
- artsandculture.google.com/story/bildschirmtext-a-videotex-system-a-network-before-the-internet
- en.wikipedia.org/wiki/Captain_(videotex)
- ntt-review.jp/archive/ntttechnical.php?contents=ntr201306gls.html
- en.wikipedia.org/wiki/TRS-80_Color_Computer
- cocopedia.com/wiki/index.php/TRS-80_Color_Computer
- en.wikipedia.org/wiki/ZX_Spectrum_character_set
- worldofspectrum.org — WoS archive
- en.wikipedia.org/wiki/BBC_Micro
- beebwiki.mdfs.net/MODE_7 — Mode 7 reference
- github.com/markmoxon/teletext-elite — Teletext Elite
- en.wikipedia.org/wiki/MouseText
- kreativekorp.com/charset/map/mousetext/ — Kreativekorp MouseText mapping
- codepoints.net/symbols_for_legacy_computing
- en.wikipedia.org/wiki/PETSCII
- c64-wiki.com/wiki/PETSCII
- paleotronic.com/2018/06/13/petscii-c64/
- en.wikipedia.org/wiki/MSX_character_set
- msx.org/wiki/MSX_Characters_and_Control_Codes
- en.wikipedia.org/wiki/Oric_(computer)
- cpcwiki.eu/index.php/Oric-1/Atmos
- en.wikipedia.org/wiki/Sharp_X1
- en.wikipedia.org/wiki/Sharp_MZ
- retronauts.com/article/362 — Gaming Computers of Japan, Sharp MZ
- en.wikipedia.org/wiki/Sinclair_QL
- theqlforum.com
- hack.org/~mc/mgr/ — MGR official site
- en.wikipedia.org/wiki/ManaGeR
- osnews.com/story/135155/the-mgr-window-system/
- catb.org/esr/writings/taouu/html/ch02s06.html — ESR on MGR / pre-X11
- en.wikipedia.org/wiki/Rio_(windowing_system)
- doc.cat-v.org/plan_9/
- 9p.io/sys/doc/8%C2%BD/8%C2%BD.html — 8½ documentation
- herpolhode.com/rob/lec5.pdf — Rob Pike Rio lecture
- usenix.org/legacy/publications/compsystems/1995/sum_pike.pdf — Plan 9 USENIX 1995
