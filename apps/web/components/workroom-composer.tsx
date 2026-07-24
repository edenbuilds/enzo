"use client";

import { useState } from "react";
import { EnzoPuppy } from "@enzo/design-system";
import type { PublicAuditResult } from "@/lib/public-audit";

export function WorkroomComposer({ embedded = false }: { embedded?: boolean }) {
  const [problem, setProblem] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<PublicAuditResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function inspect() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/public-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, problem }),
      });
      const payload = (await response.json()) as PublicAuditResult | { error: string };
      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "The page could not be inspected.");
      }
      setResult(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The page could not be inspected.");
    } finally {
      setLoading(false);
    }
  }

  async function copyDiagnosis() {
    if (!result) return;
    const findings = result.findings
      .map((finding, index) => `${index + 1}. ${finding.title}\nObserved: ${finding.observation}\nMove: ${finding.move}`)
      .join("\n\n");
    await navigator.clipboard.writeText(
      `Enzo page diagnosis\n${result.url}\n\n${result.verdict}\n\nNext move\n${result.nextMove}\n\n${findings}`,
    );
    setCopied(true);
  }

  return (
    <div className={embedded ? "first-start first-start--embedded" : "first-start"} data-testid="workroom-composer">
      <div className="first-start__input">
        <div>
          <p className="eyebrow">Public page interrogation</p>
          <h2>{embedded ? "Show Enzo the page." : "Find the first thing worth fixing."}</h2>
          <p>Enzo reads the page that is live now, shows the evidence it found, and names one move to make first.</p>
        </div>
        <label className="field first-start__source">
          <span>Public HTTPS page</span>
          <input
            type="url"
            value={url}
            onChange={(event) => { setUrl(event.target.value); setResult(null); }}
            placeholder="https://your-product.com"
            required
            data-testid="audit-url"
          />
        </label>
        <label className="field">
          <span>What are you trying to improve? <small>Optional</small></span>
          <textarea
            value={problem}
            onChange={(event) => { setProblem(event.target.value); setResult(null); }}
            placeholder="Example: More qualified founders should start a trial."
            data-testid="composer-outcome"
          />
        </label>
        <div className="first-start__actions">
          <button className="button button--accent" disabled={!url.trim() || loading} onClick={inspect} data-testid="get-first-read">
            {loading ? "Inspecting the live page..." : "Interrogate this page"}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setUrl("https://tryenzo.vercel.app");
              setProblem("Make the value obvious enough that a founder wants to try it.");
              setResult(null);
            }}
          >
            Use Enzo as the example
          </button>
        </div>
        {error ? <p className="first-start__error" role="alert">{error}</p> : null}
        <small className="first-start__privacy">Public pages only. Enzo does not sign in, submit forms, or save this audit.</small>
      </div>

      {result ? (
        <section className="first-read first-read--audit" aria-live="polite" data-testid="first-read">
          <header>
            <div>
              <p className="eyebrow">The blunt read</p>
              <h2>{result.verdict}</h2>
            </div>
            <EnzoPuppy state="bringing-evidence" />
          </header>

          <div className="audit-evidence">
            <div>
              <span className="eyebrow">Proof signals</span>
              <strong>{result.observed.proof.length}</strong>
              <small>{result.observed.proof[0] || "None detected"}</small>
            </div>
            <div>
              <span className="eyebrow">Primary heading</span>
              <strong>{result.observed.h1[0] || "Not found"}</strong>
            </div>
            <div>
              <span className="eyebrow">Actions found</span>
              <strong>{result.observed.actions.length}</strong>
              <small>{result.observed.actions.slice(0, 3).join(" · ") || "None detected"}</small>
            </div>
            <div>
              <span className="eyebrow">Navigation items</span>
              <strong>{result.observed.navigation.length}</strong>
              <small>{result.observed.navigation.slice(0, 4).join(" · ") || "None detected"}</small>
            </div>
          </div>

          <div className="audit-findings">
            <div className="audit-findings__heading">
              <p className="eyebrow">What breaks confidence</p>
              <span>{result.findings.length} evidence-linked finding{result.findings.length === 1 ? "" : "s"}</span>
            </div>
            {result.findings.map((finding, index) => (
              <article key={finding.title}>
                <span className={`audit-severity audit-severity--${finding.severity}`}>0{index + 1} · {finding.severity}</span>
                <h3>{finding.title}</h3>
                <p><b>Observed:</b> {finding.observation}</p>
                <p><b>Why it matters:</b> {finding.whyItMatters}</p>
                <div><span className="eyebrow">Make this move</span><p>{finding.move}</p></div>
              </article>
            ))}
          </div>

          <div className="first-read__route">
            <div>
              <span className="eyebrow">Do this first</span>
              <strong>{result.nextMove}</strong>
              <span>Based on the HTML delivered by {new URL(result.url).hostname}.</span>
            </div>
            <button className="button button--accent" onClick={copyDiagnosis}>{copied ? "Diagnosis copied" : "Copy the diagnosis"}</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
