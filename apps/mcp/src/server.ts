import cors from "cors";
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { resolveOwnerId } from "./auth.js";
import { createToolServer } from "./tools.js";

export const app = express();
const port = Number(process.env.MCP_PORT ?? 8787);
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL ?? "https://tryenzo.vercel.app" }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => response.json({ status: "ok", service: "enzo-mcp" }));

app.get("/.well-known/oauth-protected-resource", (_request, response) => {
  const issuer = process.env.SUPABASE_OAUTH_ISSUER;
  response.json({
    resource:
      process.env.MCP_PUBLIC_URL ??
      (process.env.VERCEL === "1"
        ? "https://tryenzo-mcp.vercel.app/mcp"
        : `http://localhost:${port}/mcp`),
    authorization_servers: issuer ? [issuer] : [],
    scopes_supported: ["openid", "profile", "email"],
  });
});

app.post("/mcp", async (request, response) => {
  const ownerId = await resolveOwnerId(request);
  if (!ownerId) {
    response
      .status(401)
      .set("WWW-Authenticate", 'Bearer resource_metadata="/.well-known/oauth-protected-resource"')
      .json({ error: "authentication_required" });
    return;
  }
  const server = createToolServer(ownerId);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  response.on("close", () => {
    void transport.close();
    void server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(request, response, request.body);
});

if (process.env.VERCEL !== "1") {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Enzo MCP listening on :${port}`);
  });
}
