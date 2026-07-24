import { assertSafeAuditUrl, sanitizeEvidenceText } from "@enzo/audit-core";

const MAX_BYTES = 1_000_000;
const MAX_REDIRECTS = 4;

export type PublicFinding = {
  severity: "critical" | "important" | "watch";
  title: string;
  observation: string;
  whyItMatters: string;
  move: string;
};

export type PublicAuditResult = {
  url: string;
  capturedAt: string;
  observed: {
    title: string;
    description: string;
    h1: string[];
    headings: string[];
    actions: string[];
    navigation: string[];
    proof: string[];
    forms: number;
    wordCount: number;
  };
  verdict: string;
  nextMove: string;
  findings: PublicFinding[];
};

function decode(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, value: string) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#(\d+);/g, (_, value: string) => String.fromCodePoint(Number.parseInt(value, 10)))
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(html: string, pattern: RegExp, limit: number): string[] {
  return [...html.matchAll(pattern)]
    .slice(0, limit)
    .map((match) => decode(match[1] ?? ""))
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function extractPublicEvidence(htmlInput: string) {
  const html = sanitizeEvidenceText(htmlInput);
  const withoutNoise = html
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ");
  const title = decode(withoutNoise.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = decode(
    withoutNoise.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1]
      ?? withoutNoise.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i)?.[1]
      ?? "",
  );
  const h1 = unique(matches(withoutNoise, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, 8));
  const headings = unique(matches(withoutNoise, /<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi, 30));
  const allControls = unique([
    ...matches(withoutNoise, /<button\b[^>]*>([\s\S]*?)<\/button>/gi, 30),
    ...matches(withoutNoise, /<a\b[^>]*>([\s\S]*?)<\/a>/gi, 80),
  ]).filter((label) => label.length >= 2 && label.length <= 80);
  const actionPattern = /\b(get|start|try|book|buy|join|contact|request|sign|see|open|create|launch|download|subscribe|apply|talk)\b/i;
  const actions = allControls.filter((label) => actionPattern.test(label)).slice(0, 12);
  const navHtml = withoutNoise.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)?.join(" ") ?? "";
  const navigation = unique(matches(navHtml, /<a\b[^>]*>([\s\S]*?)<\/a>/gi, 30)).filter(
    (label) => label.length >= 2 && label.length <= 60,
  );
  const visibleText = decode(
    withoutNoise
      .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " "),
  );
  const paragraphs = unique(matches(withoutNoise, /<p\b[^>]*>([\s\S]*?)<\/p>/gi, 80));
  const proofPattern = /\b(case study|testimonial|trusted by|customer (?:story|result)|customers (?:say|report)|increased by|reduced by|saved \d)\b|\b\d+(?:[,.]\d+)*(?:\s+)?(?:%|x|users|teams|founders|companies|customers)\b/i;
  const proof = unique([...headings, ...paragraphs]).filter((item) => proofPattern.test(item)).slice(0, 6);

  return {
    title,
    description,
    h1,
    headings,
    actions,
    navigation,
    proof,
    forms: (withoutNoise.match(/<form\b/gi) ?? []).length,
    wordCount: visibleText ? visibleText.split(/\s+/).length : 0,
  };
}

export function diagnosePublicEvidence(
  observed: ReturnType<typeof extractPublicEvidence>,
  hostname: string,
  problem: string,
): Pick<PublicAuditResult, "verdict" | "nextMove" | "findings"> {
  const findings: PublicFinding[] = [];
  const lead = observed.h1[0] ?? observed.title;

  if (observed.h1.length === 0) {
    findings.push({
      severity: "critical",
      title: "The page has no observable primary promise",
      observation: "No H1 was found in the delivered HTML.",
      whyItMatters: "Visitors and assistive technology do not get one explicit statement of what this page is for.",
      move: "Add one H1 that names the customer outcome, not the product category.",
    });
  } else if (observed.h1.length > 1) {
    findings.push({
      severity: "important",
      title: "The page declares more than one primary message",
      observation: `${observed.h1.length} H1 elements were found: ${observed.h1.slice(0, 3).map((item) => `“${item}”`).join(", ")}.`,
      whyItMatters: "Multiple primary headings weaken the reading order and make the intended promise ambiguous.",
      move: `Keep “${observed.h1[0]}” as the sole H1 and demote the others.`,
    });
  }

  if (!observed.description) {
    findings.push({
      severity: "important",
      title: "The search and share promise is missing",
      observation: "No meta description was found in the delivered HTML.",
      whyItMatters: "Search results and shared links have less context before a visitor arrives.",
      move: "Write a specific meta description with the audience, outcome, and proof in one sentence.",
    });
  }

  if (observed.proof.length === 0) {
    findings.push({
      severity: "important",
      title: "The page makes claims without an observable proof signal",
      observation: "No customer result, case study, testimonial, adoption signal, or quantified outcome was detected in headings or body copy.",
      whyItMatters: "A clear promise can earn attention. Proof is what turns that attention into belief.",
      move: "Place one specific customer result or product demonstration directly after the opening promise.",
    });
  }

  if (observed.actions.length === 0) {
    findings.push({
      severity: "critical",
      title: "Interest has no visible next step",
      observation: "No action-oriented link or button label was detected.",
      whyItMatters: "A visitor can understand the page and still have no obvious way to continue.",
      move: "Add one primary action that describes the value received after the click.",
    });
  } else if (observed.actions.length > 4) {
    findings.push({
      severity: "important",
      title: "The page asks for too many different next steps",
      observation: `${observed.actions.length} action labels were detected, including ${observed.actions.slice(0, 5).map((item) => `“${item}”`).join(", ")}.`,
      whyItMatters: "Competing actions force a visitor to understand the site before choosing a path.",
      move: `Choose one primary action. Start by deciding whether “${observed.actions[0]}” is the action that best proves the promise.`,
    });
  }

  if (observed.navigation.length > 7) {
    findings.push({
      severity: "watch",
      title: "Navigation is carrying product complexity",
      observation: `${observed.navigation.length} navigation labels were found: ${observed.navigation.slice(0, 8).join(", ")}.`,
      whyItMatters: "A long top-level menu makes the visitor classify themselves before seeing enough value.",
      move: "Keep the top-level navigation focused on the main job, proof, and entry action. Move the rest behind context.",
    });
  }

  if (observed.wordCount > 1100) {
    findings.push({
      severity: "watch",
      title: "The page makes the visitor work for the point",
      observation: `Approximately ${observed.wordCount} visible words were detected.`,
      whyItMatters: "Length is only useful when each section advances belief. Long pages often repeat claims instead of adding proof.",
      move: "Remove every section that does not add a new claim, proof point, objection answer, or action.",
    });
  }

  if (findings.length === 0) {
    findings.push({
      severity: "watch",
      title: "The structure is sound, so the next risk is credibility",
      observation: `The page has one H1, ${observed.actions.length} visible action${observed.actions.length === 1 ? "" : "s"}, and ${observed.navigation.length} navigation item${observed.navigation.length === 1 ? "" : "s"}.`,
      whyItMatters: "Clean structure does not prove that the promise is differentiated or believable.",
      move: "Place the strongest customer result or product proof directly after the opening promise.",
    });
  }

  const contextValue = problem.trim().slice(0, 180).replace(/[.!?]+$/, "");
  const context = contextValue ? ` You asked Enzo to focus on: ${contextValue}.` : "";
  const cleanLead = lead.replace(/[.!?]+$/, "");
  const verdict = lead
    ? `${hostname} leads with “${cleanLead}.” The most consequential issue found is ${findings[0]!.title.toLowerCase()}.${context}`
    : `${hostname} does not expose a clear opening promise in its delivered HTML. ${findings[0]!.title}.${context}`;

  return { verdict, nextMove: findings[0]!.move, findings: findings.slice(0, 4) };
}

export async function auditPublicUrl(urlInput: string, problem: string): Promise<PublicAuditResult> {
  let current = await assertSafeAuditUrl(urlInput);
  let html = "";
  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
      headers: { "user-agent": "Enzo-Public-Audit/0.1 (+https://tryenzo.vercel.app)" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The page redirected without a destination.");
      current = await assertSafeAuditUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new Error(`The page returned HTTP ${response.status}.`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) throw new Error("The URL did not return an HTML page.");
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BYTES) throw new Error("The page is too large for the public audit.");
    html = await response.text();
    if (Buffer.byteLength(html) > MAX_BYTES) throw new Error("The page is too large for the public audit.");
    break;
  }
  if (!html) throw new Error("The page exceeded the redirect limit.");
  const observed = extractPublicEvidence(html);
  const diagnosis = diagnosePublicEvidence(observed, current.hostname, problem);
  return {
    url: current.toString(),
    capturedAt: new Date().toISOString(),
    observed,
    ...diagnosis,
  };
}
