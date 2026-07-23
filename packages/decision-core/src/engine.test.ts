import { describe, expect, it } from "vitest";
import {
  FixtureDecisionRepository,
  advanceDecision,
  councilIdempotencyKey,
  createFixtureStudio,
  recordFounderDecision,
  reviewDecision,
  MIND_PACKS,
  STYLE_PACKS,
  WORKROOMS,
  configureWorkroomRun,
  createWorkroomRun,
  recommendCouncil,
  resolveApproval,
  startWorkroomRun,
} from "./index.js";

describe("decision studio", () => {
  it("keeps round-one lens analyses independent", () => {
    const fixture = createFixtureStudio();
    expect(fixture.council.analyses).toHaveLength(3);
    expect(
      fixture.council.analyses.every((analysis) => analysis.visiblePeerAnalysisIds.length === 0),
    ).toBe(true);
  });
  it("creates a stable council idempotency key", () => {
    const fixture = createFixtureStudio();
    expect(councilIdempotencyKey(fixture.decision, 3)).toBe(
      councilIdempotencyKey(fixture.decision, 3),
    );
    expect(councilIdempotencyKey(fixture.decision, 4)).not.toBe(
      councilIdempotencyKey(fixture.decision, 3),
    );
  });
  it("preserves founder authority and validates outcome order", () => {
    const fixture = createFixtureStudio();
    expect(() => reviewDecision(fixture.decision, "Observed", "Learned", "calibrated")).toThrow();
    const decided = recordFounderDecision(
      fixture.decision,
      "option-judgment",
      "The evidence supports the mechanism.",
      "2026-07-24T00:00:00.000Z",
    );
    expect(decided.finalOptionId).toBe("option-judgment");
    expect(
      reviewDecision(decided, "Completion improved", "Persist the loop", "calibrated").decisionId,
    ).toBe(decided.id);
  });
  it("rejects skipped workflow transitions", () => {
    const fixture = createFixtureStudio();
    const framing = { ...fixture.decision, status: "framing" as const };
    expect(() => advanceDecision(framing, "awaiting-founder")).toThrow(
      /Invalid decision transition/,
    );
    expect(advanceDecision(framing, "researching").status).toBe("researching");
    expect(() => recordFounderDecision(framing, "option-judgment", "Skipping the council")).toThrow(
      /council must be sealed/i,
    );
  });
  it("isolates fixture tenants and reuses an idempotent council", async () => {
    const repository = new FixtureDecisionRepository();
    const a = await repository.getSnapshot("founder-a");
    const b = await repository.getSnapshot("founder-b");
    expect(a.founder.ownerId).toBe("founder-a");
    expect(b.founder.ownerId).toBe("founder-b");
    await repository.saveDecision({ ...a.decision, id: "decision-founder-a" });
    expect(await repository.getDecision("founder-b", "decision-founder-a")).toBeNull();
    await repository.saveCouncil(a.council);
    expect(await repository.getCouncilByKey("founder-a", a.council.idempotencyKey)).toEqual(
      a.council,
    );
    expect(await repository.getCouncilByKey("founder-b", a.council.idempotencyKey)).toBeNull();
  });

  it("publishes bounded mind, style, and workroom catalogs", () => {
    expect(MIND_PACKS).toHaveLength(10);
    expect(STYLE_PACKS).toHaveLength(8);
    expect(WORKROOMS).toHaveLength(8);
    expect(MIND_PACKS.find((mind) => mind.id === "alex-hormozi")?.evaluationStatus).toBe("research");
    expect(MIND_PACKS.every((mind) => mind.disclosure.includes("not the person"))).toBe(true);
  });

  it("rejects research-stage minds and incompatible packs", () => {
    const run = createWorkroomRun({
      ownerId: "founder-a",
      companyId: "company-a",
      workroomId: "sales-offers",
      desiredOutcome: "Clarify the offer",
      evidenceClaimIds: ["claim-a"],
    });
    expect(() =>
      configureWorkroomRun(run, {
        schemaVersion: "1.0.0",
        mindIds: ["alex-hormozi"],
        approachIds: [],
        selectionMode: "founder",
        routerRationale: [],
      }),
    ).toThrow(/research review/i);
    expect(() =>
      configureWorkroomRun(run, {
        schemaVersion: "1.0.0",
        mindIds: ["steve-jobs"],
        approachIds: [],
        selectionMode: "founder",
        routerRationale: [],
      }),
    ).toThrow(/not compatible/i);
  });

  it("requires separate execution and deployment approvals", () => {
    const run = createWorkroomRun({
      ownerId: "founder-a",
      companyId: "company-a",
      workroomId: "forward-deployed-engineering",
      desiredOutcome: "Ship a bounded change",
      evidenceClaimIds: ["claim-code"],
    });
    const configured = configureWorkroomRun(run, {
      ...recommendCouncil("product-strategy", "Focus the product"),
      mindIds: ["steve-jobs"],
      approachIds: [],
      selectionMode: "founder",
    }, "technical-utility");
    const started = startWorkroomRun(configured);
    expect(started.status).toBe("awaiting-execution-approval");
    const executionGate = started.approvalGates[0]!;
    const executionApproved = resolveApproval(started, executionGate.id, true, "founder-a");
    expect(executionApproved.status).toBe("awaiting-deployment-approval");
    expect(executionApproved.approvalGates.some((gate) => gate.type === "deployment" && gate.status === "pending")).toBe(true);
  });
});
