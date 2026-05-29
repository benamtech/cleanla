// 9a / 9b layout audit. Loads a deployed home view at fixed mobile + tablet
// breakpoints and checks (a) no two named overlays share screen space unless
// one is a child of the other, and (b) vertical gaps in the bottom-right
// stack are multiples of 3.
//
// Usage:   node webapp/scripts/audit-overlays.mjs
//          BASE=https://preview.example node webapp/scripts/audit-overlays.mjs
//
// Resolves playwright in this order: project node_modules → npx cache. If
// neither is available, prints an install hint and exits 2.

import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const require = createRequire(import.meta.url);
let chromium;
for (const candidate of [
  "playwright",
  "/home/love-america/.npm/_npx/e41f203b7505f1fb/node_modules/playwright",
]) {
  try {
    chromium = require(candidate).chromium;
    if (chromium) break;
  } catch {}
}
if (!chromium) {
  console.error(
    "audit-overlays: playwright is not installed.\n" +
      "  npm install --save-dev playwright   (in webapp/)\n" +
      "  then re-run.",
  );
  process.exit(2);
}

const BASE = process.env.BASE || "http://localhost:3000";

const PROBES = [
  { name: "header",        sel: (p) => p.locator("header").first() },
  { name: "[+] zoom-in",   sel: (p) => p.getByRole("button", { name: "Zoom in" }) },
  { name: "[-] zoom-out",  sel: (p) => p.getByRole("button", { name: "Zoom out" }) },
  { name: "joystick",      sel: (p) => p.getByRole("button", { name: /Drag joystick/ }) },
  { name: "FILE A REPORT", sel: (p) => p.getByRole("button", { name: "[+] FILE A REPORT" }) },
];

// Adjacent overlay pairs whose vertical gap must be a 3-multiple.
// Touching boxes (shared border) are allowed and report gap=0.
const STACK_PAIRS = [
  ["[+] zoom-in", "[-] zoom-out"],
  ["[-] zoom-out", "joystick"],
  ["joystick", "FILE A REPORT"],
];

const rect = (b) => ({ l: b.x, t: b.y, r: b.x + b.w, b: b.y + b.h });
function realIntersection(a, c) {
  const A = rect(a), C = rect(c);
  const ix = Math.min(A.r, C.r) - Math.max(A.l, C.l);
  const iy = Math.min(A.b, C.b) - Math.max(A.t, C.t);
  return ix > 1 && iy > 1; // touching pixel edges don't count
}
function contains(o, i) {
  const O = rect(o), I = rect(i);
  return I.l >= O.l - 1 && I.r <= O.r + 1 && I.t >= O.t - 1 && I.b <= O.b + 1;
}
function verticalGap(a, c) {
  const A = rect(a), C = rect(c);
  return Math.max(A.t, C.t) - Math.min(A.b, C.b);
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
      if ((await loc.count()) === 0) continue;
      const bb = await loc.first().boundingBox();
      if (bb) boxes.push({ name: p.name, x: bb.x, y: bb.y, w: bb.width, h: bb.height });
    } catch {}
  }

  console.log(`\n=== ${label} (${width}x${height}) ===`);
  for (const b of boxes)
    console.log(`  ${b.name.padEnd(18)} x=${Math.round(b.x)} y=${Math.round(b.y)} ${Math.round(b.w)}x${Math.round(b.h)}`);

  const failures = [];

  // 9a: no non-containment overlap
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    if (
      realIntersection(boxes[i], boxes[j]) &&
      !contains(boxes[i], boxes[j]) &&
      !contains(boxes[j], boxes[i])
    ) {
      failures.push(`9a ${label}: OVERLAP ${boxes[i].name} & ${boxes[j].name}`);
    }
  }

  // 9b: vertical column gaps multiples of 3. Only flag pairs that are
  // actually column-aligned at this breakpoint — on tablet the joystick lives
  // inside the WASD block and isn't column-mate to the standalone zoom stack.
  const columnAligned = (a, c) => {
    const A = rect(a), C = rect(c);
    return Math.min(A.r, C.r) - Math.max(A.l, C.l) > 0;
  };
  const byName = Object.fromEntries(boxes.map((b) => [b.name, b]));
  for (const [a, c] of STACK_PAIRS) {
    if (!byName[a] || !byName[c]) continue;
    if (!columnAligned(byName[a], byName[c])) {
      console.log(`  ~ ${a} → ${c}: not column-aligned at this breakpoint (skipped)`);
      continue;
    }
    const g = verticalGap(byName[a], byName[c]);
    if (g < 0) continue;
    const rounded = Math.round(g);
    if (rounded > 0 && rounded % 3 !== 0) {
      failures.push(`9b ${label}: ${a} → ${c} gap=${rounded}px (not a multiple of 3)`);
    } else {
      console.log(`  ✓ ${a} → ${c}: ${rounded}px`);
    }
  }

  await browser.close();
  return failures;
}

const fails = [
  ...(await audit(414, 900, "mobile")),
  ...(await audit(820, 1180, "tablet")),
];
if (fails.length) {
  console.log("\nFAIL:");
  for (const f of fails) console.log("  ✗ " + f);
  process.exit(1);
}
console.log("\nAll layout checks passed.");
