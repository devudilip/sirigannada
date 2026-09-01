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
  t = stripTemplates(t, "Pages");
  t = t.replace(/<ref[^>]*\/>/gi, "").replace(/<ref[\s\S]*?<\/ref>/gi, "");
  t = t.replace(/<br\s*\/?>[ \t]*\n?/gi, "\n").replace(/<\/?poem[^>]*>/gi, "\n");
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
];

export function fixConversionGlitches(text: string): string {
  return GLITCHES.reduce((t, [re, to]) => t.replace(re, to), text);
}

/** Remove any remaining heading lines and metadata-ish lines (ರಾಗ/ತಾಳ, authorship line). */
export function dropNonVerse(text: string): string {
  return fixConversionGlitches(text)
    .split("\n")
    .filter((l) => !l.startsWith("## ") && !/^(ರಾಗ|ತಾಳ|ರಚನೆ)\s*[:：]/.test(l))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Numbered verses whose lines were written with blank lines between them: rejoin so that
 *  each verse (ending in a Kannada/ASCII numeral, optionally in ॥ ॥) becomes one block. */
export function joinNumberedVerses(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const blocks: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    current.push(line);
    if (/(?:[\u0CE6-\u0CEF0-9]+\s*[।॥|]*\s*)$/.test(line)) {
      blocks.push(current.join("\n"));
      current = [];
    }
  }
  if (current.length > 0) blocks.push(current.join("\n"));
  return blocks.join("\n\n");
}
