import { describe, expect, it } from "vitest";
import { createProject } from "@enzo/audit-core";
import { MemoryStore } from "./store.js";

describe("tenant store", () => {
  it("increments the evidence revision", () => {
    const store = new MemoryStore();
    const project = store.putProject(createProject({ ownerId: "owner", name: "Test" }));
    store.addEvidence({
      schemaVersion: "1.0.0",
      id: "e1",
      projectId: project.id,
      kind: "codebase-fact",
      title: "Routes",
      content: "Three primary routes",
      revision: 1,
      createdAt: new Date().toISOString(),
    });
    expect(store.projects.get(project.id)?.evidenceRevision).toBe(1);
  });
});
