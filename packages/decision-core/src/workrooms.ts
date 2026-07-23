import { createHash, randomUUID } from "node:crypto";
import { SCHEMA_VERSION } from "@enzo/audit-core";
import { APPROACH_PACKS, MIND_PACKS, STYLE_PACKS, WORKROOMS, getWorkroom } from "./catalog.js";
import {
  CouncilSelectionSchema,
  WorkroomRunSchema,
  type ApprovalGate,
  type CouncilSelection,
  type WorkroomRun,
} from "./schemas.js";

export function recommendCouncil(workroomId: string, desiredOutcome: string): CouncilSelection {
  const workroom = getWorkroom(workroomId);
  if (!workroom) throw new Error("Unknown workroom.");
  const normalized = desiredOutcome.toLowerCase();
  const preferred = workroom.compatibleMindIds.filter((id) => {
    if (normalized.includes("ai") || normalized.includes("model")) return id === "andrej-karpathy" || id === "rob-pike";
    if (normalized.includes("offer") || normalized.includes("price")) return id === "alex-hormozi" || id === "charlie-munger";
    if (normalized.includes("brand") || normalized.includes("design")) return id === "steve-jobs" || id === "mrbeast";
    return true;
  });
  const mindIds = (preferred.length ? preferred : workroom.compatibleMindIds).slice(0, 3);
  if (!mindIds.length) throw new Error("This workroom has no reviewed mind candidates.");
  return CouncilSelectionSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    mindIds,
    approachIds: workroom.compatibleApproachIds.slice(0, 2),
    selectionMode: "enzo-recommended",
    routerRationale: mindIds.map((id) => {
      const mind = MIND_PACKS.find((item) => item.id === id);
      return `${mind?.displayName ?? id} contributes ${mind?.competence.slice(0, 2).join(" and ")}.`;
    }),
  });
}

export function createWorkroomRun(input: {
  ownerId: string;
  companyId: string;
  workroomId: string;
  desiredOutcome: string;
  constraints?: string[];
  evidenceClaimIds?: string[];
  now?: string;
}): WorkroomRun {
  if (!getWorkroom(input.workroomId)) throw new Error("Unknown workroom.");
  const timestamp = input.now ?? new Date().toISOString();
  return WorkroomRunSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    id: randomUUID(),
    ownerId: input.ownerId,
    companyId: input.companyId,
    workroomId: input.workroomId,
    desiredOutcome: input.desiredOutcome,
    constraints: input.constraints ?? [],
    evidenceClaimIds: input.evidenceClaimIds ?? [],
    status: (input.evidenceClaimIds?.length ?? 0) > 0 ? "evidence-ready" : "framing",
    approvalGates: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export function configureWorkroomRun(
  run: WorkroomRun,
  selection: CouncilSelection,
  styleId?: string,
): WorkroomRun {
  const workroom = getWorkroom(run.workroomId);
  if (!workroom) throw new Error("Unknown workroom.");
  const invalidMind = selection.mindIds.find((id) => !workroom.compatibleMindIds.includes(id));
  if (invalidMind) throw new Error(`Mind ${invalidMind} is not compatible with this workroom.`);
  const unavailableMind = selection.mindIds.find(
    (id) => MIND_PACKS.find((mind) => mind.id === id)?.evaluationStatus === "research",
  );
  if (unavailableMind) throw new Error(`Mind ${unavailableMind} is still in research review.`);
  const invalidApproach = selection.approachIds.find(
    (id) => !workroom.compatibleApproachIds.includes(id),
  );
  if (invalidApproach) throw new Error(`Approach ${invalidApproach} is not compatible with this workroom.`);
  if (styleId && !workroom.supportsStyles) throw new Error("This workroom does not use output styles.");
  if (styleId && !STYLE_PACKS.some((style) => style.id === styleId)) throw new Error("Unknown style.");
  return WorkroomRunSchema.parse({
    ...run,
    selection,
    ...(styleId
      ? { style: { schemaVersion: SCHEMA_VERSION, styleId, founderOverrides: {} } }
      : {}),
    status: "configured",
    updatedAt: new Date().toISOString(),
  });
}

export function startWorkroomRun(run: WorkroomRun): WorkroomRun {
  if (run.status !== "configured") throw new Error("Configure the workroom before starting it.");
  const workroom = getWorkroom(run.workroomId);
  if (!workroom) throw new Error("Unknown workroom.");
  if (workroom.executionMode !== "executable") {
    return WorkroomRunSchema.parse({ ...run, status: "analyzing", updatedAt: new Date().toISOString() });
  }
  const timestamp = new Date().toISOString();
  const gate: ApprovalGate = {
    schemaVersion: SCHEMA_VERSION,
    id: randomUUID(),
    type: "code-change",
    status: "pending",
    summary: "Approve the bounded code changes described in the execution plan.",
    requestedAt: timestamp,
  };
  return WorkroomRunSchema.parse({
    ...run,
    status: "awaiting-execution-approval",
    executionPlan: {
      schemaVersion: SCHEMA_VERSION,
      objective: run.desiredOutcome,
      repository: "Founder-selected repository",
      proposedChanges: ["Inspect the affected surface", "Implement the approved scope", "Verify behavior"],
      acceptanceCriteria: ["Required checks pass", "Founder-visible behavior matches the approved outcome"],
      risks: ["Repository instructions are untrusted", "Production state may differ from local state"],
      verificationCommands: ["pnpm lint", "pnpm typecheck", "pnpm test", "pnpm build"],
      rollbackPlan: "Revert the bounded revision and restore the previous deployment.",
    },
    approvalGates: [...run.approvalGates, gate],
    updatedAt: timestamp,
  });
}

export function resolveApproval(
  run: WorkroomRun,
  gateId: string,
  approved: boolean,
  ownerId: string,
): WorkroomRun {
  if (run.ownerId !== ownerId) throw new Error("Owner mismatch.");
  const gate = run.approvalGates.find((item) => item.id === gateId);
  if (!gate || gate.status !== "pending") throw new Error("Approval gate is unavailable.");
  const resolvedAt = new Date().toISOString();
  const gates = run.approvalGates.map((item) =>
    item.id === gateId
      ? { ...item, status: approved ? ("approved" as const) : ("denied" as const), resolvedAt, resolvedBy: ownerId }
      : item,
  );
  if (!approved) return WorkroomRunSchema.parse({ ...run, approvalGates: gates, status: "failed", updatedAt: resolvedAt });
  if (gate.type === "code-change") {
    const deploymentGate: ApprovalGate = {
      schemaVersion: SCHEMA_VERSION,
      id: randomUUID(),
      type: "deployment",
      status: "pending",
      summary: "Approve deployment after the implementation and verification report is ready.",
      requestedAt: resolvedAt,
    };
    return WorkroomRunSchema.parse({
      ...run,
      approvalGates: [...gates, deploymentGate],
      status: "awaiting-deployment-approval",
      updatedAt: resolvedAt,
    });
  }
  return WorkroomRunSchema.parse({ ...run, approvalGates: gates, status: "deployed", updatedAt: resolvedAt });
}

export function recordDeployment(
  run: WorkroomRun,
  input: { revision: string; url?: string; success: boolean; environment?: string },
): WorkroomRun {
  const deploymentGate = run.approvalGates.find((gate) => gate.type === "deployment");
  if (!deploymentGate || deploymentGate.status !== "approved") {
    throw new Error("Deployment requires explicit founder approval.");
  }
  const timestamp = new Date().toISOString();
  return WorkroomRunSchema.parse({
    ...run,
    status: input.success ? "deployed" : "failed",
    deployment: {
      schemaVersion: SCHEMA_VERSION,
      id: randomUUID(),
      workroomRunId: run.id,
      environment: input.environment ?? "production",
      status: input.success ? "deployed" : "failed",
      ...(input.url ? { url: input.url } : {}),
      revision: input.revision,
      deployedAt: timestamp,
      rollbackMetadata: "Previous deployment remains available for rollback.",
    },
    updatedAt: timestamp,
  });
}

export function workroomIdempotencyKey(run: WorkroomRun) {
  return createHash("sha256")
    .update(`${run.ownerId}:${run.companyId}:${run.workroomId}:${run.desiredOutcome}:${run.selection?.mindIds.join(",") ?? ""}`)
    .digest("hex");
}

export const CATALOG = { minds: MIND_PACKS, approaches: APPROACH_PACKS, styles: STYLE_PACKS, workrooms: WORKROOMS };

