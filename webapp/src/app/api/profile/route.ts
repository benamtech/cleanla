import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const USERNAME_RE = /^[A-Za-z0-9_-]{3,24}$/;

/**
 * POST /api/profile — idempotent upsert of the profile row.
 * Called once after auth callback to ensure profiles has a row for the user.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    return NextResponse.json(
      { error: "PROFILE_CREATE_FAILED" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

/**
 * PATCH /api/profile — update mutable profile fields (username, for now).
 * Body: { username: string }
 *
 * Validates against the same regex as the DB CHECK constraint
 * (profiles_username_format_chk) so the user gets a useful error before the
 * DB rejects it. Uniqueness is enforced by the partial unique index
 * (profiles_username_lower_unique_idx) — case-insensitive collisions
 * surface as a 409.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }

  const rawUsername =
    typeof body === "object" && body !== null && "username" in body
      ? (body as { username: unknown }).username
      : null;

  if (typeof rawUsername !== "string") {
    return NextResponse.json({ error: "USERNAME_REQUIRED" }, { status: 400 });
  }

  const username = rawUsername.trim();
  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      {
        error: "USERNAME_FORMAT",
        message: "3-24 chars; letters, numbers, _ and - only.",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ username, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    // 23505 is Postgres unique_violation — username already taken.
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "USERNAME_TAKEN", message: "That username is taken." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "USERNAME_UPDATE_FAILED", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, username });
}
