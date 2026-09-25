/**
 * Confirm every illustration and narration file the built picture books reference is actually
 * served from the asset base (HEAD request, expects 200). Run after `aws s3 sync` and before
 * merging a batch; CI cannot check the files because the assets/ mirror is not in git.
 *
 * Usage: npm run check:assets            (every file, ~26 per book)
 *        npm run check:assets -- --covers (one request per book: quick sanity pass)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PictureBook, PictureBooksManifest } from "../src/lib/types";

const OUT_DIR = join(process.cwd(), "public", "data", "picturebooks");
const CONCURRENCY = 16;

export function assetUrls(books: readonly PictureBook[], coversOnly: boolean): string[] {
  const urls = new Set<string>();
  for (const b of books) {
    urls.add(b.cover.src);
    if (coversOnly) continue;
    for (const p of b.pages) if (p.image) urls.add(p.image.src);
    if (b.audio) urls.add(b.audio.src);
  }
  return [...urls];
}

async function head(url: string): Promise<{ url: string; status: number }> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return { url, status: res.status };
  } catch {
    return { url, status: 0 };
  }
}

async function main(): Promise<void> {
  const coversOnly = process.argv.includes("--covers");
  const manifest = JSON.parse(readFileSync(join(OUT_DIR, "manifest.json"), "utf8")) as PictureBooksManifest;
  const books = manifest.books.map((m) => JSON.parse(readFileSync(join(OUT_DIR, `${m.slug}.json`), "utf8")) as PictureBook);
  const urls = assetUrls(books, coversOnly);
  const missing: { url: string; status: number }[] = [];
  let done = 0;
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let url = queue.shift(); url; url = queue.shift()) {
        const r = await head(url);
        if (r.status !== 200) missing.push(r);
        done += 1;
        if (done % 500 === 0) console.log(`  ${done}/${urls.length}`);
      }
    }),
  );
  if (missing.length > 0) {
    console.error(`✗ ${missing.length} of ${urls.length} asset(s) not served:`);
    for (const m of missing.slice(0, 50)) console.error(`  - ${m.status} ${m.url}`);
    if (missing.length > 50) console.error(`  … and ${missing.length - 50} more`);
    process.exit(1);
  }
  console.log(`✓ ${urls.length} asset(s) for ${books.length} picture book(s) served with 200${coversOnly ? " (covers only)" : ""}`);
}

if (process.argv[1]?.endsWith("check-assets.ts")) void main();
