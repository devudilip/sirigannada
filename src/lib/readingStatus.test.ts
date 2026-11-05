import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { finishReading, isRead, matchesReadingFilter, readReadingStates, setRead } from "./readingStatus";

describe("reading status", () => {
  beforeEach(() => {
    const data = new Map<string, string>();
    vi.stubGlobal("window", { localStorage: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) }, dispatchEvent: vi.fn() });
  });
  afterEach(() => vi.unstubAllGlobals());
  it("persists completion independently for books and picture books", () => {
    setRead("book:a", true);
    expect(isRead("book:a", readReadingStates())).toBe(true);
    expect(isRead("picturebook:a", readReadingStates())).toBe(false);
  });
  it("lets a reader undo completion even when saved progress is at the end", () => {
    setRead("book:a", false);
    finishReading("book:a");
    expect(isRead("book:a", readReadingStates(), true)).toBe(false);
  });
  it("records automatic completion once so a reread does not lose it", () => {
    finishReading("picturebook:a");
    expect(isRead("picturebook:a", readReadingStates(), false)).toBe(true);
  });
  it("keeps finished books available in All and Finished", () => {
    expect(matchesReadingFilter(true, "unread")).toBe(false);
    expect(matchesReadingFilter(true, "read")).toBe(true);
    expect(matchesReadingFilter(true, "all")).toBe(true);
    expect(matchesReadingFilter(false, "unread")).toBe(true);
  });
  it("rejects invalid persisted status values", () => {
    window.localStorage.setItem("sg:reading:states", JSON.stringify({ a: "read", b: "wrong" }));
    expect(readReadingStates()).toEqual({ a: "read" });
  });
});
