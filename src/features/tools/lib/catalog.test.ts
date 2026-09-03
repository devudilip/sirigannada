import { describe, expect, it } from "vitest";
import { HOME_TOOLS, TOOLS } from "./catalog";

describe("tool catalog", () => {
  it("keeps proverbs on the tools hub but not on the home strip", () => {
    expect(TOOLS.some((tool) => tool.href === "/proverbs")).toBe(true);
    expect(HOME_TOOLS.some((tool) => tool.href === "/proverbs")).toBe(false);
    expect(HOME_TOOLS.map((tool) => tool.href)).toEqual([
      "/tools/transliterate",
      "/tools/numbers",
      "/tools/convert",
      "/tools/text-health",
      "/learn/alphabet",
    ]);
  });
});
