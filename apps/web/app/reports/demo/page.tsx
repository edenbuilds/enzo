import Link from "next/link";
import { EnzoPuppy } from "@enzo/design-system";

export const metadata = { title: "Vision Brief" };

export default function PublicReport() {
  return (
    <main className="public-report">
      <header className="public-report__header">
        <Link className="wordmark" href="/">
          <span className="wordmark__puppy" aria-hidden="true"><EnzoPuppy /></span>
          <b>Enzo</b>
        </Link>
        <span className="tag">Read-only brief</span>
      </header>
      <section className="brief-hero">
        <p className="eyebrow">Vision Brief · July 2026</p>
        <h1>Make the product immediately legible, credible, and decisive.</h1>
        <div>
          <p>
            A premium diagnostic experience that replaces fragmented opinion with inspectable
            evidence.
          </p>
          <span className="eyebrow">Prepared for founders + product designers</span>
        </div>
      </section>
      <div className="brief-grid">
        <aside>
          <p className="eyebrow">Brief contents</p>
          <nav>
            <a href="#position">Position</a>
            <a href="#narrative">Narrative</a>
            <a href="#principles">Principles</a>
            <a href="#action">Next action</a>
          </nav>
        </aside>
        <article>
          <section id="position">
            <p className="eyebrow">01 · Position</p>
            <h2>Evidence is the differentiating mechanism.</h2>
            <p>
              For teams approaching a consequential redesign, Enzo is the diagnostic workspace that
              turns observable experience signals into a direction stakeholders can defend.
            </p>
          </section>
          <section id="narrative">
            <p className="eyebrow">02 · Narrative</p>
            <ol className="narrative-list">
              <li>
                <span>01</span>Name the costly ambiguity.
              </li>
              <li>
                <span>02</span>Show the evidence without theatre.
              </li>
              <li>
                <span>03</span>Reveal the strategic opportunity.
              </li>
              <li>
                <span>04</span>Make the next move explicit.
              </li>
            </ol>
          </section>
          <section id="principles">
            <p className="eyebrow">03 · Experience principles</p>
            <div className="principle-grid">
              <div>
                <h3>Clarity first</h3>
                <p>Make the decision easier before making the surface busier.</p>
              </div>
              <div>
                <h3>Proof before posture</h3>
                <p>Every strong claim should reveal what made it credible.</p>
              </div>
              <div>
                <h3>Restraint as signal</h3>
                <p>Space, type, and sequence carry authority without noise.</p>
              </div>
            </div>
          </section>
          <section className="next-action" id="action">
            <p className="eyebrow">One recommended next action</p>
            <h2>Prototype the revised first-screen promise and test it with five target users.</h2>
            <Link className="button button--accent" href="/audit/new">
              Interrogate another experience
            </Link>
          </section>
        </article>
      </div>
    </main>
  );
}
