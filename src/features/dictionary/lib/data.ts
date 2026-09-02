import type { DictManifest, DictShard, ReverseShard } from "@/lib/types";

/**
 * Loads dictionary shards from /data/dict on demand and caches them for the session.
 * Shard file naming mirrors scripts/build-dictionary.ts: `u<hex>.json` per Kannada letter,
 * `other.json`, `en-<a-z>.json`, `en-other.json`, `manifest.json`.
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

export function shardFileFor(akshara: string): string {
  if (akshara === "_") return "other.json";
  const cp = akshara.codePointAt(0) ?? 0;
  return `u${cp.toString(16).padStart(4, "0")}.json`;
}

export function loadShard(akshara: string): Promise<DictShard | null> {
  const file = shardFileFor(akshara);
  let p = shardCache.get(file);
  if (!p) {
    p = getJson<DictShard>(file);
    shardCache.set(file, p);
  }
  return p;
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

export function loadManifest(): Promise<DictManifest | null> {
  manifestPromise ??= getJson<DictManifest>("manifest.json");
  return manifestPromise;
}
