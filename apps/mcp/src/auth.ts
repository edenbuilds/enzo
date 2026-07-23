import { createClient } from "@supabase/supabase-js";

type AuthorizationRequest = { headers: { authorization?: string } };

export type AuthPrincipal = { ownerId: string; accessToken?: string; fixture: boolean };

export async function resolvePrincipal(
  request: AuthorizationRequest,
): Promise<AuthPrincipal | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return { ownerId: "local-agent", fixture: true };
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
  return error || !data.user ? null : { ownerId: data.user.id, accessToken: token, fixture: false };
}

export async function resolveOwnerId(request: AuthorizationRequest): Promise<string | null> {
  return (await resolvePrincipal(request))?.ownerId ?? null;
}
