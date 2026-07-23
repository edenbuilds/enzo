import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTS = new Set(["localhost", "localhost.localdomain"]);

function isPrivateIpv4(address: string): boolean {
  const [a = 0, b = 0] = address.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string): boolean {
  const normalized = address.toLowerCase();
  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  );
}

export function isPublicIp(address: string): boolean {
  const version = isIP(address);
  if (version === 4) return !isPrivateIpv4(address);
  if (version === 6) return !isPrivateIpv6(address);
  return false;
}

export function parseAuditUrl(input: string): URL {
  const url = new URL(input);
  if (url.protocol !== "https:") throw new Error("Only HTTPS targets are allowed.");
  if (url.username || url.password) throw new Error("Credentials in URLs are not allowed.");
  if (BLOCKED_HOSTS.has(url.hostname.toLowerCase()))
    throw new Error("Local targets are not allowed.");
  if (isIP(url.hostname) && !isPublicIp(url.hostname))
    throw new Error("Private network targets are not allowed.");
  url.hash = "";
  return url;
}

export async function assertSafeAuditUrl(input: string): Promise<URL> {
  const url = parseAuditUrl(input);
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicIp(address))) {
    throw new Error("Target resolves to a private or unavailable network address.");
  }
  return url;
}

export function sanitizeEvidenceText(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\0/g, "")
    .slice(0, 100_000);
}
