/**
 * Build the dictionary shards under public/data/dict/ from V. Krishna's Alar dictionary
 * (ODbL-1.0). Run with `npm run data:dict`. Output is git-ignored and rebuilt on demand.
 */
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { shardKey } from "../src/lib/kannada";
import type { DailyWords, DictEntry, DictManifest, DictShard } from "../src/lib/types";
import { ALAR_URL, downloadIfMissing, mb, readAlar } from "./lib/alar";
import { selectDaily } from "./lib/daily";
import { ALLOWED_HEADWORD_LIST } from "./lib/dailyWordLists";
import { toDictEntry } from "./lib/entry";
import { buildReverseIndex, toReverseShard, type ReverseIndex } from "./lib/reverse";

const ROOT = process.cwd();
const RAW_PATH = join(ROOT, "data", "raw", "alar.yaml");
const OUT_DIR = join(ROOT, "public", "data", "dict");
const collator = new Intl.Collator("kn");

/* ------------------------------- transform ------------------------------- */

function shardFile(akshara: string): string {
  if (akshara === "_") return "other.json";
  const cp = akshara.codePointAt(0) ?? 0;
  return `u${cp.toString(16).padStart(4, "0")}.json`;
}

function groupByAkshara(entries: DictEntry[]): Map<string, DictEntry[]> {
  const groups = new Map<string, DictEntry[]>();
  for (const e of entries) {
    const k = shardKey(e.word);
    const list = groups.get(k);
    if (list) list.push(e);
    else groups.set(k, [e]);
  }
  return groups;
}

/* --------------------------------- write --------------------------------- */

function writeJson(file: string, data: unknown): number {
  const path = join(OUT_DIR, file);
  writeFileSync(path, JSON.stringify(data));
  return statSync(path).size;
}

function writeShards(groups: Map<string, DictEntry[]>): DictManifest["shards"] {
  const shards: DictManifest["shards"] = [];
  let largest = { file: "", size: 0 };
  for (const [akshara, entries] of groups) {
    entries.sort((a, b) => collator.compare(a.word, b.word) || a.id - b.id);
    const shard: DictShard = { akshara, entries };
    const file = shardFile(akshara);
    const size = writeJson(file, shard);
    if (size > largest.size) largest = { file, size };
    shards.push({ akshara, file, count: entries.length });
  }
  shards.sort((a, b) => collator.compare(a.akshara, b.akshara));
  console.log(`✓ wrote ${shards.length} shards (largest ${largest.file}, ${mb(largest.size)} MB)`);
  return shards;
}

function writeReverseShards(byLetter: ReverseIndex): DictManifest["reverseShards"] {
  const out: DictManifest["reverseShards"] = [];
  for (const [letter, index] of byLetter) {
    const file = `en-${letter}.json`;
    writeJson(file, toReverseShard(letter, index));
    out.push({ letter, file });
  }
  out.sort((a, b) => a.letter.localeCompare(b.letter, "en"));
  console.log(`✓ wrote ${out.length} reverse-index shards`);
  return out;
}

function writeDaily(entries: DictEntry[]): void {
  const daily: DailyWords = { entries: selectDaily(entries, collator.compare) };
  writeJson("daily.json", daily);
  console.log(`✓ wrote daily.json (${daily.entries.length} words)`);
  // daily.json is git-ignored, so report the forced everyday words (D-02) in the build log.
  const words = new Set(daily.entries.map((e) => e.word));
  const missing = ALLOWED_HEADWORD_LIST.filter((w) => !words.has(w));
  console.log(
    `✓ ${ALLOWED_HEADWORD_LIST.length - missing.length}/${ALLOWED_HEADWORD_LIST.length} allow-listed everyday words present` +
      (missing.length > 0 ? ` (missing: ${missing.join(", ")})` : ""),
  );
}

/** YYYY-MM-DD in the local timezone (toISOString would give the UTC date). */
function localDate(): string {
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ---------------------------------- main ---------------------------------- */

async function main(): Promise<void> {
  const started = Date.now();
  await downloadIfMissing(ALAR_URL, RAW_PATH);

  console.log("⋯ parsing YAML");
  const raw = await readAlar(RAW_PATH);
  const entries: DictEntry[] = [];
  let skipped = 0;
  for (const r of raw) {
    const e = toDictEntry(r);
    if (e) entries.push(e);
    else skipped++;
  }
  const truncated = entries.filter((e) => e.truncated).length;
  const withOrigin = entries.filter((e) => e.origin).length;
  console.log(`✓ ${entries.length} entries (${skipped} skipped: no Kannada headword or no definitions)`);
  console.log(`✓ ${truncated} truncated headwords (phone vowels > Kannada aksharas)`);
  console.log(`✓ ${withOrigin} entries carry a loanword origin`);

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const shards = writeShards(groupByAkshara(entries));
  const reverseShards = writeReverseShards(buildReverseIndex(entries));
  writeDaily(entries);

  const manifest: DictManifest = {
    name: "Alar Kannada-English Dictionary",
    entryCount: entries.length,
    shards,
    reverseShards,
    provenance: {
      source: "https://github.com/alar-dict/data",
      license: "ODbL-1.0",
      licenseNote:
        "Alar Kannada-English dictionary © V. Krishna, Open Database License 1.0. Derived data remains ODbL.",
      author: "V. Krishna",
      retrieved: localDate(),
    },
    builtAt: new Date().toISOString(),
  };
  writeJson("manifest.json", manifest);

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`✓ manifest.json written · done in ${secs}s`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
