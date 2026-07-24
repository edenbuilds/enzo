import { NextResponse } from "next/server";
import { auditPublicUrl } from "@/lib/public-audit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown; problem?: unknown };
    if (typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json({ error: "Add a public HTTPS page to inspect." }, { status: 400 });
    }
    const problem = typeof body.problem === "string" ? body.problem.slice(0, 1000) : "";
    const result = await auditPublicUrl(body.url, problem);
    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The page could not be inspected.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
