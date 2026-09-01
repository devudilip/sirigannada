import type { DictEntry, PartOfSpeech } from "../../src/lib/types";
import { codePointLength, isJunkDefinition, isJunkHeadword, isOldPVerb } from "./dailyFilters";

/** Number of "word of the day" slots: one per day of a leap year. */
export const DAILY_COUNT = 366;

const MIN_CODE_POINTS = 3;
const MAX_CODE_POINTS = 8;
const MAX_DEFS = 24;
const FAMILY_CAP = 40;
const ALLOWED_POS = new Set<PartOfSpeech>(["noun", "verb", "adjective"]);
const COMPOUND_END =
  /(?:ಗೆಡು|ಗೊಡು|ತೆಗೆ|ಹೋಗು|ಏಳು|ಪಡು|ಗಟ್ಟು|ಗೈ|ಗೊಳು|ಕೊಳು|ಿಡು|ಇಡು|ಾಗು|ಆಗು)$/;
const ABSTRACT_NOUN = /(?:ತ್ವ|ತೆ)$/;

function firstPos(entry: DictEntry): PartOfSpeech {
  return entry.defs[0]!.pos;
}

/** True if the entry is a short, everyday, well-transcribed word suitable for display. */
export function isDailyCandidate(entry: DictEntry): boolean {
  const len = codePointLength(entry.word);
  if (len < MIN_CODE_POINTS || len > MAX_CODE_POINTS) return false;
  if (isJunkHeadword(entry.word)) return false;
  if (!entry.phone) return false;
  if (entry.defs.length < 1 || entry.defs.length > MAX_DEFS) return false;
  if (!entry.defs.every((d) => ALLOWED_POS.has(d.pos))) return false;
  if (isOldPVerb(entry.word, firstPos(entry))) return false;
  return !isJunkDefinition(entry.defs[0]!.text);
}

function lowerBound(words: string[], target: string): number {
  let lo = 0;
  let hi = words.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (words[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const CONSONANT = /[\u0C95-\u0CB9]/;
const FINISHED = /[ೆೇೊೋುೂಂ]$/;

function isCompoundChild(prefix: string, longer: string): boolean {
  const a = [...prefix];
  const b = [...longer];
  if (b.length <= a.length) return false;
  return CONSONANT.test(b[a.length]!);
}

/** Compound-family size: other headwords that continue with a consonant (capped). */
export function familySizes(entries: DictEntry[]): Map<number, number> {
  const words = entries.map((e) => e.word).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const sizes = new Map<number, number>();
  for (const e of entries) {
    if (codePointLength(e.word) < 3) {
      sizes.set(e.id, 0);
      continue;
    }
    let n = 0;
    for (let i = lowerBound(words, e.word); i < words.length; i++) {
      const w = words[i]!;
      if (!w.startsWith(e.word)) break;
      if (isCompoundChild(e.word, w)) {
        n++;
        if (n >= FAMILY_CAP) break;
      }
    }
    sizes.set(e.id, n);
  }
  return sizes;
}

function uniqueByWord(entries: DictEntry[]): DictEntry[] {
  const seen = new Set<string>();
  const out: DictEntry[] = [];
  for (const e of entries) {
    if (seen.has(e.word)) continue;
    seen.add(e.word);
    out.push(e);
  }
  return out;
}

function score(entry: DictEntry, family: number): number {
  const len = codePointLength(entry.word);
  const cap = len >= 4 ? FAMILY_CAP : 8;
  let s = Math.min(entry.defs.length, 4) + Math.min(family, cap) + Math.min(len, 6);
  if (FINISHED.test(entry.word)) s += 3;
  if (entry.word.endsWith("ಿಸು")) s -= 2;
  if (len >= 5 && COMPOUND_END.test(entry.word)) s -= 3;
  if (len >= 5 && firstPos(entry) === "noun" && ABSTRACT_NOUN.test(entry.word)) s -= 2;
  return s;
}

function bestInWindow(window: DictEntry[], sc: (e: DictEntry) => number): DictEntry | undefined {
  let best = window[0];
  if (!best) return undefined;
  for (let i = 1; i < window.length; i++) {
    const e = window[i];
    if (e && sc(e) > sc(best)) best = e;
  }
  return best;
}

function windowPick(sorted: DictEntry[], quota: number, sc: (e: DictEntry) => number): DictEntry[] {
  if (sorted.length <= quota) return sorted.slice();
  const step = Math.floor(sorted.length / quota);
  const out: DictEntry[] = [];
  for (let i = 0; out.length < quota; i += step) {
    const picked = bestInWindow(sorted.slice(i, i + step), sc);
    if (picked) out.push(picked);
  }
  return out;
}

export function stratumQuotas(total: number): { noun: number; adjective: number; verb: number } {
  const noun = Math.round(total * 0.6);
  const adjective = Math.round(total * 0.2);
  return { noun, adjective, verb: total - noun - adjective };
}

/**
 * Pick `total` entries at 60/20/20 noun/adjective/verb, windowed within each
 * stratum, then merge and sort. Short strata are topped up from leftover nouns.
 */
export function pickStratified(
  candidates: DictEntry[],
  compare: (a: string, b: string) => number,
  families: Map<number, number>,
  total: number,
): DictEntry[] {
  const sc = (e: DictEntry): number => score(e, families.get(e.id) ?? 0);
  const byPos = (pos: PartOfSpeech): DictEntry[] =>
    candidates.filter((e) => firstPos(e) === pos).sort((a, b) => compare(a.word, b.word) || a.id - b.id);
  const q = stratumQuotas(total);
  const nouns = byPos("noun");
  const adjs = byPos("adjective");
  const verbs = byPos("verb");
  const pickedNouns = windowPick(nouns, q.noun, sc);
  const pickedAdjs = windowPick(adjs, q.adjective, sc);
  const pickedVerbs = windowPick(verbs, q.verb, sc);
  const used = new Set([...pickedNouns, ...pickedAdjs, ...pickedVerbs].map((e) => e.id));
  let missing = total - used.size;
  if (missing > 0) {
    const extra = windowPick(
      nouns.filter((e) => !used.has(e.id)),
      missing,
      sc,
    );
    for (const e of extra) {
      pickedNouns.push(e);
      used.add(e.id);
    }
    missing = total - used.size;
  }
  if (missing > 0) {
    throw new Error(`only ${used.size} stratified daily-word picks, need ${total}`);
  }
  return [...pickedNouns, ...pickedAdjs, ...pickedVerbs].sort((a, b) => compare(a.word, b.word) || a.id - b.id);
}

/**
 * Filter candidates, score by family size, then pick a 60/20/20 POS mix spread
 * through the alphabet. Fully deterministic.
 */
export function selectDaily(entries: DictEntry[], compare: (a: string, b: string) => number): DictEntry[] {
  const candidates = uniqueByWord(
    entries.filter(isDailyCandidate).sort((a, b) => compare(a.word, b.word) || a.id - b.id),
  );
  if (candidates.length < DAILY_COUNT) {
    throw new Error(`only ${candidates.length} daily-word candidates, need ${DAILY_COUNT}`);
  }
  return pickStratified(candidates, compare, familySizes(entries), DAILY_COUNT);
}
