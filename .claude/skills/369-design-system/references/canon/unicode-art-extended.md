# Unicode Art Vocabulary — Complete Glyph Catalog

> **Unicode is the only design system for text-mode graphics that works everywhere.** This page catalogs the complete glyph vocabulary available to 369-style terminal compositions: 11 Unicode blocks covering 1,500+ characters specifically useful for text-mode art, charts, diagrams, and interfaces. Load this when you need the exact codepoint for a glyph, when picking glyphs for a custom renderer, or when auditing a TUI for font-compatibility.

For algorithms that *use* these glyphs (bar charts, sparklines, scatter plots, dashboards), see [[ascii-composition]]. For tools that emit them automatically (chafa, jp2a, libcaca), see [[ascii-tools]].

---

## The 11 Blocks at a Glance

| Block | Range | Count | Purpose | Critical? |
|-------|-------|-------|---------|-----------|
| **Block Elements** | U+2580–U+259F | 32 | Pixel approximation, bars, mosaic | ★★★ Critical |
| **Box Drawing** | U+2500–U+257F | 128 | Lines, frames, intersections | ★★★ Critical |
| **Braille Patterns** | U+2800–U+28FF | 256 | Sub-cell pixel art, fine graphics | ★★★ Critical |
| **Geometric Shapes** | U+25A0–U+25FF | 96 | Squares/circles/triangles/diamonds | ★★ Important |
| **Symbols for Legacy Computing** | U+1FB00–U+1FBFF | 256 | Sextants, octants, retro graphics | ★★ Important |
| **Arrows** | U+2190–U+21FF | 112 | Direction, flow, implication | ★★ Important |
| **Mathematical Operators** | U+2200–U+22FF | 256 | Set, logic, math symbols | ★ Useful |
| **Miscellaneous Technical** | U+2300–U+23FF | 256 | UI, keyboard, media control | ★ Useful |
| **Miscellaneous Symbols** | U+2600–U+26FF | 256 | Weather, chess, zodiac, decoration | ★ Useful |
| **Dingbats** | U+2700–U+27BF | 192 | Check marks, scissors, hands, stars | ★ Useful |
| **Halfwidth/Fullwidth Forms** | U+FF00–U+FFEF | 225 | CJK terminal width compatibility | Special-case |

---

## ★★★ Block Elements (U+2580–U+259F)

The single most important block for terminal graphics. 32 codepoints; every one is useful.

### Half-blocks (the foundation of color image rendering)
```
U+2580  ▀  Upper Half Block      — fg = upper pixel, bg = lower pixel
U+2584  ▄  Lower Half Block      — fg = lower pixel, bg = upper pixel
U+258C  ▌  Left Half Block       — fg = left pixel, bg = right pixel
U+2590  ▐  Right Half Block      — fg = right pixel, bg = left pixel
```
**Trick:** A single character holds 2 colored pixels via fg/bg pair → doubles vertical resolution.

### Eighth-blocks — vertical bars (sparklines, bar charts)
```
U+2581  ▁  Lower One Eighth Block       — 1/8 height
U+2582  ▂  Lower One Quarter Block      — 2/8 (1/4)
U+2583  ▃  Lower Three Eighths Block    — 3/8
U+2584  ▄  Lower Half Block             — 4/8 (1/2)
U+2585  ▅  Lower Five Eighths Block     — 5/8
U+2586  ▆  Lower Three Quarters Block   — 6/8 (3/4)
U+2587  ▇  Lower Seven Eighths Block    — 7/8
U+2588  █  Full Block                   — 8/8
```
**Sparkline algorithm (see [[ascii-composition]]):**
```python
SPARK = " ▁▂▃▄▅▆▇█"
char = SPARK[round((value - vmin) / (vmax - vmin) * 8)]
```

### Eighth-blocks — horizontal bars (left-fill, sub-character precision)
```
U+2588  █  Full Block               — 8/8 (full cell)
U+2589  ▉  Left Seven Eighths       — 7/8 filled from left
U+258A  ▊  Left Three Quarters      — 6/8
U+258B  ▋  Left Five Eighths        — 5/8
U+258C  ▌  Left Half Block          — 4/8
U+258D  ▍  Left Three Eighths       — 3/8
U+258E  ▎  Left One Quarter         — 2/8
U+258F  ▏  Left One Eighth          — 1/8
```
**Horizontal bar algorithm:** `floor(value / max * width)` full blocks + 1 partial block from the table above.

### Shade blocks — density / heatmap
```
U+2591  ░  Light Shade        — sparse stipple (≈25% density)
U+2592  ▒  Medium Shade       — checkerboard (≈50% density)
U+2593  ▓  Dark Shade         — dense (≈75% density)
U+2588  █  Full Block         — solid (100%)
```
**Use:** Heatmap cells, progress backgrounds, low-priority emphasis, density encoding in tables.

### Top-and-side eighths (rare, but needed for finishing borders)
```
U+2594  ▔  Upper One Eighth Block       — 1/8 at top
U+2595  ▕  Right One Eighth Block       — 1/8 at right
```

### Quadrant blocks — 2×2 sub-cell pixel art
```
U+2596  ▖  Quadrant Lower Left
U+2597  ▗  Quadrant Lower Right
U+2598  ▘  Quadrant Upper Left
U+2599  ▙  QLL + QUL + QLR (3 quadrants, missing upper-right)
U+259A  ▚  QUL + QLR (diagonal \)
U+259B  ▛  QUL + QUR + QLL (3, missing lower-right)
U+259C  ▜  QUL + QUR + QLR (3, missing lower-left)
U+259D  ▝  Quadrant Upper Right
U+259E  ▞  QUR + QLL (diagonal /)
U+259F  ▟  QUR + QLL + QLR (3, missing upper-left)
```
**Use:** 2×2 sub-cell image rendering — each terminal cell becomes 4 pixels (16 possible patterns, all in the block).

---

## ★★★ Box Drawing (U+2500–U+257F)

128 codepoints. Designed to connect seamlessly between fixed-pitch cells.

### Light single lines (default for 369)
```
U+2500  ─  Light Horizontal
U+2502  │  Light Vertical
U+250C  ┌  Light Down And Right
U+2510  ┐  Light Down And Left
U+2514  └  Light Up And Right
U+2518  ┘  Light Up And Left
U+251C  ├  Light Vertical And Right
U+2524  ┤  Light Vertical And Left
U+252C  ┬  Light Down And Horizontal
U+2534  ┴  Light Up And Horizontal
U+253C  ┼  Light Vertical And Horizontal
```
The 11 chars above cover 95% of any TUI's frame needs.

### Heavy single lines (emphasis — use sparingly; 369 prefers light + color)
```
U+2501  ━  Heavy Horizontal
U+2503  ┃  Heavy Vertical
U+250F  ┏  Heavy Down And Right
U+2513  ┓  Heavy Down And Left
U+2517  ┗  Heavy Up And Right
U+251B  ┛  Heavy Up And Left
U+2523  ┣  Heavy Vertical And Right
U+252B  ┫  Heavy Vertical And Left
U+2533  ┳  Heavy Down And Horizontal
U+253B  ┻  Heavy Up And Horizontal
U+254B  ╋  Heavy Vertical And Horizontal
```

### Double lines (legacy DOS / IBM CP437 vibe)
```
U+2550  ═  Double Horizontal
U+2551  ║  Double Vertical
U+2554  ╔  Double Down And Right
U+2557  ╗  Double Down And Left
U+255A  ╚  Double Up And Right
U+255D  ╝  Double Up And Left
U+2560  ╠  Double Vertical And Right
U+2563  ╣  Double Vertical And Left
U+2566  ╦  Double Down And Horizontal
U+2569  ╩  Double Up And Horizontal
U+256C  ╬  Double Vertical And Horizontal
```
**369 status:** Double lines have a strong retro/decorative feel. Acceptable for SHOP and demo work; avoid in default UI chrome.

### Mixed light + heavy (transitions at intersections)
```
U+251D  ┝  Light Vertical and Heavy Right
U+2520  ┠  Heavy Vertical and Light Right
... (28 mixed-weight variants total)
```

### Mixed light + double (light↔double transitions)
```
U+255E  ╞  Vertical Single And Right Double
U+2564  ╤  Down Single And Horizontal Double
... (24 mixed-weight variants total)
```

### Dashed and dotted variants
```
U+2504  ┄  Light Triple Dash Horizontal
U+2508  ┈  Light Quadruple Dash Horizontal
U+254C  ╌  Light Double Dash Horizontal
U+2505  ┅  Heavy Triple Dash Horizontal
... (16 dashed/dotted variants)
```

### Curved corners (a softer feel — used by some modern TUIs)
```
U+256D  ╭  Light Arc Down And Right
U+256E  ╮  Light Arc Down And Left
U+256F  ╯  Light Arc Up And Left
U+2570  ╰  Light Arc Up And Right
```
**369 status:** Visual radius implication. Rule 2 forbids `border-radius`, but these glyphs are *characters*, not CSS. Acceptable when explicitly used for soft corners; default is square corners (`┌┐└┘`).

### Diagonals
```
U+2571  ╱  Light Diagonal Upper Right To Lower Left  (forward slash visual)
U+2572  ╲  Light Diagonal Upper Left To Lower Right  (backslash visual)
U+2573  ╳  Light Diagonal Cross
```
**Use:** Connection lines in network diagrams, dashboard separators.

**Origin:** IBM PC Code Page 437 (1981), Videotex/Mosaic graphics standards from the 1970s. These existed in display ROM before they existed in Unicode — Unicode codified the de-facto standard.

---

## ★★★ Braille Patterns (U+2800–U+28FF)

256 codepoints. Every possible 8-dot braille cell.

### Dot positions (8-dot)
```
1 4
2 5
3 6
7 8
```
The dots are bits: dot 1 = `0x01`, dot 4 = `0x08`, dot 7 = `0x40`, dot 8 = `0x80`.

### Codepoint algorithm
```python
def braille(dots):
    """dots is a set of dot positions (1-8)"""
    bits = 0
    for d in dots:
        bits |= 1 << (d - 1)
    return chr(0x2800 + bits)

braille({1,2,3})    → ⠇   (dots 1+2+3 = bits 0x07 = U+2807)
braille({1,4,8})    → ⢉   (dots 1+4+8 = bits 0x89 = U+2889)
braille(set())      → ⠀   (U+2800, empty braille cell — NOT a regular space)
braille({1,2,3,4,5,6,7,8})  → ⣿   (all dots = U+28FF)
```

### Terminal-art applications
Each character is a **2×4 pixel grid**: 2 columns × 4 rows of dots. This means **one terminal cell = 8 pixels** of pixel-art canvas — far higher density than block elements (1×2 or 2×2).

Used by:
- **ytop / gotop / btop** — fine-grained CPU/RAM history graphs
- **drawille** — Python library for braille-canvas pixel art
- **plotille** — terminal plotting with braille resolution

### Critical caveat
Braille rendering quality is **font-dependent**. Some monospace fonts render braille as actual visible dots; others render them as nearly-invisible dim marks. Test the target font before relying on braille for production output. DejaVu Sans Mono renders them well; default Cascadia and Fira Code render them OK but small.

### Naming convention
Codepoint names are `BRAILLE PATTERN DOTS-xyz` where xyz lists the lit dots:
- U+2813 = `BRAILLE PATTERN DOTS-125` (dots 1, 2, 5 lit)
- U+28FF = `BRAILLE PATTERN DOTS-12345678` (all dots)

---

## ★★ Geometric Shapes (U+25A0–U+25FF)

96 codepoints. The semantic-shape vocabulary.

### Squares
```
U+25A0  ■  Black Square
U+25A1  □  White Square
U+25A3  ▣  White Square Containing Black Small Square
U+25A4  ▤  Square With Horizontal Fill
U+25A5  ▥  Square With Vertical Fill
U+25A6  ▦  Square With Orthogonal Crosshatch Fill
U+25A7  ▧  Square With Upper Left To Lower Right Fill
U+25A8  ▨  Square With Upper Right To Lower Left Fill
U+25A9  ▩  Square With Diagonal Crosshatch Fill
U+25AA  ▪  Black Small Square           (emoji)
U+25AB  ▫  White Small Square           (emoji)
U+25FB  ◻  White Medium Square          (emoji)
U+25FC  ◼  Black Medium Square          (emoji)
U+25FD  ◽ White Medium Small Square    (emoji)
U+25FE  ◾  Black Medium Small Square    (emoji)
```

### Triangles
```
U+25B2  ▲  Black Up-Pointing Triangle
U+25B3  △  White Up-Pointing Triangle
U+25B6  ▶  Black Right-Pointing Triangle   (emoji = ▶️)
U+25B7  ▷  White Right-Pointing Triangle
U+25BC  ▼  Black Down-Pointing Triangle
U+25BD  ▽  White Down-Pointing Triangle
U+25C0  ◀  Black Left-Pointing Triangle    (emoji = ◀️)
U+25C1  ◁  White Left-Pointing Triangle
U+25C2  ◂  Black Left-Pointing Small Triangle
U+25C3  ◃  White Left-Pointing Small Triangle
```
**369 use:** Play/pause/forward/back glyphs (`▶ ▮▮ ▶▶`), expand/collapse (`▼ ▶`), sort direction in tables (`▲ ▼`).

### Circles
```
U+25CB  ○  White Circle
U+25CF  ●  Black Circle
U+25E6  ◦  White Bullet
U+2022  •  Bullet                    (in General Punctuation, not Geometric Shapes)
U+25C9  ◉  Fisheye                   (filled circle with inner ring)
U+25CE  ◎  Bullseye                  (concentric circles)
U+25D0  ◐  Circle With Left Half Black
U+25D1  ◑  Circle With Right Half Black
U+25D2  ◒  Circle With Lower Half Black
U+25D3  ◓  Circle With Upper Half Black
```
**369 use:** Scatter plot points (`●`), overlapping points (`◉`), pin annotations (always `●` for SSM).

### Diamonds and Stars (in U+2600–U+27BF, see below)
```
U+25C6  ◆  Black Diamond
U+25C7  ◇  White Diamond
U+2605  ★  Black Star          (Miscellaneous Symbols)
U+2606  ☆  White Star          (Miscellaneous Symbols)
```

### Half-filled circles (status indicators)
```
U+25D4  ◔  Circle With Upper Right Quadrant Black     (25%)
U+25D5  ◕  Circle With All But Upper Left Black       (75%)
```

**Emoji caveat:** Some chars (U+25AA, U+25AB, U+25B6, U+25C0, U+25FB–U+25FE) are classified as emoji and will render in color on platforms with emoji presentation defaults. Append `U+FE0E` (text variation selector) to force text-style rendering: `▶︎` = `▶` + U+FE0E.

---

## ★★ Symbols for Legacy Computing (U+1FB00–U+1FBFF)

256 codepoints. Recovered semigraphics from 1970s–80s home computers, now Unicode-canonical.

### Block Sextants (U+1FB00–U+1FB3B) — 60 chars
2×3 grid of segments:
```
A B
C D
E F
```
Every combination of which segments are filled → 63 possible patterns (minus full/empty/single-quadrant which exist elsewhere) → 60 codepoints.

**Examples:**
- U+1FB00 = sextant-1 (top-left only) `🬀`
- U+1FB1E = sextant-23 (segments C, D) `🬞`
- U+1FB35 = sextant-456 (bottom three) `🬵`

**Use:** Higher-resolution pixel art than 2×2 quadrants — one cell = 6 pixels. Best for retro art and constrained dashboards. Pairs naturally with 6-row charts.

### Block Octants (newer, Unicode 16.0)
2×4 grid (8 segments) → 256 codepoints in U+1CC00 range.
Equivalent expressiveness to braille but with **filled squares** instead of dots — better for chart rendering since you can shade contiguous regions visually.

### Other Legacy Glyphs
The block also recovers:
- **MouseText** (Apple IIe extended character set)
- **TRS-80, ZX80/ZX81, ATARI, Amstrad CPC, MSX, PETSCII** semigraphics
- **Teletext/Minitel** mosaic chars
- **Terminal triangle, parallelogram, vertical-3/8 chars** (filling gaps in block elements)

**Caveat:** Font support is patchy. DejaVu Sans Mono and Cascadia Code Mono support most of the range as of 2024; older Linux distro fonts may not.

---

## ★★ Arrows (U+2190–U+21FF)

112 codepoints. Directional and logical.

### Simple arrows (universal)
```
U+2190  ←  Leftwards Arrow
U+2191  ↑  Upwards Arrow
U+2192  →  Rightwards Arrow
U+2193  ↓  Downwards Arrow
U+2194  ↔  Left Right Arrow
U+2195  ↕  Up Down Arrow
U+2196  ↖  North West Arrow
U+2197  ↗  North East Arrow
U+2198  ↘  South East Arrow
U+2199  ↙  South West Arrow
```
**369 default:** Use `→ ← ↑ ↓` for navigation, flow, and "next/prev" hints.

### Double arrows (logical implication, force)
```
U+21D0  ⇐  Leftwards Double Arrow      ("only if" / implies-back)
U+21D2  ⇒  Rightwards Double Arrow     ("implies")
U+21D1  ⇑  Upwards Double Arrow
U+21D3  ⇓  Downwards Double Arrow
U+21D4  ⇔  Left Right Double Arrow     ("if and only if")
```
**Use:** Documentation, logic notation, "transitions" in state diagrams.

### Triple arrows, harpoons, curved arrows
```
U+21DB  ⇛  Rightwards Triple Arrow
U+21BC  ↼  Leftwards Harpoon With Barb Upwards
U+21BD  ↽  Leftwards Harpoon With Barb Downwards
U+21B0  ↰  Upwards Arrow With Tip Leftwards     ("return up-left")
U+21B5  ↵  Downwards Arrow With Corner Leftwards ("enter key" glyph)
U+21BA  ↺  Anticlockwise Open Circle Arrow      ("undo")
U+21BB  ↻  Clockwise Open Circle Arrow          ("redo / refresh")
```

### Heavy/wide arrows for ASCII flow diagrams
```
U+27A1  ➡  Black Rightwards Arrow
U+27A4  ➤  Black Rightwards Arrowhead         ("bullet" / cursor)
U+2794  ➔  Heavy Wide-Headed Rightwards Arrow
```

---

## ★ Mathematical Operators (U+2200–U+22FF)

256 codepoints. When work involves math, set theory, or formal logic.

### Quantifiers and logic
```
U+2200  ∀  For All
U+2203  ∃  There Exists
U+2204  ∄  There Does Not Exist
U+2227  ∧  Logical And
U+2228  ∨  Logical Or
U+00AC  ¬  Not                  (Latin-1, NOT in this block)
```

### Set theory
```
U+2205  ∅  Empty Set
U+2208  ∈  Element Of
U+2209  ∉  Not An Element Of
U+220B  ∋  Contains As Member
U+2229  ∩  Intersection
U+222A  ∪  Union
U+2282  ⊂  Subset Of
U+2283  ⊃  Superset Of
U+2286  ⊆  Subset Of Or Equal To
U+2287  ⊇  Superset Of Or Equal To
```

### Calculus and analysis
```
U+2202  ∂  Partial Differential
U+2207  ∇  Nabla / Del
U+221A  √  Square Root
U+221B  ∛  Cube Root
U+221E  ∞  Infinity
U+222B  ∫  Integral
U+222C  ∬  Double Integral
U+2211  ∑  N-Ary Summation
U+220F  ∏  N-Ary Product
```

### Relations
```
U+2248  ≈  Almost Equal To
U+2260  ≠  Not Equal To
U+2264  ≤  Less Than Or Equal To
U+2265  ≥  Greater Than Or Equal To
U+226A  ≪  Much Less Than
U+226B  ≫  Much Greater Than
U+2261  ≡  Identical To
U+221D  ∝  Proportional To
```

**Companion block:** Supplemental Mathematical Operators (U+2A00–U+2AFF) for n-ary forms, advanced relations, summations.

---

## ★ Miscellaneous Technical (U+2300–U+23FF)

256 codepoints. UI, keyboard, and media glyphs.

### UI elements
```
U+2300  ⌀  Diameter Sign
U+2302  ⌂  House                       (home icon)
U+2318  ⌘  Place of Interest Sign      (macOS Cmd key)
U+2325  ⌥  Option Key                  (macOS Option key)
U+2303  ⌃  Up Arrowhead                (macOS Control key)
U+21E7  ⇧  Upwards White Arrow         (Shift key)
U+232B  ⌫  Erase To The Left           (backspace)
U+2326  ⌦  Erase To The Right          (delete)
U+21B5  ↵  Downwards Arrow With Corner Leftwards (Enter)
U+2387  ⎇  Alternative Key Symbol      (Alt key)
```

### Media control
```
U+23F4  ⏴  Black Medium Left-Pointing Triangle    (rewind step)
U+23F5  ⏵  Black Medium Right-Pointing Triangle   (play step)
U+23EA  ⏪  Black Left-Pointing Double Triangle    (fast-rewind, emoji)
U+23E9  ⏩  Black Right-Pointing Double Triangle   (fast-forward, emoji)
U+23F8  ⏸  Double Vertical Bar                    (pause, emoji)
U+23F9  ⏹  Black Square For Stop                  (stop, emoji)
U+23FA  ⏺  Black Circle For Record                (record, emoji)
U+23CF  ⏏  Eject Symbol                            (emoji)
```

### Status / time
```
U+231A  ⌚  Watch                       (emoji)
U+231B  ⌛  Hourglass                   (emoji)
U+23F0  ⏰  Alarm Clock                 (emoji)
U+23F1  ⏱  Stopwatch                   (emoji)
U+23F3  ⏳  Hourglass With Flowing Sand (emoji)
```

**Emoji handling:** 18 chars in this block have default emoji presentation. Append `U+FE0E` for text style: `⏸︎` (text) vs `⏸️` (emoji).

---

## ★ Miscellaneous Symbols (U+2600–U+26FF)

256 codepoints. Categories far too diverse to enumerate fully.

### Weather
```
U+2600  ☀  Black Sun With Rays         (emoji = ☀️)
U+2601  ☁  Cloud                        (emoji = ☁️)
U+2602  ☂  Umbrella
U+2603  ☃  Snowman                      (emoji = ☃️)
U+2604  ☄  Comet                        (emoji = ☄️)
U+2607  ☇  Lightning
U+2608  ☈  Thunderstorm
U+2614  ☔  Umbrella With Rain Drops    (emoji)
U+26C4  ⛄  Snowman Without Snow         (emoji)
U+26C5  ⛅  Sun Behind Cloud             (emoji)
```

### Astrological / astronomical
```
U+2605  ★  Black Star
U+2606  ☆  White Star
U+260E  ☎  Black Telephone              (emoji = ☎️)
U+2618  ☘  Shamrock                      (emoji = ☘️)
U+2620  ☠  Skull And Crossbones          (emoji = ☠️)
U+2622  ☢  Radioactive Sign              (emoji = ☢️)
U+2623  ☣  Biohazard Sign                (emoji = ☣️)
U+2625  ☥  Ankh
U+2630–U+2637  ☰☱☲☳☴☵☶☷  I-Ching Trigrams (8 symbols)
```

### Chess pieces (full set in both colors)
```
U+2654  ♔  White King
U+2655  ♕  White Queen
U+2656  ♖  White Rook
U+2657  ♗  White Bishop
U+2658  ♘  White Knight
U+2659  ♙  White Pawn
U+265A  ♚  Black King
U+265B  ♛  Black Queen
U+265C  ♜  Black Rook
U+265D  ♝  Black Bishop
U+265E  ♞  Black Knight
U+265F  ♟  Black Pawn
```

### Musical notation
```
U+2669  ♩  Quarter Note
U+266A  ♪  Eighth Note
U+266B  ♫  Beamed Eighth Notes
U+266C  ♬  Beamed Sixteenth Notes
U+266D  ♭  Music Flat Sign
U+266E  ♮  Music Natural Sign
U+266F  ♯  Music Sharp Sign
U+2669–U+267F  More musical symbols
```

### Recycle / warnings
```
U+267B  ♻  Black Universal Recycling Symbol  (emoji)
U+2620  ☠  Skull And Crossbones
U+26A0  ⚠  Warning Sign                       (emoji = ⚠️)
U+26A1  ⚡  High Voltage Sign                  (emoji)
U+26D4  ⛔  No Entry                            (emoji)
```

### Dice
```
U+2680  ⚀  Die Face-1
U+2681  ⚁  Die Face-2
U+2682  ⚂  Die Face-3
U+2683  ⚃  Die Face-4
U+2684  ⚄  Die Face-5
U+2685  ⚅  Die Face-6
```

**83 base chars in this block have emoji variants** — for text rendering append U+FE0E. The 369 rule against emoji on `/369` (rule 6) means these are *acceptable* in TUI work (where platform fonts render them as text glyphs anyway) but require U+FE0E suffix on web.

---

## ★ Dingbats (U+2700–U+27BF)

192 codepoints. From ITC Zapf Dingbats (1991).

### Check marks (the most-used dingbats)
```
U+2713  ✓  Check Mark
U+2714  ✔  Heavy Check Mark
U+2717  ✗  Ballot X
U+2718  ✘  Heavy Ballot X
U+2715  ✕  Multiplication X
U+2716  ✖  Heavy Multiplication X     (emoji = ✖️)
```

### Hands and writing
```
U+270C  ✌  Victory Hand                (emoji = ✌️)
U+270D  ✍  Writing Hand                 (emoji = ✍️)
U+270F  ✏  Pencil                       (emoji = ✏️)
U+2710  ✐  Upper Right Pencil
U+2712  ✒  Black Nib                    (emoji = ✒️)
```

### Stars and decoration
```
U+2721  ✡  Star Of David
U+2729  ✩  Stress Outlined White Star
U+272A  ✪  Circled White Star
U+272D  ✭  Outlined Black Star
U+272F  ✯  Pinwheel Star
U+2731  ✱  Heavy Asterisk
U+2734  ✴  Eight Pointed Black Star
U+2735  ✵  Eight Pointed Pinwheel Star
U+2736  ✶  Six Pointed Black Star
U+2737  ✷  Eight Pointed Rectilinear Black Star
U+2740  ❀  White Florette
U+2741  ❁  Eight Petalled Outlined Black Florette
U+2742  ❂  Circled Open Centre Eight Pointed Star
U+2756  ❖  Black Diamond Minus White X
```

### Scissors
```
U+2700  ✀  Black Safety Scissors
U+2702  ✂  Black Scissors
U+2704  ✄  White Scissors
```

### Pointing arrows
```
U+2794  ➔  Heavy Wide-Headed Rightwards Arrow
U+2799  ➙  Heavy Rightwards Arrow
U+279C  ➜  Heavy Round-Tipped Rightwards Arrow
U+27A1  ➡  Black Rightwards Arrow      (emoji)
U+27A4  ➤  Black Rightwards Arrowhead
U+27B0  ➰  Curly Loop                   (emoji)
U+27BF  ➿  Double Curly Loop            (emoji)
```

### Crosses
```
U+2720  ✠  Maltese Cross
U+2724  ✤  Heavy Four Balloon-Spoked Asterisk
U+2725  ✥  Four Club-Spoked Asterisk
U+2726  ✦  Black Four Pointed Star
U+2727  ✧  White Four Pointed Star
```

### Circled digits
```
U+2776–U+277F  ❶ ❷ ❸ ❹ ❺ ❻ ❼ ❽ ❾ ❿  (dingbat circled digits 1-10, negative)
U+2780–U+2789  ➀ ➁ ➂ ➃ ➄ ➅ ➆ ➇ ➈ ➉  (dingbat circled digits 1-10, sans-serif)
U+278A–U+2793  ➊ ➋ ➌ ➍ ➎ ➏ ➐ ➑ ➒ ➓  (dingbat circled digits 1-10, sans-serif negative)
```
**Use:** Numbered legends, step indicators (without numeric overhead).

**Naming history:** Block was "Zapf Dingbats" in Unicode 1.0 (1991), renamed simply "Dingbats" in Unicode 1.1 (1993).

---

## Halfwidth and Fullwidth Forms (U+FF00–U+FFEF)

225 codepoints. CJK terminal-width compatibility.

### Fullwidth ASCII (U+FF01–U+FF5E)
Double-width versions of ASCII 0x21–0x7E:
```
U+FF01  ！  Fullwidth Exclamation Mark
U+FF21  Ａ  Fullwidth Latin Capital Letter A
U+FF41  ａ  Fullwidth Latin Small Letter A
U+FF11  １  Fullwidth Digit One
```
**Note:** U+FF00 is *unused* — role filled by U+3000 (Ideographic Space).

### Halfwidth Katakana (U+FF61–U+FF9F)
Compact katakana for legacy CJK terminals. Used when display width matters more than canonical katakana shape.
```
U+FF61  ｡  Halfwidth Ideographic Full Stop
U+FF66  ｦ  Halfwidth Katakana Letter Wo
U+FF9F  ﾟ  Halfwidth Katakana Semi-Voiced Sound Mark
```

### Halfwidth Hangul Compatibility (U+FFA0–U+FFDC)
For lossless conversion between JIS X 0201 / Hangul wansung legacy encodings.

**Purpose:** Round-trip conversion between legacy single-byte CJK encodings and Unicode. Rarely relevant to original 369 work, but knowing the block exists prevents confusion when handling internationalized text streams.

---

## Glyph Selection Cheat-Sheet for 369

| Need | Use this glyph | Codepoint |
|------|----------------|-----------|
| Single horizontal bar at value X/max | `█` + partial from `▏▎▍▌▋▊▉` | U+2588 + U+258F–U+2589 |
| Sparkline | `▁▂▃▄▅▆▇█` | U+2581–U+2588 |
| Frame corner (top-left) | `┌` | U+250C |
| Frame intersection | `┼` | U+253C |
| Heatmap cell (low / mid / high / max) | `░ ▒ ▓ █` | U+2591–U+2588 |
| Scatter point | `●` | U+25CF |
| Overlapping scatter point | `◉` | U+25C9 |
| Sort indicator ascending | `▲` | U+25B2 |
| Sort indicator descending | `▼` | U+25BC |
| Bullet | `•` | U+2022 |
| Check / pass | `✓` | U+2713 |
| Fail / cross | `✕` | U+2715 |
| Right arrow / "next" | `→` | U+2192 |
| Back arrow / "prev" | `←` | U+2190 |
| Star (rating, favorite) | `★` | U+2605 |
| Status: success | `●` in green or `✓` | U+25CF / U+2713 |
| Status: warning | `▲` in amber | U+25B2 |
| Status: error | `✕` or `■` in red | U+2715 / U+25A0 |
| Info / unknown | `i` (Latin) or `ⓘ` | U+0069 / U+24D8 |
| Expand toggle | `▶ ▼` | U+25B6 / U+25BC |
| Loading spinner frames | `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` | U+280B–U+280F (braille) |
| Block-art pixel (filled) | `█` | U+2588 |
| Block-art pixel (top half only) | `▀` | U+2580 |
| Block-art pixel (bottom half only) | `▄` | U+2584 |

---

## Font Compatibility Matrix

| Font | Box Drawing | Block Elements | Braille | Geometric | Sextants | Legacy |
|------|-------------|----------------|---------|-----------|----------|--------|
| **DejaVu Sans Mono** | ✓ full | ✓ full | ✓ full | ✓ full | ✓ full | ✓ |
| **Cascadia Code Mono** | ✓ full | ✓ full | ✓ basic | ✓ full | ✓ partial | partial |
| **JetBrains Mono** | ✓ full | ✓ full | ✓ basic | ✓ full | partial | partial |
| **Fira Code** | ✓ full | ✓ full | ✓ basic | ✓ full | partial | partial |
| **Iosevka** | ✓ full | ✓ full | ✓ full | ✓ full | ✓ full | ✓ |
| **Courier New (legacy)** | ✓ partial | ✓ partial | ✗ | ✓ partial | ✗ | ✗ |
| **macOS SF Mono** | ✓ full | ✓ full | ✓ basic | ✓ full | partial | partial |
| **Cousine (Google)** | ✓ full | ✓ full | ✓ basic | ✓ full | partial | partial |

**369 recommendation:** **Iosevka** or **DejaVu Sans Mono** for guaranteed coverage of every glyph in this catalog. Cascadia Code Mono is the default on Windows Terminal and is acceptable. Avoid Courier New for anything beyond core box-drawing.

---

## Practical Combinations

### "I want the absolute fastest pixel-art per cell"
Use **braille patterns**. 2×4 = 8 pixels/cell. Drawback: font dot rendering varies.

### "I want a real-looking bar chart"
Use **block elements horizontal eighths** (`▏▎▍▌▋▊▉█`). Sub-character precision feels analog.

### "I want filled regions for a heatmap"
Use **shade blocks** (`░ ▒ ▓ █`) — they read as 4 distinct density levels even in B&W.

### "I want a chart inside a 2×3 cell footprint"
Use **block sextants** (U+1FB00 range) — 6 pixels/cell, but unlike braille they're contiguous filled regions, not dots, so they read as a real chart.

### "I want a smooth gradient in a chart background"
Use **block elements + DIN99d color space** via chafa for image-shaped data. For purely-color gradients without image input, use 256-color background fills (`▒` over `▒` with different colors) rather than truecolor escapes — better terminal coverage.

### "I want a play/pause/skip control row"
Use **Miscellaneous Technical media glyphs** with U+FE0E suffix: `⏮︎ ⏪︎ ⏵︎ ⏸︎ ⏩︎ ⏭︎`

---

## See Also

- [[ascii-composition]] — Algorithms that use these glyphs (sparklines, bars, scatter, dashboards)
- [[ascii-tools]] — Tools that emit these glyphs (chafa, figlet, libcaca, etc.)
- [[ascii-rendering-algorithms]] — Theory of image-to-glyph conversion (luminance, shape vectors, dithering)
- [[ascii-ansi-art]] — Historical context: BBS scene, ANSI/PETSCII/teletext heritage
- [[tui-design]] — How these glyphs compose into framework widgets

---

## Authoritative References

- [Unicode Block Elements (U+2580–U+259F)](https://www.unicode.org/charts/PDF/U2580.pdf)
- [Unicode Box Drawing (U+2500–U+257F)](https://www.unicode.org/charts/PDF/U2500.pdf)
- [Unicode Braille Patterns (U+2800–U+28FF)](https://unicode.org/charts/nameslist/c_2800.html)
- [Unicode Geometric Shapes (U+25A0–U+25FF)](https://www.unicode.org/charts/PDF/U25A0.pdf)
- [Unicode Miscellaneous Symbols (U+2600–U+26FF)](https://www.unicode.org/charts/PDF/U2600.pdf)
- [Unicode Dingbats (U+2700–U+27BF)](https://www.unicode.org/charts/PDF/U2700.pdf)
- [Unicode Mathematical Operators (U+2200–U+22FF)](https://www.unicode.org/charts/PDF/U2200.pdf)
- [Unicode Arrows (U+2190–U+21FF)](https://www.unicode.org/charts/PDF/U2190.pdf)
- [Unicode Miscellaneous Technical (U+2300–U+23FF)](https://www.unicode.org/charts/PDF/U2300.pdf)
- [Unicode Symbols for Legacy Computing (U+1FB00–U+1FBFF)](https://www.unicode.org/charts/PDF/U1FB00.pdf)
- [Unicode Halfwidth/Fullwidth Forms (U+FF00–U+FFEF)](https://www.unicode.org/charts/PDF/UFF00.pdf)
- [compart.com Unicode Character Database](https://www.compart.com/en/unicode)
- [codepoints.net Unicode Explorer](https://codepoints.net/)
