import { describe, expect, it } from "vitest";
import { readAllHistoryStories, readHistorySeries, readHistoryStories } from "./catalog";

describe("history catalogue", () => {
  it("lists the series from collections.json with Kadamba first", () => {
    const series = readHistorySeries();
    expect(series[0]?.slug).toBe("kadamba");
    for (const s of series) expect(s.years[0]).toBeLessThan(s.years[1]);
  });
  it("tolerates a series with no published story", () => {
    expect(readHistoryStories("no-such-series")).toEqual([]);
    for (const story of readAllHistoryStories()) expect(story.scenes.length).toBeGreaterThan(0);
  });
});
