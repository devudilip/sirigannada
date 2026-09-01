import type { DictEntry, DictShard } from "@/lib/types";
import { hasKannada, latinToKannada, normalise, phoneticKey, shardKey, siblingLetters } from "@/lib/kannada";
import { loadReverse, loadShard } from "./data";

export interface SearchResult {
  entry: DictEntry;
  /** Why it matched — drives ordering and a subtle label in the UI. */
  match: "exact" | "prefix" | "phonetic" | "english";
}

const LIMIT = 60;

/**
 * Kannada query: exact → prefix within the query's own shard, then phonetic matches across
 * every shard whose first letter sounds the same (ಸಾಲೆ also finds ಶಾಲೆ).
 */
async function searchKannada(q: string): Promise<SearchResult[]> {
  const own = shardKey(q);
  const letters = own === "_" ? [own] : siblingLetters(own);
  const shards = (await Promise.all(letters.map((l) => loadShard(l)))).filter((s): s is DictShard => s !== null);
  const shard = shards.find((s) => s.akshara === own);
  if (!shard) return [];
  const key = phoneticKey(q);
  const out: SearchResult[] = [];
  const seen = new Set<number>();
  const push = (entry: DictEntry, match: SearchResult["match"]) => {
    if (seen.has(entry.id) || out.length >= LIMIT) return;
    seen.add(entry.id);
    out.push({ entry, match });
  };
  for (const e of shard.entries) if (e.word === q) push(e, "exact");
  for (const e of shard.entries) if (e.word.startsWith(q)) push(e, "prefix");
  for (const s of shards) for (const e of s.entries) if (e.key.startsWith(key)) push(e, "phonetic");
  return out;
}

/** English query: look up tokens in the reverse index, then resolve entries from their shards. */
async function searchEnglish(q: string): Promise<SearchResult[]> {
  const token = q.toLowerCase().replace(/[^a-z]/g, "");
  if (token.length < 2) return [];
  const rev = await loadReverse(token[0] ?? "");
  if (!rev) return [];

  const pairs: Array<[number, string]> = [];
  const exact = rev.index[token];
  if (exact) pairs.push(...exact);
  for (const [k, v] of Object.entries(rev.index)) {
    if (pairs.length >= LIMIT) break;
    if (k !== token && k.startsWith(token)) pairs.push(...v);
  }

  const byShard = new Map<string, number[]>();
  const seen = new Set<number>();
  for (const [id, word] of pairs.slice(0, LIMIT)) {
    if (seen.has(id)) continue;
    seen.add(id);
    const s = shardKey(word);
    byShard.set(s, [...(byShard.get(s) ?? []), id]);
  }

  const shards = await Promise.all([...byShard.keys()].map((s) => loadShard(s)));
  const out: SearchResult[] = [];
  for (const shard of shards) {
    if (!shard) continue;
    const wanted = new Set(byShard.get(shard.akshara) ?? []);
    for (const e of shard.entries) if (wanted.has(e.id)) out.push({ entry: e, match: "english" });
  }
  // Entries whose definitions start with the token are usually the best sense; keep source order otherwise.
  return out.sort((a, b) => rank(a.entry, token) - rank(b.entry, token));
}

function rank(e: DictEntry, token: string): number {
  return e.defs.some((d) => d.text.toLowerCase().startsWith(token)) ? 0 : 1;
}

/**
 * Unified search. Kannada input searches Kannada headwords. Latin input is tried both as a
 * phonetic transliteration (typing "mane" finds ಮನೆ) and as an English word (finds ಮನೆ under "house").
 */
export async function search(raw: string): Promise<SearchResult[]> {
  const q = normalise(raw);
  if (!q) return [];
  if (hasKannada(q)) return searchKannada(q);

  const kn = latinToKannada(q);
  const [viaTranslit, viaEnglish] = await Promise.all([
    kn ? searchKannada(kn) : Promise.resolve([]),
    searchEnglish(q),
  ]);
  const seen = new Set<number>();
  const merged: SearchResult[] = [];
  for (const r of [...viaTranslit, ...viaEnglish]) {
    if (seen.has(r.entry.id)) continue;
    seen.add(r.entry.id);
    merged.push(r);
    if (merged.length >= LIMIT) break;
  }
  return merged;
}

/**
 * Look up a word tapped inside a book. Tries the exact form, then strips common
 * inflectional suffixes, then falls back to a phonetic match. Returns the best entry or null.
 */
const SUFFIXES = [
  "ಗಳನ್ನು", "ಗಳಲ್ಲಿ", "ಗಳಿಗೆ", "ಗಳ", "ಗಳು", "ವನ್ನು", "ಯನ್ನು", "ನನ್ನು", "ದಲ್ಲಿ", "ಯಲ್ಲಿ", "ನಲ್ಲಿ",
  "ದಿಂದ", "ಯಿಂದ", "ನಿಂದ", "ಕ್ಕೆ", "ಗೆ", "ಿಗೆ", "ವು", "ನು", "ಯು", "ದ", "ಯ", "ನ", "ವ", "ಗಳೆ",
];

export async function lookupInflected(raw: string): Promise<DictEntry | null> {
  const word = normalise(raw).replace(/[^\u0C80-\u0CFF]/g, "");
  if (!word) return null;
  const shard = await loadShard(shardKey(word));
  if (!shard) return null;
  const exact = shard.entries.find((e) => e.word === word);
  if (exact) return exact;
  for (const suf of SUFFIXES) {
    if (word.endsWith(suf) && word.length - suf.length >= 2) {
      const stem = word.slice(0, -suf.length);
      const hit = shard.entries.find((e) => e.word === stem || e.word === stem + "ು" || e.word === stem + "ೆ");
      if (hit) return hit;
    }
  }
  const key = phoneticKey(word);
  return shard.entries.find((e) => e.key === key) ?? null;
}
