import { describe, expect, it } from "vitest";
import { sourceHost, spaceTicks, tickFractions } from "./readerFooter";

describe("tickFractions", () => {
  it("maps chapter views onto 0..1 and skips the first view", () => {
    expect(tickFractions([0, 5, 10], 21)).toEqual([0.25, 0.5]);
  });

  it("dedupes chapters that start on the same view and clamps out-of-range views", () => {
    expect(tickFractions([3, 3, 99], 11)).toEqual([0.3, 1]);
  });

  it("returns nothing for a single-view book", () => {
    expect(tickFractions([0, 1], 1)).toEqual([]);
  });
});

describe("spaceTicks", () => {
  it("drops markers closer than the gap to the previous kept one or to the start", () => {
    expect(spaceTicks([0.01, 0.2, 0.21, 0.25, 0.5, 1], 0.04)).toEqual([0.2, 0.25, 0.5, 1]);
  });

  it("keeps well-spaced markers, in order", () => {
    expect(spaceTicks([0.5, 0.25], 0.04)).toEqual([0.25, 0.5]);
  });
});

describe("sourceHost", () => {
  it("extracts the host of a source URL", () => {
    expect(sourceHost("https://kn.wikisource.org/wiki/ವಚನ")).toBe("kn.wikisource.org");
  });

  it("returns an empty string for a non-URL source", () => {
    expect(sourceHost("Alar dictionary")).toBe("");
  });
});
