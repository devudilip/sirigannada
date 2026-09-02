/**
 * Kannada Wikisource access + wikitext → plain-text cleaning. Written from scratch.
 * Only the MediaWiki API is used (no HTML scraping); requests carry a descriptive User-Agent
 * as Wikimedia's API etiquette requires.
 */
import { normalise } from "../../src/lib/kannada";

export const API = "https://kn.wikisource.org/w/api.php";
export const PAGE_BASE = "https://kn.wikisource.org/wiki/";
const USER_AGENT = "Sirigannada-corpus/0.1 (https://github.com/devudilip/sirigannada; devu.dilip@gmail.com)";

export function pageUrl(title: string): string {
  return PAGE_BASE + encodeURIComponent(title.replace(/ /g, "_"));
}

interface RevisionsResponse {
  query?: { pages?: { title: string; missing?: boolean; revisions?: { slots: { main: { content: string } } }[] }[] };
}

/** Fetch raw wikitext for up to 50 titles per request. Missing pages map to null. */
export async function fetchWikitext(titles: string[]): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>();
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    const params = new URLSearchParams({
      action: "query",
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
      format: "json",
      formatversion: "2",
      redirects: "1",
      titles: batch.join("|"),
    });
    // POST: 50 percent-encoded Kannada titles easily exceed URL length limits (HTTP 414).
    const res = await fetch(API, {
      method: "POST",
      headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!res.ok) throw new Error(`Wikisource API ${res.status} for batch starting "${batch[0]}"`);
    const data = (await res.json()) as RevisionsResponse;
    const byNorm = new Map<string, string>();
    for (const t of batch) byNorm.set(normalise(t).replace(/_/g, " ").replace(/\s+/g, " "), t);
    for (const p of data.query?.pages ?? []) {
      const key = normalise(p.title).replace(/\s+/g, " ");
      const original = byNorm.get(key) ?? p.title;
      out.set(original, p.missing ? null : (p.revisions?.[0]?.slots.main.content ?? null));
    }
    for (const t of batch) if (!out.has(t)) out.set(t, null);
    if (i + 50 < titles.length) await new Promise((r) => setTimeout(r, 300));
  }
  return out;
}

/* ------------------------------- wikitext cleaning ------------------------------ */

/** Remove {{...}} templates, handling nesting. Optionally keep the value of one named parameter. */
export function stripTemplates(text: string, keepParam?: string): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("{{", i)) {
      let depth = 0;
      let j = i;
      while (j < text.length) {
        if (text.startsWith("{{", j)) { depth++; j += 2; continue; }
        if (text.startsWith("}}", j)) { depth--; j += 2; if (depth === 0) break; continue; }
        j++;
      }
      const inner = text.slice(i + 2, j - 2);
      if (keepParam) {
        const m = new RegExp(`\\|\\s*${keepParam}\\s*=([\\s\\S]*?)(?=\\n\\s*\\|\\s*\\w+\\s*=|$)`).exec(inner);
        if (m?.[1]) out += "\n" + m[1] + "\n";
      }
      i = j;
    } else {
      out += text[i];
      i++;
    }
  }
  return out;
}

/** Titles of [[wikilinks]] in reading order, excluding categories, files and interwiki links. */
export function extractLinks(wikitext: string): string[] {
  const seen = new Set<string>();
  const links: string[] = [];
  for (const m of wikitext.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const target = normalise((m[1] ?? "").replace(/_/g, " ")).replace(/\s+/g, " ");
    if (!target || /^(category|file|image|ವರ್ಗ|ಚಿತ್ರ|wikipedia|w|s|:)/i.test(target)) continue;
    if (target.startsWith("/") || target.includes(":")) continue;
    if (!seen.has(target)) { seen.add(target); links.push(target); }
  }
  return links;
}

const ENTITIES: Record<string, string> = { "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#39;": "'" };

/**
 * Wikitext → plain text. Headings become "## Title" lines so callers can split sections.
 * Keeps verse lines; drops templates (except {{PoemHeader|Pages=}} verse bodies), refs,
 * categories, tables, HTML tags and formatting marks.
 */
export function cleanWikitext(raw: string): string {
  let t = raw.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
  const poems = [...t.matchAll(/<poem\b[^>]*>([\s\S]*?)<\/poem>/gi)].map((m) => m[1] ?? "");
  // When <poem> is present, ignore tables/templates around it — ತಾತ್ಪರ್ಯ cells are modern.
  t = poems.length > 0 ? poems.join("\n\n") : stripTemplates(t, "Pages");
  t = t.replace(/<ref[^>]*\/>/gi, "").replace(/<ref[\s\S]*?<\/ref>/gi, "");
  t = t.replace(/<(?:br|hr)\s*\/?>[ \t]*\n?/gi, "\n").replace(/<\/?poem[^>]*>/gi, "\n");
  t = t.replace(/<(div|span|center|big|small|font|b|i|u|p|table|tr|td|th|sup|sub|section)[^>]*>/gi, "").replace(/<\/(div|span|center|big|small|font|b|i|u|p|table|tr|td|th|sup|sub|section)>/gi, "");
  t = t.replace(/<pages[^>]*\/?>/gi, "").replace(/<noinclude>[\s\S]*?<\/noinclude>/gi, "");
  t = t.replace(/\[\[(?:category|ವರ್ಗ|file|image|ಚಿತ್ರ)\s*:[^\]]*\]\]/gi, "");
  t = t.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1").replace(/\[\[([^\]]*)\]\]/g, "$1");
  t = t.replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1").replace(/\[https?:\/\/\S+\]/g, "");
  t = t.replace(/'''''|'''|''/g, "");
  t = t.replace(/^__\w+__$/gm, "").replace(/^-{4,}\s*$/gm, "");
  t = t.replace(/^(\{\||\|\}|\|-|\||!).*$/gm, "");
  t = t.replace(/^[:;*#]+\s*/gm, "");
  t = t.replace(/^(=+)\s*([^=\s].*?)\s*\1\s*$/gm, (_m, _eq, title: string) => `## ${title}`);
  t = t.replace(/^=+\s*/gm, "").replace(/\s*=+\s*$/gm, ""); // unbalanced "=" runs are not headings
  t = t.replace(/ದೊಡ್ಡ ಪಠ್ಯ/g, ""); // visual-editor placeholder for <big> ("big text")
  t = t.replace(/ *_+ */g, " "); // stray underscores from the legacy-font import
  t = t.replace(/\\/g, "।"); // typist's stand-in for the danda (Sarvajna page)
  t = t.replace(/ ?\([^()\n]*\?\s*\)/g, ""); // editor's variant readings: "ಹೊಂದಿಕೆ (ಹೊದಿಕೆ?)"
  t = t.replace(/ ?\([^()\n]*=[^)]*\)/g, ""); // (gloss=…) notes fail corpus validation
  t = t.replace(/[\u2014\u2013]\n?/g, ""); // em-dash used as a line-wrap mark (ತಾ— / ನಾಗಿ)
  t = t.replace(/([\u0C80-\u0CFF])[A-Za-z]+/g, "$1"); // stray Latin inside Kannada (ಮತ್ತs)
  t = t.replace(/`/g, "‘"); // typewriter-style opening quote
  for (const [k, v] of Object.entries(ENTITIES)) t = t.split(k).join(v);
  return t
    .split("\n")
    .map((line) => normalise(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Return only the text of the "## heading" section named `heading` (until the next heading of same or higher level). */
export function sectionOf(cleaned: string, heading: string): string {
  const lines = cleaned.split("\n");
  const start = lines.findIndex((l) => l.startsWith("## ") && normalise(l.slice(3)) === normalise(heading));
  if (start === -1) return "";
  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    body.push(line);
  }
  return body.join("\n").trim();
}

/** Unambiguous artefacts of legacy-font (Nudi/Baraha) → Unicode conversion seen on Wikisource.
 *  Each left-hand cluster does not occur in real Kannada words. */
const GLITCHES: [RegExp, string][] = [
  [/([\u0CBE-\u0CCC])\u0CC1/g, "$1ಯಿ"], // ಕಾುಗೆ → ಕಾಯಿಗೆ, ಮತಿುಲ್ಲದ → ಮತಿಯಿಲ್ಲದ (lost ಯಿ)
  [/ದ್ಥ/g, "ಧ"], // ಲಿಂಗಸಂಬಂದ್ಥಿ → ಲಿಂಗಸಂಬಂಧಿ
  [/ಬ್ಥ/g, "ಭ"], // ಬ್ಥಿತ್ತಿ → ಭಿತ್ತಿ
  [/ಮತ್ರ್ಯ/g, "ಮರ್ತ್ಯ"],
  [/ಷ([\u0CBE-\u0CCC]?)\*/g, "ಷ್ಠ$1"], // ಕಾಷ* → ಕಾಷ್ಠ, ಗೋಷಿ* → ಗೋಷ್ಠಿ (ಷ್ಠ glyph missing)
  [/ಸ್ಧ/g, "ಸ್ಥ"], // ಸ್ಧಾನ → ಸ್ಥಾನ (lost aspirate)
];

export function fixConversionGlitches(text: string): string {
  return GLITCHES.reduce((t, [re, to]) => t.replace(re, to), text);
}

const META_HEADING = /^(ನೋಡಿ|ಉಲ್ಲೇಖ|ಉಲ್ಲೇಖಗಳು|ಪರಿವಿಡಿ|ಟಿಪ್ಪಣಿ)$/;
const COMMENTARY_PHRASE = /ರವರು ರಚಿಸಿ|ಎನ್ನುವ ಪದದಲ್ಲಿ|ಎಂಬುದು ತಾತ್ಪರ್ಯ|ಆಧುನಿಕ ವಿವರಣೆ/;
const VERSE_MARK = /[|॥]|\|\||ಪಲ್ಲ/;

/** Drop wiki nav/citation sections (heading + body) so they never become verse. */
function dropMetaSections(text: string): string {
  const out: string[] = [];
  let skip = false;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      skip = META_HEADING.test(line.slice(3).trim());
      if (skip) continue;
    }
    if (!skip) out.push(line);
  }
  return out.join("\n");
}

/** Modern encyclopedia prose / sung-repeat cues — used only in blocks mode (one page = one poem). */
export function isProseCommentary(line: string): boolean {
  const l = line.trim();
  if (!l) return false;
  if (/^\[[^\]]+\]$/.test(l)) return true;
  if (COMMENTARY_PHRASE.test(l)) return true;
  if (VERSE_MARK.test(l)) return false;
  return l.split(/\s+/).length >= 12 && l.length >= 80 && /[.?!।]/.test(l);
}

/** Remove any remaining heading lines and metadata-ish lines (ರಾಗ/ತಾಳ, authorship line). */
export function dropNonVerse(text: string, opts?: { commentary?: boolean }): string {
  return fixConversionGlitches(dropMetaSections(text))
    .split("\n")
    .filter((l) => !l.startsWith("## ") && !/^(ರಾಗ|ತಾಳ|ರಚನೆ)\s*[:：]/.test(l))
    .filter((l) => !/^(ತಾತ್ಪರ್ಯ|ಪದವಿಭಾಗ|ಅರ್ಥ|ವಿವರಣೆ)\s*[:：]?/.test(l))
    .filter((l) => !/^[A-Za-z][A-Za-z0-9 .:/_-]{8,}$/.test(l))
    .filter((l) => !(opts?.commentary && isProseCommentary(l)))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Numbered verses whose lines were written with blank lines between them: rejoin so that
 *  each verse (ending in a Kannada/ASCII numeral, optionally in ॥ ॥ or parentheses) becomes one block. */
const VERSE_END = /(?:\(?[\u0CE6-\u0CEF0-9]+\)?\s*[।॥|]*\s*)$/;
const UNNUMBERED_DANDA = /[।॥|]{2,}\s*$/;

export function joinNumberedVerses(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const blocks: string[] = [];
  let current: string[] = [];
  const flush = (): void => {
    if (current.length > 0) blocks.push(current.join("\n"));
    current = [];
  };
  for (const line of lines) {
    if (UNNUMBERED_DANDA.test(line) && !/[\u0CE6-\u0CEF0-9]/.test(line)) {
      flush();
      continue;
    }
    current.push(line);
    if (VERSE_END.test(line)) flush();
  }
  flush();
  return blocks.join("\n\n");
}
