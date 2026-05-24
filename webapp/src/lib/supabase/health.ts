import { getSupabasePublicEnv } from "@/lib/env/server";

type SupabaseHealth =
  | {
      status: "configured";
      message: string;
    }
  | {
      status: "setup-needed";
      message: string;
    }
  | {
      status: "error";
      message: string;
    };

export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  const env = getSupabasePublicEnv();

  if (!env) {
    return {
      status: "setup-needed",
      message: "Supabase URL and anon key are not configured yet.",
    };
  }

  try {
    const response = await fetch(`${env.url}/rest/v1/`, {
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "error",
        message: `Supabase responded with HTTP ${response.status}.`,
      };
    }

    return {
      status: "configured",
      message: "Supabase REST endpoint is reachable.",
    };
  } catch {
    return {
      status: "error",
      message: "Supabase REST endpoint could not be reached.",
    };
  }
}

