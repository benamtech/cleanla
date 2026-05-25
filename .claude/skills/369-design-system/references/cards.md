# 369 Cards — Primitive, Templates, Iteration Loop

Build 369-compliant Card compositions iteratively. Every iteration produces three artifacts:

1. **JSX** — paste-ready Card primitive composition for the pillar source
2. **HTML preview** — standalone snippet with inline styles, viewable in any browser
3. **Validation summary** — 369-compliance checklist + tone/columns/density rationale

When the user gives feedback, refine and re-render. Continue until the user says "ship it" or pastes the JSX into their pillar.

This file does NOT restate visual rules — for spacing/colors/typography see `visual-rules.md`. For engine-resolved cards see `engines.md`.

## When to invoke this flow

- "build a card for X" / "design a dashboard for X"
- "I need a row card / stat tile / hero panel / list item / status banner / empty state"
- "iterate on this card"
- "is this card 369-compliant?"
- Before designing any new pillar surface that holds structured information

## The 6-step build process

1. **Gather inputs** — use case, pillar, surface, fields, field count, interactive?, lifecycle states needed?
2. **Pick template or raw composition** — use the templates table below if fields match
3. **Choose tone** — walk the tone decision tree
4. **Choose columns + density** — both on `<Card>` root only
5. **Compose slots** — `<Card.Header>`, `<Card.Body>`, `<Card.Cell>`, etc.
6. **Render JSX + HTML preview, validate, iterate** — loop until "ship it"

## Step 1 — Inputs to gather

If not already given, probe for:

1. **Use case** — status display, action item, data row, navigation hub, hero CTA, empty state, etc.
2. **Pillar** — HOME / START / SSM / JBS / SPS / POW / SHOP (each has tone conventions)
3. **Surface** — modal / board / wizard / marketplace / dashboard
4. **Fields** — what content fills the card (name, status, image, timestamp, etc.)
5. **Field count** — drives column choice (1, 2, 3, or 6)
6. **Interactive?** — clickable list rows need `interactive` prop + hover tone
7. **Lifecycle states needed?** — loading, empty, error variants

## Step 2 — Template or raw composition

| Template | Fields | Pillar |
|---|---|---|
| `<ProducerCard>` | initials, name, tagline, verified | START |
| `<JobCard>` | title, budget, dueDate, tagCount, bidCount | JBS |
| `<MilestoneCard>` | title, status, amount, dueDate | SPS |
| `<NotificationCard>` | title, body, timestamp, read | system |
| `<PowCard>` | title, dueDate, status, score | POW |
| `<ReviewCard>` | rating, body, reviewer, timestamp | POW |
| `<ArtworkCard>` | image, italic title, price, available | SHOP |
| `<ProductCard>` | image, title, price, vendor | SHOP |

**Rule:** If the data fits a template's fields, USE the template. If you need fields beyond, use raw composition AND flag a `// TODO(card-template):` comment explaining what's missing for future template extension.

## Step 3 — Tone decision

Walk the questions in order. The first "yes" determines the tone:

1. **Program-identity chrome?** (Wall, SSM, modal hero) → `tone="navy"` (use sparingly)
2. **Status: positive / verified / approved?** → `tone="success"`
3. **Status: negative / error / cancelled?** → `tone="warning"`
4. **Persistent / summary bar?** → `tone="headerTop"`
5. **Breadcrumb / inactive selector?** → `tone="headerCurrent"`
6. **Warm secondary CTA chrome?** → `tone="stickyGold"` or `tone="antiqueGold"`
7. **Otherwise** → default (omit) or `tone="manila"`

Full tone palette in `visual-rules.md` § Card tones. Quick reference of the 9 tones: `manila`, `navy`, `stickyGold`, `antiqueGold`, `headerTop`, `headerCurrent`, `success`, `warning`, `program` (auto-resolves from `PROGRAM_IDENTITY`).

## Step 4 — Columns + density

| Card content | columns | density |
|---|---|---|
| Single CTA / hero panel | `1` | `loose` (9px) |
| List row (one line, mixed content) | `1` | `normal` (6px) |
| Stat tile (label + big value) | `1` | `normal` |
| 2-column comparison (before/after, with/without) | `2` | `normal` or `loose` |
| 3-field profile/status (name/role/score) | `3` | `normal` |
| Dense data row (6+ micro fields) | `6` | `tight` (3px) |
| Modal body | `1` (or content-driven) | `loose` |
| Empty state with CTA | `1` | `normal` |

**Rule:** Both `columns` and `density` live on `<Card>` root only — putting them on `<Card.Body>` is a compile error.

**Responsive collapse** is deterministic — see `visual-rules.md` § Layout constants.

## Step 5 — Slot vocabulary

| Slot | Purpose | Notes |
|---|---|---|
| `<Card>` | Root container | 1px solid #999, 0 radius, takes columns/density/tone/lifecycle/interactive |
| `<Card.Header tone="...">` | 27px chrome bar | Optional. Tone-specific bg + UPPERCASE 15px text |
| `<Card.Body>` | Content grid | Default 3-col grid, gap 9px (or per density) |
| `<Card.Cell>` | Atomic content unit | Inside Card.Body; one cell = one grid slot |
| `<Card.Image src= alt= aspect=>` | Image media | Rectangular, 0 radius. Does NOT pass arbitrary `data-*` through — use raw `<img>` inside `<Card.Body>` if SNAP attrs needed (SHOP exception) |
| `<Card.Avatar initials=>` | Circular initials | Functional exception to 0-radius rule |
| `<Card.Footer>` | Bottom action row | Buttons, links, footer meta |
| `<Card.Loading>` | Loading slot | Used with `lifecycle="loading"` |
| `<Card.Empty>` | Empty slot | Used with `lifecycle="empty"` (e.g., 3-review gate) |
| `<Card.Error>` | Error slot | Used with `lifecycle="error"` |
| `<Card.Settings>` | Gear-icon dropdown anchor | Optional |

### Lifecycle prop on `<Card>`
- `ready` (default) — render children
- `loading` / `empty` / `error` — render the corresponding slot

### Interactive prop on `<Card>`
- Boolean. Adds hover-to-manila affordance for clickable cards (list rows, navigation items).

### Required `"use client"`
When using Card slots in an interactive component, `"use client"` must be the first line of the file (before banner comments). Symbol-based slot detection requires client-side execution.

## Step 6 — Render JSX + HTML preview

Always produce both blocks side-by-side.

### JSX format (paste into pillar source)

```tsx
<Card columns={3} density="loose">
  <Card.Header tone="success">VERIFIED PRODUCER</Card.Header>
  <Card.Body>
    <Card.Cell>
      <div className="text-[9px] uppercase tracking-[0.03em] text-navy/60">NAME</div>
      <div className="text-[15px] font-bold text-navy">Stitch & Stone</div>
    </Card.Cell>
    <Card.Cell>
      <div className="text-[9px] uppercase tracking-[0.03em] text-navy/60">JOBS</div>
      <div className="text-[15px] font-bold text-navy">42</div>
    </Card.Cell>
    <Card.Cell>
      <div className="text-[9px] uppercase tracking-[0.03em] text-navy/60">RATING</div>
      <div className="text-[15px] font-bold text-navy">4.9 ★</div>
    </Card.Cell>
  </Card.Body>
</Card>
```

### HTML preview format (paste into any .html file)

Inline styles only — works in any browser without compiling Tailwind.

```html
<div style="border:1px solid #999999;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:540px;">
  <div style="background:#228B22;color:#ffffff;padding:6px 9px;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">VERIFIED PRODUCER</div>
  <div style="padding:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px;">
    <div style="padding:3px;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">NAME</div>
      <div style="font-size:15px;font-weight:700;color:#001089;">Stitch &amp; Stone</div>
    </div>
    <div style="padding:3px;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">JOBS</div>
      <div style="font-size:15px;font-weight:700;color:#001089;">42</div>
    </div>
    <div style="padding:3px;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">RATING</div>
      <div style="font-size:15px;font-weight:700;color:#001089;">4.9 ★</div>
    </div>
  </div>
</div>
```

## 369 compliance checklist (run before final output)

This is the ship gate. Run every box before declaring complete.

- [ ] Every px value is a multiple of 3 (3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 42, 48, 54, 60, 72, 84, 96)
- [ ] No `rounded-*` classes; no `border-radius` (except circular Avatar)
- [ ] Borders are `1px solid #999999` (no 2px, no colored except success/warning)
- [ ] Tone is from the 9-tone palette (no Tailwind defaults like `gray-100`, `blue-500`)
- [ ] `columns` prop on `<Card>` root, NOT `<Card.Body>` (compile error otherwise)
- [ ] `density` prop on `<Card>` root only
- [ ] Card.Body cell count ≤ columns × 3 (default 9 cells max in a 3-col grid)
- [ ] Lifecycle slots used for empty/loading/error (`<Card.Empty>` not raw `<div>`)
- [ ] If file uses Card slots in interactive context, `"use client"` present at file top (line 1)
- [ ] Templates used when fields match (don't reinvent `ProducerCard` inline)
- [ ] No drop shadows, gradients, blur, icon libraries
- [ ] Typography: Helvetica Neue eText Pro family; sizes from {9, 12, 15, 18, 24, 30, 33, 36}
- [ ] UPPERCASE on labels, headers, buttons, badges (SHOP boutique titles are the exception — italic lowercase via `font-shop-serif`)
- [ ] Letter-spacing 0 or in em multiples of 3 (e.g., `tracking-[0.03em]`); NEVER `tracking-wide` (Tailwind default 0.025em)
- [ ] User-visible bracket notation uses full words: `[CLIENT]`, `[PRODUCER]`, `[SSM]`, `[POW]` — never `[C]` or `[P]` in UI text
- [ ] **Skeleton/loading variants rendered in browser before shipping** — pure-grep spec review can't catch layout bugs (e.g., `aspect-ratio` collapsing to 0×0 without an explicit width source, or `Card.Loading` being flex-row by default). Hardcode `loading={true}` in a consumer or use a `?demo-loading=1` URL flag, then verify computed `getBoundingClientRect()` returns non-zero dimensions at the right ratio.

## Pattern cookbook

Nine canonical patterns. Use them as starting points; iterate per user feedback.

### Pattern A — Stat tile (dashboard KPI)

JSX:
```tsx
<Card columns={1} density="normal">
  <Card.Body>
    <Card.Cell>
      <div className="text-[9px] uppercase tracking-[0.03em] text-navy/60">ACTIVE JOBS</div>
      <div className="text-[24px] font-bold text-navy">12</div>
    </Card.Cell>
  </Card.Body>
</Card>
```

HTML:
```html
<div style="border:1px solid #999999;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;width:180px;">
  <div style="padding:6px;">
    <div style="padding:3px;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">ACTIVE JOBS</div>
      <div style="font-size:24px;font-weight:700;color:#001089;">12</div>
    </div>
  </div>
</div>
```

### Pattern B — List row (interactive)

JSX:
```tsx
<Card columns={1} density="normal" interactive>
  <Card.Body>
    <Card.Cell>
      <div className="flex items-center gap-[9px]">
        <Card.Avatar initials="SS" />
        <div className="flex-1">
          <div className="text-[15px] font-bold text-navy">Stitch & Stone</div>
          <div className="text-[12px] text-navy/70">Heritage tailoring · NYC</div>
        </div>
        <div className="text-[12px] text-navy">4.9 ★</div>
      </div>
    </Card.Cell>
  </Card.Body>
</Card>
```

HTML:
```html
<div style="border:1px solid #999999;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;cursor:pointer;transition:background 0.1s ease;" onmouseover="this.style.background='#f8eac7'" onmouseout="this.style.background='#ffffff'">
  <div style="padding:6px;">
    <div style="padding:3px;">
      <div style="display:flex;align-items:center;gap:9px;">
        <div style="width:36px;height:36px;border-radius:50%;background:#c7a87d;color:#001089;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">SS</div>
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:700;color:#001089;">Stitch &amp; Stone</div>
          <div style="font-size:12px;color:rgba(0,16,137,0.7);">Heritage tailoring · NYC</div>
        </div>
        <div style="font-size:12px;color:#001089;">4.9 ★</div>
      </div>
    </div>
  </div>
</div>
```

### Pattern C — Hero panel (modal)

JSX:
```tsx
<Card columns={1} density="loose">
  <Card.Header tone="navy">SPEC SHEET — JOB #4291</Card.Header>
  <Card.Body>
    <Card.Cell>
      <div className="space-y-[9px] text-[12px] text-navy">
        <div>Heritage denim, 14oz selvedge, button-fly</div>
        <div className="text-navy/60">Submitted 04/27 · Due 05/15</div>
      </div>
    </Card.Cell>
  </Card.Body>
  <Card.Footer>
    <button className="bg-navy text-white px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em]">CLOSE</button>
  </Card.Footer>
</Card>
```

HTML:
```html
<div style="border:1px solid #999999;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:540px;">
  <div style="background:#001089;color:#ffffff;padding:6px 9px;font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">SPEC SHEET — JOB #4291</div>
  <div style="padding:9px;display:grid;grid-template-columns:1fr;gap:9px;">
    <div style="padding:3px;">
      <div style="font-size:12px;color:#001089;line-height:1.5;">Heritage denim, 14oz selvedge, button-fly</div>
      <div style="font-size:12px;color:rgba(0,16,137,0.6);margin-top:9px;">Submitted 04/27 · Due 05/15</div>
    </div>
  </div>
  <div style="padding:9px;border-top:1px solid #999999;text-align:right;">
    <button style="background:#001089;color:#ffffff;padding:6px 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;border:none;cursor:pointer;">CLOSE</button>
  </div>
</div>
```

### Pattern D — Empty state with CTA

JSX:
```tsx
<Card columns={1} density="normal" lifecycle="empty">
  <Card.Empty>
    <div className="text-center py-[18px]">
      <div className="text-[15px] font-bold text-navy uppercase mb-[9px]">NO SAVED PRODUCERS</div>
      <div className="text-[12px] text-navy/70 mb-[12px]">Start by browsing the marketplace.</div>
      <button className="bg-navy text-white px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em]">FIND PRODUCERS</button>
    </div>
  </Card.Empty>
</Card>
```

HTML:
```html
<div style="border:1px solid #999999;background:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;max-width:360px;">
  <div style="text-align:center;padding:18px;">
    <div style="font-size:15px;font-weight:700;color:#001089;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:9px;">NO SAVED PRODUCERS</div>
    <div style="font-size:12px;color:rgba(0,16,137,0.7);margin-bottom:12px;">Start by browsing the marketplace.</div>
    <button style="background:#001089;color:#ffffff;padding:6px 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;border:none;cursor:pointer;">FIND PRODUCERS</button>
  </div>
</div>
```

### Pattern E — Status banner

JSX:
```tsx
<Card columns={1}>
  <Card.Header tone="warning">DISPUTE FILED — RESPONSE REQUIRED BY 04/30</Card.Header>
  <Card.Body>
    <Card.Cell>
      <div className="text-[12px] text-navy">
        Producer Stitch & Stone disputes milestone 3 amount. Review evidence and respond.
      </div>
    </Card.Cell>
  </Card.Body>
  <Card.Footer>
    <button className="bg-navy text-white px-[12px] py-[6px] text-[12px] font-bold uppercase tracking-[0.03em]">REVIEW DISPUTE</button>
  </Card.Footer>
</Card>
```

### Pattern F — Stat row (6-column dashboard)

JSX:
```tsx
<Card columns={6} density="tight">
  <Card.Body>
    {stats.map(s => (
      <Card.Cell key={s.label}>
        <div className="text-[9px] uppercase tracking-[0.03em] text-navy/60">{s.label}</div>
        <div className="text-[18px] font-bold text-navy">{s.value}</div>
      </Card.Cell>
    ))}
  </Card.Body>
</Card>
```

### Pattern G — Image + meta (SHOP exception)

JSX (note: SHOP uses italic lowercase via `font-shop-serif` — boutique voice exception):
```tsx
<Card columns={1} interactive>
  <Card.Body>
    <Card.Image src="/art/sunset.jpg" alt="Sunset over Manhattan" aspect="4/3" />
    <Card.Cell>
      <div className="font-shop-serif italic lowercase text-[18px] text-navy">sunset over manhattan</div>
      <div className="text-[12px] text-navy/70">$2,400 · available</div>
    </Card.Cell>
  </Card.Body>
</Card>
```

For SNAP animations (SHOP-only), use raw `<img>` inside `<Card.Body>` with `data-snap-id` / `data-snap-color`:
```tsx
<Card columns={1} interactive>
  <Card.Body>
    <div data-snap-id={artwork.id} data-snap-color={artwork.color}>
      <img src={artwork.image} alt={artwork.title} className="w-full aspect-[4/3] object-cover" />
    </div>
    <Card.Cell>...</Card.Cell>
  </Card.Body>
</Card>
```

### Pattern H — StatTile (inline alternative to Card.Stat)

**When to use:** Account dashboards, role-tailored stat strips, or any surface where you observed `<Card.Stat>` rendering as `undefined` in production. Card slots attached via property assignment (`Card.Stat = CardStat`) can be tree-shaken by the production bundler — the slot import survives but the property assignment runs after the `memo()` wrap and gets dropped. Inline a local component to defend against the bug class.

JSX (drop into the file that needs it, NOT into the Card primitive):
```tsx
import Link from "next/link";

function StatTile({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-grey p-[12px] bg-white hover:bg-manila"
    >
      <div className="text-[9px] uppercase tracking-[0.03em] text-navy/60">{label}</div>
      <div className="text-[24px] font-bold text-navy mt-[6px] leading-none">{value}</div>
    </Link>
  );
}
```

Compose tiles into a 369-grid (3 cols desktop, 1 col mobile):
```tsx
<div className="grid grid-cols-3 max-md:grid-cols-1 gap-[9px]">
  <StatTile label="ACTIVE JOBS" value={activeJobs} href="/jbs" />
  <StatTile label="OPEN BIDS" value={openBids} href="/jbs#bids" />
  <StatTile label="MILESTONES" value={milestones} href="/sps" />
</div>
```

HTML preview:
```html
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;font-family:'Helvetica Neue',Arial,sans-serif;">
  <a href="/jbs" style="display:block;border:1px solid #999999;padding:12px;background:#ffffff;text-decoration:none;transition:background 0.1s ease;" onmouseover="this.style.background='#f8eac7'" onmouseout="this.style.background='#ffffff'">
    <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">ACTIVE JOBS</div>
    <div style="font-size:24px;font-weight:700;color:#001089;margin-top:6px;line-height:1;">12</div>
  </a>
  <a href="/jbs#bids" style="display:block;border:1px solid #999999;padding:12px;background:#ffffff;text-decoration:none;transition:background 0.1s ease;" onmouseover="this.style.background='#f8eac7'" onmouseout="this.style.background='#ffffff'">
    <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">OPEN BIDS</div>
    <div style="font-size:24px;font-weight:700;color:#001089;margin-top:6px;line-height:1;">3</div>
  </a>
  <a href="/sps" style="display:block;border:1px solid #999999;padding:12px;background:#ffffff;text-decoration:none;transition:background 0.1s ease;" onmouseover="this.style.background='#f8eac7'" onmouseout="this.style.background='#ffffff'">
    <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.03em;color:rgba(0,16,137,0.6);">MILESTONES</div>
    <div style="font-size:24px;font-weight:700;color:#001089;margin-top:6px;line-height:1;">5</div>
  </a>
</div>
```

**Live reference:** `src/app/(app)/account/page.tsx` uses StatTile across three role sections (Build / Shop Collector / Shop Artist) — model new role-tailored dashboards on that file. The decision was forced by a production-only render error: `<Card.Stat>` → "Element type is invalid: got: undefined" with no dev-mode warning.

### Pattern I — Role-tailored stat sections

**When to use:** A single account/dashboard surface that should render different stat groups based on user role (active_mode for Build, derived flags for Shop Collector / Shop Artist). Each role's section renders independently — present absent → omit the entire section, not stub it.

Pattern: a `<section>` per role, each with its own header + StatTile grid. Use `Promise.allSettled` for the data fetch (one role's table missing must NOT 500 the whole page):

```tsx
// Server component
const results = await Promise.allSettled([
  supabase.from('techpacks').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
  supabase.from('bids').select('id', { count: 'exact', head: true }).eq('producer_id', user.id),
  supabase.from('shop_artworks').select('id', { count: 'exact', head: true }).eq('artist_id', user.id),
  supabase.from('shop_wishlist').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
]);

const pickCount = (r: PromiseSettledResult<{ count: number | null }>) =>
  r.status === 'fulfilled' ? (r.value.count ?? 0) : 0;

const techpackCount = pickCount(results[0]);
const bidCount = pickCount(results[1]);
const artworkCount = pickCount(results[2]);
const wishlistCount = pickCount(results[3]);
const isArtist = artworkCount > 0;
```

```tsx
{/* BUILD section — gated on active_mode */}
{activeMode === 'client' && (
  <section className="mb-[18px]">
    <div className="text-[9px] font-bold text-navy uppercase tracking-[0.03em] mb-[9px]">BUILD · CLIENT</div>
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[9px]">
      <StatTile label="SPEC SHEETS" value={techpackCount} href="/ssm" />
      <StatTile label="ACTIVE MILESTONES" value={milestoneCount} href="/sps" />
      <StatTile label="OPEN PROJECTS" value={openProjects} href="/jbs" />
    </div>
  </section>
)}

{/* SHOP COLLECTOR — always renders */}
<section className="mb-[18px]">
  <div className="text-[9px] font-bold text-navy uppercase tracking-[0.03em] mb-[9px]">SHOP · COLLECTOR</div>
  <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[9px]">
    <StatTile label="WISHLIST" value={wishlistCount} href="/shop/account#favorites" />
    <StatTile label="INQUIRIES" value={collectorConvos} href="/shop/account#inquiries" />
    <StatTile label="ORDERS" value={orderCount} href="/shop/account#orders" />
  </div>
</section>

{/* SHOP ARTIST — gated on artworkCount > 0 */}
{isArtist && (
  <section>
    <div className="text-[9px] font-bold text-navy uppercase tracking-[0.03em] mb-[9px]">SHOP · ARTIST</div>
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[9px]">
      <StatTile label="LISTINGS" value={artworkCount} href="/shop/seller#artwork" />
      <StatTile label="MESSAGES" value={artistConvos} href="/shop/seller#messages" />
      <StatTile label="PAYOUTS" value={`$${payouts}`} href="/shop/seller#payouts" />
    </div>
  </section>
)}
```

**Rules:**
- One `<section>` per role; section header in 9px UPPERCASE navy with `tracking-[0.03em]`
- StatTiles inside `grid-cols-3 max-md:grid-cols-1` with `gap-[9px]`
- Section omitted entirely when role is absent (no "0 listings" empty stub if user isn't an artist)
- Data fetch via `Promise.allSettled` so a missing prod table doesn't 500 the whole route

## Iteration workflow

When the user invokes this flow:

1. **Probe inputs** if not given (use case, pillar, fields, interactive?)
2. **First draft** — produce JSX + HTML preview + validation summary (3-bullet rationale: tone / columns / density)
3. **Wait for feedback** — common adjustments:
   - "tighter" → `density="tight"`
   - "use stickyGold" → tone change
   - "add a footer with a Close button" → add `<Card.Footer>`
   - "this should be 2 columns" → columns prop change
   - "add an empty state" → lifecycle slot
   - "make it interactive" → add `interactive` prop
4. **Refine** — update both JSX and HTML, re-show side-by-side
5. **Validate** — run the 369 checklist before final output
6. **Ship** — output a clean JSX block + suggested file path + validation summary

## Final output format

When the user says "ship it" / "looks good" / equivalent:

```
✓ 369 Card Creator — final composition

Use case: <one-line brief>
Suggested file: src/pillars/<pillar>/<surface>.tsx (or new file)

Final JSX:

```tsx
<Card columns={N} density="..." tone="...">
  ...
</Card>
```

Validation: 369 checklist passed (X of X)
- Tone: <tone> — <reason>
- Columns: <N> — <reason>
- Density: <tight|normal|loose> — <reason>
- Slots used: <list>
- Template: <name | "raw composition">

Follow-ups (if any):
- // TODO(card-template): <what's missing for template extension>
```

## Common pitfalls

| Pitfall | Fix |
|---|---|
| `<Card.Body columns={N}>` | Hoist `columns` to `<Card>` root |
| `<Card.Body density="...">` | Hoist `density` to `<Card>` root |
| Using `bg-success` utility class instead of `tone="success"` | Use the tone prop for chrome; raw class only for inline badges |
| Writing `p-[18px]` for hero panels | Use `density="loose"` (9px); accept tighter UI per 369 system intent |
| Custom `<div>` for empty state | Use `<Card.Empty>` with `lifecycle="empty"` |
| Forgetting `"use client"` on interactive cards | Add to file top-line (line 1, before banner comments) |
| Using rounded corners | Cards have 0 radius globally; remove |
| `tracking-wide` (Tailwind default 0.025em) | Use `tracking-[0.03em]` (3-em multiple) |
| Reinventing `<ProducerCard>` inline | Use the template; flag `// TODO(card-template):` if extension needed |
| `[C]` / `[P]` in user-visible UI | Use full words `[CLIENT]` / `[PRODUCER]` |
| Skeleton image collapses to 0×0 (`aspect-[4/3]` alone) | Add `w-full` — `aspect-ratio` doesn't establish width on its own; in flex containers it collapses |
| `Card.Loading` slot is `display: flex; flex-direction: row` — multiple skeleton children compete for horizontal space | Wrap skeleton content in `<div className="flex flex-col w-full">` so children stack vertically inside one flex item |
| `<Card.Stat>` (or any slot attached via property assignment after `memo()`) renders as `undefined` in production: "Element type is invalid: got: undefined" with no dev warning. Cause: bundler tree-shakes the property assignment (`Card.Stat = CardStat`) since it appears as a side-effect after the memo wrap. | **Pattern H — StatTile**: inline a local component in the consuming file. Don't add new slots via property assignment. Live reference: `src/app/(app)/account/page.tsx`. Audit: grep `Card\.Stat\b` and replace with inline tiles. |
| Account/dashboard role page 500s when one role's table is missing on prod (e.g., `techpacks` 404) | Use `Promise.allSettled` + `pickCount` helper (Pattern I) — never `Promise.all`. One missing table must not bring down the whole route. |

## Reference: Card primitive source

- Card primitive: `src/roof/Card.tsx`
- Tones: `CARD_TONE_TO_COLOR` in `src/base/spec.ts` (see `visual-rules.md` for the table)
- Padding modes: `CARD_PADDING_MODES` in `src/base/spec.ts`
- Templates: `src/roof/cards/*.tsx`
- Live specimens: `/369#cards-primitive`, `/369#cards-data`, `/369#cards-patterns`
- Migration history: PRs #48-#53 (Card primitive sweep across [JBS], [SPS], [SHOP], [START], [POW])

## The engine-backed path

Since the presentation-engine work, cards also resolve through the **component engine**: `resolveAny('Card', { tiers, tones })` resolves the Card primitive, and `resolveAny('JobCard' | 'ProducerCard' | 'PowCard' | 'ReviewCard' | 'ArtworkCard' | 'ProductCard' | 'NotificationCard' | 'MilestoneCard')` resolves each template — every value drawn from a recipe in `src/base/recipes/`. Hand-composing (this flow) and engine-resolving are two paths to the same 369-compliant output; the recipes encode the same tone / tier / density logic this file applies by hand. Keep them consistent — if a card's tone or tier rule changes here, the recipe changes too.

For "I have data or an entity — give me the best 369 HTML," see `engines.md` — it routes the input through the engines automatically.
