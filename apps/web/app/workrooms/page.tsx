import Link from "next/link";
import type { Route } from "next";
import { WORKROOMS } from "@enzo/decision-core";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Workrooms" };
export default async function WorkroomsPage() {
  const principal = await getWorkspacePrincipal();
  return (
    <StudioShell active="/workrooms" demo={principal.demo}>
      <header className="catalog-hero"><div><p className="eyebrow">Workrooms</p><h1>Start with the outcome, then assemble the help.</h1></div><Link className="button button--accent" href={"/workrooms/new" as Route}>Compose a workroom</Link></header>
      <section className="workroom-grid" data-testid="workroom-catalog">
        {WORKROOMS.map((workroom, index) => (
          <article className={workroom.id === "forward-deployed-engineering" ? "workroom-card workroom-card--featured" : "workroom-card"} key={workroom.id}>
            <span className="workroom-card__number">0{index + 1}</span><span className="status-pill">{workroom.executionMode}</span>
            <h2>{workroom.displayName}</h2><p>{workroom.summary}</p>
            <div><span className="eyebrow">Produces</span><p>{workroom.artifactTypes.join(", ")}</p></div>
            <Link className="text-link" href={(workroom.id === "forward-deployed-engineering" ? "/workrooms/forward-deployed-engineering" : "/workrooms/new") as Route}>Open workroom</Link>
          </article>
        ))}
      </section>
    </StudioShell>
  );
}
