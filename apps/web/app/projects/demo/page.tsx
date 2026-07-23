import Link from "next/link";
import { createDemoAudit, createProject } from "@enzo/audit-core";

export const metadata = { title: "Audit report" };

export default function AuditReport() {
  const project = createProject({
    ownerId: "demo",
    name: "A sharper first impression",
    targetUrl: "https://example.com",
  });
  const audit = createDemoAudit(project, [
    {
      schemaVersion: "1.0.0",
      id: "evidence-demo",
      projectId: project.id,
      kind: "url",
      title: "Homepage capture",
      sourceUrl: "https://example.com",
      content: "A representative homepage capture with product messaging and a primary action.",
      revision: 1,
      createdAt: new Date().toISOString(),
    },
  ]);
  return (
    <main className="report-shell">
      <aside className="report-sidebar">
        <Link className="wordmark" href="/dashboard">
          <span>EI</span>
          <b>Enzo</b>
        </Link>
        <div>
          <p className="eyebrow">Audit report</p>
          <h1>{project.name}</h1>
        </div>
        <nav aria-label="Report sections">
          <a href="#diagnosis">Diagnosis</a>
          <a href="#findings">Findings</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#coverage">Coverage</a>
        </nav>
        <Link className="button button--primary" href="/projects/demo/interview">
          Resolve the direction
        </Link>
      </aside>
      <article className="report-content">
        <section className="report-intro" id="diagnosis">
          <p className="eyebrow">Executive diagnosis</p>
          <h2>The experience has earned attention. It has not yet earned a decisive next move.</h2>
          <p>
            The strongest opportunity is not cosmetic. It is to connect one specific promise to
            proof and place the right action at the moment belief is highest.
          </p>
        </section>
        <section className="score-grid" aria-label="Audit scorecard">
          {Object.entries(audit.scorecard?.dimensions ?? {}).map(([label, value]) => (
            <div className="metric" key={label}>
              <p className="eyebrow">{label}</p>
              <strong>{value}/10</strong>
              <div className="meter">
                <span style={{ width: `${value * 10}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="findings" id="findings">
          <header>
            <p className="eyebrow">Evidence-backed findings</p>
            <h2>Where confidence breaks.</h2>
          </header>
          {audit.findings.map((finding, index) => (
            <article className="finding" key={finding.id}>
              <div className="finding__index">0{index + 1}</div>
              <div>
                <div className="finding__meta">
                  <span className="tag">{finding.category}</span>
                  <span className="eyebrow">
                    {Math.round(finding.confidence * 100)}% confidence
                  </span>
                </div>
                <h3>{finding.title}</h3>
                <p>
                  <b>Observed.</b> {finding.observation}
                </p>
                <p>
                  <b>Meaning.</b> {finding.interpretation}
                </p>
                <div className="recommendation">
                  <span className="eyebrow">Recommended move</span>
                  <p>{finding.recommendation}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
        <section className="opportunities" id="opportunities">
          <p className="eyebrow">Opportunity map</p>
          <h2>What to change—and in what order.</h2>
          <div className="opportunity-grid">
            {audit.opportunities.map((item) => (
              <article key={item.id}>
                <span className="tag">{item.horizon}</span>
                <h3>{item.title}</h3>
                <p>{item.action}</p>
                <footer>
                  <span>Impact: {item.impact}</span>
                  <span>Effort: {item.effort}</span>
                </footer>
              </article>
            ))}
          </div>
        </section>
        <section className="coverage" id="coverage">
          <p className="eyebrow">Evidence coverage</p>
          <h2>
            {Math.round((audit.scorecard?.coverage ?? 0) * 100)}% of the critical surface is
            represented.
          </h2>
          <p>
            Recommendations remain proportional to what was observed. Authenticated flows and
            private data were not inspected.
          </p>
        </section>
      </article>
    </main>
  );
}
