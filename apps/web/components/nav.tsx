import Link from "next/link";
import type { Route } from "next";
import { EnzoPuppy } from "@enzo/design-system";

export function Nav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? "nav nav--compact" : "nav"} aria-label="Primary navigation">
      <Link className="wordmark" href="/">
        <span aria-hidden="true" className="wordmark__puppy"><EnzoPuppy /></span>
        <b>Enzo</b>
      </Link>
      <div className="nav__links">
        <Link href={"/decisions/demo" as Route}>Worked example</Link>
        <Link href={"/workrooms/forward-deployed-engineering" as Route}>Engineering</Link>
        <Link className="nav__cta" href="/api/auth/signin">
          Enter workspace
        </Link>
      </div>
    </nav>
  );
}
