import { describe, expect, it } from "vitest";
import { pageIndexFromScroll, scrollForPage } from "./pageIndex";

describe("pageIndexFromScroll", () => {
  it("rounds scrollLeft to the nearest page", () => {
    expect(pageIndexFromScroll(0, 400, 10)).toBe(0);
    expect(pageIndexFromScroll(390, 400, 10)).toBe(1);
    expect(pageIndexFromScroll(410, 400, 10)).toBe(1);
    expect(pageIndexFromScroll(799, 400, 10)).toBe(2);
  });

  it("clamps into range", () => {
    expect(pageIndexFromScroll(-50, 400, 10)).toBe(0);
    expect(pageIndexFromScroll(100000, 400, 10)).toBe(9);
  });

  it("handles degenerate input", () => {
    expect(pageIndexFromScroll(100, 0, 10)).toBe(0);
    expect(pageIndexFromScroll(100, 400, 0)).toBe(0);
  });
});

describe("scrollForPage", () => {
  it("multiplies page by width", () => {
    expect(scrollForPage(3, 400)).toBe(1200);
    expect(scrollForPage(-1, 400)).toBe(0);
  });
});
