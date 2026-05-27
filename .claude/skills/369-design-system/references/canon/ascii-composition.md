# ASCII Composition — Terminal Art Vocabulary + Engine Rules

> **The composition engine knows what works.** When `medium: 'terminal'` is passed to `presentation()`, this reference tells the engine exactly which Unicode characters to use, how to size every column and bar, how humans scan a terminal screen, and what each of the six intents looks like rendered in ASCII. No hand-design required — every choice is deterministic and defended.

---

## Part 1 — The Full Unicode Terminal Vocabulary

Organized by function, not codepoint. Everything the engine has to draw with.

### 1.1 Box-Drawing — Borders and Panel Separators

The primary structural vocabulary. Single-line weight only (matching the "1px border" rule).

**Full box set:**
```
Corners:     ┌ ┐ └ ┘     U+250C U+2510 U+2514 U+2518
T-junctions: ├ ┤ ┬ ┴     U+251C U+2524 U+252C U+2534
Cross:       ┼           U+253C
Horizontal:  ─           U+2500
Vertical:    │           U+2502
```

**Panels and windows:**
```
┌─ WINDOW BAR ────────────────────────────────────────┐
│                                                      │
│  Body content here.                                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Section dividers (inline):**
```
─── SECTION TITLE ──────────────────────────────────────
```
Pattern: `───` + space + TITLE (UPPERCASE) + space + `─` repeated to fill width.

**Column separators in tables:**
```
NAME                  │ STATUS   │ AGE   │ BUDGET
──────────────────────┼──────────┼───────┼────────
Sunset Lofts          │ ACTIVE   │ 3d    │ $15,000
Downtown Center       │ PENDING  │ 12h   │  $8,500
```

**Status strip (horizontal segmented bar):**
```
[ACTIVE] │ 42 JOBS │ $1.2M PIPELINE │ SYNCED 3m ago
```
Same pattern as 369 web status strip — segments separated by `│`, not floating.

### 1.2 Block Elements — Fill and Quantitative Rendering

The primary data-encoding vocabulary. These are the "pixels" of terminal charts.

**Full block set (left to right = 0% to 100%):**
```
█  FULL BLOCK       U+2588   100%
▉  LEFT 7/8         U+2589   87.5%
▊  LEFT 3/4         U+258A   75%
▋  LEFT 5/8         U+258B   62.5%
▌  LEFT HALF        U+258C   50%
▍  LEFT 3/8         U+258D   37.5%
▎  LEFT 1/4         U+258E   25%
▏  LEFT 1/8         U+258F   12.5%
   SPACE             —       0%
```

**Full block set (bottom to top = 0% to 100%):**
```
█  FULL BLOCK       U+2588   100%
▇  UPPER 7/8        U+2587   87.5%
▆  UPPER 3/4        U+2586   75%
▅  UPPER 5/8        U+2585   62.5%
▄  LOWER HALF       U+2584   50%
▃  LOWER 3/8        U+2583   37.5%
▂  LOWER 1/4        U+2582   25%
▁  LOWER 1/8        U+2581   12.5%
   SPACE             —       0%
```

**Shade blocks (density encoding):**
```
░  LIGHT SHADE     U+2591   ~25%
▒  MEDIUM SHADE    U+2592   ~50%
▓  DARK SHADE      U+2593   ~75%
█  FULL BLOCK      U+2588   100%
```

**Sparkline** (uses bottom-to-top set inline):
```
Values: 12, 45, 23, 67, 34, 89, 56, 22, 78, 41
Output: ▁▄▂▆▃█▅▂▇▃
```
Algorithm: `char = SPARK_CHARS[round((v - min) / (max - min) * 7)]`
where `SPARK_CHARS = " ▁▂▃▄▅▆▇█"` (9 values including space).

### 1.3 Braille Patterns — High-Resolution Pixel Art

Each braille character is a 2×4 grid of dots. In terminal: 1 character cell = 2 columns × 4 rows of "pixels." Effective resolution: 160×100 "pixels" in an 80×25 terminal.

Used for: scatter plots with many points, maps, sparkline-style line charts at finer resolution, waveforms.

```
Braille block: U+2800 + dot bitmask
Dot layout:
  1 4
  2 5
  3 6
  7 8

Example: dots 1,2,4,5 = ⠛ (top 4 filled)
Full block = ⣿ (all 8 dots)
Empty = ⠀ (U+2800, braille space)
```

**When to use:** Scatter plots with N > 50 points where `·` or `○` would overlap. Line charts that need sub-character vertical resolution. Avoid in environments where braille fonts aren't installed — always provide a `--no-braille` fallback using standard block chars.

**Practical bitmask table:**
```python
BRAILLE = 0x2800
DOT_MAP = [0x01, 0x02, 0x04, 0x40, 0x08, 0x10, 0x20, 0x80]
# dot positions: top-left, mid-left, low-left, bot-left (col 1)
#                top-right, mid-right, low-right, bot-right (col 2)

def braille_char(dots: list[bool]) -> str:
    mask = sum(DOT_MAP[i] for i, d in enumerate(dots) if d)
    return chr(BRAILLE + mask)
```

### 1.4 Geometric Shapes — State and Status Indicators

```
●  BLACK CIRCLE       U+25CF   filled state / selected / active
○  WHITE CIRCLE       U+25CB   empty state / unselected / inactive
◉  BULLSEYE           U+25C9   current / focus
◎  DOUBLE CIRCLE      U+25CE   target / goal
■  BLACK SQUARE       U+25A0   filled block indicator
□  WHITE SQUARE       U+25A1   empty block indicator
▶  BLACK R TRIANGLE   U+25B6   cursor / selected row / play
◀  BLACK L TRIANGLE   U+25C4   left cursor / back
▲  BLACK U TRIANGLE   U+25B2   ascending sort / increase
▼  BLACK D TRIANGLE   U+25BC   descending sort / decrease
◆  BLACK DIAMOND      U+25C6   critical / warning (alternative to !)
◇  WHITE DIAMOND      U+25C7   inactive version of ◆
```

**Status vocabulary (use consistently):**
```
● ACTIVE / RUNNING      ▶ CURRENT ROW
○ INACTIVE / STOPPED    ✓ COMPLETED / SUCCESS
◎ TARGET / GOAL         ✕ FAILED / ERROR
■ ENABLED               ★ FEATURED / STARRED
□ DISABLED              · BULLET / LIST ITEM
```

### 1.5 Line-Drawing for Charts (Non-Box)

For axis lines, grid lines, and plot lines within chart areas:

```
─  Horizontal line / x-axis
│  Vertical line / y-axis
╱  Diagonal up-right (slope +1)
╲  Diagonal down-right (slope -1)
·  U+00B7  Middle dot — sparse point data (scatter, low density)
•  U+2022  Bullet — medium density scatter
●  U+25CF  Black circle — high-emphasis point
∘  U+2218  Ring operator — statistical outlier marker
×  U+00D7  Multiplication sign — intersection / exclusion point
+  U+002B  Plus — grid crossing in ASCII-only fallback
```

### 1.6 Progress and Gauge Patterns

**Filled progress bar (left-to-right block chars):**
```
[████████░░░░░░░░]  50%
[████████████▌░░░]  79%  ← partial fill char for precision
```
Pattern: `[` + `█` × filled + partial_char + `░` × remaining + `]`
Partial char selection: map remainder fraction to `▏▎▍▌▋▊▉`.

**ASCII-safe fallback (no block chars):**
```
[########........]  50%
```

**Gauge (vertical):**
```
│█│
│█│
│█│
│░│
│░│
 %
```

---

## Part 2 — Human Factors for Terminal Interfaces

### 2.1 Reading Patterns in a Terminal

Eye tracking and usability research on text interfaces shows consistent patterns:

**F-Pattern scanning** (applies to text-heavy terminal output):
- First fixation: top-left corner
- Horizontal scan across the first line (full width)
- Second horizontal scan, shorter, ~60% across
- Vertical scan down the left edge
- **Implication:** The left column of any terminal layout gets the most attention. Put the most important identifier/label there.

**Z-Pattern** (applies to structured UI with few elements):
- Top-left → top-right (window bar scan)
- Diagonal to bottom-left
- Bottom-left → bottom-right (status/action area)
- **Implication:** Window bar (top) and action footer (bottom) are high-attention zones. Middle body is lower-attention unless something draws the eye.

**Serial scan** (applies to list/table output):
- Users scan the left edge of each row vertically to find the row they want
- Then scan right to find the value
- **Implication:** Keep the leftmost column as the primary identifier. Never wrap it. Truncate with `…` if needed.

### 2.2 Information Density

A terminal at 80×25 holds **2,000 characters per screen** — this is extremely high density relative to modern web interfaces. The correct design response is **to use that density**, not to add padding to simulate web whitespace.

**Density guidelines:**
- Body text: 1 blank line between sections (not 2–3)
- Table rows: no blank lines between rows
- Section headers: 1 line above, 0 lines below (the `─── HEADER ─` itself is the separator)
- Sidebar/panel: fill to terminal width; no interior margin except 1-char left pad
- Status strip: no vertical padding — use `│` to segment horizontally

**The 80-column budget (baseline layout):**
```
Col 1–20:    Label column (primary identifier)
Col 21:      │  separator
Col 22–33:   Primary value (right-aligned numbers)
Col 34:      │  separator
Col 35–45:   Secondary value or status
Col 46:      │  separator or space
Col 47–80:   Bar chart or text overflow
```

**Wide terminal (120 columns) budget:**
```
Col 1–30:    Label column
Col 31:      │
Col 32–45:   Primary value
Col 46:      │
Col 47–60:   Secondary value
Col 61:      │
Col 62–120:  Bar chart (58 chars = high resolution)
```

### 2.3 Hierarchy Without Color

When color is available: use it for hierarchy (navy headline, grey body, manila highlight). When `NO_COLOR` is set, hierarchy must come entirely from non-color attributes:

| Hierarchy level | Color mode | No-color mode |
|-----------------|------------|---------------|
| Top-level header | navy bold | BOLD UPPERCASE |
| Section header | grey | `─── TITLE ───` underline or bold |
| Primary data | white body | Normal case |
| Secondary data | grey dim | Dim (`\x1b[2m`) or indented |
| Inactive / disabled | grey lighter | `(parenthesized)` or `[brackets]` |
| Success state | `#228B22` green | `✓` prefix |
| Warning/error | `#a60315` red | `✕` prefix or `[!]` |

### 2.4 Alignment Rules for Scanability

- **Numbers: always right-align in their column.** A column of right-aligned numbers lets the eye compare magnitudes by position instantly.
- **Labels: always left-align.** Left alignment lets the serial-scan pattern work (scan left edge downward).
- **Status badges: left-align within their column, but give them a fixed-width column.** `ACTIVE ` (7 chars) and `PENDING` (7 chars) — pad the shorter one.
- **Percentages: right-align the number, left-align the `%`.** `  42%` not ` 42% ` — the `%` is a unit, not part of the number.
- **Dates: fixed-width ISO format** — `2026-05-27` (10 chars always). Relative times for recency: `3m ago`, `2h ago`, `1d ago` (fixed 6 chars: `Nd ago` or `Nh ago`).

### 2.5 What Humans Read Fastest in Terminal

Ranked by time-to-comprehension for a given information type:

| Information type | Fastest terminal form | Why |
|-----------------|-----------------------|-----|
| Relative magnitude | Horizontal bar `████░░░` | Pre-attentive length encoding |
| Trend over time | Sparkline `▁▃▆█▇▄▂` | Sequential glance |
| Ranked list | Sorted bar chart + rank number | Two encodings (position + length) |
| Exact number | Right-aligned column | Eye jumps to right edge |
| State / status | Symbol + WORD (`● ACTIVE`) | Symbol pre-attentive, word confirms |
| Proportion | Segmented bar `[████░░░░]` | Length ratio directly visible |
| Distribution | Histogram `█▆▄▂▁` | Shape of data visible |
| Relationships | Scatter (`·` `●` grid) | Two-axis position encoding |

---

## Part 3 — Engine Composition Rules for `medium: 'terminal'`

### 3.1 Intent → Chart Type Mapping

When `presentation(data, intent, 'terminal')` is called, the engine selects from this table. No hand-picking:

| Intent | Terminal chart type | Primary character | Secondary character |
|--------|--------------------|--------------------|---------------------|
| `comparison` | Horizontal bar chart | `█` (bar fill) | `░` (bar empty) |
| `ranking` | Sorted horizontal bar + rank index | `█` | rank number prefix |
| `trend` | Sparkline (single row) or ASCII line chart (multi-row) | `▁▂▃▄▅▆▇█` | axis `─` `│` |
| `distribution` | Vertical histogram | `█` stacked | `░` for empty bins |
| `correlation` | 2D scatter plot | `·` (low density) `●` (high) | axis `─` `│` |
| `part-to-whole` | Segmented horizontal bar | `█` (primary) `▒` (secondary) `░` (rest) | `│` segment separator |

### 3.2 Horizontal Bar Chart — Exact Algorithm

The canonical `comparison` and `ranking` output.

**Input:**
```
data = [{label: "West", value: 142}, {label: "South", value: 167}, {label: "Midwest", value: 121}]
intent = "comparison"
terminal_width = 80
```

**Step 1 — Size the label column:**
```
label_width = max(len(row.label) for row in data) + 1  # +1 right pad
# = len("Midwest") + 1 = 8
```

**Step 2 — Size the value column:**
```
value_width = len(str(max(row.value for row in data))) + 1  # +1 right pad
# = len("167") + 1 = 4
```

**Step 3 — Compute bar area:**
```
bar_width = terminal_width - label_width - value_width - 3  # 3 = "│ " separator + right pad
# = 80 - 8 - 4 - 3 = 65
```

**Step 4 — Scale values to bar_width (with sub-character precision):**
```
scale = bar_width / max_value                    # 65 / 167 = 0.389...
for row in sorted(data, key=lambda r: -r.value):
    filled_exact = row.value * scale             # e.g. 167 * 0.389 = 65.0
    filled_full = int(filled_exact)              # integer full blocks
    remainder = filled_exact - filled_full       # fractional part
    partial = PARTIAL_CHARS[int(remainder * 8)]  # 0–7 → ▏▎▍▌▋▊▉ or ''
    bar = '█' * filled_full + partial + '░' * (bar_width - filled_full - (1 if partial else 0))
```

**Step 5 — Render:**
```
─── REVENUE BY REGION ──────────────────────────────────────────────────────────
South    │ 167 │ █████████████████████████████████████████████████████████████████
West     │ 142 │ ████████████████████████████████████████████████████████░░░░░░░░░
Midwest  │ 121 │ █████████████████████████████████████████████████░░░░░░░░░░░░░░░░
```

**Sorting rule:** `comparison` sorts descending by value. `ranking` sorts the same and prepends rank number: `1. South │ 167 │ ████…`.

### 3.3 Sparkline — Exact Algorithm

The canonical `trend` output when the data fits in a single line (≤ 80 data points).

```python
SPARK_CHARS = " ▁▂▃▄▅▆▇█"   # 9 chars (index 0–8)

def sparkline(values: list[float], label: str = "", width: int | None = None) -> str:
    mn, mx = min(values), max(values)
    rng = mx - mn or 1                          # avoid div-by-zero on flat data
    chars = [SPARK_CHARS[round((v - mn) / rng * 8)] for v in values]
    bar = "".join(chars)
    if width:
        bar = bar[-width:]                       # trim to available width
    suffix = f"  {mn:.0f}–{mx:.0f}"             # range annotation
    return f"{label}  {''.join(chars)}{suffix}" if label else "".join(chars) + suffix
```

**Output:**
```
DAILY REVENUE  ▁▃▂▆▄█▅▂▇▃  $1,200–$8,900
```

**Multi-line sparkline (ASCII line chart)** — when data points > terminal_width or when the trend needs axis labels:
```
8.9k │                  ●
     │                ╱   ╲
4.5k │         ●    ╱       ╲       ●
     │       ╱   ╲╱             ╲ ╱   ╲
1.2k │●────╱                         ╲──●
     └─────────────────────────────────────
      May 1            May 15           May 27
```

### 3.4 Vertical Histogram — Exact Algorithm

The canonical `distribution` output.

```python
def histogram(values: list[float], bins: int = 10, height: int = 8, width: int = 60) -> list[str]:
    mn, mx = min(values), max(values)
    bin_width = (mx - mn) / bins
    counts = [0] * bins
    for v in values:
        idx = min(int((v - mn) / bin_width), bins - 1)
        counts[idx] += 1
    max_count = max(counts)
    rows = []
    for row_idx in range(height, 0, -1):
        threshold = max_count * row_idx / height
        line = "".join("█" if c >= threshold else "░" for c in counts)
        y_label = f"{int(max_count * row_idx / height):>5}"
        rows.append(f"{y_label} │ {line}")
    rows.append(f"      └─{'─' * bins}─")
    rows.append(f"       {mn:.0f}{' ' * (bins - len(str(int(mn))) - len(str(int(mx))))}{mx:.0f}")
    return rows
```

**Output (10 bins, 8 rows high):**
```
   24 │ ░░░░█░░░░░
   18 │ ░░░██░░░░░
   12 │ ░░███░░░░░
    6 │ ░████░░░░░
    3 │ █████░░░░░
    1 │ ██████░░░░
      └───────────
       10          95
```

### 3.5 Scatter Plot — Exact Algorithm

The canonical `correlation` output.

```python
def scatter(data: list[tuple[float,float]], width: int = 60, height: int = 20) -> list[str]:
    xs = [p[0] for p in data]
    ys = [p[1] for p in data]
    mn_x, mx_x = min(xs), max(xs)
    mn_y, mx_y = min(ys), max(ys)
    grid = [[' '] * width for _ in range(height)]
    for x, y in data:
        col = round((x - mn_x) / (mx_x - mn_x) * (width - 1))
        row = height - 1 - round((y - mn_y) / (mx_y - mn_y) * (height - 1))
        grid[row][col] = '●' if grid[row][col] == '●' else ('●' if grid[row][col] == ' ' else '◉')
    rows = []
    for i, row in enumerate(grid):
        y_val = mx_y - (mx_y - mn_y) * i / (height - 1)
        rows.append(f"{y_val:6.1f} │ {''.join(row)}")
    rows.append(f"       └─{'─' * width}─")
    rows.append(f"        {mn_x:.1f}{' ' * (width - 10)}{mx_x:.1f}")
    return rows
```

**Density encoding:** If a cell already has `●` and another point maps to it, change to `◉` (two-ring = high density). For 3+, use `█`.

### 3.6 Part-to-Whole (Segmented Bar)

```
REVENUE BREAKDOWN  [█████████████████▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]
                    ████ West 34%    ▒▒▒ South 18%   ░░░ Midwest 48%
```

Algorithm:
1. Sort segments descending by value
2. Scale each to available bar_width
3. Use distinct fill chars per rank: `█` (1st), `▒` (2nd), `░` (3rd), `▓` (4th), `╌` (5th+)
4. Add a legend row below with char + label + percentage

### 3.7 Table Layout

The canonical rendering for tabular data when intent is not a chart (or when N columns > 2 quantitative fields).

```
┌─ JOB BOARD ──────────────────────────────────────────────────────────────┐
│ TITLE                   │ CLIENT          │ BUDGET   │ AGE  │ STATUS     │
├─────────────────────────┼─────────────────┼──────────┼──────┼────────────┤
│ Downtown Canopy Install  │ Sunset Lofts    │  $15,000 │  3d  │ ● ACTIVE   │
│ Roof Deck Phase 2        │ Aria Tower      │   $8,500 │ 12h  │ ● ACTIVE   │
│ Courtyard Lighting       │ Harbor View     │   $3,200 │  7d  │ ○ PENDING  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Column sizing algorithm:**
```
For each column:
  header_width = len(header)
  max_data_width = max(len(str(row[col])) for row in data)
  col_width = max(header_width, max_data_width) + 2  # +2 for side padding

total_width = sum(col_widths) + num_separators

if total_width > terminal_width:
    # Shrink the widest column first, then second widest, etc.
    # Never shrink below max(8, header_width)
    # Truncate data values with '…' if they exceed the reduced width
```

**Number alignment within column:** Always right-align. For mixed text/number columns, left-align everything.

---

## Part 4 — ASCII Layout Patterns (Copy-Paste Templates)

These are the canonical terminal layouts. The engine emits these; no hand-design needed.

### Window (full-screen program)

```
┌─ [PROGRAM NAME] ──────────────────────────────────────────────────────────┐
│ [STATUS A] │ [STATUS B] │ [STATUS C]                            [HH:MM:SS] │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  (body — scrollable)                                                       │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ [q] QUIT  [j/k] NAVIGATE  [enter] SELECT  [/] SEARCH  [?] HELP            │
└────────────────────────────────────────────────────────────────────────────┘
```

Maps to 369 web composition: `┌─ WINDOW BAR ─┐` = window bar row, status strip, scrolling body, action footer.

### Two-Panel (sidebar + main)

```
┌─ NAV ──────────┬─ DETAIL ──────────────────────────────────────────────────┐
│ ▶ Jobs         │ DOWNTOWN CANOPY INSTALL                                    │
│   Producers    │ ─── OVERVIEW ─────────────────────────────────────────────│
│   Clients      │ Client      Sunset Lofts                                   │
│   Reports      │ Budget      $15,000                                        │
│                │ Status      ● ACTIVE                                       │
│                │ Age         3 days                                         │
│                │ ─── TIMELINE ─────────────────────────────────────────────│
│                │  May 20  ✓ Contract signed                                 │
│                │  May 24  ✓ Materials ordered                               │
│                │  May 29  ○ Installation begins                             │
└────────────────┴───────────────────────────────────────────────────────────┘
```

### Dashboard (metrics + charts)

```
─── ADN DASHBOARD — 2026-05-27 ─────────────────────────────────────────────
 ACTIVE JOBS    PIPELINE       AVG BUDGET    CONVERSION
    42              $1.2M         $28,500         67%

─── JOB VOLUME (30 days) ───────────────────────────────────────────────────
  12 │ ░░░░░░░░░░░░░░░░░░░█░░░░░░░░░░
   8 │ ░░░░░░░░░░░░░░░░░█████░░░░░░░░
   4 │ ░░░░░░░░░░░░░░░█████████░░░░░░
   2 │ █████████████████████████████░
     └───────────────────────────────
      May 1                     May 27

─── REVENUE BY REGION ──────────────────────────────────────────────────────
South    │ 167 │ ████████████████████████████████████████████████████████████
West     │ 142 │ ████████████████████████████████████████████████████░░░░░░░░
Midwest  │ 121 │ ████████████████████████████████████████████████░░░░░░░░░░░░
```

### Notification / Log Stream

```
[10:42:31]  ✓  Job #4821 — contract signed (Sunset Lofts)
[10:41:58]  ●  Job #4820 — producer assigned (Maria V.)
[10:38:12]  !  Payment delayed — Job #4817 (retry in 4h)
[10:31:00]  ✓  Invoice #339 — paid ($8,500)
[10:28:44]  ○  New job posted — Courtyard Lighting ($3,200)
```

Pattern: `[HH:MM:SS]  SYMBOL  MESSAGE`. Fixed-width timestamp + status symbol + left-aligned message. One line per event. No borders — pure stream.

### Input Form

```
─── NEW JOB ────────────────────────────────────────────────────────────────
 TITLE          › Downtown Canopy Install█
 CLIENT         › Sunset Lofts
 BUDGET         › $15,000
 CATEGORY       › [INSTALL] [MAINTENANCE] ◉ DESIGN [REMOVAL]

 [ENTER] SAVE   [ESC] CANCEL   [TAB] NEXT FIELD
```

`›` = focused field indicator. `█` = cursor. Selected option in brackets = bold/highlight. Options use `◉` for selected, `○` for unselected.

---

## Part 5 — Engine Integration Specification

### How to Add `medium: 'terminal'` to the Engine

The `presentation()` engine currently handles `medium: 'desktop'` and `medium: 'mobile'`. Adding `medium: 'terminal'` requires:

**1. In `src/base/presentation.ts`:** Add `'terminal'` to the `Medium` type and add a branch in the beam search that routes to terminal-specific renderers.

**2. Create `src/base/presentation/render-terminal.ts`:**
```typescript
export function renderTerminal(
  spec: PresentationSpec,
  data: Row[],
  options: { width?: number; height?: number; color?: boolean }
): string {
  const width = options.width ?? process.stdout.columns ?? 80
  const color = options.color ?? isatty(1)
  
  switch (spec.chartType) {
    case 'bar':         return renderHorizontalBar(spec, data, width, color)
    case 'sparkline':   return renderSparkline(spec, data, width, color)
    case 'histogram':   return renderHistogram(spec, data, width, options.height ?? 12, color)
    case 'scatter':     return renderScatter(spec, data, width, options.height ?? 20, color)
    case 'table':       return renderTable(spec, data, width, color)
    case 'segmented':   return renderSegmentedBar(spec, data, width, color)
    default:            return renderTable(spec, data, width, color)  // safe fallback
  }
}
```

**3. Chart type election for `medium: 'terminal'`:**
The beam search in `src/base/beam.ts` should add terminal-specific weights:

| Intent | Desktop winner | Terminal winner | Why it differs |
|--------|----------------|-----------------|----------------|
| `comparison` | bar chart | horizontal bar | Vertical bars require multi-line; horizontal bar fits in N rows |
| `ranking` | sorted bar | sorted horizontal bar | Same reason |
| `trend` | line chart | sparkline (< 60pts) or ASCII line | Sparkline is the most information-dense trend form in a terminal |
| `distribution` | histogram | vertical histogram with `█` | Direct translation |
| `correlation` | scatter | braille scatter or `·` scatter | Braille = more resolution in same cell count |
| `part-to-whole` | pie/donut | segmented horizontal bar | Pie is impossible in character cells; segmented bar is exact equivalent |

**4. ANSI color tokens (match the 369 web tokens):**
```typescript
const TERMINAL_TOKENS = {
  navy:          '\x1b[38;2;0;16;137m',    // #001089
  grey:          '\x1b[38;2;153;153;153m', // #999999
  white:         '\x1b[0m',                // reset to default
  manila:        '\x1b[48;2;248;234;199m', // #f8eac7 background
  headerTop:     '\x1b[48;2;148;163;214m', // #94a3d6 background
  headerCurrent: '\x1b[48;2;184;218;232m', // #b8dae8 background
  success:       '\x1b[38;2;34;139;34m',   // #228B22
  warning:       '\x1b[38;2;166;3;21m',    // #a60315
  bold:          '\x1b[1m',
  dim:           '\x1b[2m',
  reset:         '\x1b[0m',
}

// Always wrap color sequences so NO_COLOR is respected
function ansi(token: keyof typeof TERMINAL_TOKENS, text: string): string {
  if (process.env.NO_COLOR) return text
  return TERMINAL_TOKENS[token] + text + TERMINAL_TOKENS.reset
}
```

---

## Part 6 — Quick-Reference Glyph Table

Paste this into any AI session to give it the full ASCII vocabulary instantly.

```
BOX:      ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
BLOCK H:  ▏▎▍▌▋▊▉█  (1/8 to full, left-fill)
BLOCK V:  ▁▂▃▄▅▆▇█  (1/8 to full, bottom-fill)
SHADE:    ░ ▒ ▓ █
ARROW:    ← → ↑ ↓ ↖ ↗ ↘ ↙ ⇐ ⇒ ▶ ◀ ▲ ▼
SHAPE:    ● ○ ◉ ◎ ■ □ ◆ ◇ ★ ☆
GLYPH:    ✓ ✕ ! ? · • … › ‹ « »
MATH:     + − × ÷ = ≠ ≤ ≥ ∑ ∞ ∆ ∘
SPARK:    ▁▂▃▄▅▆▇█  (use inline, 1 char per data point)
BRAILLE:  ⠀ to ⣿  (U+2800–U+28FF, 2×4 pixel art)
CURRENCY: $ € £ ¥ ₿ ¢
```

---

## See Also

- `references/canon/tui-design.md` — Framework selection (Textual/Ratatui/Bubbletea), Elm Architecture, CLIG principles, 369→TUI rule mapping (T1–T7)
- `references/canon/unix-cli-principles.md` — ESR's 17 Unix rules, output design, exit codes, signal handling
- `references/engines.md` — `presentation()` and `resolveAny()` engine entry points; how to call them for desktop medium
- `references/tufte.md` — Data-visualization canon (Tufte's rules) that the composition engine's beam search is built on
