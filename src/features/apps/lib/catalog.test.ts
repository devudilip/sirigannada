import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/features/library/lib/siteUrls";
import { SIBLING_APPS } from "./catalog";

describe("SIBLING_APPS", () => {
  it("links to https subdomains of sirigannada.in, never to this site", () => {
    for (const app of SIBLING_APPS) {
      const url = new URL(app.href);
      expect(url.protocol).toBe("https:");
      expect(url.hostname.endsWith(".sirigannada.in")).toBe(true);
      expect(url.origin).not.toBe(SITE_URL);
      expect(url.hostname).not.toBe("sirigannada.in");
    }
  });

  it("has unique ids", () => {
    const ids = SIBLING_APPS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
