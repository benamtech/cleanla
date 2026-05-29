// Bootstrap a live admin/test account (default: @Juan) for MVP demos.
//
// Idempotent: safe to re-run. It will
//   1. create (or find) the Supabase auth user for ADMIN_EMAIL,
//   2. upsert the public.profiles row with the username + is_admin = true,
//   3. print a one-click magic sign-in link so a demo operator can log in
//      without needing to receive the OTP email.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   ADMIN_EMAIL=juan@example.com ADMIN_USERNAME=Juan \
//   node scripts/bootstrap-admin.mjs
//
// Env (NEXT_PUBLIC_* fallbacks are read so an existing .env.local just works):
//   SUPABASE_URL | NEXT_PUBLIC_SUPABASE_URL      (required)
//   SUPABASE_SERVICE_ROLE_KEY                     (required, secret)
//   ADMIN_EMAIL                                   (required)
//   ADMIN_USERNAME                                (default: Juan)
//   SITE_URL | NEXT_PUBLIC_SITE_URL               (default: http://localhost:3000)

import { createClient } from "@supabase/supabase-js";

const USERNAME_RE = /^[A-Za-z0-9_-]{3,24}$/;

function requireEnv(...names) {
  for (const n of names) {
    if (process.env[n]) return process.env[n];
  }
  console.error(`✕ Missing required env: ${names.join(" | ")}`);
  process.exit(1);
}

const SUPABASE_URL = requireEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const ADMIN_EMAIL = requireEnv("ADMIN_EMAIL");
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "Juan").trim();
const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

if (!USERNAME_RE.test(ADMIN_USERNAME)) {
  console.error(
    `✕ ADMIN_USERNAME "${ADMIN_USERNAME}" is invalid (3-24 chars; letters, numbers, _ and - only).`,
  );
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  const target = email.toLowerCase();
  // listUsers paginates (default 50/page); walk until found or exhausted.
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === target);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
}

async function ensureAuthUser() {
  const { data, error } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    email_confirm: true,
  });
  if (!error && data.user) {
    console.log(`✓ created auth user  ${ADMIN_EMAIL}  (${data.user.id})`);
    return data.user;
  }
  // Already registered → fetch the existing user.
  const existing = await findUserByEmail(ADMIN_EMAIL);
  if (existing) {
    console.log(`• auth user exists   ${ADMIN_EMAIL}  (${existing.id})`);
    return existing;
  }
  throw error ?? new Error("Could not create or find the auth user.");
}

async function upsertAdminProfile(userId) {
  // Guard: refuse if the username is already held by a *different* user.
  const { data: clash, error: clashErr } = await admin
    .from("profiles")
    .select("id")
    .ilike("username", ADMIN_USERNAME)
    .neq("id", userId)
    .maybeSingle();
  if (clashErr) throw clashErr;
  if (clash) {
    throw new Error(
      `Username "${ADMIN_USERNAME}" is already taken by another account (${clash.id}).`,
    );
  }

  const { error } = await admin.from("profiles").upsert(
    {
      id: userId,
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      is_admin: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw error;
  console.log(`✓ profile upserted   @${ADMIN_USERNAME}  is_admin=true`);
}

function printSignInLink() {
  // The app is PKCE/@supabase/ssr (cookie) based. A raw GoTrue magic link is an
  // implicit-flow #fragment link the stack can't consume, so it does NOT sign you
  // in. The dev-only /dev-login route verifies a token server-side and writes the
  // session cookie — that's the link that actually works locally.
  const devLogin = `${SITE_URL}/dev-login?email=${encodeURIComponent(ADMIN_EMAIL)}`;
  console.log("\n── ONE-CLICK SIGN-IN (open in the demo browser) ──");
  console.log(devLogin);
  console.log("  (dev only — /dev-login hard-404s in production)");
}

async function main() {
  console.log(`Bootstrapping admin @${ADMIN_USERNAME} <${ADMIN_EMAIL}>`);
  console.log(`  → ${SUPABASE_URL}\n`);
  const user = await ensureAuthUser();
  await upsertAdminProfile(user.id);
  await printSignInLink();
  console.log("\n✓ done — account is a live admin and ready for the MVP demo.");
}

main().catch((err) => {
  console.error(`\n✕ bootstrap failed: ${err.message ?? err}`);
  process.exit(1);
});
