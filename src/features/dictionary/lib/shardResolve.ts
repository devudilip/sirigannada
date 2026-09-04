import { secondCharKey, shardKey } from "@/lib/kannada";
import type { DictManifest } from "@/lib/types";

/**
 * Pure shard-resolution logic shared by the client loaders in `data.ts`. Kept manifest-driven
 * (no fetching here) so it stays trivially unit-testable: `manifest.shards` is the source of
 * truth for which letters got split by second akshara (Q-08, `scripts/build-dictionary.ts`) —
 * a split letter's entries show up as several `{ akshara, file }` rows whose `akshara` is the
 * letter plus a second-akshara key ("ಕಾ") instead of the bare letter ("ಕ").
 */
export interface ShardRef {
  akshara: string;
  file: string;
}

/** Fallback filename for a bare, unsplit letter shard — mirrors `shardFile` in the build script. */
export function shardFileFor(akshara: string): string {
  if (akshara === "_") return "other.json";
  const cp = akshara.codePointAt(0) ?? 0;
  return `u${cp.toString(16).padStart(4, "0")}.json`;
}

/**
 * Every shard file that holds `letter`'s entries: one file normally, several when the manifest
 * shows that letter was split. Falls back to the single unsplit filename when there's no
 * manifest (offline-first degrade) or the letter isn't listed in it.
 */
export function refsForLetter(letter: string, manifest: DictManifest | null): ShardRef[] {
  if (manifest) {
    const matches = manifest.shards.filter((s) => {
      if (s.akshara === letter) return true;
      const chars = [...s.akshara];
      return chars.length > 1 && chars[0] === letter;
    });
    if (matches.length > 0) return matches;
  }
  return [{ akshara: letter, file: shardFileFor(letter) }];
}

/**
 * The single shard file that would hold `word`'s own entry, resolving a split letter's
 * second-akshara sub-shard directly from the word so the client fetches only one small file
 * instead of the whole (oversized) letter. Returns `null` only when the word's letter isn't
 * covered by any ref (shouldn't happen with a valid manifest, but degrades safely).
 */
export function refForWord(word: string, manifest: DictManifest | null): ShardRef | null {
  const letter = shardKey(word);
  const refs = refsForLetter(letter, manifest);
  if (refs.length <= 1) return refs[0] ?? null;
  const compound = letter + secondCharKey(word);
  return refs.find((r) => r.akshara === compound) ?? refs.find((r) => r.akshara === letter) ?? null;
}
