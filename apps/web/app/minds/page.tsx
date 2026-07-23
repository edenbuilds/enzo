import { MIND_PACKS } from "@enzo/decision-core";
import { StudioShell } from "@/components/studio-shell";
import { getWorkspacePrincipal } from "@/lib/workspace";

export const metadata = { title: "Minds" };

export default async function MindsPage() {
  const principal = await getWorkspacePrincipal();
  return (
    <StudioShell active="/minds" demo={principal.demo}>
      <header className="catalog-hero">
        <div><p className="eyebrow">Mind library</p><h1>Choose how the problem should be challenged.</h1></div>
        <p>Named minds are bounded methodological perspectives. They do not impersonate the person or claim endorsement.</p>
      </header>
      <section className="catalog-grid" data-testid="mind-catalog">
        {MIND_PACKS.map((mind) => (
          <article className="catalog-card" key={mind.id}>
            <div className="catalog-card__top">
              <span className={`status-pill status-pill--${mind.evaluationStatus}`}>{mind.evaluationStatus}</span>
              <span className="eyebrow">Cutoff {mind.knowledgeCutoff}</span>
            </div>
            <h2>{mind.displayName}</h2>
            <p>{mind.summary}</p>
            <dl>
              <div><dt>Best for</dt><dd>{mind.competence.join(", ")}</dd></div>
              <div><dt>Avoid for</dt><dd>{mind.exclusions.join(", ")}</dd></div>
              <div><dt>Blind spot</dt><dd>{mind.blindSpots[0]}</dd></div>
              <div><dt>Example</dt><dd>{mind.exampleOutput}</dd></div>
            </dl>
            <button className="button button--secondary" disabled={mind.evaluationStatus === "research"}>
              {mind.evaluationStatus === "research" ? "In review" : "Add to council"}
            </button>
            <details><summary>Sources and disclosure</summary><p>{mind.disclosure}</p>{mind.provenance.map((url) => <a href={url} key={url} target="_blank" rel="noreferrer">Inspect source</a>)}</details>
          </article>
        ))}
      </section>
    </StudioShell>
  );
}
