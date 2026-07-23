import { createHash, randomUUID } from "node:crypto";
import type {
  AnswerSet,
  AuditRun,
  EvidenceItem,
  Project,
  QuestionRound,
  VisionBrief,
} from "./schemas.js";
import { SCHEMA_VERSION } from "./schemas.js";

export function buildIdempotencyKey(
  projectId: string,
  evidenceRevision: number,
  config: Record<string, unknown> = {},
): string {
  return createHash("sha256")
    .update(JSON.stringify({ projectId, evidenceRevision, config }))
    .digest("hex");
}

export function createProject(input: {
  ownerId: string;
  name: string;
  targetUrl?: string;
}): Project {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    id: randomUUID(),
    ownerId: input.ownerId,
    name: input.name,
    ...(input.targetUrl ? { targetUrl: input.targetUrl } : {}),
    status: "draft",
    evidenceRevision: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDemoAudit(project: Project, evidence: EvidenceItem[]): AuditRun {
  const now = new Date().toISOString();
  const primary = evidence[0];
  const citation = primary
    ? {
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        evidenceId: primary.id,
        label: primary.title,
        ...(primary.sourceUrl ? { url: primary.sourceUrl } : {}),
        ...(primary.content ? { excerpt: primary.content.slice(0, 240) } : {}),
        capturedAt: primary.createdAt,
      }
    : undefined;

  return {
    schemaVersion: SCHEMA_VERSION,
    id: randomUUID(),
    projectId: project.id,
    idempotencyKey: buildIdempotencyKey(project.id, project.evidenceRevision),
    status: "completed",
    findings: [
      {
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        category: "positioning",
        title: "The promise arrives after the interface asks for trust",
        observation:
          "Primary messaging describes capabilities before naming a specific audience outcome.",
        interpretation:
          "Visitors must translate features into value before they can judge relevance.",
        recommendation:
          "Lead with one audience, one expensive problem, and one measurable outcome.",
        severity: "high",
        confidence: citation ? 0.88 : 0.55,
        citations: citation ? [citation] : [],
        inference: !citation,
      },
      {
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        category: "conversion",
        title: "Proof and action are separated",
        observation:
          "The primary action is not reinforced directly after the strongest proof block.",
        interpretation: "Intent decays between belief and commitment.",
        recommendation: "Pair each decisive proof moment with the next appropriate commitment.",
        severity: "medium",
        confidence: citation ? 0.81 : 0.52,
        citations: citation ? [citation] : [],
        inference: !citation,
      },
    ],
    scorecard: {
      schemaVersion: SCHEMA_VERSION,
      dimensions: { clarity: 6, positioning: 5, trust: 7, conversion: 5, accessibility: 7 },
      coverage: evidence.length > 0 ? 0.72 : 0.2,
    },
    opportunities: [
      {
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        horizon: "quick-win",
        title: "Rewrite the first-screen promise",
        impact: "high",
        effort: "low",
        action: "Name the audience, outcome, and distinctive mechanism above the fold.",
      },
      {
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        horizon: "strategic",
        title: "Build an evidence-led narrative",
        impact: "high",
        effort: "medium",
        action: "Reorder the experience from claim to proof to action.",
      },
    ],
    coverageGaps: evidence.length
      ? []
      : [
          {
            schemaVersion: SCHEMA_VERSION,
            area: "experience evidence",
            reason: "No URL, screenshot, document, repository, or codebase fact was available.",
            requestedEvidence: "Provide one primary URL or representative screenshot.",
          },
        ],
    createdAt: now,
    completedAt: now,
  };
}

const rounds: Omit<QuestionRound, "projectId">[] = [
  {
    schemaVersion: SCHEMA_VERSION,
    id: "round-purpose",
    round: 1,
    focus: "Purpose and success",
    questions: [
      {
        schemaVersion: SCHEMA_VERSION,
        id: "primary-objective",
        prompt: "What must this experience achieve first?",
        type: "single",
        options: [
          {
            value: "qualified-demand",
            label: "Create qualified demand",
            description: "Turn attention into credible sales conversations.",
          },
          {
            value: "product-clarity",
            label: "Explain the product",
            description: "Make the value and workflow immediately legible.",
          },
          {
            value: "trust",
            label: "Earn institutional trust",
            description: "Reduce perceived risk for a serious buyer.",
          },
        ],
      },
      {
        schemaVersion: SCHEMA_VERSION,
        id: "success-signal",
        prompt: "Which signal would prove the direction is working?",
        type: "multi",
        maxSelections: 2,
        options: [
          {
            value: "conversion",
            label: "Higher conversion",
            description: "More visitors take the primary action.",
          },
          {
            value: "comprehension",
            label: "Faster comprehension",
            description: "People can explain the offer accurately.",
          },
          {
            value: "quality",
            label: "Better-fit demand",
            description: "Leads arrive with stronger intent and fit.",
          },
        ],
      },
    ],
  },
  {
    schemaVersion: SCHEMA_VERSION,
    id: "round-positioning",
    round: 2,
    focus: "Audience and positioning",
    questions: [
      {
        schemaVersion: SCHEMA_VERSION,
        id: "competitive-posture",
        prompt: "Which posture should the experience own?",
        type: "single",
        options: [
          {
            value: "premium-specialist",
            label: "Premium specialist",
            description: "Narrow authority with a high-trust premium.",
          },
          {
            value: "category-challenger",
            label: "Category challenger",
            description: "Reject familiar category assumptions.",
          },
          {
            value: "quiet-utility",
            label: "Quietly superior utility",
            description: "Let precision and ease carry the argument.",
          },
        ],
      },
    ],
  },
];

export function getQuestionRound(projectId: string, answers: AnswerSet[]): QuestionRound | null {
  const next = rounds.find((round) => !answers.some((answer) => answer.roundId === round.id));
  return next ? { ...next, projectId } : null;
}

export function detectContradictions(answers: AnswerSet[]): string[] {
  const values = new Set(answers.flatMap((set) => Object.values(set.answers)).flat());
  const contradictions: string[] = [];
  if (values.has("premium-specialist") && values.has("lowest-price")) {
    contradictions.push("Premium specialist positioning conflicts with lowest-price acquisition.");
  }
  if (values.has("fast-mvp") && values.has("custom-interactions")) {
    contradictions.push("A fast MVP conflicts with extensive custom interaction work.");
  }
  return contradictions;
}

export function generateVisionBrief(project: Project, answers: AnswerSet[]): VisionBrief {
  const values = answers.flatMap((set) => Object.values(set.answers)).flat();
  const posture = values.includes("category-challenger")
    ? "A category challenger that replaces vague opinion with inspectable evidence."
    : "A premium diagnostic partner that turns fragmented evidence into a defensible direction.";
  return {
    schemaVersion: SCHEMA_VERSION,
    projectId: project.id,
    northStar: `Make ${project.name} immediately legible, credible, and decisive.`,
    audience: ["Founders", "Product designers", "Teams approaching a redesign or launch"],
    positioning: posture,
    narrative: [
      "Name the costly ambiguity",
      "Show the evidence",
      "Reveal the opportunity",
      "Make the next move explicit",
    ],
    visualDirection: [
      "Editorial authority",
      "Warm institutional restraint",
      "Evidence before decoration",
    ],
    informationArchitecture: ["Promise", "Proof", "Method", "Cases", "Engagement", "Action"],
    productPriorities: ["Evidence ledger", "Adaptive interview", "Vision Brief export"],
    successMetrics: [
      "Message comprehension",
      "Qualified conversion",
      "Time to stakeholder alignment",
    ],
    risks: detectContradictions(answers),
    nextAction: "Prototype the revised first-screen promise and test it with five target users.",
    generatedAt: new Date().toISOString(),
  };
}
