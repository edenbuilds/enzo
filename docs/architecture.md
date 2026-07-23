# Architecture

```mermaid
flowchart LR
    User["Founder or product designer"] --> Web["Enzo web workspace"]
    Agent["Codex or compatible agent"] --> Plugin["Enzo plugin + skill"]
    Plugin --> MCP["Remote MCP service"]
    Web --> DB["Supabase Auth, Postgres, Storage"]
    MCP --> DB
    MCP --> Capture["Safe Playwright capture"]
    MCP --> Model["OpenAI Responses API"]
    Capture --> Evidence["Versioned evidence ledger"]
    Evidence --> Audit["Audit and interview engine"]
    Model --> Audit
    Audit --> Brief["Audit report + Vision Brief"]
```

The audit core is deterministic and provider-independent. Model enrichment is optional; without an API key, Enzo runs in demo mode and still validates contracts, interview routing, exports, and plugin behavior.

The hosted service accepts public HTTPS evidence only. URL resolution is checked before every redirect and browser request to block private networks. Authenticated browsing and private hosted-repository ingestion are intentionally outside v1.
