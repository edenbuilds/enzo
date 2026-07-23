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
    Evidence --> Audit["Reality scan + audit engine"]
    Model --> Council["Independent lens passes"]
    Audit --> Council
    Council --> Disagreement["Sealed disagreement + synthesis"]
    Disagreement --> Choice["Founder choice"]
    Choice --> Artifact["Decision Memo + 30-day plan"]
    Artifact --> Ledger["Decision Ledger + outcome review"]
```

The audit core remains backward compatible. The decision core is provider-independent: fixture execution powers the non-persistent public demo, while hosted execution uses independent Responses API calls and ownership-scoped Supabase repositories. Authenticated production fails closed when private persistence is unavailable.

The hosted service accepts public HTTPS evidence only. URL resolution is checked before every redirect and browser request to block private networks. Authenticated browsing and private hosted-repository ingestion are intentionally outside v1.
