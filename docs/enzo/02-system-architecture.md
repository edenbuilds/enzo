# System architecture

Enzo separates company truth, decision workflow, perspective methodology, and model execution.

```mermaid
flowchart LR
  Founder[Founder] --> Web[Next.js studio]
  Agent[Codex or MCP client] --> MCP[Remote MCP]
  Web --> Domain[Decision core]
  MCP --> Domain
  Domain --> Repo[Decision repository]
  Repo --> Fixture[Public fixture]
  Repo --> Supabase[Supabase + RLS]
  Domain --> Router[Brain router]
  Router --> Independent[Independent lens passes]
  Independent --> Disagreement[Disagreement pass]
  Disagreement --> Synthesis[Enzo synthesis]
  Synthesis --> Artifact[Artifact engine]
  Artifact --> Ledger[Decision Ledger]
  Evidence[Untrusted evidence] --> Reality[Reality scan]
  Reality --> Domain
```

The model provider receives four isolated layers: immutable Enzo policy, workflow contract, reviewed lens methodology, and escaped untrusted evidence. No captured instruction can change the first three layers. Each independent lens pass is persisted before peer analyses are visible.

The public demo uses `FixtureDecisionRepository`. Authenticated MCP calls use the caller's JWT with `SupabaseDecisionRepository`; missing hosted persistence fails closed. Existing audit schemas and tools remain backward compatible.
