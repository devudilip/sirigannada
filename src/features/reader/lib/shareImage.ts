/**
 * Canvas rendering for "share verse as image" (B-03). Colours are the light-theme values from
 * `src/styles/tokens.css` — canvas fill styles can't read CSS custom properties, so they are
 * copied here literally. Keep in sync if the tokens ever change.
 */

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;
const PADDING = 96;
const FRAME_INSET = 24;
const MAX_VERSE_CHARS = 480;
const MAX_VERSE_LINES = 9;
const VERSE_FONT_SIZE = 46;
const VERSE_LINE_HEIGHT = 68;
const ATTRIBUTION_FONT_SIZE = 26;
const ATTRIBUTION_LINE_HEIGHT = 38;
const BRAND_FONT_SIZE = 30;

const COLORS = {
  paper: "#fbf6ea",
  border: "#e7e0d2",
  accent: "#b3122b",
  gold: "#e8a317",
  text: "#1c1917",
  textSecondary: "#57534e",
} as const;

export interface VerseImageInput {
  verseText: string;
  brandName: string;
  attributionLines: string[];
  serifFontFamily: string;
  sansFontFamily: string;
}

/** Measures the pixel width of a string. A thin seam so the wrapper below can be unit-tested. */
export type MeasureFn = (text: string) => number;

/** Caps a block's text before wrapping, so a stray long paragraph can't blow past the canvas. */
export function truncateText(text: string, maxChars = MAX_VERSE_CHARS): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars).trimEnd()}…`;
}

/**
 * Wraps text to `maxWidth`, breaking only at spaces (never mid-word, so a Kannada conjunct
 * cluster is never split) and respecting existing "\n" line breaks within a block.
 */
export function wrapParagraphs(measure: MeasureFn, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(" ").filter((w) => w.length > 0);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = words[0] as string;
    for (const word of words.slice(1)) {
      const attempt = `${current} ${word}`;
      if (measure(attempt) <= maxWidth) current = attempt;
      else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }
  return lines;
}

/** Caps a wrapped line list to `maxLines`, ellipsizing the last kept line when lines were cut. */
export function truncateLines(lines: string[], maxLines: number): string[] {
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  const last = (kept[maxLines - 1] ?? "").replace(/…+$/, "").trimEnd();
  kept[maxLines - 1] = `${last}…`;
  return kept;
}

/** Four short lines keep title, creator, licence, and a resolvable passage URL legible. */
export function attributionLines(title: string, author: string, licenseLine: string, passageUrl: string): string[] {
  return [title, author, licenseLine, passageUrl];
}

/** Text accompanying a native image share, including both the passage and original source. */
export function passageShareText(
  title: string,
  author: string,
  licenseLine: string,
  passageUrl: string,
  sourceLabel: string,
  sourceUrl: string,
): string {
  return [`${title} — ${author}`, licenseLine, passageUrl, `${sourceLabel}: ${sourceUrl}`].join("\n");
}

/** Paints the frame, verse text, and attribution onto an already-sized 2D context. */
export function paintVerseImage(ctx: CanvasRenderingContext2D, input: VerseImageInput): void {
  const { verseText, brandName, attributionLines: attrib, serifFontFamily, sansFontFamily } = input;
  const maxWidth = CANVAS_WIDTH - PADDING * 2;

  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(FRAME_INSET, FRAME_INSET, CANVAS_WIDTH - FRAME_INSET * 2, CANVAS_HEIGHT - FRAME_INSET * 2);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLORS.accent;
  ctx.font = `600 ${BRAND_FONT_SIZE}px ${sansFontFamily}`;
  ctx.fillText(brandName, PADDING, 100);
  ctx.fillRect(PADDING, 124, maxWidth, 4);

  ctx.font = `500 ${VERSE_FONT_SIZE}px ${serifFontFamily}`;
  ctx.fillStyle = COLORS.text;
  const measure: MeasureFn = (s) => ctx.measureText(s).width;
  const lines = truncateLines(wrapParagraphs(measure, truncateText(verseText), maxWidth), MAX_VERSE_LINES);
  const verseHeight = lines.length * VERSE_LINE_HEIGHT;
  const verseTop = Math.max(320, (CANVAS_HEIGHT - verseHeight) / 2 - 40);
  lines.forEach((line, i) => ctx.fillText(line, PADDING, verseTop + i * VERSE_LINE_HEIGHT));

  const dividerY = CANVAS_HEIGHT - 200;
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(PADDING, dividerY, 64, 4);

  ctx.font = `500 ${ATTRIBUTION_FONT_SIZE}px ${sansFontFamily}`;
  ctx.fillStyle = COLORS.textSecondary;
  attrib.forEach((line, i) => ctx.fillText(line, PADDING, dividerY + 44 + i * ATTRIBUTION_LINE_HEIGHT));
}

/** Resolves the actual (next/font-generated) font-family strings behind the app's CSS variables. */
function cssFontFamily(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value || fallback;
}

/**
 * Loads the real fonts (canvas text ignores page fonts otherwise) and paints the image.
 * Browser-only; not covered by unit tests (jsdom has no real canvas 2D rendering).
 */
export async function renderVerseImage(canvas: HTMLCanvasElement, input: Omit<VerseImageInput, "serifFontFamily" | "sansFontFamily">): Promise<void> {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const serifFontFamily = cssFontFamily("--font-noto-serif", "serif");
  const sansFontFamily = cssFontFamily("--font-anek", "sans-serif");
  try {
    await Promise.all([
      document.fonts.load(`500 ${VERSE_FONT_SIZE}px ${serifFontFamily}`),
      document.fonts.load(`600 ${BRAND_FONT_SIZE}px ${sansFontFamily}`),
      document.fonts.load(`500 ${ATTRIBUTION_FONT_SIZE}px ${sansFontFamily}`),
    ]);
  } catch {
    /* font loading is best-effort; canvas falls back to the fallback stack */
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  paintVerseImage(ctx, { ...input, serifFontFamily, sansFontFamily });
}

/** `canvas.toBlob` as a promise. */
export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
}

/** Same download-a-blob pattern as `exportFile.ts#downloadJson`, adapted for a PNG blob. */
export function downloadPng(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
