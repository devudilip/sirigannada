import type { DictManifest, DictShard, ReverseShard } from "@/lib/types";
import { refForWord, refsForLetter } from "./shardResolve";

/**
 * Loads dictionary shards from /data/dict on demand and caches them for the session.
 * Shard file naming mirrors scripts/build-dictionary.ts: `u<hex>.json` per Kannada letter
 * (split into `u<hex>-u<hex>.json` / `u<hex>-other.json` sub-shards when a letter exceeds the
 * per-shard size budget — see shardResolve.ts), `other.json`, `en-<a-z>.json`, `en-other.json`,
 * `manifest.json`.
 */
const BASE = "/data/dict";
const shardCache = new Map<string, Promise<DictShard | null>>();
const reverseCache = new Map<string, Promise<ReverseShard | null>>();
let manifestPromise: Promise<DictManifest | null> | null = null;

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/${path}`);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

function loadShardFile(file: string): Promise<DictShard | null> {
  let p = shardCache.get(file);
  if (!p) {
    p = getJson<DictShard>(file);
    shardCache.set(file, p);
  }
  return p;
}

export function loadManifest(): Promise<DictManifest | null> {
  manifestPromise ??= getJson<DictManifest>("manifest.json");
  return manifestPromise;
}

/**
 * Every shard file covering `letter`'s entries — one file normally, several for a letter that
 * was split by second akshara. Use this for phonetic-sibling and other whole-letter scans.
 */
export async function loadShardsForLetter(letter: string): Promise<DictShard[]> {
  const manifest = await loadManifest();
  const refs = refsForLetter(letter, manifest);
  const shards = await Promise.all(refs.map((r) => loadShardFile(r.file)));
  return shards.filter((s): s is DictShard => s !== null);
}

/**
 * The one shard file holding `word`'s own entries, resolving a split letter's second-akshara
 * sub-shard from the word itself — the point of the split (Q-08): a query into an oversized
 * letter fetches one small file, not the whole multi-megabyte letter.
 */
export async function loadShardForWord(word: string): Promise<DictShard | null> {
  const manifest = await loadManifest();
  const ref = refForWord(word, manifest);
  return ref ? loadShardFile(ref.file) : null;
}

export function loadReverse(letter: string): Promise<ReverseShard | null> {
  const l = /^[a-z]$/.test(letter) ? letter : "other";
  let p = reverseCache.get(l);
  if (!p) {
    p = getJson<ReverseShard>(`en-${l}.json`);
    reverseCache.set(l, p);
  }
  return p;
}
