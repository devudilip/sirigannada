import { hasKannada, latinToKannada, normalise, phoneticKey, shardKey, siblingLetters } from "@/lib/kannada";
import { loadShard } from "./data";

const LIMIT = 8;

/** Kannada form used for matching: the query itself, or a Latin transliteration. */
export function suggestionQuery(raw: string): string {
  const q = normalise(raw);
  if (!q) return "";
  if (hasKannada(q)) return q;
  const kn = latinToKannada(q);
  return kn || q;
}

/** True when a and b differ by exactly one code-point insert, delete, or substitute. */
export function isEditDistance1(a: string, b: string): boolean {
  if (a === b) return false;
  const A = [...a];
  const B = [...b];
  const n = A.length;
  const m = B.length;
  if (Math.abs(n - m) > 1) return false;
  if (n === m) {
    let diffs = 0;
    for (let i = 0; i < n; i++) if (A[i] !== B[i] && ++diffs > 1) return false;
    return diffs === 1;
  }
  const shorter = n < m ? A : B;
  const longer = n < m ? B : A;
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i += 1;
      j += 1;
      continue;
    }
    if (skipped) return false;
    skipped = true;
    j += 1;
  }
  return true;
}

/**
 * Headwords the user may have meant: same phonetic key (ಶಾಲೆ↔ಸಾಲೆ), then
 * edit-distance 1 (ಮನಿ→ಮನೆ). Query itself is never returned.
 */
export function suggestHeadwords(query: string, headwords: readonly string[], limit = LIMIT): string[] {
  const q = suggestionQuery(query);
  if (!q) return [];
  const qKey = phoneticKey(q);
  const phonetic: string[] = [];
  const substitutions: string[] = [];
  const indels: string[] = [];
  const qLen = [...q].length;
  const seen = new Set<string>([q, normalise(query)]);
  for (const word of headwords) {
    if (seen.has(word)) continue;
    if (phoneticKey(word) === qKey) {
      seen.add(word);
      phonetic.push(word);
    } else if (isEditDistance1(q, word)) {
      seen.add(word);
      if ([...word].length === qLen) substitutions.push(word);
      else indels.push(word);
    }
  }
  return [...phonetic, ...substitutions, ...indels].slice(0, limit);
}

/** Own shard plus phonetic-sibling shards — enough for both suggestion kinds. */
export async function suggestionsFor(query: string): Promise<string[]> {
  const q = suggestionQuery(query);
  if (!q || !hasKannada(q)) return [];
  const own = shardKey(q);
  const letters = own === "_" ? [own] : siblingLetters(own);
  const shards = await Promise.all(letters.map((letter) => loadShard(letter)));
  const headwords: string[] = [];
  for (const shard of shards) {
    if (!shard) continue;
    for (const entry of shard.entries) headwords.push(entry.word);
  }
  return suggestHeadwords(q, headwords);
}
