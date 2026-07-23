import Link from "next/link";
import type { Route } from "next";
import { createFixtureStudio } from "@enzo/decision-core";
import { EnzoPresence, StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Company home" };

export default async function CompanyHome() {
  const principal = await getWorkspacePrincipal();
  const studio = createFixtureStudio(principal.ownerId);
  return (
    <StudioShell active="/home" demo={principal.demo}>
      <header className="studio-header">
        <div>
          <p className="eyebrow">Company home · {studio.company.name}</p>
          <h1>Your company, held in context.</h1>
        </div>
        <span className="tag">{studio.company.stage} stage</span>
      </header>
      <section className="focus-panel">
        <EnzoPresence state="challenging" />
        <p className="eyebrow">Recommended next move</p>
        <h2>Decide what Enzo should promise before expanding what it can do.</h2>
        <p>
          {studio.company.currentFocus}. The council is ready, but the final choice remains yours.
        </p>
        <Link className="button button--accent" href={"/decisions/demo" as Route}>
          Enter the Decision Room
        </Link>
      </section>
      <section className="studio-summary-grid" aria-label="Company summary">
        <article>
          <span className="eyebrow">Open decision</span>
          <strong>1</strong>
          <p>{studio.decision.question}</p>
        </article>
        <article>
          <span className="eyebrow">Evidence claims</span>
          <strong>{studio.claims.length}</strong>
          <p>Verified, researched, and hypothetical claims stay visibly separate.</p>
        </article>
        <article>
          <span className="eyebrow">Review due</span>
          <strong>01 Sep</strong>
          <p>Outcome calibration is part of the decision, not an afterthought.</p>
        </article>
      </section>
      <div className="studio-two-column">
        <section className="studio-section">
          <p className="eyebrow">Current risks</p>
          <ul className="editorial-list">
            {studio.company.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </section>
        <section className="studio-section">
          <p className="eyebrow">Latest artifacts</p>
          {studio.artifacts.map((artifact) => (
            <Link className="artifact-row" href={"/artifacts" as Route} key={artifact.id}>
              <span>{artifact.title}</span>
              <span>Draft · v{artifact.revision}</span>
            </Link>
          ))}
        </section>
      </div>
    </StudioShell>
  );
}
