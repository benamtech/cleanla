# TUI Frameworks — The Complete Catalog

> **Eighteen TUI frameworks, seven languages, three rendering paradigms.** This page surveys every actively-maintained TUI library a 369-aware engineer might encounter or pick from. The 369 design philosophy is paradigm-agnostic — Rule 9 (BASE/PILLARS/ROOF) applies whether you're writing Textual CSS, immediate-mode Ratatui, or raw ncurses. This page tells you which framework fits which job, what its mental model is, and how to map 369 rules onto its API.

For terminal protocol fundamentals beneath these frameworks, see [[terminal-capabilities]]. For Elm Architecture deep dive + framework archetypes, see [[tui-design]].

---

## Framework Index (18 frameworks, 7 languages)

| # | Framework | Language | Paradigm | License | Stars (2026) |
|---|-----------|----------|----------|---------|--------------|
| 1 | **ncurses** | C | Procedural / retained | MIT-style | Universal |
| 2 | **notcurses** | C | Modern retained / cell | Apache | ~10k |
| 3 | **Textual** | Python | Reactive / CSS-styled | MIT | 23k+ |
| 4 | **Ratatui** | Rust | Immediate-mode | MIT | 20.2k |
| 5 | **Bubbletea** | Go | Elm (Model-Update-View) | MIT | 28k+ |
| 6 | **Urwid** | Python | Widget toolkit | LGPL | 3k+ |
| 7 | **Blessed** | Node.js | DOM-like retained | MIT | 12k |
| 8 | **Blessed-contrib** | Node.js | Dashboard extension | MIT | 5k+ |
| 9 | **Ink** | Node.js (React) | Virtual DOM | MIT | 27k+ |
| 10 | **FTXUI** | C++ | Functional reactive | MIT | 6.5k |
| 11 | **Rich** | Python | Output formatter | MIT | 50k+ |
| 12 | **prompt_toolkit** | Python | Hybrid prompt/TUI | BSD | 9k+ |
| 13 | **Lanterna** | Java | Swing-style widget | LGPL | 1.5k |
| 14 | **tview** | Go | Widget toolkit | MIT | 11k+ |
| 15 | **gocui** | Go | Minimalistic | BSD | 9k+ |
| 16 | **tcell** | Go | Cell-based primitive | Apache | 4.5k |
| 17 | **crossterm** | Rust | Cross-platform primitive | MIT | 3k+ |
| 18 | **console** | Rust | Output primitive | MIT | 600+ |

---

## The Three Rendering Paradigms

Before diving into individual frameworks, the categorization that *matters*:

### 1. Retained-mode (Widget tree persists across frames)
You build a tree of widget objects. The framework retains them. On state change, you mutate widgets and the framework diff-renders.

Frameworks: Textual, Urwid, Blessed, Blessed-contrib, Ink, FTXUI, Lanterna, tview

### 2. Immediate-mode (Re-render whole UI each frame)
You write a `render(state) → frame` function. The framework keeps no widget tree. Trivially testable; great for data-heavy displays.

Frameworks: Ratatui, Bubbletea (technically Elm/retained model but immediate-style view), gocui (semi)

### 3. Primitive / cell-based (You write the renderer)
The library gives you cell-level control (color, glyph, position) and an event loop, nothing else.

Frameworks: ncurses, notcurses, tcell, crossterm, console, termbox-go

**369 mapping:**
- Retained-mode: BASE = widget classes, PILLARS = compose() trees, ROOF = layout containers.
- Immediate-mode: BASE = atomic draw calls, PILLARS = render-helper functions, ROOF = the top-level render function.
- Primitive: You build all 3 layers yourself.

---

## 1. ncurses / curses (C — the universal floor)

- **Language:** C; Python `curses` module is a binding.
- **Paradigm:** Procedural, retained state, coordinate-based drawing.
- **Core API:** `initscr() → addstr() → refresh() → endwin()`.
- **Rendering:** Delta-based — only sends changed cells to terminal.
- **Best for:** legacy compatibility, embedded systems, scientific tools that must run on a serial terminal.
- **Avoid for:** modern UIs (no truecolor, ugly default look, manual layout).
- **Widget extras:** form, panel, menu sub-libraries (build forms, overlapping windows, menus).
- **Terminfo db:** ~200+ terminal entries — works on virtually any TTY.

```c
#include <ncurses.h>
int main() {
    initscr(); cbreak(); noecho(); keypad(stdscr, TRUE);
    mvaddstr(5, 10, "Hello, ncurses!");
    refresh(); getch();
    endwin();
}
```

**369 status:** Acceptable for legacy work; verbose for modern apps. Prefer notcurses or a higher-level framework.

---

## 2. notcurses (C — modern terminals)

- **Language:** C, with bindings to Ada/C++/Dart/Julia/Nim/Python/Rust/Zig/Raku.
- **Philosophy:** "Assume the maximum, step down when necessary" — opposite of ncurses' lowest-common-denominator approach.
- **Features:** Sixel + Kitty + Linux framebuffer graphics; full Extended Grapheme Cluster Unicode; sprites, video.
- **Mental model:** Cell-based with `ncplane` (a layered virtual surface).
- **Best for:** modern Linux/macOS TUIs that want bitmapped graphics in-terminal (dashboards, media players, visualization).
- **Avoid for:** Windows-only or legacy-terminal targets.

```c
notcurses_options opts = {};
struct notcurses* nc = notcurses_init(&opts, stdout);
ncplane_putstr(notcurses_stdplane(nc), "Hello, notcurses!");
notcurses_render(nc);
notcurses_stop(nc);
```

**369 status:** Strong choice for image-heavy TUIs. Maps to medium='terminal' via direct Kitty/Sixel emission.

---

## 3. Textual (Python — the CSS-styled reactive)

- **Language:** Python 3.7+; Mac, Linux, Windows, SSH, WebAssembly.
- **Creator:** Textualize.io (Will McGugan, also Rich's author).
- **Paradigm:** Reactive widget tree with declarative CSS (TCSS dialect).
- **Mental model:** React-like component tree + CSS styling. `compose()` returns widgets; reactive state triggers re-render.
- **Killer features:**
  - **TCSS** — real CSS-with-selectors for terminal styling
  - **Dev mode** — `textual run --dev` for live preview
  - **Web export** — same app in browser via Pyodide
  - **SSH-friendly** — runs over remote SSH
  - **Live reload** — code edits propagate without restart
- **Production users:** Toad (AI coding assistant), Posting (API client), Memray (Bloomberg profiler), Harlequin (SQL client), Dolphie (MySQL dashboard).

```python
from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Button

class MyApp(App):
    CSS = "Button { margin: 1 2; }"
    def compose(self) -> ComposeResult:
        yield Header()
        yield Button("Click", id="btn")
        yield Footer()
    def on_button_pressed(self, event):
        ...
MyApp().run()
```

**369 status:** *Excellent fit.* TCSS rules can directly enforce Rule 1 (spacing × 3), Rule 2 (`border-radius: 0`), Rule 5 (color tokens). The 369 type scale maps to TCSS `text-size`. The 369 box-drawing ruleset becomes the `border` properties. The reactive model satisfies Rule 8 (same input → same output) by construction.

---

## 4. Ratatui (Rust — the immediate-mode performance king)

- **Language:** Rust; Linux, macOS, Windows, WebAssembly.
- **Paradigm:** Immediate-mode — application owns all state; `frame.render_widget()` redraws everything each loop.
- **Backends:** Crossterm (default), Termion (Unix-only).
- **Widget catalog:** Paragraph, Block, Gauge, Chart, BarChart, Sparkline, List, Table, Tree, Tabs.
- **Layout:** Constraint-based — `Constraint::Percentage(N)`, `Constraint::Length(N)`, `Constraint::Min(N)`, `Constraint::Ratio(num, denom)`.
- **Production users:** Netflix, OpenAI, AWS, Vercel, Hugging Face. 26.3M crates.io downloads. 3,700+ dependent crates.

```rust
use ratatui::{prelude::*, widgets::*};
let backend = CrosstermBackend::new(std::io::stdout());
let mut terminal = Terminal::new(backend)?;
terminal.draw(|f| {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Length(3), Constraint::Min(0)])
        .split(f.size());
    let block = Block::default().title("369").borders(Borders::ALL);
    f.render_widget(Paragraph::new("Welcome").block(block), chunks[0]);
})?;
```

**369 status:** *Excellent fit.* Sub-millisecond rendering supports Rule 8 (deterministic). Constraint-based layout maps to 369's percentage-friendly proportions. `Borders::ALL` with `BorderType::Plain` is one-line for Rule 3 (`1px solid` equivalent). Best framework for high-rate data display.

---

## 5. Bubbletea (Go — Elm Architecture)

- **Language:** Go; Linux, macOS, Windows, WebAssembly.
- **Creator:** Charm (charmbracelet).
- **Paradigm:** Elm Architecture (MVU — Model, Update, View) — unidirectional data flow.
- **Companion libraries:** Bubbles (widgets — text input, table, viewport), Lipgloss (styling), Harmonica (animations), Wish (SSH-served apps).
- **Mental model:**
  - `Model` = your app state struct
  - `Init() Cmd` = optional startup command (timer, IO)
  - `Update(Msg) (Model, Cmd)` = pure-ish state transition
  - `View() string` = render the entire UI as a string each frame
- **Production users:** Trufflehog, Container-canary (NVIDIA), EKS-node-viewer (AWS), Glow, Huh?, CockroachDB. 18,000+ apps.

```go
type model struct{ count int }
func (m model) Init() tea.Cmd { return nil }
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    if k, ok := msg.(tea.KeyMsg); ok {
        switch k.String() {
        case "ctrl+c", "q": return m, tea.Quit
        case "up": m.count++
        case "down": m.count--
        }
    }
    return m, nil
}
func (m model) View() string { return fmt.Sprintf("Count: %d", m.count) }
func main() { tea.NewProgram(model{}).Run() }
```

**369 status:** *Excellent fit.* The Elm Architecture *structurally* enforces Rule 8 (View is a pure function of Model — same Model → same View, always). Lipgloss styling cleanly maps to 369 tokens. Bubbletea is the strongest framework match for the 369 deterministic philosophy. See [[tui-design]] for the full Elm Architecture treatment.

---

## 6. Urwid (Python — widget toolkit, multi-event-loop)

- **Language:** Python 3.9+; Linux, macOS, Cygwin, partial Win10+.
- **Paradigm:** Hierarchical widget tree with three widget sizes (BOX, FLOW, FIXED).
- **Unique strength:** Multiple event-loop backends — Twisted, GLib, Tornado, asyncio, trio, ZeroMQ.
- **Best for:** complex Python TUIs that need to share an event loop with another framework (e.g., asyncio + Twisted).
- **Less polished than Textual** for new projects; pick Urwid when you specifically need the event-loop integration.

```python
import urwid
header = urwid.Text("Todo", align='center')
listbox = urwid.ListBox(urwid.SimpleFocusListWalker([urwid.Text("Task 1")]))
frame = urwid.Frame(listbox, header=header)
urwid.MainLoop(frame).run()
```

**369 status:** Workable but not preferred over Textual unless event-loop integration is required.

---

## 7. Blessed (Node.js — pure-JS ncurses analog)

- **16,000+ lines of pure JS.** No native deps. Reimplements terminfo/termcap parsing.
- **Optimization:** Painter's algorithm with damage buffer (CSR/BCE rendering).
- **API style:** DOM-like — `screen`, `box`, `text` are elements with `parent`, `top`, `left`, etc.
- **Tagged-content syntax:** `'Hello {#0aa-fg}world{/}'` — inline color via brace tags.
- **Best for:** Node-ecosystem dashboards, deploy tools, CLI utilities.

```javascript
const blessed = require('blessed');
const screen = blessed.screen({ smartCSR: true });
blessed.box({ parent: screen, top: 'center', left: 'center',
    width: '50%', height: '50%', border: 'line',
    content: 'Hello {#001089-fg}369{/}' });
screen.key(['q','C-c'], () => process.exit(0));
screen.render();
```

**369 status:** Workable. Box borders via `border: 'line'` map to Rule 3. Color via hex inline tags supports 369 palette.

---

## 8. Blessed-contrib (Node.js — dashboards on top of Blessed)

- **Built on Blessed**, adds dashboard widgets (line/bar charts, gauges, maps, log tail, etc.).
- **Layout:** Grid system — `grid.set(row, col, rowSpan, colSpan, WidgetCtor, opts)`.
- **Best for:** Node monitoring dashboards.

```javascript
const blessed = require('blessed'), contrib = require('blessed-contrib');
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 12, cols: 12, screen });
const line = grid.set(0, 0, 6, 12, contrib.line, { label: 'CPU' });
const gauge = grid.set(6, 0, 6, 12, contrib.gauge, { label: 'Memory' });
screen.render();
```

**369 status:** Maps cleanly onto 369 dashboard composition. The 12×12 grid system is friendly to Rule 1 (12 = multiple of 3).

---

## 9. Ink (Node.js + React)

- **React renderer for the terminal.** Components use Flexbox via Yoga.
- **Mental model:** Identical to React DOM — `useState`, `useEffect`, custom hooks, the whole API.
- **Best for:** React teams building CLI tools, isomorphic CLI+web components (theory).
- **Used by:** GitHub CLI, Vercel CLI, Gatsby CLI, Cloudflare Wrangler.

```jsx
import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
const App = () => {
    const [count, setCount] = useState(0);
    return <Box flexDirection="column">
        <Text bold color="#001089">Count: {count}</Text>
    </Box>;
};
render(<App />);
```

**369 status:** *Excellent fit if you're already in React.* Flexbox layout is responsive-by-construction (Corollary 2). Color props accept hex codes directly.

---

## 10. FTXUI (C++ — functional reactive)

- **Modern C++17.** Header-only or static-linkable.
- **Paradigm:** Functional reactive components (`Component` and `Element`).
- **Best for:** C++ shops, performance-critical apps, embedded.
- **Widget set:** menus, sliders, inputs, tabs, gauges, charts.

```cpp
auto component = Renderer([&] {
    return text("Hello, FTXUI!") | border | center;
});
auto screen = ScreenInteractive::Fullscreen();
screen.Loop(component);
```

**369 status:** Workable, niche-language fit. C++ team should evaluate.

---

## 11. Rich (Python — output formatter, NOT a full TUI)

- **Rich is a print library, not a TUI framework.** Beautiful tables, syntax-highlighted tracebacks, progress bars, markdown rendering, structured logs.
- **Pairs with Textual** (Textual builds on Rich's renderers).
- **Best for:** CLI tools that print pretty output but aren't full-screen apps. Rich tracebacks. Progress bars. Markdown rendering.

```python
from rich.console import Console
from rich.table import Table
console = Console()
table = Table(title="Jobs"); table.add_column("Name"); table.add_column("Status")
table.add_row("Sunset Lofts", "active")
console.print(table)
```

**369 status:** *Excellent for CLI output.* `medium: 'terminal'` filter rendering for static output. Rich Console respects NO_COLOR. Pair with Click/Typer.

---

## 12. prompt_toolkit (Python — REPL + TUI hybrid)

- **Two modes:** input prompts (with autocomplete, multiline, vi/emacs keybindings) AND full-screen TUI.
- **Most-known use:** IPython, ptpython, Mycli/PGcli (multi-database CLIs), AWS Shell.
- **Best for:** any Python application that has a REPL-shaped interface.

```python
from prompt_toolkit import prompt
from prompt_toolkit.completion import WordCompleter
result = prompt('> ', completer=WordCompleter(['SELECT', 'FROM', 'WHERE']))
```

**369 status:** Tangential to typical UI work. Use for command-driven shells (vi/emacs-style); pick Textual or Ratatui for full-screen apps.

---

## 13. Lanterna (Java — Swing-style)

- **Java/Kotlin.** Renders to both terminal and Swing window (same code).
- **Two API levels:** Low-level (Screen + TextGraphics), high-level (gui2 module with Window, Button, Panel, TextBox).
- **Best for:** Java teams that need cross-platform CLI utilities.
- **Used in:** Atlassian Bitbucket CLI, various IDE plugins.

**369 status:** Workable, niche-language. The Swing-style widget tree maps to retained-mode 369 BASE/PILLARS.

---

## 14. tview (Go — widget-rich on tcell)

- **Built on tcell.** Widget-centric (more like Textual than Bubbletea).
- **Widgets:** Application, Flex/Grid, Form, Table, TreeView, List, Pages, Modal, TextView, InputField.
- **Best for:** Go teams wanting widget-first dev experience without Elm Architecture overhead.
- **Used by:** k9s (Kubernetes TUI), CockroachDB pebble inspector.

```go
app := tview.NewApplication()
list := tview.NewList().AddItem("Item 1", "", '1', nil)
app.SetRoot(list, true).Run()
```

**369 status:** *Strong fit for widget-heavy Go apps.* tview's Flex layout maps to 369 PILLARS naturally.

---

## 15. gocui (Go — minimalistic)

- **Minimal API** — views (= windows), keybindings, layout function.
- **Best for:** small Go tools, simple split-pane UIs.
- **Used by:** lazygit (the most famous gocui app), lazydocker, lazynpm.

**369 status:** Acceptable for small tools. For larger apps, prefer Bubbletea or tview.

---

## 16. tcell / termbox-go (Go — cell primitives)

- **tcell** is the modern fork of termbox-go. Cell-based primitive — `SetContent(x, y, char, style)`.
- **Foundation for** tview and many other Go TUIs.
- **Best for:** when you want to write the framework yourself.

**369 status:** Use if building a custom 369-native Go framework.

---

## 17. crossterm (Rust — cross-platform primitive)

- **Cross-platform Rust primitive** — works on Windows console (PTY), Unix.
- **Foundation for** Ratatui's default backend.
- **API:** Direct color/cursor/event manipulation.

```rust
use crossterm::{execute, style::{SetForegroundColor, Color, Print}};
execute!(std::io::stdout(),
    SetForegroundColor(Color::Rgb { r: 0, g: 16, b: 137 }),
    Print("369 navy text"))?;
```

**369 status:** Rare to use directly — use Ratatui on top.

---

## 18. console (Rust — output primitive)

- **Tiny crate** for colored output, terminal feature detection, simple input.
- **Best for:** CLI tools (non-TUI) that want sane color handling.

**369 status:** Use for CLI/non-TUI Rust apps; not a full-screen choice.

---

## Selection Guide — Pick by Language + Need

### Python
- **Need rich widgets + CSS:** Textual ★★★
- **Need event-loop interop (Twisted/asyncio):** Urwid
- **Just want pretty output:** Rich
- **Building a REPL:** prompt_toolkit
- **Need maximum speed in Python:** Textual (Cython-compiled core)

### Rust
- **Need full TUI:** Ratatui ★★★
- **Need primitive control:** crossterm
- **Need just output formatting:** console
- **Need C interop:** consider notcurses with Rust bindings

### Go
- **Need MVU functional model:** Bubbletea ★★★
- **Need widget toolkit:** tview
- **Need minimal split-pane:** gocui
- **Need primitive control:** tcell

### Node.js / JavaScript
- **React shop:** Ink ★★★
- **Need dashboard widgets:** Blessed-contrib
- **General TUI:** Blessed

### C / C++
- **Modern terminals:** notcurses
- **Maximum compatibility:** ncurses
- **C++:** FTXUI

### Java / Kotlin
- **Cross-platform with Swing target:** Lanterna

---

## Selection Guide — Pick by Application Shape

| Application shape | Best fit |
|------------------|----------|
| Live dashboard with charts | Ratatui (Rust), Textual (Python), Bubbletea+Bubbles (Go) |
| Forms-and-input app | Textual, Bubbletea, Ink |
| File manager / sidebar nav | tview, Bubbletea, Textual |
| Log tail / process monitor | Ratatui, blessed-contrib, Textual |
| Image viewer | notcurses + chafa integration |
| SQL / DB client | prompt_toolkit (for input) + Textual (for tables) |
| Git porcelain (lazygit-style) | gocui, Bubbletea |
| CLI command-runner with TUI fallback | Bubbletea (has dual mode), Rich (Python) |
| AI assistant chat | Textual, Bubbletea |
| Build-system progress | Rich, Bubbletea |
| Cross-platform Windows-included | Lanterna, Ink, Bubbletea, Ratatui |

---

## Performance Benchmarks (relative)

| Framework | Frame budget | Latency | Memory |
|-----------|--------------|---------|--------|
| Ratatui | μs | Sub-ms | Stack-allocated |
| Bubbletea | ms | Sub-ms | Low |
| notcurses | μs | Sub-ms | Low |
| Textual | ms | Interactive (60fps+) | Moderate (Python) |
| Blessed | ms | Interactive | Moderate (Node) |
| Ink | ms | Interactive | Moderate (Node + React) |
| ncurses | μs | Sub-ms | Tiny |

Ratatui and notcurses are sub-millisecond per frame in real workloads. Textual and Ink hit 60 FPS comfortably. ncurses is the absolute minimum-resource option.

---

## 369-Rules Mapping Across Frameworks

| 369 Rule | Textual | Ratatui | Bubbletea | Ink | Blessed |
|----------|---------|---------|-----------|-----|---------|
| 1. Spacing ×3 | TCSS `padding: 3`-style | `Constraint::Length(N)` w/ N divisible by 3 | Lipgloss `Padding(N)` | Flexbox `padding={3}` | `padding: { left: 3 }` |
| 2. Border-radius 0 | Always (terminal has no radius) | Always | Always | Always | Always |
| 3. 1px solid borders | `border: solid grey` | `Borders::ALL` + `BorderType::Plain` | Lipgloss `Border(NormalBorder)` | `borderStyle="single"` | `border: 'line'` |
| 4. Type scale | TCSS `text-size: 12` | n/a (font is terminal-controlled) | n/a | n/a | n/a |
| 5. 369 palette | `color: $navy` | RGB constants in Rust | Lipgloss `Color("#001089")` | `color="#001089"` | `style: { fg: '#001089' }` |
| 6. No decoration | Native | Native | Native | Native | Native |
| 7. Engines | `presentation(data, intent, 'terminal')` callable from any framework | Same | Same | Same | Same |
| 8. Deterministic | Reactive guarantees it | Pure render fn | Elm guarantees it | React purity | Manual |
| 9. BASE/PILLARS/ROOF | Widget composition | Layout constraints | View() composition | Component tree | DOM tree |

---

## See Also

- [[tui-design]] — Terminal rendering model, framework archetype deep dive, Elm Architecture, 369-TUI rule mapping
- [[terminal-capabilities]] — Protocol layer beneath these frameworks (ANSI, mouse, keyboard, graphics protocols)
- [[unix-cli-principles]] — ESR rules + CLIG, applies to TUIs as much as CLIs
- [[ascii-composition]] — Engine that emits TUI-renderable HTML/text
- [[ascii-tools]] — Companion tools (chafa, asciinema, etc.)

---

## Authoritative Sources

- [Textual docs](https://textual.textualize.io/)
- [Ratatui docs](https://ratatui.rs/)
- [Bubbletea docs](https://github.com/charmbracelet/bubbletea)
- [notcurses](https://github.com/dankamongmen/notcurses)
- [ncurses Programming HOWTO](https://invisible-island.net/ncurses/)
- [Ink (Vadim Demedes)](https://github.com/vadimdemedes/ink)
- [Blessed](https://github.com/chjj/blessed)
- [Rich (Will McGugan)](https://github.com/Textualize/rich)
- [prompt_toolkit](https://python-prompt-toolkit.readthedocs.io/)
- [tview](https://github.com/rivo/tview)
- [FTXUI](https://github.com/ArthurSonzogni/FTXUI)
- [Lanterna](https://github.com/mabe02/lanterna)
- [awesome-tuis](https://github.com/rothgar/awesome-tuis) — community-curated list of 600+ apps + frameworks
