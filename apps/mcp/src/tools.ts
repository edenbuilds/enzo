import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  SCHEMA_VERSION,
  AnswerSetSchema,
  createDemoAudit,
  createProject,
  generateVisionBrief,
  getQuestionRound,
  parseAuditUrl,
  sanitizeEvidenceText,
  toMarkdown,
} from "@enzo/audit-core";
import { captureUrl } from "./capture.js";
import { enrichAuditWithModel } from "./model.js";
import { store } from "./store.js";

function json(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
    structuredContent: { result: value },
  };
}

function requireProject(projectId: string, ownerId: string) {
  const project = store.projects.get(projectId);
  if (!project || project.ownerId !== ownerId) throw new Error("Project not found.");
  return project;
}

export function createToolServer(ownerId: string) {
  const server = new McpServer({ name: "enzo", version: "0.1.0" });

  server.registerTool(
    "create_project",
    {
      description: "Create a private experience audit project.",
      inputSchema: { name: z.string().min(1).max(120), targetUrl: z.url().optional() },
    },
    async ({ name, targetUrl }) =>
      json(
        store.putProject(
          createProject({
            ownerId,
            name,
            ...(targetUrl ? { targetUrl: parseAuditUrl(targetUrl).toString() } : {}),
          }),
        ),
      ),
  );

  server.registerTool(
    "ingest_url",
    {
      description:
        "Safely capture a public HTTPS URL at supported viewports and attach it as evidence.",
      inputSchema: { projectId: z.string(), url: z.url() },
    },
    async ({ projectId, url }) => {
      const project = requireProject(projectId, ownerId);
      const safeUrl = parseAuditUrl(url).toString();
      const evidenceId = randomUUID();
      const captures = await captureUrl(safeUrl, evidenceId);
      const item = store.addEvidence({
        schemaVersion: SCHEMA_VERSION,
        id: evidenceId,
        projectId: project.id,
        kind: "url",
        title: captures[0]?.title ?? new URL(safeUrl).hostname,
        sourceUrl: safeUrl,
        content: captures.flatMap((capture) => capture.headings).join("\n"),
        revision: project.evidenceRevision + 1,
        createdAt: new Date().toISOString(),
      });
      return json({ evidence: item, captures });
    },
  );

  server.registerTool(
    "submit_evidence",
    {
      description:
        "Submit a screenshot, PDF, repository reference, or observed codebase fact as evidence.",
      inputSchema: {
        projectId: z.string(),
        kind: z.enum(["screenshot", "pdf", "repository", "codebase-fact"]),
        title: z.string().min(1),
        content: z.string().max(100_000).optional(),
        sourceUrl: z.url().optional(),
        storagePath: z.string().optional(),
      },
    },
    async ({ projectId, kind, title, content, sourceUrl, storagePath }) => {
      const project = requireProject(projectId, ownerId);
      return json(
        store.addEvidence({
          schemaVersion: SCHEMA_VERSION,
          id: randomUUID(),
          projectId,
          kind,
          title,
          ...(content ? { content: sanitizeEvidenceText(content) } : {}),
          ...(sourceUrl ? { sourceUrl } : {}),
          ...(storagePath ? { storagePath } : {}),
          revision: project.evidenceRevision + 1,
          createdAt: new Date().toISOString(),
        }),
      );
    },
  );

  server.registerTool(
    "start_audit",
    {
      description: "Start or reuse an idempotent audit for the current evidence revision.",
      inputSchema: { projectId: z.string() },
    },
    async ({ projectId }) => {
      const project = requireProject(projectId, ownerId);
      const evidence = store.evidence.get(projectId) ?? [];
      const freshProject = store.projects.get(projectId) ?? project;
      const audit = createDemoAudit(freshProject, evidence);
      const existing = [...store.audits.values()].find(
        (item) => item.idempotencyKey === audit.idempotencyKey,
      );
      if (existing) return json({ audit: existing, reused: true });
      store.audits.set(audit.id, audit);
      const enrichment = await enrichAuditWithModel(audit, evidence).catch(() => null);
      return json({ audit, enrichment, reused: false });
    },
  );

  server.registerTool(
    "get_audit",
    {
      description:
        "Get an audit run with findings, citations, scores, opportunities, and coverage gaps.",
      inputSchema: { projectId: z.string(), auditId: z.string().optional() },
    },
    async ({ projectId, auditId }) => {
      requireProject(projectId, ownerId);
      const audit = auditId
        ? store.audits.get(auditId)
        : [...store.audits.values()].find((item) => item.projectId === projectId);
      if (!audit) throw new Error("Audit not found.");
      return json(audit);
    },
  );

  server.registerTool(
    "get_question_round",
    {
      description: "Return the next unanswered adaptive vision interview round.",
      inputSchema: { projectId: z.string() },
    },
    async ({ projectId }) => {
      requireProject(projectId, ownerId);
      return json(getQuestionRound(projectId, store.answers.get(projectId) ?? []));
    },
  );

  server.registerTool(
    "submit_answers",
    {
      description: "Validate and store answers for one interview round.",
      inputSchema: {
        projectId: z.string(),
        roundId: z.string(),
        answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
      },
    },
    async ({ projectId, roundId, answers }) => {
      requireProject(projectId, ownerId);
      return json(
        store.addAnswers(
          AnswerSetSchema.parse({
            schemaVersion: SCHEMA_VERSION,
            projectId,
            roundId,
            answers,
            submittedAt: new Date().toISOString(),
          }),
        ),
      );
    },
  );

  server.registerTool(
    "generate_vision_brief",
    {
      description: "Synthesize a decision-ready Vision Brief from the audit and interview answers.",
      inputSchema: { projectId: z.string() },
    },
    async ({ projectId }) => {
      const project = requireProject(projectId, ownerId);
      const brief = generateVisionBrief(project, store.answers.get(projectId) ?? []);
      store.briefs.set(projectId, brief);
      return json(brief);
    },
  );

  server.registerTool(
    "export_report",
    {
      description:
        "Export the current audit and Vision Brief as Markdown or JSON. PDF uses the web print view.",
      inputSchema: { projectId: z.string(), format: z.enum(["markdown", "json", "pdf"]) },
    },
    async ({ projectId, format }) => {
      const project = requireProject(projectId, ownerId);
      const audit = [...store.audits.values()].find((item) => item.projectId === projectId);
      if (!audit) throw new Error("Run an audit before exporting.");
      const brief = store.briefs.get(projectId);
      if (format === "pdf")
        return json({
          schemaVersion: SCHEMA_VERSION,
          projectId,
          format,
          status: "completed",
          downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reports/${projectId}?print=1`,
        });
      const content =
        format === "json"
          ? JSON.stringify({ project, audit, brief }, null, 2)
          : toMarkdown(project, audit, brief);
      return json({
        schemaVersion: SCHEMA_VERSION,
        projectId,
        format,
        status: "completed",
        content,
      });
    },
  );

  return server;
}
