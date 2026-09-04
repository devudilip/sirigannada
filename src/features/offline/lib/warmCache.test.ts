import { describe, expect, it } from "vitest";
import { putEachUrl } from "./warmCache";

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

  it("reports a thrown fetch as a failure too", async () => {
    const cache = { put: async () => undefined };
    const load = async () => {
      throw new Error("network down");
    };
    const failed = await putEachUrl(cache, ["/x.json"], load, () => undefined);
    expect(failed).toEqual(["/x.json"]);
  });
});
