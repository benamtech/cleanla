# TUI Design Patterns — Interaction & Layout Conventions

> **TUIs earn their power through learned muscle memory and discoverable hotkey systems.** Unlike GUIs, which rely on pointing and clicking unfamiliar widgets, TUIs assume the user will live in the interface long enough to internalize its language. This page catalogs the proven interaction patterns, layout conventions, and accessibility practices that production TUIs converge on. Load this when designing a new TUI or auditing one for usability.

For framework choices, see [[tui-frameworks-complete]]. For protocol details, see [[terminal-capabilities]]. For internationalization specifics, see [[tui-i18n]].

---

## Modal vs Modeless

### Modal design (vim, helix, Spacemacs)
Different "modes" repurpose the same keys. `h` in vim normal-mode moves left; in insert-mode it inserts the letter "h." Modes eliminate ambiguity errors but require the user to track current state.

- **Best for:** keyboard-dense workflows where the user has tens of operations per second
- **Trade-off:** mode-indication discipline is critical (status line MUST show current mode loudly)

### Modeless design (readline, less, nano)
One persistent state; modifiers (Ctrl, Alt) for non-text actions. `Ctrl+A`=home, `Ctrl+E`=end, `Ctrl+K`=kill-line.

- **Best for:** linear input (REPLs, prompts, search boxes)
- **Trade-off:** modifier-conflict risk with terminal emulator hotkeys

### Practical hybrid (the production default)
Modeless by default, with command modes accessible via `:` or `?`. fzf opens in extended-search mode (keyword input) but interprets `?` as toggle-preview and `+` as action binding.

**369 default:** Modeless for input fields; modal for full-screen apps with rich keyboard surfaces.

---

## Command Palette Pattern (Ctrl+P / Cmd+K)

A searchable index of all commands. Used by: VS Code, Sublime, Atom, Notion, Linear — and translated to TUIs by Helix (`:`), Textual (`?`), tmux (`Ctrl+B :`).

**Implementation:**
1. Maintain `(name, binding, description, category)` tuples for every command
2. Fuzzy-match user input against any field
3. Display matched commands with their key-binding chain visible

**Spacemacs leader-key chain:** `SPC+m+t` runs a language-specific test. The leader pattern scales to 500+ commands without memorization because each level is mnemonically tagged.

```
SPC → Files → Find → file picker
SPC → Project → Build → build cmd
SPC → Buffers → Switch → buffer picker
```

**Discovery convention:** Display hotkeys inline with their actions:
```
[S]hop  [A]ccount  [C]art  [R]egion  [Q]uit
```
The bracketed letter beats a separate help screen for high-frequency workflows.

---

## Universal Key Vocabulary

### The "letters" set (modeless or modal command-mode)
| Key | Meaning |
|-----|---------|
| `a` | Add / append entity |
| `d` | Delete |
| `e` | Edit |
| `r` | Refresh / rename |
| `c` | Confirm / change |
| `q` | Quit / go back |
| `h j k l` | Left / down / up / right (vim) |
| `gg` | Top of list / file |
| `G` | Bottom of list / file |
| `/` | Search forward |
| `?` | Search backward / help |
| `n` / `N` | Next / previous match |
| `Space` / `b` | Page down / up (less) |
| `Tab` / `Shift-Tab` | Focus next / previous |
| `Enter` / `Ctrl-M` | Accept / execute |
| `Esc` | Cancel / return to normal mode |

### GNU Readline shortcuts (universal in bash/python REPL/mysql/psql/etc.)
| Combo | Action |
|-------|--------|
| `Ctrl-A` | Beginning-of-line |
| `Ctrl-E` | End-of-line |
| `Ctrl-K` | Kill-to-end-of-line (cut) |
| `Ctrl-U` | Kill-to-beginning-of-line (cut) |
| `Ctrl-W` | Kill-word-backward |
| `Ctrl-Y` | Yank (paste) |
| `Ctrl-R` | Reverse history search |
| `Ctrl-L` | Clear screen |
| `Alt-F` | Forward-word |
| `Alt-B` | Backward-word |
| `Alt-D` | Kill-word-forward |

To use vi-style: `set editing-mode vi` in `~/.inputrc`.

### Chord vs sequence — pick one
**Chords** (`Ctrl-Alt-S` simultaneously) — fast for frequent actions, high cognitive load, terminal emulator conflicts.
**Sequences** (`SPC m r`) — slower per-keypress, self-documenting (help shows partials), no emulator conflicts, scales to deep hierarchies.

**369 default:** Sequences when there are >50 commands. Chords for the 5–10 most-frequent.

---

## Focus Management

### Tab navigation
Cycle through focusable widgets. Default order: top-to-bottom, left-to-right (document order). `Shift+Tab` for reverse.

### Arrow navigation
- **Vertical** in lists / trees: Up/Down moves selection
- **Horizontal** in master-detail: Left/Right swaps pane focus
- **Grid:** `hjkl` or arrow keys for 2D movement

### Focus trapping in modals
When a modal opens, focus must NOT escape. On open: save focus → trap. On close: restore.

```python
def open_modal(modal):
    saved_focus = app.focused
    app.focus_trap.push(modal)
    app.focused = modal.first_focusable

def close_modal(modal):
    app.focus_trap.pop()
    app.focused = saved_focus
```

### Focus indication (mandatory)
- Textual: inverse-color border or `:focus` CSS pseudo-class
- Ratatui: `Style::new().fg(Color::Yellow)` border on focused widget
- Lipgloss / Bubbletea: `Bold().Foreground(active)` for focused element

**369 rule:** The focused widget MUST be visually distinct without relying on color alone — also bolden the border, invert the title, or add a `▶` marker.

---

## Layout Patterns

### Pane splitting / tiling

**tmux model — 5 built-in layouts:**
- `even-horizontal` — panes left-to-right, equal width
- `even-vertical` — panes top-to-bottom, equal height
- `main-horizontal` — one large pane on top, smaller below
- `main-vertical` — one large pane on left, smaller right
- `tiled` — all panes equal, dynamically arranged

Pane navigation: `Ctrl-B` (prefix), then arrow keys.
Create splits: `Ctrl-B "` (horizontal), `Ctrl-B %` (vertical).

### Constraint-based layouts (Textual / Ratatui / Bubbletea)
Define layouts using percentages or min/max constraints, NOT absolute coordinates. Resizing terminal automatically reflows.

```rust
// Ratatui
Layout::default()
    .direction(Direction::Vertical)
    .constraints([
        Constraint::Length(3),         // header — fixed
        Constraint::Min(0),            // body — fills
        Constraint::Length(3),         // footer — fixed
    ])
    .split(frame.size())
```

**369 mapping:** All Constraint::Length values must be multiples of 3 (Rule 1).

### Floating windows / modals
Position absolutely (x, y) with z-ordering. Capture all input via focus trap. Render above base layer. On Esc, dismiss and restore previous focus.

**Dialog types:**
- Confirmation — "Delete? [Y/n]"
- Input — single-line text + label
- Selection — radios or checkboxes
- Custom — arbitrary layout with action buttons

### Status lines (bottom)
Mode + cursor pos + dirty indicator + breadcrumb path.

```
vim:    -- INSERT --     [Line 150:Col 42] [+] utf-8 dos
helix:  src/lib.rs       NOR    L42 C17    utf-8
htop:   F1Help  F2Setup  F3Search  F4Filter  F5Tree  F6SortBy  F10Quit
```

**Pattern:** Pin the status line via `shrink-0` / `flex-none`. It survives all body content scrolling. F-key strips (à la WordPerfect, htop, mc) communicate keyboard surface inline.

### Command bars (bottom or floating)
Minimal `:`-prompt for vim-like editors. Supports tab-completion.

```
:set number
:s/old/new/g
:10,20d
```

### Master-detail layout
Left pane: scrollable list. Right pane: details of selected item.

```
┌──────────────────┬──────────────────┐
│ Items (list)     │ Details (preview)│
│ • item1     →    │ Name: item1      │
│ • item2  [sel]   │ Type: file       │
│ • item3          │ Size: 42KB       │
└──────────────────┴──────────────────┘
```

### Breadcrumb navigation
For deep hierarchies (Kubernetes objects, file trees):
```
Cluster › Namespace › Pod › Container › Logs
```
Enter descends; Esc ascends to parent.

### Sidebars
**Left** — navigation tree. Toggle with `Ctrl+B`. Arrows navigate. Enter / → expands. Esc / ← collapses. `/` searches the tree.
**Right** — properties, minimap. Toggle with `Ctrl+Shift+B`.

---

## Notable Interaction Conventions

### less / more navigation (POSIX paging — universal)
```
Space / f   page forward
b           page backward
j           line down
k           line up
g           start of file
G           end of file
/pattern    search forward
?pattern    search backward
n / N       next / previous match
q           quit
```

`less` is composable: `dmesg | less` — pipe + pager pattern.

### tmux prefix-key pattern
Default prefix: `Ctrl-B`. Press, release, then press the action key.

```
Ctrl-B c    create window
Ctrl-B n    next window
Ctrl-B p    previous window
Ctrl-B %    split vertically
Ctrl-B "    split horizontally
Ctrl-B d    detach session
Ctrl-B [    enter copy mode
```

**Why a prefix?** Terminal has no built-in concept of nested apps. The prefix discriminates "this Ctrl-key is for tmux" vs "this Ctrl-key is for the running app." Customizable in `~/.tmux.conf` — many users rebind to `Ctrl-A` to match GNU Screen muscle memory.

### Incremental search (fzf, readline `Ctrl-R`, vim `/`)
Type query — results filter live. Return accepts first.

### Fuzzy vs regex search

**Fuzzy** — match any characters in order (`fz` matches `fzf`). Case-insensitive by default. Forgiving.
fzf extended-search syntax:
- `'abc` — exact match
- `^abc` — prefix
- `abc$` — suffix
- `!abc` — inverted (not containing)
- `space-separated` — implicit AND

**Regex** — powerful but high learning curve. Vim's `\v` (very-magic) or `\m` (POSIX ERE).

---

## TUI Accessibility

### Screen reader interaction
Screen readers (NVDA, JAWS, TalkBack, Orca) strip ANSI escape codes and read remaining text. They cannot announce mode changes or focus shifts unless the TUI emits them as text.

**Practices:**
1. **Never rely on color alone.** Pair: `[ERROR] message` not just red text.
2. **Text alternatives for box-drawing.** Or skip borders entirely in `--no-color` mode.
3. **Keyboard-only navigation must work.** Tab/Arrow/Enter/Space/Esc must reach every interactive element.
4. **Announce mode/state changes** by emitting status-line updates: `-- INSERT --`, `Modal opened: Delete confirmation`.

### Textual's accessibility model
Widgets expose `tooltip` and `description` attributes. The `AccessibilitySystem` reports widget state changes for narration. Works with NVDA over SSH+PuTTY.

### Color contrast (the WCAG gap)
Standard 16 ANSI colors have poor contrast: black-on-blue is ~1.5:1 (WCAG AA requires 4.5:1).

**Solutions:**
1. Use only high-contrast pairs: bright-white on black, bright-cyan on black.
2. Implement `--no-color` and respect `NO_COLOR` env var.
3. Provide monochrome mode using only `─ │ + -` glyphs.
4. Use the 369 palette tokens — they're designed to meet contrast against navy/white/manila backgrounds.

### NO_COLOR / CLICOLOR
- `NO_COLOR=1` (https://no-color.org/) — disables all color. Value irrelevant; any non-empty value triggers it.
- `CLICOLOR=0` — disables (BSD/macOS legacy).
- `CLICOLOR_FORCE=1` — forces colors even when not a TTY.

**Adopted by:** ripgrep, fd, bat, delta, exa, many modern Rust/Go tools. **369 rule:** all 369 TUIs MUST honor `NO_COLOR`.

---

## Testing Methodology

### Snapshot testing (Insta — Rust; pytest-textual-snapshot — Python)
Capture screen buffer; save as golden file; diff on subsequent runs.

```rust
#[test]
fn test_render() {
    let mut app = App::new();
    let buf = app.render();
    insta::assert_snapshot!(buf);
}
```

First run generates `.snap` file. Subsequent runs compare. On diff, the harness opens a review TUI: `a` accept, `r` reject, `q` quit.

### PTY-based testing
Spawn the app in a pseudo-terminal, send keystrokes, capture output including ANSI sequences.

```rust
// ratatui-testlib
let mut harness = Harness::new(80, 24);
harness.send_key(KeyCode::Char('q'));
harness.try_render().unwrap();
assert_eq!(harness.buffer()[0][0].symbol, "Q");
```

Microsoft's TUI Test (Node.js, uses xterm.js):
```js
const test = new TerminalTest();
await test.type("hello");
await test.waitForRender();
expect(test.screen().text()).toContain("hello");
```

### VHS (Charm) — declarative recording

`.tape` script:
```tape
Output demo.gif
Set Theme "Dracula"
Type "hello"
Sleep 1s
Enter
```

Records to GIF/MP4/WebM/PNG. Use for:
- Demo GIFs in README
- Integration tests (diff `.txt` snapshots)
- Visual regression in CI

### The expect pattern (historical, still works)
```tcl
expect "prompt> "
send "ls\r"
expect "file.txt"
```
Universal pattern: send → expect → assert. Modern frameworks just wrap this.

---

## Animation & Transitions

### Determinate progress
```
[████████░░░░░░░░░░░░] 42%
```
Use `█` for filled, `░` for empty. With sub-cell precision: `▏▎▍▌▋▊▉` for partial last cell. Format:
```
operation         [▓▓▓▓▓▓▓░░░░░░] 50%  3.2 MB/s  00:15 remaining
```

### Indeterminate spinners
| Set | Frames |
|-----|--------|
| ASCII | `/ - \ |` |
| Braille (best) | `⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏` (10 frames) |
| Dots | `⠀ ⠁ ⠂ ⠄ ⡀ ⢀ ⠠ ⠐ ⠈` |
| Bouncing | `◐ ◓ ◑ ◒` |
| Pulse | `· ∙ • ● ⬤ ● • ∙` |

Tick interval: 80–120ms per frame for smooth perception (4–12 fps on the spinner specifically; the underlying display can be 60+ fps).

```rust
struct Spinner {
    frames: &'static [&'static str],
    index: usize,
    last_update: Instant,
}
impl Spinner {
    fn tick(&mut self) {
        if self.last_update.elapsed() > Duration::from_millis(100) {
            self.index = (self.index + 1) % self.frames.len();
            self.last_update = Instant::now();
        }
    }
}
```

### Brightness-ramp fade-in
```
Frame 1:  \x1b[30mText\x1b[0m     black (invisible on dark)
Frame 2:  \x1b[90mText\x1b[0m     dim grey
Frame 3:  \x1b[97mText\x1b[0m     bright white
```

### Frame budget
Terminal refresh is typically 30–60fps max (limited by SSH latency, render time). Aim for stable 30fps; faster is invisible except for very tight animations.

---

## Live-Coding Traditions (the avant-garde)

### ORCA (hundredrabbits.org)
2D, stack-based "esoteric" programming environment for procedural sequencers. Grid-based.

- Lowercase letters: bang-driven (event-fired) operations
- Uppercase letters: per-frame operations

```
C    [1 2 3]    counter
I.....           increment each frame
O                output to MIDI/OSC/UDP
```

Drives external synths (Ableton, Renoise, VCV Rack, SuperCollider). Heavily modal — typing vs navigation. **369 relevance:** Demonstrates that a TUI grid + mode-switching can be a *primary creative instrument*, not just an admin tool.

### Hydra (hydra.ojack.xyz)
Web-based live-coding for graphics. Signal-flow REPL — connect oscillators, filters, effects. Not strictly TUI, but the *aesthetic and pace* mirrors live-coded TUIs.

### Tidal Cycles (tidalcycles.org)
Haskell DSL for algorithmic patterns. REPL-driven.
```haskell
d1 $ sound "bd sn" # gain "0 0.7"
```
Evaluates immediately → SuperCollider → audio. Often paired with a vim/Neovim plugin (vim-tidal) for fast pattern editing.

### vim / Helix as creative instrument
Both are used by live-coding artists who project their editor screen during performances (algoraves). The editor's keyboard surface IS the instrument.

---

## Framework-Specific Patterns

### Bubbletea (Go) + Lipgloss + Bubbles
Model-Update-View. Pure-function `View()` ensures Rule 8 (deterministic).

Lipgloss styling:
```go
var palette = lipgloss.NewStyle().
    Foreground(lipgloss.Color("#FFFFFF")).
    Background(lipgloss.Color("#001089")). // 369 navy
    Bold(true)
```

Bubbles components: TextInput, Spinner, Progress, Table, Viewport, Paginator, Help.

### Textual (Python) reactive
```python
class MyApp(App):
    CSS = """
    Screen { layout: vertical; }
    #header { height: 9; }       /* multiple of 3 */
    #main   { height: 1fr; }
    #footer { height: 3; }
    """
```

### Ratatui (Rust) immediate-mode
Pure `render(state) → frame` function. Constraints over absolutes:
```rust
Layout::default()
    .direction(Direction::Vertical)
    .constraints([
        Constraint::Length(3),       // header
        Constraint::Percentage(70),  // main
        Constraint::Length(3),       // footer
    ])
```

---

## The 369-TUI Pattern Compatibility Matrix

| Pattern | 369 rule | Notes |
|---------|----------|-------|
| Spacing in layout constraints | Rule 1 | All `Length(N)` must have N divisible by 3 |
| F-key strip in status line | Rule 9 (ROOF=footer pillar) | Tradition since WordPerfect, htop |
| Color-only emphasis | Rule 6 / accessibility | Always pair color with text or glyph |
| Modal mode indicator | Rule 9 (ROOF=status pillar) | `-- INSERT --` must be visible |
| Sequence > chord | UX | Spacemacs/Helix proved sequences scale |
| Focus trap in modals | Rule 8 (deterministic flow) | Same input → same focus state |
| `NO_COLOR` honored | Rule 8 | User config overrides app palette |
| Spinner | Rule 6 fallback | Braille spinner > ASCII when font supports |
| Box-drawing borders | Rule 3 | Use `─│┌┐└┘├┤┬┴┼` consistently, single-line preferred |

---

## See Also

- [[tui-design]] — Rendering model, Elm Architecture, immediate vs retained
- [[tui-frameworks-complete]] — All 18 frameworks with 369 mappings
- [[terminal-capabilities]] — Protocol layer beneath these patterns
- [[unix-cli-principles]] — ESR's 17 rules, CLIG output design
- [[tui-i18n]] — CJK width, RTL, complex scripts, emoji width
- [[unicode-art-extended]] — Glyphs for borders, spinners, status indicators

---

## Sources

- [vim documentation](https://www.vim.org/docs.php)
- [Helix editor docs](https://docs.helix-editor.com/)
- [GNU Readline](https://tiswww.case.edu/php/chet/readline/readline.html)
- [Spacemacs documentation](https://www.spacemacs.org/doc/DOCUMENTATION.html)
- [fzf](https://github.com/junegunn/fzf)
- [tmux man page](https://man.openbsd.org/tmux.1)
- [less man page](https://man.openbsd.org/less.1)
- [Textual docs — Accessibility](https://textual.textualize.io/guide/widgets/#accessibility)
- [Charm vhs](https://github.com/charmbracelet/vhs)
- [Bubbletea](https://github.com/charmbracelet/bubbletea)
- [Lipgloss](https://github.com/charmbracelet/lipgloss)
- [Bubbles](https://github.com/charmbracelet/bubbles)
- [Ratatui-testlib (snapshot testing)](https://github.com/ratatui/ratatui-testlib)
- [Insta (Rust snapshot)](https://insta.rs/)
- [TUI Test by Microsoft](https://github.com/microsoft/tui-test)
- [NO_COLOR standard](https://no-color.org/)
- [clig.dev](https://clig.dev)
- [ORCA — hundredrabbits](https://hundredrabbits.itch.io/orca)
- [Hydra video synthesis](https://hydra.ojack.xyz/)
- [Tidal Cycles](https://tidalcycles.org/)
