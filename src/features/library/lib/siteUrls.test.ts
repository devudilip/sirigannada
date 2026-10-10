import { describe, expect, it } from "vitest";
import { SITE_URL, siteSitemapEntries } from "./siteUrls";

describe("siteSitemapEntries", () => {
  it("lists the learn index next to the alphabet lesson", () => {
    const urls = siteSitemapEntries().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/learn`);
    expect(urls).toContain(`${SITE_URL}/learn/alphabet`);
    expect(urls).toContain(`${SITE_URL}/proverbs`);
    expect(urls).toContain(`${SITE_URL}/tools`);
    expect(urls).toContain(`${SITE_URL}/tools/text-health`);
    expect(urls).toContain(`${SITE_URL}/apps`);
  });
  it("lists the history box and every series under it", () => {
    const urls = siteSitemapEntries().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/library/chitrakathe`);
    expect(urls).toContain(`${SITE_URL}/library/karnataka-itihasa`);
    expect(urls).toContain(`${SITE_URL}/library/karnataka-itihasa/kadamba`);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
