# Contributing to Enzo

Use Node.js 20.9+ and pnpm 9. Create focused branches and keep evidence contracts backward-compatible within a schema version.

```bash
pnpm install
pnpm validate
pnpm test:e2e
```

Design changes must use Avenir tokens, include keyboard and responsive states, and preserve reduced-motion behavior. Skill changes must keep `SKILL.md` below 500 lines and use one-level references. Database changes must be created through `supabase migration new`, enable RLS on exposed tables, and include ownership tests.

Do not commit credentials, captures containing private data, `.env` files, or generated reports with customer evidence.
