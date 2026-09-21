/**
 * Reusable share-card renderer (S-01): one Canvas 2D painter for word/gade/dailyWord/verse cards.
 * Colours are the light-theme values from `src/styles/tokens.css` (canvas can't read CSS vars —
 * keep in sync). Wrapping/measuring and blob/download plumbing are shared with the reader's verse
 * image (`features/reader/lib/shareImage.ts`).
 */
import { analyseTextHealth } from "@/features/text-health/lib/analyseTextHealth";
import {
  canvasToPngBlob,
  downloadPng,
  truncateLines,
  truncateText,
  wrapParagraphs,
  type MeasureFn,
} from "@/features/reader/lib/shareImage";

export { canvasToPngBlob, downloadPng };

export type ShareKind = "word" | "gade" | "dailyWord" | "verse";
export type ShareSize = "portrait" | "square";

export const SHARE_SIZES: Record<ShareSize, { w: number; h: number }> = {
  portrait: { w: 1080, h: 1350 },
  square: { w: 1080, h: 1080 },
};

/** Fixed Kannada chip/caption label per kind — the card is a Kannada artefact in every locale. */
export const KIND_LABEL: Record<ShareKind, string> = {
  word: "ಪದ",
  gade: "ಗಾದೆ",
  dailyWord: "ಇಂದಿನ ಪದ",
  verse: "ಗ್ರಂಥ",
};

const BRAND = "ಸಿರಿಗನ್ನಡ";

const COLORS = {
  paper: "#fbf6ea",
  accent: "#b3122b",
  accentSoft: "#f8e3e6",
  gold: "#e8a317",
  ink: "#1c1917",
  secondary: "#57534e",
  muted: "#8a8580",
} as const;

/** Text-health categories that mean the source text is corrupt (Nudi/Baraha, mojibake, junk). */
const REFUSE_CATEGORIES = new Set(["legacy", "encoding", "invisible"]);

export interface ShareCardInput {
  kind: ShareKind;
  /** The largest line on the card — the word / proverb / verse itself. */
  main: string;
  /** Supporting text: a gloss, meaning, or attribution. Wraps to `supportMaxLines`. */
  support?: string;
  /** How many wrapped lines `support` may fill (default 6, room permitting). */
  supportMaxLines?: number;
  /** Absolute URL printed in the footer and carried in the caption/copy-link. */
  url: string;
  /** Optional provenance micro-line (Alar · V. Krishna / a book title / Wikiquote). */
  source?: string;
  size: ShareSize;
}

export class ShareCardError extends Error {}

/** NFC-normalises `main`; throws `ShareCardError` if empty or text-health flags legacy/mojibake/invisible damage. */
export function assertShareable(main: string): string {
  const text = (main ?? "").normalize("NFC").trim();
  if (text === "") throw new ShareCardError("empty main text");
  const findings = analyseTextHealth(text).findings;
  if (findings.some((f) => REFUSE_CATEGORIES.has(f.category))) {
    throw new ShareCardError("main text failed text-health");
  }
  return text;
}

/** Human-readable footer link: drop the scheme and `www.`, and decode `%E0%B2…` back to Kannada. */
export function displayUrl(url: string): string {
  const bare = url.replace(/^https?:\/\/(www\.)?/, "");
  try {
    return decodeURI(bare);
  } catch {
    return bare;
  }
}

/** The caption offered alongside the image. */
export function buildCaption(input: ShareCardInput): string {
  const main = input.main.normalize("NFC").trim();
  const first = input.support ? `${main} — ${input.support}` : main;
  return [first, `${KIND_LABEL[input.kind]} · ${BRAND}`, input.url, "", "#ಸಿರಿಗನ್ನಡ #ಕನ್ನಡ #Kannada #sirigannada"].join("\n");
}

/** Paints `first` then `second` immediately after it in a different colour — the wordmark/footer split. */
function fillSplitText(ctx: CanvasRenderingContext2D, first: string, second: string, x: number, y: number, firstColor: string, secondColor: string): void {
  ctx.fillStyle = firstColor;
  ctx.fillText(first, x, y);
  ctx.fillStyle = secondColor;
  ctx.fillText(second, x + ctx.measureText(first).width, y);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    return;
  }
  ctx.fillRect(x, y, w, h);
}

/** Largest serif size (of a few candidates) whose wrap fits <=4 lines, measured per candidate, else the smallest. */
function fitMainText(
  ctx: CanvasRenderingContext2D,
  measure: MeasureFn,
  serif: string,
  text: string,
  maxWidth: number,
  size: ShareSize,
): { fontSize: number; lines: string[] } {
  const candidates = size === "portrait" ? [78, 62, 50] : [72, 58, 48];
  for (const fontSize of candidates) {
    ctx.font = `600 ${fontSize}px ${serif}`;
    const wrapped = wrapParagraphs(measure, text, maxWidth);
    if (wrapped.length <= 4 || fontSize === candidates[candidates.length - 1]) {
      return { fontSize, lines: truncateLines(wrapped, 8) };
    }
  }
  return { fontSize: candidates[0]!, lines: [] };
}

export interface CardFonts {
  serif: string;
  sans: string;
}

/** Paints the whole card onto an already-sized context. */
export function paintShareCard(ctx: CanvasRenderingContext2D, input: ShareCardInput, fonts: CardFonts): void {
  const { w, h } = SHARE_SIZES[input.size];
  const pad = 84;
  const maxWidth = w - pad * 2;
  const { serif, sans } = fonts;
  const main = assertShareable(input.main);

  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `600 44px ${sans}`;
  // Wordmark in the Karnataka flag colours, matching the footer: ಸಿರಿ gold, ಗನ್ನಡ red.
  fillSplitText(ctx, "ಸಿರಿ", BRAND.slice(2), pad, pad + 40, COLORS.gold, COLORS.accent);

  const chipLabel = KIND_LABEL[input.kind];
  ctx.font = `600 28px ${sans}`;
  const chipW = ctx.measureText(chipLabel).width + 48;
  const chipY = pad + 70;
  ctx.fillStyle = COLORS.accentSoft;
  roundRect(ctx, pad, chipY, chipW, 52, 26);
  ctx.fillStyle = COLORS.accent;
  ctx.fillText(chipLabel, pad + 24, chipY + 35);

  ctx.fillStyle = COLORS.ink;
  const measure: MeasureFn = (s) => ctx.measureText(s).width;
  const { fontSize, lines } = fitMainText(ctx, measure, serif, truncateText(main, 360), maxWidth, input.size);
  const lineHeight = Math.round(fontSize * 1.42);

  // Wrap the support text (sans font) before positioning so a multi-line block
  // (a word card lists every sense) is centred with the headword, not overflowed.
  const supportLineHeight = 42;
  const supportGap = 44;
  ctx.font = `500 30px ${sans}`;
  const supportMax = Math.max(1, input.supportMaxLines ?? 6);
  const wrappedSupport = input.support ? wrapParagraphs(measure, input.support, maxWidth) : [];
  const provisionalCount = Math.min(wrappedSupport.length, supportMax);

  ctx.font = `600 ${fontSize}px ${serif}`;
  const freeTop = chipY + 96;
  const freeBottom = h - 190;
  const supportBlock = provisionalCount ? supportGap + provisionalCount * supportLineHeight : 0;
  const blockHeight = lines.length * lineHeight + supportBlock;
  // Centre the whole block (headword + senses) vertically between the chip and the footer.
  const top = freeTop + Math.max(0, (freeBottom - freeTop - blockHeight) / 2) + fontSize;
  lines.forEach((line, i) => ctx.fillText(line, pad, top + i * lineHeight));

  if (wrappedSupport.length) {
    const supportTop = top + (lines.length - 1) * lineHeight + supportGap + 24;
    // Re-cap by whatever room is actually left above the gold rule — truncateLines adds the
    // ellipsis whichever limit (supportMax or available room) ends up tighter.
    const roomLines = Math.max(1, Math.floor((h - 200 - supportTop) / supportLineHeight) + 1);
    const supportLines = truncateLines(wrappedSupport, Math.min(supportMax, roomLines));
    ctx.font = `500 30px ${sans}`;
    ctx.fillStyle = COLORS.secondary;
    supportLines.forEach((line, i) => ctx.fillText(line, pad, supportTop + i * supportLineHeight));
  }

  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(pad, h - 150, 60, 4);

  if (input.source) {
    ctx.font = `400 22px ${sans}`;
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(truncateText(input.source, 90), pad, h - 118);
  }

  // Footer: the real link at bottom-left, the site mark bottom-right in the
  // Karnataka flag's yellow-over-red (here left-to-right: "siri" gold, "gannada.in" red).
  const footY = h - 80;
  ctx.font = `500 26px ${sans}`;
  ctx.fillStyle = COLORS.secondary;
  ctx.textAlign = "left";
  ctx.fillText(truncateText(displayUrl(input.url), 46), pad, footY);

  ctx.font = `600 26px ${sans}`;
  const goldW = ctx.measureText("siri").width;
  const markX = w - pad - goldW - ctx.measureText("gannada.in").width;
  fillSplitText(ctx, "siri", "gannada.in", markX, footY, COLORS.gold, COLORS.accent);
}

/** Resolves the next/font `--font-*` variable behind a CSS-variable name to a real family string. */
function cssFontFamily(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

/** Browser-only: loads the real fonts and paints the card. Not unit-tested (jsdom has no canvas). */
export async function renderShareCard(canvas: HTMLCanvasElement, input: ShareCardInput): Promise<void> {
  const { w, h } = SHARE_SIZES[input.size];
  canvas.width = w;
  canvas.height = h;
  const fonts: CardFonts = {
    serif: cssFontFamily("--font-noto-serif", "serif"),
    sans: cssFontFamily("--font-anek", "sans-serif"),
  };
  try {
    await Promise.all([
      document.fonts.load(`600 78px ${fonts.serif}`),
      document.fonts.load(`600 44px ${fonts.sans}`),
      document.fonts.load(`500 26px ${fonts.sans}`),
    ]);
  } catch {
    /* best-effort; canvas falls back to the fallback stack */
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  paintShareCard(ctx, input, fonts);
}
