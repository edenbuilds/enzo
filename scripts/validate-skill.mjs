import { readFileSync } from "node:fs";

const path = "plugins/enzo/skills/enzo/SKILL.md";
const text = readFileSync(path, "utf8");
const match = text.match(/^---\n([\s\S]*?)\n---\n/);
if (!match) throw new Error("SKILL.md is missing YAML frontmatter.");
const name = match[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
const description = match[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
if (name !== "enzo") throw new Error("Skill name must be enzo.");
if (!description || description.length > 1024)
  throw new Error("Skill description must be 1–1024 characters.");
if (text.split("\n").length >= 500) throw new Error("SKILL.md must stay below 500 lines.");
if (/\[TODO/i.test(text)) throw new Error("SKILL.md contains a TODO placeholder.");
console.log("Skill validation passed.");
