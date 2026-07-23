import Link from "next/link";
import type { Route } from "next";
import { EnzoPuppy } from "@enzo/design-system";
import { Nav } from "@/components/nav";

const choices = [
  ["Mind", "Choose the perspective", "Start with Jobs for product focus, Hormozi for offers, or let Enzo recommend a small council."],
  ["Workroom", "Choose the outcome", "Move from strategy to design, marketing, sales, experience audit, or Forward Deployed Engineering."],
  ["Style", "Choose the expression", "Shape the generated site, campaign, memo, or prototype without changing Enzo’s own identity."],
];

export default function Home() {
  return (
    <main className="broadsheet-home">
      <section className="hero hero--broadsheet">
        <Nav />
        <div className="hero__content hero__content--broadsheet">
          <div className="hero__copy">
            <p className="eyebrow">Founder operating system</p>
            <h1>Enzo finds what matters. You make the call.</h1>
            <p className="hero__lede">
              Bring Enzo a real company decision. Choose the minds you trust, the workroom you need,
              and the style that fits. Enzo keeps the evidence visible and turns your choice into work.
            </p>
            <div className="hero__actions">
              <Link className="button button--accent" href={"/workrooms/new" as Route}>Start a workroom</Link>
              <Link className="button button--secondary" href="/home">Explore the public demo</Link>
            </div>
          </div>
          <div className="hero-puppy">
            <span className="hero-puppy__note">Listening for the real question</span>
            <EnzoPuppy state="investigating" />
          </div>
        </div>
      </section>

      <section className="choice-section" id="method">
        <p className="eyebrow">You choose the composition</p>
        <h2>One company. Many useful ways to think.</h2>
        <div className="choice-grid">
          {choices.map(([label, title, copy], index) => (
            <article className="choice-card" key={label}>
              <span className="choice-card__index">0{index + 1}</span>
              <p className="eyebrow">{label}</p>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="velvet-chamber">
        <div>
          <p className="eyebrow">Primary workroom</p>
          <h2>Forward Deployed Engineering connects the decision to production.</h2>
          <p>
            Enzo inspects the codebase, scopes the change, asks before touching consequential state,
            verifies the result, and asks again before deployment.
          </p>
          <Link className="button button--accent" href={"/workrooms/forward-deployed-engineering" as Route}>
            Open the engineering workroom
          </Link>
        </div>
        <ol className="approval-sequence">
          <li><span>01</span>Inspect and frame</li>
          <li><span>02</span>Approve the change</li>
          <li><span>03</span>Build and verify</li>
          <li><span>04</span>Approve deployment</li>
          <li><span>05</span>Review the outcome</li>
        </ol>
      </section>

      <section className="closing-cta closing-cta--broadsheet">
        <EnzoPuppy state="waiting" />
        <div>
          <p className="eyebrow">Your company stays yours</p>
          <h2>Choose the minds. See the disagreement. Keep the final say.</h2>
          <Link className="button button--accent" href={"/workrooms/new" as Route}>Compose your first workroom</Link>
        </div>
      </section>
    </main>
  );
}
