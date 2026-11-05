import { describe, expect, it } from "vitest";
import { HOME_TOOLS, TOOLS } from "./catalog";

describe("tool catalog", () => {
  it("keeps utilities distinct from learning and reading destinations", () => {
    expect(TOOLS.some((tool) => tool.href === "/proverbs")).toBe(false);
    expect(HOME_TOOLS.some((tool) => tool.href === "/proverbs")).toBe(false);
    expect(HOME_TOOLS.map((tool) => tool.href)).toEqual([
      "/tools/transliterate",
      "/tools/numbers",
      "/tools/convert",
      "/tools/text-health",
    ]);
  });
});
