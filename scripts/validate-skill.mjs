import { readdirSync, readFileSync } from "node:fs";

const roots = ["plugins/enzo/skills", "brains"];
const errors = [];

for (const root of roots) {
  for (const entry of readdirSync(root, { withFileTypes: true }).filter((item) =>
    item.isDirectory(),
  )) {
    const path = `${root}/${entry.name}/SKILL.md`;
    const text = readFileSync(path, "utf8");
    const match = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) {
      errors.push(`${path}: missing YAML frontmatter`);
      continue;
    }
    const name = match[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = match[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (name !== entry.name) errors.push(`${path}: name must match directory`);
    if (!description || description.length > 1024)
      errors.push(`${path}: description must be 1–1024 characters`);
    if (text.split("\n").length >= 500) errors.push(`${path}: must stay below 500 lines`);
    if (/\[TODO/i.test(text)) errors.push(`${path}: contains a TODO placeholder`);
  }
}

if (errors.length) throw new Error(errors.join("\n"));
console.log("All plugin skills and lens packs passed repository validation.");
