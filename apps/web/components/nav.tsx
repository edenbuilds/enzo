import Link from "next/link";
import { EnzoPuppy } from "@enzo/design-system";

export function Nav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? "nav nav--compact" : "nav"} aria-label="Primary navigation">
      <Link className="wordmark" href="/">
        <span aria-hidden="true" className="wordmark__puppy"><EnzoPuppy /></span>
        <b>Enzo</b>
      </Link>
      <div className="nav__links">
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#proof">Why Enzo</Link>
        <Link className="nav__cta" href="/api/auth/signin">
          Private beta
        </Link>
      </div>
    </nav>
  );
}
