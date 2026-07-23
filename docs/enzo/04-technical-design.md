# Technical design

`@enzo/decision-core` owns versioned schemas, deterministic fixture orchestration, workflow validation, lens metadata, artifact rendering, and repository interfaces. `@enzo/audit-core` continues to own evidence capture and experience diagnosis.

Supabase stores founder/company models, normalized claims, decisions, immutable council runs, append-only artifact revisions, experiments, outcomes, visual references, and provenance. Every private row carries `user_id`; RLS combines the authenticated role with `auth.uid()` ownership. Global lens versions are read-only to clients.

The MCP surface retains all audit tools and adds founder, company, decision, council, artifact, ledger, and outcome tools. Mutation handlers validate owner identity and Zod schemas. Council idempotency is derived from the decision, evidence revision, and selected lens versions.

The first model provider remains the Responses API. The provider boundary accepts a structured task, reviewed lens version, evidence claims, and output schema. Deterministic fixtures execute the identical workflow without credentials. Browser capture stays optional in serverless deployments.

Context budgeting prioritizes the decision contract, claims cited by the router, compact company/founder summaries, and only the selected lens references. Raw files remain in private storage and are retrieved in bounded excerpts.
