import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { OrganizationReviewActions } from "./OrganizationReviewActions";

export const dynamic = "force-dynamic";

type OrganizationRow = {
  id: string;
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  street_address: string;
  business_category: string;
  description: string;
  status: string;
  created_at: string;
};

export default async function AdminOrganizationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const { data } = await admin
    .from("organizations")
    .select(
      "id, name, contact_name, contact_email, contact_phone, street_address, business_category, description, status, created_at",
    )
    .in("status", ["pending_review", "rejected"])
    .order("created_at", { ascending: true })
    .returns<OrganizationRow[]>();

  const rows = data ?? [];

  return (
    <main className="min-h-[100dvh] bg-white safe-top safe-x">
      <div className="flex h-[27px] items-center border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          ORGANIZATION REVIEW
        </h1>
        <span className="ml-[9px] text-[12px] text-white opacity-75">
          {rows.length} ITEM{rows.length === 1 ? "" : "S"}
        </span>
      </div>

      <div className="p-[18px]">
        {rows.length === 0 ? (
          <p className="border border-[#999999] p-[18px] text-[12px] text-[#999999] uppercase">
            NO ORGANIZATIONS NEED REVIEW.
          </p>
        ) : (
          <table className="w-full border-collapse border border-[#999999] text-[12px]">
            <thead>
              <tr className="bg-[#f8eac7]">
                <th className="border border-[#999999] p-[6px] text-left text-[#001089] uppercase">
                  BUSINESS
                </th>
                <th className="border border-[#999999] p-[6px] text-left text-[#001089] uppercase">
                  CONTACT
                </th>
                <th className="border border-[#999999] p-[6px] text-left text-[#001089] uppercase">
                  ADDRESS
                </th>
                <th className="border border-[#999999] p-[6px] text-left text-[#001089] uppercase">
                  STATUS
                </th>
                <th className="border border-[#999999] p-[6px] text-left text-[#001089] uppercase">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((org) => (
                <tr key={org.id}>
                  <td className="border border-[#999999] p-[6px] text-[#001089]">
                    <strong className="uppercase">{org.name}</strong>
                    <p className="text-[#999999] uppercase">
                      {org.business_category}
                    </p>
                    <p>{org.description}</p>
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#001089]">
                    <p>{org.contact_name}</p>
                    <p>{org.contact_email}</p>
                    <p>{org.contact_phone}</p>
                  </td>
                  <td className="border border-[#999999] p-[6px] text-[#001089]">
                    {org.street_address}
                  </td>
                  <td className="border border-[#999999] p-[6px] font-bold text-[#c7a87d] uppercase">
                    {org.status}
                  </td>
                  <td className="border border-[#999999] p-[6px]">
                    <OrganizationReviewActions orgId={org.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
