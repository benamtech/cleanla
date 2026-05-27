# TUI ↔ Design ↔ UX — The Intersection

> **Why do good TUIs feel good? Why do bad ones feel hostile?** The canon has patterns ([[tui-patterns]]), frameworks ([[tui-frameworks-complete]]), and history ([[historical-tuis]]) — but the *design-principles* layer that explains *why* is its own concern. This page is the strategic UX foundation: Nielsen's heuristics translated to text-mode; cognitive ergonomics of monospace; information design (Tufte + Bertin in a character grid); affordances without hover; error UX; onboarding; time-perception; color/contrast as terminals actually constrain them.

Load this when designing a new TUI from scratch, when auditing an existing TUI for UX quality, when explaining 369's terminal-medium decisions to a stakeholder, or when teaching a developer who has GUI instincts how to think in TUI.

For tactical patterns, see [[tui-patterns]]. For framework-level architecture, see [[tui-design]]. For the foundational reasoning, see `canon-axioms.md`.

---

## Why TUI UX Is Its Own Discipline

### The GUI assumption that doesn't transfer

Most UX literature assumes:
- Variable-width type
- Pointing device (mouse / touch)
- Hover state
- Animation budget (60fps)
- Icon vocabulary
- Z-axis (modals, dropdowns, layering)
- Pixel-precise spatial layout

**A TUI has none of those.** Every cell is the same width. The user types instead of pointing. There is no hover. Animation costs real terminal bandwidth. Icons are 1–2 characters from a fixed font. Layering is fake (alt-screen + overlays, but no real z-order).

This is not a limitation — it is a **different design problem with different solvers**. The canon proves the form has 40+ years of refined practice (vim, emacs, htop, mc, lazygit). The UX principles below are what those refined practices encode.

### The TUI UX axiom

**A well-designed TUI is faster than any GUI for the user who has internalized it.** This is not nostalgia — it's measured. Power-user benchmarks consistently show:
- vim keystroke counts 30–60% lower than VSCode for equivalent edits
- htop process navigation faster than Activity Monitor
- lazygit staging faster than GitHub Desktop
- k9s pod operations faster than kubectl-via-bash

The cost is **time to first competence** (the learning curve). The reward is **lifetime velocity** (the asymptote).

A 369 TUI is designed for the user who will use it many times, not the user who will use it once.

---

## Nielsen's 10 Heuristics — Translated to TUI

Jakob Nielsen's heuristic evaluation framework (1994) is the most-cited UX framework. Each heuristic translates to TUI but the *implementation* changes radically.

### 1. Visibility of system status
**GUI form:** spinners, progress bars, toast notifications, status icons.

**TUI form:**
- **Status line is mandatory** — bottom or top row showing mode, cursor position, dirty indicator, breadcrumb (vim's status line; htop's F-key strip)
- **Mode indicator must be loud** — `-- INSERT --`, `-- VISUAL --`, `:command` — colors + position + text
- **Spinners use braille** (`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`) at 80–120ms tick for visible motion without distraction
- **Progress bars** use eighth-block sub-cell precision (`▏▎▍▌▋▊▉█`) — not ASCII `[=== ]`
- **Throbbers vs progress** — throbber = indeterminate (spinner); progress = determinate (percentage). Pick one, not both.

**369 application:** Every full-screen 369 TUI MUST have a persistent status line. Mode + cursor position + breadcrumb. Multiple lines forbidden (eat the body).

### 2. Match between system and the real world
**GUI form:** skeuomorphism (Apple's leather, paper textures), realistic icons.

**TUI form:**
- **Domain-correct vocabulary** in commands and labels. `:write` writes a file. `:quit` quits. Not `:cmd-buffer-flush`.
- **Glyph metaphors that read as drawings**: `→ ← ↑ ↓` for direction; `▶` for play; `■` for stop; `✓` for done. Avoid abstract codes.
- **Bracket notation for entities** (`[CLIENT]`, `[PRODUCER]`) — disclosive, not cryptic.
- **Mode words match user vocabulary** — "INSERT" not "INS" (until power-users prefer abbreviations).

**369 application:** Rule about user-visible UI uses full words, not codes (e.g., `[CLIENT]` not `[C]`). This is heuristic 2 codified.

### 3. User control and freedom
**GUI form:** undo, redo, breadcrumbs, "back" button, cancel buttons.

**TUI form:**
- **Esc cancels** — universal. Always works. Always reverts to the parent mode/screen.
- **Undo/redo via vim model** (`u` / `Ctrl-r`) or emacs (`C-/`) — never a button
- **Operation cancellation mid-flight** — Ctrl-C in any TUI must abort the current operation. The Bell `\a` should NOT play.
- **Confirmation only for destructive ops** — `Delete? [Y/n]` for irreversible actions. Reversible actions execute without confirmation (it adds friction without value).
- **No "are you sure?" dialogs for saves** — save commits; you can always undo.

**369 application:** Every 369 TUI mode must have a documented `Esc` behavior (what does it cancel back to?). If `Esc` does nothing, the mode is broken.

### 4. Consistency and standards
**GUI form:** platform conventions (Cmd-C on macOS, Ctrl-C on Linux).

**TUI form:** This is where TUIs *win against GUIs*. The conventions are stable for 40+ years:
- `j/k` = down/up (vim everywhere)
- `q` = quit (less, vim, htop, lazygit)
- `/` = search (vim, less, mutt)
- `Ctrl-C` = cancel
- `Ctrl-D` = EOF / quit REPL
- `Tab` = autocomplete / focus next
- Readline shortcuts (`Ctrl-A`, `Ctrl-E`, etc.) work everywhere
- Function-key strip at bottom (htop, mc, WordPerfect inheritance)

**Violations are jarring.** A TUI that uses `e` for "next" instead of `n` breaks 40 years of muscle memory.

**369 application:** A 369 TUI MUST use the conventional keys. If you bind `j` to something other than "down," document why and provide a config override.

### 5. Error prevention
**GUI form:** disable invalid buttons, validation on form fields.

**TUI form:**
- **Disable destructive commands when their target doesn't exist** — `:delete branch foo` fails fast if `foo` doesn't exist; don't proceed to a confirmation dialog
- **Confirmation for destructive ops** — but ONLY destructive. Confirmation fatigue is a real TUI failure mode.
- **Mode lock-in for dangerous operations** — vim's `:wq!` requires the explicit `!` to force-write read-only files. Make the user reach for the explicit override.
- **Status line shows what would happen** — `htop` confirms which process before sending signal
- **Input validation inline** — error messages appear in the status line, not as a popup

**369 application:** A 369 TUI that destroys data without an explicit confirmation is broken. A 369 TUI that asks for confirmation on safe operations is also broken.

### 6. Recognition rather than recall
**GUI form:** menus, toolbars, visible options.

**TUI form:** This is the heuristic TUIs *appear* to violate but actually re-implement:
- **F-key strip at bottom** — visible reminder of the keyboard surface (htop, mc, WordPerfect inheritance)
- **Help screen accessible via `?`** — comprehensive recall surface
- **Command palette via `:`** (vim) or `Ctrl-P` (vscode-style) — fuzzy search across all commands
- **Status line bracketed mode hints** — `[HOME] [START] [SSM] [JBS] [SPS] [POW] [SHOP]` shows the program surface inline
- **Tab completion of commands + arguments** — surfaces what's available
- **Mode-specific keymap displayed when entering mode** — Spacemacs leader key shows what comes next

**369 application:** A 369 TUI MUST have a discoverable command surface. F-key strip OR `:command-palette` OR `?` help screen — at least one. Mystery keymap is a UX failure.

### 7. Flexibility and efficiency of use
**GUI form:** keyboard shortcuts as accelerators alongside menus.

**TUI form:** This is where TUIs *natively excel*:
- **Modal editing** (vim) = built-in expert-mode for everyone
- **Macro recording** (`q<letter>` in vim, `C-x (` in emacs) = teach the tool to repeat
- **Command history + search** (Ctrl-R in readline) = recall past actions
- **Leader keys** (Spacemacs SPC, vim's `\`) = customizable accelerator namespace
- **Vim "verb + motion + object" grammar** = compositional efficiency
- **fzf-style fuzzy finders** = type-3-letters precision

**369 application:** Power-user paths matter. A 369 TUI should reward the user who has used it 1000 times. Provide:
- Macro recording or scripting
- Command history with search
- Configurable leader-key bindings

### 8. Aesthetic and minimalist design
**GUI form:** flat design, generous whitespace, hidden complexity.

**TUI form:** TUIs invert this:
- **Information density is a feature, not a flaw** — htop's 50+ processes visible is its strength
- **Whitespace is expensive** — every blank line is one fewer row of data
- **No animations except for active states** — spinners on long ops, flash on errors; nothing else moves
- **Color sparingly + semantically** — red = error, yellow = warning, green = success, blue = info; everything else = default
- **Borders define regions, not decorate** — single-line box drawing only
- **The 80-column / 132-column historic widths are STILL meaningful** — design for them

**369 application:** Rule 1 (×3 spacing) + Rule 6 (no decoration) directly encode this. Don't apologize for density; design for the user who wants to *see* everything.

### 9. Help users recognize, diagnose, and recover from errors
**GUI form:** error dialogs with retry buttons, error messages with help links.

**TUI form:**
- **Error messages in status line** — visible but not blocking
- **Errors include the fix** — "Connection refused: api.example.com:443. Check API_KEY and network. See: docs.example.com/auth"
- **Exit codes follow convention** — 0=success; 1=general error; 2=usage error; 126=cannot execute; 127=not found; 130=Ctrl-C
- **Color the error red but ALSO prefix with `Error:`** — color-blindness + screen-reader compatibility (see [[tui-i18n]] + [[tui-modern-gaps]] §accessibility)
- **Diagnostic info on `--verbose`** — silent on success, loud on `--verbose`

**369 application:** Every 369 TUI error MUST: (1) state what failed; (2) state why; (3) state how to fix it. If you can't write all three, the error message is incomplete.

### 10. Help and documentation
**GUI form:** Help menu, tooltips, in-app tutorials.

**TUI form:**
- **`--help` is mandatory** and must show: usage + flags + one concrete example
- **`?` in-app help** for full-screen TUIs
- **Man pages for complex tools**
- **Inline docstrings in REPL** — `help()` in Python, `?function` in IPython
- **Status-line hints when entering a mode** — vim's command-completion preview
- **Online docs link in help text** — `For more: https://...`

**369 application:** `--help` is part of the contract. A 369 CLI without `--help` is broken.

---

## Cognitive Ergonomics of Monospace

### Why monospace changes everything

Variable-width type is optimized for reading prose (kerning, ligatures, character-shape signal). Monospace is optimized for **column alignment** and **glyph-by-glyph parsing**. The cognitive cost is different.

### Scanning patterns in monospace

**F-pattern** (Nielsen / Jakob's work on web layouts):
```
██████████  ← horizontal scan of first line
██████      ← shorter scan
█           ← vertical scan down left column
███         ← occasional horizontal jumps
█
█
```

In a TUI, this means:
- **Left column gets the most attention** — labels, identifiers, primary information go left
- **First line is the most-scanned** — headers, status, mode indicator at top
- **Vertical alignment matters more than in GUIs** — eyes track down columns

**Z-pattern** for shorter screens:
- Top header → scan right → diagonal down → bottom action

In a TUI:
- **Top status line + bottom F-key strip** create implicit Z-pattern frame
- **Action footer at bottom-right** (CLI prompt; menu actions; command bar)

### Density tolerance

Research shows humans can process **~2000 characters per visible screen** without overload, given proper structure. Monospace forces structure (alignment), so this number is achievable.

Compare to web: a typical webpage might have ~500 visible characters but feels denser because of competing visual signals (color, type weight, image, hover hint, animation). Monospace + minimal color = perceptually less dense than equivalent character count on web.

**369 implication:** Pack information. A `htop` showing 100 processes feels readable; a webpage with 100 list items feels overwhelming.

### Spatial memory advantage

Power users build **spatial maps** of TUI screens — "the second column from the left holds CPU%, the bottom row is F-keys." This is more accurate than mouse-target memory in GUIs because:
1. Cell positions are deterministic (no resize reshuffle)
2. Same layout repeats across sessions
3. Keyboard navigation reinforces position learning

A GUI with floating panels never builds the same map.

**369 implication:** Layout stability across runs is a UX feature. If a TUI rearranges itself between sessions, you've broken spatial memory.

### The Fitts's Law equivalent

Fitts's Law (the time to acquire a target depends on distance + size) applies differently in TUIs:
- **Mouse Fitts's Law:** time ∝ log₂(distance / target_width)
- **TUI Fitts's Law equivalent:** time ∝ keystroke count

The conversion: faster TUI design is **fewer keystrokes to reach the target**. Hence the universal value of:
- `j/k` (one keystroke per row, vs mouse pixel-aiming)
- `gg` / `G` (two keystrokes to start/end of buffer)
- Fuzzy finders (3-4 keystrokes to any file in a million)
- Vim verb+motion grammar (`dd` deletes line; `daw` deletes-around-word)

A 369 TUI is faster when it has a shorter keystroke path to every action.

---

## Information Design — Tufte + Bertin in a Character Grid

### Tufte's data-ink ratio (applied to TUIs)

**Original:** Data-ink ratio = ink-used-to-show-data / total-ink. Maximize this.

**TUI translation:** Character-data ratio = characters-bearing-data / total-characters. Maximize this.

What this means concretely:
- **Box-drawing borders are "structural ink"** — they bear meaning (region demarcation) so they count as data ink
- **Whitespace padding is non-data ink** — minimize it
- **ASCII bullets (`•`, `*`) are non-data when used decoratively** — only use when they encode "list item type"
- **Color is data when it encodes a category** — error red, warning yellow. Color is non-data when it's "to look nice."

**Tufte's rule applied:** if you can remove a character and the meaning is preserved, remove it.

### Bertin's visual variables in monospace

Jacques Bertin (1967) identified 7 visual variables for graphics:
1. Position (where on the page)
2. Size (length / area)
3. Shape (square vs circle vs triangle)
4. Value (light vs dark)
5. Color (hue)
6. Orientation (rotation angle)
7. Texture (pattern density)

**In a TUI**, available variables:
1. **Position** — row + column (very strong; spatial memory builds here)
2. **Size** — limited to character-cell quantization. Bar width = magnitude. Color span = grouping.
3. **Shape** — limited to ~100 useful Unicode glyphs (see [[unicode-art-extended]]). `● ○ ◐ ◑` for state; `▲ ▼` for direction; `■ □` for filled/empty.
4. **Value** — block shading (`░ ▒ ▓ █`) gives 4 levels of "lightness"
5. **Color** — the 16/256/truecolor palette
6. **Orientation** — limited (`/ \ |  ─`); not a strong channel
7. **Texture** — character variety creates implicit texture (dense `▓` vs sparse `░`)

**Strongest TUI channels:** Position, Color, Value (in that order).

**Weakest:** Orientation, Size (because cell size is fixed).

**369 implication:** Encode the most-important category in *position* (rows / columns). Encode magnitude in *color* (palette token) or *value* (shade block). Don't try to encode anything in *size* — you don't have it.

### Density tradeoffs

Tufte's principle: every increase in density is good *until it becomes unreadable*. The threshold depends on:
- **Glyph contrast** — dense block characters (`█`) vs sparse (`░`) need visible contrast
- **Color separation** — adjacent categories need distinct palette positions
- **Row height** — terminal cells are fixed; row spacing is binary (gap or no gap)
- **Eye-distance heuristic** — at 60cm reading distance, 12px monospace gives ~1° per character. 80 columns = 80° wide — fits the parafoveal scanning range.

**369 rule:** Pack until the user reports difficulty. Then back off one increment. The 369 default (×3 spacing, 12px body, 1px borders) is already calibrated for high density.

---

## Affordances Without Hover

### The GUI affordance vocabulary
- Hover changes color → "this is clickable"
- Cursor changes shape → "this is draggable"
- Underline → "this is a link"
- Border + drop shadow → "this is a button"

### The TUI affordance vocabulary
Different but equally rich:
- **Bracket notation** `[CLIENT]` `[ADD]` `[Y/n]` → "this is interactive"
- **Reverse video** (`SGR 7`) on the focused element → "this is the current target"
- **Color-token on action verbs** (`Save` in navy, `Delete` in red) → "this has consequence"
- **Cursor position** → "the input goes here"
- **Mode indicator in status line** (`-- INSERT --`) → "your keystrokes do this"
- **Underline** on URLs / file paths → "clickable in modern terminals via OSC 8" (modern advance!)
- **Modifier-key strip at top/bottom** → "these accelerators are available"

### Discoverability without hover
**The problem:** without hover, users can't probe to learn affordances.

**The 369 solutions:**
1. **Explicit hotkey strips** — bottom-row F-key labels (htop / mc / WordPerfect inheritance)
2. **Inline action labels** in brackets — `[S]hop [A]ccount [C]art [R]egion [Q]uit`
3. **Command palette** — fuzzy search across all commands (`Ctrl-P` / `:`-prompt)
4. **`?` help screen** — exhaustive keymap reference
5. **`--help` for CLI mode** — usage + flags + example
6. **Mode-specific status hints** — when you enter visual mode, vim shows `-- VISUAL --`
7. **First-use hints** — show top 3 commands on first invocation; suppress later

**369 application:** A 369 TUI MUST surface its action vocabulary via at least one of (1), (2), (3), (4). Mystery interface is a UX failure.

---

## Error UX — Without Modals

### The TUI error-style hierarchy

| Severity | Visual | Position | Persistence |
|----------|--------|----------|-------------|
| **Info** | Default text + leading `•` | Status line | 3s timeout or until next action |
| **Warning** | Warning color (`#a60315`) + leading `▲` | Status line | Until acknowledged or next action |
| **Error** | Error color (warning red bold) + leading `✕` | Status line | Until acknowledged |
| **Fatal** | Error color + full row + leading `✕✕` | Inline in body | Until user acts (cannot continue) |
| **Confirmation** | Question color + leading `?` | Status line or modal | Blocks until input |

### Error message anatomy (the three-part rule)
1. **What failed** — `Connection refused`
2. **Why** — `api.example.com:443 unreachable`
3. **How to fix** — `Check API_KEY env var and network connection. See: docs.example.com/auth`

If you can't write all three, the error is incomplete.

### What to AVOID
- **Beep / Bell** (`\a` / `0x07`) — annoys; disable by default
- **Modal dialogs for non-blocking errors** — they break flow
- **Cryptic codes without explanation** — `Error code -32001` is useless
- **Color-only error indication** — fails accessibility; pair with `✕` glyph + "Error:" prefix
- **Stack traces in user-facing error output** — pipe to log file; show user-readable summary
- **Confirmation dialogs for non-destructive operations** — adds friction without value

### What to DO
- **Error messages on stderr; data on stdout** — Unix philosophy preserved
- **Exit codes correct** — 0/1/2/126/127/130 per convention
- **Persistent visible status until acknowledged** — error doesn't auto-disappear
- **Recovery suggestions when possible** — `Did you mean: ...?` for typos

**369 application:** Every error path through a 369 TUI must pass the three-part test. Missing the "how to fix" is a bug, not a polish item.

---

## Onboarding — Without Tutorials

### The TUI onboarding paradox

TUIs have notoriously steep learning curves. The reason: power-user efficiency requires investment. But this creates "vim deserves the user it deserves" — only users who already know vim use vim, perpetuating the elite-club aesthetic.

### Five strategies for lower-barrier onboarding

1. **First-launch quickstart screen**
   - Show the 3–5 essential keys
   - Lazy-show only on first launch
   - Disable with `--no-tutorial`
   - Example: `lazygit` shows "press ? for help" on first run

2. **Inline hint strip when mode changes**
   - Vim's status line shows `-- INSERT --` when entering insert mode
   - More verbose modes show keymap: `[: command] [/ search] [q quit]`

3. **Discoverable command palette**
   - Make `:` (or `Ctrl-P`) open a fuzzy-searchable list of every command
   - Users can browse before they memorize

4. **Progressive disclosure**
   - Basic mode + power mode
   - vim's `vim -u NONE` simple mode vs `~/.vimrc` advanced
   - 369 TUI default: show only essential keys; advanced keys behind `--expert` or config flag

5. **Mnemonic key vocabulary** — design key bindings so they're guessable:
   - `q` = quit
   - `/` = search
   - `n` = next
   - `e` = edit
   - `d` = delete
   - Spacemacs leader-key naming (`SPC f f` = file find, `SPC g s` = git status)

**Anti-pattern:** dropping users into a modal editor with no indication of how to type. Vim's `vimtutor` exists because the first-launch UX otherwise fails.

**369 application:** A 369 TUI MUST have a discoverable onboarding path. First-launch hint + `?` help + tab-completable commands. The "vim-from-scratch" experience is a UX failure.

---

## Time-Perception & Perceived Latency

### Why TUIs feel fast

**Three reasons:**

1. **Character-level updates** — vim updates one character at a time when you type. The visual feedback is instantaneous. Browsers update DOM nodes that include layout reflow + repaint; that's slower in practice.

2. **No animation budget** — a click in a GUI animates a transition (300ms standard); a key in a TUI is instant. No "waste motion."

3. **No layout reflow** — fixed-width cells. A character changes; nothing else moves. Web pages frequently reflow on update, which the brain registers as latency.

**Result:** TUIs feel fast even when they're not actually fast. Toad (Will McGugan's AI assistant) explicitly cites "zero flicker" as the reason TUI was chosen for agent UX over web.

### Latency budgets

Established perceptual thresholds:
- **<10ms** — feels instant
- **10–100ms** — feels responsive
- **100–300ms** — noticeable lag
- **>300ms** — feels broken

**TUI design implication:**
- Input echo MUST be <10ms (terminal does this for free in raw mode)
- State updates SHOULD be <100ms
- Network operations SHOULD show spinner if >300ms expected

### Synchronized output (mode 2026)
This is *why* sync output matters for UX. Without BSU/ESU:
- Frame draws character-by-character
- User's eye catches transient inconsistent states
- Subjective latency increases even at the same frame rate

With BSU/ESU:
- Frame appears atomically
- No visible tearing
- Subjective speed increases

**369 application:** Rule 10 in SKILL.md (mandatory sync output) is a UX requirement, not just a technical detail.

### Anti-patterns
- **Spinning on operations <100ms** — spinner appears + disappears = flicker
- **Full-screen redraws on every update** — use delta rendering (ratatui-style)
- **Synchronous file I/O on input handler** — locks the UI; use async
- **Blocking modal dialogs for status** — non-blocking status line preferred

---

## Color + Contrast in Terminal Reality

### The WCAG problem

WCAG (Web Content Accessibility Guidelines) requires 4.5:1 contrast ratio for AA, 7:1 for AAA. The 16 standard ANSI colors *largely fail* this:
- Black on blue: ~1.5:1 (WCAG fail)
- Bright blue on black: varies by terminal — usually ~3-5:1
- Red on black: ~5:1 (close to AA)
- Bright white on black: ~21:1 (AAA pass)
- 369 navy `#001089` on white: ~14:1 (AAA pass)
- 369 manila `#f8eac7` on navy: ~10:1 (AAA pass)

### Practical contrast rules for 369 TUIs
1. **Default body text:** bright white or 369 navy on black/white — these always pass
2. **Status line:** navy/manila/grey on white — all pass AA
3. **Error highlight:** never red-on-default-bg. Use red foreground on default; the contrast is sufficient.
4. **Mode indicator:** reverse video (`SGR 7`) is always sufficient — uses terminal's chosen palette

### The NO_COLOR rule
Honor `NO_COLOR` env var (per [no-color.org](https://no-color.org/)) absolutely. When set:
- Disable ALL color
- Replace color-bearing meaning with text/glyph (e.g., error becomes `✕ Error: ...`)
- The TUI must remain fully functional in monochrome

**369 application:** Test every TUI with `NO_COLOR=1`. If meaning is lost, the design is broken (Heuristic 9 + accessibility).

### Color-blind considerations
- 8% of males / 0.5% of females have some red-green color deficiency
- **Pair color with glyph** — `✓` not just green text; `✕` not just red text
- **Use distinct hue families** — don't put green + red against each other as the only differentiator
- 369's palette (navy + manila + grey + green/red for status) is already color-blind-friendly because it uses distinct hue families

### Contrast in 16-color mode
When forced to 16 ANSI colors:
- **bright-white on black** = highest contrast
- **bright-cyan on black** = good readability
- **bright-yellow on black** = warning (intentional attention-grab)
- **bright-red on black** = error
- **DO NOT use:** bright-blue, bright-magenta on black (often too dim)
- **DO NOT use:** black-on-yellow, black-on-cyan (terminal renders vary)

---

## TUI-Specific Mental Models

### The Model that distinguishes good TUIs

Each successful TUI has a **single dominant mental model** the user holds:
- **vim** = "I'm editing text; commands manipulate text under my cursor"
- **htop** = "I'm watching processes; F-keys command the process at my row"
- **lazygit** = "I'm viewing git state across panels; tab switches scope, keys act"
- **k9s** = "I'm navigating Kubernetes resources; arrow keys traverse hierarchy, `:` opens commands"
- **mutt** = "I'm in the index of an inbox; arrows scroll, enter opens, q goes back"

The mental model is the *organizing principle*. If your user can articulate it in one sentence, the UX is right.

**369 application:** Every 369 TUI must have a one-sentence mental-model statement. If you can't write it, the design is unclear.

### Bad mental models
- "Open many tabs of unrelated things" — the GUI default; bad in TUI (no peripheral visibility)
- "Click around to find features" — bad in TUI (no clicking)
- "Each screen is a separate thing" — bad in TUI (no z-axis to support layering)

### Good mental models for TUIs
- Master-detail (list + preview)
- Hierarchical navigation (tree + selected branch)
- Tabbed sequential (cycle through 3–5 modes via Tab)
- Modal (vim-style: normal mode + insert mode + visual mode)
- Stack (each Enter pushes; Esc pops)

---

## Accessibility Considerations (Beyond NO_COLOR)

### Screen reader interaction
Screen readers (NVDA, JAWS, VoiceOver, Orca) read terminal output. They:
- Strip ANSI escape codes
- Read remaining text
- Cannot announce mode changes or focus shifts unless text emits them

**369 application:**
- ALWAYS pair color with text — `Error: ...` not just red
- Emit mode changes as text in the status line — `-- INSERT --` is readable
- Announce focus changes via text — "Focus: filename input" in status
- Disable animation/spinner when screen-reader detected (via env var or config)

### Keyboard-only navigation
TUIs default to this; the 369 contract is:
- **Every interactive element reachable via Tab / arrow keys**
- **Every command available via keystroke** (no mouse-only)
- **No timing-required input** — give the user as long as they need

### Cognitive accessibility
- Avoid jargon in user-visible UI (Heuristic 2)
- Provide undo for any action (Heuristic 3)
- Keep mode count low — 3 modes maximum (vim has normal+insert+visual; that's the upper limit)
- Provide breadcrumbs for deep hierarchies — k9s' resource path display

---

## Anti-Patterns to Avoid

| Anti-pattern | Why it fails | Replacement |
|--------------|--------------|-------------|
| Hover-equivalent (showing details on focus) | Without hover, this is invisible | Persistent preview pane |
| Sprawling modal hierarchy | Lost track of where you are | Flat panel structure with Tab |
| Color-only meaning | Fails NO_COLOR + color-blindness | Color + glyph + label |
| Animation on every state change | Causes flicker; wastes terminal bandwidth | Animate only ambiguous states (spinners) |
| Mystery keymap (no help) | Users can't learn the tool | F-key strip + ? help + command palette |
| Auto-disappearing errors | User missed it; can't recover | Persistent until acknowledged |
| Print-on-success in CLI mode | Pollutes pipelines | Silent on success (Rule 12) |
| Confirmation for every action | Confirmation fatigue → user clicks through | Confirm only destructive |
| Multi-line status line | Eats body | Single line; multiple sections separated by `│` |
| Wide-only design (>80 cols) | Breaks on default terminal | Test at 80×24 minimum |
| Modal dialogs for status | Blocks user flow | Status line for status, modal only for input |
| Resize-rearrange layout | Breaks spatial memory | Stable column proportions on resize |

---

## The 369 TUI UX Checklist

Use this for new-TUI design and audits.

### Discoverability
- [ ] Hotkey strip visible (bottom or top)
- [ ] `?` help shows full keymap
- [ ] `--help` shows usage + flags + example
- [ ] Command palette / `:` command-mode available
- [ ] First-launch hint surfaced (suppressible)

### Status visibility
- [ ] Status line persistent (1 row at top or bottom)
- [ ] Mode indicator loud (color + text + position)
- [ ] Cursor position shown
- [ ] Dirty / unsaved indicator
- [ ] Long-running operations show spinner

### Error handling
- [ ] Errors include: what failed + why + how to fix
- [ ] Errors prefixed with `Error:` (color-blind / NO_COLOR safe)
- [ ] Errors visible until acknowledged
- [ ] Bell `\a` disabled by default
- [ ] Exit codes follow Unix convention

### Cancellation + recovery
- [ ] `Esc` cancels current mode/dialog
- [ ] `Ctrl-C` aborts current operation
- [ ] Undo (`u`) for reversible operations
- [ ] Confirmation ONLY for destructive ops

### Consistency
- [ ] `j/k` for up/down where applicable
- [ ] `q` for quit
- [ ] `/` for search
- [ ] `Tab` for completion / focus next
- [ ] Readline shortcuts in input fields

### Information design
- [ ] Position encodes most-important category
- [ ] Color encodes magnitude or category
- [ ] Whitespace minimized
- [ ] Borders structural (not decorative)
- [ ] Density appropriate (don't apologize)

### Color + contrast
- [ ] AA contrast for all body text
- [ ] `NO_COLOR` respected
- [ ] Color paired with glyph for meaning
- [ ] Distinct hue families (color-blind safe)
- [ ] Tested in 16-color mode

### Performance
- [ ] Sync output (BSU/ESU mode 2026) enabled
- [ ] Input echo <10ms
- [ ] State update <100ms
- [ ] Operations >300ms show spinner
- [ ] Delta rendering (not full-screen redraw)

### Accessibility
- [ ] Keyboard-only navigation reaches every element
- [ ] Screen-reader text emits mode + focus changes
- [ ] No timing-required input
- [ ] Maximum 3 modes
- [ ] Breadcrumbs in deep hierarchies

### Onboarding
- [ ] Mnemonic key choices
- [ ] First-launch quickstart
- [ ] Progressive disclosure (basic + expert)
- [ ] Fuzzy command search
- [ ] Tab completion exposes vocabulary

---

## See Also

- [[tui-patterns]] — Tactical interaction patterns (the *how*, after this *why*)
- [[tui-design]] — Framework architecture (the *implementation*, after this *design*)
- [[tui-frameworks-complete]] — Framework selection guide
- [[tui-modern-gaps]] — Accessibility / mobile / WASM specifics
- [[tui-i18n]] — i18n in TUIs (extends accessibility section)
- [[unicode-art-extended]] — Glyph vocabulary for affordances + indicators
- [[terminal-capabilities]] — Color tiers + protocol features that constrain UX
- [[unix-cli-principles]] — ESR's 17 rules + CLIG (Rule of Silence + composition)
- [[ascii-composition]] — Information design algorithms (sparklines, bars, etc.)
- [[knowledge-bounds]] — What this canon does and doesn't know

For the foundational reasoning (constraint aesthetics, same-input-same-output, etc.) see `../canon-axioms.md`.

---

## Authoritative Sources

- Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design.* — nngroup.com/articles/ten-usability-heuristics
- Tufte, E. (1983). *The Visual Display of Quantitative Information.*
- Tufte, E. (1990). *Envisioning Information.*
- Bertin, J. (1967, EN 1983). *Semiology of Graphics.*
- Fitts, P. M. (1954). "The information capacity of the human motor system."
- Card, S. K., Moran, T. P., Newell, A. (1983). *The Psychology of Human-Computer Interaction.*
- Norman, D. (1988/2013). *The Design of Everyday Things.*
- Krug, S. (2000). *Don't Make Me Think.*
- Will McGugan — *7 Things I've Learned Building a Modern TUI Framework* — textualize.io/blog
- Brandur Leach — *Learning From Terminals to Design the Future of UI* — brandur.org/interfaces
- Julia Evans — *Rules That Terminal Programs Follow* — jvns.ca/blog/2024/11/26/terminal-rules/
- arXiv:2603.10664 — *Terminal Is All You Need: Design Properties for Human-AI Agent Collaboration*
- no-color.org — NO_COLOR standard
- clig.dev — Command Line Interface Guidelines (Aanand Prasad et al.)
