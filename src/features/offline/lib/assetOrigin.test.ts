import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PICTUREBOOK_ASSET_BASE } from "@/lib/assetBase";
import { SERVICE_WORKER_URL } from "@/components/pwa/ServiceWorkerRegistrar";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../..");
const sw = readFileSync(join(root, "public/sw.js"), "utf8");

describe("picture-book asset origin", () => {
  it("is an https origin with no path or trailing slash by default", () => {
    expect(PICTUREBOOK_ASSET_BASE).toMatch(/^https?:\/\/[^/]+$/);
  });

  it("is handed to the service worker in its registration URL", () => {
    expect(SERVICE_WORKER_URL).toBe(`/sw.js?assets=${encodeURIComponent(PICTUREBOOK_ASSET_BASE)}`);
    expect(sw).toMatch(/searchParams\.get\("assets"\)/);
  });

  it("is served cache-first from DATA_CACHE with a CORS request, before the same-origin gate", () => {
    const gate = sw.indexOf("if (url.origin !== self.location.origin) return;");
    const asset = sw.indexOf("if (ASSET_ORIGIN && url.origin === ASSET_ORIGIN)");
    expect(asset).toBeGreaterThan(-1);
    expect(asset).toBeLessThan(gate);
    expect(sw).toMatch(/cacheFirst\(corsRequest\(request\), DATA_CACHE\)/);
    expect(sw).toMatch(/mode: "cors"/);
  });

  it("re-keys books saved under the old same-origin paths on activate instead of dropping them", () => {
    expect(sw).toMatch(/migrateSavedAssets\(\)/);
    expect(sw).toMatch(/\/\^\\\/data\\\/\(picturebooks\\\/\[\^\/\]\+\\\/\[\^\/\]\+\)\$\//);
    expect(sw).not.toMatch(/sg-data-v6/);
  });
});
