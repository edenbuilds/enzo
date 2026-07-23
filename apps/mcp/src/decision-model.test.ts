import { describe, expect, it } from "vitest";
import { PRODUCTION_LENSES, councilIdempotencyKey, createFixtureStudio } from "@enzo/decision-core";
import { FixtureDecisionModelProvider } from "./decision-model.js";

describe("decision model provider", () => {
  it("seals independent analyses before disagreement", async () => {
    const studio = createFixtureStudio("founder-test");
    const run = await new FixtureDecisionModelProvider().runCouncil({
      ownerId: "founder-test",
      decision: studio.decision,
      claims: studio.claims,
      lenses: PRODUCTION_LENSES,
      idempotencyKey: councilIdempotencyKey(studio.decision, 1),
    });
    expect(run.analyses).toHaveLength(3);
    expect(run.analyses.every((analysis) => analysis.visiblePeerAnalysisIds.length === 0)).toBe(
      true,
    );
    expect(run.disagreements.length).toBeGreaterThan(0);
  });
});
