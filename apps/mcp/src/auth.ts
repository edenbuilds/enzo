import { createClient } from "@supabase/supabase-js";

type AuthorizationRequest = { headers: { authorization?: string } };

export async function resolveOwnerId(request: AuthorizationRequest): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return "local-agent";
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const supabase = createClient(url, publishableKey, { auth: { persistSession: false } });
  const auth = supabase.auth as unknown as {
    getUser: (jwt: string) => Promise<{
      data: { user: { id: string } | null };
      error: unknown;
    }>;
  };
  const { data, error } = await auth.getUser(token);
  return error ? null : (data.user?.id ?? null);
}
