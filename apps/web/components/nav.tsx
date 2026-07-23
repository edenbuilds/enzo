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
        <Link href={"/workrooms" as Route}>Workrooms</Link>
        <Link href={"/minds" as Route}>Minds</Link>
        <Link href={"/styles" as Route}>Styles</Link>
        <Link className="nav__cta" href="/api/auth/signin">
          Enter workspace
        </Link>
      </div>
    </nav>
  );
}
