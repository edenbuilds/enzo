import { z } from "zod";
import { CitationSchema, SCHEMA_VERSION } from "@enzo/audit-core";

const Versioned = z.object({ schemaVersion: z.literal(SCHEMA_VERSION).default(SCHEMA_VERSION) });
const IsoDate = z.iso.datetime();

export const FounderProfileSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  displayName: z.string().min(1).max(120),
  experience: z.array(z.string()),
  strengths: z.array(z.string()),
  constraints: z.array(z.string()),
  objectives: z.array(z.string()),
  resources: z.object({
    timePerWeek: z.number().nonnegative(),
    capital: z.string(),
    team: z.string(),
  }),
  riskTolerance: z.enum(["low", "moderate", "high"]),
  workingStyle: z.string(),
  autonomyPreferences: z.array(z.string()),
  ethicalBoundaries: z.array(z.string()),
  updatedAt: IsoDate,
});
export type FounderProfile = z.infer<typeof FounderProfileSchema>;

export const CompanyModelSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
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
  updatedAt: IsoDate,
});
export type CompanyModel = z.infer<typeof CompanyModelSchema>;

export const ClaimClassSchema = z.enum([
  "verified",
  "user-provided",
  "researched",
  "inferred",
  "assumed",
  "hypothetical",
  "perspective-specific",
]);
export const EvidenceClaimSchema = Versioned.extend({
  id: z.string(),
  companyId: z.string(),
  statement: z.string(),
  classification: ClaimClassSchema,
  sourceLabel: z.string(),
  freshness: z.enum(["current", "dated", "unknown"]),
  confidence: z.number().min(0).max(1),
  citations: z.array(CitationSchema),
});
export type EvidenceClaim = z.infer<typeof EvidenceClaimSchema>;

export const LensDefinitionSchema = Versioned.extend({
  id: z.string(),
  displayName: z.string(),
  type: z.enum(["person-lens", "domain-playbook"]),
  competence: z.array(z.string()),
  exclusions: z.array(z.string()),
  disclosure: z.string(),
  provenance: z.array(z.url()),
  blindSpots: z.array(z.string()),
  knowledgeCutoff: z.string(),
  evaluationStatus: z.enum(["research", "reviewed", "production"]),
  domains: z.array(z.string()).default([]),
  typicalQuestions: z.array(z.string()).default([]),
  exampleOutput: z.string().optional(),
});
export type LensDefinition = z.infer<typeof LensDefinitionSchema>;

export const DecisionOptionSchema = Versioned.extend({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  tradeoffs: z.array(z.string()),
});
export const DecisionSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  companyId: z.string(),
  question: z.string(),
  deadline: IsoDate,
  reversibility: z.enum(["reversible", "costly-to-reverse", "irreversible"]),
  options: z.array(DecisionOptionSchema).min(2),
  assumptions: z.array(z.string()),
  status: z.enum([
    "framing",
    "researching",
    "council-ready",
    "awaiting-founder",
    "decided",
    "reviewed",
  ]),
  successMetric: z.string(),
  reviewDate: IsoDate,
  finalOptionId: z.string().optional(),
  founderRationale: z.string().optional(),
  createdAt: IsoDate,
  decidedAt: IsoDate.optional(),
});
export type Decision = z.infer<typeof DecisionSchema>;

export const LensAnalysisSchema = Versioned.extend({
  id: z.string(),
  councilRunId: z.string(),
  lensId: z.string(),
  diagnosis: z.string(),
  evidenceClaimIds: z.array(z.string()),
  assumptionsChallenged: z.array(z.string()),
  preserve: z.array(z.string()),
  remove: z.array(z.string()),
  opportunity: z.string(),
  risk: z.string(),
  nextAction: z.string(),
  confidence: z.number().min(0).max(1),
  visiblePeerAnalysisIds: z.array(z.string()).max(0),
});
export type LensAnalysis = z.infer<typeof LensAnalysisSchema>;

export const CouncilRunSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  decisionId: z.string(),
  idempotencyKey: z.string(),
  selectedLensIds: z.array(z.string()).min(1).max(4),
  routerRationale: z.array(z.string()),
  analyses: z.array(LensAnalysisSchema),
  agreements: z.array(z.string()),
  disagreements: z.array(
    z.object({ issue: z.string(), positions: z.array(z.string()), evidenceNeeded: z.string() }),
  ),
  synthesis: z.string(),
  dissent: z.string(),
  confidence: z.number().min(0).max(1),
  evidenceGaps: z.array(z.string()),
  recommendedOptionId: z.string(),
  createdAt: IsoDate,
  sealedAt: IsoDate,
});
export type CouncilRun = z.infer<typeof CouncilRunSchema>;

export const ArtifactSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  companyId: z.string(),
  decisionId: z.string(),
  type: z.enum([
    "decision-memo",
    "thirty-day-plan",
    "technical-design",
    "implementation-plan",
    "design-direction",
    "campaign-brief",
    "sales-playbook",
  ]),
  title: z.string(),
  body: z.string(),
  citations: z.array(CitationSchema),
  revision: z.number().int().positive(),
  status: z.enum(["draft", "final"]),
  exportFormats: z.array(z.enum(["markdown", "json", "pdf"])),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const ExperimentSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  decisionId: z.string(),
  hypothesis: z.string(),
  metric: z.string(),
  expectedOutcome: z.string(),
  status: z.enum(["planned", "running", "complete"]),
  reviewDate: IsoDate,
});
export type Experiment = z.infer<typeof ExperimentSchema>;

export const OutcomeReviewSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  decisionId: z.string(),
  experimentId: z.string(),
  observedOutcome: z.string(),
  lesson: z.string(),
  confidenceCalibration: z.enum(["underconfident", "calibrated", "overconfident"]),
  reviewedAt: IsoDate,
});
export type OutcomeReview = z.infer<typeof OutcomeReviewSchema>;

export const EvaluationStatusSchema = z.enum(["research", "reviewed", "production"]);
export const WorkroomKindSchema = z.enum([
  "product-strategy",
  "design-brand",
  "marketing-growth",
  "sales-offers",
  "forward-deployed-engineering",
  "experience-audit",
  "decision-room",
  "decision-ledger",
]);

const CatalogPackBase = Versioned.extend({
  id: z.string(),
  version: z.string(),
  displayName: z.string(),
  summary: z.string(),
  domains: z.array(z.string()),
  competence: z.array(z.string()),
  exclusions: z.array(z.string()),
  blindSpots: z.array(z.string()),
  compatibleWorkrooms: z.array(WorkroomKindSchema),
  typicalQuestions: z.array(z.string()),
  exampleOutput: z.string(),
  provenance: z.array(z.url()),
  knowledgeCutoff: z.string(),
  evaluationStatus: EvaluationStatusSchema,
  disclosure: z.string(),
});

export const MindPackSchema = CatalogPackBase.extend({
  kind: z.literal("mind"),
  methodology: z.array(z.string()),
});
export type MindPack = z.infer<typeof MindPackSchema>;

export const ApproachPackSchema = CatalogPackBase.extend({
  kind: z.literal("approach"),
  principles: z.array(z.string()),
});
export type ApproachPack = z.infer<typeof ApproachPackSchema>;

export const StylePackSchema = Versioned.extend({
  id: z.string(),
  version: z.string(),
  kind: z.literal("style"),
  displayName: z.string(),
  summary: z.string(),
  tokens: z.record(z.string(), z.string()),
  typography: z.array(z.string()),
  layoutPrinciples: z.array(z.string()),
  imageryDirection: z.array(z.string()),
  motionBoundaries: z.array(z.string()),
  accessibilityRequirements: z.array(z.string()),
  prohibitedPatterns: z.array(z.string()),
  exampleComponents: z.array(z.string()),
  exportFormats: z.array(z.enum(["web", "markdown", "pdf", "slides"])),
});
export type StylePack = z.infer<typeof StylePackSchema>;

export const WorkroomDefinitionSchema = Versioned.extend({
  id: WorkroomKindSchema,
  displayName: z.string(),
  summary: z.string(),
  evidenceRequirements: z.array(z.string()),
  compatibleMindIds: z.array(z.string()),
  compatibleApproachIds: z.array(z.string()),
  supportsStyles: z.boolean(),
  artifactTypes: z.array(ArtifactSchema.shape.type),
  completionCriteria: z.array(z.string()),
  executionMode: z.enum(["advisory", "artifact", "executable"]),
});
export type WorkroomDefinition = z.infer<typeof WorkroomDefinitionSchema>;

export const PackCompatibilitySchema = Versioned.extend({
  workroomId: WorkroomKindSchema,
  packId: z.string(),
  compatible: z.boolean(),
  rationale: z.string(),
});
export type PackCompatibility = z.infer<typeof PackCompatibilitySchema>;

export const CouncilSelectionSchema = Versioned.extend({
  mindIds: z.array(z.string()).min(1).max(4),
  approachIds: z.array(z.string()).max(3).default([]),
  selectionMode: z.enum(["founder", "enzo-recommended", "founder-edited"]),
  routerRationale: z.array(z.string()),
});
export type CouncilSelection = z.infer<typeof CouncilSelectionSchema>;

export const ArtifactStyleSelectionSchema = Versioned.extend({
  styleId: z.string(),
  founderOverrides: z.record(z.string(), z.string()).default({}),
});
export type ArtifactStyleSelection = z.infer<typeof ArtifactStyleSelectionSchema>;

export const ApprovalGateSchema = Versioned.extend({
  id: z.string(),
  type: z.enum(["code-change", "migration", "credential", "destructive-action", "deployment"]),
  status: z.enum(["pending", "approved", "denied"]),
  summary: z.string(),
  requestedAt: IsoDate,
  resolvedAt: IsoDate.optional(),
  resolvedBy: z.string().optional(),
});
export type ApprovalGate = z.infer<typeof ApprovalGateSchema>;

export const ExecutionPlanSchema = Versioned.extend({
  objective: z.string(),
  repository: z.string(),
  proposedChanges: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  risks: z.array(z.string()),
  verificationCommands: z.array(z.string()),
  rollbackPlan: z.string(),
});
export type ExecutionPlan = z.infer<typeof ExecutionPlanSchema>;

export const DeploymentRecordSchema = Versioned.extend({
  id: z.string(),
  workroomRunId: z.string(),
  environment: z.string(),
  status: z.enum(["planned", "deployed", "failed", "rolled-back"]),
  url: z.url().optional(),
  revision: z.string(),
  deployedAt: IsoDate.optional(),
  rollbackMetadata: z.string().optional(),
});
export type DeploymentRecord = z.infer<typeof DeploymentRecordSchema>;

export const WorkroomRunSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  companyId: z.string(),
  workroomId: WorkroomKindSchema,
  desiredOutcome: z.string(),
  constraints: z.array(z.string()),
  evidenceClaimIds: z.array(z.string()),
  selection: CouncilSelectionSchema.optional(),
  style: ArtifactStyleSelectionSchema.optional(),
  status: z.enum([
    "framing",
    "evidence-ready",
    "configured",
    "analyzing",
    "awaiting-execution-approval",
    "executing",
    "awaiting-deployment-approval",
    "deployed",
    "complete",
    "failed",
  ]),
  executionPlan: ExecutionPlanSchema.optional(),
  approvalGates: z.array(ApprovalGateSchema).default([]),
  deployment: DeploymentRecordSchema.optional(),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type WorkroomRun = z.infer<typeof WorkroomRunSchema>;

export const SavedPlaybookSchema = Versioned.extend({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  workroomId: WorkroomKindSchema,
  mindIds: z.array(z.string()),
  approachIds: z.array(z.string()),
  styleId: z.string().optional(),
  createdAt: IsoDate,
});
export type SavedPlaybook = z.infer<typeof SavedPlaybookSchema>;

export const StudioSnapshotSchema = z.object({
  founder: FounderProfileSchema,
  company: CompanyModelSchema,
  claims: z.array(EvidenceClaimSchema),
  decision: DecisionSchema,
  lenses: z.array(LensDefinitionSchema),
  council: CouncilRunSchema,
  artifacts: z.array(ArtifactSchema),
  experiment: ExperimentSchema,
  outcome: OutcomeReviewSchema.optional(),
  minds: z.array(MindPackSchema).default([]),
  approaches: z.array(ApproachPackSchema).default([]),
  styles: z.array(StylePackSchema).default([]),
  workrooms: z.array(WorkroomDefinitionSchema).default([]),
  workroomRun: WorkroomRunSchema.optional(),
});
export type StudioSnapshot = z.infer<typeof StudioSnapshotSchema>;
