"use client";

import { useMemo, useState } from "react";
import type { MindPack, StylePack, WorkroomDefinition } from "@enzo/decision-core";
import { EnzoPuppy } from "@enzo/design-system";

export function WorkroomComposer({ workrooms, minds, styles }: { workrooms: WorkroomDefinition[]; minds: MindPack[]; styles: StylePack[] }) {
  const [workroomId, setWorkroomId] = useState("product-strategy");
  const [mindIds, setMindIds] = useState<string[]>(["steve-jobs", "charlie-munger"]);
  const [styleId, setStyleId] = useState("broadsheet-editorial");
  const [outcome, setOutcome] = useState("Decide what this product should promise first");
  const [mode, setMode] = useState<"founder" | "enzo">("founder");
  const [configured, setConfigured] = useState(false);
  const workroom = workrooms.find((item) => item.id === workroomId) ?? workrooms[0]!;
  const compatibleMinds = useMemo(() => minds.filter((mind) => workroom.compatibleMindIds.includes(mind.id)), [minds, workroom]);

  function chooseWorkroom(id: string) {
    const next = workrooms.find((item) => item.id === id);
    if (!next) return;
    setWorkroomId(id);
    const nextProduction = minds.filter((mind) => next.compatibleMindIds.includes(mind.id) && mind.evaluationStatus === "production").slice(0, 2).map((mind) => mind.id);
    setMindIds(nextProduction.length ? nextProduction : next.compatibleMindIds.slice(0, 1));
    setConfigured(false);
  }

  function letEnzoChoose() {
    const recommended = compatibleMinds.filter((mind) => mind.evaluationStatus === "production").slice(0, 3).map((mind) => mind.id);
    setMindIds(recommended.length ? recommended : compatibleMinds.slice(0, 2).map((mind) => mind.id));
    setMode("enzo");
    setConfigured(false);
  }

  function toggleMind(id: string) {
    setMode("founder");
    setConfigured(false);
    setMindIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  return (
    <div className="composer" data-testid="workroom-composer">
      <section className="composer-step">
        <span className="composer-step__number">01</span><div><p className="eyebrow">Outcome</p><h2>What needs to be true when this workroom closes?</h2>
        <label className="field"><span>Desired outcome</span><textarea value={outcome} onChange={(event) => setOutcome(event.target.value)} data-testid="composer-outcome" /></label></div>
      </section>
      <section className="composer-step">
        <span className="composer-step__number">02</span><div><p className="eyebrow">Workroom</p><h2>Where should Enzo do the work?</h2><div className="composer-options composer-options--workrooms">
          {workrooms.map((item) => <button className={item.id === workroomId ? "select-card select-card--active" : "select-card"} onClick={() => chooseWorkroom(item.id)} key={item.id}><strong>{item.displayName}</strong><span>{item.summary}</span></button>)}
        </div></div>
      </section>
      <section className="composer-step">
        <span className="composer-step__number">03</span><div><div className="composer-heading"><div><p className="eyebrow">Minds</p><h2>Who should challenge the problem?</h2></div><button className="button button--accent" onClick={letEnzoChoose}>Let Enzo recommend</button></div>
        <p className="composer-note"><EnzoPuppy state="investigating" /> {mode === "enzo" ? "Enzo chose the smallest reviewed council that fits this workroom." : "You are choosing the council directly."}</p>
        <div className="composer-options composer-options--minds">{compatibleMinds.map((mind) => <button disabled={mind.evaluationStatus === "research"} className={mindIds.includes(mind.id) ? "mind-choice mind-choice--active" : "mind-choice"} onClick={() => toggleMind(mind.id)} key={mind.id}><span className={`status-pill status-pill--${mind.evaluationStatus}`}>{mind.evaluationStatus}</span><strong>{mind.displayName}</strong><span>{mind.summary}</span><small>{mind.evaluationStatus === "research" ? "Visible for review, unavailable in production" : mind.competence.slice(0, 2).join(" + ")}</small></button>)}</div></div>
      </section>
      {workroom.supportsStyles ? <section className="composer-step"><span className="composer-step__number">04</span><div><p className="eyebrow">Output style</p><h2>How should the work feel?</h2><div className="style-picker">{styles.map((style) => <button className={style.id === styleId ? "style-choice style-choice--active" : "style-choice"} onClick={() => { setStyleId(style.id); setConfigured(false); }} key={style.id}><i style={{ background: style.tokens.accent }} /><strong>{style.displayName}</strong><span>{style.summary}</span></button>)}</div></div></section> : null}
      <section className="composer-review"><div><p className="eyebrow">Ready to configure</p><h2>{workroom.displayName}</h2><p>{outcome}</p><ul>{mindIds.map((id) => <li key={id}>{minds.find((mind) => mind.id === id)?.displayName}</li>)}{workroom.supportsStyles ? <li>{styles.find((style) => style.id === styleId)?.displayName}</li> : null}</ul></div><button className="button button--accent" disabled={!outcome.trim() || !mindIds.length} onClick={() => setConfigured(true)} data-testid="configure-workroom">Configure this workroom</button></section>
      {configured ? <div className="composer-confirmation" role="status" data-testid="composer-confirmation"><EnzoPuppy state="ready" /><div><strong>Workroom configured</strong><p>The public demo will not persist this setup. Enzo will keep each first-pass analysis independent.</p></div></div> : null}
    </div>
  );
}
