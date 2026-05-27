# ASCII Rendering Algorithms — Theory and Practice

> **Image → text conversion is a perceptual-mapping problem.** Six decades of accumulated craft sit behind the choice of "which character to emit for which pixel?" This page is the canonical reference for the algorithms — luminance mapping (jp2a), shape vectors and k-d tree lookup (alexharri's modern approach), 2×2 block lookup (aalib), perceptually uniform color spaces (DIN99d in chafa), Halaster's 12-step shading, and the dithering family (Floyd-Steinberg, Atkinson, Sierra, Bayer, Riemersma). Load this when implementing a custom ASCII renderer, building a `medium: 'terminal'` engine path that processes raster input, or auditing the output of a tool like jp2a / chafa / libcaca.

For the *tools* that ship these algorithms, see [[ascii-tools]]. For the glyph vocabulary they emit, see [[unicode-art-extended]]. For the BBS-era manual techniques these algorithms automated, see [[ascii-ansi-art]].

---

## The Core Problem

Given a raster image (a grid of RGB or grayscale pixels) and a target terminal canvas (W columns × H rows), output a 2D grid of (character, fg-color, bg-color) tuples that:
1. Approximates the image's brightness distribution
2. Preserves edges and important structure
3. Fits the target terminal's color depth (16 / 256 / 24-bit)
4. Renders the same way every time on a given font

Three sub-problems:
- **Brightness mapping** — translate luminance to a glyph
- **Color quantization** — translate RGB to terminal palette
- **Dithering** — distribute quantization error spatially

---

## Algorithm 1 — Luminance Mapping (jp2a, traditional)

The classical approach. Used by jp2a, FIGlet image-to-figlet converters, asciiart.eu's online tools, and most "ASCII art generators" from 2000–2010.

### Step 1 — RGB → luminance

The ITU-R BT.601 weighted formula:
```
Y = 0.299·R + 0.587·G + 0.114·B
```

Older formula (jp2a uses):
```
Y = 0.2989·R + 0.5866·G + 0.1145·B
```

Both are weighted toward green because human vision is most sensitive to green wavelengths. Result is a single scalar 0–255 (or 0–1).

### Step 2 — Glyph palette

A monotonic palette of N characters, ordered by visual density:
```
"  .,:;ox%#@"     (11 levels, simple)
" .'`,^:\"<+!-_  ?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
                  (65 levels, jp2a default, fine-grained)
```

The 369-recommended palette for `medium='terminal'`:
```
" ░▒▓█"           (5 levels — single shade ramp, language-agnostic)
" .,:;coxOXM@"    (11 levels — ASCII-portable)
```

### Step 3 — Index lookup
```
char = palette[floor(Y / 256 * len(palette))]
```

### Step 4 — Aspect correction

Terminal cells are **roughly 2× taller than wide** (typical monospace fonts). Without correction, output is vertically stretched.

```
# Sample twice as many image rows per output row
output_height = image_height // (2 * cell_aspect_ratio)
```

Or use the lower-half-block trick (see Algorithm 3).

### Limitations of pure luminance mapping
- No color. Or color is approximated post-hoc by sampling source pixel and emitting nearest ANSI.
- No edge detection. A sharp edge becomes a smooth gradient if the underlying luminance is smooth.
- Sensitive to font metrics — the same character is denser in DejaVu than in Courier.

---

## Algorithm 2 — 2×2 Block Lookup (aalib, libcaca)

aalib's strategy: don't map *one* pixel to *one* glyph. Map a 2×2 *block* to a glyph.

### Step 1 — Pre-compute the lookup table

For each character in the candidate set (e.g., 95 printable ASCII):
- Render the glyph at the font's resolution
- Sample as 4 sub-cells (top-left, top-right, bottom-left, bottom-right)
- Each sub-cell gets a luminance value
- Store the 4D vector `(LTL, LTR, LBL, LBR)` indexed by character

Result: 95 vectors in 4D space, each representing how the glyph's brightness is distributed across its quadrants.

### Step 2 — For each 2×2 source block

Compute the source block's 4D vector. Find the candidate character whose vector is nearest (Euclidean distance):
```
char = argmin_c |source_vector - glyph_vector[c]|
```

### Step 3 — Apply dithering

Carry the residual error to neighboring blocks (Floyd-Steinberg or similar).

### Why this is better than luminance mapping
- **Captures sub-cell structure** — a diagonal edge in a 2×2 block selects a `/` not a `+`
- **Effectively doubles spatial resolution** — output reads finer than input rows × cols
- **Handles edges naturally** — the algorithm picks characters that *look like* the edge direction

### Implementation cost
- Lookup table: ~400 floats (95 chars × 4 components × float)
- Per-block: 4 multiply-add + 95-distance-compare → ~600 ops
- aalib uses precomputed 4-bit quantized vectors → table lookup, not distance compute

---

## Algorithm 3 — Half-Block Color Doubling (modern image viewers)

The technique that built ANSI art: use `▄` (lower-half block) to put 2 colored pixels per terminal cell.

```
for y in range(0, image_height, 2):
    for x in range(image_width):
        upper_color = pixel(x, y)
        lower_color = pixel(x, y+1) if y+1 < image_height else BLACK
        # Foreground = lower (because ▄ fills the lower half)
        # Background = upper
        emit_cell('▄', fg=lower_color, bg=upper_color)
```

**Effect:** Vertical resolution becomes (rows × 2), matching column aspect ratio.

**Used by:**
- pixterm
- viu (fallback path when Kitty/iTerm2 not available)
- catimg (option `-r 2`)
- chafa with `--symbols vhalf`

**Refinement — quadrant doubling:** Use `▘▝▖▗▙▚▛▜▟▞▌▐▀▄` (16 quadrant patterns) → each cell holds 4 pixels arranged 2×2. Doubles both axes simultaneously.

```
quadrant_chars = ['  ', '▘', '▝', '▀',
                  '▖', '▌', '▞', '▛',
                  '▗', '▚', '▐', '▜',
                  '▄', '▙', '▟', '█']

bits = (TL << 3) | (TR << 2) | (BL << 1) | BR
char = quadrant_chars[bits]
```

This achieves the maximum spatial resolution attainable with a single character cell at 2 colors.

---

## Algorithm 4 — Modern Shape-Vector Matching (alexharri's 6D approach)

Reference: alexharri.com/blog/ascii-rendering

The state-of-the-art approach for high-fidelity black-and-white ASCII rendering.

### Step 1 — Compute a 6D shape vector for each glyph

For each candidate character, render at high resolution then compute:

```
v = (
    total_brightness,          # 0-D: mean luminance
    horizontal_gradient,       # 1-D: ∂L/∂x summed
    vertical_gradient,         # 1-D: ∂L/∂y summed
    horizontal_centroid,       # x-coord of brightness center of mass
    vertical_centroid,         # y-coord of brightness center of mass
    diagonal_skew,             # quadrant brightness imbalance
)
```

Each glyph becomes a point in 6D space.

### Step 2 — Build a k-d tree over glyph vectors

The k-d tree allows O(log N) nearest-neighbor lookup at render time.

### Step 3 — For each source patch

Compute the source patch's 6D vector at the same resolution. Query the k-d tree for the nearest glyph.

### Step 4 — Optional supersampling

Render source at 2× or 4× and downsample the 6D vector for better quality at the cost of compute.

### Step 5 — Contrast enhancement (optional)

Apply unsharp masking before the vector computation to boost edge detection.

### Why this approach wins
- **Edge orientation captured:** horizontal_gradient + vertical_gradient distinguish `/`, `\`, `|`, `_`
- **Center of mass captures position:** `.` (low) vs `'` (high) emerge naturally
- **Skew captures asymmetric glyphs:** `<` vs `>` differ in the diagonal_skew component
- **k-d tree makes it real-time:** Sub-millisecond per patch on modern hardware

### GPU implementation
The k-d tree can be flattened to a 2D texture and queried in a fragment shader. alexharri's demo runs in WebGL, rendering ASCII over a video stream in real-time.

---

## Algorithm 5 — Perceptual Color Quantization (chafa, DIN99d)

The problem chafa solves: when reducing 24-bit RGB to a 256-color palette, RGB distance gives poor matches because **human perception of color is non-linear**. A `#FF0000 → #FE0000` step is invisible; a `#000080 → #000060` step is huge.

### DIN99d color space

Linear transformation of CIELAB optimized for uniform perceptual distance:
```
L99d = 105.51 · log(1 + 0.0158 · L*)
a99 = cos(16°) · a* + sin(16°) · b*    (rotated)
b99 = -sin(16°) · a* + cos(16°) · b*
a99d = a99 · 0.83
b99d = b99 · 0.83
```

Distance in DIN99d is approximately perceptually uniform — a step of 1.0 looks roughly the same magnitude regardless of where in color space.

### chafa's algorithm

For each cell of source image:
1. Compute the cell's average RGB
2. Convert to DIN99d
3. For each candidate (glyph + fg + bg) triple in the target palette:
   - Render what the cell *would look like* with that triple
   - Convert that rendering to DIN99d
   - Compute distance
4. Emit the lowest-distance triple

### Why this is better
- Smooth gradients render smoothly (the dithering "sees" perceptual distances, not RGB ones)
- Skin tones look like skin tones (RGB-distance quantization often shifts to green or magenta)
- Anti-aliasing from the source preserves into the output

### Cost
- Pre-quantize palette to DIN99d once (256 conversions)
- Per cell: 2 conversions (cell + each candidate triple) + N distance computes
- chafa uses SIMD for parallel candidate evaluation

---

## Algorithm 6 — Halaster's 12-Step Shading (BBS scene, manual)

The classical hand-drawn ANSI art shading method, from Sam Roy's roysac.com.

A 12-level luminance gradient using combinations of CP437 blocks + foreground/background color pairs.

### The 12 steps

| Step | Foreground | Background | Glyph |
|------|------------|------------|-------|
| 1 | — | — | (blank space) |
| 2 | dim-gray | black | `░` |
| 3 | dim-gray | black | `▒` |
| 4 | dim-gray | black | `▓` |
| 5 | gray | black | `░` |
| 6 | gray | black | `▒` |
| 7 | gray | black | `▓` |
| 8 | gray | black | `█` |
| 9 | bright-white | black | `░` |
| 10 | bright-white | black | `▒` |
| 11 | bright-white | black | `▓` |
| 12 | bright-white | black | `█` |

For colored shading, replace gray with the hue family (e.g., red dim → red mid → red bright + the four block characters).

### Why it works as a 12-step ramp
- Each block character (`░ ▒ ▓ █`) covers ~25/50/75/100% of a cell at its foreground color
- Three brightness levels of foreground (dim / mid / bright) on a fixed dark background
- 3 brightness × 4 block-fill = 12 luminance levels in monochrome
- For color: 12 levels per hue × 8 hues = 96-level color shading

### When this matters
- Building a manual ASCII art editor's brush palette
- Implementing a "scene-authentic" image converter
- Reverse-engineering a 1990s ANSI artwork
- Choosing a smooth gradient palette for terminal heatmaps (369 uses a simplified 4-step `░▒▓█`)

---

## Algorithm 7 — Dithering (error diffusion)

Dithering = redistribute the quantization error from a pixel to its neighbors so the *average* over a region matches the true value, even though no individual pixel can. Critical for low-bit-depth output (which terminal output always is).

### Floyd-Steinberg (the default)

```
for each pixel in row-major order:
    old_pixel = pixel[x,y]
    new_pixel = quantize(old_pixel)
    pixel[x,y] = new_pixel
    err = old_pixel - new_pixel
    
    pixel[x+1, y]   += err * 7/16
    pixel[x-1, y+1] += err * 3/16
    pixel[x,   y+1] += err * 5/16
    pixel[x+1, y+1] += err * 1/16
```

**Properties:** Smooth, generic, low-cost. Default for jp2a, libcaca, chafa.

**Coefficient diagram:**
```
        ·   ·   ·
        ·   X  7/16
       3/16 5/16 1/16
```

### Atkinson (Apple Macintosh, 1984)

```
pixel[x+1, y]   += err * 1/8
pixel[x+2, y]   += err * 1/8
pixel[x-1, y+1] += err * 1/8
pixel[x,   y+1] += err * 1/8
pixel[x+1, y+1] += err * 1/8
pixel[x,   y+2] += err * 1/8

(Total: 6/8 — note this LOSES 25% of the error → higher contrast)
```

**Properties:** High contrast, "punchy" look. Fewer mid-tones. Distinctive Mac/MacPaint aesthetic. Loses 1/4 of the error each step.

### Sierra (and Sierra Lite)

Sierra full:
```
        ·   ·   X  5/32 3/32
       2/32 4/32 5/32 4/32 2/32
        ·  2/32 3/32 2/32  ·
```

Sierra Lite (faster, comparable quality):
```
        ·   X  2/4
       1/4 1/4  ·
```

**Properties:** Sharper than Floyd-Steinberg at similar cost.

### Bayer ordered (matrix-based)

No error diffusion. A precomputed threshold matrix decides each pixel based on its position modulo matrix size.

4×4 Bayer matrix (values 0–15):
```
 0  8  2 10
12  4 14  6
 3 11  1  9
15  7 13  5
```

Threshold: `quantize(pixel) = pixel + matrix[y%4][x%4] * (range / 16)`

**Properties:**
- Visible pattern at close range (the "retro look")
- Trivial cost (no error propagation)
- Deterministic and stateless — same input → same output (369 Rule 8 friendly)
- Often the *best* choice for terminal output when speed and determinism matter more than smoothness

8×8 Bayer matrix gives finer gradations:
```
 0 32  8 40  2 34 10 42
48 16 56 24 50 18 58 26
12 44  4 36 14 46  6 38
60 28 52 20 62 30 54 22
 3 35 11 43  1 33  9 41
51 19 59 27 49 17 57 25
15 47  7 39 13 45  5 37
63 31 55 23 61 29 53 21
```

### Riemersma dithering (modified Hilbert curve)

Uses a Hilbert space-filling curve to traverse the image, propagating error along the curve rather than row-by-row. **Locality-preserving** — avoids the diagonal artifacts that Floyd-Steinberg can produce.

Rare in practice; used by ImageMagick's `-dither Riemersma`.

### Comparison

| Algorithm | Smoothness | Speed | Contrast | Determinism |
|-----------|-----------|-------|----------|-------------|
| None (quantize only) | poor | fastest | full | yes |
| Floyd-Steinberg | excellent | fast | moderate | yes |
| Atkinson | good | fast | high | yes |
| Sierra | very good | fast | moderate | yes |
| Bayer 4×4 | OK (patterned) | fastest | moderate | yes |
| Bayer 8×8 | good (patterned) | fastest | moderate | yes |
| Riemersma | excellent | medium | moderate | yes |

**369 recommendation:** Floyd-Steinberg for general use. Bayer 8×8 when the same image must render identically across sessions (deterministic by construction). Atkinson when retro aesthetic is desired.

---

## Algorithm 8 — Edge Detection + Stroke Mapping

For high-quality ASCII line art (not photographic renderings), edge detection beats luminance mapping.

### Step 1 — Apply edge detector

Sobel kernels:
```
Sx = [-1 0 1;   Sy = [-1 -2 -1;
      -2 0 2;          0  0  0;
      -1 0 1]          1  2  1]

magnitude = sqrt(Gx² + Gy²)
angle = atan2(Gy, Gx)
```

### Step 2 — Map angle to glyph

```
0°   → ─
22°  → _ or .
45°  → /
67°  → ´
90°  → |
135° → \
180° → ─
```

Plus a magnitude threshold → blank if edge too weak.

### Use case
- Diagram generation from photos
- Logo extraction
- Architectural drawing rendering
- Demoscene effects

### Combining with luminance

For best quality:
1. Edge detection gives strokes
2. Luminance fills fields between strokes
3. Strokes override luminance where edge magnitude is high

---

## Implementation Snippet — A Complete jp2a-Style Renderer in Python

```python
from PIL import Image

PALETTE = " .,:;coxXM@"  # 11 levels

def image_to_ascii(path, width=80):
    img = Image.open(path).convert('L')  # grayscale
    
    # Aspect: terminal cells are ~2x taller than wide
    height = int(img.height * width / img.width / 2)
    img = img.resize((width, height))
    
    output = []
    for y in range(height):
        row = []
        for x in range(width):
            luminance = img.getpixel((x, y))  # 0-255
            char_index = min(luminance * len(PALETTE) // 256, len(PALETTE) - 1)
            row.append(PALETTE[char_index])
        output.append(''.join(row))
    return '\n'.join(output)

print(image_to_ascii('photo.jpg', width=80))
```

---

## Implementation Snippet — Half-Block Color Rendering in Python

```python
from PIL import Image

def image_to_ansi_halfblock(path, width=80):
    img = Image.open(path).convert('RGB')
    
    # Aspect: 1 cell = 1 wide × 2 tall pixels (matching font aspect)
    height = int(img.height * width / img.width)
    if height % 2: height -= 1
    img = img.resize((width, height))
    
    output = []
    for y in range(0, height, 2):
        row = []
        for x in range(width):
            r_top, g_top, b_top = img.getpixel((x, y))
            r_bot, g_bot, b_bot = img.getpixel((x, y + 1))
            # ▄ has fg on the lower half, bg on the upper half
            row.append(
                f"\x1b[48;2;{r_top};{g_top};{b_top}m"
                f"\x1b[38;2;{r_bot};{g_bot};{b_bot}m▄"
            )
        row.append("\x1b[0m")
        output.append(''.join(row))
    return '\n'.join(output)
```

---

## Implementation Snippet — Shape-Vector Match (alexharri-style, Python)

```python
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.spatial import cKDTree

# 1. Compute 6D vectors for each candidate glyph
def glyph_vector(char, font, size=8):
    img = Image.new('L', (size, size), 0)
    ImageDraw.Draw(img).text((0, 0), char, font=font, fill=255)
    arr = np.array(img) / 255.0
    
    return np.array([
        arr.mean(),                                    # brightness
        np.abs(np.diff(arr, axis=1)).mean(),           # h-gradient
        np.abs(np.diff(arr, axis=0)).mean(),           # v-gradient
        (arr.sum(axis=0) * np.arange(size)).sum() / max(arr.sum(), 1e-9),  # h-centroid
        (arr.sum(axis=1) * np.arange(size)).sum() / max(arr.sum(), 1e-9),  # v-centroid
        arr[:size//2, :size//2].sum() - arr[size//2:, size//2:].sum(),     # diag-skew
    ])

# 2. Build k-d tree
ALPHABET = " .'`,:;\"<>+!?*/\\|()[]{}#@%abcdefgABCDEFG"
font = ImageFont.truetype("DejaVuSansMono.ttf", 12)
vectors = np.array([glyph_vector(c, font) for c in ALPHABET])
tree = cKDTree(vectors)

# 3. Render
def render_patch(patch_arr):
    pv = np.array([
        patch_arr.mean(),
        np.abs(np.diff(patch_arr, axis=1)).mean(),
        ...
    ])
    _, idx = tree.query(pv)
    return ALPHABET[idx]
```

---

## Integration with 369 `presentation()` Engine

When `medium === 'terminal'` and input is a raster image (RGBA matrix), the engine should:

```typescript
function renderImageToTerminal(image: Uint8ClampedArray, opts: TerminalOpts) {
    const { width, height } = opts;  // target cell grid
    const proto = detectGraphicsProtocol(opts.env);
    
    if (proto === 'kitty' || proto === 'iterm2') {
        return emitGraphicsProtocol(image, proto, width, height);
        // → see [[terminal-capabilities]] for protocol details
    }
    
    if (proto === 'sixel') {
        return emitSixel(image, width * cellPxW, height * cellPxH);
    }
    
    // Fallback to Unicode mosaic
    if (opts.colorTier >= 8) {
        return halfBlockRender(image, width, height);  // Algorithm 3
    }
    
    return luminanceMap(image, width, height, ALPHABET);  // Algorithm 1
}
```

The choice cascade ensures **best output for the input — every time** (369 Corollary 1).

---

## See Also

- [[ascii-composition]] — Engine algorithms for charts/sparklines (uses these algorithms for image-shaped data)
- [[ascii-tools]] — Tools that implement these algorithms (jp2a, libcaca, chafa, aalib, viu)
- [[unicode-art-extended]] — The glyph vocabulary these algorithms select from
- [[terminal-capabilities]] — Protocol layer (Sixel, Kitty, iTerm2) for when raster bypass is preferable
- [[ascii-ansi-art]] — Manual versions of these algorithms in the BBS era

---

## Authoritative Sources

- [alexharri.com — ASCII Rendering algorithm](https://alexharri.com/blog/ascii-rendering)
- [jp2a source](https://github.com/cslarsen/jp2a)
- [aalib documentation](http://aa-project.sourceforge.net/aalib/aalib.html)
- [libcaca technical paper (Sam Hocevar)](http://libcaca.zoy.org/study/index.html)
- [chafa: terminal graphics for the 21st century (hpjansson)](https://hpjansson.org/chafa/)
- [Roy of Superior Art Creations — Halaster shading method](http://www.roysac.com/learn/ansi_art_create_tutorials.html)
- [Bill Atkinson — Atkinson dithering](https://en.wikipedia.org/wiki/Atkinson_dithering)
- [Floyd-Steinberg dithering (1976 paper, Wikipedia)](https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering)
- [DIN99d color space (Klaus Witt, 2003)](https://en.wikipedia.org/wiki/DIN99)
- [ImageMagick — dithering algorithms](https://imagemagick.org/Usage/quantize/)
