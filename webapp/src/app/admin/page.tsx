import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
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

  const [mediaResult, orgResult] = await Promise.all([
    admin
      .from("spot_media")
      .select("id", { count: "exact", head: true })
      .in("moderation_status", ["pending", "rejected"]),
    admin
      .from("organizations")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending_review", "rejected"]),
  ]);

  const links = [
    {
      href: "/admin/moderation",
      label: "MEDIA REVIEW",
      detail: `${mediaResult.count ?? 0} ITEM${mediaResult.count === 1 ? "" : "S"}`,
    },
    {
      href: "/admin/organizations",
      label: "ORGANIZATION REVIEW",
      detail: `${orgResult.count ?? 0} ITEM${orgResult.count === 1 ? "" : "S"}`,
    },
    {
      href: "/admin/health",
      label: "DEPLOYMENT HEALTH",
      detail: "ENV + SUPABASE",
    },
  ];

  return (
    <main className="min-h-[100dvh] bg-white safe-top safe-x">
      <header className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <h1 className="text-[15px] font-bold tracking-[0.03em] text-white uppercase">
          CLEANLA ADMIN
        </h1>
        <Link
          href="/"
          className="tap-45 border border-white bg-white px-[6px] py-[3px] text-[9px] font-bold tracking-[0.03em] text-[#001089] uppercase hover:bg-[#f8eac7]"
        >
          [MAP]
        </Link>
      </header>

      <section className="mx-auto grid max-w-[840px] gap-[9px] p-[18px] md:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="grid min-h-[126px] content-between border border-[#999999] bg-white p-[12px] no-underline hover:bg-[#f8eac7]"
          >
            <span className="text-[15px] font-bold tracking-[0.03em] text-[#001089] uppercase">
              {link.label}
            </span>
            <span className="text-[9px] font-bold tracking-[0.03em] text-[#999999] uppercase">
              {link.detail}
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
