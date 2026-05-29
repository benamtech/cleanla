import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// DEV ONLY. One-click sign-in for local testing: mints a magic-link token for
// the target account via the service role, verifies it server-side so the
// @supabase/ssr session lands in cookies, then redirects. Hard-404s in
// production so it can never become an auth bypass.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email") ?? "juan@example.com";
  const next = url.searchParams.get("next") ?? "/";

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const tokenHash = data?.properties?.hashed_token;
  if (error || !tokenHash) {
    return NextResponse.json(
      { error: error?.message ?? `No login token for ${email} (does the account exist?).` },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: tokenHash,
  });
  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
