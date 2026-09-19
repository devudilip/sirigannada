/**
 * Fetch StoryWeaver picture books into data/picturebooks-src/<slug>/{book,pages}.json and
 * public/data/picturebooks/<slug>/{cover,p01,...}.jpg (+ audio.mp3 for audio books).
 *
 * Usage:
 *   tsx scripts/fetch-storyweaver.ts <slug>...
 *   tsx scripts/fetch-storyweaver.ts --catalogue data/picturebooks-src/catalogue.txt
 *
 * The catalogue file is one slug per line; blank lines and `#` comments are ignored.
 * Idempotent: existing image/audio files are left alone, and re-running just rewrites the JSON.
 * A book whose attribution page does not declare "Released under CC BY 4.0 license" is skipped.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PictureBook, PictureBookImageCredit, PictureBookLevel, PictureBookPage } from "../src/lib/types";
import {
  attributionLine,
  downloadBinary,
  extractParagraphs,
  getStoryMeta,
  getStoryRead,
  initSession,
  parseAttribution,
  pickSize,
  sleep,
  stripHtml,
  type ImageSize,
  type ReadPage,
  type SwSession,
} from "./lib/storyweaver";

export const PICTUREBOOKS_SRC = join(process.cwd(), "data", "picturebooks-src");
export const PICTUREBOOKS_PUBLIC = join(process.cwd(), "public", "data", "picturebooks");

const DELAY_MS = 1200;

function titleCaseFromSlug(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => (w.length > 0 ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

interface FetchResult {
  slug: string;
  ok: boolean;
  reason?: string;
  pageCount?: number;
  hasAudio?: boolean;
  doubtfulAttribution?: boolean;
  audioFailed?: boolean;
}

async function downloadImage(session: SwSession, size: ImageSize, dest: string): Promise<void> {
  if (existsSync(dest)) return;
  const data = await downloadBinary(session, size.url);
  writeFileSync(dest, data);
  await sleep(DELAY_MS);
}

async function fetchAudio(session: SwSession, audioPath: string, dest: string): Promise<{ durationSec: number; bytes: number } | null> {
  if (existsSync(dest)) {
    const durationSec = Math.round(Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest]).toString().trim()));
    return { durationSec, bytes: statSync(dest).size };
  }
  const raw = dest.replace(/\.mp3$/, ".raw.mp3");
  const data = await downloadBinary(session, audioPath);
  writeFileSync(raw, data);
  await sleep(DELAY_MS);
  try {
    execFileSync("ffmpeg", ["-nostdin", "-loglevel", "error", "-y", "-i", raw, "-ac", "1", "-ar", "44100", "-b:a", "48k", dest]);
  } finally {
    rmSync(raw, { force: true });
  }
  const durationSec = Math.round(Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest]).toString().trim()));
  return { durationSec, bytes: statSync(dest).size };
}

async function fetchOne(session: SwSession, slug: string): Promise<FetchResult> {
  const meta = await getStoryMeta(session, slug);
  await sleep(DELAY_MS);
  const read = await getStoryRead(session, slug);
  await sleep(DELAY_MS);

  const attributionText = read.pages
    .filter((p) => p.pageType === "BackInnerCoverPage")
    .map((p) => stripHtml(p.html))
    .join(" ");
  const attribution = parseAttribution(attributionText);
  if (!attribution.isCcBy) return { slug, ok: false, reason: "attribution page does not declare CC BY 4.0" };

  const outSrc = join(PICTUREBOOKS_SRC, slug);
  const outPub = join(PICTUREBOOKS_PUBLIC, slug);
  mkdirSync(outSrc, { recursive: true });
  mkdirSync(outPub, { recursive: true });

  const storyPages = read.pages.filter((p: ReadPage) => p.pageType !== "FrontCoverPage" && p.pageType !== "BackCoverPage" && p.pageType !== "BackInnerCoverPage");
  const pages: PictureBookPage[] = [];
  let n = 0;
  for (const p of storyPages) {
    n += 1;
    let image: PictureBookPage["image"] = null;
    const sizes = p.coverImage?.sizes;
    if (sizes && sizes.length > 0) {
      const size = pickSize(sizes, 700);
      const fn = `p${String(n).padStart(2, "0")}.jpg`;
      await downloadImage(session, size, join(outPub, fn));
      image = { src: `/data/picturebooks/${slug}/${fn}`, width: Math.round(size.width), height: Math.round(size.height) };
    }
    pages.push({ n, image, text: extractParagraphs(p.html) });
  }

  const coverSize = pickSize(meta.coverImage.sizes, 540);
  await downloadImage(session, coverSize, join(outPub, "cover.jpg"));

  let audio: PictureBook["audio"] = null;
  let audioFailed = false;
  if (read.isAudio && read.audioPath) {
    try {
      const info = await fetchAudio(session, read.audioPath, join(outPub, "audio.mp3"));
      if (info) audio = { src: `/data/picturebooks/${slug}/audio.mp3`, durationSec: info.durationSec, bytes: info.bytes };
    } catch (e) {
      // The book's pages/images are still good; ship it text-only rather than losing it entirely.
      audioFailed = true;
      console.log(`  (audio unavailable for ${slug}: ${(e as Error).message})`);
    }
  }

  const isTranslation = meta.isTranslation;
  const authors = (isTranslation ? meta.originalStory?.authors ?? [] : meta.authors).map((a) => a.name);
  const translators = isTranslation ? meta.authors.map((a) => a.name) : [];
  const illustrators = meta.illustrators.map((i) => i.name);
  const originalTitle = isTranslation && meta.originalStory?.name && meta.originalStory.name !== meta.name ? meta.originalStory.name : null;
  const publisher = meta.publisher.name;
  const year = attribution.year ?? (meta.publishedDate ?? "").slice(-4);
  const holder = attribution.holder ?? publisher;
  const imageCredits: PictureBookImageCredit[] = attribution.imageCredits;

  const line = attributionLine({
    title: meta.name,
    language: meta.language,
    translators,
    originalTitle,
    authors,
    illustrators,
    donor: attribution.donor,
    publisher,
    holder,
    year,
  });

  const doubtfulAttribution = !attribution.holder || !attribution.year || authors.length === 0 || illustrators.length === 0;

  const book: Omit<PictureBook, "pages" | "wordCount"> = {
    slug,
    title: meta.name,
    titleEn: titleCaseFromSlug(slug),
    level: String(meta.level) as PictureBookLevel,
    description: "",
    orientation: read.orientation,
    cover: { src: `/data/picturebooks/${slug}/cover.jpg`, width: Math.round(coverSize.width), height: Math.round(coverSize.height) },
    audio,
    provenance: {
      source: `https://storyweaver.org.in/en/stories/${slug}`,
      license: "CC-BY-4.0",
      licenseNote:
        "Fetched from StoryWeaver's public API; the book's own attribution page states 'Released under CC BY 4.0 license' for the story and each illustration. Text is the page HTML with markup removed; illustrations are StoryWeaver's 700–960 px crops, unmodified apart from JPEG re-encoding; audio re-encoded to mono MP3.",
      storyweaverId: meta.id,
      authors,
      illustrators,
      translators,
      publisher,
      publishedYear: year,
      ...(attribution.donor ? { donor: attribution.donor } : {}),
      ...(originalTitle ? { originalStory: { title: originalTitle } } : {}),
      ...(meta.copyrightNotice ? { copyrightNotice: meta.copyrightNotice } : {}),
      attributionLine: line,
      imageCredits,
      retrieved: new Date().toISOString().slice(0, 10),
    },
  };

  writeFileSync(join(outSrc, "book.json"), JSON.stringify(book, null, 2));
  writeFileSync(join(outSrc, "pages.json"), JSON.stringify({ pages }, null, 2));

  return { slug, ok: true, pageCount: pages.length, hasAudio: audio !== null, doubtfulAttribution, audioFailed };
}

function readCatalogueFile(file: string): string[] {
  return readFileSync(file, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
}

export async function fetchSlugs(slugs: string[]): Promise<FetchResult[]> {
  let session = await initSession();
  const results: FetchResult[] = [];
  for (const slug of slugs) {
    try {
      results.push(await fetchOne(session, slug));
    } catch (e) {
      const message = (e as Error).message;
      // A 401 mid-run usually means the session cookie expired; get a fresh one and retry once.
      if (message.startsWith("401")) {
        try {
          await sleep(DELAY_MS);
          session = await initSession();
          results.push(await fetchOne(session, slug));
          continue;
        } catch (e2) {
          results.push({ slug, ok: false, reason: (e2 as Error).message });
          continue;
        }
      }
      results.push({ slug, ok: false, reason: message });
    }
    await sleep(DELAY_MS);
  }
  return results;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let slugs: string[];
  const catIdx = args.indexOf("--catalogue");
  if (catIdx !== -1) {
    const file = args[catIdx + 1];
    if (!file) throw new Error("--catalogue requires a file path");
    slugs = readCatalogueFile(file);
  } else {
    slugs = args;
  }
  if (slugs.length === 0) {
    console.error("Usage: tsx scripts/fetch-storyweaver.ts <slug>... | --catalogue <file>");
    process.exit(1);
  }
  const results = await fetchSlugs(slugs);
  let ok = 0;
  const skipped: string[] = [];
  const doubtful: string[] = [];
  const audioIssues: string[] = [];
  for (const r of results) {
    if (r.ok) {
      ok += 1;
      console.log(
        `OK ${r.slug} pages=${r.pageCount} audio=${r.hasAudio}${r.doubtfulAttribution ? " (doubtful attribution)" : ""}${r.audioFailed ? " (audio download failed, shipped without audio)" : ""}`,
      );
      if (r.doubtfulAttribution) doubtful.push(r.slug);
      if (r.audioFailed) audioIssues.push(r.slug);
    } else {
      console.log(`SKIP ${r.slug}: ${r.reason}`);
      skipped.push(`${r.slug}: ${r.reason}`);
    }
  }
  console.log(`\n${ok}/${results.length} fetched.`);
  if (skipped.length > 0) console.log(`Skipped:\n${skipped.map((s) => `  - ${s}`).join("\n")}`);
  if (doubtful.length > 0) console.log(`Doubtful attribution (review):\n${doubtful.map((s) => `  - ${s}`).join("\n")}`);
  if (audioIssues.length > 0) console.log(`Audio download failed (shipped without audio):\n${audioIssues.map((s) => `  - ${s}`).join("\n")}`);
}

if (process.argv[1]?.endsWith("fetch-storyweaver.ts")) main();
