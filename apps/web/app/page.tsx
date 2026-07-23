import Link from "next/link";
import { Nav } from "@/components/nav";

const diagnoses = [
  [
    "01",
    "Evidence before opinion",
    "Every finding traces back to a page, capture, artifact, or explicitly labeled inference.",
  ],
  [
    "02",
    "Direction under pressure",
    "Adaptive questions resolve the contradictions that generic audits leave behind.",
  ],
  [
    "03",
    "A brief built to travel",
    "Strategy becomes a structured handoff for design, product, and engineering.",
  ],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Nav />
        <div className="hero__scrim" />
        <div className="hero__content">
          <p className="eyebrow eyebrow--light">Evidence-led product direction</p>
          <h1>
            Interrogate the experience.
            <br />
            Extract the signal.
          </h1>
          <div className="hero__footer">
            <p>
              Audit the evidence, pressure-test the strategy, and leave with a direction your team
              can execute.
            </p>
            <div className="hero__actions">
              <Link className="button button--accent" href="/audit/new">
                Start an audit
              </Link>
              <Link className="text-link text-link--light" href="/reports/demo">
                Read an example report
              </Link>
            </div>
          </div>
        </div>
        <a
          className="photo-credit"
          href="https://unsplash.com/photos/people-sitting-at-the-table-using-laptop-computers-QckxruozjRg"
          target="_blank"
          rel="noreferrer"
        >
          Photo: Campaign Creators / Unsplash
        </a>
      </section>

      <section className="statement" id="method">
        <p className="eyebrow">The proposition</p>
        <h2>A website can look finished and still leave the important questions unanswered.</h2>
        <p className="statement__body">
          Enzo treats every interface as evidence: what it claims, what it proves, where it
          hesitates, and what the business is actually asking a person to believe.
        </p>
      </section>

      <section className="method-grid" aria-label="Method">
        {diagnoses.map(([number, title, copy]) => (
          <article className="method-card" key={number}>
            <span className="eyebrow">{number}</span>
            <div className="method-card__mark" aria-hidden="true">
              <span />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="dark-frame">
        <div className="lifted-story">
          <p className="eyebrow">What survives the audit</p>
          <h2>Not a list of tasteful opinions. A chain of evidence your team can defend.</h2>
          <div className="proof-row">
            <div>
              <strong>10</strong>
              <span>audit dimensions</span>
            </div>
            <div>
              <strong>4</strong>
              <span>maximum interview rounds</span>
            </div>
            <div>
              <strong>1</strong>
              <span>decisive next action</span>
            </div>
          </div>
        </div>
      </section>

      <section className="closing-cta">
        <p className="eyebrow">The next move</p>
        <h2>Put the current experience under honest examination.</h2>
        <Link className="button button--primary" href="/audit/new">
          Start the interrogation
        </Link>
      </section>
    </main>
  );
}
