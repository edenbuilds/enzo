import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "*.md", "*.mdx", "*.tsx", "*.ts", "*.yaml", "*.yml", "*.json", "*.svg"], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean)
  .filter((file) => existsSync(file))
  .filter((file) => !file.endsWith("pnpm-lock.yaml"));

const failures = files.filter((file) => readFileSync(file, "utf8").includes("\u2014"));
if (failures.length) {
  console.error(`Em dashes are not allowed in Enzo-authored copy:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`Copy check passed across ${files.length} tracked source files.`);
