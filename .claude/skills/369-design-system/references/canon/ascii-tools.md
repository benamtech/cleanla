# ASCII / ANSI / Terminal Graphics Tools — Canonical Reference

> **The ecosystem of terminal-art tools spans 50+ years.** From FIGlet banners (1991) and ANSI BBS art (1980s) through modern protocol-aware viewers (chafa, timg, viu) and image-to-SVG terminal recorders (asciinema, termtosvg). This is the canonical reference for what's available, how each tool works, and which to pick for a given job.

This page is loaded when 369 work involves: generating banners, image-to-ASCII conversion, terminal recording for documentation, code screenshots, or selecting the right rendering protocol (Sixel / Kitty / iTerm2 / Unicode mosaic). For Unicode glyph vocabulary, see [[unicode-art-extended]]. For algorithm-level rendering theory, see [[ascii-rendering-algorithms]].

---

## The 21 Tools — Indexed

| # | Tool | Category | Input | Output |
|---|------|----------|-------|--------|
| 1 | FIGlet | Banner generator | Text | Multi-line ASCII letters |
| 2 | TOIlet | Banner + filters | Text | UTF-8 + ANSI color |
| 3 | jp2a | Image → ASCII | JPEG/PNG/WebP | Monochrome or colored ASCII |
| 4 | aalib | Image library | Framebuffer | ASCII via 2×2 lookup |
| 5 | libcaca | Color ASCII library | Image/draw calls | ANSI/HTML/SVG/IRC/PostScript |
| 6 | boxes | Text decoration | Stdin text | Bordered text |
| 7 | cowsay | Speech-bubble art | Text + cowfile | Stylized ASCII |
| 8 | lolcat | Rainbow filter | Stdin text | ANSI 24-bit gradient |
| 9 | asciinema | Session recorder | TTY stream | `.cast` (JSON) |
| 10 | termtosvg | SVG recorder | TTY stream | Animated SVG |
| 11 | svg-term | Cast → SVG | `.cast` file | Animated SVG |
| 12 | Carbon | Code screenshot | Source code | PNG/SVG image |
| 13 | chafa | Image → terminal | JPEG/PNG/GIF/WebP | Sixel/Kitty/iTerm2/Unicode |
| 14 | catimg | Image → terminal | JPEG/PNG/GIF | Unicode + ANSI |
| 15 | viu | Image → terminal | JPEG/PNG/GIF | Kitty/iTerm2/Unicode |
| 16 | pixterm | Image → terminal | JPEG/PNG/GIF/BMP/TIFF/WebP | True-color blocks |
| 17 | timg | Image/video → terminal | Images + video | Sixel/Kitty/iTerm2/WezTerm |
| 18 | aview | Image/video → ASCII | PNM, FLI/FLC | HTML/text/ANSI |
| 19 | img2txt (libcaca) | Image → text | PNG/JPEG/GIF/BMP | ANSI/CACA/UTF8/HTML/SVG |
| 20 | Kitty icat | Image → Kitty term | Most formats | Kitty graphics protocol |
| 21 | aalib-based viewers | Various | Various | ASCII video/image |

---

## Tier 1 — Banner & Decoration

### FIGlet
- **Purpose:** ASCII text banners using multi-line character glyphs
- **Font system:** `.flf` (FIGlet Font) plain-text files
- **Algorithm:**
  1. Parse input text character-by-character
  2. Look up each character's multi-line representation from font
  3. Stitch horizontally
  4. Apply *smushing* rules to reduce inter-character whitespace
- **Spacing modes:** smushing (overlap) / kerning (touch) / full-width
- **i18n:** Control files (`.flc`) for RTL, Hebrew, Cyrillic, Japanese
- **Font format:**
  - Header: `flf2a` signature + hardblank char + height + baseline
  - Lines 32–126 (ASCII printable) represented across 4–10 lines each
  - Endmark chars delimit glyph widths
  - ZIP-compressed `.flf` supported
- **Usage:** `figlet -f standard -c "ADN"`

### TOIlet
- **Why use over FIGlet:** Native ANSI color + decorative filters (border, gay, metal, flip, flop) without ImageMagick dependency
- **Format compat:** Reads `.flf` and proprietary `.tlf` (color-aware)
- **Default output:** UTF-8 + ANSI escape codes
- **Use case:** Colored banners directly to terminal

### cowsay
- **Format:** Perl-source `.cow` files
- **Variables:** `$the_cow` (the art), `$eyes`, `$tongue`, `$thoughts` (`\` for cowsay, `o` for cowthink)
- **Path:** `/usr/share/cowsay/default.cow`
- **Extension ecosystem:** 100+ alternate cowfiles (dragons, turkeys, BSD daemons)

### lolcat
- **Algorithm:** Maps each character's `(line, col)` to a point on the HSL hue wheel, emits 24-bit ANSI escape codes
- **Use:** `cmd | lolcat` for rainbow output (visual flair, not data viz)
- **369 note:** lolcat violates Rule 6 (NO decoration); never pipe production output through it. Acceptable for demos and intro banners only.

### boxes
- **Purpose:** Wrap stdin text with predefined frames
- **Designs:** Stars, dashes, intricate borders, ASCII art borders
- **Bidirectional:** Can also strip box decoration
- **369 alternative:** Use Unicode box-drawing (`┌─┐│└─┘`) inline — see [[ascii-composition]]

---

## Tier 2 — Image → ASCII / Unicode

### jp2a
- **Algorithm:**
  1. Decode image (JPEG/PNG/WebP via libwebp)
  2. Scale to target resolution (WebP gives best quality)
  3. RGB → luminance: `Y = R·0.2989 + G·0.5866 + B·0.1145`
  4. Map luminance to character palette index
- **Default palette:** `" ...',;:clodxkO0KXNWM"` (dark → light, 21 levels)
- **Strength:** Predictable, fast, no dependencies
- **Weakness:** No sub-character detail (one char per source pixel)

### aalib
- **Algorithm:** 2×2 pixel blocks → 4-bit luminance pattern → lookup in precomputed table → output char + attribute
- **Dithering:** Built-in to simulate gradients
- **Applications:** Quake II ASCII mode, MPlayer/VLC/Xine ASCII video
- **Limitation:** Monochrome only (color via libcaca successor)

### libcaca + img2txt
- **Successor to aalib:** Adds color (16 colors, 256 pairs)
- **Output formats:** ANSI, CACA (libcaca native), UTF8, UTF8CR, HTML, HTML3, IRC, BBFR, PostScript, SVG, TGA
- **Dithering modes:** none, ordered2, ordered4, ordered8, random, Floyd-Steinberg
- **Default size:** 60 cols, height auto-computed for aspect ratio
- **Font dimensions:** Default 6×10
- **Integration:** Used by FFmpeg, VLC, MPlayer

### chafa (the modern champion)
- **Why it dominates:** Auto-detects terminal capabilities and picks the best rendering path
- **Protocol cascade:** Sixel → Kitty graphics → iTerm2 inline → Unicode mosaic
- **Inputs:** JPEG, PNG, GIF, BMP, TIFF, WebP, animated GIF
- **Custom glyphs:** Loads TTF, OTF, PCF font files (rare and powerful)
- **Color modes:** Truecolor (24-bit) / 256-color / 16-color / FG-BG only
- **Color spaces:** RGB *or* DIN99d (perceptually uniform — better dithering quality)
- **Transparency:** Alpha support in any color mode
- **Performance:** SIMD-optimized, multithreaded
- **369 default:** When 369 needs to render an image to a terminal, the command is `chafa`. Other tools are special-case.

### viu (Rust)
- **Strength:** Single-binary, no system deps
- **Protocols:** Native iTerm2, Kitty; falls back to lower-half-block `▄` with foreground+background
- **Color:** Truecolor or ansi256 based on `$COLORTERM`
- **Stdin:** Reads image from pipe (useful in shell pipelines)
- **Animated GIFs:** Yes

### pixterm (Go)
- **Algorithm:** ANSI true color + `▄` lower-half-block (so each terminal cell = 2 vertical pixels)
- **Inputs:** JPEG, PNG, GIF, BMP, TIFF, WebP, HTTP/HTTPS URLs
- **Dithering:** Block elements or ASCII characters
- **Parallel:** Uses all CPU cores
- **Requires:** True-color terminal support

### catimg
- **Why:** Tiny C binary, no dependencies, works over SSH
- **Algorithm:** Unicode block characters + ANSI color codes
- **Inputs:** JPEG, PNG, GIF
- **Resolution:** Customizable via `-r`

### timg
- **Most capable image+video viewer:**
  - Kitty Graphics Protocol
  - iTerm2 inline images
  - Sixel
  - WezTerm support
- **Video/animation:** Full playback
- **Grid mode:** Display N images in a grid (browse a folder)
- **Threaded decoding:** Parallel via std::thread
- **Packages:** Debian, Ubuntu, Arch, MX Linux, Raspbian, Void, NixOS, macOS

### aview
- **Audience:** PNM-native, designed to feed Lynx/Links/w3m text browsers
- **Format pipeline:** asciiview wrapper auto-converts via ImageMagick/NetPBM
- **Supported inputs:** pnm, pgm, pbm, ppm, FLI/FLC (Autodesk Animator video)
- **Controls:** Zoom, 3 dithering modes, invert, contrast, brightness, gamma

### Kitty icat
- **Protocol:** Kitty Graphics (native, no fallback)
- **Inputs:** All ImageMagick formats (if installed); otherwise PNG/JPG/GIF/BMP/TIFF/WebP
- **SSH:** Works (image data is base64'd in escape sequences)
- **HTTP URLs:** Yes
- **Placeholder fallback:** Unicode placeholders for nested programs that don't speak Kitty

---

## Tier 3 — Terminal Session Recording

### asciinema
- **Format: asciicast v2 (`.cast`)** — newline-delimited JSON
- **Header (line 1):** JSON object: `version`, `width`, `height`, `timestamp`, `duration`, `command`, `title`, `theme`, `idle_time_limit`
- **Event lines:** `[timestamp, type, data]` arrays
  - `"o"` → output (terminal print)
  - `"i"` → input (user typed)
  - `"m"` → marker (playback navigation)
  - `"r"` → resize (`"{COLS}x{ROWS}"`)
- **Memory model:** Incremental real-time writing — arbitrarily long sessions, constant memory
- **Hosting:** asciinema.org (public) or self-host

### termtosvg
- **Pure Python**
- **Output:** Animated SVG (embeddable on any web page)
- **Theme support:** base16_default_dark, dracula, gjm8, powershell, solarized_dark/light, ubuntu, window_frame, xterm
- **Format compat:** Reads asciicast v1 and v2
- **Use case:** Embed terminal demos in GitHub READMEs, docs sites

### svg-term
- **Node-based; converts asciinema `.cast` → animated SVG**
- **Theme:** Custom or shipped
- **Input:** asciinema cast ID *or* raw file
- **Output:** Shareable SVG (good for blog posts)

### Carbon (carbon-now-sh)
- **Web tool:** https://carbon.now.sh
- **Purpose:** Beautiful code screenshots (NOT terminal recording)
- **CLI:** `carbon-now-cli`
- **Customization:** Syntax theme, background, window theme, font, padding, shadow
- **Export:** PNG, SVG
- **IDE integrations:** VS Code, IntelliJ, Atom, Sublime, Vim, Emacs, Xcode
- **369 caveat:** Carbon's *default* output uses rounded corners + gradients + shadows (Rule 6 violation). Configure with no-shadow, no-radius, white-background presets for 369-compliant screenshots.

---

## Terminal Graphics Protocols — The Cascade

When rendering images, modern tools try protocols in this order. Know which your terminal supports.

| Protocol | Tier | Mechanism | Capable Terminals |
|----------|------|-----------|--------------------|
| **Kitty Graphics** | Best | Base64 PNG/RGB in escape sequence | Kitty, WezTerm, Konsole (partial), Ghostty |
| **iTerm2 Inline** | Best | OSC 1337 + base64 data | iTerm2, WezTerm |
| **Sixel** | Good | 6-pixel-tall bitmap columns | XTerm (patched), mlterm 3.1.9+, foot, contour, WezTerm |
| **Unicode mosaic** | Fallback | Block/braille glyphs + 256-color | All Unicode-capable terminals |
| **ASCII palette** | Universal | Luminance-mapped chars | Everything, including SSH dumb terminals |

### Sixel
- "Six pixels" — 6 vertical pixels per character column
- 64 possible patterns per column (2^6)
- DEC heritage (printers + terminals)
- Color via register selection: `#color_register_number`
- Modern Xterm: patch #359 (2018+) re-enabled support

### Kitty Graphics Protocol
- APC escape sequences carrying base64-encoded image data
- Full 24-bit color, animation, layering, transparency
- Z-index for image stacking
- Direct memory + shared memory transports (faster than base64 for local)

### iTerm2 Inline Image Protocol
- Format: `\033]1337;File=name=foo;size=N;inline=1:base64_data\007`
- Supports any macOS-recognized format (PDF, PICT, PNG, GIF, etc.)
- Animated GIFs since v2.9.20150512
- Works over SSH

### Unicode Mosaic Method (the 369 fallback)
- Lower-half-block `▄` lets one cell represent 2 vertical pixels (different fg/bg colors)
- Quadrant blocks (`▘▝▖▗`) allow 4 sub-cell regions
- Braille `⠀…⣿` allows 2×4 sub-cell regions
- Sextants (`🬀…🬵`) allow 2×3 sub-cell regions
- Octants (newest, U+1CC00 range) allow 2×4 in a single glyph

---

## Color Spaces in Terminal Tools

| Color Space | Used By | Property |
|-------------|---------|----------|
| **RGB** | Almost everything | Direct device mapping; 16.7M colors at 24-bit |
| **DIN99d** | chafa | Perceptually uniform — much better gradients via dithering |
| **CIELAB** | Some quantizers | Perceptual; high-quality palette generation |
| **HSL/HSV** | lolcat, decorative tools | Hue cycling, not for accurate rendering |

DIN99d is *the* reason chafa's dithered output looks visibly smoother than libcaca's RGB-based output. If image quality matters and chafa is available, use it.

---

## ANSI Color Modes

| Mode | Bits | Colors | Compatibility |
|------|------|--------|----------------|
| 16-color | 4 | 8 normal + 8 bright | Every terminal since 1990 |
| 256-color | 8 | 16 ANSI + 6×6×6 cube + 24 greys | Every modern terminal |
| Truecolor (24-bit) | 24 | 16.7M | All modern terminals (check `$COLORTERM=truecolor`) |
| FG/BG only | 0 (binary) | Foreground + background only | Even dumb TTYs |

Detect from environment:
```bash
$COLORTERM == "truecolor" || "24bit"  → 24-bit RGB
$TERM == "*-256color"                 → 256-color
$TERM == "dumb"                       → no color
echo $NO_COLOR is set                 → user opt-out, disable all color
```

---

## Picking the Right Tool — Decision Tree

```
Need a banner / title?
  └─ FIGlet (mono) or TOIlet (color)
Need an image in a terminal?
  ├─ Modern terminal? → chafa or timg (auto-detects protocol)
  ├─ SSH session?     → catimg or chafa (Unicode fallback)
  ├─ Lynx/w3m?        → aview (text-browser-aware)
  └─ Code? Not an image. Use Carbon for screenshot.
Need to record a terminal session?
  ├─ Shareable as web embed? → asciinema → termtosvg or svg-term
  ├─ Direct SVG output?      → termtosvg
  └─ Code highlighting?      → Carbon (static, not animated)
Need decorative wrapping (boxes around text)?
  └─ Skip boxes — write Unicode box-drawing inline. See [[ascii-composition]]
```

---

## 369 Tool-Adoption Notes

- **FIGlet/TOIlet:** Acceptable for 369 banners *if* the font is monospace, no extra decoration is applied, and color uses the 369 palette tokens. Avoid `gay`, `metal`, `flip` filters.
- **chafa:** First-class — pair it with `medium: 'terminal'` engine output for image-in-TUI workflows.
- **asciinema + termtosvg:** Use these to record TUI demos for the design-system docs. Standard format is asciicast v2 → termtosvg SVG, no theme customization (the SVG inherits TTY colors).
- **Carbon:** Acceptable *only* with no-radius, no-shadow, navy-white preset. Default Carbon output violates Rule 2 (border-radius), Rule 6 (decoration), Rule 5 (palette).
- **lolcat, cowsay, boxes:** Never in production. Acceptable in personal scratch scripts only.

---

## Image Conversion Algorithm Summary

### jp2a (luminance map)
```
for each pixel-block in scaled-image:
    L = 0.2989·R + 0.5866·G + 0.1145·B
    char = palette[ floor(L / 256 * len(palette)) ]
    emit(char)
```

### aalib (2×2 lookup)
```
for each 2x2 block in framebuffer:
    pattern = quantize(block)  # 4D vector of 4 luminances
    (char, attr) = lookup_table[pattern]
    emit(char, attr)
```

### chafa (Unicode mosaic with DIN99d)
```
for each cell-region in image:
    candidates = subset_of_supported_glyphs_for_quality_target
    for glyph in candidates:
        cost = perceptual_distance_DIN99d(cell, glyph_render)
        track best
    emit(best.char, best.fg, best.bg)
```

See [[ascii-rendering-algorithms]] for full algorithmic detail.

---

## See Also

- [[ascii-composition]] — Engine algorithms for charts, sparklines, tables, layouts (the 369-native rendering vocabulary)
- [[unicode-art-extended]] — Complete Unicode glyph catalog (block elements, box drawing, braille, sextants, geometric shapes, dingbats, symbols)
- [[tui-design]] — Terminal rendering model, framework archetypes (Textual/Ratatui/Bubbletea), Elm Architecture
- [[unix-cli-principles]] — ESR's 17 rules, CLIG principles, output design patterns
- [[ascii-rendering-algorithms]] — Image-to-ASCII algorithm theory (luminance, shape vectors, dithering)
- [[ascii-ansi-art]] — BBS scene history, ANSI/PETSCII/teletext, art group archives
