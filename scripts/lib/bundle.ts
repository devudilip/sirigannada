/**
 * Pure helpers for the offline shell bundle-budget check (scripts/check-bundle.ts).
 *
 * The service worker's PRECACHE_SHELL list names the routes that go into the shell cache.
 * These helpers turn that list into a set of on-disk files (from a static `next build`
 * export in out/) and sum their byte sizes, without touching the filesystem themselves —
 * callers pass in file contents / sizes, which keeps this module unit-testable with small
 * in-memory fixtures.
 */

/** Extract the PRECACHE_SHELL array literal from public/sw.js source. */
export function parsePrecacheShell(swSource: string): string[] {
  const match = /const\s+PRECACHE_SHELL\s*=\s*(\[[^\]]*\])/.exec(swSource);
  if (!match) throw new Error("PRECACHE_SHELL not found in sw.js");
  const arrayLiteral = match[1] as string;
  const routes: string[] = [];
  const stringRe = /"((?:[^"\\]|\\.)*)"/g;
  let m: RegExpExecArray | null;
  while ((m = stringRe.exec(arrayLiteral))) {
    routes.push((m[1] as string).replace(/\\"/g, '"'));
  }
  return routes;
}

/** Map a precached route (e.g. "/", "/dictionary", "/manifest.webmanifest") to its out/ file path. */
export function routeToOutPath(route: string): string {
  if (route === "/") return "index.html";
  const clean = route.replace(/^\/+/, "");
  // Non-page assets referenced directly by PRECACHE_SHELL (manifest, favicon, ...) map as-is.
  if (/\.[a-z0-9]+$/i.test(clean)) return clean;
  return `${clean}.html`;
}

export interface AssetRefs {
  /** /_next/static/... URLs referenced by <script src>, <link href> (stylesheets, preloads, fonts). */
  staticAssets: string[];
}

/** Pull every /_next/static/... URL referenced from script/link tags in a page's HTML. */
export function extractStaticAssetUrls(html: string): string[] {
  const urls = new Set<string>();
  const tagRe = /<(script|link)\b[^>]*>/gi;
  let tag: RegExpExecArray | null;
  while ((tag = tagRe.exec(html))) {
    const tagText = tag[0] as string;
    const attrRe = /(?:src|href)\s*=\s*"([^"]*)"/gi;
    let attr: RegExpExecArray | null;
    while ((attr = attrRe.exec(tagText))) {
      const url = attr[1] as string;
      if (url.startsWith("/_next/static/")) urls.add(url);
    }
  }
  return [...urls];
}

/** Manifest icon entries relevant to the shell (the "icons" array; screenshots are not part of the shell). */
export function extractManifestIconPaths(manifestJson: string): string[] {
  const manifest = JSON.parse(manifestJson) as { icons?: { src?: string }[] };
  const icons = manifest.icons ?? [];
  return icons.map((icon) => icon.src).filter((src): src is string => typeof src === "string");
}

export interface BundleGroup {
  /** Human-readable label for the report, e.g. a route or "static assets" or "manifest + icons". */
  label: string;
  /** out/-relative file paths counted in this group. */
  files: string[];
  bytes: number;
}

export interface BundleReport {
  groups: BundleGroup[];
  totalBytes: number;
  /** Files referenced (HTML or extracted assets) that had no matching entry in the size lookup. */
  missing: string[];
}

/**
 * Build the full report: for each PRECACHE_SHELL route, count its HTML plus the static
 * assets it references; then count manifest.webmanifest, favicon.svg (if not already routes)
 * and the icons the manifest lists.
 *
 * @param routes PRECACHE_SHELL routes, as returned by parsePrecacheShell.
 * @param readFile reads an out/-relative path's text content (for HTML/manifest parsing), or undefined if missing.
 * @param fileSize returns an out/-relative path's byte size, or undefined if missing.
 */
export function buildBundleReport(
  routes: string[],
  readFile: (outPath: string) => string | undefined,
  fileSize: (outPath: string) => number | undefined
): BundleReport {
  const groups: BundleGroup[] = [];
  const missing: string[] = [];
  const staticAssetPaths = new Set<string>();
  const routeOutPaths = new Set<string>();

  const sizeOf = (outPath: string): number => {
    const size = fileSize(outPath);
    if (size === undefined) {
      missing.push(outPath);
      return 0;
    }
    return size;
  };

  for (const route of routes) {
    const outPath = routeToOutPath(route);
    routeOutPaths.add(outPath);
    const isHtmlPage = outPath.endsWith(".html");
    const files = [outPath];
    let bytes = sizeOf(outPath);

    if (isHtmlPage) {
      const html = readFile(outPath);
      if (html !== undefined) {
        for (const assetUrl of extractStaticAssetUrls(html)) {
          const assetPath = assetUrl.replace(/^\//, "");
          if (staticAssetPaths.has(assetPath)) continue; // counted once, in "static assets" group
          staticAssetPaths.add(assetPath);
        }
      } else {
        missing.push(outPath);
      }
    }

    groups.push({ label: route, files, bytes });
  }

  const staticFiles = [...staticAssetPaths].sort();
  const staticBytes = staticFiles.reduce((sum, path) => sum + sizeOf(path), 0);
  groups.push({ label: "/_next/static assets (JS, CSS, fonts)", files: staticFiles, bytes: staticBytes });

  // manifest.webmanifest + favicon.svg + the icons the manifest lists, unless already a route.
  const extraFiles: string[] = [];
  for (const path of ["manifest.webmanifest", "favicon.svg"]) {
    if (!routeOutPaths.has(path)) extraFiles.push(path);
  }
  const manifestText = readFile("manifest.webmanifest");
  if (manifestText !== undefined) {
    for (const iconPath of extractManifestIconPaths(manifestText)) {
      extraFiles.push(iconPath.replace(/^\//, ""));
    }
  } else if (!routeOutPaths.has("manifest.webmanifest")) {
    missing.push("manifest.webmanifest");
  }
  const extraBytes = extraFiles.reduce((sum, path) => sum + sizeOf(path), 0);
  groups.push({ label: "manifest.webmanifest + icons", files: extraFiles, bytes: extraBytes });

  const totalBytes = groups.reduce((sum, group) => sum + group.bytes, 0);
  return { groups, totalBytes, missing };
}
