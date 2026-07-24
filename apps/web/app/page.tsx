import Link from "next/link";
import type { Route } from "next";
import { MIND_PACKS, STYLE_PACKS, WORKROOMS } from "@enzo/decision-core";
import { EnzoPuppy } from "@enzo/design-system";
import { Nav } from "@/components/nav";
import { WorkroomComposer } from "@/components/workroom-composer";

const steps = [
  ["Bring the knot", "Tell Enzo what feels stuck. Add a link if the evidence is public."],
  ["See the first read", "Enzo names the decision underneath the request and shows what it needs to verify."],
  ["Make the call", "Review the evidence, change the approach if needed, then approve the work."],
];

export default function Home() {
  return (
    <main className="broadsheet-home">
      <section className="hero hero--broadsheet">
        <Nav />
        <div className="hero__content hero__content--broadsheet">
          <div className="hero__copy hero__copy--value-first">
            <p className="eyebrow">Founder operating system</p>
            <h1>Bring the knot. Enzo finds the next move.</h1>
            <p className="hero__lede">
              Show Enzo the decision, product, or problem that is slowing you down. Get a clear first read before you configure anything.
            </p>
            <WorkroomComposer embedded workrooms={WORKROOMS} minds={MIND_PACKS} styles={STYLE_PACKS} />
          </div>
          <div className="hero-puppy">
            <span className="hero-puppy__note">Good at finding the question under the question.</span>
            <EnzoPuppy state="investigating" />
          </div>
        </div>
      </section>

      <section className="choice-section" id="method">
        <p className="eyebrow">Three steps to useful</p>
        <h2>Less setup. More signal.</h2>
        <div className="choice-grid">
          {steps.map(([title, copy], index) => (
            <article className="choice-card" key={title}>
              <span className="choice-card__index">0{index + 1}</span>
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
          <h2>Enzo brings the evidence. You keep the final say.</h2>
          <Link className="button button--accent" href={"/workrooms/new" as Route}>Bring Enzo a real problem</Link>
        </div>
      </section>
    </main>
  );
}
