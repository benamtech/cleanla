// Layout audit — runs against a deployed site (default
// https://americanmarketing.technology, override with BASE env). Checks that
// no two floating overlays on the home map actually overlap (containment is
// fine — chip inside header etc.) and that the bottom-right vertical stack
// (zoom / joystick / FILE A REPORT) has gaps that are multiples of 3,
// matching the 369 design system. Exits 1 on any failure so it can be a CI
// check.
//
// Run:  node webapp/scripts/audit-overlays.mjs
//       BASE=https://your-deploy.example node webapp/scripts/audit-overlays.mjs

import { chromium } from "playwright";

const BASE = process.env.BASE || "https://americanmarketing.technology";

const PROBES = [
  { name: "header", sel: (p) => p.locator("header").first() },
  { name: "@JUAN chip", sel: (p) => p.getByRole("button", { name: "@JUAN", exact: true }) },
  { name: "[+] zoom-in", sel: (p) => p.getByRole("button", { name: "Zoom in" }) },
  { name: "[-] zoom-out", sel: (p) => p.getByRole("button", { name: "Zoom out" }) },
  { name: "joystick", sel: (p) => p.getByRole("button", { name: /Drag joystick/ }) },
  { name: "FILE A REPORT", sel: (p) => p.getByRole("button", { name: "[+] FILE A REPORT" }) },
  { name: "[LEGEND]", sel: (p) => p.getByRole("button", { name: "[LEGEND]" }) },
  { name: "[REWARDS]", sel: (p) => p.getByRole("button", { name: /\[REWARDS/ }) },
  { name: "[i] about", sel: (p) => p.getByRole("button", { name: "About CleanLA" }) },
];

const STACK_PAIRS = [
  ["[+] zoom-in", "[-] zoom-out"],
  ["[-] zoom-out", "joystick"],
  ["joystick", "FILE A REPORT"],
];

function rect(b) { return { l: b.x, t: b.y, r: b.x + b.w, b: b.y + b.h }; }
function intersects(a, c) {
  const A = rect(a), C = rect(c);
  const ix = Math.min(A.r, C.r) - Math.max(A.l, C.l);
  const iy = Math.min(A.b, C.b) - Math.max(A.t, C.t);
  return ix > 0 && iy > 0;
}
function contains(outer, inner) {
  const O = rect(outer), I = rect(inner);
  return I.l >= O.l - 1 && I.r <= O.r + 1 && I.t >= O.t - 1 && I.b <= O.b + 1;
}
function gap(a, c) {
  const A = rect(a), C = rect(c);
  const gx = Math.max(A.l, C.l) - Math.min(A.r, C.r);
  const gy = Math.max(A.t, C.t) - Math.min(A.b, C.b);
  if (gx > 0 && gy > 0) return { axis: "diag", dx: gx, dy: gy };
  if (gx > 0) return { axis: "x", d: gx };
  if (gy > 0) return { axis: "y", d: gy };
  return null;
}

async function audit(width, height, label) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const boxes = [];
  for (const p of PROBES) {
    try {
      const loc = p.sel(page);
      if (await loc.count() === 0) continue;
      const bb = await loc.first().boundingBox();
      if (bb) boxes.push({ name: p.name, ...bb, w: bb.width, h: bb.height });
    } catch {}
  }

  console.log(`\n=== ${label} (${width}x${height}) ===`);
  for (const b of boxes) console.log(`  ${b.name.padEnd(18)} x=${Math.round(b.x)} y=${Math.round(b.y)} ${Math.round(b.w)}x${Math.round(b.h)}`);

  const failures = [];

  // 1) No non-containment overlaps allowed.
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    if (intersects(boxes[i], boxes[j]) && !contains(boxes[i], boxes[j]) && !contains(boxes[j], boxes[i])) {
      failures.push(`OVERLAP: ${boxes[i].name} & ${boxes[j].name}`);
    }
  }

  // 2) Bottom-right stack vertical gaps must be 3/6/9 multiples (touching counts as 0, OK).
  const byName = Object.fromEntries(boxes.map((b) => [b.name, b]));
  for (const [a, c] of STACK_PAIRS) {
    if (!byName[a] || !byName[c]) continue;
    const g = gap(byName[a], byName[c]);
    if (!g) continue; // touching, fine
    if (g.axis === "y") {
      const d = Math.round(g.d);
      if (d % 3 !== 0) failures.push(`SPACING: ${a} → ${c} gap=${d}px (not a multiple of 3)`);
      else console.log(`  ✓ ${a} → ${c}: ${d}px`);
    } else {
      console.log(`  ~ ${a} → ${c}: ${JSON.stringify(g)} (skipped — not column-aligned)`);
    }
  }

  await browser.close();
  return failures;
}

const allFailures = [
  ...(await audit(414, 900, "mobile")),
  ...(await audit(820, 1180, "tablet")),
];

if (allFailures.length) {
  console.log("\nFAIL:");
  for (const f of allFailures) console.log("  ✗ " + f);
  process.exit(1);
}
console.log("\nAll layout checks passed.");
