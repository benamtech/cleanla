# Internationalization in Terminal UIs — CJK, BiDi, Emoji, Complex Scripts

> **Terminal cells are a 1980s abstraction; human writing is older and richer.** Internationalization in TUIs is the friction between "every character occupies exactly one fixed-width cell" and the reality of: CJK glyphs that fill 2 cells, Arabic that flows right-to-left, Devanagari that reorders syllables, emoji families that compose 7 codepoints into 1 glyph at 2 cells wide. This page is the canonical reference for handling all of it correctly in 369 TUIs.

For glyph vocabulary, see [[unicode-art-extended]]. For protocol-level basics, see [[terminal-capabilities]].

---

## East Asian Width (Unicode TR11)

The canonical measure for terminal cell consumption. Six categories:

| Category | Abbrev | Cells | Example | Notes |
|----------|--------|-------|---------|-------|
| Fullwidth | F | 2 | 人 (CJK) | Legacy East Asian codepoints |
| Wide | W | 2 | Α (Greek) | Inherently double-width |
| Halfwidth | H | 1 | ｆ (U+FF41) | Legacy single-width East Asian |
| Narrow | Na | 1 | ‐ (hyphen) | Visually narrow; 1 cell |
| **Ambiguous** | **A** | **1 or 2** | § (section) | **Context-dependent; the divergence point** |
| Neutral | N | 1 | a (ASCII) | Default single-width |

### The ambiguous-width problem
Greek letters, Cyrillic, box-drawing, fractions (U+00BC `¼`), section sign (`§`), etc. are *Ambiguous*. Legacy CJK terminal protocols rendered these as fullwidth (2 cells). Modern Unicode defaults to narrow (1 cell). The same source text can render differently across terminals.

**Terminal toggles:**
- `vt100ambiguous=true` in some xterm derivatives → treat as fullwidth
- `xterm -cjk_width` → enable CJK wcwidth tables
- fish-shell: `$fish_ambiguous_width` per-user config
- Mlterm: defaults to fullwidth in CJK mode

### POSIX wcwidth / wcswidth

```c
int wcwidth(wchar_t wc);                    // 1 char → cell count
int wcswidth(const wchar_t *s, size_t n);   // string → cell count
```

Returns:
- `-1` — unprintable/control (U+0000–U+001F, U+007F–U+009F, ZWJ, ZWNJ, soft hyphen)
- `0` — combining marks, variation selectors, joiners
- `1` — narrow / halfwidth
- `2` — wide / fullwidth

### Implementation divergence (critical for testing)

| Library | Source | Behavior |
|---------|--------|----------|
| Markus Kuhn (1998–2007) | Static tables, Unicode 5.0 baseline | Canonical reference; ambiguous→narrow |
| ncurses | Inherits Kuhn | Locale-aware via `setlocale(LC_CTYPE, "")` |
| fish-shell | Custom | Runtime emoji detect; configurable ambiguous |
| tmux | Custom | Sometimes lags Unicode; verify per-version |
| utf8proc (Julia, Neovim) | Normative tables | Tracks Unicode releases more closely |
| glibc | System locale-tied | Often outdated; may return -1 on valid printables in non-UTF-8 locales |

**369 rule:** Use Markus Kuhn's tables as the reference. Cross-check against fish-shell behavior for runtime width questions. Never trust a single wcwidth implementation across platforms.

---

## CJK Terminal Rendering

### Fullwidth vs halfwidth

**Fullwidth (double-cell):**
- CJK Unified Ideographs (U+4E00–U+9FFF): each is 2 columns
- Fullwidth ASCII (U+FF00–U+FF5F): `Ａ` (U+FF21) vs `A` (U+0041)
- Fullwidth katakana / hiragana (used rarely)

**Halfwidth (single-cell):**
- Halfwidth katakana (U+FF61–U+FF9F): legacy JIS X 0201
- ASCII (U+0000–U+007F)
- Halfwidth hangul (U+FFA0–U+FFBE)

Regular hiragana (U+3040–U+309F) and standard katakana (U+30A0–U+30FF) are **always fullwidth** by default.

### Font metrics matter
The terminal can only render correctly if the chosen monospace font has the same advance width for fullwidth glyphs as 2× the ASCII width. Mismatched fonts (e.g., DejaVu Sans Mono as primary + fallback for CJK at non-2× width) cause cumulative misalignment.

**369 font recommendation for CJK:**
- **Noto Sans Mono CJK** — Google's pan-CJK monospace; perfect 2× metric
- **Source Han Mono** — Adobe's pan-CJK alternative
- **Sarasa Mono** — Iosevka × Source Han hybrid; tight metrics

### Mlterm (the CJK-first terminal)
- Native bidirectional support with vertical writing mode (`cjk` for vertical CJK, `mongol` for Mongolian)
- Configurable font selection by Unicode range
- Cursor adapts to vertical mode: up/down navigates columns, left/right navigates rows
- Treats ambiguous as fullwidth in CJK mode

For pure-CJK terminal work, Mlterm is the historical reference. Modern alternatives (Kitty, WezTerm with Noto Sans Mono CJK) are now competitive.

---

## Bidirectional Text (Unicode TR9)

The Unicode Bidirectional Algorithm reorders LTR and RTL text for display. Terminal constraints make full BiDi support rare.

### Directional character classes (subset)
- **Strong:** LTR (Latin, numbers), RTL (Hebrew, Arabic), AN (Arabic Number), EN (European Number)
- **Weak:** ES (European Separator), CS (Common Separator), Neutral (space, punctuation)
- **Explicit:** LRM (U+200E), RLM (U+200F), LRE / RLE / PDF (override + pop directional formatting)

### Terminal status (2026)
| Terminal | BiDi support |
|----------|--------------|
| **xterm / VT100** | None — byte-order only; RTL garbled |
| **Konsole** (KDE) | Basic — renders RTL from screen-right correctly; not full TR9 |
| **Mlterm** | Best-in-class for a terminal emulator; mixed paragraphs work |
| **VTE-based** (GNOME Terminal, Terminator, XFCE) | Mostly broken; `\e[?2501h` enables experimental auto-direction in some versions |
| **Kitty / WezTerm** | Limited; opt-in via config |
| **iTerm2** | Limited |

### The Terminal WG BiDi spec
Unicode TC #175 (post-2023) tasked Microsoft, XTerm maintainers, and emulator implementers to standardize BiDi terminal support. The `\e[?2500h` / `\e[?2501h` modes are part of this draft. Implementation is still patchy in 2026.

### The practical workaround
Terminal cursor positioning assumes 1-to-1 cell-character mapping. Reordering breaks this.

**Solution:** Applications pre-reorder text using **HarfBuzz** or **ICU** (`icu4c` / `icu4j`), then send already-reordered bytes to the terminal. The terminal renders byte-by-byte and the visual result is correct.

```c
// libfribidi pseudocode
fribidi_log2vis(logical_text, length, base_dir, visual_text, ...);
fputs(visual_text, stdout);
```

**369 rule:** TUIs that must support RTL languages MUST run text through fribidi or HarfBuzz before emitting it. Do not assume terminal BiDi support.

---

## Complex Scripts (Indic, Khmer, Thai)

### Why terminals struggle

Complex scripts require **glyph clustering** — multiple codepoints map to a single visual unit, often reordered.

**Devanagari (Hindi):** Vowel mark `ि` (U+093F) repositions LEFT of the preceding consonant: `क + ि = कि` (the vowel visually precedes the consonant despite logical-order following). Requires OpenType GSUB (substitution) + GPOS (positioning) tables.

**Khmer:** Vowel decomposition via `pres` (pre-base) and `abvs` (above-base) features. `អើ` (OE vowel) splits around the consonant.

**Tamil:** Reordering of dependent vowels; "two-part vowels" wrap around the consonant.

**Thai / Lao:** Tone marks and vowels above/below base; no horizontal advance.

### Fundamental terminal mismatch
Terminal grid assumes fixed advance widths and no reordering. Complex scripts violate both. Terminal fonts rarely include GSUB/GPOS support; rendering engines (Xft, HarfBuzz, Pango) are not integrated into most terminal emulators.

### Workarounds
1. **monotty / fonts (GitHub)** — monospace fonts with CTL (Complex Text Layout) support for Devanagari, Tamil. Limited coverage.
2. **Pre-shape via HarfBuzz** — applications run text through HarfBuzz before terminal output. Visual result is correct but cursor math is fragile.
3. **Accept mojibake** — render unshapen characters. Acceptable for codepoint-display tools (e.g., looking up Unicode codepoints) but not for prose.
4. **Render to image** — Sixel / Kitty graphics protocol can display pre-shaped text as a bitmap.

**369 rule:** Complex scripts in pure terminal mode are best-effort. For production-quality rendering, fall back to the image plane (Sixel / Kitty graphics) — see [[terminal-capabilities]].

---

## Emoji — The Modern Disaster Zone

### Variation selectors

| Codepoint | Name | Effect |
|-----------|------|--------|
| **U+FE0E** | Text variant | Render in B&W text style |
| **U+FE0F** | Emoji variant | Render in color emoji style |

Examples:
- `❤` (U+2764 alone) — usually B&W heart, 1 cell wide
- `❤️` (U+2764 + U+FE0F) — color emoji, 2 cells wide
- `☁` (U+2601 alone) — B&W cloud, 1 cell
- `☁️` (U+2601 + U+FE0F) — color emoji, 2 cells

**Terminal wcwidth breakage:** Most implementations IGNORE variation selectors. `wcwidth(U+FE0E)` returns 0 or -1. Shell prompt calculation (bash, zsh, fish) breaks if wcwidth doesn't account for the selector.

### Zero-Width Joiner (ZWJ) sequences

**U+200D** invisible character joining base emoji. Repeated ZWJ sequences form complex emoji.

Examples:
- `👨‍👩‍👧‍👦` = `U+1F468` + ZWJ + `U+1F469` + ZWJ + `U+1F467` + ZWJ + `U+1F466` — 1 family emoji
- `👨‍💻` = `U+1F468` + ZWJ + `U+1F4BB` — 1 man-with-computer emoji

**Width:** `wcwidth(U+200D)` returns 0. The font renders the sequence as one glyph. Terminal must count the final composed grapheme as 2 cells, NOT as 2+0+2+0+2.

**Current state:** Most terminals don't recognize ZWJ sequences and render each base separately, corrupting display.

### Skin tone modifiers (Fitzpatrick scale)

Unicode 8.0 (2015) added 5 modifiers:

| Codepoint | Skin tone |
|-----------|-----------|
| `U+1F3FB` | Light (Fitzpatrick I–II) |
| `U+1F3FC` | Medium-light (Fitzpatrick III) |
| `U+1F3FD` | Medium (Fitzpatrick IV) |
| `U+1F3FE` | Medium-dark (Fitzpatrick V) |
| `U+1F3FF` | Dark (Fitzpatrick VI) |

Usage: append after base. `👋 + U+1F3FB = 👋🏻`. Some terminals combine; others render as separate glyphs (4 cells total).

### Regional indicators (flags)
`U+1F1E6–U+1F1FF` — paired letters forming country flags. Each letter is width=2; flag glyph is composed of 2 letters → fonts that recognize the pair render as one 2-cell flag; otherwise 4 cells of letters.

### Modern emoji width
Most emoji from `U+1F300+` are width=2. Variation selectors can reduce to 1. ZWJ adds 0 per joiner. **The actual rendered width depends on the FONT, not just the codepoints.**

### 369 rule for emoji
On `/369` (and similar 369-native screens): **No emoji.** Rule 6 forbids them — platform fonts ignore design tokens, and width is unstable. Use text glyphs (`★ ✓ ✕ → ← • ▶ ▼ ◀ ▲`).

On terminal TUIs where emoji are needed: prefer `U+FE0E` text-variant suffix to force 1-cell B&W rendering. Test on target terminals.

---

## Combining Characters and Normalization

### Combining diacriticals (U+0300–U+036F)

Marks that modify the preceding base character:
- `U+0301` — acute (e + ◌́ = é)
- `U+0308` — diaeresis (◌̈)
- `U+0327` — cedilla (◌̧)
- `U+030A` — ring above (a + ◌̊ = å)

`wcwidth(combining) = 0`. The base character has positive width; combining marks stack on top without consuming cells.

### NFC vs NFD normalization

| Form | Description | Example |
|------|-------------|---------|
| **NFC** (Normalization Form Composed) | Precomposed where possible | `é` = U+00E9 (single codepoint) |
| **NFD** (Normalization Form Decomposed) | Decomposed canonical | `é` = U+0065 + U+0301 (two codepoints) |
| **NFKC / NFKD** | Compatibility-compose / decompose | Stricter; folds e.g., fullwidth → halfwidth |

**Terminal pitfall:** Some terminals (Konsole on specific versions) drop combining marks in NFD form, displaying only the base. Output text in NFC for safety.

```python
import unicodedata
safe = unicodedata.normalize('NFC', user_input)
```

### Canonical Combining Class (CCC)
Each combining mark has a CCC integer determining its visual layer (above, below, attached, free-floating). Used by complex shaping engines; rarely visible to TUI authors directly.

---

## Character Encodings

### UTF-8 is universal (since ~2010)
Every modern terminal speaks UTF-8 by default. Locale should be `*.UTF-8`.

```bash
echo $LANG       # en_US.UTF-8
echo $LC_CTYPE   # often unset; falls through to LANG
```

### Legacy encodings (still encountered)
| Encoding | Region | Notes |
|----------|--------|-------|
| **Shift-JIS / CP932** | Japan | Older Japanese systems |
| **EUC-JP** | Japan | Unix legacy |
| **GBK / GB2312 / GB18030** | China | Mainland Chinese systems |
| **Big5** | Taiwan, HK | Traditional Chinese |
| **EUC-KR / CP949** | Korea | |
| **ISO-8859-1 / Latin-1** | Western Europe | Pre-UTF-8 default |
| **ISO-8859-15** | Western Europe | Latin-1 + Euro sign |
| **CP437** | DOS / ANSI art | Western + box-drawing |
| **Mac Roman** | macOS pre-OSX | |

### Mojibake patterns
When encoding mismatches occur, recognizable patterns:
- Latin-1 read as UTF-8: replacement character `�` (U+FFFD)
- UTF-8 read as Latin-1: `é` becomes `Ã©`
- Shift-JIS read as UTF-8: `日本語` becomes garbled bytes

### Detection libraries
- **chardet** (Python) / **uchardet** (C) — heuristic detection
- **ICU** — has robust detection
- **Mozilla CharsetDetector** — used by Firefox; ported to many languages

---

## Input Methods (IMEs)

### IBus / Fcitx (Linux)
- **IBus** — daemon-based IME framework, integrates with most desktop environments
- **Fcitx** — lighter alternative, dominant in CJK communities

### Configuration
```bash
export GTK_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
```

### Terminal IME support (2026 status)
| Terminal | IME |
|----------|-----|
| **Konsole** | Yes — native IBus/Fcitx |
| **Kitty** | Yes — explicit IME support |
| **Alacritty** | No |
| **xterm** | Partial (X11 XIM) |
| **WezTerm** | Yes |
| **GNOME Terminal** | Yes |
| **iTerm2** (macOS) | Yes — native macOS IME |
| **Windows Terminal** | Yes — Windows IMM |

### Compose key (alternative for occasional non-ASCII)
Dead-keys and Compose keys produce accented characters without IME. Example:
```
Compose + a + ' → á
Compose + o + " → ö
Compose + n + ~ → ñ
```

`setxkbmap -option compose:ralt` sets right-Alt as Compose on Linux.

---

## Locale Handling

### POSIX locale format
```
<language>_<territory>.<codeset>[@<modifier>]
en_US.UTF-8
ja_JP.UTF-8
zh_CN.GBK
de_DE.UTF-8@euro
```

### `setlocale()` precedence
```c
setlocale(LC_ALL, "");  // initialize from environment
```

Variable precedence:
1. `LC_ALL` — overrides everything
2. `LC_CTYPE` — character handling
3. `LC_COLLATE` — sort order
4. `LC_MESSAGES` — translations
5. `LC_NUMERIC` — number formatting
6. `LC_TIME` — date formatting
7. `LC_MONETARY` — currency
8. `LANG` — fallback when LC_* unset

### wcwidth locale dependency
`wcwidth()` may behave differently across locales. The C/POSIX locale forces ASCII-only; UTF-8 locales enable full Unicode.

### Linux locale generation
```bash
sudo locale-gen en_US.UTF-8 ja_JP.UTF-8
sudo update-locale
```

`locale -a` lists all available locales.

---

## Library Coverage Matrix

| Library | wcwidth | Variation selectors | ZWJ sequences | BiDi | Complex scripts |
|---------|---------|---------------------|---------------|------|-----------------|
| Markus Kuhn (1998) | ✓ Unicode 5.0 | ✗ | ✗ | ✗ | ✗ |
| ncurses | ✓ via Kuhn | ✗ | ✗ | ✗ | ✗ |
| fish-shell | ✓ runtime | partial | partial | ✗ | ✗ |
| tmux | ✓ | ✗ | ✗ | ✗ | ✗ |
| utf8proc | ✓ Unicode 15+ | ✓ | ✓ (basic) | ✗ | ✗ |
| glibc | ✓ locale-tied | ✗ | ✗ | ✗ | ✗ |
| **HarfBuzz** | n/a (shaper) | ✓ | ✓ | ✓ | ✓ |
| **ICU** | ✓ | ✓ | ✓ | ✓ | ✓ |
| **fribidi** | n/a | n/a | n/a | ✓ TR9 full | ✗ |

**369 stack recommendation for high-i18n TUIs:**
- wcwidth → utf8proc (closest to current Unicode)
- BiDi reordering → fribidi
- Complex script shaping → HarfBuzz (then send pre-shaped to terminal)
- Or: render to image plane via Kitty graphics for the i18n region

---

## Monospace Fonts for i18n

| Font | Latin | CJK | Arabic | Cyrillic | Emoji | Devanagari |
|------|-------|-----|--------|----------|-------|------------|
| **Noto Sans Mono CJK** | ✓ | ✓ full | ✗ | ✓ | ✗ | ✗ |
| **Source Han Mono** | ✓ | ✓ full | ✗ | ✓ | ✗ | ✗ |
| **Sarasa Mono** | ✓ | ✓ (Iosevka × Han) | ✗ | ✓ | ✗ | ✗ |
| **DejaVu Sans Mono** | ✓ | partial | partial | ✓ | partial | ✗ |
| **Iosevka** | ✓ | partial | ✗ | ✓ | ✗ | ✗ |
| **Cascadia Code Mono** | ✓ | ✗ | ✗ | ✓ | partial | ✗ |
| **Fira Code** | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| **JetBrains Mono** | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |

For multi-script TUIs, configure terminal font fallback explicitly. Kitty supports `font_family` chains. iTerm2 has per-Unicode-block font override.

---

## 369 i18n Rules

1. **UTF-8 only.** Never accept legacy encodings as input without explicit conversion.
2. **Normalize to NFC** before display. Some terminals drop combining marks in NFD form.
3. **Use utf8proc or fish-style wcwidth** for width calculations. Don't trust glibc's wcwidth.
4. **Pre-shape BiDi text** via fribidi or HarfBuzz before emit. Don't rely on terminal BiDi support.
5. **Render complex scripts via image plane** (Sixel / Kitty graphics) when correctness matters.
6. **No emoji on `/369` Web targets** (Rule 6). On TUIs, allow but suffix `U+FE0E` for text variant.
7. **Honor `LANG` and `LC_*`** — they affect more than just translations.
8. **Test multi-script alignment** with a known sample sentence in CJK + Arabic + Latin mixed. If columns misalign, the wcwidth path is broken.

---

## See Also

- [[unicode-art-extended]] — Glyph catalog including full CJK / box-drawing / braille
- [[terminal-capabilities]] — Image protocols (Kitty / iTerm2 / Sixel) for complex-script fallback
- [[tui-patterns]] — Focus management and dialog patterns that interact with IMEs
- [[ascii-tools]] — chafa supports custom-glyph fonts via TTF/OTF loading

---

## Sources

- [Unicode TR11 — East Asian Width](https://www.unicode.org/reports/tr11/)
- [Unicode TR9 — Bidirectional Algorithm](https://www.unicode.org/reports/tr9/)
- [Markus Kuhn — wcwidth](https://www.cl.cam.ac.uk/~mgk25/ucs/wcwidth.c)
- [utf8proc (JuliaStrings)](https://github.com/JuliaStrings/utf8proc)
- [fish-shell wcwidth post](https://fishshell.com/docs/current/index.html)
- [HarfBuzz](https://harfbuzz.github.io/)
- [ICU User Guide](https://unicode-org.github.io/icu/userguide/)
- [fribidi](https://github.com/fribidi/fribidi)
- [Mlterm](http://mlterm.sourceforge.net/)
- [Kitty IME support](https://sw.kovidgoyal.net/kitty/conf/#opt-kitty.ime)
- [IBus](https://github.com/ibus/ibus)
- [Fcitx](https://github.com/fcitx/fcitx5)
- [no-color.org](https://no-color.org/)
- [Noto Sans Mono CJK](https://fonts.google.com/noto/specimen/Noto+Sans+Mono)
- [Source Han Mono (Adobe)](https://github.com/adobe-fonts/source-han-mono)
- [Sarasa Gothic](https://github.com/be5invis/Sarasa-Gothic)
- [Terminal WG BiDi proposal (Microsoft)](https://github.com/microsoft/terminal/issues/538)
- [Unicode Emoji specifications](https://www.unicode.org/reports/tr51/)
