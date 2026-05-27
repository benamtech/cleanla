import { NextResponse } from "next/server";
import { parseOrganizationInput } from "@/features/organizations/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

  const parsed = parseOrganizationInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const admin = createAdminClient();
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      ...parsed.data,
      status: "pending_review",
      created_by: user.id,
    })
    .select("id, status")
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: "ORGANIZATION_CREATE_FAILED" }, { status: 500 });
  }

  const { error: memberError } = await admin.from("organization_members").insert({
    organization_id: org.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    await admin.from("organizations").delete().eq("id", org.id);
    return NextResponse.json({ error: "ORGANIZATION_MEMBER_CREATE_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ id: org.id, status: org.status }, { status: 201 });
}
