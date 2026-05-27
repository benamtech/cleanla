# TUI Design Canon — Terminal User Interfaces

> **The terminal is the strictest 369 environment.** It enforces zero border-radius, no shadows, no gradients, 1px borders via box-drawing characters, and a character-cell grid that is already a spacing system. The task in TUI design is not to fight the terminal's constraints — it is to recognize that those constraints *are* the 369 philosophy executed in hardware.

This canon covers: the terminal rendering model, the three dominant framework archetypes (Textual, Ratatui, Bubbletea), the Elm Architecture pattern, CLIG design principles, brandur's argument for terminals as the exemplary interface, and the 369→TUI rule mapping.

---

## The Terminal Rendering Model

### What Actually Happens on Screen

A terminal emulator is a grid of cells. Each cell holds one character (or one half/full-width glyph), a foreground color, a background color, and an attribute bitmask (bold, italic, underline, dim, strikethrough, blink). The cursor can be positioned to any cell with ANSI escape codes.

**The three drawing primitives:**
1. **ANSI escape codes** — position cursor, set colors, set attributes: `\x1b[<row>;<col>H` (cursor position), `\x1b[38;2;<r>;<g>;<b>m` (true-color foreground), `\x1b[0m` (reset)
2. **Box-drawing characters** — `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼` (U+2500–U+257F). These *are* the 1px border.
3. **Block elements** — `█ ▀ ▄ ▌ ▐ ░ ▒ ▓` for crude pixel art or progress bars.

### True Color vs. Color Profiles

Terminals have a capability hierarchy:
- **TrueColor (24-bit):** `\x1b[38;2;R;G;Bm` — full 16M palette. Default in modern terminals (iTerm2, Alacritty, Kitty, Windows Terminal ≥ 1909, most tmux configs if `set -g default-terminal "tmux-256color"` and `set-option -ga terminal-overrides ",xterm-256color:Tc"`).
- **256-color (8-bit):** `\x1b[38;5;Nm` — closest named color selected. Fallback for older environments.
- **16-color (4-bit):** The original 8 ANSI colors + 8 bright variants. Themes like Solarized/Nord are optimized for this.
- **Monochrome:** No color. Accessibility mode, screen readers, piped output.

Good TUI libraries (Lipgloss, Rich) detect the terminal's color profile at startup and automatically **downsample** to the nearest available color. Never hardcode ANSI 256-color indices — use hex tokens and let the library handle downsampling.

### Animation: Overwrite, Don't Clear

The canonical pattern for terminal animation (from Textualize's engineering):

1. **Capture the cursor** (`tput sc` or `\x1b[s`)  
2. **Draw your frame** (N lines of text)
3. **Restore the cursor** (`tput rc` or `\x1b[u`)
4. **Draw the next frame** (overwrite in-place)

This avoids the flicker of `clear` (`\x1b[2J\x1b[H`) because erasing and redrawing all happen in one pass. The terminal emulator sees one contiguous write, not a clear followed by a draw. The **Synchronized Output** protocol (DCS sequence `\x1bP=1s\x1b\\` ... `\x1bP=2s\x1b\\`) tells the emulator to buffer all output until the end signal, guaranteeing atomic frame presentation.

**Key constraint:** issue the entire frame as a **single write syscall**. Multiple small writes = multiple partial frame renders = flicker.

### Layout Math: Fractions, Not Floats

Character cells are integer units. When dividing terminal width across columns:
- Use integer floor division with explicit remainder distribution, not floating-point division
- Python: use `fractions.Fraction` for intermediate calculations to avoid float rounding errors before converting back to int
- Example: 3 columns in an 80-wide terminal → `26, 27, 27` (not `26.66...` each)

---

## Three Framework Archetypes

### Textual (Python) — CSS-Like Mental Model

**Repository:** [github.com/Textualize/textual](https://github.com/Textualize/textual)  
**Philosophy:** A browser-like component model in the terminal. You write Python classes with a `compose()` method that yields widget instances and a `DEFAULT_CSS` class variable that is a subset of CSS (flexbox, grid, padding, margin, display, visibility, z-index). Textual handles layout, event dispatch, and rendering.

**Mental model fit for 369:** Closest of the three to 369's own HTML/CSS output model. The DOM tree maps to BASE (primitives) → PILLARS (sections) → ROOF (screens). CSS properties map directly to 369 visual rules.

**Key lessons from Textual engineering:**
1. `@lru_cache` aggressively on anything computed from state that doesn't change — terminal layout is expensive, Python is not fast
2. Immutable data structures for widget props — mutation is the source of most rendering bugs
3. Unicode box characters (not ASCII `+`, `-`, `|`) for all borders — they compose correctly at intersections
4. Emoji restricted to Unicode 9.0 code points — later additions have unreliable width (emoji 12/13 can be 1 or 2 cells wide depending on terminal)
5. Use `Fraction` for any intermediate layout calculation before converting to integer cell counts

**When to reach for Textual:** Python environment, rich UI (multiple panels, tabs, forms, trees), CSS-familiar team, prototyping speed matters.

### Ratatui (Rust) — Immediate-Mode Rendering

**Repository:** [github.com/ratatui/ratatui](https://github.com/ratatui/ratatui)  
**Philosophy:** Draw the full UI from scratch every frame. No retained widget state; no diffing; the render function receives a `Frame` and describes the complete screen. The library handles diffing internally before writing to the terminal.

```rust
fn render(frame: &mut Frame, state: &AppState) {
    let layout = Layout::horizontal([
        Constraint::Percentage(30),
        Constraint::Fill(1),
    ]);
    let [sidebar, main] = layout.areas(frame.area());
    frame.render_widget(List::new(state.items.iter()), sidebar);
    frame.render_widget(Detail::new(&state.selected), main);
}
```

**Constraint-based layout (flexbox analogue):**
- `Constraint::Length(N)` — fixed N cells
- `Constraint::Percentage(N)` — N% of available space
- `Constraint::Fill(N)` — fill proportional share (like `flex-grow`)
- `Constraint::Min(N)` / `Constraint::Max(N)` — bounded flexible

**Performance:** Sub-millisecond render times. Ratatui does a cell-by-cell diff between last frame and current frame before issuing any terminal writes — only changed cells generate escape codes. A static screen with one changing counter issues ~10 escape sequences, not a full redraw.

**Widget library:** Sparklines, bar charts, scatter plots, line charts, tables, gauges, progress bars, calendars, paragraphs, lists, tabs, block/border compositions.

**When to reach for Ratatui:** Rust environment, performance-critical (games, real-time monitoring), need precise control over every cell, no Python/Go available.

### Bubbletea / Charm Stack (Go) — Elm Architecture

**Repository:** [github.com/charmbracelet/bubbletea](https://github.com/charmbracelet/bubbletea)  
**Philosophy:** The Elm Architecture applied to terminal programs. An app is a pure function from Model → View and a reducer from (Model, Msg) → (Model, Cmd). The runtime handles event polling, re-rendering, and command execution.

**Core interface:**
```go
type Model interface {
    Init() tea.Cmd                      // Initial command (e.g., fetch data)
    Update(tea.Msg) (tea.Model, tea.Cmd) // Event → new model + next command
    View() string                        // Model → rendered string
}
```

The runtime calls `View()` after every `Update()` and diffs the result against the previous render before writing to the terminal.

**Composability:** Sub-models for complex layouts. A `Model` field on a parent model is itself a `Model`. The parent `Update` delegates to child `Update` by message type, and the parent `View` composes child `View` calls.

**Lipgloss (styling for Bubbletea):**
```go
// Pure value types — no global state
style := lipgloss.NewStyle().
    Bold(true).
    Foreground(lipgloss.Color("#001089")).   // navy
    Background(lipgloss.Color("#f8eac7")).   // manila
    Padding(0, 1).                           // top/bottom 0, left/right 1 char
    Border(lipgloss.NormalBorder(), true)    // 1-char border all sides

rendered := style.Render("WINDOW BAR")
```

Lipgloss automatically detects the terminal's color profile and downsamples `#001089` to the nearest 256-color or 16-color equivalent if true-color is unavailable.

**When to reach for Bubbletea:** Go environment, clean architecture matters, building composable TUI components as a library.

---

## The Elm Architecture — Deep Reference

The Elm Architecture (ELM) is the dominant mental model for TUI programs that handle user interaction. It eliminates a class of bugs by making state mutation impossible — the only way state changes is through the `Update` function.

### The Three Functions

**Model** — all application state, as a pure value:
```go
type Model struct {
    jobs      []Job
    cursor    int
    selected  *Job
    loading   bool
    err       error
}
```
The model is the single source of truth. It is immutable in the sense that `Update` returns a new model rather than mutating the existing one.

**Update** — events → new model + optional command:
```go
func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "j", "down":
            m.cursor = min(m.cursor+1, len(m.jobs)-1)
        case "k", "up":
            m.cursor = max(m.cursor-1, 0)
        case "enter":
            return m, fetchJobDetail(m.jobs[m.cursor].ID)
        case "q":
            return m, tea.Quit
        }
    case JobDetailMsg:
        m.selected = &msg.Job
        m.loading = false
    case errMsg:
        m.err = msg.err
    }
    return m, nil
}
```

Commands are async operations (HTTP requests, file reads, timers) that return a `Msg` when done. They are the only way to produce side effects.

**View** — model → string:
```go
func (m Model) View() string {
    if m.loading {
        return "LOADING…"
    }
    rows := make([]string, len(m.jobs))
    for i, job := range m.jobs {
        prefix := "  "
        if i == m.cursor { prefix = "▶ " }
        rows[i] = prefix + job.Title
    }
    return strings.Join(rows, "\n")
}
```

View is a pure function. Same model always produces the same string. The runtime diffs consecutive views and issues only the changed escapes.

### Immediate-Mode vs. Retained-Mode

| Aspect | Immediate-mode (Ratatui) | Retained-mode (Textual, Bubbletea) |
|--------|--------------------------|-------------------------------------|
| Widget state | None — redrawn from scratch | Held in model or widget object |
| Mental model | Paint function | Component tree |
| Debugging | Trace the render path | Inspect widget state |
| Composability | Functions compose | Objects/models compose |
| Performance ceiling | Very high (diff done by library) | Good (library optimizes diffs) |
| Best for | System dashboards, games | Forms, multi-panel apps, editors |

---

## CLIG Design Principles

Source: [clig.dev](https://clig.dev) — the canonical CLI/TUI design guideline.

### Human-First Design

Design for humans first. When output is to a TTY (interactive terminal), optimize for readability. When piped, optimize for machines. Detect with `isatty(stdout)` and switch behavior automatically.

- **TTY:** colors, progress bars, aligned columns, human-readable sizes (`1.2 MB`), relative times (`3 min ago`)
- **Piped:** raw values, no colors, no progress bars, machine-parseable (TSV/JSON with `--output json`)

Respect `NO_COLOR` env var (from [no-color.org](https://no-color.org)) — when set, disable all ANSI color output regardless of TTY detection.

### Output Design Rules

1. **Print to stdout; errors/status to stderr.** Stdout is for data. Stderr is for progress, warnings, errors.
2. **Never print more than necessary.** Default to terse. Verbose with `--verbose` / `-v`.
3. **If the output is empty, say so.** `No results.` is better than silence.
4. **Use consistent structure.** Same columns, same order, every invocation. Piping should work.
5. **Never mix progress with data.** Draw progress to stderr only.
6. **When there is something interesting going on, show it.** Use status lines that update in-place.

### Argument and Flag Conventions

| Pattern | Form | Example |
|---------|------|---------|
| Positional | `command <arg>` | `rm file.txt` |
| Flag (boolean) | `--flag` / `--no-flag` | `--verbose` / `--no-color` |
| Option (value) | `--option=value` or `--option value` | `--output json` |
| Short flag | `-f` (single char, common flags only) | `-v`, `-h`, `-n` |
| Multiple values | `--tag a --tag b` OR `--tag a,b` | Both are acceptable |

**Standard flag names (always these, never invent synonyms):**
- `--help` / `-h` — show help
- `--version` / `-V` — show version
- `--verbose` / `-v` — verbose output
- `--quiet` / `-q` — suppress all output except errors
- `--output` / `-o` — output file or format
- `--debug` — debug output (more than verbose)
- `--no-color` — disable colors (alternative to `NO_COLOR` env)
- `--dry-run` / `-n` — show what would happen without doing it
- `--force` / `-f` — skip confirmation prompts
- `--yes` / `-y` — answer yes to all prompts

### Configuration Precedence Hierarchy

From highest to lowest priority (flags always win; system config always loses):

```
1. flags / command-line arguments   ← --output=json overrides everything
2. environment variables            ← MY_APP_OUTPUT=json
3. project-level config             ← .myapp.json / myapp.toml in cwd
4. user-level config                ← ~/.config/myapp/config.toml (XDG)
5. system-level config              ← /etc/myapp/config.toml
6. application defaults             ← hardcoded in binary
```

Follow the **XDG Base Directory Specification:**
- Config: `$XDG_CONFIG_HOME` (default `~/.config`)
- Data: `$XDG_DATA_HOME` (default `~/.local/share`)
- Cache: `$XDG_CACHE_HOME` (default `~/.cache`)
- Runtime (sockets, locks): `$XDG_RUNTIME_DIR`

### Interactivity Rules

- Detect TTY before showing interactive prompts. Never prompt when stdin is piped.
- Provide `--no-input` / `--yes` flags to skip all prompts for automation.
- When a required value is missing, prompt interactively if TTY; error if not.
- Confirm destructive operations by default. `--force` to skip.
- Show progress for operations > 2 seconds.

---

## brandur's Argument: Terminals as the Exemplary Interface

Source: [brandur.org/interfaces](https://brandur.org/interfaces)

brandur argues that terminals represent the **ideal** interface archetype, not a legacy workaround. The argument:

**What terminals do right:**
1. **Speed.** The terminal responds instantly. No loading states for UI actions; no waiting for JavaScript to hydrate. The interface is the computation.
2. **Composability.** `grep | sort | uniq | head` — individual tools compose arbitrarily. No modern GUI framework achieves this.
3. **Consistency.** Shell scripts written in 1990 run today. Terminal apps from 2010 feel the same in 2026. Modern web apps from 2020 are already broken.
4. **Designed for mastery.** Keyboards are faster than mice for expert users. Terminals assume expertise is the goal, not the exception.

**The modern web interface's failure modes:**
- Optimizes for first-time users at the expense of experts
- Prioritizes aesthetics (animations, rounded corners, shadows) over information density
- Breaks constantly (JavaScript dependency rot, API changes, auth expiration)
- Cannot be composed or scripted
- Requires constant attention and clicks for tasks that should be one command

**The synthesis:** Future interfaces should have terminal speed, responsiveness, and composability while adding modern capabilities (rich media, accessibility, multi-device). The 369 design system moves in this direction — the same `presentation()` engine works for desktop HTML and could emit ANSI terminal output with `medium: 'terminal'`.

**Design for mastery:** Build features for users who will use your tool every day, not first-time users who will never return. The expert path should be the fast path. Discoverability is a documentation problem, not a UX simplification problem.

---

## 369 → TUI Rule Mapping

How each of the 9 non-negotiable 369 rules maps to terminal constraints:

| 369 Rule | Web form | Terminal form |
|----------|----------|---------------|
| **1. Multiples of 3 spacing** | `padding: 9px`, `gap: 12px` | `padding=(0, 3)` in chars. 3-char increments: 0, 3, 6, 9. A "1-char pad" (most common) is ≈ 9px at 9px/char — acceptable exception for single-char left/right inset |
| **2. Zero border-radius** | `border-radius: 0` | Enforced by physics. Box-drawing characters are square. No exception needed. |
| **3. 1px border** | `border: 1px solid #999999` | Single box-drawing chars: `─ │ ┌ ┐ └ ┘`. Unicode box-drawing = 1-cell border. Grey maps to ANSI bright-black or 256-color `#999999`. |
| **4. Type scale multiples of 3** | 9px / 12px / 15px / 18px / 24px | Character cells are already discretized. Bold (`\x1b[1m`) for headings; normal for body. Uppercase labels enforced via `.upper()` / `strings.ToUpper()`. |
| **5. Color tokens only** | `#001089` (navy), `#999999` (grey), etc. | Map to true-color ANSI with auto-downsampling. Token map: `NAVY=#001089`, `GREY=#999999`, `WHITE=#FFFFFF`, `MANILA=#f8eac7`, `AMBER=#c7a87d`, `HEADER_TOP=#94a3d6`, `HEADER_CURRENT=#b8dae8`, `SUCCESS=#228B22`, `WARNING=#a60315`. |
| **6. No decoration** | No shadows, gradients, rounded corners | Already enforced. Terminal has no shadow or gradient primitives. Background colors only fill cells. |
| **7. Run engines, don't guess** | `presentation(data, intent, 'desktop')` | `presentation(data, intent, 'terminal')` — add `medium: 'terminal'` to the engine. Engines should emit ANSI HTML or a widget spec, not a chart type guess. |
| **8. Same input → same output** | Deterministic render | Same Model → same `View()` string. The Elm Architecture enforces this structurally. |
| **9. BASE → PILLARS → ROOF hierarchy** | Sections separated by `border-b border-[#999999]` | Sections separated by `─` horizontal rules or box-drawing borders. PILLARS = layout panels. ROOF = top panel (window bar equivalent). BASE = widget primitives (list items, badges, table rows). |

### New TUI-Specific Rules

These extend the 369 system for the terminal medium:

**T1. Medium declaration.** All engine calls must pass `medium: 'terminal'`. This routes to ANSI-aware renderers. Do not call `presentation(data, intent, 'desktop')` for terminal output.

**T2. Character-cell grid alignment.** All layout divides terminal width/height in whole characters. Use constraint-based layout (Constraint::Length, ::Percentage, ::Fill); never float arithmetic for cell counts.

**T3. Color profile auto-detection.** Never hardcode ANSI color indices. Use hex token values and let the framework downsample. Respect `NO_COLOR` env var — fall back to bold/underline attributes for emphasis when color is disabled.

**T4. Unicode box-drawing only.** Borders use Unicode box-drawing characters (U+2500–U+257F), not ASCII `+`, `-`, `|`. ASCII fallback is allowed only when a legacy terminal (VT100, old SSH session) is detected via `$TERM`.

**T5. No emoji past Unicode 9.0.** Restrict to code points ≤ U+1F6FF in terminal output. Characters from Emoji 10+ (U+1F90X and above) have unstable cell widths across terminal emulators. Use text glyphs: `★ ✓ ✕ → ← •` instead.

**T6. Single write per frame.** Compose the full frame as one string, then write in a single syscall. Multiple small writes produce flicker. Use Synchronized Output protocol when available.

**T7. Stdin/stdout hygiene.** Log to stderr. Data to stdout. Interactive UI draws to the TTY directly (bypassing stdout when piped) via `/dev/tty` or equivalent. A piped invocation should never draw TUI chrome — fall back to plain text output.

---

## Framework Selection Guide for 369 Projects

| Need | Reach for |
|------|-----------|
| Python environment, rich UI, CSS-familiar | **Textual** |
| Rust environment, maximum performance, precise control | **Ratatui** |
| Go environment, clean architecture, composable components | **Bubbletea + Lipgloss** |
| Quick script with colored output only (no layout) | **Rich (Python)** or **Lipgloss standalone (Go)** |
| Node.js / TypeScript environment | **Ink** (React for terminals) — not yet in 369 canon |

---

## Reading List

- [clig.dev](https://clig.dev) — Canonical CLI design guidelines (comprehensive, regularly updated)
- [Textual docs](https://textual.textualize.io) — Full API reference + tutorial
- [Ratatui book](https://ratatui.rs/tutorial/) — Immediate-mode rendering deep-dive
- [Bubbletea tutorial](https://github.com/charmbracelet/bubbletea/tree/master/tutorials) — Elm Architecture walkthrough
- [Lipgloss README](https://github.com/charmbracelet/lipgloss) — Styling reference
- [brandur.org/interfaces](https://brandur.org/interfaces) — Terminal as exemplary interface essay
- `references/canon/unix-cli-principles.md` — ESR's 17 Unix rules + CLI design patterns
