import { describe, expect, it } from "vitest";
import { pickTeasers } from "./teasers";

describe("pickTeasers", () => {
  it("returns an empty list when there is nothing to show", () => {
    expect(pickTeasers([], 3)).toEqual([]);
    expect(pickTeasers(["a"], 0)).toEqual([]);
  });

  it("returns the whole list when it is shorter than the asked count", () => {
    expect(pickTeasers(["a", "b"], 5)).toEqual(["a", "b"]);
  });

  it("spreads picks across the list", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    expect(pickTeasers(items, 3)).toEqual(["a", "c", "e"]);
  });
});
