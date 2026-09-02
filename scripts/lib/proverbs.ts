/**
 * Kannada Wikiquote wikitext → proverb lines. Written from scratch for Sirigannada.
 * Only folk-saying list items are kept; templates, cites, Latin junk and headings go.
 */
import { hasKannada, normalise } from "../../src/lib/kannada";
import type { License } from "../../src/lib/types";

const MIN_KN = 6;
const ANUSVARA = "\u0C82";

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">", "&#39;": "'",
};

/** Strip nested `open`…`close` pairs (templates, comments already handled separately). */
export function stripBalanced(text: string, open: string, close: string): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text.startsWith(open, i)) {
      let depth = 0;
      let j = i;
      while (j < text.length) {
        if (text.startsWith(open, j)) { depth++; j += open.length; continue; }
        if (text.startsWith(close, j)) {
          depth--;
          j += close.length;
          if (depth === 0) break;
          continue;
        }
        j++;
      }
      i = j;
    } else {
      out += text[i];
      i++;
    }
  }
  return out;
}

/** Wikitext → lines with list markup preserved, everything else flattened. */
export function stripWikiMarkup(raw: string): string {
  let t = raw.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
  t = stripBalanced(t, "{{", "}}");
  t = t.replace(/<ref[^>]*\/>/gi, "").replace(/<ref[\s\S]*?<\/ref>/gi, "");
  t = t.replace(/<(?:br|hr)\s*\/?>[ \t]*/gi, "\n");
  t = t.replace(/<\/?poem\b[^>]*>/gi, "\n");
  t = t.replace(/<[^>]+>/g, "");
  t = t.replace(/\[\[(?:category|ವರ್ಗ|file|image|ಚಿತ್ರ)\s*:[^\]]*\]\]/gi, "");
  t = t.replace(/\[\[[^\]|#]*#[^\]|]*\|([^\]]*)\]\]/g, "$1");
  t = t.replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, "$1").replace(/\[\[([^\]]*)\]\]/g, "$1");
  t = t.replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1").replace(/\[https?:\/\/\S+\]/g, "");
  t = t.replace(/'''''|'''|''/g, "");
  t = t.replace(/^__\w+__$/gm, "");
  for (const [k, v] of Object.entries(ENTITIES)) t = t.split(k).join(v);
  return t;
}

/** Wiki typists often type Kannada/ASCII 0 instead of anusvara (ಂ). */
export function fixAnusvaraZero(text: string): string {
  return text.replace(
    /([\u0C80-\u0CFF])[0\u0CE6](?=[\u0C80-\u0CFF])/g,
    (_m, letter: string) => letter + ANUSVARA,
  );
}

const LIST_ITEM = /^\s*\*\s*(?!\*)(.*\S.*)$/;

function listBody(line: string): string | null {
  const m = LIST_ITEM.exec(line);
  return m?.[1] ? m[1] : null;
}

export function cleanProverb(raw: string): string {
  let t = normalise(raw);
  t = t.replace(/^[:;*#]+\s*/, "");
  t = t.replace(/^["'“”‘’]+/, "").replace(/["'“”‘’]+$/g, "").trim();
  t = fixAnusvaraZero(t);
  t = t.replace(/\s+/g, " ").trim();
  t = t.replace(/[।|]+$/g, "").trim();
  return t;
}

export function isUsableProverb(text: string): boolean {
  if (!text || !hasKannada(text)) return false;
  if (/[A-Za-z]/.test(text)) return false;
  if (/https?:\/\//i.test(text) || /www\./i.test(text)) return false;
  if (/[=<>*_`]/.test(text)) return false;
  if (/ವಿಷಯ.?ಪೋಣಿಕೆ|ದಯವಿಟ್ಟು/.test(text)) return false;
  if (/ಗಾದೆಗಳು\s*[!.…]*$/.test(text) && text.length < 48) return false;
  const kn = text.match(/[\u0C80-\u0CFF]/g)?.length ?? 0;
  if (kn < MIN_KN) return false;
  if (/^(ವರ್ಗ|ಇವನ್ನೂ ನೋಡಿ|ಆಕರ)/.test(text)) return false;
  return true;
}

export function dedupeKey(text: string): string {
  return normalise(text)
    .replace(/[''‘’“”"]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[।.!?]+$/g, "");
}

const MODERN_SECTION = /ಎಲೆಕ್ಟ್ರಾನಿಕ್|ಸಿಟಿ ಗಾದೆಗಳು|ಟಿ\.?\s*ವಿ\.?\s*ಗಾದೆ|ಹೊಸ ಗಾದೆಗಳು/;

/** Extract unique usable proverb strings from one page's wikitext. */
export function extractProverbs(wikitext: string): string[] {
  const text = wikitext.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
  const seen = new Set<string>();
  const out: string[] = [];
  let skipModern = false;
  for (const line of text.split("\n")) {
    if (MODERN_SECTION.test(line)) {
      skipModern = true;
      continue;
    }
    if (/^\s*==/.test(line)) skipModern = false;
    if (skipModern) continue;
    if (/https?:\/\//i.test(line)) continue;
    const body = listBody(line);
    if (body === null) continue;
    const cleaned = cleanProverb(stripWikiMarkup(body));
    if (!isUsableProverb(cleaned)) continue;
    const key = dedupeKey(cleaned);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

export function mergeProverbs(pages: string[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of pages) {
    for (const text of list) {
      const key = dedupeKey(text);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(text);
    }
  }
  return out.sort((a, b) => a.localeCompare(b, "kn"));
}

const LICENSES: readonly License[] = [
  "public-domain", "CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0", "ODbL-1.0",
];

export function validateProverbsFile(data: unknown): string[] {
  if (!data || typeof data !== "object") return ["proverbs.json: not an object"];
  const rec = data as Record<string, unknown>;
  const errors: string[] = [];
  const prov = rec.provenance;
  if (!prov || typeof prov !== "object") {
    errors.push("proverbs.json: missing provenance");
  } else {
    const p = prov as Record<string, unknown>;
    if (typeof p.source !== "string" || !p.source.startsWith("http")) {
      errors.push("proverbs.json: provenance.source must be a URL");
    }
    if (!LICENSES.includes(p.license as License)) {
      errors.push("proverbs.json: provenance.license is not an allowed licence");
    }
    if (p.license !== "CC-BY-SA-4.0") {
      errors.push("proverbs.json: expected licence CC-BY-SA-4.0");
    }
    if (typeof p.licenseNote !== "string" || p.licenseNote.length < 8) {
      errors.push("proverbs.json: provenance.licenseNote is missing");
    }
    if (typeof p.retrieved !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(p.retrieved)) {
      errors.push("proverbs.json: provenance.retrieved must be YYYY-MM-DD");
    }
  }
  if (!Array.isArray(rec.pages) || rec.pages.length === 0) {
    errors.push("proverbs.json: pages[] of source URLs is required");
  }
  if (!Array.isArray(rec.proverbs)) {
    errors.push("proverbs.json: missing proverbs array");
    return errors;
  }
  rec.proverbs.forEach((item, i) => {
    if (!item || typeof item !== "object") {
      errors.push(`proverbs.json: item ${i} is not an object`);
      return;
    }
    const row = item as Record<string, unknown>;
    if (typeof row.text !== "string" || !isUsableProverb(cleanProverb(row.text))) {
      errors.push(`proverbs.json: item ${i} has unusable text`);
    }
  });
  return errors;
}
