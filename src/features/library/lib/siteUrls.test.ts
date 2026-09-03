import { describe, expect, it } from "vitest";
import { SITE_URL, siteSitemapEntries } from "./siteUrls";

describe("siteSitemapEntries", () => {
  it("lists the learn index next to the alphabet lesson", () => {
    const urls = siteSitemapEntries().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/learn`);
    expect(urls).toContain(`${SITE_URL}/learn/alphabet`);
    expect(urls).toContain(`${SITE_URL}/proverbs`);
    expect(urls).toContain(`${SITE_URL}/tools`);
  });
});
