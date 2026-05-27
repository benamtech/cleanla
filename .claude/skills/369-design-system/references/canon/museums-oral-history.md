# Museum Collections + Oral Histories — Physical TUI Heritage

> **Beyond the bits — physical museums hold the terminals, hand-written manuals, and recorded voices of TUI pioneers.** This page maps Computer History Museum (CHM), York University CMC, Bletchley Park, Smithsonian, DigiBarn, Bitsavers, Folklore.org, and others. Includes catalog numbers, named oral-history interviews, and exact quotes from pioneers (Bill Joy, Knuth, Kernighan, McGugan, RaD Man, Stallman). Load this when you need *primary-source* citation for 369 design claims.

For the academic literature, see [[tui-academic]]. For digital archives, see [[archives-deep]]. For historical TUIs themselves, see [[historical-tuis]].

---

## 1. Computer History Museum (CHM) — Mountain View, CA

**URL:** https://www.computerhistory.org/

### Hardware Collection — DEC VT Series

| Model | Catalog # | Year | Significance |
|-------|-----------|------|--------------|
| VT100 terminal | 102654869 | 1978 | Foundational video terminal |
| VT100 keyboard + screenshots | 102647896 | 1978 | |
| VT100 Tempest variant | 102759772 | 1978 | TEMPEST-shielded for classified use |
| VT100/101/102/131 software manuals | 102759697 | 1978–83 | Bundle of foundational documentation |
| Computer Terminals & Printers Handbook | 102754036 | 1987 | Documents the entire DEC line |

**Plus:** VT101, VT102, VT131, VT220, VT240, VT340, VT420 individual entries.

### Oral Histories — TUI Pioneers
Searchable at computerhistory.org/oral-histories.

#### Bill Joy (vi creator, 1976)
- **Interview:** Conducted by Alex Bochannek
- **Source:** archive.computerhistory.org/resources/access/text/2022/06/102743073-05-01-acc.html
- **Key quote:** *"I was trying to make it usable over a 300-baud modem. The editor was optimized so users could edit and feel productive when screen painting was slower than they could think."*
- **Design philosophy:** Visual interface as **latency-hiding design** — vi's modal model lets users issue commands while the display catches up.

#### Donald Knuth (TeX, 1977–87)
- **Interview:** Two-part oral history, March 14 + 21, 2007
- **Interviewer:** Edward Feigenbaum
- **Catalog:** #102658053, #102658036
- **Topics:** TeX, METAFONT, type design philosophy, typography-as-computation, how 1968 hot-type unavailability forced 10 years of typographic infrastructure invention

#### Brian Kernighan (Unix tools, Bell Labs)
- **Catalog:** #102740169, #102740170 (two sessions)
- **Topics:** Unix tools philosophy, pipes as sequencing mechanism, text processing culture at Bell Labs, software design for human interaction
- **Key concept:** *"Tools over monoliths"* — directly informed 369's modular TUI philosophy

### Other CHM Collections
- **PDP-1** — interactive computing & teleprinter exhibit: computerhistory.org/pdp-1/interactive-computing/
- **Internet History Program** — oral histories of Ward Christensen (CBBS BBS creator), Tom Jennings (FidoNet), Phil Karn

### Why CHM matters for 369
The VT100's 24×80 grid was not arbitrary — it became the **Schelling point** for all subsequent TUI work. Every cell-based 369 layout descends from this catalog entry.

---

## 2. York University Computer Museum (YUCoM) — Toronto

**URL:** https://museum.eecs.yorku.ca/
**Dedicated page:** https://museum.eecs.yorku.ca/ansi_artists

### ANSI Art Collection
YUCoM preserves ANSI art as *"interior decoration of the seamy side of cyberspace"* (a phrase originating with RaD Man).

**Collection documents:**
- 256-character CP437 semigraphics rendering
- 16-foreground + 8-background color palettes on text-mode displays
- Underground BBS aesthetics — particularly **Area Code 604** (Vancouver) scene
- Pro bono artpack donations (monthly compressed updates, pre-1992)

### 369 relevance
YUCoM is the only institution that has formally accessioned ANSI art as a documented cultural object. The legitimization here matters: 369 can cite YUCoM as institutional precedent that constrained-color block-character work deserves design-system seriousness.

---

## 3. National Museum of Computing (TNMOC) — Bletchley Park, UK

**URL:** https://www.tnmoc.org/

### Exhibits
- **Teletext + Ceefax** — BBC's 1974 information service preserved in "BBC through the Decades"
- **Teletype Machines** — documented 80-column output standard as default constraint
- **Working historic computers** — remain operational for visitor interaction (not behind glass)

### Why for 369
Teletext proves narrative, schedule, and news fit perfectly into grid-based text displays. The "content as constraint" model echoes directly in 369's table/list compositions.

---

## 4. Smithsonian National Museum of American History — DC

**URL:** https://americanhistory.si.edu/comphist/

### Key Collections
- **VisiCalc + Apple II** (catalog `nmah_1696121`) — first spreadsheet (1979) on text-mode display
- **Computer Oral History Collection** (NMAH.AC.0196) — AFIPS/Smithsonian cooperative project (begun 1967) preserving computing pioneers' recorded interviews
- **Early Terminal Exhibits** (1969–75) — interactive "Tic-Tac-Toe" and "Identify the Planets" demos

### Why for 369
VisiCalc proved that **constrained grid interfaces** can support complex data interaction. The spreadsheet row-column model became fundamental to TUI data representation. 369 tables inherit this lineage.

---

## 5. DigiBarn Computer Museum — Palo Alto, CA (now at System Source Computer Museum, MD)

**URL:** https://digibarn.com/

### Status + Disposition
- Founded 1997 by Dr. Bruce Damer
- Physical collection survived 2020 CZU fire
- Moved to long-term loan at **System Source Computer Museum** (Hunt Valley, MD)
- Terminal + Monitor Collection: Informer Terminal, US Minitel, various legacy monitors
- 25+ years digital preservation initiative — scanning rare documents for Creative Commons licensing

### Why for 369
DigiBarn's shift from physical to digital preservation reflects 369's own thesis: **TUI knowledge lives in documentation and practice, not hardware artifacts.**

---

## 6. Bitsavers.org — DEC Manual Archive

**URL:** https://bitsavers.org/pdf/dec/

### Coverage
**23,000+ DEC manuals.** Maintained by **Al Kossow** (Software Librarian, Computer History Museum).

**Key documents:**
- VT100 Series technical manuals + schematics + user guides
- VT240 Technical Manual (August 1984)
- VT220 Technical Manual (November 1984)
- Terminals & Printers Handbook (1987) — canonical reference

### Why for 369
These manuals encode escape-sequence dialects, cursor-movement paradigms, and rendering constraints. Modern terminals (xterm, kitty, wezterm) reverse-engineer from these documents. **369 can cite Bitsavers for VT100-compatible ANSI codes with primary-source authority.**

Cross-mirror: archive.org/details/bitsavers_dec

---

## 7. Folklore.org — Apple's Lost Stories

**URL:** https://www.folklore.org/

Andy Hertzfeld's collection of Mac development stories.

**Relevant for TUI history:**
- **MacWrite** UI evolution (Randy Wigginton)
- **ResEdit** — resource editor for Mac localization
- Documents the **1984 GUI/TUI fork**: what text-based tools *could not* do (visual layout preview)

### Why for 369
**369 inverts the Folklore story.** Folklore documents when GUI exceeded TUI. 369 documents when TUI exceeds GUI — efficiency, scriptability, accessibility, headless / SSH operation, AI-agent collaboration.

---

## 8. Ward Christensen — BBS History (CBBS, 1978)

**Interview:** archive.org/details/20020216-bbs-christensen (BBS Documentary, 2002)

Co-creator (with Randy Suess) of the first Computerized Bulletin Board System. Launched **February 16, 1978**, during a Chicago blizzard.

**CBBS pioneered:**
- Dial-up terminal interaction
- Modem-based communication
- File transfer protocol — XMODEM (also by Christensen)
- The foundation for ANSI art distribution networks

### Why for 369
BBS culture *created the demand* for text-mode art, menu systems, line-buffered I/O. The 1200-baud modem constraint shaped Leet/ANSI visual culture. **369's bandwidth-aware design traces directly to this era.**

---

## 9. ACiD Productions — RaD Man Archive

**URLs:** https://16colo.rs/group/acid + https://defacto2.net/g/acid-productions

### Preservation work
- **Founded Feb 9, 1990** by RaD Man, Shadow Demon, Grimm, Beholder, Phantom
- Grew from 5 members (1990) to 700+ by 2003
- **Artpack model** (1992–present) — monthly compressed art distribution replacing individual BBS uploads
- **ACiD Acquisition Archive** (1996) — systematized preservation of artpacks from hundreds of successor groups
- **Dark Domain DVD Collection** (2004) — physical archive of artscene history
- **RaD Man as historian** (2002–present) — collecting interviews, artist genealogies, demoscene lineage reports

### Why for 369
ACiD proved ANSI art was culturally significant enough to preserve systematically. **The artpack format and versioning model prefigure modern package management.** 369 can cite RaD Man's interviews for practitioner voice.

---

## 10. Technical-Press Archives

### BYTE Magazine (1975–1998) — Complete Internet Archive
**URL:** https://archive.org/details/BYTE-MAGAZINE-COMPLETE

Contains:
- Terminal design articles
- Low-level programming
- Unix columns
- Graphics techniques

### Dr. Dobb's Journal (1976–2008)
- Terminal programming
- curses library guides
- ASCII art techniques
- **Allen I. Holub's** "Curses: UNIX-Compatible Windowing Output Functions" — documented standard TUI patterns

### Communications of the ACM
- "Human factors guidelines for terminal interface design" (canonical pre-GUI HCI piece)
- dl.acm.org/doi/10.1145/358150.358156

### Why for 369
These journals documented TUI culture in real time. **369 can cite specific DDJ articles for curses design patterns, ANSI code examples, and practitioner philosophy from the 1980s–90s** — primary sources, not retrospective summaries.

---

## 11. Living Computers: Museum + Labs — Seattle (Closed 2024)

**Wikipedia:** https://en.wikipedia.org/wiki/Living_Computers:_Museum_%2B_Labs
**Acquisition notice:** Computer Museum of America acquired the collection September 2024.

**What it was:**
- Opened 2012; closed June 2024
- **Terminal collection** configured for telnet access (interactive use prioritized over display-only)
- **Online archives** transferred to sdf.org → ongoing global access to operational vintage computers

### Why for 369
Living Computers demonstrated that vintage terminals remain *usable*, not merely archival. This validates 369's assumption that **TUI knowledge is practice-based, not retrospective.**

---

## 12. Modern Creator Interviews

### Will McGugan (Textual, Rich)
**Interview sources:**
- "7 Things I've Learned Building a Modern TUI Framework" — textualize.io/blog
- **Talk Python Podcast #380** — Modern TUI Framework Design
- **SE Radio #669** (2025-05) — Text-Based User Interfaces

**Key design philosophy:**
- Immutability as cache-friendly constraint
- Web-development patterns (CSS, layout trees) adapted to terminal
- Minimize screen redraws via dirty-region tracking
- Description: *"minimal web interface that focuses on typography"*

### Mitchell Hashimoto (Ghostty terminal emulator)
**Background:** Built Vagrant, Terraform, Packer at HashiCorp.
**Philosophy:** *"Consumer-grade DevOps tooling"* — tools should spark joy, not suffer.
**Current focus:** Infrastructure for terminal apps; terminal emulation as platform for TUI.
**Interview:** Heavybit "Open Source Ready" podcast.

### Bram Moolenaar (Vim, 1991–2023, RIP)
Multiple interviews documenting Vim's modal-editing philosophy + the long evolution from Stevie/vi clone to modern Neovim ecosystem.

### Jesse Duffield (lazygit, 2018)
- "Lazygit 5 Years On" — jesseduffield.com/Lazygit-5-Years-On/
- Documented the deliberate choice to make terminal git *better* than CLI + GUI

### Kovid Goyal (Kitty terminal, calibre)
Documentation at sw.kovidgoyal.net/kitty/. Interviews scattered across podcasts; technical writing on kitty.conf evolution is exceptionally detailed.

### Hisham Muhammad (htop, 2004)
**Source:** github.com/htop-dev/htop — README + interviews on Brazilian dev community sites.

### Aristocratos (btop, 2021)
**Source:** github.com/aristocratos/btop — release notes document philosophical decisions about braille graphs and theme system.

---

## 13. Historical Pull-Quotes (for 369 docs)

### Bill Joy on vi (1976)
> *"I was trying to make it usable over a 300-baud modem. The editor was optimized so users could edit and feel productive when screen painting was slower than they could think."*

### Richard Stallman — Church of Emacs
The Emacs-vs-vi schism as cultural marker. GNU Emacs positioned as ideological stance toward free software and human-computer dialogue. Vi as *"editor of the beast,"* but use of free vi offered as *"penance not sin"* (Stallman, on St. IGNUcius performances).

### RaD Man (ACiD)
ANSI artists were *"interior decorators of the seamy side of cyberspace."*

### Donald Knuth on Typography
> "TeX and METAFONT proved that typography is computation."

### Doug McIlroy (Unix philosophy)
> *"Write programs that do one thing well. Write programs to work together. Write programs to handle text streams."*

### Will McGugan (Textual)
*"A minimal web interface that focuses on typography."* (Describing Textual's design intent.)

### Brian Kernighan
Pipes as sequencing mechanism; **text processing as philosophy**. Tools over monoliths.

---

## 14. Citation Formats for 369 Documents

**Terminal specifications:**
> VT100 Technical Manual, Bitsavers Archive (bitsavers.org), sourced from Computer History Museum collection.

**Design philosophy:**
> Will McGugan, "Seven Lessons from Building a Modern TUI Framework," Textualize.io Blog & Talk Python Podcast #380.

**ANSI art history:**
> RaD Man, ACiD Productions Historian, "Artpack Preservation Initiative," 16colo.rs & defacto2.net archives.

**Unix tooling philosophy:**
> Brian Kernighan, Oral History, Computer History Museum (catalog #102740169), "The Concept of Pipes and Unix Tools Philosophy."

**Vim modal design:**
> Bill Joy, Oral History, Computer History Museum (interviewed by Alex Bochannek), "vi as Latency-Hiding Design."

**Demoscene legitimacy:**
> *International Journal of Heritage Studies*, "The Demoscene: from digital subculture to UNESCO intangible cultural heritage," Vol. 32, No. 3 (2025).

---

## 369 Design System Relevance

1. **Hardware constraints as culture.** VT100's 24×80 grid was not arbitrary — it became the Schelling point. 369 honors this constraint, then deliberately breaks it where modern terminals allow.

2. **Oral history as practice.** Kernighan, Joy, McGugan, Moolenaar all speak to *design philosophy*, not just technical specs. **369 must document not just *what* was built, but *why* — and *for whom*.**

3. **Text as substrate.** From Unix pipes to ANSI art to Textual: all TUI work treats text/characters as the fundamental medium. 369's character-grid commitment is historically grounded.

4. **Preservation is practice.** ACiD's artpack archive, Bitsavers manuals, Living Computers' sdf.org migration — TUI knowledge survives through **active use**, not museum glass cases.

5. **Aesthetic legitimacy.** YUCoM and MoMA expansion recognize ANSI art + text-mode interfaces as design worthy of institutional preservation. 369 operates within this newly recognized cultural category.

---

## See Also

- [[tui-academic]] — Peer-reviewed scholarship (Reunanen, Botz, Tasajärvi)
- [[archives-deep]] — Digital archives (16colo.rs, defacto2, scene.org, demozoo)
- [[historical-tuis]] — Landmark TUIs themselves (WordStar, VisiCalc, Norton Commander, Vim, Emacs, etc.)
- [[ascii-ansi-art]] — BBS culture narrative
- [[demoscene]] — Demoscene cultural history

---

## Sources

- computerhistory.org — Computer History Museum (Mountain View, CA)
- computerhistory.org/oral-histories — CHM oral history catalog
- archive.computerhistory.org/resources/access/text/2022/06/102743073-05-01-acc.html — Bill Joy interview
- museum.eecs.yorku.ca/ansi_artists — York University Computer Museum ANSI archive
- tnmoc.org — National Museum of Computing (Bletchley Park)
- americanhistory.si.edu/comphist/ — Smithsonian NMAH Computer History
- digibarn.com — DigiBarn Computer Museum
- mimmsmuseum.org/news/computer-museum-of-america-acquires-collection-from-living-computers-museum — Living Computers acquisition
- bitsavers.org/pdf/dec/ — Bitsavers DEC manuals
- archive.org/details/bitsavers_dec — Bitsavers mirror
- folklore.org — Apple development stories
- archive.org/details/20020216-bbs-christensen — Ward Christensen interview
- archive.org/details/BBS.The.Documentary — BBS documentary
- 16colo.rs/group/acid — ACiD preservation
- defacto2.net/g/acid-productions — ACiD on Defacto2
- archive.org/details/BYTE-MAGAZINE-COMPLETE — BYTE Magazine complete archive
- textualize.io/blog/7-things-ive-learned-building-a-modern-tui-framework — Will McGugan
- talkpython.fm/episodes/show/380 — Talk Python Podcast #380
- se-radio.net/2025/05/se-radio-669-will-mcgugan-on-text-based-user-interfaces — SE Radio #669
- jesseduffield.com/Lazygit-5-Years-On/ — Lazygit retrospective
- sdf.org — Successor to Living Computers' online terminal infrastructure
