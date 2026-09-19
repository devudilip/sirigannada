/**
 * StoryWeaver API client: session cookie, catalogue paging, story metadata, and story pages.
 * Also the text helpers that turn page HTML into plain paragraphs and recover the CC BY 4.0
 * attribution (per-story and per-image credits, donor) from the BackInnerCoverPage text.
 * Network functions are exercised by fetch-storyweaver.ts; the pure text helpers below are unit
 * tested in storyweaver.test.ts against real fixtures captured from the API.
 */
import type { PictureBookImageCredit } from "../../src/lib/types";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
export const SW_BASE = "https://storyweaver.org.in";

export interface SwSession {
  cookie: string;
}

export interface ImageSize {
  width: number;
  height: number;
  url: string;
}

export interface CatalogueItem {
  id: number;
  slug: string;
  level: string;
  isAudio: boolean;
  isGif: boolean;
  publisherType: string | null;
}

export interface StoryMeta {
  id: number;
  name: string;
  language: string;
  level: string;
  isTranslation: boolean;
  publishedDate?: string;
  copyrightNotice?: string;
  publisher: { name: string; type: string };
  authors: { name: string }[];
  illustrators: { name: string }[];
  originalStory?: { name: string; authors?: { name: string }[] } | null;
  coverImage: { sizes: ImageSize[] };
}

export interface ReadPage {
  pageType: string;
  coverImage?: { sizes: ImageSize[] } | null;
  html: string;
}

export interface ReadData {
  orientation: "landscape" | "portrait";
  isAudio: boolean;
  audioPath?: string | null;
  coverAudioPath?: string | null;
  pages: ReadPage[];
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function headersFor(session: SwSession | null, binary: boolean): Record<string, string> {
  const headers: Record<string, string> = { "User-Agent": UA, Accept: binary ? "*/*" : "application/json" };
  if (session) headers.Cookie = session.cookie;
  return headers;
}

async function requestOnce(url: string, session: SwSession | null, binary: boolean): Promise<Response> {
  const res = await fetch(url, { headers: headersFor(session, binary) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

/**
 * GET with retries: a plain failure gets one retry after 300ms; a 429 (rate limited) backs off
 * with increasing delay across up to 4 attempts total — StoryWeaver rate-limits aggressively.
 */
export async function getWithRetry(url: string, session: SwSession | null, binary = false): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await requestOnce(url, session, binary);
    } catch (e) {
      lastError = e;
      const isRateLimited = e instanceof Error && e.message.startsWith("429");
      if (!isRateLimited && attempt >= 1) break;
      await sleep(isRateLimited ? 2000 * (attempt + 1) : 300);
    }
  }
  throw lastError;
}

/** Hits init-session and captures the _session_id cookie required by every later call. */
export async function initSession(): Promise<SwSession> {
  const res = await fetch(`${SW_BASE}/node/api/v1/init-session`, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`init-session failed: ${res.status}`);
  const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const raw = getSetCookie ? getSetCookie.call(res.headers) : [res.headers.get("set-cookie") ?? ""];
  const found = raw.map((c) => /_session_id=[^;]+/.exec(c)?.[0]).find((v): v is string => Boolean(v));
  if (!found) throw new Error("init-session did not set a _session_id cookie");
  return { cookie: found };
}

interface RawCatalogueItem {
  id: number;
  slug: string;
  level: string;
  isAudio: boolean;
  isGif: boolean;
  publisher?: { type?: string } | null;
}

/** One page of the Kannada catalogue, sorted by Ratings. `audio` restricts to audio books. */
export async function searchCatalogue(
  session: SwSession,
  page: number,
  opts: { audio?: boolean; perPage?: number } = {},
): Promise<CatalogueItem[]> {
  const params = new URLSearchParams();
  params.set("languages[]", "Kannada");
  params.set("page", String(page));
  params.set("per_page", String(opts.perPage ?? 24));
  params.set("sort", "Ratings");
  if (opts.audio) params.set("story_type", "audio");
  const res = await getWithRetry(`${SW_BASE}/node/api/v1/books-search?${params.toString()}`, session);
  const json = (await res.json()) as { data: RawCatalogueItem[] };
  return json.data.map((b) => ({
    id: b.id,
    slug: b.slug,
    level: b.level,
    isAudio: b.isAudio,
    isGif: b.isGif,
    publisherType: b.publisher?.type ?? null,
  }));
}

export async function getStoryMeta(session: SwSession, slug: string): Promise<StoryMeta> {
  const res = await getWithRetry(`${SW_BASE}/node/api/v1/stories/${slug}`, session);
  const json = (await res.json()) as { data: StoryMeta };
  return json.data;
}

export async function getStoryRead(session: SwSession, slug: string): Promise<ReadData> {
  const res = await getWithRetry(`${SW_BASE}/api/v1/stories/${slug}/read?ignore_count=false&source=`, session);
  const json = (await res.json()) as { data: ReadData };
  return json.data;
}

export async function downloadBinary(session: SwSession, url: string): Promise<Buffer> {
  const res = await getWithRetry(url, session, true);
  return Buffer.from(await res.arrayBuffer());
}

/** First size at or above `minWidth`, else the largest available — mirrors the Python prototype. */
export function pickSize(sizes: readonly ImageSize[], minWidth: number): ImageSize {
  const ok = sizes.find((s) => s.width >= minWidth);
  return ok ?? sizes[sizes.length - 1]!;
}

/* --------------------------------- HTML → text --------------------------------- */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  shy: "",
};

/** Decode the small set of HTML entities StoryWeaver's page text actually uses. */
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (whole, ent: string) => {
    if (ent.startsWith("#x") || ent.startsWith("#X")) {
      const code = parseInt(ent.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    if (ent.startsWith("#")) {
      const code = parseInt(ent.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ent in NAMED_ENTITIES ? NAMED_ENTITIES[ent]! : whole;
  });
}

/** Strip script/tags, decode entities, collapse all whitespace (incl. newlines) to single spaces. */
export function stripHtml(html: string): string {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const noTags = noScript.replace(/<[^>]+>/g, " ");
  return decodeEntities(noTags).replace(/\s+/g, " ").trim();
}

/**
 * Paragraph text from a story page: one string per non-empty <p>, in DOM order, across EVERY
 * div.content block. StoryWeaver's full-bleed layouts (sp_h_i100 / sp_v_i100) leave the first
 * content block empty and put the words in absolutely positioned content blocks after the page
 * number, so reading only the first block silently produces a wordless book.
 */
export function extractParagraphs(pageHtml: string): string[] {
  const blocks: string[] = [];
  for (const m of pageHtml.matchAll(/<div[^>]*class=(['"])[^'"]*\bcontent\b[^'"]*\1[^>]*>([\s\S]*?)<\/div>/g)) {
    blocks.push(m[2] ?? "");
  }
  const source = blocks.length > 0 ? blocks.join("\n") : pageHtml;
  const paragraphs: string[] = [];
  for (const m of source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripHtml(m[1] ?? "");
    if (text) paragraphs.push(text);
  }
  return paragraphs;
}

/* --------------------------------- attribution --------------------------------- */

export interface AttributionParse {
  /** Whether the attribution text actually declares CC BY 4.0 (a book must be skipped if not). */
  isCcBy: boolean;
  holder: string | null;
  year: string | null;
  donor: string | null;
  imageCredits: PictureBookImageCredit[];
}

// Whitespace is tolerant of spacing that varies around commas/periods in the source ("Pratham
// Books , 2004" vs "Pratham Books, 2004") because the HTML has inconsistent spacing there.
const WRITTEN_RE =
  /This story:[\s\S]*?is written by[\s\S]*?\.\s*©\s*(.+?)\s*,\s*(\d{4})\s*\.\s*Some rights reserved\.\s*Released under CC BY 4\.0 license\./;
const TRANSLATED_RE =
  /This story:[\s\S]*?is translated by[\s\S]*?The © for this translation lies with\s*(.+?)\s*,\s*(\d{4})\s*\.\s*Some rights reserved\.\s*Released under CC BY 4\.0 license\./;
const IMAGE_CREDIT_RE =
  /Page (\d+):\s*(.+?)\s*,\s*by\s*(.+?)\s*©\s*(.+?)\s*,\s*(\d{4})\s*\.\s*Some rights reserved\.\s*Released under CC BY 4\.0 license\./g;
const DONOR_RE = /supported by\s*([^,.]+)/;

/** Parse the concatenated BackInnerCoverPage text (already run through stripHtml). */
export function parseAttribution(text: string): AttributionParse {
  const isCcBy = text.includes("Released under CC BY 4.0 license");
  const translated = TRANSLATED_RE.exec(text);
  const written = translated ? null : WRITTEN_RE.exec(text);
  const holder = (translated?.[1] ?? written?.[1])?.trim() ?? null;
  const year = translated?.[2] ?? written?.[2] ?? null;
  const donor = DONOR_RE.exec(text)?.[1]?.trim() ?? null;
  const imageCredits: PictureBookImageCredit[] = [];
  for (const m of text.matchAll(IMAGE_CREDIT_RE)) {
    imageCredits.push({
      page: Number(m[1]),
      title: (m[2] ?? "").trim(),
      illustrator: (m[3] ?? "").trim(),
      holder: (m[4] ?? "").trim(),
      year: m[5] ?? "",
    });
  }
  return { isCcBy, holder, year, donor, imageCredits };
}

export interface AttributionLineInput {
  title: string;
  language: string;
  translators: readonly string[];
  originalTitle?: string | null;
  authors: readonly string[];
  illustrators: readonly string[];
  donor?: string | null;
  publisher: string;
  holder: string;
  year: string;
}

/** The one-line attribution in StoryWeaver's required form, ready to print. */
export function attributionLine(input: AttributionLineInput): string {
  const parts = [`${input.title} (${input.language})`];
  if (input.translators.length > 0) parts.push(`translated by ${input.translators.join(", ")}`);
  if (input.originalTitle) parts.push(`based on original story ${input.originalTitle}`);
  parts.push(`written by ${input.authors.join(", ")}`);
  parts.push(`illustrated by ${input.illustrators.join(", ")}`);
  if (input.donor) parts.push(`supported by ${input.donor}`);
  parts.push(
    `published by ${input.publisher} (© ${input.holder}, ${input.year}) under a CC BY 4.0 license on StoryWeaver. Read, create and translate stories for free on www.storyweaver.org.in`,
  );
  return parts.join(", ");
}
