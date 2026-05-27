# Terminal Capabilities — Complete Technical Reference

> **The terminal is a layered protocol.** At the bottom: ASCII bytes. Above that: ANSI escape codes (ECMA-48 / ISO 6429). Above that: vendor extensions for graphics, mouse, keyboard, and synchronization. A 369 TUI must know every layer it sits on. This page is the authoritative reference for the protocol surface — what escape codes exist, how they work, which terminals support what, and how a 369-compliant TUI detects and adapts.

Load this when writing or auditing TUI code, designing renderer abstraction layers, or debugging color/escape issues. For framework choices that build on this protocol, see [[tui-frameworks-complete]]. For glyph vocabulary, see [[unicode-art-extended]].

---

## The Stack at a Glance

| Layer | Standard | Year | Codepoint Anchor |
|-------|----------|------|------------------|
| **Bytes** | ASCII (ISO 646) | 1963 | C0 controls: 0x00–0x1F |
| **C1 controls** | ECMA-48 / ISO 6429 | 1976 | 0x80–0x9F (or `ESC <upper>` in 7-bit) |
| **CSI** (Control Sequence Introducer) | ANSI X3.64 → ECMA-48 | 1979 | `ESC [` |
| **OSC** (Operating System Command) | ECMA-48 | 1976 | `ESC ]` |
| **DCS** (Device Control String) | ECMA-48 | 1976 | `ESC P` |
| **APC** (Application Program Command) | ECMA-48 | 1976 | `ESC _` |
| **PM** (Privacy Message) | ECMA-48 | 1976 | `ESC ^` |
| **VT100** terminal spec | DEC | 1978 | First mass-adopted CSI implementation |
| **VT220/VT320** | DEC | 1983–87 | Multi-language + extended controls |
| **xterm** | MIT X11 | 1984 | 188+ controls, de-facto modern superset |
| **Sixel graphics** | DEC | 1982 | Inside DCS |
| **iTerm2 inline images** | Vendor extension | 2014 | Inside OSC 1337 |
| **Kitty graphics protocol** | Vendor extension | 2018 | Inside APC |
| **Synchronized output (mode 2026)** | Vendor consensus | 2021 | CSI ? 2026 h / l |
| **Kitty keyboard protocol** | Vendor consensus | 2021 | CSI u format |

---

## ANSI Escape Code Anatomy

Every ANSI escape sequence starts with `ESC` (0x1B, octal `\033`, decimal 27, C escape `\e`).

### CSI — the workhorse
```
ESC [  <parameters>  <intermediate bytes (rare)>  <final byte>
0x1B 0x5B  0x30–0x3F   0x20–0x2F                   0x40–0x7E
```
- **Parameters:** digits, semicolons, colons. Empty = default.
- **Final byte:** the command (letter or symbol).
- **Example:** `\x1b[31m` → `ESC [ 31 m` → SGR with param 31 → "set foreground red"

### OSC — for setting things outside the cursor model
```
ESC ]  <command number> ; <data>  ST
```
- **ST** (String Terminator) = `ESC \` (0x1B 0x5C) or `BEL` (0x07).
- **Examples:**
  - `\x1b]0;My Window Title\x07` — set window title
  - `\x1b]8;;https://example.com\x1b\\Click me\x1b]8;;\x1b\\` — OSC 8 hyperlink
  - `\x1b]52;c;<base64-clipboard-data>\x1b\\` — OSC 52 clipboard write

### DCS — for variable-length binary data (Sixel images, DECRQSS responses)
```
ESC P  <params>  <data>  ST
```

### APC — for graphics protocols (Kitty graphics)
```
ESC _  <data>  ST
```

### 7-bit vs 8-bit
C1 controls can be encoded two ways:
- **7-bit:** `ESC` + upper-half char. CSI = `ESC [`. Two bytes.
- **8-bit:** Single byte 0x80–0x9F. CSI = 0x9B. One byte.

Modern terminals overwhelmingly use 7-bit. Xterm's S8C1T mode enables 8-bit, but very few applications emit it because it conflicts with UTF-8 (UTF-8 multi-byte sequences use the 0x80–0xBF range).

---

## C0 Control Codes (must-know)

| Hex | Dec | Name | C-escape | Use |
|-----|-----|------|----------|-----|
| 0x07 | 7 | BEL | `\a` | Bell / alert |
| 0x08 | 8 | BS | `\b` | Backspace (move cursor left) |
| 0x09 | 9 | HT | `\t` | Horizontal tab |
| 0x0A | 10 | LF | `\n` | Line feed |
| 0x0B | 11 | VT | `\v` | Vertical tab |
| 0x0C | 12 | FF | `\f` | Form feed / clear screen on some terms |
| 0x0D | 13 | CR | `\r` | Carriage return |
| 0x1B | 27 | ESC | `\e` | Start of escape sequence |
| 0x7F | 127 | DEL | — | Delete (sometimes backspace, terminal-dependent) |

---

## VT100 / VT220 / xterm Capability Hierarchy

```
VT100 (1978)
  └─ VT102 (most minimum compatibility)
      └─ VT220 (1983) — 8-bit, NRCS, function keys
          └─ VT320 / VT420 / VT520 (1987–94) — extra modes
              └─ xterm (1984+) — superset, currently 188+ primary controls
                  └─ Modern emulators (Alacritty, Kitty, WezTerm, Ghostty, etc.)
```

### Device Attribute queries (capability detection)

| Sequence | Name | Purpose |
|----------|------|---------|
| `ESC Z` | DECID | Identify (VT52-style; rare today) |
| `\x1b[c` | **DA1 Primary** | Architectural class + base attributes |
| `\x1b[>c` | **DA2 Secondary** | Firmware version, hardware options |
| `\x1b[=c` | **DA3 Tertiary** | Unit identification code |

**DA1 typical xterm response:** `CSI ? 63 ; 1 ; 2 ; 4 ; 6 ; 9 ; 15 ; 22 ; 29 c`
- `63` = VT320 type
- subsequent params = optional features (132-column, printer, regional, color, etc.)

**DA2 typical response:** `CSI > 0 ; 136 ; 0 c` — vendor 0 = xterm-compatible.

---

## Color Systems — The Four Tiers

| Tier | Bits | Colors | Detection signal |
|------|------|--------|------------------|
| 1. **Monochrome** | 0 | 2 | `TERM=dumb` or `NO_COLOR` set |
| 2. **4-bit ANSI** | 4 | 16 (8 normal + 8 bright) | Any TERM that's not "dumb" |
| 3. **8-bit indexed** | 8 | 256 | `TERM=*-256color` |
| 4. **24-bit truecolor** | 24 | 16,777,216 | `COLORTERM=truecolor` or `24bit` |

### Tier 2 — 4-bit ANSI (16 colors)

**SGR foreground:** 30–37 (basic), 90–97 (bright)
**SGR background:** 40–47 (basic), 100–107 (bright)

```
Code  Color    Code  Color
30/40 Black    90/100 Bright Black (= dark grey)
31/41 Red      91/101 Bright Red
32/42 Green    92/102 Bright Green
33/43 Yellow   93/103 Bright Yellow
34/44 Blue     94/104 Bright Blue
35/45 Magenta  95/105 Bright Magenta
36/46 Cyan     96/106 Bright Cyan
37/47 White    97/107 Bright White
```

**Critical caveat:** The RGB values for these 16 colors are **terminal-dependent**. The same `31m` is `#cd0000` in xterm but `#de382b` in Ubuntu's terminal and `#c91b00` in iTerm2. NEVER design with the assumption that ANSI red is a specific shade. For brand-accurate colors → use tier 4 (truecolor).

### Tier 3 — 8-bit indexed (256 colors)

**Format:**
- Foreground: `CSI 38 ; 5 ; <index> m`
- Background: `CSI 48 ; 5 ; <index> m`

**Index layout:**
- `0–15`: same as 4-bit ANSI (still terminal-dependent for these 16)
- `16–231`: 6×6×6 RGB color cube → index = `16 + 36·R + 6·G + B` where R,G,B ∈ [0,5]
  - Component intensity levels: `[0, 95, 135, 175, 215, 255]`
- `232–255`: 24-step grayscale → grey value = `8 + 10·n` where n ∈ [0,23]

The 216-color cube + 24 greys section IS deterministic across terminals. Use these for repeatable rendering.

### Tier 4 — 24-bit truecolor

**Format (semicolon variant — universal):**
- Foreground: `CSI 38 ; 2 ; <R> ; <G> ; <B> m`
- Background: `CSI 48 ; 2 ; <R> ; <G> ; <B> m`

**ISO-8613-6 colon variant (rarely supported):** `CSI 38 : 2 : <R> : <G> : <B> m`

**Example:** `\x1b[38;2;0;16;137m` → 369 navy `#001089`

**Detection:** `$COLORTERM == "truecolor"` or `"24bit"`.

### Detection cascade (369 standard)

```python
def color_tier():
    if os.environ.get("NO_COLOR"):
        return 0  # monochrome
    if os.environ.get("COLORTERM") in ("truecolor", "24bit"):
        return 24
    term = os.environ.get("TERM", "")
    if "256color" in term:
        return 8
    if term == "dumb":
        return 0
    return 4  # default ANSI-16
```

### `NO_COLOR` standard

- Any non-empty value disables color (https://no-color.org/).
- Precedence: explicit CLI flag > config file > `NO_COLOR` > default.
- 369 TUIs MUST honor `NO_COLOR` — same input → same output rule (Rule 8).

---

## SGR Parameters — Full Reference

| Param | Effect | Reset |
|-------|--------|-------|
| 0 | Reset all attributes | — |
| 1 | Bold / bright intensity | 22 |
| 2 | Dim / half-bright | 22 |
| 3 | Italic | 23 |
| 4 | Underline | 24 |
| 4:0 | No underline | — |
| 4:1 | Single underline | — |
| 4:2 | Double underline | — |
| 4:3 | Curly underline (modern terminals) | — |
| 4:4 | Dotted underline | — |
| 4:5 | Dashed underline | — |
| 5 | Slow blink | 25 |
| 6 | Rapid blink (rarely implemented) | 25 |
| 7 | Reverse video (swap fg/bg) | 27 |
| 8 | Conceal | 28 |
| 9 | Strikethrough | 29 |
| 21 | Double underline OR no-bold (terminal-dependent) | — |
| 22 | Normal intensity | — |
| 23 | No italic | — |
| 24 | No underline | — |
| 25 | No blink | — |
| 27 | No reverse | — |
| 28 | No conceal | — |
| 29 | No strikethrough | — |
| 30–37 | Foreground 4-bit | 39 |
| 38;5;n | Foreground 8-bit | 39 |
| 38;2;r;g;b | Foreground 24-bit | 39 |
| 39 | Default foreground | — |
| 40–47 | Background 4-bit | 49 |
| 48;5;n | Background 8-bit | 49 |
| 48;2;r;g;b | Background 24-bit | 49 |
| 49 | Default background | — |
| 58;... | Underline color (same format as 38) | 59 |
| 90–97 | Bright foreground | 39 |
| 100–107 | Bright background | 49 |

**Combining:** `\x1b[1;4;38;2;255;0;0m` = Bold + Underlined + 24-bit red foreground.

---

## Cursor & Screen Control — Full Reference

### Cursor positioning

| Sequence | Mnemonic | Effect |
|----------|----------|--------|
| `CSI <n> A` | CUU | Cursor up n |
| `CSI <n> B` | CUD | Cursor down n |
| `CSI <n> C` | CUF | Cursor forward (right) n |
| `CSI <n> D` | CUB | Cursor back (left) n |
| `CSI <n> E` | CNL | Cursor next line — down n, column 1 |
| `CSI <n> F` | CPL | Cursor previous line — up n, column 1 |
| `CSI <n> G` | CHA | Cursor column n (absolute) |
| `CSI <r> ; <c> H` | CUP | Cursor to row r, column c |
| `CSI <n> d` | CVA | Cursor row n (absolute) |
| `ESC 7` | DECSC | Save cursor state |
| `ESC 8` | DECRC | Restore cursor state |

All row/column values are **1-indexed**.

### Screen clearing

`CSI <n> J` — Erase in Display:
| n | Effect |
|---|--------|
| 0 | Cursor → end of display (default) |
| 1 | Start → cursor |
| 2 | Entire display |
| 3 | + scrollback (xterm extension) |

`CSI <n> K` — Erase in Line (does NOT move cursor):
| n | Effect |
|---|--------|
| 0 | Cursor → end of line (default) |
| 1 | Start → cursor |
| 2 | Entire line |

### Line / character ops

| Sequence | Mnemonic | Effect |
|----------|----------|--------|
| `CSI <n> L` | IL | Insert n blank lines at cursor |
| `CSI <n> M` | DL | Delete n lines |
| `CSI <n> P` | DCH | Delete n characters |
| `CSI <n> @` | ICH | Insert n blank characters |
| `CSI <n> X` | ECH | Erase n characters |
| `CSI <n> S` | SU | Scroll up n |
| `CSI <n> T` | SD | Scroll down n |

### Cursor style

`CSI <n> SP q` — DECSCUSR:
| n | Style |
|---|-------|
| 0 / 1 | Blinking block (default) |
| 2 | Steady block |
| 3 | Blinking underline |
| 4 | Steady underline |
| 5 | Blinking bar / I-beam |
| 6 | Steady bar / I-beam |

### Cursor visibility

| Sequence | Effect |
|----------|--------|
| `CSI ? 25 h` | Show cursor (DECSET 25) |
| `CSI ? 25 l` | Hide cursor (DECRST 25) |

---

## Alternate Screen Buffer (smcup / rmcup)

Used by vim, htop, less, tmux, fzf — and every full-screen 369 TUI.

| Sequence | Action | Terminfo |
|----------|--------|----------|
| `\x1b[?1049h` | Enter alternate screen (saves cursor + main screen) | `smcup` |
| `\x1b[?1049l` | Exit alternate screen (restores them) | `rmcup` |

**Older form** (less reliable, doesn't save cursor): `\x1b[?47h` / `\x1b[?47l`.

**Pattern for a 369 TUI:**
```python
sys.stdout.write("\x1b[?1049h\x1b[?25l")  # alt screen + hide cursor
try:
    main_loop()
finally:
    sys.stdout.write("\x1b[?25h\x1b[?1049l")  # restore cursor + main screen
```

The `try / finally` is non-negotiable. If the TUI crashes without `rmcup`, the user is left with a corrupted terminal. Always restore in a signal handler too — see Window Management below.

---

## Synchronized Output (Mode 2026)

The most important modern extension. Prevents tearing and "half-drawn frames" during high-rate updates.

```
ESC [ ? 2026 h    Begin Synchronized Update (BSU)
ESC [ ? 2026 l    End Synchronized Update (ESU)
```

**Pattern:**
```
BSU
  → many cursor moves, color changes, character writes
ESU
  → terminal renders all changes in one atomic frame
```

**Detection query:** `CSI ? 2026 $ p` → reply `CSI ? 2026 ; <status> $ y` where status:
- `0`: Not recognized
- `1`: Set / supported
- `2`: Reset / supported
- `3`: Permanently set
- `4`: Permanently reset

**Supporting terminals (2026 snapshot):**
- tmux 3.4+
- Xterm.js (web-based)
- Windows Terminal
- Contour Terminal
- Blink Shell
- WezTerm
- Kitty (partial)
- Ghostty
- Foot

**Graceful fallback:** unsupported terminals ignore the BSU/ESU sequences and render normally. Always emit them — the worst case is "no harm done."

**T6 in 369 TUI rules:** *Single write per frame.* Wrap each frame's output in BSU/ESU. See [[tui-design]].

---

## Graphics Protocols — The Image Plane

### Sixel (DEC, 1982)

- **Encoding unit:** "sixel" = 6 pixels tall × 1 pixel wide column.
- Each sixel encoded as a single byte: bit pattern → ASCII char = `63 + pattern`.
  - All-black sixel (0) = `?` (0x3F).
  - All-lit sixel (0b111111) = `~` (0x7E).
- **Wrapping:** Inside DCS — `ESC P <params> q <sixel-data> ESC \`.
- **Color limits:** 6-bit RGB or HLS (terminal-dependent register count).
- **No transparency, no true color, no animation.**
- **Supporting terminals (2026):** xterm (patched), mlterm 3.1.9+, foot, contour, WezTerm, mintty, Black Box.

### Kitty Graphics Protocol (kovidgoyal/kitty, 2018)

- **Wrapping:** Inside APC — `ESC _ G <chunked control data> ; <chunked image data> ESC \`.
- **Transmission modes:**
  - `t=d` — direct (base64 inline)
  - `t=f` — file path
  - `t=t` — temp file (auto-delete)
  - `t=s` — POSIX shared memory (fastest local)
- **Formats:** PNG (decode by terminal), RGB24/RGBA32 raw bytes, JPEG, GIF, BMP.
- **Features:**
  - True 24-bit color + alpha transparency
  - Z-index layering (text above or below image)
  - Animation (since v0.20) — delta frames for SSH efficiency
  - Mouse coordinate translation
  - Direct or virtual placement
- **Supporting terminals (2026):** Kitty, Ghostty, WezTerm, Konsole (partial), wezterm, st-with-patches.

### iTerm2 Inline Images (2014)

- **Wrapping:** Inside OSC 1337 — `ESC ] 1337 ; File = <opts> : <base64> BEL`
- **Format:** Any macOS-supported (PNG, JPEG, GIF, BMP, PDF, PICT, etc.).
- **Animation:** Animated GIFs since v2.9.20150512.
- **Options:** `name=<base64>`, `size=<bytes>`, `width=<n[px|%]>`, `height=<n>`, `preserveAspectRatio=1`, `inline=1`.
- **Companion tool:** `imgcat` shell script (ships with iTerm2).
- **Supporting terminals:** iTerm2 (native), WezTerm (`imgcat` subcommand).

### Terminology Inline Images (Enlightenment, 2010s)

- Less widely adopted than Sixel / Kitty / iTerm2.
- Used in the Terminology terminal emulator.

### Überzug / Überzug++

- **NOT a terminal protocol** — external X11/Wayland tool that overlays images on top of terminal window.
- Used in ranger, lf file managers for image thumbnails.
- Brittle, breaks on focus changes, deprecated for `kitty +kitten icat` and chafa.

### Decision tree for 369 TUI image rendering

```
Have $TERM_PROGRAM == "iTerm.app"?     → iTerm2 protocol
Or $TERM == "xterm-kitty"?             → Kitty graphics
Else query DA1 for sixel attribute (4)?
  - Yes:                               → Sixel
  - No:                                → Unicode mosaic (chafa --symbols block)
```

In practice: invoke `chafa` and let it auto-detect.

---

## Mouse Support — The Six Modes

Modern TUIs almost universally use **SGR pixel mode (1006) + button-event tracking (1002)**. The others exist for backward compatibility.

| Mode | DECSET code | Reports |
|------|-------------|---------|
| **X10** | `?9` | Press only, basic |
| **VT200 Press+Release** | `?1000` | Press + release, no motion |
| **Button-event** | `?1002` | Press + release + motion while button held |
| **Any-event** | `?1003` | Every motion |
| **SGR extended** | `?1006` | Press/release/motion with coordinates > 223 |
| **SGR pixel** | `?1016` | Pixel-resolution coordinates (Kitty extension) |

### Enable / disable

```
ESC [ ? 1006 h    Enable SGR extended
ESC [ ? 1006 l    Disable

ESC [ ? 1002 h    Enable button-event tracking
ESC [ ? 1002 l    Disable
```

**369 recommended baseline:** enable `?1006` + `?1002` together. This gives press+release+drag events with no coordinate-encoding limits.

### SGR format report

```
ESC [ < <button>;<x>;<y> M    (press)
ESC [ < <button>;<x>;<y> m    (release — note lowercase m!)
```

**Button encoding:**
| Code | Button |
|------|--------|
| 0 | Left press |
| 1 | Middle press |
| 2 | Right press |
| 64 | Scroll up |
| 65 | Scroll down |
| +4 | Shift modifier |
| +8 | Alt / Meta modifier |
| +16 | Control modifier |
| +32 | Motion bit (drag) |

**Example:** `\x1b[<0;40;10M` → left button pressed at column 40, row 10.

### Legacy X10 format (avoid)

```
ESC [ M <button-char> <x-char> <y-char>
```
- All values are bytes with `+32` offset (i.e., space char = 0).
- Coordinates capped at 223 (255 − 32). Useless beyond that.
- Don't enable mode 9; use SGR instead.

---

## Keyboard Input — Two Protocols

### Legacy (every terminal supports)

- Each key is a sequence of bytes.
- Ambiguity: `ESC` alone vs. `ESC` + key (Alt+key) — must distinguish with a timeout (commonly 25–50ms).
- F-keys, arrows, etc., emit CSI sequences:
  - `\x1b[A` = Up arrow
  - `\x1b[B` = Down arrow
  - `\x1bOP` = F1 (xterm)
  - `\x1b[11~` = F1 (Linux console)
- Shift / Alt / Ctrl modifiers are encoded inconsistently. `Shift+3` becomes `#` (the shifted character) — the base key is unrecoverable.
- libtermkey (Paul "LeoNerd" Evans) abstracts the chaos for cross-terminal parsing.

### Kitty Keyboard Protocol (2021)

The modern alternative. Reports base key + modifiers separately.

**Enable:** `CSI > <flags> u` (1 = disambiguate, 2 = report event types, 4 = alternates, 8 = key release events, 16 = associated text).

**Common baseline:** `CSI > 1 u` (disambiguate escapes — fixes Alt+key ambiguity).

**Key event format:** `CSI <keycode> ; <modifiers> ; <text> u`
- Keycode: Unicode codepoint of the base key (e.g., 51 for '3' regardless of Shift).
- Modifiers: bitmask (1=Shift, 2=Alt, 4=Ctrl, 8=Super, 16=Hyper, 32=Meta, 64=CapsLock, 128=NumLock).
- Text: the actual character that should be inserted (if any).

**Functional keys** (no Unicode equivalent) use Private Use Area (PUA): codepoints 57344–63743.

**Supporting terminals (2026):** Kitty, Alacritty, Foot, Ghostty, iTerm2 (3.5+), Rio, WezTerm.

**369 baseline:** Try to enable Kitty keyboard protocol with `CSI > 1 u`, query support with `CSI ? u`, fall back to legacy parsing if unsupported. Save state on entry, restore on exit.

---

## Window Management

### SIGWINCH — terminal resize signal

POSIX. Sent to the foreground process group when the controlling terminal resizes.

**Pattern (C):**
```c
#include <signal.h>
#include <sys/ioctl.h>

void on_winch(int sig) {
    struct winsize ws;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &ws);
    redraw(ws.ws_row, ws.ws_col);
}

signal(SIGWINCH, on_winch);
```

**Pattern (Python):**
```python
import signal, fcntl, termios, struct, sys
def get_size():
    return struct.unpack("HH", fcntl.ioctl(sys.stdout, termios.TIOCGWINSZ, b"\0"*4))
signal.signal(signal.SIGWINCH, lambda s,f: redraw(*get_size()))
```

### `TIOCGWINSZ` ioctl

Always available on POSIX. Returns:
- `ws_row` — terminal rows
- `ws_col` — terminal columns
- `ws_xpixel` — pixel width (rarely populated)
- `ws_ypixel` — pixel height (rarely populated)

### Escape-code-based size query (alternative)

```
ESC [ 18 t     Request terminal size in cells
                Reply: ESC [ 8 ; <rows> ; <cols> t

ESC [ 14 t     Request terminal size in pixels
                Reply: ESC [ 4 ; <h> ; <w> t

ESC [ 16 t     Request character cell size in pixels
                Reply: ESC [ 6 ; <ch> ; <cw> t
```

Not universally supported. TIOCGWINSZ is preferred.

---

## Signal Handling for TUIs

A TUI that doesn't restore the terminal on exit leaves the user broken. Mandatory cleanup pattern:

| Signal | Default | TUI handler |
|--------|---------|-------------|
| `SIGINT` (Ctrl-C) | Terminate | Save state, restore terminal, exit 130 |
| `SIGTERM` | Terminate | Same as SIGINT |
| `SIGHUP` (terminal closed) | Terminate | Same as SIGTERM |
| `SIGWINCH` | Ignore | Re-query size, re-render |
| `SIGTSTP` (Ctrl-Z) | Stop | Restore terminal first, then stop |
| `SIGCONT` (resumed) | Continue | Re-enter alt screen, re-render |

**The cleanup escape sequence:**
```
\x1b[?1049l   exit alt screen
\x1b[?25h     show cursor
\x1b[0m       reset SGR
\x1b[?1006l   disable SGR mouse
\x1b[?1002l   disable button-event tracking
\x1b[<1 u     reset Kitty keyboard (if it was enabled)
```

---

## Terminal Emulator Comparison (2026 snapshot)

| Feature | Alacritty | Kitty | WezTerm | Foot | Ghostty | GNOME Term | iTerm2 |
|---------|-----------|-------|---------|------|---------|------------|--------|
| GPU acceleration | ✓ | ✓ | ✓ | ✓ (Wayland) | ✓ | ✗ | partial |
| Truecolor (24-bit) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sixel | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| Kitty graphics | ✗ | ✓ | ✓ | partial | ✓ | ✗ | ✗ |
| iTerm2 images | ✗ | ✗ | ✓ | ✗ | partial | ✗ | ✓ |
| Kitty keyboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| Sync output (2026) | partial | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| Ligatures | ✓ | ✓ | ✓ | ✓ | ✓ | partial | ✓ |
| Tabs/splits | ✗ (by design) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Memory footprint | ~30 MB | ~60–100 MB | ~320 MB | ~50 MB | ~80 MB | ~80 MB | ~150 MB |
| Customization | minimal | extensive (conf + Lua) | Lua | conf | Zig/conf | GNOME-native | UI + scripting |

**2026 ecosystem stats:**
- ~40 terminals support truecolor
- ~15 terminals support Sixel
- ~8 terminals support Kitty graphics
- Industry trend: Kitty keyboard + sync-output are becoming table stakes; Sixel + Kitty graphics is the de-facto image stack.

---

## Capability Detection — Recommended 369 Cascade

```
1. NO_COLOR set?                                → color = 0; no further checks
2. COLORTERM == truecolor / 24bit?              → color = 24
3. TERM contains "256color"?                    → color = 8
4. TERM == "dumb"?                              → color = 0; minimal output
5. Default                                      → color = 4
6. Send DA1 query (CSI c), parse response;      → cache decision; do not re-query
   look for sixel-flag (param 4)
7. Send mode-2026 query                         → enable BSU/ESU if supported
8. Send Kitty-keyboard query (CSI ? u)          → enable if supported
9. Set $TERM_PROGRAM and well-known overrides   → e.g., $TERM_PROGRAM = "iTerm.app"
                                                    enables iTerm2 image protocol
```

Cache the result of capability detection — don't re-probe in a hot loop. Same input → same output (Rule 8).

---

## Quoting and Encoding Tips

- Always use `\x1b` (Python/JS) or `\033` (shell octal) or `\e` (Bash double-quoted strings) for ESC. Never write a literal `ESC` byte by typing — it can corrupt the source file.
- Strings in shell scripts MUST use `printf` not `echo` — echo's interpretation of `\e` is shell-dependent. `printf '\033[31mRED\033[0m'` works everywhere.
- In Go: `"\x1b[31m"` and `"[31m"` both work.
- In Rust: `"\x1b[31m"` works. The `crossterm`, `termion`, and `ratatui` crates abstract this.
- In C: `"\033[31m"` is canonical.

---

## See Also

- [[tui-design]] — Terminal rendering model, frame loop, framework archetypes (Textual/Ratatui/Bubbletea)
- [[tui-frameworks-complete]] — All 18 TUI frameworks across Python/Rust/Go/Node/C/Java
- [[unix-cli-principles]] — ESR's 17 rules, CLIG output design, signal handling
- [[ascii-composition]] — 369 algorithms emitting these escape codes
- [[ascii-tools]] — Tools (chafa, asciinema, etc.) that use these protocols

---

## Authoritative References

- [XTerm Control Sequences (Invisible Island)](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html) — the definitive xterm reference
- [ANSI escape code (Wikipedia)](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [VT100.net — DEC Terminal Documentation](https://vt100.net/docs/)
- [Kitty Graphics Protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)
- [Kitty Keyboard Protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/)
- [NO_COLOR Standard](https://no-color.org/)
- [Synchronized Output spec (Contour)](https://contour-terminal.org/vt-extensions/synchronized-output/)
- [ECMA-48 Standard (5th edition)](https://ecma-international.org/publications-and-standards/standards/ecma-48/)
- [Windows Console Virtual Terminal Sequences](https://learn.microsoft.com/en-us/windows/console/console-virtual-terminal-sequences)
- [Terminal Trove — Emulator Comparison](https://terminaltrove.com/compare/terminals/)
- [Ghostty VT documentation](https://ghostty.org/docs/vt/concepts/sequences)
