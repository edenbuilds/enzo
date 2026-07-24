import { EnzoPuppy } from "@enzo/design-system";
import { Nav } from "@/components/nav";
import { WorkroomComposer } from "@/components/workroom-composer";

const steps = [
  ["Give Enzo the page", "Paste any public HTTPS page. No account, crawl setup, or persona selection."],
  ["See what is actually there", "Enzo extracts the real headline, actions, navigation, metadata, and page structure."],
  ["Fix the first break", "Get evidence-linked findings and one concrete move you can make now."],
];

export default function Home() {
  return (
    <main className="broadsheet-home">
      <section className="hero hero--broadsheet">
        <Nav />
        <div className="hero__content hero__content--broadsheet">
          <div className="hero__copy hero__copy--value-first">
            <p className="eyebrow">A ruthless first read for your homepage</p>
            <h1>Your page is making a promise. Enzo finds where it breaks.</h1>
            <p className="hero__lede">
              Paste the live URL. Enzo reads what customers can actually see, points to the evidence, and tells you what to fix first.
            </p>
            <div id="interrogate"><WorkroomComposer embedded /></div>
          </div>
          <div className="hero-puppy">
            <span className="hero-puppy__note">Good at sniffing out unclear promises.</span>
            <EnzoPuppy state="investigating" />
          </div>
        </div>
      </section>

      <section className="choice-section" id="how-it-works">
        <p className="eyebrow">One page in, one priority out</p>
        <h2>No council. No setup ritual. No generic advice.</h2>
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

      <section className="velvet-chamber velvet-chamber--proof" id="proof">
        <div>
          <p className="eyebrow">Why this is useful</p>
          <h2>Enzo has to show its receipts.</h2>
          <p>
            Every finding starts with something observed on the live page. If Enzo cannot see it, Enzo does not pretend to know it.
          </p>
          <a className="button button--accent" href="#interrogate">Interrogate your page</a>
        </div>
        <div className="proof-receipt">
          <p className="eyebrow">Evidence receipt</p>
          <div><span>Observed</span><strong>Headline, actions, navigation, metadata</strong></div>
          <div><span>Interpreted</span><strong>Where clarity or confidence breaks</strong></div>
          <div><span>Recommended</span><strong>One move, tied to the observation</strong></div>
          <div><span>Not claimed</span><strong>Private flows, customer intent, or conversion data</strong></div>
        </div>
      </section>

      <section className="closing-cta closing-cta--broadsheet">
        <EnzoPuppy state="waiting" />
        <div>
          <p className="eyebrow">Try the product, not a tour</p>
          <h2>One live page. One blunt read. One place to start.</h2>
          <a className="button button--accent" href="#interrogate">Interrogate your page</a>
        </div>
      </section>
    </main>
  );
}
