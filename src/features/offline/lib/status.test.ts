import { afterEach, describe, expect, it, vi } from "vitest";
import { DATA_CACHE, SHELL_CACHE } from "@/lib/cacheNames";
import { clearCategoryCache, loadCategoryStatus } from "./status";

function fakeCache(entries: Record<string, number>) {
  const values = new Map(Object.entries(entries));
  return {
    keys: vi.fn(async () => [...values.keys()].map((path) => new Request(`https://sirigannada.in${path}`))),
    match: vi.fn(async (entry: Request | string) => {
      const path = new URL(typeof entry === "string" ? entry : entry.url, "https://sirigannada.in").pathname;
      const size = values.get(path);
      return size === undefined ? undefined : new Response("x", { headers: { "content-length": String(size) } });
    }),
    delete: vi.fn(async (path: string) => values.delete(path)),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("offline cache status", () => {
  it("counts every runtime asset in shell bytes while readiness uses required routes", async () => {
    const shell = fakeCache({ "/": 100, "/dictionary": 200, "/_next/app.js": 700, "/font.woff2": 300 });
    vi.stubGlobal("caches", { open: vi.fn(async () => shell), delete: vi.fn() });

    const status = await loadCategoryStatus("shell", ["/", "/dictionary"]);
    expect(status).toMatchObject({ cachedCount: 2, totalCount: 2, bytes: 1300, unavailable: false });
  });

  it("deletes the entire shell bucket but only selected entries from shared data", async () => {
    const data = fakeCache({ "/data/proverbs.json": 100 });
    const cacheStorage = { open: vi.fn(async () => data), delete: vi.fn(async () => true) };
    vi.stubGlobal("caches", cacheStorage);

    await clearCategoryCache("shell", ["/"]);
    expect(cacheStorage.delete).toHaveBeenCalledWith(SHELL_CACHE);
    expect(cacheStorage.open).not.toHaveBeenCalled();

    await clearCategoryCache("proverbs", ["/data/proverbs.json"]);
    expect(cacheStorage.open).toHaveBeenCalledWith(DATA_CACHE);
    expect(data.delete).toHaveBeenCalledWith("/data/proverbs.json");
  });

  it("reports the Cache API as unavailable when browser storage rejects", async () => {
    vi.stubGlobal("caches", { open: vi.fn(async () => { throw new Error("denied"); }), delete: vi.fn() });
    await expect(loadCategoryStatus("shell", ["/"])).resolves.toMatchObject({ unavailable: true, missingUrls: ["/"] });
  });
});
