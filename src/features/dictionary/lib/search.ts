import type { DictEntry, DictShard } from "@/lib/types";
import { hasKannada, latinToKannada, normalise, phoneticKey, secondCharKey, shardKey, siblingLetters } from "@/lib/kannada";
import { loadReverse, loadShardForWord, loadShardsForLetter } from "./data";
import { inflectionStems } from "./inflection";

/** The two-character key `loadShardForWord` resolves a sub-shard by — see shardResolve.ts. */
function ownShardKey(word: string): string {
  return shardKey(word) + secondCharKey(word);
}

/**
 * Most inflection stems share the original word's own two-letter shard key: they're just that
 * word with a suffix stripped, so the same prefix, so the same (sub-)shard. A hand-curated
 * irregular-verb root (e.g. ಬಂದಳು → ಬರು) is a genuinely different word, not a stripped prefix,
 * and can land in a different split sub-shard than the query — fetch those directly rather than
 * silently missing them.
 */
async function loadDivergentStemShards(stems: readonly string[], ownKey: string): Promise<DictShard[]> {
  const divergent = [...new Set(stems.filter((s) => ownShardKey(s) !== ownKey))];
  const shards = await Promise.all(divergent.map((s) => loadShardForWord(s)));
  return shards.filter((s): s is DictShard => s !== null);
}

export interface SearchResult {
  entry: DictEntry;
  /** Why it matched — drives ordering and a subtle label in the UI. */
  match: "exact" | "prefix" | "phonetic" | "english" | "inflected";
}

const LIMIT = 60;

/**
 * Kannada query: exact → prefix within the query's own shard(s), then phonetic matches across
 * every shard whose first letter sounds the same (ಸಾಲೆ also finds ಶಾಲೆ).
 *
 * An oversized letter (ಕ, ಅ, ಪ…) is split by second akshara at build time (Q-08). For a query
 * of 2+ characters we know its second akshara too, so `loadShardForWord` fetches only the one
 * small sub-shard that can contain it — the whole point of the split. A 1-character query can't
 * disambiguate a sub-shard (any second akshara would still match as a prefix), so it falls back
 * to `loadShardsForLetter`, which loads every sub-shard for that letter; this is rare in
 * practice and only as slow as the pre-split behaviour was for every query.
 */
async function searchKannada(q: string): Promise<SearchResult[]> {
  const own = shardKey(q);
  const siblings = own === "_" ? [] : siblingLetters(own).filter((l) => l !== own);
  const qLen = [...q].length;
  const [ownShards, siblingShardLists] = await Promise.all([
    own === "_" || qLen <= 1 ? loadShardsForLetter(own) : loadShardForWord(q).then((s) => (s ? [s] : [])),
    Promise.all(siblings.map((l) => loadShardsForLetter(l))),
  ]);
  if (ownShards.length === 0) return [];
  const shards = [...ownShards, ...siblingShardLists.flat()];
  const key = phoneticKey(q);
  const out: SearchResult[] = [];
  const seen = new Set<number>();
  const push = (entry: DictEntry, match: SearchResult["match"]) => {
    if (seen.has(entry.id) || out.length >= LIMIT) return;
    seen.add(entry.id);
    out.push({ entry, match });
  };
  for (const shard of ownShards) for (const e of shard.entries) if (e.word === q) push(e, "exact");
  for (const shard of ownShards) for (const e of shard.entries) if (e.word.startsWith(q)) push(e, "prefix");
  const directHit = out.length > 0;
  const stems = directHit ? [] : inflectionStems(q);
  if (!directHit) {
    const divergentShards = await loadDivergentStemShards(stems, own + secondCharKey(q));
    const stemShards = [...ownShards, ...divergentShards];
    for (const stem of stems) for (const shard of stemShards) for (const e of shard.entries) if (e.word === stem) push(e, "inflected");
    for (const stem of stems) for (const shard of stemShards) for (const e of shard.entries) if (e.word.startsWith(stem)) push(e, "prefix");
  }
  const keys = new Set([key]);
  if (!directHit) for (const stem of stems) keys.add(phoneticKey(stem));
  for (const k of keys) {
    for (const s of shards) {
      for (const e of s.entries) if (e.key.startsWith(k)) push(e, "phonetic");
    }
  }
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

  // Grouped by first letter only (not the finer split key): the reverse index rarely points at
  // more than a handful of headwords per query, so loading a whole letter's sub-shards here is
  // simpler than resolving each headword's own sub-shard and stays cheap in practice.
  const byLetter = new Map<string, number[]>();
  const seen = new Set<number>();
  for (const [id, word] of pairs.slice(0, LIMIT)) {
    if (seen.has(id)) continue;
    seen.add(id);
    const l = shardKey(word);
    byLetter.set(l, [...(byLetter.get(l) ?? []), id]);
  }

  const letters = [...byLetter.keys()];
  const shardLists = await Promise.all(letters.map((l) => loadShardsForLetter(l)));
  const out: SearchResult[] = [];
  letters.forEach((letter, i) => {
    const wanted = new Set(byLetter.get(letter) ?? []);
    for (const shard of shardLists[i] ?? []) {
      for (const e of shard.entries) if (wanted.has(e.id)) out.push({ entry: e, match: "english" });
    }
  });
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
 * inflectional suffixes, then falls back to a phonetic match. Reports *how* it matched
 * (the same `SearchResult["match"]` reasons as `search`) so the caller can surface
 * uncertainty \u2014 an "inflected" or "phonetic" match is a guess, not a confirmed headword.
 * Returns null when nothing plausible was found.
 */
export async function lookupInflected(raw: string): Promise<SearchResult | null> {
  const word = normalise(raw).replace(/[^\u0C80-\u0CFF]/g, "");
  if (!word) return null;
  const shard = await loadShardForWord(word);
  if (!shard) return null;
  const exact = shard.entries.find((e) => e.word === word);
  if (exact) return { entry: exact, match: "exact" };
  const stems = inflectionStems(word);
  const divergentShards = await loadDivergentStemShards(stems, ownShardKey(word));
  const stemShards = [shard, ...divergentShards];
  for (const stem of stems) {
    for (const s of stemShards) {
      const hit = s.entries.find((e) => e.word === stem);
      if (hit) return { entry: hit, match: "inflected" };
    }
  }
  const key = phoneticKey(word);
  const phonetic = shard.entries.find((e) => e.key === key);
  return phonetic ? { entry: phonetic, match: "phonetic" } : null;
}
