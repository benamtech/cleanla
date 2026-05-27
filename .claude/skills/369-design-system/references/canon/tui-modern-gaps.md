# 2024–2026 TUI Gaps Filled — Accessibility, Mobile, WASM, Analytics, Keyboard, AI

> **Six gaps identified in my own prior canon are now answered.** Accessibility in v2 frameworks. Mobile TUI status. WebAssembly TUI viability. Production telemetry practices. Cross-platform keybinding standardization. AI-TUI integration patterns beyond Toad. This page closes each gap with verified 2024–2026 evidence — and explicitly marks what remains unsolved.

For the parent ecosystem document, see [[tui-modern-2026]]. For accessibility deep-dive, see [[tui-patterns]]. For the meta-context, see [[knowledge-bounds]].

---

## 1. Accessibility in v2 Frameworks

**Verdict: Unsolved.** Accessibility-by-terminal-default remains the largest open problem in modern TUI development.

### Bubble Tea
- **Issue #780** — github.com/charmbracelet/bubbletea/issues/780 — requests screen-reader support
- **v2 roadmap commitment:** none documented
- **NVDA, JAWS, Orca, VoiceOver:** none integrate directly with TUI components

### Textual (Will McGugan)
- No WCAG-for-terminal spec exists
- ACM paper documents the gap: "Accessibility of Command Line Interfaces" (dl.acm.org/doi/10.1145/3411764.3445544)
- Terminal output is unstructured plain text → assistive tech infers structure from character matrix alone

### Why this is structurally hard
- **WCAG2ICT** provides no terminal-equivalent standard
- Researchers recommend HTML alt-docs for CLI help text because screen-reader users skip `--help` output
- **BRLTTY / Orca / JAWS:** No TUI-specific bindings. Linux Orca works desktop-wide but cannot parse TUI semantics (button vs label vs text)

### What's missing
- **VT escape sequence standardization for accessibility metadata** — no proposal
- **Terminal screen reader protocol** — unspecified

### 369 takeaway
Accessibility debt blocks enterprise adoption. TUI frameworks document *features*, not a11y compliance. **Integration deferred indefinitely.** A 369-aware TUI should:
1. Always pair color with text/glyph (Rule 6 already enforces this)
2. Emit semantically meaningful text descriptions on focus change
3. Provide HTML/plain-text alt-doc for help output
4. Document keyboard-only navigation explicitly

---

## 2. Mobile TUI

**Verdict: SSH/Mosh over remote — not native mobile TUI.** Native rendering on iOS/Android phone screens is undefined.

### Current mobile state (2024–2026)

| Tool | Platform | Approach |
|------|----------|----------|
| **Blink Shell** | iOS v18.5.1+ | Mosh-based SSH; renders remote tmux, vim, htop, Claude Code cleanly; orientation redraws |
| **Termux** | Android | Native tmux, vim, htop, lazygit, Python locally; no native widget library |
| **Prompt 3** | iOS | SSH client, robust |
| **Termius** | iOS / Android | SSH client, multi-device sync |
| **JuiceSSH** | Android | SSH client |

### What's missing
- **Native mobile TUI layout library** — none exists
- **Phone-aspect-ratio rendering spec** — undefined
- **Touch-friendly keybinding protocol** — undefined
- **Ghostty / WezTerm / Kitty mobile ports** — none announced 2024–2026
- Desktop terminal comparisons (dasroot.net/posts/2026/03/linux-terminal-emulators-alacritty-kitty-wezterm) ignore mobile entirely

### 369 takeaway
Mobile-first is **absent** in the TUI ecosystem. The workaround is bluetooth-keyboard + SSH/Mosh — a remoting strategy, not a platform. **369 should not target native mobile TUI as a deliverable.** Document remoting as the supported path.

---

## 3. WebAssembly TUI

**Verdict: Fragmented; Ratatui leads; Textual perpetually pending.**

### Ratatui WASM — three viable backends

| Backend | Status | Notes |
|---------|--------|-------|
| **ratatui-xterm-js** (aschey) | POC | github.com/aschey/ratatui-xterm-js — xterm.js backend; crossterm fork required; some features disabled for WASM |
| **ratatui-wasm-backend** (NfNitLoop) | Production-ready | github.com/NfNitLoop/ratatui-wasm-backend — emits ANSI escape sequences; runs in Node, Deno, JavaScript environments |
| **egui_ratatui** (gold-silver-copper) | Production-ready | github.com/gold-silver-copper/egui_ratatui — ratatui as egui widget; browser-deployable |

### Textual WASM
- **Promised 2026** at textualize.io
- **Status May 2026:** No release yet
- **Discussion:** github.com/Textualize/textual/discussions/2764 — PyScript/Pyodide experiments
- **Blocker:** threading unavailable in WASM breaks Textual's Worker model

### Bubble Tea WASM
- No official support
- No TinyGo compilation path documented

### Notcurses WASM
- Unconfirmed
- C library WASM binding unlikely

### libghostty WASM
- Ghostty not yet modularized as library
- No WASM build target

### 369 takeaway
WASM TUI as **glue** — embed TUI dashboards in web apps without reimplementing in HTML/CSS. **Ratatui leads.** For 369 dashboards needing browser deployment: pick ratatui-wasm-backend or egui_ratatui. Avoid Textual WASM in production until 2027 at earliest.

---

## 4. Production TUI Analytics

**Verdict: Telemetry adoption sparse; privacy-first patterns emerging.**

### Current state (2026)
| Tool | Telemetry | Privacy model |
|------|-----------|---------------|
| **Atuin** | Yes (encrypted) | E2E encrypted shell history sync |
| **lazygit** | No (confirmed) | None |
| **htop** | No | None |
| **btop** | No | None |
| **Toad** | No (confirmed) | None |

### Available infrastructure
- **otel-tui** (github.com/ymtdzzz/otel-tui) — observes OpenTelemetry traces in terminal (viewer tool, not collector)
- **PostHog + OpenTelemetry** (posthog.com/docs/llm-analytics/installation/opentelemetry) — possible integration; no CLI-specific examples
- **Aptabase** — mentioned in privacy-first circles; no TUI adoption confirmed

### Privacy standards (recommendation)
- **Opt-in** — explicit user consent
- **JSON inspection** — show the user what's being sent
- **Multiple opt-out paths:**
  - CLI flag (`--no-telemetry`)
  - Config file (`telemetry: false`)
  - Env var (`DO_NOT_TRACK=1`)

### What's missing
- **Industry-standard TUI analytics library** — none
- **Privacy-by-default template** — none
- **Encrypted anonymous usage aggregator** — Atuin is the only documented case

### 369 takeaway
Production TUI apps are largely **silent on usage**. No baseline metrics for adoption, churn, feature use. **Analytics infrastructure is absent.** 369 TUIs should default to no telemetry; if added, follow the privacy standards above.

---

## 5. Cross-Platform Keybinding Standardization

**Verdict: Kitty keyboard protocol won.** libtermkey deprecated; legacy fixterms stalled.

### Kitty Keyboard Protocol
**Spec:** github.com/kovidgoyal/kitty/blob/master/docs/keyboard-protocol.rst

**Adoption matrix (2026):**
| Emulator | Kitty kbd protocol |
|----------|---------------------|
| **Kitty** 0.26.1+ | ✓ Native |
| **WezTerm** | ✓ |
| **Ghostty** | ✓ |
| **Alacritty** | ✓ |
| **Foot** | ✓ |
| **iTerm2** | ✓ |
| **VS Code terminal** | ✓ |
| **Warp** | ✓ |
| **Rio** | ✓ |
| Plain xterm | ✗ |
| Older Terminal.app | ✗ |

**Blessed library** documents support: blessed.readthedocs.io/en/1.44.0/keyboard_kitty.html

### libtermkey (Paul "LeoNerd" Evans)
- **Status:** Maintenance mode (Debian: tracker.debian.org/pkg/libtermkey)
- **Last substantial update:** ~2020
- **Superseded by:** Kitty protocol
- **Designed for:** XTerm-style keypresses

### fixterms
- **Status:** No successor proposals identified
- **XTerm modified-key spec:** Stalled (invisible-island.net/xterm/modified-keys.html)

### Microsoft VT terminal compatibility
- **VT escape working group:** Active (github.com/microsoft/terminal)
- **Terminal.Gui requesting Kitty support:** Issue #4809

### v2/v3 versioning
Search results mention "v2" colloquially. **No versioned spec branches identified.** Kitty protocol evolves monolithically.

### 369 takeaway
**Keybinding interop is solved for modern terminals.** Plain xterm and older Terminal.app are unsupported. 369 TUIs can rely on:
- Kitty keyboard protocol detection (`CSI ? u` query)
- Fall back to legacy ESC-based parsing
- Document keyboard requirements explicitly

---

## 6. AI-TUI Integration Patterns Beyond Toad

**Verdict: AI-coding CLI tools proliferate.** Agent Client Protocol (ACP) standardizes agent-editor communication.

### The AI-TUI Landscape (2026)

| Tool | Creator | Approach |
|------|---------|----------|
| **Aider** | Paul Gauthier | aider.chat — pair programming in terminal; multi-file git workflows, diff-based edits |
| **AIChat** | sigoden | github.com/sigoden/aichat — all-in-one CLI (Shell Assistant, Chat-REPL, RAG); multi-provider |
| **OpenHands** | (formerly OpenDevin) | Autonomous software engineer; web + CLI entrypoints; sandboxed file/shell access |
| **mods** | Charm Bracelet | AI shell tool; CLI framework integration |
| **llm** | Simon Willison | Multi-provider LLM chat + plugins |
| **Claude Code** | Anthropic | Terminal-native CI/CD; TUI mode, hook execution, git integration |
| **Gemini CLI** | Google | Lesser adoption; undocumented TUI specifics |
| **Cursor terminal mode** | Cursor | Terminal-context aware code editor mode |
| **OpenCode** | (from leaked Claude Code) | March 2026 → 150K GitHub stars + 6.5M monthly active devs by mid-2026 |
| **Toad** | Will McGugan (Textual) | First Textual-based AI assistant |

### Agent Client Protocol (ACP)

**Spec:** agentclientprotocol.com/get-started/introduction

**Architecture:**
- JSON-RPC 2.0 over stdin/stdout
- **Bidirectional** — editors send requests ("refactor", "explain"); agents stream JSON-RPC notifications for real-time progress
- **File-system access opt-in** — agents request permission per operation
- **Handshake for sensitive ops** — explicit confirmation for destructive actions
- **Editors spawn agents as subprocesses** — process isolation
- **Supports MCP server reuse** — interoperability with Model Context Protocol

**Adopted by (2026):**
- Hermes Agent
- Cline
- Zed
- JetBrains
- Neovim
- Toad

### What's missing
- **Standardized agent discovery protocol** — no ACP registry
- **TUI-specific ACP implementation guide** — generic spec only
- **Privacy policy for agent telemetry** — unspecified
- **Model versioning in ACP handshake** — not part of v1 spec

### 369 takeaway
**AI-TUI defines the next-generation developer experience.** ACP enables **portable agents**. Claude Code → OpenCode migration proved protocol viability. **TUI is the deployment substrate for agentic workflows.**

A 369-aware AI tool should:
1. Use ACP as the communication layer
2. Render agent state with 369 composition rules
3. Render thinking-streams with appropriate density (avoid spammy progress)
4. Respect 369 palette for diff highlighting
5. Document keyboard surface for agent interaction (accept / reject / interrupt)

---

## Research Synthesis — What's Solved vs Unsolved

### Solved (2024–26)
- **Keybinding protocol** — Kitty wins; broad adoption
- **Mobile TUI** — via SSH/Mosh; Blink Shell + Termux mature
- **WASM TUI** — ratatui-wasm-backend production-ready
- **AI-TUI** — patterns established; ACP standardizes communication

### Unsolved
- **Accessibility** — no terminal screen-reader spec; WCAG inapplicable; frameworks silent
- **Analytics** — no privacy-first TUI telemetry standard; Atuin is the only documented case
- **Mobile native** — no iOS/Android TUI library; SSH/Mosh proxy only
- **Textual WASM** — promised 2026; delayed beyond May 2026 cutoff
- **Agent discovery** — ACP exists; no registry

### 369 Integration Path

1. **Accessibility layer** — Implement terminal a11y metadata via XTerm extensions or Kitty protocol addon. Pair color + text always (Rule 6 enforces).
2. **Analytics opt-in** — Privacy-first template; honor `DO_NOT_TRACK=1`; integrate otel-tui for trace export.
3. **ACP agent tooling** — Define 369-native agent persona; ACP server reference impl.
4. **Mobile-first** — Evaluate egui_ratatui + Blink Shell SSH proxy for unified UI; defer native mobile.
5. **WASM dashboards** — ratatui-wasm-backend for web-embedded 369 status dashboards.

---

## See Also

- [[tui-modern-2026]] — Parent ecosystem document
- [[tui-patterns]] — Interaction patterns including accessibility section
- [[terminal-capabilities]] — Kitty protocol details
- [[tui-frameworks-complete]] — Framework catalog
- [[knowledge-bounds]] — Meta-document on what canon knows / doesn't know

---

## Sources

- github.com/charmbracelet/bubbletea/issues/780 — Bubble Tea screen reader accessibility
- dl.acm.org/doi/fullHtml/10.1145/3411764.3445544 — "Accessibility of Command Line Interfaces" (ACM)
- github.com/blinksh/blink — Blink Shell iOS
- apps.apple.com/us/app/blink-shell-build-code/id1594898306 — Blink Shell App Store
- github.com/Textualize/textual/discussions/2764 — Textual WASM discussion
- github.com/aschey/ratatui-xterm-js — Ratatui xterm.js backend
- github.com/NfNitLoop/ratatui-wasm-backend — Ratatui WASM backend
- github.com/gold-silver-copper/egui_ratatui — Ratatui as egui widget
- github.com/ymtdzzz/otel-tui — OpenTelemetry TUI viewer
- posthog.com/docs/llm-analytics/installation/opentelemetry — PostHog OTel integration
- github.com/kovidgoyal/kitty/blob/master/docs/keyboard-protocol.rst — Kitty keyboard protocol spec
- blessed.readthedocs.io/en/1.44.0/keyboard_kitty.html — Blessed library Kitty protocol docs
- tracker.debian.org/pkg/libtermkey — libtermkey Debian tracker (deprecated)
- github.com/gui-cs/Terminal.Gui/issues/4809 — Terminal.Gui Kitty protocol request
- invisible-island.net/xterm/modified-keys.html — XTerm modified keys spec
- aider.chat — Aider AI pair programming
- github.com/sigoden/aichat — AIChat
- agentclientprotocol.com/get-started/introduction — Agent Client Protocol
- dasroot.net/posts/2026/03/linux-terminal-emulators-alacritty-kitty-wezterm — 2026 terminal comparison
