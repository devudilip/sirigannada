import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SHELL_PRECACHE_ROUTES } from "./shellManifest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

describe("SHELL_PRECACHE_ROUTES", () => {
  it("matches every route listed in public/sw.js's PRECACHE_SHELL", () => {
    const sw = readFileSync(join(root, "public/sw.js"), "utf8");
    const match = sw.match(/const PRECACHE_SHELL = (\[[^\]]*\]);/);
    if (!match) throw new Error("PRECACHE_SHELL not found in public/sw.js");
    const swRoutes = JSON.parse(match[1] ?? "[]") as string[];
    expect([...SHELL_PRECACHE_ROUTES].sort()).toEqual([...swRoutes].sort());
  });
});
