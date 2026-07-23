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
import {
  CompanyModelSchema,
  DecisionSchema,
  FounderProfileSchema,
  FixtureDecisionRepository,
  PRODUCTION_LENSES,
  MIND_PACKS,
  STYLE_PACKS,
  WORKROOMS,
  WorkroomKindSchema,
  CouncilSelectionSchema,
  configureWorkroomRun,
  createWorkroomRun,
  recommendCouncil,
  recordDeployment,
  resolveApproval,
  startWorkroomRun,
  councilIdempotencyKey,
  advanceDecision,
  createFixtureStudio,
  generateArtifacts,
  recordFounderDecision,
  reviewDecision,
  type DecisionRepository,
} from "@enzo/decision-core";
import { createDecisionModelProvider } from "./decision-model.js";

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

export function createToolServer(
  ownerId: string,
  decisionRepository: DecisionRepository = new FixtureDecisionRepository(),
) {
  const server = new McpServer({ name: "enzo", version: "0.1.0" });

  server.registerTool(
    "list_minds",
    {
      description: "List reviewed and research-stage methodological mind packs with their boundaries and provenance.",
      inputSchema: { workroomId: WorkroomKindSchema.optional(), includeResearch: z.boolean().default(true) },
    },
    async ({ workroomId, includeResearch }) =>
      json(
        MIND_PACKS.filter(
          (mind) =>
            (includeResearch || mind.evaluationStatus !== "research") &&
            (!workroomId || mind.compatibleWorkrooms.includes(workroomId)),
        ),
      ),
  );

  server.registerTool(
    "list_workrooms",
    { description: "List Enzo workrooms, required evidence, compatible packs, and completion criteria.", inputSchema: {} },
    async () => json(WORKROOMS),
  );

  server.registerTool(
    "list_styles",
    { description: "List output style packs. Styles affect generated work, never the Enzo workspace identity.", inputSchema: {} },
    async () => json(STYLE_PACKS),
  );

  server.registerTool(
    "recommend_council",
    {
      description: "Recommend the smallest useful set of minds for a workroom and explain the routing.",
      inputSchema: { workroomId: WorkroomKindSchema, desiredOutcome: z.string().min(1) },
    },
    async ({ workroomId, desiredOutcome }) => json(recommendCouncil(workroomId, desiredOutcome)),
  );

  server.registerTool(
    "create_workroom_run",
    {
      description: "Create an owner-scoped workroom run around a concrete founder outcome.",
      inputSchema: {
        companyId: z.string(),
        workroomId: WorkroomKindSchema,
        desiredOutcome: z.string().min(1),
        constraints: z.array(z.string()).default([]),
        evidenceClaimIds: z.array(z.string()).default([]),
      },
    },
    async (input) =>
      json(
        await decisionRepository.saveWorkroomRun(
          createWorkroomRun({ ownerId, ...input }),
        ),
      ),
  );

  server.registerTool(
    "select_workroom_packs",
    {
      description: "Save the founder-selected minds, operating approaches, and optional output style.",
      inputSchema: {
        runId: z.string(),
        mindIds: z.array(z.string()).min(1).max(4),
        approachIds: z.array(z.string()).max(3).default([]),
        styleId: z.string().optional(),
        selectionMode: z.enum(["founder", "enzo-recommended", "founder-edited"]),
        routerRationale: z.array(z.string()).default([]),
      },
    },
    async ({ runId, styleId, ...selectionInput }) => {
      const run = await decisionRepository.getWorkroomRun(ownerId, runId);
      if (!run) throw new Error("Workroom run not found.");
      const selection = CouncilSelectionSchema.parse({ schemaVersion: SCHEMA_VERSION, ...selectionInput });
      return json(await decisionRepository.saveWorkroomRun(configureWorkroomRun(run, selection, styleId)));
    },
  );

  server.registerTool(
    "start_workroom_run",
    {
      description: "Start a configured workroom. Executable workrooms stop at an explicit approval gate.",
      inputSchema: { runId: z.string() },
    },
    async ({ runId }) => {
      const run = await decisionRepository.getWorkroomRun(ownerId, runId);
      if (!run) throw new Error("Workroom run not found.");
      return json(await decisionRepository.saveWorkroomRun(startWorkroomRun(run)));
    },
  );

  server.registerTool(
    "approve_execution",
    {
      description: "Approve or deny a bounded code-change gate. Denial stops the run.",
      inputSchema: { runId: z.string(), gateId: z.string(), approved: z.boolean() },
    },
    async ({ runId, gateId, approved }) => {
      const run = await decisionRepository.getWorkroomRun(ownerId, runId);
      if (!run) throw new Error("Workroom run not found.");
      return json(await decisionRepository.saveWorkroomRun(resolveApproval(run, gateId, approved, ownerId)));
    },
  );

  server.registerTool(
    "get_workroom_run",
    { description: "Get an owner-scoped workroom run, its approvals, execution plan, and deployment record.", inputSchema: { runId: z.string() } },
    async ({ runId }) => {
      const run = await decisionRepository.getWorkroomRun(ownerId, runId);
      if (!run) throw new Error("Workroom run not found.");
      return json(run);
    },
  );

  server.registerTool(
    "approve_deployment",
    {
      description: "Approve or deny the production deployment gate after verification is complete.",
      inputSchema: { runId: z.string(), gateId: z.string(), approved: z.boolean() },
    },
    async ({ runId, gateId, approved }) => {
      const run = await decisionRepository.getWorkroomRun(ownerId, runId);
      if (!run) throw new Error("Workroom run not found.");
      return json(await decisionRepository.saveWorkroomRun(resolveApproval(run, gateId, approved, ownerId)));
    },
  );

  server.registerTool(
    "record_deployment",
    {
      description: "Record the approved deployment revision, result, URL, and rollback metadata.",
      inputSchema: {
        runId: z.string(),
        revision: z.string().min(1),
        url: z.url().optional(),
        success: z.boolean(),
        environment: z.string().default("production"),
      },
    },
    async ({ runId, ...input }) => {
      const run = await decisionRepository.getWorkroomRun(ownerId, runId);
      if (!run) throw new Error("Workroom run not found.");
      return json(await decisionRepository.saveWorkroomRun(recordDeployment(run, input)));
    },
  );

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
    "upsert_founder_profile",
    {
      description: "Create or update the authenticated founder model used to calibrate decisions.",
      inputSchema: {
        displayName: z.string().min(1).max(120),
        experience: z.array(z.string()),
        strengths: z.array(z.string()),
        constraints: z.array(z.string()),
        objectives: z.array(z.string()),
        timePerWeek: z.number().nonnegative(),
        capital: z.string(),
        team: z.string(),
        riskTolerance: z.enum(["low", "moderate", "high"]),
        workingStyle: z.string(),
        autonomyPreferences: z.array(z.string()),
        ethicalBoundaries: z.array(z.string()),
      },
    },
    async (input) =>
      json(
        await decisionRepository.upsertFounder(
          FounderProfileSchema.parse({
            schemaVersion: SCHEMA_VERSION,
            id: randomUUID(),
            ownerId,
            resources: {
              timePerWeek: input.timePerWeek,
              capital: input.capital,
              team: input.team,
            },
            updatedAt: new Date().toISOString(),
            ...input,
          }),
        ),
      ),
  );

  server.registerTool(
    "upsert_company_context",
    {
      description: "Create or update structured company context for a private project.",
      inputSchema: {
        projectId: z.string(),
        name: z.string().min(1).max(120),
        stage: z.enum(["idea", "validation", "early", "growth", "mature"]),
        customer: z.string(),
        problem: z.string(),
        product: z.string(),
        businessModel: z.string(),
        distribution: z.array(z.string()),
        brand: z.string(),
        technology: z.array(z.string()),
        metrics: z.record(z.string(), z.string()),
        risks: z.array(z.string()),
        openQuestions: z.array(z.string()),
        currentFocus: z.string(),
      },
    },
    async (input) => {
      const fixture = ownerId === "local-agent";
      if (!fixture) requireProject(input.projectId, ownerId);
      return json(
        await decisionRepository.upsertCompany(
          CompanyModelSchema.parse({
            schemaVersion: SCHEMA_VERSION,
            id: randomUUID(),
            ownerId,
            updatedAt: new Date().toISOString(),
            ...input,
          }),
        ),
      );
    },
  );

  server.registerTool(
    "create_decision",
    {
      description: "Frame a consequential founder decision without selecting the answer.",
      inputSchema: {
        companyId: z.string(),
        question: z.string().default("What should this product promise first?"),
        deadline: z.iso.datetime(),
        reviewDate: z.iso.datetime(),
        successMetric: z.string(),
        reversibility: z
          .enum(["reversible", "costly-to-reverse", "irreversible"])
          .default("reversible"),
      },
    },
    async (input) => {
      const options = createFixtureStudio(ownerId).decision.options;
      const decision = DecisionSchema.parse({
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        ownerId,
        companyId: input.companyId,
        question: input.question,
        deadline: input.deadline,
        reviewDate: input.reviewDate,
        successMetric: input.successMetric,
        reversibility: input.reversibility,
        options,
        assumptions: [],
        status: "framing",
        createdAt: new Date().toISOString(),
      });
      return json(await decisionRepository.saveDecision(decision));
    },
  );

  server.registerTool(
    "run_reality_scan",
    {
      description:
        "Normalize current evidence into visible claims, assumptions, confidence, and gaps.",
      inputSchema: { decisionId: z.string() },
    },
    async ({ decisionId }) => {
      const decision = await decisionRepository.getDecision(ownerId, decisionId);
      if (!decision) throw new Error("Decision not found.");
      if (decision.status === "framing")
        await decisionRepository.saveDecision(advanceDecision(decision, "researching"));
      const fixture = createFixtureStudio(ownerId);
      return json({
        decisionId,
        claims: fixture.claims,
        evidenceGaps: fixture.council.evidenceGaps,
      });
    },
  );

  server.registerTool(
    "route_council",
    {
      description: "Select the smallest useful council and explain every lens and blind spot.",
      inputSchema: { decisionId: z.string() },
    },
    async ({ decisionId }) => {
      const decision = await decisionRepository.getDecision(ownerId, decisionId);
      if (!decision) throw new Error("Decision not found.");
      if (decision.status === "researching")
        await decisionRepository.saveDecision(advanceDecision(decision, "council-ready"));
      else if (decision.status !== "council-ready" && decision.status !== "awaiting-founder")
        throw new Error("Run the reality scan before routing the council.");
      const fixture = createFixtureStudio(ownerId);
      return json({
        decisionId,
        lenses: PRODUCTION_LENSES,
        rationale: fixture.council.routerRationale,
      });
    },
  );

  server.registerTool(
    "run_council",
    {
      description:
        "Persist independent lens analyses before structured disagreement and Enzo synthesis.",
      inputSchema: { decisionId: z.string() },
    },
    async ({ decisionId }) => {
      const decision = await decisionRepository.getDecision(ownerId, decisionId);
      if (!decision) throw new Error("Decision not found.");
      if (decision.status !== "council-ready" && decision.status !== "awaiting-founder")
        throw new Error("Route the council before running it.");
      const fixture = createFixtureStudio(ownerId);
      const idempotencyKey = councilIdempotencyKey(decision, 1);
      const existing = await decisionRepository.getCouncilByKey(ownerId, idempotencyKey);
      if (existing) {
        if (decision.status === "council-ready")
          await decisionRepository.saveDecision(advanceDecision(decision, "awaiting-founder"));
        return json({ council: existing, reused: true });
      }
      const council = await createDecisionModelProvider().runCouncil({
        ownerId,
        decision,
        claims: fixture.claims,
        lenses: PRODUCTION_LENSES,
        idempotencyKey,
      });
      const saved = await decisionRepository.saveCouncil(council);
      await decisionRepository.saveDecision(advanceDecision(decision, "awaiting-founder"));
      return json({ council: saved, reused: false });
    },
  );

  server.registerTool(
    "record_founder_decision",
    {
      description:
        "Record the founder's final choice and rationale; Enzo never chooses on their behalf.",
      inputSchema: { decisionId: z.string(), optionId: z.string(), rationale: z.string().min(1) },
    },
    async ({ decisionId, optionId, rationale }) => {
      const decision = await decisionRepository.getDecision(ownerId, decisionId);
      if (!decision) throw new Error("Decision not found.");
      return json(
        await decisionRepository.saveDecision(recordFounderDecision(decision, optionId, rationale)),
      );
    },
  );

  server.registerTool(
    "generate_artifact",
    {
      description: "Generate cited decision artifacts linked to a founder decision.",
      inputSchema: { decisionId: z.string(), type: z.enum(["decision-memo", "thirty-day-plan"]) },
    },
    async ({ decisionId, type }) => {
      const decision = await decisionRepository.getDecision(ownerId, decisionId);
      if (!decision) throw new Error("Decision not found.");
      const council = createFixtureStudio(ownerId).council;
      const artifact = generateArtifacts(
        decision,
        { ...council, decisionId, ownerId },
        ownerId,
      ).find((item) => item.type === type);
      if (!artifact) throw new Error("Artifact type unavailable.");
      return json(await decisionRepository.saveArtifact({ ...artifact, id: randomUUID() }));
    },
  );

  server.registerTool(
    "list_decisions",
    { description: "List the authenticated founder's Decision Ledger entries.", inputSchema: {} },
    async () => json(await decisionRepository.listDecisions(ownerId)),
  );

  server.registerTool(
    "review_outcome",
    {
      description:
        "Record the observed outcome, lesson, and confidence calibration for a decided entry.",
      inputSchema: {
        decisionId: z.string(),
        observedOutcome: z.string(),
        lesson: z.string(),
        confidenceCalibration: z.enum(["underconfident", "calibrated", "overconfident"]),
        experimentId: z.string(),
      },
    },
    async ({ decisionId, observedOutcome, lesson, confidenceCalibration, experimentId }) => {
      const decision = await decisionRepository.getDecision(ownerId, decisionId);
      if (!decision) throw new Error("Decision not found.");
      return json(
        await decisionRepository.saveOutcome(
          reviewDecision(decision, observedOutcome, lesson, confidenceCalibration, experimentId),
        ),
      );
    },
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
