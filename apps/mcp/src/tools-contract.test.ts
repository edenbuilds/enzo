import { afterEach, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { FixtureDecisionRepository } from "@enzo/decision-core";
import { createToolServer } from "./tools.js";

const toolNames = [
  "create_project",
  "ingest_url",
  "submit_evidence",
  "start_audit",
  "get_audit",
  "get_question_round",
  "submit_answers",
  "generate_vision_brief",
  "export_report",
  "upsert_founder_profile",
  "upsert_company_context",
  "create_decision",
  "run_reality_scan",
  "route_council",
  "run_council",
  "record_founder_decision",
  "generate_artifact",
  "list_decisions",
  "review_outcome",
];

describe("MCP decision contract", () => {
  const closers: Array<() => Promise<void>> = [];
  afterEach(async () => Promise.all(closers.splice(0).map((close) => close())));

  it("publishes all original and decision tools and enforces workflow order", async () => {
    const repository = new FixtureDecisionRepository();
    const server = createToolServer("contract-founder", repository);
    const client = new Client({ name: "contract-test", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    closers.push(
      () => client.close(),
      () => server.close(),
    );

    const listed = await client.listTools();
    expect(listed.tools.map((tool) => tool.name).sort()).toEqual([...toolNames].sort());

    const created = await client.callTool({
      name: "create_decision",
      arguments: {
        companyId: "company-contract",
        deadline: "2026-08-01T00:00:00.000Z",
        reviewDate: "2026-09-01T00:00:00.000Z",
        successMetric: "Five completed founder decisions",
      },
    });
    const decision = (created.structuredContent as { result: { id: string } }).result;

    const premature = await client.callTool({
      name: "record_founder_decision",
      arguments: { decisionId: decision.id, optionId: "option-judgment", rationale: "Too early" },
    });
    expect(premature.isError).toBe(true);

    for (const name of ["run_reality_scan", "route_council", "run_council"]) {
      const result = await client.callTool({ name, arguments: { decisionId: decision.id } });
      expect(result.isError).not.toBe(true);
    }
    const recorded = await client.callTool({
      name: "record_founder_decision",
      arguments: {
        decisionId: decision.id,
        optionId: "option-judgment",
        rationale: "It makes the complete evidence-to-outcome loop legible.",
      },
    });
    expect(recorded.isError).not.toBe(true);
  });
});
