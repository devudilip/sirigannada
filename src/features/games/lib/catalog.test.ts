import { describe, expect, it } from "vitest";
import { GAMES } from "./catalog";
import { SHELL_PRECACHE_ROUTES } from "@/features/offline/lib/shellManifest";

describe("GAMES", () => {
  it("lists every game under /games", () => {
    expect(GAMES.map((g) => g.href)).toEqual(["/games/word", "/games/padabandha", "/games/gade"]);
  });
  it("every game route is pre-cached for offline play", () => {
    for (const g of GAMES) expect(SHELL_PRECACHE_ROUTES).toContain(g.href);
  });
});
