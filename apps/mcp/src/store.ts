import {
  AnswerSetSchema,
  EvidenceItemSchema,
  ProjectSchema,
  type AnswerSet,
  type AuditRun,
  type EvidenceItem,
  type Project,
  type VisionBrief,
} from "@enzo/audit-core";

export class MemoryStore {
  readonly projects = new Map<string, Project>();
  readonly evidence = new Map<string, EvidenceItem[]>();
  readonly audits = new Map<string, AuditRun>();
  readonly answers = new Map<string, AnswerSet[]>();
  readonly briefs = new Map<string, VisionBrief>();

  putProject(project: Project): Project {
    const parsed = ProjectSchema.parse(project);
    this.projects.set(parsed.id, parsed);
    return parsed;
  }

  addEvidence(item: EvidenceItem): EvidenceItem {
    const parsed = EvidenceItemSchema.parse(item);
    const items = this.evidence.get(parsed.projectId) ?? [];
    this.evidence.set(parsed.projectId, [...items, parsed]);
    const project = this.projects.get(parsed.projectId);
    if (project) {
      this.projects.set(project.id, {
        ...project,
        status: "collecting",
        evidenceRevision: project.evidenceRevision + 1,
        updatedAt: new Date().toISOString(),
      });
    }
    return parsed;
  }

  addAnswers(answerSet: AnswerSet): AnswerSet {
    const parsed = AnswerSetSchema.parse(answerSet);
    const existing = this.answers.get(parsed.projectId) ?? [];
    this.answers.set(parsed.projectId, [
      ...existing.filter((item) => item.roundId !== parsed.roundId),
      parsed,
    ]);
    return parsed;
  }
}

export const store = new MemoryStore();
