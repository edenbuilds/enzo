"use client";

import { useState } from "react";
import type { WorkroomRun } from "@enzo/decision-core";
import { EnzoPuppy } from "@enzo/design-system";

export function FdeWorkroom({ run }: { run: WorkroomRun }) {
  const [executionApproved, setExecutionApproved] = useState(false);
  const [deploymentApproved, setDeploymentApproved] = useState(false);
  return <div className="fde-workroom">
    <div className="fde-demo-notice" role="note"><strong>Interactive workflow preview</strong><span>No repository is connected. These approvals do not run code or change production.</span></div>
    <section className="fde-brief"><div><p className="eyebrow">Desired outcome</p><h2>{run.desiredOutcome}</h2><p>Enzo connects the company decision to a bounded technical change. Repository content remains untrusted evidence.</p></div><EnzoPuppy state={executionApproved ? "ready" : "investigating"} /></section>
    <section className="execution-plan" data-testid="execution-plan"><p className="eyebrow">Execution plan</p><div className="execution-plan__grid"><div><h3>Proposed changes</h3><ul>{run.executionPlan?.proposedChanges.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Acceptance</h3><ul>{run.executionPlan?.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Risks</h3><ul>{run.executionPlan?.risks.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
    <section className="approval-room"><div><p className="eyebrow">Approval 01</p><h2>Allow the bounded code change?</h2><p>No code, migration, credential, or infrastructure state changes before your approval.</p></div><button className="button button--accent" onClick={() => setExecutionApproved(true)} data-testid="approve-execution">{executionApproved ? "Approval previewed" : "Preview execution approval"}</button></section>
    <section className={executionApproved ? "verification-report" : "verification-report verification-report--locked"}><p className="eyebrow">Verification report</p><h2>{executionApproved ? "A connected run would show evidence here." : "Waiting for execution approval."}</h2><div className="check-row"><span>Formatting</span><b>{executionApproved ? "Not run in demo" : "Pending"}</b></div><div className="check-row"><span>Types and tests</span><b>{executionApproved ? "Not run in demo" : "Pending"}</b></div><div className="check-row"><span>Build and browser review</span><b>{executionApproved ? "Not run in demo" : "Pending"}</b></div></section>
    <section className="approval-room"><div><p className="eyebrow">Approval 02</p><h2>Deploy the verified revision?</h2><p>Production deployment is a separate founder decision with a recorded rollback path.</p></div><button className="button button--accent" disabled={!executionApproved} onClick={() => setDeploymentApproved(true)} data-testid="approve-deployment">{deploymentApproved ? "Approval previewed" : "Preview deployment approval"}</button></section>
    {deploymentApproved ? <div className="deployment-confirmation" role="status" data-testid="deployment-confirmation"><EnzoPuppy state="reviewing" /><div><strong>Deployment recorded</strong><p>The public fixture did not change production. A private run would now add the revision and review date to the Decision Ledger.</p></div></div> : null}
  </div>;
}
