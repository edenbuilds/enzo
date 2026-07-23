"use client";
import { useState } from "react";
import type { Artifact } from "@enzo/decision-core";
import { EnzoPresence } from "./studio-shell";

export function ArtifactEditor({ artifacts }: { artifacts: Artifact[] }) {
  const [selected, setSelected] = useState(artifacts[0]?.id ?? "");
  const artifact = artifacts.find((item) => item.id === selected) ?? artifacts[0]!;
  const [bodies, setBodies] = useState(
    Object.fromEntries(artifacts.map((item) => [item.id, item.body])),
  );
  const [saved, setSaved] = useState(false);
  return (
    <div className="artifact-workroom">
      <aside>
        <p className="eyebrow">Artifacts</p>
        {artifacts.map((item) => (
          <button
            className={selected === item.id ? "artifact-tab artifact-tab--active" : "artifact-tab"}
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              setSaved(false);
            }}
          >
            <strong>{item.title}</strong>
            <span>Draft · v{item.revision}</span>
          </button>
        ))}
      </aside>
      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Editable artifact · Markdown</p>
            <h1>{artifact.title}</h1>
          </div>
          <EnzoPresence state="ready" />
        </div>
        <textarea
          aria-label="Artifact body"
          className="artifact-editor"
          data-testid="artifact-editor"
          onChange={(event) => {
            setBodies({ ...bodies, [artifact.id]: event.target.value });
            setSaved(false);
          }}
          value={bodies[artifact.id]}
        />
        <div className="artifact-actions">
          <button
            className="button button--primary"
            data-testid="save-artifact"
            onClick={() => setSaved(true)}
          >
            {saved ? "Revision saved" : "Save revision"}
          </button>
          <button className="button button--secondary" onClick={() => window.print()}>
            Print or export PDF
          </button>
        </div>
      </section>
    </div>
  );
}
