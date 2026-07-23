import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  ArtifactSchema,
  CompanyModelSchema,
  CouncilRunSchema,
  DecisionSchema,
  FixtureDecisionRepository,
  FounderProfileSchema,
  OutcomeReviewSchema,
  SavedPlaybookSchema,
  WorkroomRunSchema,
  type Artifact,
  type CompanyModel,
  type CouncilRun,
  type Decision,
  type DecisionRepository,
  type FounderProfile,
  type OutcomeReview,
  type SavedPlaybook,
  type StudioSnapshot,
  type WorkroomRun,
} from "@enzo/decision-core";
import type { AuthPrincipal } from "./auth.js";

export const fixtureDecisionRepository = new FixtureDecisionRepository();

export class SupabaseDecisionRepository implements DecisionRepository {
  private readonly client: SupabaseClient;
  constructor(
    private readonly ownerId: string,
    accessToken: string,
  ) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Authenticated persistence is unavailable.");
    this.client = createClient(url, key, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false },
    });
  }
  private async requireData<T>(
    query: PromiseLike<{ data: T | null; error: { message: string } | null }>,
  ) {
    const { data, error } = await query;
    if (error || data === null) throw new Error(error?.message ?? "Persistence returned no data.");
    return data;
  }
  async upsertFounder(profile: FounderProfile) {
    if (profile.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("founder_profiles")
        .upsert({ user_id: this.ownerId, body: profile }, { onConflict: "user_id" })
        .select()
        .single(),
    );
    return FounderProfileSchema.parse(profile);
  }
  async upsertCompany(company: CompanyModel) {
    if (company.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("company_models")
        .upsert(
          { id: company.id, project_id: company.projectId, user_id: this.ownerId, body: company },
          { onConflict: "project_id" },
        )
        .select()
        .single(),
    );
    return CompanyModelSchema.parse(company);
  }
  async saveDecision(decision: Decision) {
    if (decision.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("decisions")
        .upsert({
          id: decision.id,
          company_id: decision.companyId,
          user_id: this.ownerId,
          question: decision.question,
          status: decision.status,
          reversibility: decision.reversibility,
          options: decision.options,
          assumptions: decision.assumptions,
          success_metric: decision.successMetric,
          deadline: decision.deadline,
          review_date: decision.reviewDate,
          final_option_id: decision.finalOptionId ?? null,
          founder_rationale: decision.founderRationale ?? null,
          decision_snapshot: decision.status === "decided" ? decision : null,
          decided_at: decision.decidedAt ?? null,
        })
        .select()
        .single(),
    );
    return DecisionSchema.parse(decision);
  }
  async saveCouncil(run: CouncilRun) {
    if (run.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("council_runs")
        .insert({
          id: run.id,
          decision_id: run.decisionId,
          user_id: this.ownerId,
          idempotency_key: run.idempotencyKey,
          body: run,
          sealed_at: run.sealedAt,
        })
        .select()
        .single(),
    );
    return CouncilRunSchema.parse(run);
  }
  async saveArtifact(artifact: Artifact) {
    if (artifact.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    const artifactKey = `${artifact.decisionId}:${artifact.type}`;
    const { data: prior, error: priorError } = await this.client
      .from("artifact_revisions")
      .select("revision")
      .eq("artifact_key", artifactKey)
      .order("revision", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (priorError) throw new Error(priorError.message);
    const saved = ArtifactSchema.parse({
      ...artifact,
      revision: prior ? Math.max(artifact.revision, prior.revision + 1) : artifact.revision,
    });
    await this.requireData(
      this.client
        .from("artifact_revisions")
        .insert({
          id: saved.id,
          decision_id: saved.decisionId,
          company_id: saved.companyId,
          user_id: this.ownerId,
          artifact_key: artifactKey,
          artifact_type: saved.type,
          revision: saved.revision,
          title: saved.title,
          body: saved.body,
          citations: saved.citations,
          status: saved.status,
        })
        .select()
        .single(),
    );
    return saved;
  }
  async saveOutcome(outcome: OutcomeReview) {
    if (outcome.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("outcome_reviews")
        .insert({
          id: outcome.id,
          decision_id: outcome.decisionId,
          experiment_id: outcome.experimentId,
          user_id: this.ownerId,
          body: outcome,
          reviewed_at: outcome.reviewedAt,
        })
        .select()
        .single(),
    );
    const { error } = await this.client
      .from("decisions")
      .update({ status: "reviewed" })
      .eq("id", outcome.decisionId);
    if (error) throw new Error(error.message);
    return OutcomeReviewSchema.parse(outcome);
  }
  async getDecision(ownerId: string, decisionId: string) {
    if (ownerId !== this.ownerId) return null;
    const row = await this.requireData<{
      decision_snapshot: unknown;
      question: string;
      status: string;
      reversibility: string;
      options: unknown;
      assumptions: unknown;
      success_metric: string;
      deadline: string;
      review_date: string;
      final_option_id: string | null;
      founder_rationale: string | null;
      decided_at: string | null;
      company_id: string;
      created_at: string;
    }>(this.client.from("decisions").select("*").eq("id", decisionId).single());
    return DecisionSchema.parse(
      row.decision_snapshot ?? {
        schemaVersion: "1.0.0",
        id: decisionId,
        ownerId,
        companyId: row.company_id,
        question: row.question,
        status: row.status,
        reversibility: row.reversibility,
        options: row.options,
        assumptions: row.assumptions,
        successMetric: row.success_metric,
        deadline: row.deadline,
        reviewDate: row.review_date,
        ...(row.final_option_id ? { finalOptionId: row.final_option_id } : {}),
        ...(row.founder_rationale ? { founderRationale: row.founder_rationale } : {}),
        ...(row.decided_at ? { decidedAt: row.decided_at } : {}),
        createdAt: row.created_at,
      },
    );
  }
  async listDecisions(ownerId: string) {
    if (ownerId !== this.ownerId) return [];
    const rows = await this.requireData<Array<{ id: string }>>(
      this.client.from("decisions").select("id").order("created_at", { ascending: false }),
    );
    return (await Promise.all(rows.map((row) => this.getDecision(ownerId, row.id)))).filter(
      (decision): decision is Decision => Boolean(decision),
    );
  }
  async getCouncilByKey(ownerId: string, idempotencyKey: string) {
    if (ownerId !== this.ownerId) return null;
    const { data, error } = await this.client
      .from("council_runs")
      .select("body")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? CouncilRunSchema.parse(data.body) : null;
  }
  async getSnapshot(): Promise<StudioSnapshot> {
    throw new Error("Authenticated snapshots are assembled by route-specific queries.");
  }
  async saveWorkroomRun(run: WorkroomRun) {
    if (run.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("workroom_runs")
        .upsert({
          id: run.id,
          company_id: run.companyId,
          user_id: this.ownerId,
          workroom_id: run.workroomId,
          status: run.status,
          body: run,
        })
        .select()
        .single(),
    );
    return WorkroomRunSchema.parse(run);
  }
  async getWorkroomRun(ownerId: string, runId: string) {
    if (ownerId !== this.ownerId) return null;
    const { data, error } = await this.client
      .from("workroom_runs")
      .select("body")
      .eq("id", runId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? WorkroomRunSchema.parse(data.body) : null;
  }
  async savePlaybook(playbook: SavedPlaybook) {
    if (playbook.ownerId !== this.ownerId) throw new Error("Owner mismatch.");
    await this.requireData(
      this.client
        .from("saved_playbooks")
        .upsert({
          id: playbook.id,
          user_id: this.ownerId,
          name: playbook.name,
          workroom_id: playbook.workroomId,
          body: playbook,
        })
        .select()
        .single(),
    );
    return SavedPlaybookSchema.parse(playbook);
  }
  async listPlaybooks(ownerId: string) {
    if (ownerId !== this.ownerId) return [];
    const rows = await this.requireData<Array<{ body: unknown }>>(
      this.client.from("saved_playbooks").select("body").order("created_at"),
    );
    return rows.map((row) => SavedPlaybookSchema.parse(row.body));
  }
}

export function decisionRepositoryFor(principal: AuthPrincipal): DecisionRepository {
  if (principal.fixture) return fixtureDecisionRepository;
  if (!principal.accessToken)
    throw new Error("Authenticated persistence requires an access token.");
  return new SupabaseDecisionRepository(principal.ownerId, principal.accessToken);
}
