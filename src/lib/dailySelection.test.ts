import { describe, expect, it } from "vitest";
import { dailySelection } from "./dailySelection";

const books = Array.from({ length: 20 }, (_, i) => ({ slug: String(i), group: String(i % 4) }));
const pick = (items = books, date = new Date(2026, 10, 6, 9), limit = 6) => dailySelection(items, (b) => b.slug, limit, date, (b) => b.group);
describe("daily discovery shelves", () => {
  it("is stable throughout the local day, including after a catalogue reorder", () => {
    expect(pick()).toEqual(pick([...books].reverse(), new Date(2026, 10, 6, 23)));
  });
  it("changes the next day and puts different categories in the first four slots", () => {
    expect(pick()).not.toEqual(pick(books, new Date(2026, 10, 7)));
    expect(new Set(pick().slice(0, 4).map((b) => b.group)).size).toBe(4);
  });
  it("does not mutate, repeat, or reintroduce excluded books", () => {
    const copy = [...books];
    const result = pick([...books.slice(1), books[1]!], undefined, 100);
    expect(new Set(result.map((b) => b.slug)).size).toBe(19);
    expect(result.some((b) => b.slug === "0")).toBe(false);
    expect(books).toEqual(copy);
  });
  it("handles empty and single-item shelves and zero slots", () => {
    expect(pick([])).toEqual([]);
    expect(pick(books.slice(0, 1))).toEqual(books.slice(0, 1));
    expect(pick(books, undefined, 0)).toEqual([]);
  });
});
