import { getPublicEnvStatus, getServerEnvStatus, getSiteUrl } from "@/lib/env/server";
import { checkSupabaseHealth } from "@/lib/supabase/health";

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={ok ? "badge badge-ok" : "badge badge-warn"}>
      {ok ? "OK" : "Setup needed"}
    </span>
  );
}

function formatMissing(missing: string[]) {
  if (missing.length === 0) {
    return "All required variables are present.";
  }

  return missing.join(", ");
}

export default async function Home() {
  const publicEnv = getPublicEnvStatus();
  const serverEnv = getServerEnvStatus();
  const supabaseHealth = await checkSupabaseHealth();
  const deploymentLabel = process.env.VERCEL ? "Vercel" : "Local";

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col justify-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
          CleanLA foundation
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">CleanLA</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
          Phase 1 boilerplate is in place. This screen stays intentionally small until
          the map MVP begins.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="health-row">
            <div>
              <h2>Environment</h2>
              <p>{deploymentLabel}</p>
            </div>
            <StatusBadge ok />
          </div>

          <div className="health-row">
            <div>
              <h2>Public env</h2>
              <p>{formatMissing(publicEnv.missing)}</p>
            </div>
            <StatusBadge ok={publicEnv.ok} />
          </div>

          <div className="health-row">
            <div>
              <h2>Server env</h2>
              <p>{formatMissing(serverEnv.missing)}</p>
            </div>
            <StatusBadge ok={serverEnv.ok} />
          </div>

          <div className="health-row">
            <div>
              <h2>Supabase</h2>
              <p>{supabaseHealth.message}</p>
            </div>
            <StatusBadge ok={supabaseHealth.status === "configured"} />
          </div>

          <div className="health-row">
            <div>
              <h2>Deployment URL</h2>
              <p>{getSiteUrl()}</p>
            </div>
            <StatusBadge ok={Boolean(process.env.NEXT_PUBLIC_SITE_URL)} />
          </div>
        </div>
      </section>
    </main>
  );
}

