import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export async function getWorkspacePrincipal() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  if (!configured) return { ownerId: "demo-founder", demo: true } as const;
  const client = await createSupabaseServerClient();
  if (!client) return { ownerId: "demo-founder", demo: true } as const;
  const { data } = await client.auth.getUser();
  if (!data.user) redirect("/api/auth/signin");
  return { ownerId: data.user.id, demo: false } as const;
}
