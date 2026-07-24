"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MindPack, StylePack, WorkroomDefinition } from "@enzo/decision-core";
import { EnzoPuppy } from "@enzo/design-system";

type FirstRead = {
  workroomId: string;
  decision: string;
  signal: string;
  checks: string[];
};

function makeFirstRead(outcome: string): FirstRead {
  const text = outcome.toLowerCase();
  if (/code|build|ship|deploy|repo|bug|technical|engineering/.test(text)) {
    return {
      workroomId: "forward-deployed-engineering",
      decision: "What is the smallest production change that proves this outcome?",
      signal: "You may be treating implementation as the goal. The real decision is which bounded change earns enough evidence to justify shipping.",
      checks: ["Current product behavior", "Repository and deployment constraints", "A measurable acceptance test"],
    };
  }
  if (/brand|design|visual|website|interface|ux|ui/.test(text)) {
    return {
      workroomId: "design-brand",
      decision: "What must a customer understand and feel before the visual direction can be right?",
      signal: "A visual refresh will not fix an unclear promise. Enzo should lock the audience, message, and proof before choosing an expression.",
      checks: ["The promise above the fold", "The proof customers can verify", "The moments where the experience loses confidence"],
    };
  }
  if (/sell|sales|offer|price|pricing|close|pipeline/.test(text)) {
    return {
      workroomId: "sales-offers",
      decision: "Which promise, proof, and price make the next buyer say yes?",
      signal: "The offer needs one measurable outcome and a believable reason to act now. More features will not substitute for proof.",
      checks: ["The buyer's urgent job", "Proof behind the promise", "Price and risk reversal"],
    };
  }
  if (/market|growth|campaign|launch|acquisition|content/.test(text)) {
    return {
      workroomId: "marketing-growth",
      decision: "Which story and channel can create the fastest credible learning loop?",
      signal: "A broad campaign is likely premature. Enzo should isolate one audience, one claim, and one observable response.",
      checks: ["Audience urgency", "A claim the product can prove", "The shortest measurable channel test"],
    };
  }
  return {
    workroomId: "product-strategy",
    decision: "What is the one choice that makes the next thirty days easier to execute?",
    signal: "The outcome is still broad. Enzo should turn it into a reversible founder decision with a success measure and a review date.",
    checks: ["What is already true", "What is still assumed", "What result would change the decision"],
  };
}

export function WorkroomComposer({
  workrooms,
  minds,
  styles,
  embedded = false,
}: {
  workrooms: WorkroomDefinition[];
  minds: MindPack[];
  styles: StylePack[];
  embedded?: boolean;
}) {
  const [outcome, setOutcome] = useState(embedded ? "" : "Decide what this product should promise first");
  const [source, setSource] = useState("");
  const [firstRead, setFirstRead] = useState<FirstRead | null>(null);
  const [workroomId, setWorkroomId] = useState("product-strategy");
  const [mindIds, setMindIds] = useState<string[]>(["steve-jobs", "charlie-munger"]);
  const [styleId, setStyleId] = useState("broadsheet-editorial");

  const workroom = workrooms.find((item) => item.id === workroomId) ?? workrooms[0]!;
  const compatibleMinds = useMemo(
    () => minds.filter((mind) => workroom.compatibleMindIds.includes(mind.id)),
    [minds, workroom],
  );

  function inspect() {
    const read = makeFirstRead(outcome);
    const nextWorkroom = workrooms.find((item) => item.id === read.workroomId) ?? workrooms[0]!;
    const recommended = minds
      .filter((mind) => nextWorkroom.compatibleMindIds.includes(mind.id) && mind.evaluationStatus === "production")
      .slice(0, 2)
      .map((mind) => mind.id);
    setWorkroomId(nextWorkroom.id);
    setMindIds(recommended.length ? recommended : nextWorkroom.compatibleMindIds.slice(0, 2));
    setFirstRead(read);
  }

  function chooseWorkroom(id: string) {
    const next = workrooms.find((item) => item.id === id);
    if (!next) return;
    setWorkroomId(id);
    setMindIds(
      minds
        .filter((mind) => next.compatibleMindIds.includes(mind.id) && mind.evaluationStatus === "production")
        .slice(0, 2)
        .map((mind) => mind.id),
    );
  }

  function toggleMind(id: string) {
    setMindIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current,
    );
  }

  return (
    <div className={embedded ? "first-start first-start--embedded" : "first-start"} data-testid="workroom-composer">
      <div className="first-start__input">
        <div>
          <p className="eyebrow">Start here</p>
          <h2>{embedded ? "What feels stuck?" : "Tell Enzo what you need to decide or ship."}</h2>
          <p>Plain language is enough. Enzo will choose a useful starting method and show you why.</p>
        </div>
        <label className="field">
          <span>Decision or outcome</span>
          <textarea
            value={outcome}
            onChange={(event) => { setOutcome(event.target.value); setFirstRead(null); }}
            placeholder="Example: Our trial users like the product, but they do not convert. What should we fix first?"
            data-testid="composer-outcome"
          />
        </label>
        <label className="field first-start__source">
          <span>Link or evidence <small>Optional</small></span>
          <input
            type="url"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="https://your-product.com"
          />
        </label>
        <button className="button button--accent" disabled={!outcome.trim()} onClick={inspect} data-testid="get-first-read">
          Get Enzo&apos;s first read
        </button>
        <small className="first-start__privacy">Public demo. Your entry is processed in this browser and is not saved.</small>
      </div>

      {firstRead ? (
        <section className="first-read" aria-live="polite" data-testid="first-read">
          <header>
            <div>
              <p className="eyebrow">Enzo&apos;s first read</p>
              <h2>{firstRead.decision}</h2>
            </div>
            <EnzoPuppy state="bringing-evidence" />
          </header>
          <div className="first-read__body">
            <div className="first-read__signal">
              <p className="eyebrow">The signal</p>
              <p>{firstRead.signal}</p>
            </div>
            <div>
              <p className="eyebrow">What Enzo would check next</p>
              <ol>{firstRead.checks.map((check) => <li key={check}>{check}</li>)}</ol>
            </div>
          </div>
          <div className="first-read__route">
            <div>
              <span className="eyebrow">Recommended route</span>
              <strong>{workroom.displayName}</strong>
              <span>{mindIds.map((id) => minds.find((mind) => mind.id === id)?.displayName).filter(Boolean).join(" + ")}</span>
            </div>
            <Link className="button button--accent" href="/decisions/demo">See the full worked example</Link>
          </div>

          <details className="approach-controls">
            <summary>Adjust Enzo&apos;s approach</summary>
            <p>Only change these if you have a reason. Enzo has already selected a safe default.</p>
            <fieldset>
              <legend>Workroom</legend>
              <div className="approach-controls__grid">
                {workrooms.map((item) => (
                  <label key={item.id} className={item.id === workroomId ? "approach-option approach-option--active" : "approach-option"}>
                    <input type="radio" name="workroom" checked={item.id === workroomId} onChange={() => chooseWorkroom(item.id)} />
                    <strong>{item.displayName}</strong><span>{item.summary}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Perspectives</legend>
              <div className="approach-controls__grid">
                {compatibleMinds.map((mind) => (
                  <label key={mind.id} className={mindIds.includes(mind.id) ? "approach-option approach-option--active" : "approach-option"}>
                    <input type="checkbox" checked={mindIds.includes(mind.id)} disabled={mind.evaluationStatus !== "production"} onChange={() => toggleMind(mind.id)} />
                    <strong>{mind.displayName}</strong><span>{mind.competence.slice(0, 2).join(" + ")}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {workroom.supportsStyles ? (
              <label className="field">
                <span>Output style</span>
                <select value={styleId} onChange={(event) => setStyleId(event.target.value)}>
                  {styles.map((style) => <option value={style.id} key={style.id}>{style.displayName}</option>)}
                </select>
              </label>
            ) : null}
          </details>
        </section>
      ) : null}
    </div>
  );
}
