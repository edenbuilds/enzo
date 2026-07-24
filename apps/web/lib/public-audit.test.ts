import { describe, expect, it } from "vitest";
import { auditPublicUrl, diagnosePublicEvidence, extractPublicEvidence } from "./public-audit";

describe("public audit", () => {
  it("extracts visible positioning and action evidence", () => {
    const evidence = extractPublicEvidence(`
      <html><head><title>Acme</title><meta name="description" content="Ship better widgets"></head>
      <body><nav><a href="/pricing">Pricing</a><a href="/about">About</a></nav>
      <h1>Ship the right widget</h1><h2>Trusted by 200 teams</h2><a href="/start">Start free</a><form></form></body></html>
    `);
    expect(evidence.title).toBe("Acme");
    expect(evidence.h1).toEqual(["Ship the right widget"]);
    expect(evidence.actions).toContain("Start free");
    expect(evidence.navigation).toEqual(["Pricing", "About"]);
    expect(evidence.proof).toContain("Trusted by 200 teams");
    expect(evidence.forms).toBe(1);
  });

  it("turns observed overload into a specific recommendation", () => {
    const observed = extractPublicEvidence(`
      <html><head><title>Acme</title></head><body>
      <h1>Build faster</h1><h1>Grow smarter</h1>
      <a>Start free</a><a>Book demo</a><a>Try now</a><a>Get access</a><a>Contact sales</a>
      </body></html>
    `);
    const diagnosis = diagnosePublicEvidence(observed, "acme.test", "Improve conversion");
    expect(diagnosis.verdict).toContain("Build faster");
    expect(diagnosis.findings.some((finding) => finding.title.includes("primary message"))).toBe(true);
    expect(diagnosis.findings.some((finding) => finding.title.includes("next steps"))).toBe(true);
  });

  it("rejects private network targets before fetching", async () => {
    await expect(auditPublicUrl("https://127.0.0.1", "Inspect this")).rejects.toThrow(
      "Private network targets are not allowed",
    );
  });
});
