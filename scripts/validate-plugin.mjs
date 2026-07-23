import { existsSync, readFileSync } from "node:fs";

const root = "plugins/enzo";
const manifest = JSON.parse(readFileSync(`${root}/.codex-plugin/plugin.json`, "utf8"));
if (manifest.name !== "enzo") throw new Error("Plugin name must be enzo.");
if (!/^\d+\.\d+\.\d+/.test(manifest.version)) throw new Error("Plugin version must be semver.");
for (const field of ["description", "skills", "mcpServers", "interface"]) {
  if (!manifest[field]) throw new Error(`Plugin is missing ${field}.`);
}
for (const path of [
  manifest.skills,
  manifest.mcpServers,
  manifest.interface.logo,
  manifest.interface.composerIcon,
]) {
  if (!existsSync(`${root}/${path.replace(/^\.\//, "")}`))
    throw new Error(`Plugin asset not found: ${path}`);
}
if (/\[TODO/i.test(JSON.stringify(manifest)))
  throw new Error("Plugin contains a TODO placeholder.");
console.log("Plugin validation passed.");
