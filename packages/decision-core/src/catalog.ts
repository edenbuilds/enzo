import { SCHEMA_VERSION } from "@enzo/audit-core";
import {
  ApproachPackSchema,
  MindPackSchema,
  StylePackSchema,
  WorkroomDefinitionSchema,
  type ApproachPack,
  type MindPack,
  type StylePack,
  type WorkroomDefinition,
  type WorkroomKindSchema,
} from "./schemas.js";
import type { z } from "zod";

export const MIND_DISCLOSURE =
  "A methodological perspective derived from public material. It is not the person, an endorsement, or an official representation.";

type WorkroomId = z.infer<typeof WorkroomKindSchema>;

const person = (
  input: Omit<MindPack, "schemaVersion" | "kind" | "version" | "disclosure">,
) =>
  MindPackSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    kind: "mind",
    version: "1.0.0",
    disclosure: MIND_DISCLOSURE,
    ...input,
  });

export const MIND_PACKS: MindPack[] = [
  person({
    id: "steve-jobs",
    displayName: "Steve Jobs",
    summary: "Relentless product focus, coherent experience, and a story people can repeat.",
    domains: ["product", "positioning", "design"],
    competence: ["simplification", "product narrative", "experience coherence"],
    exclusions: ["current market facts", "finance", "technical feasibility"],
    blindSpots: ["Can overvalue control", "Does not replace customer evidence"],
    compatibleWorkrooms: ["product-strategy", "design-brand", "decision-room"],
    typicalQuestions: ["What can we remove?", "What is the one promise people should remember?"],
    exampleOutput: "A single product promise and a ruthless removal list.",
    provenance: [
      "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says",
      "https://www.apple.com/stevejobs/",
    ],
    knowledgeCutoff: "2011-10-05",
    evaluationStatus: "production",
    methodology: ["focus", "end-to-end coherence", "demonstrable narrative"],
  }),
  person({
    id: "alex-hormozi",
    displayName: "Alex Hormozi",
    summary: "Offer strength, perceived value, pricing, and measurable customer acquisition.",
    domains: ["offers", "sales", "marketing"],
    competence: ["offer construction", "pricing", "acquisition economics"],
    exclusions: ["legal advice", "brand authorship", "unverified revenue promises"],
    blindSpots: ["Can overfit direct response", "May undervalue slow trust formation"],
    compatibleWorkrooms: ["marketing-growth", "sales-offers", "product-strategy"],
    typicalQuestions: ["Why is this worth acting on now?", "What makes the offer easier to say yes to?"],
    exampleOutput: "A clearer offer with proof, price logic, and a testable guarantee.",
    provenance: ["https://www.acquisition.com/training/offers"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["value equation", "offer stack", "measurable acquisition"],
  }),
  person({
    id: "charlie-munger",
    displayName: "Charlie Munger",
    summary: "Inversion, incentives, and avoidable failure before upside stories.",
    domains: ["strategy", "risk", "operations"],
    competence: ["inversion", "incentives", "failure analysis"],
    exclusions: ["visual direction", "implementation detail", "current market facts"],
    blindSpots: ["Can overweight downside", "Framework transfer is interpretive"],
    compatibleWorkrooms: ["product-strategy", "sales-offers", "decision-room"],
    typicalQuestions: ["How does this fail?", "Which incentive creates the wrong behavior?"],
    exampleOutput: "A pre-mortem with the incentives most likely to break the plan.",
    provenance: ["https://www.berkshirehathaway.com/letters/letters.html"],
    knowledgeCutoff: "2023-11-28",
    evaluationStatus: "production",
    methodology: ["inversion", "incentive analysis", "latticework"],
  }),
  person({
    id: "paul-graham",
    displayName: "Paul Graham",
    summary: "Early startup learning, founder judgment, and making something people want.",
    domains: ["startups", "product", "founder"],
    competence: ["early product learning", "founder behavior", "startup focus"],
    exclusions: ["enterprise sales execution", "legal advice", "current market sizing"],
    blindSpots: ["Startup-specific priors", "Essay transfer requires current evidence"],
    compatibleWorkrooms: ["product-strategy", "marketing-growth", "decision-room"],
    typicalQuestions: ["What do a small number of users urgently want?", "What can the founder learn manually?"],
    exampleOutput: "A narrow early-user wedge and a founder-led learning loop.",
    provenance: ["https://www.paulgraham.com/articles.html"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["make something people want", "do things that do not scale", "founder learning"],
  }),
  person({
    id: "naval-ravikant",
    displayName: "Naval Ravikant",
    summary: "Leverage, specific knowledge, ownership, and long-term games.",
    domains: ["strategy", "business model", "founder"],
    competence: ["leverage", "specific knowledge", "long-term direction"],
    exclusions: ["operating detail", "financial advice", "current market research"],
    blindSpots: ["High abstraction", "May underweight organizational constraints"],
    compatibleWorkrooms: ["product-strategy", "marketing-growth", "decision-room"],
    typicalQuestions: ["Where does this compound?", "What can this company uniquely know or own?"],
    exampleOutput: "A leverage map and a long-term positioning choice.",
    provenance: ["https://nav.al/"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["permissionless leverage", "specific knowledge", "long-term games"],
  }),
  person({
    id: "nassim-taleb",
    displayName: "Nassim Taleb",
    summary: "Fragility, optionality, asymmetric exposure, and respect for uncertainty.",
    domains: ["risk", "strategy", "experimentation"],
    competence: ["fragility analysis", "optionality", "asymmetric risk"],
    exclusions: ["precise forecasting", "visual design", "implementation detail"],
    blindSpots: ["Can reject useful forecasts too broadly", "Style can obscure operational advice"],
    compatibleWorkrooms: ["product-strategy", "forward-deployed-engineering", "decision-room"],
    typicalQuestions: ["What breaks under volatility?", "Can we cap downside and preserve upside?"],
    exampleOutput: "A barbell experiment with capped loss and retained upside.",
    provenance: ["https://www.fooledbyrandomness.com/"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["antifragility", "optionality", "skin in the game"],
  }),
  person({
    id: "andrej-karpathy",
    displayName: "Andrej Karpathy",
    summary: "Practical AI systems, model behavior, evaluation, and product engineering.",
    domains: ["AI", "engineering", "product"],
    competence: ["AI product systems", "evaluation", "engineering judgment"],
    exclusions: ["security certification", "business guarantees", "non-AI domain authority"],
    blindSpots: ["Fast-moving knowledge", "Public material may not cover production constraints"],
    compatibleWorkrooms: ["forward-deployed-engineering", "product-strategy"],
    typicalQuestions: ["Where should the model end and deterministic software begin?", "How will this be evaluated?"],
    exampleOutput: "An AI system boundary, evaluation set, and failure-handling plan.",
    provenance: ["https://karpathy.ai/"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["system decomposition", "evaluation-first AI", "human oversight"],
  }),
  person({
    id: "richard-feynman",
    displayName: "Richard Feynman",
    summary: "First principles, clear explanation, and exposing false understanding.",
    domains: ["explanation", "learning", "technical reasoning"],
    competence: ["first principles", "knowledge gaps", "clear explanation"],
    exclusions: ["modern market facts", "commercial strategy", "product taste"],
    blindSpots: ["Pedagogical transfer is interpretive", "Does not provide domain evidence"],
    compatibleWorkrooms: ["product-strategy", "forward-deployed-engineering", "decision-room"],
    typicalQuestions: ["Can we explain this without jargon?", "What do we only think we understand?"],
    exampleOutput: "A plain-language model with the unknowns made explicit.",
    provenance: ["https://calteches.library.caltech.edu/40/2/CargoCult.htm"],
    knowledgeCutoff: "1988-02-15",
    evaluationStatus: "research",
    methodology: ["first principles", "explanation test", "scientific integrity"],
  }),
  person({
    id: "mrbeast",
    displayName: "MrBeast",
    summary: "Attention, packaging, retention, and disciplined content iteration.",
    domains: ["content", "marketing", "audience"],
    competence: ["attention packaging", "retention", "content iteration"],
    exclusions: ["general product strategy", "financial advice", "brand safety guarantees"],
    blindSpots: ["Media-specific priors", "Can overvalue spectacle"],
    compatibleWorkrooms: ["marketing-growth", "design-brand"],
    typicalQuestions: ["Why would someone stop and care?", "Where does attention fall away?"],
    exampleOutput: "Three packaging concepts with retention hypotheses.",
    provenance: ["https://www.youtube.com/@MrBeast"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["packaging", "retention analysis", "high-volume iteration"],
  }),
  person({
    id: "rob-pike",
    displayName: "Rob Pike",
    summary: "Simple interfaces, composable systems, and maintainable engineering.",
    domains: ["engineering", "systems", "developer experience"],
    competence: ["interface simplicity", "maintainability", "systems design"],
    exclusions: ["product-market fit", "visual design", "current vendor selection"],
    blindSpots: ["Simplicity can hide migration cost", "Language-design priors may not transfer"],
    compatibleWorkrooms: ["forward-deployed-engineering", "product-strategy"],
    typicalQuestions: ["Can the interface be smaller?", "Which abstraction will still make sense in two years?"],
    exampleOutput: "A reduced interface and migration-safe implementation boundary.",
    provenance: ["https://go.dev/talks/2012/splash.article"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "research",
    methodology: ["composability", "small interfaces", "clear concurrency"],
  }),
];

const approach = (
  id: string,
  displayName: string,
  summary: string,
  workrooms: WorkroomId[],
  principles: string[],
) =>
  ApproachPackSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    id,
    version: "1.0.0",
    kind: "approach",
    displayName,
    summary,
    domains: workrooms,
    competence: principles,
    exclusions: ["Claims without evidence", "Guaranteed outcomes"],
    blindSpots: ["Requires adaptation to company context"],
    compatibleWorkrooms: workrooms,
    typicalQuestions: [`When should ${displayName.toLowerCase()} govern this work?`],
    exampleOutput: `${displayName} plan with evidence, tests, and next actions.`,
    provenance: ["https://github.com/edenbuilds/enzo"],
    knowledgeCutoff: "2026-07-24",
    evaluationStatus: "production",
    disclosure: "An Enzo-owned operating approach synthesized from reviewed practice.",
    principles,
  });

export const APPROACH_PACKS: ApproachPack[] = [
  approach("direct-response", "Direct response", "Make value, proof, and action measurable.", ["marketing-growth", "sales-offers"], ["specific offer", "proof", "measurable action"]),
  approach("category-creation", "Category creation", "Define a problem and a new frame for solving it.", ["marketing-growth", "product-strategy"], ["problem framing", "contrast", "category language"]),
  approach("founder-led-narrative", "Founder-led narrative", "Turn earned founder insight into a credible story.", ["marketing-growth", "design-brand"], ["specific experience", "earned authority", "consistent voice"]),
  approach("proof-led-conversion", "Proof-led conversion", "Move evidence ahead of persuasion.", ["marketing-growth", "sales-offers"], ["proof hierarchy", "objection handling", "low-friction action"]),
  approach("enterprise-trust", "Enterprise trust", "Reduce perceived risk for high-consideration buyers.", ["sales-offers", "design-brand"], ["security evidence", "stakeholder clarity", "procurement readiness"]),
  approach("consultative-sales", "Consultative sales", "Diagnose before prescribing and preserve buyer agency.", ["sales-offers"], ["discovery", "qualification", "mutual plan"]),
  approach("product-led-growth", "Product-led growth", "Let product value create acquisition and expansion loops.", ["marketing-growth", "product-strategy"], ["activation", "habit", "expansion"]),
  approach("account-based-outreach", "Account-based outreach", "Coordinate evidence around a narrow account set.", ["sales-offers", "marketing-growth"], ["account research", "relevance", "multi-threading"]),
];

const style = (
  id: string,
  displayName: string,
  summary: string,
  accent: string,
  principles: string[],
) =>
  StylePackSchema.parse({
    schemaVersion: SCHEMA_VERSION,
    id,
    version: "1.0.0",
    kind: "style",
    displayName,
    summary,
    tokens: { canvas: "#ffffeb", ink: "#1a1a1a", accent },
    typography: principles,
    layoutPrinciples: ["clear hierarchy", "responsive composition", "purposeful whitespace"],
    imageryDirection: ["licensed or original", "specific to the product context"],
    motionBoundaries: ["motion must explain state", "respect reduced motion"],
    accessibilityRequirements: ["WCAG AA contrast", "visible focus", "semantic hierarchy"],
    prohibitedPatterns: ["decorative gradients", "fake metrics", "generic AI imagery"],
    exampleComponents: ["hero", "evidence card", "decision artifact"],
    exportFormats: ["web", "markdown", "pdf", "slides"],
  });

export const STYLE_PACKS: StylePack[] = [
  style("broadsheet-editorial", "Broadsheet Editorial", "Cream paper, dark chambers, and high-contrast editorial type.", "#f0d7ff", ["editorial serif", "plainspoken sans"]),
  style("swiss-precision", "Swiss Precision", "Grid discipline, neutral type, and functional hierarchy.", "#e63b2e", ["neo-grotesk", "modular scale"]),
  style("warm-humanist", "Warm Humanist", "Tactile restraint, approachable type, and generous rhythm.", "#d97757", ["humanist serif", "soft grotesk"]),
  style("technical-utility", "Technical Utility", "Dense clarity for technical products and operational tools.", "#55d6be", ["technical sans", "functional mono"]),
  style("luxury-minimal", "Luxury Minimal", "Quiet confidence, precise typography, and controlled detail.", "#b99a5b", ["high-contrast serif", "minimal sans"]),
  style("constructive-brutalism", "Constructive Brutalism", "Visible structure, hard edges, and direct interaction.", "#ff5c35", ["heavy grotesk", "utility mono"]),
  style("playful-consumer", "Playful Consumer", "Friendly geometry, expressive color, and immediate feedback.", "#7b61ff", ["rounded sans", "expressive display"]),
  style("cinematic-product", "Cinematic Product", "Dramatic sequencing with product proof at the center.", "#7dd3fc", ["display sans", "quiet body"]),
];

const workroom = (input: Omit<WorkroomDefinition, "schemaVersion">) =>
  WorkroomDefinitionSchema.parse({ schemaVersion: SCHEMA_VERSION, ...input });

export const WORKROOMS: WorkroomDefinition[] = [
  workroom({ id: "product-strategy", displayName: "Product and Strategy", summary: "Choose the product promise, wedge, and next bet.", evidenceRequirements: ["company context", "customer evidence", "current product"], compatibleMindIds: ["steve-jobs", "paul-graham", "charlie-munger", "naval-ravikant"], compatibleApproachIds: ["category-creation", "product-led-growth"], supportsStyles: true, artifactTypes: ["decision-memo", "thirty-day-plan"], completionCriteria: ["founder choice", "success metric", "review date"], executionMode: "artifact" }),
  workroom({ id: "design-brand", displayName: "Design and Brand", summary: "Turn a product direction into a coherent visual and verbal system.", evidenceRequirements: ["brand context", "product surfaces", "visual references"], compatibleMindIds: ["steve-jobs", "mrbeast"], compatibleApproachIds: ["founder-led-narrative", "enterprise-trust"], supportsStyles: true, artifactTypes: ["design-direction"], completionCriteria: ["selected direction", "tokens", "prototype brief"], executionMode: "artifact" }),
  workroom({ id: "marketing-growth", displayName: "Marketing and Growth", summary: "Find a believable story, channel, and measurable growth loop.", evidenceRequirements: ["audience", "offer", "channel evidence"], compatibleMindIds: ["alex-hormozi", "mrbeast", "paul-graham", "naval-ravikant"], compatibleApproachIds: ["direct-response", "category-creation", "founder-led-narrative", "proof-led-conversion", "product-led-growth", "account-based-outreach"], supportsStyles: true, artifactTypes: ["campaign-brief", "thirty-day-plan"], completionCriteria: ["message", "channel", "experiment"], executionMode: "artifact" }),
  workroom({ id: "sales-offers", displayName: "Sales and Offers", summary: "Shape the offer, proof, and buyer path.", evidenceRequirements: ["buyer", "pain", "proof", "economics"], compatibleMindIds: ["alex-hormozi", "charlie-munger"], compatibleApproachIds: ["direct-response", "proof-led-conversion", "enterprise-trust", "consultative-sales", "account-based-outreach"], supportsStyles: false, artifactTypes: ["sales-playbook"], completionCriteria: ["offer", "objections", "next action"], executionMode: "artifact" }),
  workroom({ id: "forward-deployed-engineering", displayName: "Forward Deployed Engineering", summary: "Connect a founder decision to a tested, deployable technical outcome.", evidenceRequirements: ["repository", "environment", "architecture", "deployment target"], compatibleMindIds: ["andrej-karpathy", "rob-pike", "richard-feynman", "nassim-taleb", "steve-jobs"], compatibleApproachIds: [], supportsStyles: true, artifactTypes: ["technical-design", "implementation-plan"], completionCriteria: ["approved scope", "passing checks", "deployment record", "rollback path"], executionMode: "executable" }),
  workroom({ id: "experience-audit", displayName: "Experience Audit", summary: "Inspect what users can see and turn evidence into priorities.", evidenceRequirements: ["URL or capture", "product context"], compatibleMindIds: ["steve-jobs", "richard-feynman"], compatibleApproachIds: ["proof-led-conversion", "enterprise-trust"], supportsStyles: true, artifactTypes: ["decision-memo"], completionCriteria: ["evidence-linked findings", "priority action"], executionMode: "artifact" }),
  workroom({ id: "decision-room", displayName: "Decision Room", summary: "Compare independent perspectives and preserve the founder’s choice.", evidenceRequirements: ["decision", "options", "evidence claims"], compatibleMindIds: MIND_PACKS.map((mind) => mind.id), compatibleApproachIds: APPROACH_PACKS.map((item) => item.id), supportsStyles: false, artifactTypes: ["decision-memo"], completionCriteria: ["dissent", "founder choice", "review date"], executionMode: "advisory" }),
  workroom({ id: "decision-ledger", displayName: "Decision Ledger", summary: "Review what was expected, what happened, and what changed.", evidenceRequirements: ["decision snapshot", "observed outcome"], compatibleMindIds: ["charlie-munger", "nassim-taleb"], compatibleApproachIds: [], supportsStyles: false, artifactTypes: ["decision-memo"], completionCriteria: ["outcome", "lesson", "confidence calibration"], executionMode: "advisory" }),
];

export function getMind(id: string) {
  return MIND_PACKS.find((mind) => mind.id === id);
}

export function getWorkroom(id: string) {
  return WORKROOMS.find((workroom) => workroom.id === id);
}

