"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuditIntake() {
  const router = useRouter();
  const [url, setUrl] = useState("https://example.com");
  const [type, setType] = useState("url");

  return (
    <form
      className="intake-form"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/projects/demo");
      }}
    >
      <fieldset>
        <legend className="eyebrow">Evidence type</legend>
        <div className="segmented" role="radiogroup" aria-label="Evidence type">
          {["url", "screenshots", "pdf", "repository"].map((value) => (
            <label key={value} className={type === value ? "selected" : ""}>
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">
        <span className="eyebrow">Primary evidence</span>
        <input
          data-testid="audit-target"
          type={type === "url" || type === "repository" ? "url" : "text"}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
          aria-describedby="target-help"
        />
        <small id="target-help">
          Public HTTPS targets only. Enzo never signs in or submits forms.
        </small>
      </label>
      <div className="form-row">
        <label className="field">
          <span className="eyebrow">Project name</span>
          <input defaultValue="A sharper first impression" required />
        </label>
        <label className="field">
          <span className="eyebrow">Primary objective</span>
          <select defaultValue="clarity">
            <option value="clarity">Clarify the offer</option>
            <option value="conversion">Improve conversion</option>
            <option value="positioning">Reposition the product</option>
          </select>
        </label>
      </div>
      <button className="button button--primary" type="submit" data-testid="start-audit">
        Start interrogation <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
