/**
 * Pull CC BY-SA Kannada folk proverbs from kn.wikiquote and write public/data/proverbs.json.
 *
 *   TMPDIR=/tmp tsx scripts/fetch-proverbs.ts
 *
 * Only folk-list pages are taken (not author quotes, news, blogs, or modern books).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ProverbsFile } from "../src/lib/types";
import { extractProverbs, mergeProverbs } from "./lib/proverbs";

const API = "https://kn.wikiquote.org/w/api.php";
const PAGE_BASE = "https://kn.wikiquote.org/wiki/";
const USER_AGENT =
  "Sirigannada-corpus/0.1 (https://github.com/devudilip/sirigannada; devu.dilip@gmail.com)";

/** Folk proverb list pages. See the task report for pages we skipped and why. */
export const PROVERB_PAGES = [
  "ಗಾದೆಗಳು",
  "ಅಡುಗೆಮನೆ ಗಾದೆಗಳು",
  "ಮಳೆ ಗಾದೆಗಳು",
] as const;

export function pageUrl(title: string): string {
  return PAGE_BASE + encodeURIComponent(title.replace(/ /g, "_"));
}

interface RevisionsResponse {
  query?: {
    pages?: {
      title: string;
      missing?: boolean;
      revisions?: { slots: { main: { content: string } } }[];
    }[];
  };
}

export async function fetchWikitext(titles: string[]): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>();
  const params = new URLSearchParams({
    action: "query",
    prop: "revisions",
    rvprop: "content",
    rvslots: "main",
    format: "json",
    formatversion: "2",
    redirects: "1",
    titles: titles.join("|"),
  });
  const res = await fetch(API, {
    method: "POST",
    headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Wikiquote API ${res.status}`);
  const data = (await res.json()) as RevisionsResponse;
  const byTitle = new Map<string, string>();
  for (const t of titles) byTitle.set(t.replace(/_/g, " "), t);
  for (const p of data.query?.pages ?? []) {
    const original = byTitle.get(p.title.replace(/_/g, " ")) ?? p.title;
    out.set(original, p.missing ? null : (p.revisions?.[0]?.slots.main.content ?? null));
  }
  for (const t of titles) if (!out.has(t)) out.set(t, null);
  return out;
}

function retrievedDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function padId(n: number): string {
  return `p${String(n).padStart(4, "0")}`;
}

async function main(): Promise<void> {
  const titles = [...PROVERB_PAGES];
  const wikitext = await fetchWikitext(titles);
  const perPage: string[][] = [];
  const pages: string[] = [];
  for (const title of titles) {
    const raw = wikitext.get(title);
    if (!raw) throw new Error(`Wikiquote page missing: ${title}`);
    const items = extractProverbs(raw);
    console.log(`${title}: ${items.length} after cleaning`);
    perPage.push(items);
    pages.push(pageUrl(title));
  }
  const merged = mergeProverbs(perPage);
  const retrieved = retrievedDate();
  const file: ProverbsFile = {
    provenance: {
      source: pageUrl("ಗಾದೆಗಳು"),
      license: "CC-BY-SA-4.0",
      licenseNote:
        "Kannada Wikiquote contributors. Folk proverb lists; CC BY-SA 4.0. Attribution: https://kn.wikiquote.org/",
      author: "ಕನ್ನಡ ವಿಕಿಕೋಟ್ ಸಂಪಾದಕರು",
      retrieved,
    },
    pages,
    proverbs: merged.map((text, i) => ({ id: padId(i + 1), text })),
  };
  const dest = join(process.cwd(), "public", "data", "proverbs.json");
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(file, null, 2)}\n`);
  console.log(`wrote ${file.proverbs.length} proverbs → ${dest}`);
  if (merged.length < 300) {
    console.warn(`yield ${merged.length} < 300; did not invent fillers`);
  }
}

if (process.argv[1]?.endsWith("fetch-proverbs.ts")) {
  main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
