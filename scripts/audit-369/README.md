# CleanLA 369 Audit Integration

The 369 design system enforces three core layout rules on your deployed site:

- **Rule 9a** (Overlap Contract): No non-containment overlap between visible floating overlays
- **Rule 9b** (Gap Contract): Every declared vertical/horizontal stack gap is a multiple of 3 (or matches a declared expectation)
- **Rule 9c** (Manifest): Every non-optional overlay must render at every viewport

This directory contains the local audit tools, manifest, and CI workflow template.

## Running the Audit Locally

### Layout Audit

```bash
./scripts/audit-369/audit.sh
```

Defaults to `http://localhost:3000`. To audit a different URL:

```bash
./scripts/audit-369/audit.sh http://localhost:5173
# or via environment:
BASE=https://preview.example.com ./scripts/audit-369/audit.sh
```

Output is written to `.audit-output/` (screenshots, SVG overlays, JSON report).

### Contrast Audit

```bash
./scripts/audit-369/audit-contrast.sh
```

Same usage as layout audit. Checks WCAG AA, APCA, and ΔE contrast advisories. Currently disabled in the manifest (`checks: { contrast: false }`); enable once you've resolved any layout violations.

## Understanding Failure Types

When the audit fails, you'll see one of these errors:

### OVERLAP
Two overlays are rendered at the same location and one does not fully contain the other.
**Fix**: Adjust CSS z-index or reflow layout so they don't intersect, or mark one as non-interactive (`pointer-events: none`).

### SPACING
A declared gap between overlays (stackPair) doesn't match the expected value or isn't a multiple of 3.
**Fix**: Update the gap in manifest.json, or adjust CSS margins/padding in your layout.

### GAP_MISMATCH
Rendered gap is not a multiple of 3 and no override was declared.
**Fix**: Adjust the stack pair gap definition in manifest.json with an `expectedValue` override.

### MISSING
A non-optional overlay didn't render at a specific viewport.
**Fix**: Mark the overlay as `optional: true` in manifest.json if it's conditionally rendered, or debug why it's not appearing.

### TOUCH_TARGET
An interactive element (button, link, etc.) is smaller than 48×48px.
**Fix**: Increase the element's width/height, or add padding to make it larger.

### DECORATION
A decorative overlay is overlapping interactive content without proper z-layering.
**Fix**: Adjust z-index so interactive elements are always on top, or hide decorations at small viewports.

### FOCUS_RING
A keyboard-focused element doesn't have a visible focus indicator.
**Fix**: Add `:focus-visible` CSS with a 2-3px ring, or use a focus management library.

### CONTRAST
Text doesn't meet WCAG AA or APCA requirements.
**Fix**: Increase luminance difference between text and background, or adjust font weight.

## Adding a New Screen to the Manifest

Update `manifest.json` to declare new overlays:

```json
{
  "overlays": [
    {
      "name": "hero-banner",
      "description": "Hero section at top of page",
      "optional": false,
      "css": ".hero",
      "skipOverlays": ["floating-cta"]
    },
    {
      "name": "floating-cta",
      "description": "Sticky CTA button (bottom right)",
      "optional": true,
      "role": "button",
      "namePattern": "CTA|ACTION",
      "skipOverlays": ["hero-banner"]
    }
  ],
  "stackPairs": [
    {
      "name": "hero-to-cta",
      "stackA": "hero-banner",
      "stackB": "floating-cta",
      "axis": "column",
      "gap": {
        "expectedValue": 24,
        "description": "Vertical space from hero bottom to floating CTA"
      },
      "optional": false
    }
  ]
}
```

- **name**: Unique overlay identifier
- **optional**: If true, the audit won't fail if this overlay is missing on a viewport
- **css**: CSS selector to find the element (e.g., class, tag)
- **role**: ARIA role (button, link, etc.)
- **namePattern**: Regex pattern to match element's accessible name or text
- **skipOverlays**: List of overlays that are allowed to overlap with this one

## Opting Out a Specific Element

If an overlay legitimately can't meet the rules on a specific viewport:

1. Mark it `optional: true` in manifest.json, OR
2. Add `data-369-allow="OVERLAP|SPACING|MISSING"` attribute to the HTML element

Example:
```html
<div class="floating-banner" data-369-allow="OVERLAP">
  This banner can overlap with other content
</div>
```

## Updating the Manifest During Reflow

When you change layout:

1. Run the audit: `./scripts/audit-369/audit.sh`
2. Review `.audit-output/report.json` for failures
3. Update gap expectations or optional flags in `manifest.json`
4. Re-run to verify

Never ignore audit failures — they represent accessibility and layout contract violations.

## Activating the CI Workflow

The GitHub Actions workflow is parked at `scripts/audit-369/ci.yml.template` (not yet active in `.github/workflows/`).

To activate:

```bash
mkdir -p .github/workflows
cp scripts/audit-369/ci.yml.template .github/workflows/audit-369.yml
git add .github/workflows && git commit -m "ci: activate 369 audit gate" && git push
```

Once activated, the audit will run on every pull request to main:
- Checks against the PR's Vercel preview URL
- Uploads artifacts (screenshots, overlays) on failure
- Comments on the PR with failing viewport details

## Configuration Files

- `manifest.json` — Overlay declarations, viewports, stack pairs, checks
- `audit.sh` — Local layout audit wrapper
- `audit-contrast.sh` — Local contrast audit wrapper
- `ci.yml.template` — GitHub Actions workflow (activate by copying to `.github/workflows/audit-369.yml`)

## npm Scripts (webapp/package.json)

```bash
npm run audit:369          # Run layout audit
npm run audit:contrast     # Run contrast audit
```

These are shortcuts to the bash wrappers above.

## Troubleshooting

**"audit-overlays.mjs not found"**
- Ensure `@adn/369-design-system` is installed: `npm install --save-dev @adn/369-design-system` (in webapp/)
- Or copy from the 369 skill: `/home/love-america/.claude/skills/369-design-system/references/`

**Page takes too long to settle**
- Increase `settleMs` in manifest.json (default: 2000ms)

**Overlay selector not matching**
- Verify CSS selector with `document.querySelector()` in browser dev tools
- Add `namePattern` (regex) if the overlay is only identified by its text content

**Preview URL not detected**
- The CI workflow uses Vercel's deployment status API. If your Vercel integration isn't set up, run the audit manually against the PR's preview link.
