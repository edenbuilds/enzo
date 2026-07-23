# Implementation log

## July 2026 foundation release

Shipped the public Enzo repository, Avenir web product, remote MCP service, Supabase schema and RLS policies, shared audit engine, plugin marketplace entry, portable skill, documentation, CI, and production deployments.

The initial product wedge interrogates an existing digital experience, preserves evidence provenance, asks adaptive questions, and creates a stakeholder-ready Vision Brief. This is intentionally narrower than the founder decision studio thesis.

## Verification

Formatting, linting, TypeScript, 16 unit/integration tests, four Chromium end-to-end journeys, Next.js and MCP builds, responsive visual inspection, portable validators, official skill validation, and official plugin validation pass locally. GitHub CI owns the clean Supabase migration reset because Docker is unavailable on the release workstation.

## Next milestone

## July 2026 founder decision vertical slice

Implemented the first complete founder decision loop for “What should this product promise first?”:

- Added `@enzo/decision-core` with versioned founder, company, evidence-claim, lens, decision, council, artifact, experiment, and outcome schemas.
- Added fixture and fail-closed authenticated Supabase repositories, additive RLS migration, immutable council runs and decision snapshots, and artifact revisions.
- Added ten MCP tools without changing the original nine audit contracts.
- Added independent Responses API lens calls followed by a separate disagreement/synthesis pass; credential-free execution remains deterministic.
- Added Company Home, Company Memory, Decision Room, Artifacts, Decision Ledger, and Research Board surfaces in Avenir.
- Added the twelve-skill Enzo graph and provenance-gated Jobs, Munger, and Enzo customer/operator lens packs.
- Recorded pinned upstream sources, license dispositions, safety boundaries, competitive framing, architecture, and evaluations before importing content. No upstream scripts or personality prose were imported.

The public fixture is intentionally non-persistent. Private beta remains gated on production Supabase credentials, OAuth configuration, migration reset, and tenant-isolation verification.
