import { z } from "zod";

export const SCHEMA_VERSION = "1.0.0" as const;

const Versioned = z.object({ schemaVersion: z.literal(SCHEMA_VERSION).default(SCHEMA_VERSION) });

export const JobStatusSchema = z.enum(["queued", "running", "completed", "failed"]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const CitationSchema = Versioned.extend({
  id: z.string().min(1),
  evidenceId: z.string().min(1),
  label: z.string().min(1),
  url: z.url().optional(),
  excerpt: z.string().max(800).optional(),
  capturedAt: z.iso.datetime(),
});
export type Citation = z.infer<typeof CitationSchema>;

export const EvidenceKindSchema = z.enum([
  "url",
  "screenshot",
  "pdf",
  "repository",
  "codebase-fact",
]);

export const EvidenceItemSchema = Versioned.extend({
  id: z.string().min(1),
  projectId: z.string().min(1),
  kind: EvidenceKindSchema,
  title: z.string().min(1),
  sourceUrl: z.url().optional(),
  content: z.string().max(100_000).optional(),
  storagePath: z.string().optional(),
  revision: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const CaptureSchema = Versioned.extend({
  id: z.string(),
  evidenceId: z.string(),
  viewport: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }),
  title: z.string(),
  description: z.string().optional(),
  headings: z.array(z.string()),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
  forms: z.number().int().nonnegative(),
  screenshotPath: z.string().optional(),
  capturedAt: z.iso.datetime(),
});
export type Capture = z.infer<typeof CaptureSchema>;

export const FindingCategorySchema = z.enum([
  "content",
  "navigation",
  "conversion",
  "visual-design",
  "brand",
  "product",
  "positioning",
  "business-model",
  "accessibility",
  "trust",
]);

export const AuditFindingSchema = Versioned.extend({
  id: z.string(),
  category: FindingCategorySchema,
  title: z.string().min(1),
  observation: z.string().min(1),
  interpretation: z.string().min(1),
  recommendation: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"]),
  confidence: z.number().min(0).max(1),
  citations: z.array(CitationSchema),
  inference: z.boolean().default(false),
});
export type AuditFinding = z.infer<typeof AuditFindingSchema>;

export const ScorecardSchema = Versioned.extend({
  dimensions: z.record(z.string(), z.number().min(1).max(10)),
  coverage: z.number().min(0).max(1),
});
export type Scorecard = z.infer<typeof ScorecardSchema>;

export const CoverageGapSchema = Versioned.extend({
  area: z.string(),
  reason: z.string(),
  requestedEvidence: z.string().optional(),
});
export type CoverageGap = z.infer<typeof CoverageGapSchema>;

export const OpportunitySchema = Versioned.extend({
  id: z.string(),
  horizon: z.enum(["quick-win", "strategic", "foundational"]),
  title: z.string(),
  impact: z.enum(["low", "medium", "high"]),
  effort: z.enum(["low", "medium", "high"]),
  action: z.string(),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const ProjectSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  name: z.string().min(1).max(120),
  targetUrl: z.url().optional(),
  status: z.enum(["draft", "collecting", "auditing", "interview", "complete"]),
  evidenceRevision: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const AuditRunSchema = Versioned.extend({
  id: z.string(),
  projectId: z.string(),
  idempotencyKey: z.string(),
  status: JobStatusSchema,
  findings: z.array(AuditFindingSchema),
  scorecard: ScorecardSchema.optional(),
  opportunities: z.array(OpportunitySchema),
  coverageGaps: z.array(CoverageGapSchema),
  createdAt: z.iso.datetime(),
  completedAt: z.iso.datetime().optional(),
  error: z.string().optional(),
});
export type AuditRun = z.infer<typeof AuditRunSchema>;

export const QuestionSchema = Versioned.extend({
  id: z.string(),
  prompt: z.string(),
  type: z.enum(["single", "multi", "text"]),
  options: z.array(z.object({ value: z.string(), label: z.string(), description: z.string() })),
  maxSelections: z.number().int().positive().optional(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionRoundSchema = Versioned.extend({
  id: z.string(),
  projectId: z.string(),
  round: z.number().int().min(1).max(4),
  focus: z.string(),
  questions: z.array(QuestionSchema).min(1).max(6),
  synthesis: z.string().optional(),
});
export type QuestionRound = z.infer<typeof QuestionRoundSchema>;

export const AnswerSetSchema = Versioned.extend({
  projectId: z.string(),
  roundId: z.string(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  submittedAt: z.iso.datetime(),
});
export type AnswerSet = z.infer<typeof AnswerSetSchema>;

export const VisionBriefSchema = Versioned.extend({
  projectId: z.string(),
  northStar: z.string(),
  audience: z.array(z.string()),
  positioning: z.string(),
  narrative: z.array(z.string()),
  visualDirection: z.array(z.string()),
  informationArchitecture: z.array(z.string()),
  productPriorities: z.array(z.string()),
  successMetrics: z.array(z.string()),
  risks: z.array(z.string()),
  nextAction: z.string(),
  generatedAt: z.iso.datetime(),
});
export type VisionBrief = z.infer<typeof VisionBriefSchema>;

export const ReportExportSchema = Versioned.extend({
  projectId: z.string(),
  format: z.enum(["markdown", "json", "pdf"]),
  status: JobStatusSchema,
  content: z.string().optional(),
  downloadUrl: z.url().optional(),
});
export type ReportExport = z.infer<typeof ReportExportSchema>;
