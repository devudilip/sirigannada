/**
 * Shared canvas helpers for the "share as image" card (S-01): text capping, word-boundary
 * wrapping, and the blob/download plumbing. The card renderer lives in
 * `src/features/share/lib/shareCard.ts` and reuses these rather than duplicating them.
 */

const MAX_VERSE_CHARS = 480;

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
