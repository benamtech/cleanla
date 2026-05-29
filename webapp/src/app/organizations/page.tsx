import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { OrganizationSignupForm } from "./OrganizationSignupForm";

export const dynamic = "force-dynamic";

type MembershipRow = {
  organization_id: string;
  role: string;
  organizations: {
    id: string;
    name: string;
    status: string;
    business_category: string;
  } | null;
};

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("organization_id, role, organizations(id, name, status, business_category)")
    .eq("user_id", user.id)
    .returns<MembershipRow[]>();

  return (
    <main className="min-h-[100dvh] bg-white pt-[calc(18px_+_env(safe-area-inset-top))] pr-[calc(18px_+_env(safe-area-inset-right))] pb-[calc(18px_+_env(safe-area-inset-bottom))] pl-[calc(18px_+_env(safe-area-inset-left))]">
      <section className="mx-auto grid max-w-[840px] gap-[18px]">
        <div className="border border-[#999999]">
          <div className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
            <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
              ORGANIZATIONS
            </h1>
            <Link
              href="/"
              className="tap-44 border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
            >
              [MAP]
            </Link>
          </div>
          <div className="p-[9px] text-[9px] tracking-[0.03em] text-[#001089] uppercase">
            LOCAL BUSINESSES CAN CREATE REWARDS AFTER ADMIN APPROVAL.
          </div>
        </div>

        <div className="grid gap-[9px]">
          {(data ?? []).map((membership) =>
            membership.organizations ? (
              <Link
                key={membership.organization_id}
                href={`/organizations/${membership.organization_id}`}
                className="block border border-[#999999] p-[9px] hover:bg-[#f8eac7]"
              >
                <p className="text-[15px] font-bold tracking-[0.03em] text-[#001089] uppercase">
                  {membership.organizations.name}
                </p>
                <p className="text-[9px] tracking-[0.03em] text-[#999999] uppercase">
                  {membership.organizations.business_category} /{" "}
                  {membership.organizations.status}
                </p>
              </Link>
            ) : null,
          )}
        </div>

        <OrganizationSignupForm />
      </section>
    </main>
  );
}
