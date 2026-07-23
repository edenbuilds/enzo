"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    prompt: "What must this experience achieve first?",
    options: ["Create qualified demand", "Explain the product", "Earn institutional trust"],
  },
  {
    prompt: "Which posture should it own?",
    options: ["Premium specialist", "Category challenger", "Quietly superior utility"],
  },
];

export function Interview() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const question = questions[step];
  if (!question) {
    return (
      <section className="interview-complete" aria-live="polite">
        <p className="eyebrow">Direction resolved</p>
        <h1>The brief is ready to become a decision.</h1>
        <p>Your answers now point toward a premium, evidence-led product story.</p>
        <Link className="button button--primary" href="/reports/demo">
          Read the Vision Brief
        </Link>
      </section>
    );
  }
  return (
    <section className="question-panel">
      <div className="question-panel__progress">
        <p className="eyebrow">
          Round {step + 1} of {questions.length}
        </p>
        <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
      </div>
      <h1>{question.prompt}</h1>
      <div className="choice-grid" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option) => (
          <label key={option} className={answer === option ? "choice choice--selected" : "choice"}>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={answer === option}
              onChange={() => setAnswer(option)}
            />
            <span>{option}</span>
            <small>Choose this direction when it should govern the next design decision.</small>
          </label>
        ))}
      </div>
      <button
        className="button button--primary"
        disabled={!answer}
        onClick={() => {
          setStep((current) => current + 1);
          setAnswer("");
        }}
      >
        Continue
      </button>
    </section>
  );
}
