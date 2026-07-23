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
          <p className="eyebrow eyebrow--light">Founder decision studio · First release</p>
          <h1>
            Borrow world-class judgment.
            <br />
            Keep the final say.
          </h1>
          <div className="hero__footer">
            <p>
              Enzo starts with what you have built, separates evidence from assumption, and turns
              the next consequential decision into an artifact your team can execute.
            </p>
            <div className="hero__actions">
              <Link className="button button--accent" href="/home">
                Enter the Decision Studio
              </Link>
              <Link className="text-link text-link--light" href="/audit/new">
                Run the experience audit
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
        <p className="eyebrow">The first operating loop</p>
        <h2>A company can look busy and still leave its most important decision unresolved.</h2>
        <p className="statement__body">
          Enzo treats the current experience as company evidence: what it claims, what it proves,
          where it hesitates, and which founder decision must happen next.
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
        <h2>Make the decision. Preserve the reasoning. Review the outcome.</h2>
        <Link className="button button--primary" href="/home">
          Enter the public demo
        </Link>
      </section>
    </main>
  );
}
