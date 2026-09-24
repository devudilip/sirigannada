"use client";

import { useEffect, useState } from "react";
import { SEARCH_INDEX_URL, searchShardUrl } from "@/features/library/lib/warmBookCache";
import type { SearchIndex, SearchIndexMeta, SearchShard, SearchShardFile } from "../types";
import { decodeShard } from "./searchIndex";

type State = { status: "loading" } | { status: "ready"; index: SearchIndex } | { status: "missing" };

// Kept for the session: the meta (~1 KB) and every shard decoded so far (≤ ~150 KB each).
let meta: SearchIndexMeta | null = null;
const shards = new Map<string, SearchShard>();
const pending = new Map<string, Promise<boolean>>();

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

function loadMeta(): Promise<boolean> {
  if (meta) return Promise.resolve(true);
  const key = "\u0000meta";
  let job = pending.get(key);
  if (!job) {
    job = fetchJson<SearchIndexMeta>(SEARCH_INDEX_URL).then((file) => {
      if (file?.v === 2) meta = file;
      pending.delete(key);
      return meta !== null;
    });
    pending.set(key, job);
  }
  return job;
}

/** A key the meta does not list has no words; treat it as loaded and empty. */
function loadShard(key: string): Promise<boolean> {
  if (shards.has(key) || !meta?.shards.includes(key)) return Promise.resolve(true);
  let job = pending.get(key);
  if (!job) {
    job = fetchJson<SearchShardFile>(searchShardUrl(key)).then((file) => {
      if (file) shards.set(key, decodeShard(file));
      pending.delete(key);
      return file !== null;
    });
    pending.set(key, job);
  }
  return job;
}

function snapshot(): SearchIndex | null {
  return meta ? { slugs: meta.slugs, starts: meta.starts, shards: new Map(shards) } : null;
}

function ready(keys: readonly string[]): boolean {
  return meta !== null && keys.every((key) => shards.has(key) || !meta?.shards.includes(key));
}

/**
 * Loads /data/search/index.json once per session, then the first-letter shards `keys` names
 * (from `shardKeysFor(query)`). Ready once all of them are in; missing if any fetch fails.
 */
export function useSearchIndex(keys: readonly string[]): State {
  const wanted = keys.join(",");
  const [state, setState] = useState<State>(() => {
    const index = ready(keys) ? snapshot() : null;
    return index ? { status: "ready", index } : { status: "loading" };
  });

  useEffect(() => {
    const list = wanted ? wanted.split(",") : [];
    const index = ready(list) ? snapshot() : null;
    if (index) {
      setState({ status: "ready", index });
      return;
    }
    let alive = true;
    setState({ status: "loading" });
    loadMeta()
      .then((ok) => (ok ? Promise.all(list.map(loadShard)).then((all) => all.every(Boolean)) : false))
      .then((ok) => {
        if (!alive) return;
        const next = ok ? snapshot() : null;
        setState(next ? { status: "ready", index: next } : { status: "missing" });
      });
    return () => {
      alive = false;
    };
  }, [wanted]);

  return state;
}
