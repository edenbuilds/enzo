import { createHash, randomUUID } from "node:crypto";
import { SCHEMA_VERSION, type Citation } from "@enzo/audit-core";
import {
  ArtifactSchema,
  CouncilRunSchema,
  DecisionSchema,
  OutcomeReviewSchema,
  StudioSnapshotSchema,
  type Artifact,
  type CouncilRun,
  type Decision,
  type LensDefinition,
  type OutcomeReview,
  type StudioSnapshot,
} from "./schemas.js";

export const LENS_DISCLOSURE =
  "A methodological perspective derived from public material. It is not the person, an endorsement, or an official representation.";

export const PRODUCTION_LENSES: LensDefinition[] = [
  {
    schemaVersion: SCHEMA_VERSION,
    id: "jobs-product-focus",
    displayName: "Jobs product-focus lens",
    type: "person-lens",
    competence: ["product focus", "experience coherence", "removal"],
    exclusions: ["finance", "current market facts", "technical feasibility"],
    disclosure: LENS_DISCLOSURE,
    provenance: [
      "https://www.apple.com/leadership/steve-jobs/",
      "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says",
    ],
    blindSpots: ["Can overvalue end-to-end control", "Does not substitute for customer evidence"],
    knowledgeCutoff: "2011-10-05",
    evaluationStatus: "production",
  },
  {
    schemaVersion: SCHEMA_VERSION,
    id: "munger-inversion",
    displayName: "Munger inversion lens",
    type: "person-lens",
    competence: ["inversion", "incentives", "avoidable failure"],
    exclusions: ["visual direction", "current market facts", "implementation detail"],
    disclosure: LENS_DISCLOSURE,
    provenance: ["https://www.berkshirehathaway.com/letters/letters.html"],
    blindSpots: ["Can overweight downside", "Framework transfer is speculative"],
    knowledgeCutoff: "2023-11-28",
    evaluationStatus: "production",
  },
  {
    schemaVersion: SCHEMA_VERSION,
    id: "customer-operator",
    displayName: "Customer and operator playbook",
    type: "domain-playbook",
    competence: ["customer comprehension", "conversion", "operational testability"],
    exclusions: ["celebrity attribution", "legal advice", "financial prediction"],
    disclosure:
      "An Enzo-owned domain playbook synthesized from product research and operating practice.",
    provenance: ["https://github.com/edenbuilds/enzo"],
    blindSpots: ["May favor measurable clarity over expressive novelty"],
    knowledgeCutoff: "2026-07-23",
    evaluationStatus: "production",
  },
];

const now = "2026-07-23T18:00:00.000Z";
const citation = (id: string, label: string, excerpt: string): Citation => ({
  schemaVersion: SCHEMA_VERSION,
  id,
  evidenceId: "evidence-home",
  label,
  url: "https://tryenzo.vercel.app",
  excerpt,
  capturedAt: now,
});

export function councilIdempotencyKey(decision: Decision, evidenceRevision: number) {
  return createHash("sha256")
    .update(
      `${decision.ownerId}:${decision.id}:${evidenceRevision}:${PRODUCTION_LENSES.map((lens) => lens.id).join(",")}`,
    )
    .digest("hex");
}

export function createFixtureStudio(ownerId = "demo-founder"): StudioSnapshot {
  const decision = DecisionSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    id: "decision-promise",
    ownerId,
    companyId: "company-enzo",
    question: "What should this product promise first?",
    deadline: "2026-08-01T00:00:00.000Z",
    reversibility: "reversible",
    options: [
      {
        schemaVersion: SCHEMA_VERSION,
        id: "option-audit",
        label: "Experience audit",
        description: "Lead with rigorous product and website diagnosis.",
        tradeoffs: ["Immediately credible", "Too narrow for the long-term company-building thesis"],
      },
      {
        schemaVersion: SCHEMA_VERSION,
        id: "option-judgment",
        label: "Founder decision studio",
        description: "Lead with evidence-backed judgment for consequential founder decisions.",
        tradeoffs: [
          "Ownable mechanism",
          "Requires the product to prove persistence and decision outcomes",
        ],
      },
      {
        schemaVersion: SCHEMA_VERSION,
        id: "option-cofounder",
        label: "AI cofounder",
        description: "Lead with broad assistance across company functions.",
        tradeoffs: ["Familiar category", "Crowded and weakly differentiated"],
      },
    ],
    assumptions: [
      "Founders will value inspectable disagreement over a single confident answer",
      "The current audit is sufficient evidence for the first decision",
      "A Decision Ledger can create repeat value",
    ],
    status: "awaiting-founder",
    successMetric:
      "At least 40% of qualified founders complete a Decision Room and save its artifact",
    reviewDate: "2026-09-01T00:00:00.000Z",
    createdAt: now,
  });
  const claims = [
    {
      schemaVersion: SCHEMA_VERSION,
      id: "claim-live",
      companyId: "company-enzo",
      statement:
        "The current product already turns observable experience evidence into a Vision Brief.",
      classification: "verified" as const,
      sourceLabel: "Live Enzo product",
      freshness: "current" as const,
      confidence: 0.98,
      citations: [
        citation(
          "citation-live",
          "Live product",
          "Audit, interview, and Vision Brief routes are deployed.",
        ),
      ],
    },
    {
      schemaVersion: SCHEMA_VERSION,
      id: "claim-market",
      companyId: "company-enzo",
      statement:
        "AI cofounder positioning already includes specialist routing and artifact generation.",
      classification: "researched" as const,
      sourceLabel: "Current competitor review",
      freshness: "current" as const,
      confidence: 0.91,
      citations: [
        {
          ...citation(
            "citation-market",
            "CoFounder.ai",
            "AI cofounder, specialist team, and artifact surfaces are existing claims.",
          ),
          url: "https://cofounder.ai",
        },
      ],
    },
    {
      schemaVersion: SCHEMA_VERSION,
      id: "claim-ledger",
      companyId: "company-enzo",
      statement: "Outcome-linked decisions will improve retention and recommendation quality.",
      classification: "hypothetical" as const,
      sourceLabel: "Product hypothesis",
      freshness: "unknown" as const,
      confidence: 0.54,
      citations: [],
    },
  ];
  const runId = "council-promise-v1";
  const analyses = [
    {
      schemaVersion: SCHEMA_VERSION,
      id: "analysis-jobs",
      councilRunId: runId,
      lensId: "jobs-product-focus",
      diagnosis:
        "The product must lead with the singular transformation it uniquely controls: turning evidence into a founder decision.",
      evidenceClaimIds: ["claim-live", "claim-market"],
      assumptionsChallenged: ["Breadth makes the product feel more valuable"],
      preserve: ["Evidence discipline", "Editorial authority"],
      remove: ["Generic AI cofounder language"],
      opportunity: "Make the Decision Room the unmistakable core experience.",
      risk: "A broad homepage can obscure the one thing Enzo does better.",
      nextAction: "Lead with the founder decision studio and demonstrate one complete decision.",
      confidence: 0.84,
      visiblePeerAnalysisIds: [],
    },
    {
      schemaVersion: SCHEMA_VERSION,
      id: "analysis-munger",
      councilRunId: runId,
      lensId: "munger-inversion",
      diagnosis:
        "Avoid the failure mode where Enzo sounds differentiated but stores no decision history and cannot learn from outcomes.",
      evidenceClaimIds: ["claim-ledger", "claim-market"],
      assumptionsChallenged: ["A compelling council is enough to earn recurring use"],
      preserve: ["Founder control", "Explicit uncertainty"],
      remove: ["Unverified moat claims"],
      opportunity: "Make review dates and outcome calibration part of every decision.",
      risk: "Named lenses become theater if disagreement and results are not recorded.",
      nextAction: "Ship the Ledger alongside the Decision Room, not later.",
      confidence: 0.79,
      visiblePeerAnalysisIds: [],
    },
    {
      schemaVersion: SCHEMA_VERSION,
      id: "analysis-operator",
      councilRunId: runId,
      lensId: "customer-operator",
      diagnosis:
        "A founder should understand the input, decision, artifact, and next action before encountering the lens library.",
      evidenceClaimIds: ["claim-live", "claim-market"],
      assumptionsChallenged: ["Named minds should be the primary acquisition surface"],
      preserve: ["Audit as the first workroom", "Clear next action"],
      remove: ["Celebrity-card navigation"],
      opportunity: "Convert existing audit users into a saved Decision Memo and 30-day plan.",
      risk: "Too much setup before the first useful result will suppress completion.",
      nextAction: "Use a realistic public fixture and gate private company memory behind sign-in.",
      confidence: 0.88,
      visiblePeerAnalysisIds: [],
    },
  ];
  const council = CouncilRunSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    id: runId,
    ownerId,
    decisionId: decision.id,
    idempotencyKey: councilIdempotencyKey(decision, 3),
    selectedLensIds: PRODUCTION_LENSES.map((lens) => lens.id),
    routerRationale: [
      "Product promise is a focus decision",
      "The downside of generic positioning requires inversion",
      "The first release must remain understandable and operationally testable",
    ],
    analyses,
    agreements: [
      "Do not lead with generic AI cofounder language",
      "Preserve evidence and founder control",
      "The Decision Room must produce a persistent artifact",
    ],
    disagreements: [
      {
        issue: "How prominently should named lenses appear?",
        positions: [
          "Product-focus lens: keep them behind the core promise",
          "Customer/operator playbook: reveal selection rationale inside the workflow",
        ],
        evidenceNeeded:
          "Compare completion and trust with competence-first versus named-lens entry points.",
      },
    ],
    synthesis:
      "Position Enzo as the founder decision studio. Demonstrate the mechanism through one evidence-backed decision, make dissent visible, and save the outcome for review.",
    dissent:
      "The product-focus lens would hide named lenses almost entirely; the operator playbook supports restrained visibility because selection rationale can build trust.",
    confidence: 0.83,
    evidenceGaps: [
      "No observed retention data for the Decision Ledger",
      "No completed founder interviews on category language",
    ],
    recommendedOptionId: "option-judgment",
    createdAt: now,
    sealedAt: now,
  });
  const artifacts = generateArtifacts(decision, council, ownerId);
  return StudioSnapshotSchema.parse({
    founder: {
      schemaVersion: SCHEMA_VERSION,
      id: "founder-demo",
      ownerId,
      displayName: "Independent founder",
      experience: ["Product design", "Early-stage software"],
      strengths: ["Taste", "Fast prototyping"],
      constraints: ["Small team", "Limited research time"],
      objectives: ["Build a credible founder decision studio"],
      resources: { timePerWeek: 30, capital: "Bootstrapped beta", team: "Founder plus agents" },
      riskTolerance: "moderate",
      workingStyle: "Evidence first, then decisive execution",
      autonomyPreferences: ["Founder approves consequential decisions"],
      ethicalBoundaries: ["No impersonation", "No hidden persuasion"],
      updatedAt: now,
    },
    company: {
      schemaVersion: SCHEMA_VERSION,
      id: "company-enzo",
      ownerId,
      projectId: "project-demo",
      name: "Enzo",
      stage: "early",
      customer: "Founders and product designers making consequential product decisions",
      problem:
        "Advice is abundant, but evidence, disagreement, decisions, and outcomes are disconnected",
      product: "Founder decision studio",
      businessModel: "Private beta; pricing uncommitted pending usage research",
      distribution: ["Codex plugin", "Public web workspace"],
      brand: "Measured, warm, editorial authority",
      technology: ["Next.js", "MCP", "Supabase", "OpenAI Responses API"],
      metrics: { primary: "Completed decisions with outcome reviews" },
      risks: [
        "Derivative AI cofounder positioning",
        "Lens attribution risk",
        "Low persistence without hosted storage",
      ],
      openQuestions: [
        "Which promise earns the first session?",
        "Which artifacts create repeat use?",
      ],
      currentFocus: "Prove one complete evidence-to-decision loop",
      updatedAt: now,
    },
    claims,
    decision,
    lenses: PRODUCTION_LENSES,
    council,
    artifacts,
    experiment: {
      schemaVersion: SCHEMA_VERSION,
      id: "experiment-promise",
      ownerId,
      decisionId: decision.id,
      hypothesis:
        "Founder decision studio positioning produces more completed decision artifacts than experience-audit positioning.",
      metric: "Decision Room completion rate",
      expectedOutcome: "At least 40% completion among qualified beta visitors",
      status: "planned",
      reviewDate: decision.reviewDate,
    },
  });
}

export function generateArtifacts(
  decision: Decision,
  council: CouncilRun,
  ownerId: string,
): Artifact[] {
  const timestamp = council.sealedAt;
  const memo = `# Decision memo\n\n## Decision\n${decision.question}\n\n## Recommendation\n${council.synthesis}\n\n## Dissent\n${council.dissent}\n\n## Evidence gaps\n${council.evidenceGaps.map((gap) => `- ${gap}`).join("\n")}\n\n## Success metric\n${decision.successMetric}\n\n## Review date\n${decision.reviewDate.slice(0, 10)}`;
  const plan = `# 30-day action plan\n\n1. Put the founder decision studio promise on the first screen.\n2. Route qualified visitors into the product-promise Decision Room.\n3. Capture the founder choice and rationale.\n4. Export the Decision Memo and 30-day plan.\n5. Review completion, dissent, and outcome signals on ${decision.reviewDate.slice(0, 10)}.`;
  return [
    ArtifactSchema.parse({
      schemaVersion: SCHEMA_VERSION,
      id: "artifact-memo",
      ownerId,
      companyId: decision.companyId,
      decisionId: decision.id,
      type: "decision-memo",
      title: "Product promise decision memo",
      body: memo,
      citations: [],
      revision: 1,
      status: "draft",
      exportFormats: ["markdown", "json", "pdf"],
      createdAt: timestamp,
      updatedAt: timestamp,
    }),
    ArtifactSchema.parse({
      schemaVersion: SCHEMA_VERSION,
      id: "artifact-plan",
      ownerId,
      companyId: decision.companyId,
      decisionId: decision.id,
      type: "thirty-day-plan",
      title: "30-day positioning plan",
      body: plan,
      citations: [],
      revision: 1,
      status: "draft",
      exportFormats: ["markdown", "json", "pdf"],
      createdAt: timestamp,
      updatedAt: timestamp,
    }),
  ];
}

export function recordFounderDecision(
  decision: Decision,
  optionId: string,
  rationale: string,
  decidedAt = new Date().toISOString(),
) {
  if (decision.status !== "awaiting-founder")
    throw new Error("The council must be sealed before the founder decision is recorded.");
  if (!decision.options.some((option) => option.id === optionId))
    throw new Error("Unknown decision option.");
  return DecisionSchema.parse({
    ...decision,
    status: "decided",
    finalOptionId: optionId,
    founderRationale: rationale,
    decidedAt,
  });
}

const NEXT_STATUS: Partial<Record<Decision["status"], Decision["status"]>> = {
  framing: "researching",
  researching: "council-ready",
  "council-ready": "awaiting-founder",
  "awaiting-founder": "decided",
  decided: "reviewed",
};

export function advanceDecision(decision: Decision, status: Decision["status"]) {
  if (decision.status === status) return decision;
  if (NEXT_STATUS[decision.status] !== status)
    throw new Error(`Invalid decision transition: ${decision.status} → ${status}.`);
  return DecisionSchema.parse({ ...decision, status });
}

export function reviewDecision(
  decision: Decision,
  observedOutcome: string,
  lesson: string,
  calibration: OutcomeReview["confidenceCalibration"],
  experimentId = "experiment-promise",
) {
  if (decision.status !== "decided")
    throw new Error("Record the founder decision before reviewing its outcome.");
  return OutcomeReviewSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    id: randomUUID(),
    ownerId: decision.ownerId,
    decisionId: decision.id,
    experimentId,
    observedOutcome,
    lesson,
    confidenceCalibration: calibration,
    reviewedAt: new Date().toISOString(),
  });
}
