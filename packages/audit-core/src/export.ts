import type { AuditRun, Project, VisionBrief } from "./schemas.js";

export function toMarkdown(project: Project, audit: AuditRun, brief?: VisionBrief): string {
  const findings = audit.findings
    .map(
      (finding) =>
        `### ${finding.title}\n\n**Observation:** ${finding.observation}\n\n**Interpretation:** ${finding.interpretation}\n\n**Action:** ${finding.recommendation}`,
    )
    .join("\n\n");
  return `# ${project.name}\n\n> Enzo report\n\n## Audit\n\n${findings}${
    brief
      ? `\n\n## Vision Brief\n\n### North Star\n\n${brief.northStar}\n\n### Positioning\n\n${brief.positioning}\n\n### Next action\n\n${brief.nextAction}`
      : ""
  }\n`;
}
