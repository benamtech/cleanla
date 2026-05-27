# Complete Escape Code Reference — Every Documented ANSI/VT/xterm Sequence

> **The exhaustive companion to [[terminal-capabilities]].** Where the parent doc covers the common subset, this canon enumerates every documented escape sequence across ECMA-48, VT100/220/320/420/520, xterm, iTerm2 OSC 1337, Kitty graphics + keyboard protocols, Sixel, and modern extensions (sync output, focus reporting). Load this when you need a specific code, not the conceptual overview.

For terminal protocol fundamentals + conceptual model, see [[terminal-capabilities]].

---

## C0 Control Characters (0x00–0x1F)

| Hex | Dec | Code | Name | Purpose |
|-----|-----|------|------|---------|
| 0x00 | 0 | NUL | Null | Ignored / padding |
| 0x07 | 7 | BEL | Bell | Audible alert; alternate ST terminator |
| 0x08 | 8 | BS | Backspace | Move cursor left without erasing |
| 0x09 | 9 | HT | Tab | Advance to next tab stop (default 8 cols) |
| 0x0A | 10 | LF | Line Feed | Move cursor down; may auto-CR (LNM mode) |
| 0x0B | 11 | VT | Vertical Tab | Move down (LF-equivalent in modern terms) |
| 0x0C | 12 | FF | Form Feed | Move down; may clear screen |
| 0x0D | 13 | CR | Carriage Return | Move cursor to column 0 |
| 0x0E | 14 | SO | Shift Out | Activate G1 character set |
| 0x0F | 15 | SI | Shift In | Activate G0 character set |
| 0x1B | 27 | ESC | Escape | Introduces CSI, OSC, DCS, APC |

---

## C1 Control Characters (8-bit 0x80–0x9F)

| Hex | Name | 7-bit | Function |
|-----|------|-------|----------|
| 0x84 | IND | ESC D | Index (down + scroll if at bottom) |
| 0x85 | NEL | ESC E | Next Line (down + CR) |
| 0x88 | HTS | ESC H | Set Horizontal Tab Stop |
| 0x8D | RI | ESC M | Reverse Index (up + scroll if at top) |
| 0x8E | SS2 | ESC N | Single Shift Two (next char from G2) |
| 0x8F | SS3 | ESC O | Single Shift Three (next char from G3) |
| 0x90 | DCS | ESC P | Device Control String |
| 0x97 | SPA | ESC V | Start Protected Area |
| 0x98 | EPA | ESC W | End Protected Area |
| 0x9B | CSI | ESC [ | Control Sequence Introducer |
| 0x9C | ST | — | String Terminator (also ESC \) |
| 0x9D | OSC | ESC ] | Operating System Command |
| 0x9E | PM | ESC ^ | Privacy Message |
| 0x9F | APC | ESC _ | Application Program Command |

---

## CSI Sequences

### Cursor movement
| Sequence | Code | Behavior |
|----------|------|----------|
| `CSI n A` | CUU | Cursor Up n |
| `CSI n B` | CUD | Cursor Down n |
| `CSI n C` | CUF | Cursor Forward (right) n |
| `CSI n D` | CUB | Cursor Backward (left) n |
| `CSI n E` | CNL | Cursor Next Line (down + CR) |
| `CSI n F` | CPL | Cursor Previous Line (up + CR) |
| `CSI n G` | CHA | Cursor Horizontal Absolute |
| `CSI n d` | VPA | Vertical Position Absolute |
| `CSI y;x H` | CUP | Cursor Position (1-indexed) |
| `CSI y;x f` | HVP | Horizontal Vertical Position |
| `CSI n I` | CHT | Cursor Horizontal Tab (advance) |
| `CSI n Z` | CBT | Cursor Backward Tab |

### Erase / Delete / Insert
| Sequence | Code | Behavior |
|----------|------|----------|
| `CSI n J` | ED | Erase in Display (0=cur→end, 1=start→cur, 2=all, 3=scrollback) |
| `CSI ? n J` | DECSED | Selective Erase in Display |
| `CSI n K` | EL | Erase in Line (0/1/2) |
| `CSI ? n K` | DECSEL | Selective Erase in Line |
| `CSI n X` | ECH | Erase Character |
| `CSI n P` | DCH | Delete Character |
| `CSI n @` | ICH | Insert Character |
| `CSI n L` | IL | Insert Line |
| `CSI n M` | DL | Delete Line |
| `CSI n S` | SU | Scroll Up |
| `CSI n T` | SD | Scroll Down |

### SGR (Select Graphic Rendition)
| Code | Effect |
|------|--------|
| 0 | Reset all attributes |
| 1 | Bold / bright |
| 2 | Faint |
| 3 | Italic |
| 4 | Underline (single) |
| 4:0 | No underline |
| 4:1 | Single underline |
| 4:2 | Double underline |
| 4:3 | Curly underline (modern terminals) |
| 4:4 | Dotted underline |
| 4:5 | Dashed underline |
| 5 | Slow blink |
| 6 | Rapid blink |
| 7 | Reverse video |
| 8 | Conceal |
| 9 | Strikethrough |
| 10–19 | Alternate font |
| 20 | Fraktur (gothic) |
| 21 | Bold off / double underline |
| 22 | Normal intensity |
| 23 | No italic / no Fraktur |
| 24 | No underline |
| 25 | No blink |
| 27 | No reverse |
| 28 | No conceal |
| 29 | No strikethrough |
| 30–37 | Foreground 4-bit (black, red, green, yellow, blue, magenta, cyan, white) |
| 38;5;n | Foreground 256-color (index 0–255) |
| 38;2;r;g;b | Foreground 24-bit RGB |
| 39 | Default foreground |
| 40–47 | Background 4-bit |
| 48;5;n | Background 256-color |
| 48;2;r;g;b | Background 24-bit |
| 49 | Default background |
| 58;... | Underline color (same format as 38) |
| 59 | Default underline color |
| 90–97 | Bright foreground |
| 100–107 | Bright background |

### DEC Private Modes (`CSI ? n h` set / `CSI ? n l` reset)

| Mode | Name | Effect |
|------|------|--------|
| 1 | DECCKM | Application cursor keys |
| 2 | DECANM | ANSI / VT52 mode |
| 3 | DECCOLM | 132 column mode (80 when reset) |
| 4 | DECSCLM | Smooth scroll |
| 5 | DECSCNM | Reverse video screen |
| 6 | DECOM | Origin relative to margins |
| 7 | DECAWM | Auto-wrap |
| 8 | DECARM | Auto-repeat keys |
| 9 | DECTPAM | Mouse X10 tracking |
| 12 | att610 | Cursor blink |
| 25 | DECTCEM | Cursor visible |
| 47 | Alt screen | Alt screen buffer (legacy) |
| 66 | DECNKM | Application keypad |
| 67 | DECBKM | Backarrow sends BS |
| 80 | DECSDM | Sixel display scrolling |
| 1000 | X11 mouse | Button press/release |
| 1001 | mouse highlight | Highlight on select |
| 1002 | Button event mouse | Press/release/motion-while-pressed |
| 1003 | Any-event mouse | Any motion |
| 1004 | Focus reporting | Window focus in/out events |
| 1005 | UTF-8 mouse | UTF-8 mouse coord encoding |
| 1006 | SGR mouse | Extended SGR mouse format |
| 1007 | Alt-scroll | Scroll arrows in alt screen |
| 1015 | URXVT mouse | URXVT extension |
| 1016 | SGR pixel mouse | Pixel-resolution coordinates (Kitty) |
| 1034 | 8-bit input | Meta sends ESC + char |
| 1035 | NumLock | Num lock modifies behavior |
| 1036 | Meta sends ESC | Alt key prepends ESC |
| 1037 | Delete sends DEL | Delete key sends 0x7F |
| 1042 | URGENT bell | Window manager urgency on bell |
| 1043 | Pop-on-bell | Raise window on bell |
| 1047 | Alt screen | Same as 47 but clears |
| 1048 | Save cursor | Save before alt-screen switch |
| 1049 | Alt screen + save cursor | Modern alt-screen entry |
| 2004 | Bracketed paste | Wrap pastes with `ESC [200~` / `ESC [201~` |
| 2026 | Synchronized output | BSU / ESU — see [[terminal-capabilities]] |
| 2027 | Grapheme cluster | Treat ZWJ sequences as single grapheme |
| 2031 | Theme detection | Light/dark notification |

### Cursor Style — DECSCUSR (`CSI n SP q`)
| n | Style |
|---|-------|
| 0 / 1 | Blinking block (default) |
| 2 | Steady block |
| 3 | Blinking underline |
| 4 | Steady underline |
| 5 | Blinking I-beam |
| 6 | Steady I-beam |

### Save / Restore Cursor
| Sequence | Action |
|----------|--------|
| `ESC 7` | DECSC — Save cursor + SGR + charset state |
| `ESC 8` | DECRC — Restore |
| `CSI s` | ANSI save cursor |
| `CSI u` | ANSI restore cursor |

### Tab stops
| Sequence | Action |
|----------|--------|
| `ESC H` | HTS — Set horizontal tab stop |
| `CSI g` | TBC — Clear tab at cursor |
| `CSI 3 g` | TBC — Clear all tabs |
| `CSI n W` | CTC — Cursor Tab Control |

### Scrolling regions
| Sequence | Action |
|----------|--------|
| `CSI t;b r` | DECSTBM — Set top + bottom margins |
| `CSI l;r s` | DECSLRM — Set left + right margins (with DECLRMM enabled) |

### Reports / Queries
| Sequence | Reply | Use |
|----------|-------|-----|
| `CSI 5 n` | `CSI 0 n` | DSR — Device Status Report |
| `CSI 6 n` | `CSI r;c R` | DSR — Cursor position |
| `CSI c` | `CSI ? n;n;... c` | DA1 — Primary Device Attributes |
| `CSI > c` | `CSI > vendor;version;hw c` | DA2 — Secondary |
| `CSI = c` | `CSI ! Pi c` | DA3 — Tertiary |
| `CSI > 0 q` | `DCS > Name P version ST` | XTVERSION — terminal name |
| `CSI ? u` | `CSI ? flags u` | Query Kitty keyboard flags |
| `CSI ? n $ p` | `CSI ? n;status $ y` | DECRQM — Query mode |

### Window operations (`CSI Pn t`)
| Pn | Action |
|----|--------|
| 1 | De-iconify |
| 2 | Iconify |
| 3;x;y | Move window |
| 4;h;w | Resize pixels |
| 5 | Raise to top |
| 6 | Lower to bottom |
| 7 | Refresh |
| 8;rows;cols | Resize cells |
| 9 | Maximize / restore |
| 10 | Fullscreen |
| 11 | Report window state |
| 13 | Report window position |
| 14 | Report window size (pixels) |
| 16 | Report cell size |
| 18 | Report window size (cells) |
| 19 | Report screen size |
| 20 | Report icon title |
| 21 | Report window title |
| 22 | Save title to stack |
| 23 | Restore title from stack |

### Misc
| Sequence | Name | Action |
|----------|------|--------|
| `CSI ! p` | DECSTR | Soft terminal reset |
| `ESC c` | RIS | Hard reset (full reinitialization) |
| `CSI = Pn ; Pm ,m` | DECSACE | Select character protection attribute |
| `CSI Pl ; Pc ; Pr ; ... $ x` | DECFRA | Fill rectangular area with character |
| `CSI Pl ; Pc ; Pr ; ... $ z` | DECERA | Erase rectangular area |
| `CSI Pl ; Pc ; Pr ; ... $ v` | DECCRA | Copy rectangular area |

---

## OSC Sequences (`ESC ] n ; data ST`)

| OSC | Subcommand | Action |
|-----|-----------|--------|
| 0 | text | Set icon + window title |
| 1 | text | Set icon title only |
| 2 | text | Set window title only |
| 4 | n;rgb spec | Change palette color n |
| 5 | n;rgb spec | Change special color n |
| 7 | url | Set working directory (modern terminals) |
| 8 | params;url | Hyperlink (closes with empty OSC 8) |
| 9 | text | Notification (iTerm2 / Konsole) |
| 10 | rgb | Foreground color |
| 11 | rgb | Background color |
| 12 | rgb | Cursor color |
| 13 | rgb | Mouse foreground |
| 14 | rgb | Mouse background |
| 17 | rgb | Highlight color (background) |
| 19 | rgb | Highlight color (foreground) |
| 52 | clip;base64 | Clipboard (c=clipboard, p=primary, s=selection) |
| 104 | colors | Reset palette colors |
| 105 | colors | Reset special colors |
| 110 | — | Reset foreground |
| 111 | — | Reset background |
| 112 | — | Reset cursor color |
| 113 | — | Reset mouse foreground |
| 133 | A/B/C/D | Semantic prompt (FinalTerm) |
| 176 | text | Path identification (Konsole) |
| 777 | params;data | Notification (urxvt) |
| 1337 | (many) | iTerm2 extension (image, badge, set-color, copy, etc.) |
| 1338 | text | Konsole extension |

### iTerm2 OSC 1337 — Subcommands
- `File=name;size;inline=1:base64` — inline image
- `SetMark` — bookmark current line
- `SetBadgeFormat=base64` — set badge text
- `StealFocus` — focus iTerm2 window
- `ReportCellSize` — report cell dimensions
- `SetUserVar=key=base64value` — set tab variable
- `ClearScrollback` — clear scrollback
- `Copy=;base64` — copy to clipboard
- `RequestAttention=Yes|No|Once` — bouncing dock icon

---

## DCS Sequences (`ESC P ... ST`)

### Sixel Graphics
**Format:** `ESC P P1;P2;P3 q <sixel-data> ST`
- P1 = pixel aspect ratio
- P2 = background color handling
- P3 = horizontal grid size

**Sixel data charset:** Each sixel = single byte in range `?` (0x3F = blank) to `~` (0x7E = full).

**Color register select:** `#<n>` then `;P;P;P;P` for HLS/RGB color def.

### ReGIS Graphics
**Format:** `ESC P p <commands> ST`
- Vector graphics protocol (DEC VT240+)
- Less-supported than Sixel in 2026

### User-Defined Keys
**Format:** `ESC P 1 ; 1 | KeyDef ; KeyDef ; ... ST`
- DECUDK — define function key contents

### Terminal queries
- `DCS + q hex-encoded-name ST` — XTGETTCAP (request terminfo capability)
- `DCS $ q "p ST` — DECRQSS (request specific setting)

---

## APC Sequences (`ESC _ ... ST`)

### Kitty Graphics Protocol
**Format:** `ESC _ G control;keys=values ; payload ST`

**Key actions:**
- `a=T` transmit + display
- `a=t` transmit only
- `a=d` delete
- `a=p` put (display previously-transmitted)

**Transport modes:**
- `t=d` direct (base64 inline)
- `t=f` file path
- `t=t` temporary file (auto-delete)
- `t=s` shared memory

**Format:**
- `f=24` RGB
- `f=32` RGBA
- `f=100` PNG

**Other keys:** `i` (id), `I` (placement id), `q` (quiet mode), `s/v` (source size), `w/h` (display size), `z` (z-index), `C` (cursor movement).

---

## Kitty Keyboard Protocol

Enable: `CSI > flags u` — flags bitmask:
- `1` — Disambiguate escape codes
- `2` — Report event types
- `4` — Report alternate keys
- `8` — Report all keys as escape codes
- `16` — Report associated text

Query: `CSI ? u` → reply `CSI ? flags u`

Disable: `CSI < n u` (pop n levels)

**Key event format:** `CSI keycode ; modifiers ; text u`
- `keycode` — Unicode codepoint of base key
- `modifiers` — bitmask (1=Shift, 2=Alt, 4=Ctrl, 8=Super, 16=Hyper, 32=Meta, 64=CapsLock, 128=NumLock)
- `text` — actual character to insert

**Functional keys:** Use PUA codepoints 57344–63743 (e.g., 57344 = Insert).

---

## Modern Mode Extensions (Critical for 2026 TUIs)

| Sequence | Mode | Use |
|----------|------|-----|
| `CSI ? 1004 h/l` | Focus reporting | Emits `CSI I` (focus in) / `CSI O` (focus out) |
| `CSI ? 2026 h/l` | Synchronized output | BSU / ESU — frame coherence |
| `CSI ? 2027 h/l` | Grapheme cluster | Treat ZWJ sequences as single cell |
| `CSI ? 2031 h/l` | Color scheme detection | Notify on light/dark theme change |
| `CSI ? 1006 h` | SGR mouse | Required for coordinates > 223 |
| `CSI ? 1016 h` | SGR pixel mouse | Per-pixel coord (Kitty extension) |
| `CSI ? 2048 h/l` | In-band resize | Emit `CSI 48;rows;cols;px-rows;px-cols t` on resize |

---

## Terminal Support Matrix (2026 snapshot)

| Extension | Kitty | WezTerm | Ghostty | Alacritty | Foot | iTerm2 | Win Term | GNOME |
|-----------|-------|---------|---------|-----------|------|--------|----------|-------|
| Truecolor (24-bit) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kitty keyboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | partial | ✗ |
| Sync output (2026) | ✓ | ✓ | ✓ | partial | ✓ | ✓ | ✓ | ✗ |
| OSC 8 hyperlinks | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| OSC 52 clipboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | partial |
| Kitty graphics | ✓ | ✓ | ✓ | ✗ | partial | ✗ | ✗ | ✗ |
| Sixel | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| iTerm2 images | ✗ | ✓ | partial | ✗ | ✗ | ✓ | ✗ | ✗ |
| Focus reporting | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | partial |
| Bracketed paste | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## See Also

- [[terminal-capabilities]] — Conceptual model, color tiers, common-subset reference
- [[tui-modern-gaps]] — Kitty keyboard protocol adoption status
- [[tui-modern-2026]] — Current terminal-emulator status
- [[unicode-art-extended]] — Character vocabulary that pairs with these escape codes

---

## Sources

- invisible-island.net/xterm/ctlseqs/ctlseqs.html — **the** authoritative xterm reference
- ECMA-48 5th edition — ecma-international.org/publications-and-standards/standards/ecma-48
- vt100.net/docs/ — DEC VT documentation
- DEC VT520 Programmer Reference Manual (bitsavers.org)
- learn.microsoft.com/en-us/windows/console/console-virtual-terminal-sequences — Windows Console
- iterm2.com/documentation-escape-codes.html — iTerm2 OSC 1337
- sw.kovidgoyal.net/kitty/graphics-protocol/ — Kitty graphics
- sw.kovidgoyal.net/kitty/keyboard-protocol/ — Kitty keyboard
- contour-terminal.org/vt-extensions/ — Modern VT extensions
- ghostty.org/docs/vt/ — Ghostty VT documentation
- vt100.net/docs/vt3xx-gp/chapter14.html — Sixel format
- en.wikipedia.org/wiki/ANSI_escape_code
