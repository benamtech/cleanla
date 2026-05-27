# Banner Fonts + Tooling — Complete Enumeration

> **~3,000 named ASCII banner fonts catalogued across 8 systems.** FIGlet (500+ standard), TOIlet (150+ color variants), patorjk's TAAG (1,100+ web-hosted), cowsay (50+ animals), ponysay (1,000+ ponies), boxes (40+ frame designs), TheDraw .TDF (demoscene), plus language-port variants (pyfiglet, figlet-js, gofiglet, figlet-rs). Load when picking a banner-font for 369 output or implementing font conversion.

For tool-level overview, see [[ascii-tools]]. For glyph-level vocabulary, see [[unicode-art-extended]].

---

## FIGlet — The Canonical System

**Site:** figlet.org · **Source:** github.com/cmatsuoka/figlet · **License:** New BSD

### `.flf` Font Format Spec

**Header line** (e.g., `flf2a$ 8 6 5 -1 0`):
- `flf2` magic
- `a` print-direction sentinel
- `$` hardblank character (placeholder)
- Height, baseline, max-width, old-layout, comment-lines, print-direction, code-tag-count, codepage-count

**Body:**
- Character lines (8–15 rows per glyph)
- Endmark character delimits per-line width
- ASCII printable 32–126; optional code-tagged extensions for Unicode

### Smushing modes (horizontal compression rules)
1. **Equal-character** — overlap identical adjacent characters
2. **Underscore** — overlap underscore with preceding glyph
3. **Hierarchy** — priority-based overlap (`|` > `\` > `/`)
4. **Opposite-pairs** — `<>` → `|`, `{}` → `||`, `[]` → `||`
5. **Big-X** — `/\` → `X`
6. **Hardblank** — only the hardblank character
7. **Kerning** (-1 mode) — full-width glyphs without overlap

### Compression + i18n
- **`.flc` files** — character mapping (codepage metadata) for international fonts
- **UTF-8** — supported post-2.2.4 via `code-tag-count` header field
- **`.zip` archives** — bundle multiple .flf fonts

### Command syntax
```bash
figlet [options] [text]
  -f <font>      Font (e.g., 'slant', 'banner')
  -c             Center output
  -t             Set width to terminal width
  -k             Enable kerning
  -w <width>     Custom output width
  -p             Print directory info
  -l             List installed fonts
  -m <mode>      Smushing mode (0-127 numeric)
  -j             Left/center/right justify
```

---

## Standard FIGlet Font Catalog (~500 fonts)

### Most-used (30 fonts)
`standard` `slant` `big` `banner` `block` `bubble` `digital` `ivrit` (Hebrew RTL) `lean` `mini` `mnemonic` `script` `shadow` `small` `smscript` `smshadow` `smslant` `smtengwar` `term` `thick` `thin` `whimsy` `gothic` `isometric1` `isometric2` `doom` `3-d` `alligator` `banner3` `big-money`

### Geometric / 3D (50+)
`3-d` `3d-ascii` `3ducking` `3d-diagonal` `gradient` `isometric1–4` `perspective` `pyramid` `relief` `reverse` `rotate` `rotated` `rotated-180`

### Script / decorative (60+)
`script` `smscript` `cursive` `cursive-fonts` `flowing` `swamp` `graffiti` `calligraphic` `gothic` `caligraphy` `art` `artistic` `decorative` `ornate` `fancy` `flourish` `demi` `diamond` `emboss` `roman` `runic` `alien` `cybersmall` `cyberlarge` `cybermono`

### Minimal / compact (40+)
`mini` `mini-small` `minix` `tiny` `thin` `term` `term-small` `small` `small-slant` `smslant` `smtengwar` `slide` `sparse` `spaced` `spooky` `stencil` `stencil1` `stencil2`

### Retro / gaming (30+)
`doom` `doomsmall` `doomtiny` `dos` `dosreb` `drpepper` `figlet-note` `futurist` `ntgreek` `georgie` `helvbold` `highlight` `hilite-bold` `hilite-italic` `hilite-small` `hilite-thin`

### International / language-specific (50+)
`ivrit` (Hebrew RTL) `cyrillic` `greek` `greek-large` `greek-small` `hebrew` `hebrew-small` `katakana` `japanese` `korean` `russian` `tengwar` (Tolkien Elvish) `runic` `runes`

### ASCII-art themed (40+)
`animal` `aquaplay` `banner-wave` `banner3d` `block-wave` `bowtie` `broken` `broadway` `broken-bold` `broken-shadow` `colossal` `colossal-shadow` `colossal-bold` `cosmic` `cosmicsmall`

### Specialized (50+)
`bubble` `bubbles` `bulbhead` `bush` `catwalk` `chess` `chunky` `chalkboard` `claptrap` `colossal` `compact` `crt` `contorted` `contrast` `corroded` `crash` `crawford` `crazy` `creep` `croft` `cryptogram` `crypto` `dark` `deadly` `decimal` `def-leppard` `deli` `diamond` `dietcola` `ding-dong`

### Extended (200+ additional fonts)
The figlet-fonts repository (github.com/xero/figlet-fonts) hosts the largest community-curated archive — ~600 individual fonts across all themes including `epic` `evanescent` `evil` `expansion` `extended` `firewall` `fitness` `fizzy` `fortune` `frosty` `goofy` `gradient` `hexagon` `holiday` `industrial` `juice` `jumble` `karate` `katakana` `keyboard` `knockout` `larry3d` `lcd` `lean` `letters` `lockergnome` `madrid` `manhattan` `marble` `mayhem` `medieval` `mike` `military` `minimal` `mirror` `moose` `morse` `morse2` `moscow` `mountain` `nancyj` `nipples` `ogre` `oldstyle` `pacos` `pawnstars` `peaks` `pebbles` `peg` `pyramid` `quagmire` `radioactive` `rampage` `random` `raptor` `rectangles` `red` `redphoenix` `relief` `relief2` `roman` `rounded` `rowancap` `rozzo` `runic` `runyc` `sansserif` `santaclara` `script` `serifcap` `shadow` `shelle` `short` `silly` `slant` `slide` `slscript` `small` `smallcaps` `smashed` `smbraille` `smisome1` `smkeyboard` `smpoison` `smshadow` `smslant` `smtengwar` `smusha` `snake` `snorlax` `space-op` `sparse` `speed` `spliff` `s-relief` `stacey` `stampatello` `standard` `starstrips` `starwars` `stealth` `stelin` `stforek` `stop` `straight` `studio` `sub-zero` `subteran` `sunken` `swampland` `swan` `sweet` `swing` `tank` `tanja` `taxi-driver` `tengwar` `term` `terrace` `test1` `thick` `thin` `threepoint` `ticks` `tickslant` `tiles` `time` `tinker-toy` `tombstone` `train` `trash` `trek` `triplem` `tsalagi` `tube` `twin-cob` `twinkle` `twiztid` `type` `ugalympic` `unarmed` `uppermark` `usaflag` `varsity` `vela` `vortron` `wavy` `weird` `wide` `wingfunk` `wow` `wupper` `xbrite` `xbriteb` `xbritebi` `xbritei` `xchartr` `xcourb` `xcourbi` `xhelvbi` `xsbook` `xtimes` `xtty` `yie-arnk` `yie_ar_k` `young-poison` `zig-zag` `zone` `zozo`

---

## TOIlet — FIGlet Extensions with Color

**Source:** github.com/cacalabs/toilet · **License:** WTFPL

### Extensions over FIGlet
- **`.tlf` color format** — embeds ANSI color codes in font files; back-compatible with `.flf`
- **Native UTF-8** — full Unicode (CJK, Cyrillic, etc.)
- **Filter system** — post-processing effects:
  - `border` — frame with box-drawing characters
  - `gay` — rainbow ANSI color cycling
  - `metal` — darkened metallic effect
  - `flip` — vertical flip
  - `flop` — horizontal flip
  - `crop` — remove excess whitespace
  - `big` — enlarge by factor
  - `smush` — compress spacing
- **Inline ANSI** — terminal renders TOIlet output as colored directly

### Command syntax
```bash
toilet [options] [text]
  -f <font>      Font selection
  -F <filter>    Apply filter (gay, metal, flip, flop, crop, big, smush)
  -w <width>     Output width
  -t             Terminal mode (UTF-8)
  -c             Center
  -d <dir>       Font directory
```

### Color font distribution
~150 `.tlf` fonts. Many `<name>-color` variants of FIGlet base fonts: `standard-color`, `slant-color`, `banner-color`, `gothic-color`, `doom-color`, `shadow-color`, etc.

**369 status:** Acceptable for 369 banners if filters are NOT applied. `gay`, `metal`, `flip` violate Rule 6 (no decoration). Plain colored output is fine.

---

## patorjk.com TAAG — 1,100+ Web-Hosted Fonts

**URL:** patorjk.com/software/taag

### Font categories
| Category | Approximate count |
|----------|---------|
| Standard | 50 |
| Banner styles | 80 |
| 3D / perspective | 60 |
| Cursive / script | 70 |
| Decorative | 100 |
| Specialty (animals, starships, weather, holiday) | 200+ |
| Small / compact | 150 |
| Graffiti / street | 80 |
| Retro / gaming | 90 |
| International | 120 |

### Features
- Web UI with live preview
- Export: text, HTML, PNG, SVG
- Font search + categorization
- No installation required
- REST API available (undocumented; community-reverse-engineered)

---

## Language Ports

| Port | Repo | Maintainer | Notes |
|------|------|------------|-------|
| **pyfiglet** v1.0.4 (Aug 2025) | pypi.org/project/pyfiglet | Peter Waller | Pure Python; identical output to C FIGlet; Python 3.7+ |
| **figlet-js / figlet** (npm) | npmjs.com/package/figlet | astrocadents | Browser + Node; async font loading |
| **gofiglet** | github.com/ysugimoto/figlet | ysugimoto | Pure Go; embedded fonts |
| **figlet-rs** | crates.io/crates/figlet-rs | community | Native Rust |
| **figlet (Ruby)** | github.com/Aupajo/figlet-ruby | Aupajo | Ruby gem |

### Python usage
```python
from pyfiglet import Figlet
figlet = Figlet(font='banner')
print(figlet.renderText('Hello'))
```

### Node.js usage
```javascript
const figlet = require('figlet');
figlet('Hello', (err, data) => console.log(data));
```

---

## Speech Bubble + Character Generators

### cowsay (Perl, v3.8.4, Dec 2024)
- **Source:** github.com/cowsay-org/cowsay
- **License:** GPL-3.0
- **Maintainer:** Andrew Janke
- **`.cow` format** — Perl source assigning ASCII art to `$the_cow`, with `$thoughts`, `$eyes`, `$tongue` variables
- **50+ built-in animals:** cow, dragon, turkey, skeleton, daemon, elephant, sheep, tux, kitten, koala, moofasa, hellokitty, beavis, vader, etc.
- **Community packs:** GitHub repos with hundreds more cowfiles
- **Install:** `brew install cowsay` or `apt install cowsay`

```bash
cowsay "Hello!"
echo "Fortune says..." | cowsay -f dragon
fortune | cowsay -f tux
```

### ponysay
- **Source:** github.com/erkin/ponysay
- **License:** GPL-3.0
- **Format:** Extended `.cow` with My Little Pony characters
- **Catalog:** ~1,000 pony designs (every named MLP character, multiple poses each)

### boxes (Thomas Jensen)
- **Source:** github.com/ascii-boxes/boxes
- **License:** GPL-3.0
- **Function:** Wrap text in ASCII frames
- **Designs:** 40+ predefined (`stone`, `headline`, `c`, `cc`, `simple`, `parchment`, `dog`, `boy`, `cat`, `mouse`, etc.)
- **Bidirectional:** can also strip box decoration
- **Use case:** Wrap text + headers in shell scripts

```bash
echo "Wrapped text" | boxes -d simple
echo "Comment block" | boxes -d c
```

### lolcat
- **Source:** github.com/busyloop/lolcat
- **License:** BSD
- **Function:** Rainbow ANSI color filter
- **Algorithm:** maps each `(line, col)` to a point on HSL hue wheel; emits 24-bit color escapes
- **369 status:** Decorative-only; Rule 6 violation in production. Acceptable for personal scripts.

```bash
cmd | lolcat
```

### xcowsay
- **GUI cowsay** — desktop speech-bubble overlay
- Not a TUI tool

### Modern alternatives
- **figlet-cli** — newer CLI wrapper with modern UX
- **chalk-figlet** — Node.js figlet + chalk colors
- **rust-figlet** — Rust port

---

## Demoscene / BBS-Era Banner Systems

### TheDraw (Ian E. Davis, 1986–93)
**`.TDF` file format:**
- Multi-character font specification stored in proprietary binary
- ANSI color attributes per glyph
- Variable-width characters
- Letter spacing metadata
- Up to 100-row glyphs (vs FIGlet's ~10)
- Reads any pre-defined font from a `.TDF` library
- ZipFlash compression supported in later versions

### PabloDraw fonts
- Open-source `.TDF`-compatible font system
- Cross-platform (macOS/Windows/Linux)
- Real-time multi-user collaborative editing

### Moebius custom fonts
- XBIN format support
- Embedded fonts in `.XB` files
- 8×8 + 8×16 glyph dimensions
- Half-block brush rendering

### Topaz (Amiga)
- Classic Amiga BBS font
- Reproduced in many modern emulators
- 8×8 monospaced fixed-width
- Iconic 1990s-Amiga BBS aesthetic
- Source: pre-installed in PabloDraw, ansilove

### CP437 fonts
- IBM PC's original character set
- 256 glyphs (0x00–0xFF)
- Box-drawing + block elements + math + Greek
- See [[unicode-art-extended]] for full breakdown

---

## Comparative Feature Matrix

| Tool | Output | Color | Filters | Format | Modern? |
|------|--------|-------|---------|--------|---------|
| FIGlet | Mono text | No | No | `.flf` | Active |
| TOIlet | ANSI text | Yes | Yes (6) | `.tlf` + `.flf` | Active |
| pyfiglet | Mono text | Via wrap | No | `.flf` | Active |
| figlet-js | Mono text | Via chalk | No | `.flf` | Active |
| TAAG (web) | HTML/PNG/SVG | Yes | Style | Web only | Active |
| cowsay | Speech bubble | No | No | `.cow` | Maintained |
| ponysay | Speech bubble | Yes | No | `.cow` | Maintained |
| boxes | Frames | No | No | Built-in | Maintained |
| lolcat | Rainbow filter | Yes (24-bit) | N/A | Stream-filter | Active |
| TheDraw | ANSI banner | Yes | No | `.TDF` | Legacy (Dos) |
| PabloDraw | ANSI banner | Yes | No | `.TDF` | Active |
| Moebius | ANSI banner | Yes | No | `.XB` | Active |

---

## 369 Banner-Font Recommendations

### Default choices
- **Production banner** — `figlet -f standard -c` (clean, predictable, monospace)
- **Header / title** — `figlet -f slant -c` (subtle emphasis without decoration)
- **Demo/showcase** — `figlet -f banner -c` (heavier weight; acceptable for full-screen displays)
- **Compact label** — `figlet -f small -c` (when vertical space is tight)
- **No FIGlet available** — `toilet -f future -t` (UTF-8 fallback)

### Acceptable
- `block`, `digital`, `mini`, `term`, `thin`, `lean`

### Avoid (Rule 6 violations — decoration)
- `gothic`, `script`, `cursive`, `whimsy`, `swampland` — too decorative
- `3-d`, `isometric1/2`, `relief`, `emboss` — fake depth/shadow
- Any TOIlet filter (`gay`, `metal`, `flip`) — decoration

### Color rules
- If using TOIlet — restrict palette to 369 tokens (`#001089` navy, `#FFFFFF` white, `#999999` grey, `#f8eac7` manila)
- Never use rainbow / multi-hue filters
- `lolcat` is forbidden in production output

---

## See Also

- [[ascii-tools]] — Tool-level catalog including FIGlet/TOIlet
- [[unicode-art-extended]] — Glyph vocabulary that builds these fonts
- [[ascii-ansi-art]] — Cultural context for TheDraw / PabloDraw / Moebius
- [[ascii-rendering-algorithms]] — Image-to-ASCII when banner isn't enough

---

## Sources

- figlet.org — official site + man page
- github.com/cmatsuoka/figlet — FIGlet source
- github.com/xero/figlet-fonts — community font collection
- github.com/cacalabs/toilet — TOIlet source
- patorjk.com/software/taag — TAAG web tool
- pypi.org/project/pyfiglet — Python port
- npmjs.com/package/figlet — Node.js port
- github.com/ysugimoto/figlet — Go port
- crates.io/crates/figlet-rs — Rust port
- github.com/cowsay-org/cowsay — cowsay
- github.com/erkin/ponysay — ponysay
- github.com/ascii-boxes/boxes — boxes
- github.com/busyloop/lolcat — lolcat
- TheDraw v4.63 documentation (Ian E. Davis, 1993)
- PabloDraw — github.com/cstrahan/pablodraw
- Moebius — github.com/blocktronics/moebius
- Ansilove — github.com/ansilove/ansilove (TheDraw font conversion)
