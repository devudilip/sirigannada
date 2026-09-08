import { segmentPercents, summarizeStatuses, type OfflineStatusMap } from "./summary";
import type { OfflineCategoryId, OfflineCategoryStatus } from "../types";

const IDS: readonly OfflineCategoryId[] = ["shell", "dictionary", "books", "proverbs"];

function status(id: OfflineCategoryId, bytes: number, cachedCount = 1, totalCount = 2): OfflineCategoryStatus {
  return { id, bytes, cachedCount, totalCount, missingUrls: [], unavailable: false };
}

describe("summarizeStatuses", () => {
  it("sums bytes and file counts across the categories that have reported", () => {
    const statuses: OfflineStatusMap = { shell: status("shell", 100, 3, 3), books: status("books", 50, 1, 4) };
    expect(summarizeStatuses(statuses, IDS)).toEqual({ bytes: 150, cachedCount: 4, totalCount: 7, complete: false });
  });

  it("is complete only once every category has a status", () => {
    const statuses: OfflineStatusMap = Object.fromEntries(IDS.map((id) => [id, status(id, 10)]));
    expect(summarizeStatuses(statuses, IDS).complete).toBe(true);
    expect(summarizeStatuses({}, IDS)).toEqual({ bytes: 0, cachedCount: 0, totalCount: 0, complete: false });
  });
});

describe("segmentPercents", () => {
  it("splits the bar proportionally to bytes in the given order", () => {
    const statuses: OfflineStatusMap = { shell: status("shell", 300), dictionary: status("dictionary", 100) };
    expect(segmentPercents(statuses, IDS)).toEqual([75, 25, 0, 0]);
  });

  it("returns all zeros when nothing is cached", () => {
    expect(segmentPercents({}, IDS)).toEqual([0, 0, 0, 0]);
  });
});
