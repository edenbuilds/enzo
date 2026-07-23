<div align="center">
  <img src="plugins/enzo/assets/enzo-logo.svg" alt="Enzo" width="260" />

# Borrow world-class judgment. Keep the final say.

Enzo is a founder decision studio. It turns company context and evidence into structured disagreement, a founder-owned decision, an editable memo, and an outcome the company can learn from.

[Open the decision demo](https://tryenzo.vercel.app/home) · [Experience audit](https://tryenzo.vercel.app/audit/new) · [Architecture](docs/enzo/02-system-architecture.md) · [Avenir design system](docs/design.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/enzo-workspace-dark.svg">
  <img src="docs/assets/enzo-workspace.svg" alt="Enzo audit workspace preview showing evidence-led findings and a decisive Vision Brief" width="100%">
</picture>

## Why Enzo

Most AI cofounders collapse research, opinion, strategy, and recommendation into one confident answer. Enzo keeps them separate.

Every material finding carries evidence or declares itself as inference. Once the current experience is understood, Enzo asks only the questions that remain unresolved and turns the founder's decision into a Vision Brief that design, product, and engineering can use without translation.

The first production slice carries one question—“What should this product promise first?”—through company memory, a reality scan, three sealed lens analyses, structured disagreement, founder choice, editable artifacts, and the Decision Ledger. Named lenses are disclosed methodological perspectives, never celebrity role-play or claimed endorsements.

## What ships in this repository

- A polished Next.js workspace using the Avenir editorial design system.
- A remote MCP service with the original nine audit tools plus ten decision tools.
- A portable twelve-skill decision graph, the original audit skill, and three provenance-gated lens packs.
- A repository-local Codex plugin marketplace.
- Backward-compatible audit contracts plus versioned founder, company, evidence-claim, decision, council, artifact, experiment, and outcome schemas.
- Safe public-URL capture with redirect revalidation, private-network blocking, response limits, desktop/mobile Playwright captures, and untrusted-content handling.
- Supabase Auth, OAuth 2.1 integration points, private storage, migrations, and ownership-based RLS.
- OpenAI Responses API enrichment with `gpt-5.6-terra` as the configurable default.
- Unit, contract, browser, accessibility-oriented, skill, and plugin validation.

## Founder decision flow

1. Capture founder constraints and a structured company model.
2. Add a public URL, screenshot, PDF, repository reference, visual reference, or local codebase fact.
3. Run the existing experience audit as the reality scan; keep facts, assumptions, and gaps visible.
4. Route the smallest useful council and seal each first-round analysis independently.
5. Expose agreement and material dissent, then ask the founder to choose.
6. Edit the Decision Memo and 30-day plan, revisit the Ledger, and record the outcome.

The public route uses realistic deterministic fixture data and does not persist. When Supabase is configured, studio routes require authentication and hosted mutations fail closed if private persistence is unavailable.

## Quick start

Requirements: Node.js 20.9+, pnpm 9+, and optional Supabase/OpenAI credentials.

```bash
git clone https://github.com/edenbuilds/enzo.git
cd enzo
cp .env.example .env.local
pnpm install
pnpm dev:web
```

Open [http://localhost:3000](http://localhost:3000). With no credentials, Enzo intentionally starts in deterministic demo mode.

Run the MCP service separately:

```bash
pnpm dev:mcp
curl http://localhost:8787/health
```

Production deployment keeps the monorepo root as the upload boundary so workspace packages resolve:

```bash
vercel link --yes --project tryenzo-mcp
vercel deploy --prod --local-config vercel.mcp.json
```

To enable browser screenshots:

```bash
pnpm exec playwright install chromium
CAPTURE_ENABLED=true pnpm dev:mcp
```

## Install the Codex plugin

Clone the repository, register its marketplace, and install Enzo:

```bash
codex plugin marketplace add "$(pwd)"
codex plugin add enzo@enzo
```

Start a new Codex task after installation so the skill and MCP tools are discovered.

## Install only the portable skill

Copy the complete graph into your agent’s skill directory:

```bash
cp -R plugins/enzo/skills/* ~/.codex/skills/
```

Every folder follows the open Agent Skills format and can run without Enzo’s MCP service. To install only the original audit workroom, copy `plugins/enzo/skills/enzo`. To install only the orchestration entry point, copy `enzo-core` together with the skills it routes to.

Example prompts:

- “Use `$enzo-core` to decide what this product should promise first.”
- “Use `$reality-scan` to separate the evidence, assumptions, and missing proof.”
- “Use `$council-engine` to preserve disagreement between the routed lenses.”
- “Use Enzo to audit this landing page, then turn the finding into a founder decision.”

## Supabase setup

```bash
npx supabase start
npx supabase db reset
```

Set the public URL and publishable key in `.env.local`; keep the secret key server-side. Enable GitHub sign-in and OAuth 2.1 in the Supabase dashboard, configure the Enzo consent route, and set `SUPABASE_OAUTH_ISSUER` for the remote MCP service.

The additive migrations preserve the audit tables and add founder profiles, company models, evidence claims, immutable lens versions and council runs, decisions, artifact revisions, experiments, outcome reviews, visual references, and provenance records. Every exposed user table has ownership-based RLS. The private evidence bucket allows PNG, JPEG, WebP, and PDF files up to 20MB under a user-owned path.

## OpenAI setup

Set `OPENAI_API_KEY` only on the MCP service. `OPENAI_MODEL` defaults to `gpt-5.6-terra`. Council lenses run in independent Responses API calls before a separate synthesis pass. Captured content is passed as untrusted evidence, never as instructions. Without a key, Enzo retains deterministic execution for the public demo, development, and CI.

## Validation

```bash
pnpm validate
pnpm test:e2e
```

CI checks formatting, linting, TypeScript, unit tests, builds, browser smoke flows, a clean Supabase migration reset, and both the skill and plugin manifests.

## Security and privacy

- HTTPS targets only; credentials embedded in URLs are rejected.
- DNS results and redirects are checked against loopback, link-local, private, reserved, and multicast ranges.
- Browser subrequests are intercepted and revalidated.
- Projects, founder context, company memory, decisions, and evidence are private by default.
- Council analyses and decided snapshots are append-only; later outcomes cannot silently rewrite the original reasoning.
- Service-role keys never enter browser bundles.
- Hosted v1 does not log in to third-party products, submit forms, or ingest private hosted repositories.

Read [PRIVACY.md](PRIVACY.md) and [TERMS.md](TERMS.md).

## Current v1 boundaries

The public demo does not persist. Private beta requires Supabase credentials and OAuth. V1 does not include billing, teams, marketplace monetization, private repository OAuth, authenticated browser sessions, immersive voice, autonomous execution, celebrity chat, or white-labeling. Karpathy, Paul Graham, Taleb, and offer-design packs remain research-only; Hormozi is not in the first release.

The research gate, source pins, licensing dispositions, competitive framing, and evaluation plan live under [`docs/enzo`](docs/enzo) and [`research/upstream-manifest.json`](research/upstream-manifest.json).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security-sensitive reports should not be filed as public issues; contact the repository owner privately.

## License

[MIT](LICENSE) © 2026 Omkar Sonawane.
