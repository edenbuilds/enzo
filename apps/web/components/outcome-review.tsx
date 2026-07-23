"use client";
import { useState } from "react";
import { EnzoPresence } from "./studio-shell";
export function OutcomeReview() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="outcome-review">
      <button
        className="button button--secondary"
        data-testid="open-outcome-review"
        onClick={() => setOpen(!open)}
      >
        Record outcome
      </button>
      {open ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <EnzoPresence state="reviewing" />
          <label className="field">
            <span>Observed outcome</span>
            <textarea required />
          </label>
          <label className="field">
            <span>What did this teach you?</span>
            <textarea required />
          </label>
          <label className="field">
            <span>Confidence calibration</span>
            <select defaultValue="calibrated">
              <option value="underconfident">Underconfident</option>
              <option value="calibrated">Calibrated</option>
              <option value="overconfident">Overconfident</option>
            </select>
          </label>
          <button className="button button--accent" data-testid="save-outcome-review" type="submit">
            Save outcome review
          </button>
          {saved ? (
            <p role="status">Outcome recorded. This decision can now improve future routing.</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
