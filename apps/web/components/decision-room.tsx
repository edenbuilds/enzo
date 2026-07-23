"use client";
import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { StudioSnapshot } from "@enzo/decision-core";
import { EnzoPresence } from "./studio-shell";

export function DecisionRoom({ studio }: { studio: StudioSnapshot }) {
  const [optionId, setOptionId] = useState(studio.council.recommendedOptionId);
  const [rationale, setRationale] = useState("");
  const [recorded, setRecorded] = useState(false);
  return (
    <>
      <section className="decision-intro">
        <div>
          <p className="eyebrow">Decision 01 · Reversible</p>
          <h1>{studio.decision.question}</h1>
        </div>
        <div className="decision-deadline">
          <span>Decision due</span>
          <strong>01 Aug 2026</strong>
          <span>Review due</span>
          <strong>01 Sep 2026</strong>
        </div>
      </section>
      <nav className="decision-progress" aria-label="Decision progress">
        <span>01 Evidence</span>
        <span>02 Council</span>
        <span>03 Founder decision</span>
        <span>04 Artifact</span>
      </nav>
      <section className="studio-section" data-testid="evidence-scan" id="evidence">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reality scan</p>
            <h2>What we know, and how we know it.</h2>
          </div>
          <EnzoPresence state="bringing-evidence" />
        </div>
        <div className="claim-list">
          {studio.claims.map((claim) => (
            <article key={claim.id}>
              <span className={`claim-class claim-class--${claim.classification}`}>
                {claim.classification}
              </span>
              <p>{claim.statement}</p>
              <small>
                {claim.sourceLabel} · {Math.round(claim.confidence * 100)}% confidence
              </small>
            </article>
          ))}
        </div>
      </section>
      <section className="studio-section" data-testid="routed-council" id="council">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Routed council</p>
            <h2>Three lenses. Independent first passes.</h2>
          </div>
          <span className="tag">Sealed analyses</span>
        </div>
        <div className="lens-grid">
          {studio.council.analyses.map((analysis) => {
            const lens = studio.lenses.find((item) => item.id === analysis.lensId)!;
            return (
              <article className="lens-card" key={analysis.id}>
                <span className="eyebrow">
                  {lens.type === "person-lens" ? "Methodological lens" : "Domain playbook"}
                </span>
                <h3>{lens.displayName}</h3>
                <p>{analysis.diagnosis}</p>
                <dl>
                  <div>
                    <dt>Preserve</dt>
                    <dd>{analysis.preserve[0]}</dd>
                  </div>
                  <div>
                    <dt>Remove</dt>
                    <dd>{analysis.remove[0]}</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd>{analysis.risk}</dd>
                  </div>
                </dl>
                <small>{lens.disclosure}</small>
              </article>
            );
          })}
        </div>
        <div className="disagreement" data-testid="council-disagreement">
          <EnzoPresence state="challenging" />
          <div>
            <p className="eyebrow">Material disagreement</p>
            <h3>{studio.council.disagreements[0]?.issue}</h3>
            <p>{studio.council.dissent}</p>
            <strong>Evidence that would resolve it</strong>
            <p>{studio.council.disagreements[0]?.evidenceNeeded}</p>
          </div>
        </div>
      </section>
      <section className="founder-decision" id="founder-decision">
        <div>
          <p className="eyebrow">Founder decision required</p>
          <h2>Enzo recommends a route. You decide.</h2>
          <p>{studio.council.synthesis}</p>
        </div>
        <fieldset>
          <legend className="sr-only">Choose the product promise</legend>
          {studio.decision.options.map((option) => (
            <label
              className={
                optionId === option.id
                  ? "decision-option decision-option--selected"
                  : "decision-option"
              }
              key={option.id}
            >
              <input
                checked={optionId === option.id}
                name="decision"
                onChange={() => setOptionId(option.id)}
                type="radio"
              />
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <label className="field">
          <span>Your rationale</span>
          <textarea
            data-testid="founder-rationale"
            onChange={(event) => setRationale(event.target.value)}
            placeholder="What evidence and tradeoff made this your choice?"
            value={rationale}
          />
        </label>
        <button
          className="button button--accent"
          data-testid="record-decision"
          disabled={!rationale.trim() || recorded}
          onClick={() => setRecorded(true)}
        >
          {recorded ? "Decision recorded" : "Record my decision"}
        </button>
        {recorded ? (
          <div className="decision-confirmation" data-testid="decision-confirmation" role="status">
            <EnzoPresence state="ready" />
            <p>
              Your choice is recorded with its assumptions, dissent, success metric, and review
              date.
            </p>
            <div>
              <Link className="button button--primary" href={"/artifacts" as Route}>
                Open decision artifacts
              </Link>
              <Link className="text-link" href={"/ledger" as Route}>
                View Decision Ledger
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
