import type {
  TextHealthCategory,
  TextHealthExplanationKey,
  TextHealthFinding,
  TextHealthReport,
} from "../types";

const KANNADA = /[\u0C80-\u0CFF]/u;
const LATIN_RUN = /[A-Za-z]+/g;
const NUDI_MARK = /[ÀÁÄÆÉËÊÃï£ßð¥¤¢üª¨®¯±²µ¶¸¹º»¼½¬÷åä]/u;
const INVISIBLE = /[\u200B\u200C\u200D\u2060\uFEFF]/gu;
const REPEATED_SPACE = /[ \t]{2,}/g;
const EXTRA_BLANK_LINES = /\n{3,}/g;
const REPEATED_PUNCTUATION = /([!?;:,।॥])\1+/gu;
const REPEATED_FULL_STOP = /\.{4,}/g;
const ENCODING_MARKERS = /\uFFFD+|ï»¿|â€™|â€œ|â€|â€“|â€”|Ã©|Â /gu;
const MAX_INPUT_LENGTH = 100_000;
const MAX_FINDINGS = 200;

interface AddFinding {
  category: TextHealthCategory;
  explanationKey: TextHealthExplanationKey;
  start: number;
  end: number;
  replacement?: string;
  explanationData?: Readonly<Record<string, string | number>>;
}

export function analyseTextHealth(text: string): TextHealthReport {
  const inspectedText = text.slice(0, MAX_INPUT_LENGTH);
  const lineStarts = lineStartOffsets(inspectedText);
  const findings: TextHealthFinding[] = [];
  let truncated = inspectedText.length < text.length;
  const add = (finding: AddFinding) => {
    if (findings.length >= MAX_FINDINGS) {
      truncated = true;
      return;
    }
    const { start, end, category, explanationKey, explanationData, replacement } = finding;
    findings.push({
      id: `${category}:${explanationKey}:${start}:${end}`,
      category,
      explanationKey,
      explanationData,
      location: locate(start, end, lineStarts),
      excerpt: inspectedText.slice(start, end),
      ...(replacement === undefined ? {} : { replacement }),
    });
  };

  detectNonNfc(inspectedText, add);
  detectLegacyTokens(inspectedText, add);
  detectMixedLatin(inspectedText, add);
  detectMatches(inspectedText, INVISIBLE, add, "invisible", "invisibleCharacter", undefined, (value) => ({
    character: codePointLabel(value),
  }));
  detectMatches(inspectedText, REPEATED_SPACE, add, "spacing", "repeatedWhitespace");
  detectMatches(inspectedText, EXTRA_BLANK_LINES, add, "spacing", "extraBlankLines");
  detectRepeatedPunctuation(inspectedText, add);
  detectMatches(inspectedText, ENCODING_MARKERS, add, "encoding", "encodingMarker");
  detectKnownConversionDamage(inspectedText, add);

  findings.sort((a, b) => a.location.start - b.location.start || a.location.end - b.location.end);
  return { findings, truncated };
}

function detectNonNfc(text: string, add: (finding: AddFinding) => void): void {
  let start = 0;
  for (const line of text.split("\n")) {
    const normalized = line.normalize("NFC");
    if (line !== normalized) {
      add({ category: "normalization", explanationKey: "nonNfc", start, end: start + line.length, replacement: normalized });
    }
    start += line.length + 1;
  }
}

function detectLegacyTokens(text: string, add: (finding: AddFinding) => void): void {
  for (const match of text.matchAll(/\S+/gu)) {
    const token = match[0];
    const markerCount = [...token].filter((character) => NUDI_MARK.test(character)).length;
    if (markerCount < 2) continue;
    const start = match.index;
    add({ category: "legacy", explanationKey: "legacyNudi", start, end: start + token.length });
  }
}

function detectMixedLatin(text: string, add: (finding: AddFinding) => void): void {
  for (const match of text.matchAll(LATIN_RUN)) {
    const value = match[0];
    const start = match.index;
    const previous = text.at(start - 1) ?? "";
    const next = text.at(start + value.length) ?? "";
    if (!KANNADA.test(previous) && !KANNADA.test(next)) continue;
    const matra = value.length === 1 && KANNADA.test(previous) ? ({ s: "ೆ", S: "ೇ" } as const)[value as "s" | "S"] : undefined;
    add({
      category: "legacy",
      explanationKey: matra ? "latinMatraLeak" : "mixedLatin",
      start,
      end: start + value.length,
      ...(matra ? { explanationData: { likelyReplacement: matra } } : {}),
    });
  }
}

function detectRepeatedPunctuation(text: string, add: (finding: AddFinding) => void): void {
  detectMatches(text, REPEATED_PUNCTUATION, add, "punctuation", "repeatedPunctuation");
  detectMatches(text, REPEATED_FULL_STOP, add, "punctuation", "repeatedPunctuation");
}

function detectKnownConversionDamage(text: string, add: (finding: AddFinding) => void): void {
  const patterns = [/ದ್ಥ/gu, /ಬ್ಥ/gu, /ಮತ್ರ್ಯ/gu, /ಸ್ಧ/gu, /ಷ[\u0CBE-\u0CCC]?\*/gu, /[\u0CBE-\u0CCC]\u0CC1/gu];
  for (const pattern of patterns) {
    detectMatches(text, pattern, add, "encoding", "legacyConversionDamage");
  }
  detectMatches(text, /(?<=[\u0C80-\u0CFF])[—–]\n(?=[\u0C80-\u0CFF])/gu, add, "encoding", "brokenLineWrap");
}

function detectMatches(
  text: string,
  pattern: RegExp,
  add: (finding: AddFinding) => void,
  category: TextHealthCategory,
  explanationKey: TextHealthExplanationKey,
  replacement?: string | ((value: string) => string),
  data?: (value: string) => Readonly<Record<string, string | number>>,
): void {
  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const start = match.index;
    add({
      category, explanationKey, start, end: start + value.length,
      ...(replacement === undefined ? {} : { replacement: typeof replacement === "function" ? replacement(value) : replacement }),
      ...(data ? { explanationData: data(value) } : {}),
    });
  }
}

function lineStartOffsets(text: string): number[] {
  const starts = [0];
  for (let index = text.indexOf("\n"); index >= 0; index = text.indexOf("\n", index + 1)) {
    starts.push(index + 1);
  }
  return starts;
}

function locate(start: number, end: number, lineStarts: readonly number[]) {
  let low = 0;
  let high = lineStarts.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if ((lineStarts[middle] ?? 0) <= start) low = middle + 1;
    else high = middle;
  }
  const lineIndex = Math.max(0, low - 1);
  return {
    start,
    end,
    line: lineIndex + 1,
    column: start - (lineStarts[lineIndex] ?? 0) + 1,
  };
}

function codePointLabel(value: string): string {
  const codePoint = value.codePointAt(0) ?? 0;
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
}
