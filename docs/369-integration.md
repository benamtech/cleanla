# 369 Design System Integration

## What is 369?

The **369 design system** is an analytical framework for enforcing layout, spacing, contrast, and accessibility rules at render time. It's based on three core principles:

- **Rule 9a (Overlap Contract)**: Floating overlays must not have non-containment overlap
- **Rule 9b (Gap Contract)**: Declared vertical/horizontal stacks must have gaps that are multiples of 3
- **Rule 9c (Manifest)**: Every non-optional overlay must render at every declared viewport

It also enforces touch targets (48×48px minimum), focus visibility, and WCAG AA / APCA contrast standards.

**Repository**: https://github.com/navruhtra/369-design-system
**Local copy**: `/home/love-america/code/369-design-system/`

## How to Run the Audit

### Locally

```bash
# Layout audit (Rule 9a/9b/9c)
./scripts/audit-369/audit.sh

# Against a custom URL
BASE=http://localhost:5173 ./scripts/audit-369/audit.sh

# Contrast audit (WCAG AA + APCA)
./scripts/audit-369/audit-contrast.sh
```

Output goes to `.audit-output/` (screenshots, SVG overlays, JSON report).

### In CI

The GitHub Actions workflow is parked at `scripts/audit-369/ci.yml.template`. To activate:

```bash
mkdir -p .github/workflows
cp scripts/audit-369/ci.yml.template .github/workflows/audit-369.yml
git add .github/workflows && git commit -m "ci: activate 369 audit gate" && git push
```

Once activated, the audit runs on every PR to main and comments with failure details.

## Interpreting Failures

### OVERLAP
**Error**: Two overlays are rendered at the same pixel location, and one does not fully contain the other.

**Why it matters**: Overlapping interactive elements confuse users and violate accessibility guidelines.

**Fix**:
1. Check the SVG overlay diagram in `.audit-output/` to see which elements overlap
2. Adjust z-index in CSS to layer them properly:
   ```css
   .header { z-index: 10; }
   .floating-cta { z-index: 20; } /* on top */
   ```
3. Or reflow layout so they don't occupy the same space
4. Or add `data-369-allow="OVERLAP"` to the HTML if the overlap is intentional and safe

### SPACING
**Error**: A gap between two overlays doesn't match the expected value or isn't a multiple of 3.

**Why it matters**: Consistent 3-unit spacing creates visual harmony and predictable layouts.

**Fix**:
1. Measure the actual gap: `element1.bottom - element2.top`
2. Adjust CSS to match the expected value:
   ```css
   .header { margin-bottom: 24px; } /* multiple of 3 */
   ```
3. Or update the manifest to declare the actual gap:
   ```json
   {
     "stackPairs": [{
       "name": "header-to-content",
       "gap": { "expectedValue": 18 }
     }]
   }
   ```

### GAP_MISMATCH
**Error**: Rendered gap is not a multiple of 3 and no override was declared.

**Why it matters**: Non-3x gaps indicate unintentional spacing (margin collapse, rounding errors, etc.).

**Fix**:
1. Recalculate the gap to use a multiple of 3
2. Or override in manifest.json if the gap is intentional:
   ```json
   {
     "stackPairs": [{
       "stackA": "header",
       "stackB": "content",
       "axis": "row",
       "gap": { "expectedValue": 21 }
     }]
   }
   ```

### MISSING
**Error**: A non-optional overlay didn't render at a specific viewport.

**Why it matters**: Users on that device size won't see important UI elements.

**Fix**:
1. If the overlay is hidden on purpose (mobile-only nav, etc.), mark it `optional: true`:
   ```json
   {
     "name": "desktop-nav",
     "optional": true,
     "css": ".desktop-nav"
   }
   ```
2. Or debug why the overlay isn't rendering:
   - Check viewport width/height breakpoints
   - Verify CSS `display: none` isn't being applied unintentionally
   - Check for JavaScript that hides elements

### TOUCH_TARGET
**Error**: An interactive element is smaller than 48×48px.

**Why it matters**: Small buttons are hard to tap on mobile (WCAG 2.1 Level AAA requirement).

**Fix**:
1. Increase the element's width/height:
   ```css
   button {
     min-width: 48px;
     min-height: 48px;
   }
   ```
2. Or increase padding to make the clickable area larger:
   ```css
   button {
     padding: 12px 16px; /* makes the hit target bigger */
   }
   ```
3. Or mark it `optional: true` if it's decoration and not interactive

### DECORATION
**Error**: A decorative overlay is overlapping interactive content without proper z-layering.

**Why it matters**: Users can't interact with buttons, links, or form fields hiding behind decorations.

**Fix**:
1. Move the decoration behind interactive content:
   ```css
   .decoration { z-index: -1; }
   .button { z-index: 1; }
   ```
2. Or remove the decoration on small viewports:
   ```css
   @media (max-width: 600px) {
     .decoration { display: none; }
   }
   ```

### FOCUS_RING
**Error**: A keyboard-focused interactive element doesn't have a visible focus indicator.

**Why it matters**: Keyboard users can't navigate without seeing where focus is.

**Fix**:
```css
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* or use a custom ring */
button:focus-visible {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.5);
}
```

### CONTRAST
**Error**: Text doesn't meet WCAG AA (4.5:1 for normal text, 3:1 for large text) or APCA (Lc ≥ 60).

**Why it matters**: Low contrast text is unreadable for users with vision impairments.

**Fix**:
1. Increase the luminance of the text or background:
   ```css
   .low-contrast-text {
     color: #000; /* darker */
   }
   .low-contrast-bg {
     background: #fff; /* lighter */
   }
   ```
2. Or increase font weight to compensate:
   ```css
   .small-text {
     font-weight: 600; /* bolder = more visible at same color */
   }
   ```
3. Use a contrast checker: https://www.tpgi.com/color-contrast-checker/

## Adding a New Screen to the Manifest

When you add a new page/section to CleanLA:

1. Open `scripts/audit-369/manifest.json`
2. Add new overlays in the `overlays` array:
   ```json
   {
     "name": "pricing-hero",
     "description": "Hero section on pricing page",
     "optional": false,
     "css": ".pricing-hero",
     "skipOverlays": ["cta-primary"]
   }
   ```
3. Add stack pairs if there are spacing relationships:
   ```json
   {
     "name": "hero-to-pricing",
     "stackA": "pricing-hero",
     "stackB": "pricing-grid",
     "axis": "column",
     "gap": { "expectedValue": 30 }
   }
   ```
4. Run the audit to verify:
   ```bash
   ./scripts/audit-369/audit.sh
   ```

### Manifest Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | Unique overlay ID |
| `description` | string | no | Human-readable label |
| `optional` | boolean | no | If true, overlay can be missing on some viewports |
| `css` | string | no | CSS selector (e.g., `.header`, `nav`) |
| `role` | string | no | ARIA role (e.g., `button`, `link`, `banner`) |
| `namePattern` | string | no | Regex to match accessible name or text |
| `skipOverlays` | string[] | no | List of overlays allowed to overlap with this one |

## Opting Out a Specific Element

If an element legitimately can't meet 369 rules (e.g., a third-party widget):

### Option 1: Mark as Optional
```json
{
  "name": "third-party-banner",
  "optional": true
}
```

### Option 2: Allow Specific Violations
```html
<!-- Allow overlap with other overlays -->
<div class="widget" data-369-allow="OVERLAP">
  Third-party content
</div>

<!-- Allow non-multiple-of-3 gap -->
<div class="widget" data-369-allow="SPACING">
  Content with unusual spacing
</div>

<!-- Allow missing on specific viewports -->
<div class="widget" data-369-allow="MISSING">
  Conditionally rendered
</div>

<!-- Multiple violations -->
<div class="widget" data-369-allow="OVERLAP,SPACING,MISSING">
  Fully exempt
</div>
```

## Updating the Manifest During Reflow

When you refactor layout:

1. Run the audit:
   ```bash
   ./scripts/audit-369/audit.sh
   ```
2. Read the failure report in `.audit-output/report.json`
3. For each failure:
   - If it's a new spacing relationship, add a `stackPair` entry
   - If it's a gap mismatch, update the expected value in the stack pair
   - If an overlay is conditionally rendered, mark it `optional: true`
4. Re-run to verify all viewports pass

Example report:
```json
{
  "portrait-mobile": {
    "pass": false,
    "errors": [
      {
        "type": "SPACING",
        "overlay": "header",
        "viewport": "portrait-mobile",
        "message": "Gap mismatch: expected 12, got 15"
      }
    ]
  }
}
```

## Migration Notes for Current CleanLA Code

### Existing Issues (if any)

If CleanLA currently has layout that violates these rules:

1. **Floating modals**: Ensure they use proper z-index layering
2. **Sticky elements**: Verify they don't overlap content beyond their expected stack
3. **Responsive breakpoints**: Check that all overlays render at the declared viewports
4. **Touch targets**: Verify all buttons and links are ≥48×48px

### Incremental Adoption

You don't need to fix all violations at once:

1. Start with layout audit (`contrast: false` in manifest.json)
2. Fix OVERLAP and SPACING violations first (higher impact)
3. Enable contrast audit once layout is clean
4. Gradually mark conditional overlays as `optional: true`

## npm Scripts

In `webapp/package.json`:

```json
{
  "scripts": {
    "audit:369": "./scripts/audit-369/audit.sh",
    "audit:contrast": "./scripts/audit-369/audit-contrast.sh"
  }
}
```

Usage:
```bash
npm run audit:369           # Layout audit
npm run audit:contrast      # Contrast audit
BASE=http://staging npm run audit:369  # Custom URL
```

## Further Reading

- 369 GitHub: https://github.com/navruhtra/369-design-system
- 369 Canvas Specification: `/home/love-america/code/369-design-system/references/overlay-composition.md`
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- APCA Contrast: https://www.myndex.org/APCA/
