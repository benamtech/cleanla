type EnvStatus = {
  ok: boolean;
  missing: string[];
};

const requiredPublicEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const requiredServerEnv = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

function checkRequiredEnv(names: readonly string[]): EnvStatus {
  const missing = names.filter((name) => !process.env[name]);

  return {
    ok: missing.length === 0,
    missing,
  };
}

export function getPublicEnvStatus(): EnvStatus {
  return checkRequiredEnv(requiredPublicEnv);
}

export function getServerEnvStatus(): EnvStatus {
  return checkRequiredEnv(requiredServerEnv);
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return {
    url,
    anonKey,
  };
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

