import Link from "next/link";

export function Nav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? "nav nav--compact" : "nav"} aria-label="Primary navigation">
      <Link className="wordmark" href="/">
        <span aria-hidden="true">EI</span>
        <b>Enzo</b>
      </Link>
      <div className="nav__links">
        <Link href="/#method">Method</Link>
        <Link href="/reports/demo">Example report</Link>
        <Link className="nav__cta" href="/api/auth/signin">
          Enter workspace
        </Link>
      </div>
    </nav>
  );
}
