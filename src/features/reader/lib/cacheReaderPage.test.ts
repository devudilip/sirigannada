import { describe, expect, it, vi } from "vitest";
import { saveReaderDocument } from "./cacheReaderPage";

describe("saveReaderDocument", () => {
  it("stores HTML under the exact reader route used by offline navigation", async () => {
    const put = vi.fn(async () => undefined);
    const response = new Response("<!doctype html><h1>Book</h1>", { headers: { "content-type": "text/html; charset=utf-8" } });
    await saveReaderDocument("a-book", { put }, async () => response);
    expect(put).toHaveBeenCalledWith("/library/a-book", response);
  });

  it("does not overwrite a document with an RSC response or an error page", async () => {
    const put = vi.fn(async () => undefined);
    for (const response of [new Response("RSC", { headers: { "content-type": "text/x-component" } }), new Response("missing", { status: 404, headers: { "content-type": "text/html" } })]) {
      await saveReaderDocument("a-book", { put }, async () => response);
    }
    expect(put).not.toHaveBeenCalled();
  });

  it("keeps offline fetch failures from interrupting the reader", async () => {
    const put = vi.fn(async () => undefined);
    await expect(saveReaderDocument("a-book", { put }, async () => { throw new TypeError("offline"); })).resolves.toBeUndefined();
    expect(put).not.toHaveBeenCalled();
  });
});
