import type { DictEntry, PartOfSpeech } from "../../src/lib/types";

/** Number of "word of the day" slots: one per day of a leap year. */
export const DAILY_COUNT = 366;

const MIN_CODE_POINTS = 2;
const MAX_CODE_POINTS = 8;
const MAX_DEFS = 4;
const ALLOWED_POS = new Set<PartOfSpeech>(["noun", "verb", "adjective"]);
const EXCLUDED_MARKERS = ["(obsolete)", "archaic", "vulgar", "slang"];
const BAD_HEADWORD = /[\s\-A-Za-z0-9]/;

function codePointLength(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}

/** True if the entry is a short, everyday, well-transcribed word suitable for display. */
export function isDailyCandidate(entry: DictEntry): boolean {
  const len = codePointLength(entry.word);
  if (len < MIN_CODE_POINTS || len > MAX_CODE_POINTS) return false;
  if (BAD_HEADWORD.test(entry.word)) return false;
  if (!entry.phone) return false;
  if (entry.defs.length < 1 || entry.defs.length > MAX_DEFS) return false;
  if (!entry.defs.every((d) => ALLOWED_POS.has(d.pos))) return false;
  return !entry.defs.some((d) => {
    const text = d.text.toLowerCase();
    // "= ಇತರ ಪದ" is a bare cross-reference, not a definition worth showing on its own.
    return text.startsWith("=") || EXCLUDED_MARKERS.some((m) => text.includes(m));
  });
}

/**
 * Pick exactly DAILY_COUNT entries spread evenly through the alphabet: filter candidates,
 * sort by headword with the given collator, then take every floor(N / 366)-th one.
 * Fully deterministic — the same input always yields the same list.
 */
export function selectDaily(entries: DictEntry[], compare: (a: string, b: string) => number): DictEntry[] {
  const candidates = entries
    .filter(isDailyCandidate)
    .sort((a, b) => compare(a.word, b.word) || a.id - b.id);
  if (candidates.length < DAILY_COUNT) {
    throw new Error(`only ${candidates.length} daily-word candidates, need ${DAILY_COUNT}`);
  }
  const step = Math.floor(candidates.length / DAILY_COUNT);
  const out: DictEntry[] = [];
  for (let i = 0; out.length < DAILY_COUNT; i += step) {
    const e = candidates[i];
    if (e) out.push(e);
  }
  return out;
}
