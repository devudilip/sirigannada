import { describe, expect, it } from "vitest";
import { bookCacheUrls, putEachUrl, slugFromBookUrl } from "./warmBookCache";

describe("bookCacheUrls", () => {
  it("puts the manifest first, then each book JSON", () => {
    expect(bookCacheUrls(["a", "b"])).toEqual([
      "/data/books/manifest.json",
      "/data/books/a.json",
      "/data/books/b.json",
    ]);
  });
});

describe("slugFromBookUrl", () => {
  it("returns the slug for a book file and null for the manifest", () => {
    expect(slugFromBookUrl("/data/books/basavanna-vachanagalu.json")).toBe("basavanna-vachanagalu");
    expect(slugFromBookUrl("/data/books/manifest.json")).toBeNull();
  });
});

describe("putEachUrl", () => {
  it("continues after a failure and reports the failed URL", async () => {
    const stored: string[] = [];
    const cache = {
      put: async (url: RequestInfo) => {
        stored.push(String(url));
      },
    };
    const load = async (url: string) => {
      if (url.includes("bad")) return new Response("no", { status: 404 });
      return new Response("{}", { status: 200 });
    };
    const ticks: number[] = [];
    const failed = await putEachUrl(cache, ["/ok.json", "/bad.json", "/also.json"], load, (done) => {
      ticks.push(done);
    });
    expect(failed).toEqual(["/bad.json"]);
    expect(stored).toEqual(["/ok.json", "/also.json"]);
    expect(ticks).toEqual([1, 2, 3]);
  });
});
