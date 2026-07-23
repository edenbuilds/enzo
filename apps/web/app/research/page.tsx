import { createFixtureStudio } from "@enzo/decision-core";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";
export const metadata = { title: "Research Board" };
export default async function ResearchPage() {
  const principal = await getWorkspacePrincipal();
  const studio = createFixtureStudio(principal.ownerId);
  return (
    <StudioShell active="/research" demo={principal.demo}>
      <header className="studio-header">
        <div>
          <p className="eyebrow">Research board</p>
          <h1>Evidence before perspective.</h1>
        </div>
        <span className="tag">3 claims · 1 visual reference</span>
      </header>
      <section className="research-board">
        {studio.claims.map((claim) => (
          <article key={claim.id}>
            <span className={`claim-class claim-class--${claim.classification}`}>
              {claim.classification}
            </span>
            <h2>{claim.statement}</h2>
            <p>
              {claim.sourceLabel} · {claim.freshness}
            </p>
            {claim.citations.map((citation) => (
              <a
                className="text-link"
                href={citation.url}
                key={citation.id}
                rel="noreferrer"
                target="_blank"
              >
                Inspect source
              </a>
            ))}
          </article>
        ))}
        <article className="visual-reference">
          <div className="visual-reference__sample">
            <span>EI</span>
            <strong>
              Decision
              <br />
              before
              <br />
              decoration.
            </strong>
          </div>
          <div>
            <span className="eyebrow">Visual reference · Enzo live</span>
            <h2>A restrained editorial system builds authority without command-center theater.</h2>
            <dl>
              <div>
                <dt>Relevant</dt>
                <dd>Type hierarchy, evidence labels, spacious decision sequences</dd>
              </div>
              <div>
                <dt>Do not copy</dt>
                <dd>Reference imagery or layouts from third parties</dd>
              </div>
              <div>
                <dt>Rights</dt>
                <dd>Enzo-owned interface capture</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>
    </StudioShell>
  );
}
