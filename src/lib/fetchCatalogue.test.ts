import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCatalogue } from "./fetchCatalogue";

afterEach(() => vi.unstubAllGlobals());
describe("updated catalogues", () => {
  it("requests the revision instead of an outdated HTTP or offline-cache copy", async () => {
    const fresh = new Response("new catalogue");
    const fetcher = vi.fn().mockResolvedValue(fresh);
    vi.stubGlobal("fetch", fetcher);
    expect(await fetchCatalogue("/data/books/manifest.json")).toBe(fresh);
    expect(fetcher).toHaveBeenCalledWith("/data/books/manifest.json?v=20261105-ux2");
  });
  it("retains offline access to the previously saved catalogue", async () => {
    const saved = new Response("saved catalogue");
    const fetcher = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(saved);
    vi.stubGlobal("fetch", fetcher);
    expect(await fetchCatalogue("/data/dict/wordgame.json")).toBe(saved);
    expect(fetcher).toHaveBeenLastCalledWith("/data/dict/wordgame.json");
  });
});
