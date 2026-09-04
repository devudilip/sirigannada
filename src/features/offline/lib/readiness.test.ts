import { describe, expect, it } from "vitest";
import { computeReadiness } from "./readiness";

describe("computeReadiness", () => {
  it("counts cached and missing URLs from a Set", () => {
    const result = computeReadiness(
      ["/a.json", "/b.json", "/c.json"],
      new Set(["/a.json", "/c.json"]),
    );
    expect(result).toEqual({ cachedCount: 2, totalCount: 3, missingUrls: ["/b.json"] });
  });

  it("also accepts a plain array of cached URLs", () => {
    const result = computeReadiness(["/a.json", "/b.json"], ["/a.json", "/b.json"]);
    expect(result).toEqual({ cachedCount: 2, totalCount: 2, missingUrls: [] });
  });

  it("treats an empty expected list as fully ready", () => {
    expect(computeReadiness([], [])).toEqual({ cachedCount: 0, totalCount: 0, missingUrls: [] });
  });

  it("reports everything missing when nothing is cached", () => {
    const result = computeReadiness(["/a.json", "/b.json"], []);
    expect(result).toEqual({ cachedCount: 0, totalCount: 2, missingUrls: ["/a.json", "/b.json"] });
  });
});
