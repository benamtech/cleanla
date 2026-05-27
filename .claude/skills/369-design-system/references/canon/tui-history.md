# TUI History — From RTTY to Ratatui

> **The Text User Interface is older than the Graphical one.** It was the *only* interface for the first 35 years of computing — from 1960s glass-TTYs through 1980s VT100s and CP/M, into the BBS era, the curses/Turbo-Vision golden age, the post-Windows "ugly cousin" era, and the 2020s renaissance led by Textual / Ratatui / Bubbletea. This page is the historical arc — why each generation chose the constraints it did, what each generation invented, and what 369 inherits from each.

For protocol details, see [[terminal-capabilities]]. For frameworks, see [[tui-frameworks-complete]]. For the ANSI art that paralleled it, see [[ascii-ansi-art]].

---

## The Generational Timeline

| Era | Years | Defining hardware | Defining software |
|-----|-------|-------------------|-------------------|
| **0. Teletype** | 1869–1960 | Mechanical printer-terminals | Telegraph code, Baudot |
| **1. RTTY/Glass-TTY** | 1960s | Radioteletype + CRT terminals | Line-mode shells |
| **2. Smart Terminal** | 1970s | DEC VT05 (1970), VT52 (1975), VT100 (1978) | First full-screen editors |
| **3. Microcomputer** | 1978–84 | Apple II, IBM PC, Commodore 64 | Wordstar (1978), VisiCalc (1979), early BBSes |
| **4. Curses Era** | 1980–93 | BSD Unix workstations | vi (1976), Emacs (1976), curses (1980), Turbo Vision (1990) |
| **5. ANSI / BBS** | 1985–98 | DOS PCs with modems | TheDraw (1986), ANSI artpacks, FidoNet |
| **6. ncurses + classics** | 1991–2010 | Linux workstations | ncurses (1993), mc (1994), htop (2004), tig, lynx |
| **7. Post-Windows "ugly era"** | 1995–2015 | TUIs marginalized | dialog, whiptail, nano, mutt — function over form |
| **8. The Renaissance** | 2018–present | High-DPI terminals + truecolor | Textual, Ratatui, Bubbletea, lazygit, k9s, btop |

---

## Era 0 — Teletype (1869–1960)

- **1869** — First teletype machine (Royal Earl House's printing telegraph).
- **1874** — Émile Baudot's 5-bit code → standardized character set for telegraph.
- **1920s** — Teletype Corporation Model 14, Model 15 — mechanical printer terminals.
- **1940s–50s** — Bell Labs, IBM use teletypes for computer I/O. ASCII evolves from Baudot via FIELDATA → ASCII-1963.

**What we inherit:**
- Character-cell model — output is a stream of bytes that print left-to-right, top-to-bottom.
- `CR` (return carriage) + `LF` (advance paper) — separate primitives that survive in CRLF line endings.
- The very concept of "out-of-band signaling" (overstrike via CR-without-LF was the first hack to get more from a fixed channel).

---

## Era 1 — RTTY and Glass-TTY (1960s)

- **1964** — IBM 2741 (Selectric-based interactive terminal)
- **1965** — Multics begins — first system designed for *terminals*, not batch
- **1969** — Unix Edition 1 — built around the TTY device abstraction
- **1970** — DEC VT05 — early CRT "glass TTY" — same model as a printing teletype, just on a screen

**Key shift:** Output is still a stream. There's no cursor model beyond "where the current character will print." Programs that need full-screen UI must clear the entire screen with form-feed (`FF`, 0x0C) and reprint.

---

## Era 2 — Smart Terminals (1970s)

The terminal becomes addressable.

- **1975** — DEC VT52 — first widely-adopted CRT with escape-sequence cursor positioning
- **1976** — Bill Joy writes `vi` (technically `ex` in visual mode) on a Lear Siegler ADM-3A
- **1976** — Emacs by Stallman / Steele on ITS — modeless editor
- **1976** — ECMA-48 standard for control sequences
- **1978** — **DEC VT100 ships** — the most influential terminal ever
  - Implements the new ANSI X3.64 / ECMA-48 standard
  - Becomes the de-facto compatibility floor
  - Every terminal emulator since claims VT100 compatibility
- **1979** — ANSI X3.64 standard formally adopted
- **1979** — Sun Microsystems incorporated; Hayes 300-baud modem ships

**What the smart terminal made possible:**
- Cursor positioning anywhere on the 80×24 grid
- Color (initially 8 colors)
- Bold, underline, reverse video as separate attributes
- The *concept* of a full-screen application — vi, Emacs, RogueClone (1980)
- Direct ancestor of every modern TUI

**What it didn't have:**
- Mouse
- Truecolor
- Synchronized output
- Persistent state outside the screen buffer

The VT100's escape sequences (`ESC [ ... <letter>`) are still the same escape sequences we use in 2026. CSI inherited unchanged.

---

## Era 3 — Microcomputer (1978–84)

The terminal moves *into* the computer.

- **1977** — Commodore PET — first integrated character display + keyboard + CPU
- **1977** — Apple II — text mode 40×24 with custom encoding
- **1978** — **First BBS — CBBS by Ward Christensen** (Chicago, Feb 16, 1978)
- **1979** — VisiCalc — first spreadsheet (Dan Bricklin) — TUI-only
- **1979** — ATASCII (Atari 8-bit)
- **1981** — **IBM PC ships** with CGA + CP437 character set (designed on that 4-hour airplane meeting)
- **1982** — Commodore 64 — PETSCII redesigned with chunkier glyphs
- **1983** — Lotus 1-2-3 — the canonical 1980s business TUI
- **1984** — IBM PC AT + EGA — 16-color text

**Key inventions:**
- **CP437** brings box-drawing into mainstream computing — the visual vocabulary for the next 15 years of TUIs.
- **Software cursor** (programs can hide/show the cursor independent of the terminal hardware).
- **The 80×25 canvas** becomes universal expectation.
- **WordStar key bindings** (Ctrl+K block ops, etc.) become a lingua franca that survives in Borland tools, Turbo Pascal, etc.

---

## Era 4 — The Curses Era (1980–93)

The first *framework* for portable TUI development.

- **1977** — Ken Arnold writes `curses` at UC Berkeley for porting Rogue (an existing terminal game) to non-VT100 terminals
- **1980** — `curses` ships with BSD Unix — first widely-distributed TUI framework
- **1981** — `terminfo` database — abstraction over different terminals' escape codes
- **1985** — Mark Horton ports curses to System V, adds color
- **1986** — TheDraw ships — graphical ANSI editor
- **1990** — Borland Turbo Vision (Pascal, then C++) — object-oriented TUI framework with windows, dialogs, menus
- **1990** — ACiD Productions founded
- **1990** — Pavel Curtis builds LambdaMOO (text-based MUD)
- **1991** — Linus Torvalds posts about a hobby OS
- **1991** — iCE Advertisements founded
- **1992** — Microsoft Windows 3.1 ships — GUI begins to dominate
- **1993** — **GNU ncurses** released (Zeyd Ben-Halim, Eric Raymond) — free, cross-platform reimplementation of curses

**The Turbo Vision Innovations:**
- **Object-oriented widget hierarchy** (TWindow inherits from TDialog inherits from TGroup)
- **Event dispatch system** with focus management
- **Mouse support** in DOS
- **Modal dialogs**
- **Drag-and-drop window management** in a TUI

Turbo Vision is the **ancestor of every retained-mode TUI framework**: Lanterna (Java) is literally Turbo-Vision-shaped, Textual reinvented its CSS-based version, FTXUI brings the API to modern C++.

### What the curses era proved

- TUIs can be portable across hundreds of terminal types via terminfo
- The widget abstraction works in text mode
- A unified IDE (Turbo Pascal, Borland C++) can have GUI-like productivity entirely in TUI

---

## Era 5 — ANSI / BBS (1985–98)

In parallel with the Unix curses era, the DOS/PC world built a richer aesthetic.

- **1986** — TheDraw (ASCII/ANSI editor) ships
- **1989** — Telix (terminal program)
- **1990** — First .NFO file (Fabulous Furlough, THG)
- **1990** — ACiD Productions
- **1990–98** — Peak of BBS culture
- **1994** — Linux 1.0
- **1995** — World Wide Web takes off — BBS culture begins decline
- **1997** — Peak year — 900+ ANSI artpacks released

**What the BBS era invented (that Unix didn't):**
- The aesthetic conventions of ANSI art (half-blocks for color doubling, gradient ramps, iCE colors)
- SAUCE metadata
- Demoscene crossover with TUI productions
- Door games — the precursor to terminal games as a distinct genre

See [[ascii-ansi-art]] for full coverage.

---

## Era 6 — ncurses + Classics (1991–2010)

- **1991** — **lynx** (text web browser)
- **1993** — **GNU Midnight Commander** (Miguel de Icaza) — Norton Commander clone for Linux
- **1994** — `dialog` (whiptail's ancestor) — TUI dialog primitives for shell scripts
- **1995** — **mutt** (email)
- **1996** — **vim** improves vi, GUI-rendering optional
- **1996** — irssi (IRC client)
- **2003** — **htop** (Hisham Muhammad) — system monitor reimagining of `top`
- **2004** — slrn (newsreader)
- **2006** — **tig** (git history TUI)
- **2008** — Blocktronics revives ANSI art

**Aesthetic of the era:** Function over form. ncurses' default color scheme is *cyan on black with red highlights* — perfectly readable, profoundly ugly. The TUIs that survived this era are still in daily use 30+ years later: vim, htop, mc, mutt, irssi, lynx, tig.

**The pattern:** A TUI from 1995 still works on a modern terminal. A GUI from 1995 looks like an artifact. **TUI portability across time** is the silent superpower.

---

## Era 7 — Post-Windows "Ugly Era" (1995–2015)

- TUI development becomes "legacy" work in the popular imagination
- Most new developer tools ship GUI-first
- ncurses gets the bare-minimum of updates
- BBSes essentially die by 2000
- The dialog / whiptail interface becomes "the only TUI most users see" (Linux installers, OpenSSH configuration, etc.)
- Some bright spots: htop (2004), tig (2006), ranger (2009)

The era's lesson: when nobody is paying attention, the foundation rots. By 2010, default curses output looked nearly indistinguishable from a 1990 terminal. Color palettes were 16 colors. Truecolor was rare even though terminals had supported it for years. SIGWINCH handling was broken in most software.

**The recovery starts** with people noticing that high-resolution terminals, GPU acceleration, and truecolor were sitting unused.

---

## Era 8 — The Renaissance (2018–present)

A constellation of changes converged:

### Terminal-side
- **2018** — GPU-accelerated terminals (Alacritty, Kitty) become production-ready
- **2018** — Kitty graphics protocol launches
- **2019** — WezTerm released
- **2020** — Windows Terminal ships — truecolor + tabs on Windows
- **2021** — Kitty keyboard protocol formalized
- **2021** — Synchronized Output mode 2026 cross-vendor adoption
- **2022** — Foot becomes the standard Wayland terminal
- **2024** — Ghostty 1.0 launches

### Framework-side
- **2020** — **Textual** (Will McGugan, Textualize) launches — CSS-styled Python TUIs
- **2020** — **Bubbletea** (Charm) launches — Elm Architecture for Go
- **2020** — **Ratatui** forked from `tui-rs` (which started 2017)
- **2021** — Charm releases Lipgloss, Bubbles, Glow
- **2022** — k9s, lazygit, gh, glow reach mass adoption
- **2023** — **GitHub Copilot CLI ships with Ink**
- **2024** — btop, btop4win — system monitors with sub-cell graphics

### Aesthetic-side
- Demoscene continues
- Blocktronics releases new artpacks
- Unicode block sextants (U+1FB00) standardized 2020
- "Vintage computing" aesthetic crosses into mainstream design

### What's different now
- Truecolor is the default expectation, not the exception
- Mouse support is universal in TUIs (not just emacs and mc)
- Keyboard protocol disambiguation is normal
- Image protocols (Sixel, Kitty) let dashboards show real graphs
- The 369 design system (yours) exists at all — codified, deterministic, modular

---

## What 369 Inherits from Each Era

| Era | Inheritance |
|-----|-------------|
| Teletype | Character-cell stream model; byte-oriented output |
| Smart Terminal | ANSI escape codes; cursor positioning; 80×24 baseline |
| Microcomputer | CP437 box-drawing vocabulary; PETSCII as alternative aesthetic |
| Curses era | Widget hierarchies; terminfo abstraction; the deterministic widget tree |
| BBS era | Half-block color doubling; shade-ramp luminance; group/artpack distribution model |
| ncurses era | Portability across time; function over form; "stable for 30 years" software |
| Post-Windows | Hard lesson — without intentional design, default looks rot |
| Renaissance | Truecolor + Unicode + GPU + synchronized output is the *new floor* |

---

## Conceptual Lineage of the 369 Approach

Where each 369 rule comes from historically:

- **Rule 1 (spacing ×3)** — Bauhaus + Swiss grid systems → curses unit-grid → 369 multiples-of-3 system.
- **Rule 2 (no border-radius)** — Brutalist + early Windows + DOS UI → terminals never had radius → 369 inherits structurally.
- **Rule 3 (1px solid borders)** — VT100 single-line box drawing → curses `WACS_LRCORNER` etc. → 369 light-line aesthetic.
- **Rule 4 (Helvetica + 12px)** — Swiss style typography → modern terminal monospace fonts → 369 type scale.
- **Rule 5 (369 palette)** — DEC VT241 color codes → CP437 16-color palette → expanded 24-bit → 369 brand tokens.
- **Rule 6 (no decoration)** — Tufte + Rams "less but better" → terminal-native default → 369 zero-ornament.
- **Rule 7 (engines)** — Knowlton's 1966 algorithmic ASCII portrait → libcaca's automated quantization → 369 `presentation()` engine.
- **Rule 8 (deterministic)** — Elm Architecture (2012) → Ratatui immediate-mode (2020) → 369 same-input/same-output.
- **Rule 9 (BASE/PILLARS/ROOF)** — Bauhaus tripartite design → atomic design (Brad Frost, 2013) → 369's 3-6-9 fractal.

---

## Notable Historical Software (worth knowing)

| Year | Software | Why it matters |
|------|----------|----------------|
| 1976 | vi | Modal editing — direct ancestor of every modal TUI |
| 1976 | Emacs | Modeless extensibility — the chord-driven alternative |
| 1979 | VisiCalc | First killer-app TUI; established spreadsheet UX |
| 1980 | Rogue | First procedural-text game; birthplace of curses |
| 1983 | Lotus 1-2-3 | Workhorse business TUI of the 80s |
| 1986 | TheDraw | First specialized ANSI/ASCII editor |
| 1988 | WordPerfect 5.1 | Reverse-video function-key bar — UI convention that survived |
| 1989 | Turbo Pascal 6 + Turbo Vision | Object-oriented TUI framework, decade ahead |
| 1991 | Linux + ncurses combo | Open-source TUI portability foundation |
| 1993 | Midnight Commander | Modern Norton Commander clone — still used 2026 |
| 1994 | Pine / mutt | Email TUIs — established conventions for threaded views |
| 2001 | irssi | IRC TUI that survived to 2026 |
| 2003 | htop | Process viewer reimagined for modern terminals |
| 2006 | tig | Git porcelain TUI; influenced lazygit |
| 2009 | ranger | File manager — keyboard-driven, vi-style |
| 2015 | fzf | Fuzzy-finder; new pattern for "selection TUIs" |
| 2017 | lazygit | The TUI that proved Git's interface could be both better AND in a terminal |
| 2020 | Textual launch | CSS-styled reactive Python TUIs |
| 2020 | Bubbletea launch | Elm Architecture in Go |
| 2022 | k9s | Kubernetes via tview — workload management at scale |
| 2023 | btop | System monitor with sub-cell braille graphs |
| 2024 | Toad | AI assistant entirely in Textual |

---

## See Also

- [[tui-frameworks-complete]] — The 18 modern frameworks descending from this history
- [[tui-design]] — Modern TUI architecture (Elm Arch., immediate vs retained)
- [[terminal-capabilities]] — Protocol layer (the VT100 → xterm → modern lineage)
- [[ascii-ansi-art]] — Parallel aesthetic history (BBS scene, art groups)
- [[unix-cli-principles]] — Philosophy of the Unix era that shaped TUI conventions

---

## Authoritative Sources

- Eric S. Raymond, *The Art of Unix Programming* (2003)
- DEC VT100 User Guide (1978)
- *2.11BSD curses(3X) man page* (1979)
- *Turbo Vision Programming Guide* (Borland, 1990)
- Ben Lunt, *Programming for the Curses Library* (1992)
- Pradeep Padala, *NCURSES Programming HOWTO* (2001)
- Will McGugan, *Textual launch post* (2021)
- [Charm — Building Bubble Tea](https://charm.sh/blog/)
- [terminaltrove.com](https://terminaltrove.com/) — modern terminal database
- [VT100.net](https://vt100.net/) — DEC terminal documentation archive
- [textfiles.com](http://textfiles.com/) — Jason Scott's archive of pre-Web computing
