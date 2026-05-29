import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublicEnvStatus, getServerEnvStatus, getSiteUrl } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkSupabaseHealth } from "@/lib/supabase/health";

export const dynamic = "force-dynamic";

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={
        ok
          ? "border border-[#999999] bg-[#228B22] px-[6px] py-[3px] text-[9px] font-bold uppercase tracking-[0.03em] text-white"
          : "border border-[#999999] bg-[#a60315] px-[6px] py-[3px] text-[9px] font-bold uppercase tracking-[0.03em] text-white"
      }
    >
      {ok ? "OK" : "SETUP NEEDED"}
    </span>
  );
}

function HealthRow({
  label,
  detail,
  ok,
}: {
  label: string;
  detail: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-[12px] border-b border-[#999999] px-[9px] py-[9px] last:border-b-0">
      <div>
        <h2 className="text-[12px] font-bold uppercase tracking-[0.03em] text-[#001089]">
          {label}
        </h2>
        <p className="mt-[3px] break-all text-[12px] text-[#001089]">{detail}</p>
      </div>
      <StatusPill ok={ok} />
    </div>
  );
}

function formatMissing(missing: string[]) {
  if (missing.length === 0) return "all required variables present";
  return missing.join(", ");
}

export default async function HealthPage() {
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

  const publicEnv = getPublicEnvStatus();
  const serverEnv = getServerEnvStatus();
  const supabaseHealth = await checkSupabaseHealth();
  const deploymentLabel = process.env.VERCEL ? "Vercel" : "Local";

  return (
    <div className="min-h-[100dvh] bg-white safe-top safe-x">
      <header className="flex h-[27px] items-center justify-between border-b border-[#999999] bg-[#94a3d6] px-[9px]">
        <span className="text-[15px] font-bold uppercase tracking-[0.03em] text-white">
          [CLEANLA] · [ADMIN] · [HEALTH]
        </span>
        <Link
          href="/"
          className="text-[9px] uppercase tracking-[0.03em] text-white no-underline hover:bg-[#001089] hover:px-[3px]"
        >
          [← back to site]
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[720px] px-[12px] py-[18px]">
        <h1 className="mb-[12px] text-[18px] font-bold uppercase tracking-[0.03em] text-[#001089]">
          deployment health
        </h1>
        <p className="mb-[18px] text-[12px] text-[#001089]">
          internal-only check. confirms env vars are wired and supabase reachable
          before debugging deeper.
        </p>

        <div className="border border-[#999999] bg-white">
          <HealthRow
            label="environment"
            detail={deploymentLabel}
            ok
          />
          <HealthRow
            label="public env"
            detail={formatMissing(publicEnv.missing)}
            ok={publicEnv.ok}
          />
          <HealthRow
            label="server env"
            detail={formatMissing(serverEnv.missing)}
            ok={serverEnv.ok}
          />
          <HealthRow
            label="supabase"
            detail={supabaseHealth.message}
            ok={supabaseHealth.status === "configured"}
          />
          <HealthRow
            label="deployment url"
            detail={getSiteUrl()}
            ok={Boolean(process.env.NEXT_PUBLIC_SITE_URL)}
          />
        </div>
      </main>
    </div>
  );
}
