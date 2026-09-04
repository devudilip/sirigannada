import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DATA_CACHE, SHELL_CACHE } from "./cacheNames";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("cache names", () => {
  it("DATA_CACHE matches the name in public/sw.js", () => {
    const sw = readFileSync(join(root, "public/sw.js"), "utf8");
    expect(sw).toMatch(new RegExp(`const DATA_CACHE = "${DATA_CACHE}"`));
  });

  it("SHELL_CACHE matches the name in public/sw.js", () => {
    const sw = readFileSync(join(root, "public/sw.js"), "utf8");
    expect(sw).toMatch(new RegExp(`const SHELL_CACHE = "${SHELL_CACHE}"`));
  });
});
