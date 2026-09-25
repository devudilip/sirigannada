import { describe, expect, it } from "vitest";
import { formatCount } from "./heroCounts";

describe("formatCount", () => {
  it("groups Indian style and localises digits", () => {
    expect(formatCount(18, "kn")).toBe("೧೮");
    expect(formatCount(2194, "kn")).toBe("೨,೧೯೪");
    expect(formatCount(2194, "en")).toBe("2,194");
    expect(formatCount(123456, "en")).toBe("1,23,456");
  });
});
