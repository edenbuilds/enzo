import { createFixtureStudio } from "@enzo/decision-core";
import { OutcomeReview } from "@/components/outcome-review";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";
export const metadata = { title: "Decision Ledger" };
export default async function LedgerPage() {
  const principal = await getWorkspacePrincipal();
  const { decision, council } = createFixtureStudio(principal.ownerId);
  return (
    <StudioShell active="/ledger" demo={principal.demo}>
      <header className="studio-header">
        <div>
          <p className="eyebrow">Decision Ledger</p>
          <h1>Remember what was decided, and whether it worked.</h1>
        </div>
        <span className="tag">1 open review</span>
      </header>
      <article className="ledger-entry">
        <div className="ledger-entry__index">01</div>
        <div>
          <p className="eyebrow">Product direction · Reversible</p>
          <h2>{decision.question}</h2>
          <p>{council.synthesis}</p>
          <div className="ledger-meta">
            <span>
              <b>Expected</b>
              {decision.successMetric}
            </span>
            <span>
              <b>Review date</b>01 September 2026
            </span>
            <span>
              <b>Confidence</b>
              {Math.round(council.confidence * 100)}%
            </span>
          </div>
          <details>
            <summary>Decision record</summary>
            <p>
              <b>Assumptions:</b> {decision.assumptions.join(" ")}
            </p>
            <p>
              <b>Dissent:</b> {council.dissent}
            </p>
          </details>
          <OutcomeReview />
        </div>
      </article>
    </StudioShell>
  );
}
