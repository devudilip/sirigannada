import { existsSync, mkdirSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { load } from "js-yaml";

/** Shape of one raw Alar YAML record. Only the fields we consume are typed. */
export interface AlarDef {
  id?: number;
  entry?: string;
  type?: string;
}

export interface AlarEntry {
  id: number;
  entry: string;
  phone?: string;
  /** Source language of a loanword. Present in the schema; empty in every record so far. */
  origin?: string;
  defs?: AlarDef[];
}

export const ALAR_URL = "https://raw.githubusercontent.com/alar-dict/data/master/alar.yml";

/** Download `url` to `dest` unless a non-empty cached copy already exists. */
export async function downloadIfMissing(url: string, dest: string): Promise<void> {
  if (existsSync(dest) && statSync(dest).size > 0) {
    console.log(`✓ using cached ${dest} (${mb(statSync(dest).size)} MB)`);
    return;
  }
  console.log(`↓ downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status} ${res.statusText}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(dest), { recursive: true });
  await writeFile(dest, bytes);
  console.log(`✓ saved ${dest} (${mb(bytes.length)} MB)`);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toDef(v: unknown): AlarDef | undefined {
  if (!isRecord(v)) return undefined;
  return {
    id: typeof v.id === "number" ? v.id : undefined,
    entry: typeof v.entry === "string" ? v.entry : undefined,
    type: typeof v.type === "string" ? v.type : undefined,
  };
}

function toEntry(v: unknown): AlarEntry | undefined {
  if (!isRecord(v) || typeof v.id !== "number") return undefined;
  const defs = Array.isArray(v.defs)
    ? v.defs.map(toDef).filter((d): d is AlarDef => d !== undefined)
    : [];
  return {
    id: v.id,
    entry: typeof v.entry === "string" ? v.entry : String(v.entry ?? ""),
    phone: typeof v.phone === "string" && v.phone !== "" ? v.phone : undefined,
    origin: typeof v.origin === "string" && v.origin.trim() !== "" ? v.origin.trim() : undefined,
    defs,
  };
}

const BATCH = 5000;

/**
 * Parse the Alar YAML list. The file is ~40 MB, so rather than one giant `load` we split
 * on top-level "- id:" boundaries and parse a few thousand records at a time, which keeps
 * peak memory modest and lets us print progress.
 */
export async function readAlar(path: string): Promise<AlarEntry[]> {
  const text = await readFile(path, "utf8");
  const chunks = text.split(/\n(?=- id: )/);
  const out: AlarEntry[] = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const parsed = load(chunks.slice(i, i + BATCH).join("\n"));
    if (!Array.isArray(parsed)) throw new Error(`unexpected YAML shape at record ${i}`);
    for (const raw of parsed) {
      const entry = toEntry(raw);
      if (entry) out.push(entry);
    }
    process.stdout.write(`\r  parsed ${Math.min(i + BATCH, chunks.length)}/${chunks.length} records`);
  }
  process.stdout.write("\n");
  return out;
}

export function mb(bytes: number): string {
  return (bytes / 1_048_576).toFixed(1);
}
