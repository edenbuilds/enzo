import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
  SCHEMA_VERSION,
  assertSafeAuditUrl,
  sanitizeEvidenceText,
  type Capture,
} from "@enzo/audit-core";

const MAX_REDIRECTS = 5;
const MAX_BYTES = 2_000_000;

export async function resolveSafeTarget(input: string): Promise<{ url: URL; html: string }> {
  let current = await assertSafeAuditUrl(input);
  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "Enzo/0.1 (+https://github.com/edenbuilds/enzo)" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirect response omitted a location.");
      current = await assertSafeAuditUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new Error(`Target returned HTTP ${response.status}.`);
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BYTES)
      throw new Error("Target response exceeds the capture size limit.");
    const html = await response.text();
    if (Buffer.byteLength(html) > MAX_BYTES)
      throw new Error("Target response exceeds the capture size limit.");
    return { url: current, html: sanitizeEvidenceText(html) };
  }
  throw new Error("Target exceeded the redirect limit.");
}

async function createBrowser() {
  const playwright = (await import("playwright")) as unknown as {
    chromium?: {
      launch: (options: { headless: boolean }) => Promise<import("playwright").Browser>;
    };
    default?: {
      chromium?: {
        launch: (options: { headless: boolean }) => Promise<import("playwright").Browser>;
      };
    };
  };
  const chromium = playwright.chromium ?? playwright.default?.chromium;
  if (!chromium) throw new Error("Playwright Chromium is unavailable.");
  return chromium.launch({ headless: true });
}

export async function captureUrl(input: string, evidenceId: string): Promise<Capture[]> {
  const { url, html } = await resolveSafeTarget(input);
  if (process.env.CAPTURE_ENABLED !== "true") {
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || url.hostname;
    return [
      {
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        evidenceId,
        viewport: { width: 1440, height: 900 },
        title,
        headings: [...html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gis)]
          .slice(0, 20)
          .map((match) => sanitizeEvidenceText(match[1]?.replace(/<[^>]+>/g, "") ?? "").trim())
          .filter(Boolean),
        links: [],
        forms: (html.match(/<form\b/gi) ?? []).length,
        capturedAt: new Date().toISOString(),
      },
    ];
  }

  const outputDirectory = process.env.CAPTURE_OUTPUT_DIR ?? ".captures";
  await mkdir(outputDirectory, { recursive: true });
  const browser = await createBrowser();
  try {
    const viewports = [
      { width: 1440, height: 900, name: "desktop" },
      { width: 390, height: 844, name: "mobile" },
    ] as const;
    const captures: Capture[] = [];
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.route("**/*", async (route) => {
        const requestUrl = route.request().url();
        if (!requestUrl.startsWith("https://")) return route.abort("blockedbyclient");
        try {
          await assertSafeAuditUrl(requestUrl);
          await route.continue();
        } catch {
          await route.abort("blockedbyclient");
        }
      });
      await page.goto(url.toString(), { waitUntil: "domcontentloaded", timeout: 20_000 });
      const screenshotPath = join(outputDirectory, `${evidenceId}-${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const data = await page.evaluate(() => ({
        title: document.title,
        description:
          document.querySelector('meta[name="description"]')?.getAttribute("content") ?? undefined,
        headings: [...document.querySelectorAll("h1,h2,h3")]
          .slice(0, 30)
          .map((node) => node.textContent?.trim() ?? "")
          .filter(Boolean),
        links: [...document.querySelectorAll("a[href]")].slice(0, 50).map((node) => ({
          label: node.textContent?.trim() ?? "",
          href: (node as HTMLAnchorElement).href,
        })),
        forms: document.forms.length,
      }));
      captures.push({
        schemaVersion: SCHEMA_VERSION,
        id: randomUUID(),
        evidenceId,
        viewport: { width: viewport.width, height: viewport.height },
        title: data.title,
        ...(data.description ? { description: data.description } : {}),
        headings: data.headings,
        links: data.links,
        forms: data.forms,
        screenshotPath,
        capturedAt: new Date().toISOString(),
      });
      await context.close();
    }
    return captures;
  } finally {
    await browser.close();
  }
}
