import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { EnzoPuppy } from "@enzo/design-system";

const links = [
  ["/home", "Company home"],
  ["/workrooms/new" as Route, "Start new work"],
  ["/decisions/demo", "Open decision"],
  ["/artifacts", "Work and artifacts"],
  ["/company", "Company memory"],
  ["/ledger", "Decision ledger"],
] as const satisfies ReadonlyArray<readonly [Route, string]>;

export function StudioShell({
  children,
  active,
  demo = true,
}: {
  children: ReactNode;
  active: string;
  demo?: boolean;
}) {
  return (
    <main className="studio-frame">
      <aside className="studio-nav">
        <Link className="wordmark wordmark--light" href="/">
          <span aria-hidden="true" className="wordmark__puppy"><EnzoPuppy /></span>
          <b>Enzo</b>
        </Link>
        <nav aria-label="Founder studio">
          {links.map(([href, label]) => (
            <Link aria-current={active === href ? "page" : undefined} href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="studio-nav__foot">
          <EnzoPresence state="listening" />
          {demo ? <span className="demo-note">Public fixture · changes do not persist</span> : null}
        </div>
      </aside>
      <div className="studio-canvas">{children}</div>
    </main>
  );
}

export function EnzoPresence({
  state,
}: {
  state:
    | "listening"
    | "investigating"
    | "bringing-evidence"
    | "challenging"
    | "warning"
    | "waiting"
    | "ready"
    | "reviewing";
}) {
  const labels = {
    listening: "Enzo is listening",
    investigating: "Enzo is investigating",
    "bringing-evidence": "Enzo brought back evidence",
    challenging: "Enzo is challenging an assumption",
    warning: "Enzo has identified a risk",
    waiting: "Enzo is waiting for your decision",
    ready: "Enzo is ready to execute",
    reviewing: "Enzo is reviewing the outcome",
  };
  return (
    <div className={`enzo-presence enzo-presence--${state}`} role="status">
      <span className="enzo-presence__mark" aria-hidden="true">
        <EnzoPuppy state={state} />
      </span>
      <span>{labels[state]}</span>
    </div>
  );
}
