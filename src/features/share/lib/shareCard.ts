/**
 * Reusable share-card renderer (S-01). One Canvas 2D painter drives every "share as image"
 * surface: a dictionary word, a proverb (gade), the daily word, and a library verse.
 *
 * Colours are the light-theme values from `src/styles/tokens.css`, copied literally because a
 * canvas fill style cannot read a CSS custom property. Keep in sync if the tokens change.
 *
 * The wrapping/measuring helpers and the blob/download plumbing are shared with the reader's
 * verse image (`features/reader/lib/shareImage.ts`) rather than duplicated.
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
const WATERMARK = "sirigannada.in";

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
  /** One supporting line: a gloss, meaning, or attribution. */
  support?: string;
  /** Absolute URL printed in the footer and caption (e.g. https://www.sirigannada.in/…). */
  url: string;
  /** Optional provenance micro-line (Alar · V. Krishna / a book title / Wikiquote). */
  source?: string;
  size: ShareSize;
}

export class ShareCardError extends Error {}

/**
 * NFC-normalises `main` and refuses (throws `ShareCardError`) when it is empty or the text-health
 * pass finds legacy-encoding, mojibake, or invisible-character damage. Returned string is what
 * the renderer should paint.
 */
export function assertShareable(main: string): string {
  const text = (main ?? "").normalize("NFC").trim();
  if (text === "") throw new ShareCardError("empty main text");
  const findings = analyseTextHealth(text).findings;
  if (findings.some((f) => REFUSE_CATEGORIES.has(f.category))) {
    throw new ShareCardError("main text failed text-health");
  }
  return text;
}

/** The caption offered alongside the image. */
export function buildCaption(input: ShareCardInput): string {
  const main = input.main.normalize("NFC").trim();
  const first = input.support ? `${main} — ${input.support}` : main;
  return [first, `${KIND_LABEL[input.kind]} · ${BRAND}`, input.url, "", "#ಸಿರಿಗನ್ನಡ #ಕನ್ನಡ #Kannada #sirigannada"].join("\n");
}

/** Human-readable footer URL: drop the scheme and `www.`, and decode `%E0%B2…` back to Kannada. */
export function displayUrl(url: string): string {
  const bare = url.replace(/^https?:\/\/(www\.)?/, "");
  try {
    return decodeURI(bare);
  } catch {
    return bare;
  }
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

function drawGhostWatermark(ctx: CanvasRenderingContext2D, w: number, h: number, sans: string): void {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 190px ${sans}`;
  ctx.translate(w / 2, h / 2);
  ctx.rotate((-18 * Math.PI) / 180);
  ctx.fillText(WATERMARK, 0, 0);
  ctx.restore();
}

function drawCornerWatermark(ctx: CanvasRenderingContext2D, w: number, h: number, sans: string): void {
  const inset = Math.round(w * 0.05);
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 24px ${sans}`;
  ctx.fillText(WATERMARK, w - inset, h - inset);
  ctx.restore();
}

/**
 * Picks the largest of a few serif sizes whose wrap fits in <= 4 lines (falls back to the
 * smallest), measuring at each real candidate size rather than guessing from one measurement.
 */
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

/**
 * Paints the whole card onto an already-sized context. Both watermarks are always drawn: the
 * ghost first (so the Kannada main text stays legible on top of it), the corner last.
 */
export function paintShareCard(ctx: CanvasRenderingContext2D, input: ShareCardInput, fonts: CardFonts): void {
  const { w, h } = SHARE_SIZES[input.size];
  const pad = 84;
  const maxWidth = w - pad * 2;
  const { serif, sans } = fonts;
  const main = assertShareable(input.main);

  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, w, h);
  drawGhostWatermark(ctx, w, h, sans);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 44px ${sans}`;
  ctx.fillText(BRAND, pad, pad + 40);

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
  ctx.font = `600 ${fontSize}px ${serif}`;

  const freeTop = chipY + 96;
  const freeBottom = h - 190;
  const blockHeight = lines.length * lineHeight;
  // Sit the block in the upper part of the free area, not dead-centre.
  const top = freeTop + Math.max(0, (freeBottom - freeTop - blockHeight) * 0.28) + fontSize;
  lines.forEach((line, i) => ctx.fillText(line, pad, top + i * lineHeight));

  const cursorY = top + (lines.length - 1) * lineHeight + 64;
  if (input.support) {
    ctx.font = `500 30px ${sans}`;
    ctx.fillStyle = COLORS.secondary;
    const support = truncateLines(wrapParagraphs(measure, input.support, maxWidth), 1)[0] ?? "";
    ctx.fillText(support, pad, Math.min(cursorY, h - 210));
  }

  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(pad, h - 150, 60, 4);

  if (input.source) {
    ctx.font = `400 22px ${sans}`;
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(truncateText(input.source, 90), pad, h - 118);
  }

  ctx.font = `500 26px ${sans}`;
  ctx.fillStyle = COLORS.secondary;
  ctx.fillText(truncateText(displayUrl(input.url), 72), pad, h - 80);

  drawCornerWatermark(ctx, w, h, sans);
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
