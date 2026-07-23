import type {
  Artifact,
  CompanyModel,
  CouncilRun,
  Decision,
  FounderProfile,
  OutcomeReview,
  StudioSnapshot,
} from "./schemas.js";
import { createFixtureStudio } from "./engine.js";

export interface DecisionRepository {
  upsertFounder(profile: FounderProfile): Promise<FounderProfile>;
  upsertCompany(company: CompanyModel): Promise<CompanyModel>;
  saveDecision(decision: Decision): Promise<Decision>;
  saveCouncil(run: CouncilRun): Promise<CouncilRun>;
  saveArtifact(artifact: Artifact): Promise<Artifact>;
  saveOutcome(outcome: OutcomeReview): Promise<OutcomeReview>;
  getDecision(ownerId: string, decisionId: string): Promise<Decision | null>;
  getCouncilByKey(ownerId: string, idempotencyKey: string): Promise<CouncilRun | null>;
  listDecisions(ownerId: string): Promise<Decision[]>;
  getSnapshot(ownerId: string): Promise<StudioSnapshot>;
}

export class FixtureDecisionRepository implements DecisionRepository {
  private readonly snapshots = new Map<string, StudioSnapshot>();
  private snapshot(ownerId: string) {
    const existing = this.snapshots.get(ownerId);
    if (existing) return existing;
    const created = createFixtureStudio(ownerId);
    this.snapshots.set(ownerId, created);
    return created;
  }
  async upsertFounder(profile: FounderProfile) {
    this.snapshots.set(profile.ownerId, { ...this.snapshot(profile.ownerId), founder: profile });
    return profile;
  }
  async upsertCompany(company: CompanyModel) {
    this.snapshots.set(company.ownerId, { ...this.snapshot(company.ownerId), company });
    return company;
  }
  async saveDecision(decision: Decision) {
    this.snapshots.set(decision.ownerId, { ...this.snapshot(decision.ownerId), decision });
    return decision;
  }
  async saveCouncil(council: CouncilRun) {
    this.snapshots.set(council.ownerId, { ...this.snapshot(council.ownerId), council });
    return council;
  }
  async saveArtifact(artifact: Artifact) {
    const current = this.snapshot(artifact.ownerId);
    const prior = current.artifacts
      .filter((item) => item.decisionId === artifact.decisionId && item.type === artifact.type)
      .sort((a, b) => b.revision - a.revision)[0];
    const revision = prior ? Math.max(artifact.revision, prior.revision + 1) : artifact.revision;
    const saved = { ...artifact, revision };
    this.snapshots.set(artifact.ownerId, {
      ...current,
      artifacts: [...current.artifacts, saved],
    });
    return saved;
  }
  async saveOutcome(outcome: OutcomeReview) {
    const current = this.snapshot(outcome.ownerId);
    this.snapshots.set(outcome.ownerId, {
      ...current,
      outcome,
      decision: { ...current.decision, status: "reviewed" },
    });
    return outcome;
  }
  async getDecision(ownerId: string, decisionId: string) {
    const decision = this.snapshot(ownerId).decision;
    return decision.id === decisionId ? decision : null;
  }
  async getCouncilByKey(ownerId: string, idempotencyKey: string) {
    const council = this.snapshot(ownerId).council;
    return council.idempotencyKey === idempotencyKey ? council : null;
  }
  async listDecisions(ownerId: string) {
    return [this.snapshot(ownerId).decision];
  }
  async getSnapshot(ownerId: string) {
    return this.snapshot(ownerId);
  }
}
