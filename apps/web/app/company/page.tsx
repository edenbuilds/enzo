import { createFixtureStudio } from "@enzo/decision-core";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Company memory" };
export default async function CompanyMemory() {
  const principal = await getWorkspacePrincipal();
  const { founder, company } = createFixtureStudio(principal.ownerId);
  return (
    <StudioShell active="/company" demo={principal.demo}>
      <header className="studio-header">
        <div>
          <p className="eyebrow">Company memory</p>
          <h1>Context that survives the conversation.</h1>
        </div>
        <span className="tag">Updated 23 July</span>
      </header>
      <div className="memory-grid">
        <section className="memory-panel">
          <p className="eyebrow">Founder model</p>
          <h2>{founder.displayName}</h2>
          <dl>
            <div>
              <dt>Objective</dt>
              <dd>{founder.objectives[0]}</dd>
            </div>
            <div>
              <dt>Working style</dt>
              <dd>{founder.workingStyle}</dd>
            </div>
            <div>
              <dt>Constraints</dt>
              <dd>{founder.constraints.join(" · ")}</dd>
            </div>
            <div>
              <dt>Decision boundary</dt>
              <dd>{founder.autonomyPreferences[0]}</dd>
            </div>
          </dl>
        </section>
        <section className="memory-panel memory-panel--dark">
          <p className="eyebrow">Company model</p>
          <h2>{company.name}</h2>
          <dl>
            <div>
              <dt>Customer</dt>
              <dd>{company.customer}</dd>
            </div>
            <div>
              <dt>Problem</dt>
              <dd>{company.problem}</dd>
            </div>
            <div>
              <dt>Business model</dt>
              <dd>{company.businessModel}</dd>
            </div>
            <div>
              <dt>Current focus</dt>
              <dd>{company.currentFocus}</dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="studio-section">
        <p className="eyebrow">Open questions</p>
        <ol className="numbered-questions">
          {company.openQuestions.map((question, index) => (
            <li key={question}>
              <span>0{index + 1}</span>
              {question}
            </li>
          ))}
        </ol>
      </section>
    </StudioShell>
  );
}
