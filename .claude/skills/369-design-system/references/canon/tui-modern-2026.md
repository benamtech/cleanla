# Modern TUI Ecosystem — 2024–2026 Edge

> **The TUI is having a renaissance, and it isn't slowing down.** Charm released v2 of the entire ecosystem (Feb 2025). Ratatui hit no-std (Dec 2024). Will McGugan built Toad — an AI coding TUI proving terminals are *preferred* for agentic UX, not legacy. Ghostty launched (2024) as Mitchell Hashimoto's new terminal. This page is the canonical 2024–2026 update — current versions, currently-active maintainers, and the verified-state of every framework / tool 369 references.

For the broader framework catalog (less time-bounded), see [[tui-frameworks-complete]]. For modern terminal-emulator capabilities, see [[terminal-capabilities]].

---

## Major Releases Validating 369 Theses

| Project | Version | Date | Significance |
|---------|---------|------|--------------|
| **Bubble Tea v2.0.0** | v2.0.6 | Feb 24, 2025 → April 16, 2025 | Cursed Renderer; Declarative View API |
| **Lip Gloss v2.0.0** | v2.0.3 | Feb 24, 2025 → April 2025 | Compositing + layers API |
| **Ratatui v0.30** | — | Dec 2024 | **no-std support** — embedded TUI viable |
| **Helix v25.07** | latest | July 2025 | Biannual cadence — Jan + Jul |
| **Zellij v0.44.3** | latest | May 2026 | Native Windows + Web client |
| **Notcurses v3.0.17** | latest | Oct 2024 | Octant blitter (Unicode 16) |
| **Foot v2026** | latest | 2026 | Background blur, Unicode 16, IME cursor rect |
| **Kitty v0.47** | latest | 2026 | Drag-and-drop kitten (cross-app, even SSH) |
| **fzf v0.73.1** | latest | May 2026 | Multicore linear scaling |
| **Toad** | stable | Dec 2025 | AI agentic-coding TUI (proves TUI > GUI for AI) |
| **VHS v0.11.0** | latest | March 2026 | ScrollUp/ScrollDown, Ctrl+arrow |
| **Atuin v18.16.1** | latest | May 2026 | Desktop runbooks + CRDT |

---

## Charm Ecosystem: The v2 Moment (February 2025)

The single most-important TUI-framework event of 2024–2026. **Domain moved from charm.sh to charm.land** — signaling ecosystem-wide maturation.

### Bubble Tea v2.0.0 (Feb 24, 2025)
**Source:** github.com/charmbracelet/bubbletea

- **Cursed Renderer** — ncurses-inspired algorithms replacing pure-ANSI-escape approach. Closer to retained-mode internally while presenting an immediate-mode API.
- **Declarative View API** — supplants imperative command pattern
- **Extended keyboard support** — progressive enhancement for modern terminals (Kitty keyboard protocol)
- **Pure Lip Gloss v2 integration** — eliminated I/O conflicts that plagued v1
- **v2.0.6 (April 16, 2025)** — fixed wide-character handling CPU spike

### Lip Gloss v2.0.0 (Feb 24, 2025)
**Source:** github.com/charmbracelet/lipgloss

- **Compositing + layers API** — new canvas model for spatial arrangement
- **Deterministic styles** with explicit I/O control
- **Underline variants** + hyperlink support (CSI 4:N + OSC 8)
- **Color blending helpers** + brightness adjustments
- **Network-TUI via SSH** compatibility
- **v2.0.3 (April 2025)** — resolved background-color query hangs

### Bubbles v2.1.0 (March 26, 2024)
- Dynamic textarea resizing (min/max height constraints)
- Getter/setter API consistency across components
- Functional options pattern standardized
- **Real terminal cursor support** (no more synthesizing the cursor in app code)

### Charm Supporting Tools (Feb 2024 – April 2026)
| Tool | Version + Date | Purpose |
|------|----------------|---------|
| **Huh v2.0.0** | March 9, 2024 | Forms framework rebuilt on Tea v2 + Lip Gloss v2; view hooks |
| **Gum v0.17.0** | Sept 2025 | 13+ shell commands (choose, filter, input, spin, style) |
| **Glow v2.1.2** | April 2026 | Markdown viewer; file-watching; custom pager styles; TUI mode |
| **Pop v0.2.1** | April 2026 | Terminal email client with SMTP (v0.2.0 Aug 2025) |
| **VHS v0.11.0** | March 2026 | Terminal screencaster; ScrollUp/ScrollDown; Ctrl+arrow support |

**Source for narrative:** charm.land/blog/v2 (Feb 23, 2025)

**369 takeaway:** Bubble Tea + Lip Gloss v2 cements **Go + Charm** as the production standard. The compositing API in Lip Gloss v2 directly enables 369-style nested compositions without manual ANSI math.

---

## Terminal Emulators — Feature Convergence + New Players

### Ghostty (Mitchell Hashimoto, 2024)
**Source:** github.com/ghostty-org/ghostty

- **Architecture** — Multi-threaded (read/write/render separated); OpenGL on Linux, Metal on macOS
- **Protocol support** — Kitty graphics, clipboard sequences, synchronized rendering, light/dark mode detection
- **Native UI** — SwiftUI (macOS), GTK (Linux); systemd single-instance + cgroup isolation on Linux
- **libghostty** — C/Zig zero-dependency library (macOS/Linux/Windows/WASM)
- **Windows support** — announced (roadmap 5/6 complete)

**369 relevance:** Validates terminal-emulator commoditization. Design implications: 369 can assume Kitty graphics protocol + sync output + modern keyboard protocol on Ghostty.

### Kitty (Kovid Goyal) — Drag-Drop + Smooth Scrolling
**Source:** sw.kovidgoyal.net/kitty/changelog/

- **v0.47 (2026)** — Drag-and-drop kitten for cross-app file movement (works over SSH!)
- **v0.46 (2026)** — Smooth + momentum-based scrolling, tab drag-reorder, mouse pane resizing
- **v0.45 (2026)** — File-selection kitten (keyboard-first, content preview)
- **v0.43 (2025)** — Session management, configurable scrollbar, native multiline cursor via protocol
- **v0.33 (2025)** — SIMD vector acceleration (2× throughput, 10–50% energy reduction)
- **Wayland quality** — Desktop notifications, GPU-accelerated panels

### WezTerm (Wez Furlong) — Lua at Scale
**Source:** wezterm.org

- Cross-platform: Linux, macOS, Windows 10, FreeBSD, NetBSD
- Terminal multiplexing — panes, tabs, windows (local + remote via Lua)
- Programming ligatures, colored emoji, intelligent font fallback
- Dynamic color schemes + hyperlink recognition
- Searchable docs (Lua scripting reference inline)

**369 validation:** Lua-driven config mirrors composability trend — same pattern as Lip Gloss v2 compositing.

### Foot (Wayland-native, C)
**Source:** codeberg.org/dnkl/foot — 97% C

- **2026** — Background blur, URL styling options (none/single/double/curly/dotted/dashed)
- **Unicode 16.0** support (Oct 2024)
- **IME cursor rect** reporting; grid reflow fixes
- Selection: prevents empty-text clipboard clearing
- New `[colors-dark]` / `[colors-light]` config sections; user regex patterns

---

## Rust TUI — Ratatui Maturation

### Ratatui v0.30 (Dec 2024)
**Source:** github.com/ratatui/ratatui

- **no-std support** — embedded targets + portable-atomic for systems without native atomics → **embedded TUIs are now viable**
- **Layout:** `Flex::SpaceEvenly` / `SpaceAround` (CSS alignment parity), `Offset::new()` constructor
- **Widgets expanded:**
  - **BarChart** — Grouped constructor, reduced verbosity
  - **Calendar** — Width / height calculation
  - **Canvas** — Quadrant + sextant + octant markers (sub-cell pixel art)
  - **LineGauge** — Custom symbols beyond presets
  - **List** — Highlight symbols via `Into<Line>`
  - **Bar** — label / text_value `Into<>` support
- **Chart stacking** — Braille markers render over block symbols
- **Style** — `has_modifier()` method, `Direction::perpendicular()` utility

**369 relevance:** no-std unlocks embedded device TUIs. The Canvas widget's sextant/octant markers directly implement the U+1FB00 vocabulary documented in [[unicode-art-extended]].

---

## Python — Textual Ecosystem + Post-Company Era

### Textual Framework
**Source:** textualize.io

- Python framework for terminal + web deployment (same code)
- **Company transition:** Textualize wrapped as a company (mid-2025); open source continues under Will McGugan + core team
- Notable apps:
  - **Dolphie** (MySQL monitoring)
  - **Elia** (ChatGPT TUI)
  - **Harlequin** (DuckDB IDE)
- **Web deployment** — no additional code; convert terminal TUI to browser

### Posting v2.0+ (March 2026)
**Source:** darren.codes/posts/posting2/

- Modern HTTP client TUI in Textual (Darren Burns, Textual core)
- **v2.0 features:** Scripting, custom keymaps, local YAML request storage
- **Latest:** v2.10.0 (March 25, 2026)

**369 validation:** Proves TUI + API-client convergence; kitchen-sink tools now viable in terminal.

### Toad — AI Coding Terminal (Will McGugan, 2025)
**Source:** github.com/batrachianai/toad

- **Creator:** Will McGugan (Textual author)
- **Purpose:** Universal UI for agentic coding — OpenHands, Claude Code, Gemini CLI
- **Architecture:** Modular; Agent Client Protocol (ACP) over JSON stdin/stdout
- **Features:** Markdown rendering, fuzzy file search, prompt editor, shell passthrough
- **Releases:** Announced July 2025, stable by Dec 2025 (OpenHands partnership)
- **Zero flicker** — character-level screen updates (vs full redraws)

**369 takeaway:** **AI-native UX is not speculative.** Toad proves agentic coding *prefers* TUI to web (zero flicker, SSH-native, low-latency, scriptable). This validates the core 369 thesis that TUIs are *preferred* modality for programmatic interaction.

---

## Interactive Filtering — fzf at Scale

### fzf v0.73.1 (May 2026)
**Source:** github.com/junegunn/fzf

Recent versions document continuous filtering-UI innovation:

| Version | Date | Notable changes |
|---------|------|-----------------|
| v0.73.0 | May 2026 | Nushell integration; preview-window=next layout; timer-driven `every(N)` events |
| v0.72.0 | April 2026 | Border styles (dashed); header-border inline; VimResized event |
| v0.71.0 | April 2026 | Cross-reload item identity (`--id-nth`); **multicore linear scaling**; improved shell integration |
| v0.70.0 | March 2026 | Dynamic option changes (`change-with-nth`, `change-header-lines`); **1.3–1.9× filter speedup** |
| v0.68.0 | Feb 2026 | Word-wrapping (`--wrap=word`); underline variants; fish completion |
| v0.67.0 | Nov 2025 | Frozen columns (`--freeze-left/right=N`); spinner in `--info=inline` |
| v0.66.0 | Oct 2025 | Raw mode (unfiltered + dimmed non-matches); Unix-domain socket in `--listen` |

**369 validation:** fzf proves **selection UIs don't plateau**. Continuous innovation in filtering UI 2024–2026.

---

## Modern CLI/TUI Ecosystem — Validated Tools

### delta (git diff TUI) — dandavison/delta
**v0.19.0** (March 25, 2025):
- External subcommand support (rg, diff, git-show)
- Hyperlink `{host}` placeholders
- Ripgrep JSON support
- New themes: weeping-willow, mirthful-willow
- Auto dark/light detection (v0.18.0, Aug 2024)

### bat — sharkdp/bat
**v0.26.1** (Dec 2025):
- Paging for `-h` / `--list-themes`
- Negative line ranges (`bat -r :-10`)
- Context support in ranges
- Built-in `minus` pager option
- Windows/ARM64 support

### eza (modern ls) — eza.rocks
- Hyperlink display, mount-point info, SELinux context
- Git integration (status visibility)
- Human-readable relative dates
- "Grid Bug" fix from exa era
- Bright color support; requires Rust 1.70.0+

**369 takeaway:** delta + bat + eza form an **ecosystem sandwich** — they assume each other's existence and play together cleanly. The 369 design language should similarly assume a 369-aware tool ecosystem.

---

## Lazyverse — Domain-Specific TUIs

| Tool | Version | Maintainer | Purpose |
|------|---------|------------|---------|
| **lazygit** | 37k stars | Jesse Duffield | Git porcelain |
| **lazydocker v0.25.2** | April 2026 | Jesse Duffield | Docker management |
| **lazysql** | active | Various | DB query TUI |
| **lazynpm** | active | Jesse Duffield | NPM management |
| **lazyssh** | active | Various | SSH connection manager |

**lazydocker v0.25.2 features:**
- Numbers-based navigation (parity with lazygit)
- Panel-jump keybindings in titles
- Docker Compose projects support
- Remote daemon over SSH (fixed v0.24.1, Nov 2024)

All built on Bubble Tea + Lip Gloss — proving the toolkit's viability for domain-specific tools across an entire genre.

---

## Shell History + Runbook Automation — Atuin

### Atuin v18.16.1 (May 2026)
**Source:** atuin.sh

- **CLI** — free, open-source shell history with **end-to-end encryption**
- **Desktop (beta)** — executable runbooks (CRDT-powered, local-first); **NOT** E2E encrypted yet
- **AI features** — skill discovery, tool execution, write/edit files with timeouts
- **Config** — new `atuin config` subcommand, mouse-support toggle, trailing-whitespace strip
- **Shell support** — Xonsh, fish, PowerShell, Nushell improvements
- **Stats** — 25k stars, 230+ contributors, 220M commands synced, 200k developers

**369 relevance:** Atuin Desktop proves **TUI → runbook convergence**. The execution context is expanding beyond "interactive editor for one user" toward "multi-user, multi-context, replayable history."

---

## GitHub CLI Evolution

**gh (GitHub CLI)** — github.com/cli/cli

- **Experimental TUI Prompter** (v2.89.0) — charmbracelet/huh-powered interactive selection
- **Reviewer / Assignee search** — searchable selection in `gh pr create` / `edit`
- Community projects (`gh dash`, `gh pr view` standalone TUIs) not in official releases

---

## Additional Infrastructure

### Helix Editor — biannual releases
**v25.07** (July 2025), v25.01 (Jan 2025), v24.07 (July 2024), v24.03 (March 2024).

Rust-based modal editor. Proves TUI viability for **complex editing** (not just CLI tools).

### Zellij v0.44.3 (May 2026)
**Source:** zellij.dev

- Native Windows support (v0.44.0, March 2026)
- Layout Manager interface
- Terminal-to-terminal HTTPS attachment
- Theme switching via CSI 2031 (v0.44.2, May 2026)
- **Web client** with auth + HTTPS (v0.43.0, Aug 2024)

### Notcurses v3.0.17 (Oct 2024)
- **Octant blitter** (`NCBLIT_4x2`) via Unicode 16 — 8 pixels per cell
- QR code refinements
- Windows / Mac build fixes

---

## Emerging Patterns + New Tools

### Terminal Trove additions (2024–26)
terminaltrove.com curated list:
- **quien** — whois + domain intelligence
- **kite-tui** — Kagi News TUI
- **har-viewer** — HTTP Archive inspector
- **diffyml** — YAML diff with K8s intelligence
- **hulak** — API testing, encrypted secrets

### Superfile (modern file manager)
**v1.3–1.5** — github.com/yorukot/superfile
- Built on Bubble Tea + Lip Gloss
- Multi-panel startup
- Video / PDF preview (v1.4.1+)
- Shell-command stdout integration
- Trending hard; active 2024–26 development

---

## Currently Active Maintainers (verified 2026)

| Project | Maintainer | Status |
|---------|------------|--------|
| **Charm ecosystem** | Will McGugan + Charm team | Active; charm.land |
| **Bubble Tea** | Amir Salimian + Charm | v2 released Feb 2025 |
| **Kitty** | Kovid Goyal | Active; quarterly releases |
| **WezTerm** | Wez Furlong | Active |
| **Ghostty** | Mitchell Hashimoto | Active; Windows in progress |
| **fzf** | Junegunn Choi | Active; monthly releases |
| **Ratatui** | Community (forked from tui-rs) | Active; v0.30 Dec 2024 |
| **Helix** | Community + core team | Biannual cadence |
| **Zellij** | Community-driven | Active |
| **Atuin** | Conrad Ludgate + team | Active; 25k stars |
| **Textual** | Will McGugan | Active (post-company wrap, 2025) |
| **lazygit** | Jesse Duffield | Active |
| **htop** | htop-dev community | Active |
| **btop** | Aristocratos | Active |
| **Notcurses** | Dank | Active |

---

## Identified 2026 Gaps Still Requiring Research

1. **Accessibility in v2 frameworks** — how are screen readers integrated into Bubble Tea v2 / Lip Gloss v2 / Textual?
2. **Mobile TUI** — Ghostty / WezTerm on iOS/Android progress unclear
3. **WebAssembly TUI** — Textual WASM roadmap status (promised 2026)
4. **Production TUI analytics** — do production apps report usage (privacy-first)? Mostly no metrics public.
5. **Cross-platform keybinding standardization** — still fragmented per emulator
6. **AI-TUI integration patterns** — beyond Toad; how do agents interact with legacy tools?

---

## Validation vs. Previous Research — No Major Contradictions

Confirmed trends from earlier waves:
1. **Charm ecosystem dominance** — v2 releases cement Go + Bubble Tea as standard ✓
2. **Rust TUI maturity** — Ratatui no-std validates embedded trajectory ✓
3. **Python resurgence** — Textual + web deployment proves viability beyond CLI ✓
4. **Terminal emulator convergence** — Ghostty entry validates feature parity across platforms ✓
5. **Composable tools** — delta + bat + eza form ecosystem sandwich (predicted) ✓

No major shifts:
- **ncurses still relevant** — Ratatui + Notcurses maintain compatibility ✓
- **TUI ≠ Web** — Textual web mode is opt-in, not replacement ✓
- **"TUI is dead" narrative refuted** — Toad AI is proof ✓

---

## 369 Design System — Modern Implications

1. **v2 frameworks validate component-driven architecture.** Bubble Tea + Lip Gloss composability proves 369's modular thesis. Lip Gloss v2's compositing API directly maps to 369 PILLARS / BASE assembly.

2. **Emulator feature parity enables cross-platform guarantees.** Ghostty / Kitty / WezTerm alignment reduces dialect risk. 369 TUIs can rely on truecolor + Kitty keyboard + sync output as floor.

3. **Rust + Go bifurcation is healthy.** Ratatui (Rust, immediate-mode, no-std) and Bubble Tea (Go, MVU) serve different performance envelopes. No need to pick one.

4. **AI-native UX is not speculative.** Toad proves agentic coding *prefers* TUI to web. 369 should explicitly document agent-friendly composition patterns.

5. **Execution context is expanding.** Atuin Desktop → runbooks signal TUI ↔ agent communication maturation. 369 may need an "agent-collaboration" canon entry.

---

## See Also

- [[tui-frameworks-complete]] — Broader framework catalog (less time-bounded)
- [[terminal-capabilities]] — Protocol layer that modern terminals expose
- [[tui-patterns]] — Interaction patterns these tools embody
- [[tui-academic]] — Scholarly grounding (Reunanen, Botz, "Terminal Is All You Need")
- [[historical-tuis]] — Predecessors (lazygit lineage, htop → btop, Vim → Helix)

---

## Sources

- charm.land/blog/v2 — Bubble Tea + Lip Gloss v2 announcement (Feb 2025)
- github.com/charmbracelet/bubbletea — Bubble Tea releases
- github.com/charmbracelet/lipgloss — Lip Gloss releases
- github.com/charmbracelet/bubbles — Bubbles components
- github.com/charmbracelet/gum — Gum shell-script UI
- github.com/charmbracelet/huh — Huh forms
- github.com/charmbracelet/glow — Glow markdown viewer
- github.com/charmbracelet/pop — Pop terminal email
- github.com/charmbracelet/vhs — VHS screencaster
- github.com/ghostty-org/ghostty — Ghostty terminal
- sw.kovidgoyal.net/kitty/changelog/ — Kitty releases
- wezterm.org — WezTerm
- codeberg.org/dnkl/foot — Foot terminal
- github.com/ratatui/ratatui — Ratatui
- helix-editor.com — Helix releases
- zellij.dev — Zellij multiplexer
- github.com/aristocratos/btop — btop
- github.com/dankamongmen/notcurses — Notcurses
- textualize.io — Textual framework
- darren.codes/posts/posting2/ — Posting v2
- github.com/batrachianai/toad — Toad AI assistant
- github.com/junegunn/fzf — fzf
- github.com/dandavison/delta — Delta git diff
- github.com/sharkdp/bat — Bat
- eza.rocks — Eza
- github.com/jesseduffield/lazydocker — Lazydocker
- atuin.sh — Atuin shell history + runbooks
- github.com/cli/cli — GitHub CLI
- terminaltrove.com — Curated TUI directory
- github.com/yorukot/superfile — Superfile
- github.com/rothgar/awesome-tuis — Awesome TUIs
