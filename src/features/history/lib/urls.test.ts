import { describe, expect, it } from "vitest";
import { HISTORY_URL, historyImageDir, historySeriesUrl, historyStoryUrl, isHistoryListing } from "./urls";

describe("history URLs", () => {
  it("nests series and stories under the library box", () => {
    expect(HISTORY_URL).toBe("/library/karnataka-itihasa");
    expect(historySeriesUrl("kadamba")).toBe("/library/karnataka-itihasa/kadamba");
    expect(historyStoryUrl({ series: "badami-chalukya", slug: "immadi-pulikeshi" })).toBe("/library/karnataka-itihasa/badami-chalukya/immadi-pulikeshi");
    expect(historyImageDir({ series: "kadamba", slug: "mayurasharma" })).toBe("/history/kadamba/mayurasharma/");
  });
  it("keeps the shell on the index and series pages but not on a story", () => {
    expect(isHistoryListing("/library/karnataka-itihasa")).toBe(true);
    expect(isHistoryListing("/library/karnataka-itihasa/")).toBe(true);
    expect(isHistoryListing("/library/karnataka-itihasa/kadamba.html")).toBe(true);
    expect(isHistoryListing("/library/karnataka-itihasa/kadamba/mayurasharma")).toBe(false);
    expect(isHistoryListing("/library/chitrakathe")).toBe(false);
    expect(isHistoryListing("/library/some-book")).toBe(false);
  });
});
