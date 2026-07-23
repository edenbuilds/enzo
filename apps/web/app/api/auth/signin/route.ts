import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(new URL("/home?mode=demo", origin));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${origin}/auth/callback?next=/home` },
  });
  if (error || !data.url) return NextResponse.redirect(new URL("/?auth=failed", origin));
  return NextResponse.redirect(data.url);
}
