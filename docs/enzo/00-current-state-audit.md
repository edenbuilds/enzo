# Enzo current-state audit

## What exists

Enzo is a pnpm TypeScript monorepo with a Next.js 16 web product, an Express remote MCP service, shared Zod contracts, the Enzo Broadsheet design-system package, Supabase migrations, a repository-local Codex plugin, and portable Agent Skills. The public release is deployed at `tryenzo.vercel.app`; the MCP endpoint is deployed separately at `tryenzo-mcp.vercel.app/mcp`.

The current information architecture covers a landing page, workspace dashboard, audit intake, evidence-backed audit report, adaptive vision interview, and public Vision Brief. The first working loop is: ingest current product evidence, diagnose it, resolve contradictions, create a brief, and expose an explicit next action.

## Data and AI architecture

`@enzo/audit-core` owns versioned schemas for projects, evidence, captures, audit runs, findings, citations, coverage gaps, scorecards, opportunities, question rounds, answers, Vision Briefs, exports, and jobs. Audit runs use deterministic idempotency keys. The MCP service exposes nine tools over Streamable HTTP. It uses deterministic fixtures without credentials and the Responses API for optional structured enrichment. Supabase provides the intended auth, ownership, private-storage, and RLS boundary.

## Visual system

Enzo Broadsheet is implemented as framework-independent CSS tokens plus Tailwind v4 mappings. EB Garamond and Figtree create the editorial hierarchy. Lumen Cream, Vast Ink, Lavender Whisper, Forest Ink, and Ember Glow are consistent across product and documentation.

## What works

- Public URL safety checks, redirect revalidation, byte/time limits, and hostile-content separation.
- Evidence-linked findings with explicit inference labeling.
- Adaptive two-to-four-round interview logic and contradiction handling.
- Vision Brief and report export contracts.
- Plugin and standalone skill installation paths.
- Formatting, linting, types, 16 core tests, four browser journeys, builds, and official validators.

## What is mocked or incomplete

- Hosted persistence is wired at the schema and policy layer, but the MCP runtime currently uses an in-memory store unless expanded to the Supabase repository implementation.
- PDF export is print-oriented rather than a queued binary export pipeline.
- Live external research, company memory, routed lenses, council independence, disagreement, artifact editing, and the Decision Ledger are not implemented yet.
- OAuth configuration requires hosted Supabase credentials.
- Browser capture is disabled in the serverless environment unless a compatible browser runtime is provisioned.

## Thesis gap

The shipped wedge is an experience interrogation product. The larger Enzo thesis is a founder decision studio and company-building operating system. The missing center is not another chat surface. It is the persistent loop connecting company context, current evidence, independently reasoned lenses, founder choice, generated artifacts, a review date, and measured outcome.

## Preserve

Preserve the Broadsheet system, evidence taxonomy, safe ingestion, adaptive questioning, Vision Brief format, portable skills, MCP contracts, and private-by-default data boundary.

## Refactor next

Generalize `Project` into founder and company context, add source freshness and perspective provenance, introduce Decision and Artifact aggregates, replace the memory store in hosted production, and make audit one workroom inside the broader Enzo system rather than the product identity.
