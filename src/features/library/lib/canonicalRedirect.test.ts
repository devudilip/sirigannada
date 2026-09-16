import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SITE_URL } from "./siteUrls";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

describe("public/_redirects", () => {
  it("301s the apex host to the canonical www host, matching SITE_URL", () => {
    const redirects = readFileSync(join(root, "public/_redirects"), "utf8");
    expect(SITE_URL).toBe("https://www.sirigannada.in");
    expect(redirects).toMatch(/^https:\/\/sirigannada\.in\/\*\s+https:\/\/www\.sirigannada\.in\/:splat\s+301\s*$/m);
  });
});
