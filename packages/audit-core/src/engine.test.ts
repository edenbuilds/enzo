import { describe, expect, it } from "vitest";
import { buildIdempotencyKey, createDemoAudit, createProject, getQuestionRound } from "./engine.js";

describe("audit orchestration", () => {
  it("builds stable idempotency keys", () => {
    expect(buildIdempotencyKey("p1", 2, { depth: 2 })).toBe(
      buildIdempotencyKey("p1", 2, { depth: 2 }),
    );
    expect(buildIdempotencyKey("p1", 2)).not.toBe(buildIdempotencyKey("p1", 3));
  });

  it("labels unsupported findings as inference", () => {
    const project = createProject({ ownerId: "demo", name: "Demo" });
    const audit = createDemoAudit(project, []);
    expect(audit.findings.every((finding) => finding.inference)).toBe(true);
    expect(audit.coverageGaps).toHaveLength(1);
  });

  it("advances adaptive interview rounds", () => {
    const first = getQuestionRound("p1", []);
    expect(first?.round).toBe(1);
    const second = getQuestionRound("p1", [
      {
        schemaVersion: "1.0.0",
        projectId: "p1",
        roundId: "round-purpose",
        answers: {},
        submittedAt: new Date().toISOString(),
      },
    ]);
    expect(second?.round).toBe(2);
  });
});
