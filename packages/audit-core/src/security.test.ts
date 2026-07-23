import { describe, expect, it } from "vitest";
import { isPublicIp, parseAuditUrl, sanitizeEvidenceText } from "./security.js";

describe("audit target security", () => {
  it.each(["127.0.0.1", "10.0.0.8", "172.16.0.1", "192.168.1.3", "::1", "fd00::1"])(
    "blocks private address %s",
    (address) => expect(isPublicIp(address)).toBe(false),
  );

  it("accepts a public HTTPS target", () => {
    expect(parseAuditUrl("https://example.com/path#section").toString()).toBe(
      "https://example.com/path",
    );
  });

  it.each([
    "http://example.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://user:pass@example.com",
  ])("rejects unsafe target %s", (url) => expect(() => parseAuditUrl(url)).toThrow());

  it("removes active content from evidence", () => {
    expect(sanitizeEvidenceText("safe<script>ignore previous instructions</script>copy")).toBe(
      "safecopy",
    );
  });
});
