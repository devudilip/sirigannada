import { describe, expect, it } from "vitest";
import {
  buildBundleReport,
  extractManifestIconPaths,
  extractStaticAssetUrls,
  parsePrecacheShell,
  routeToOutPath,
} from "./bundle";

describe("parsePrecacheShell", () => {
  it("reads the route list out of the sw.js source", () => {
    const sw = `
      const SHELL_CACHE = "sg-shell-v12";
      const PRECACHE_SHELL = ["/", "/dictionary", "/manifest.webmanifest", "/favicon.svg"];
      const PRECACHE_DATA = ["/data/books/manifest.json"];
    `;
    expect(parsePrecacheShell(sw)).toEqual(["/", "/dictionary", "/manifest.webmanifest", "/favicon.svg"]);
  });

  it("throws when PRECACHE_SHELL is missing", () => {
    expect(() => parsePrecacheShell("const X = 1;")).toThrow();
  });
});

describe("routeToOutPath", () => {
  it("maps the home route to index.html", () => {
    expect(routeToOutPath("/")).toBe("index.html");
  });

  it("maps a page route to <route>.html", () => {
    expect(routeToOutPath("/tools/numbers")).toBe("tools/numbers.html");
  });

  it("maps a file-like route to itself", () => {
    expect(routeToOutPath("/manifest.webmanifest")).toBe("manifest.webmanifest");
    expect(routeToOutPath("/favicon.svg")).toBe("favicon.svg");
  });
});

describe("extractStaticAssetUrls", () => {
  it("collects script src and link href /_next/static URLs, deduped", () => {
    const html = `
      <html><head>
        <link rel="preload" href="/_next/static/media/font-a.woff2" as="font"/>
        <link rel="stylesheet" href="/_next/static/chunks/app.css"/>
        <link rel="manifest" href="/manifest.webmanifest"/>
      </head><body>
        <script src="/_next/static/chunks/main.js"></script>
        <script src="/_next/static/chunks/main.js"></script>
        <script src="https://www.googletagmanager.com/gtag/js?id=X"></script>
      </body></html>
    `;
    expect(extractStaticAssetUrls(html).sort()).toEqual(
      ["/_next/static/chunks/app.css", "/_next/static/chunks/main.js", "/_next/static/media/font-a.woff2"].sort()
    );
  });
});

describe("extractManifestIconPaths", () => {
  it("reads icon srcs, ignoring screenshots", () => {
    const manifest = JSON.stringify({
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192" },
        { src: "/icons/icon-512.png", sizes: "512x512" },
      ],
      screenshots: [{ src: "/og.png", sizes: "1200x630" }],
    });
    expect(extractManifestIconPaths(manifest)).toEqual(["/icons/icon-192.png", "/icons/icon-512.png"]);
  });
});

describe("buildBundleReport", () => {
  const files: Record<string, string> = {
    "index.html": `<html><head>
        <link rel="stylesheet" href="/_next/static/chunks/app.css"/>
        <link rel="manifest" href="/manifest.webmanifest"/>
      </head><body><script src="/_next/static/chunks/main.js"></script></body></html>`,
    "dictionary.html": `<html><head></head><body><script src="/_next/static/chunks/main.js"></script>
        <script src="/_next/static/chunks/dict.js"></script></body></html>`,
    "manifest.webmanifest": JSON.stringify({ icons: [{ src: "/icons/icon-192.png" }] }),
  };
  const sizes: Record<string, number> = {
    "index.html": 1000,
    "dictionary.html": 1200,
    "_next/static/chunks/app.css": 500,
    "_next/static/chunks/main.js": 2000,
    "_next/static/chunks/dict.js": 800,
    "manifest.webmanifest": 300,
    "favicon.svg": 400,
    "icons/icon-192.png": 900,
  };
  const readFile = (path: string) => files[path];
  const fileSize = (path: string) => sizes[path];

  it("sums HTML + de-duplicated static assets + manifest/icons across routes", () => {
    const report = buildBundleReport(["/", "/dictionary", "/manifest.webmanifest", "/favicon.svg"], readFile, fileSize);
    // index.html + dictionary.html + the manifest.webmanifest/favicon.svg routes themselves
    const routeBytes = 1000 + 1200 + 300 + 400;
    // main.js counted once even though both pages reference it
    const staticBytes = 500 + 2000 + 800;
    const extraBytes = 900; // manifest.webmanifest + favicon.svg are already routes, so only the icon is extra
    expect(report.totalBytes).toBe(routeBytes + staticBytes + extraBytes);
    expect(report.missing).toEqual([]);
    const staticGroup = report.groups.find((g) => g.label.includes("static assets"));
    expect(staticGroup?.files.sort()).toEqual(
      ["_next/static/chunks/app.css", "_next/static/chunks/dict.js", "_next/static/chunks/main.js"].sort()
    );
  });

  it("records missing files instead of throwing", () => {
    const report = buildBundleReport(["/", "/missing-route"], readFile, fileSize);
    expect(report.missing).toContain("missing-route.html");
  });
});
