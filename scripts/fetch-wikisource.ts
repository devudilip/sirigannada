/**
 * Fetch Kannada Wikisource pages as cleaned plain text.
 *
 *   tsx scripts/fetch-wikisource.ts "<page title>"            print cleaned text of one page
 *   tsx scripts/fetch-wikisource.ts --links "<index title>"   list page titles linked from an index page
 *   tsx scripts/fetch-wikisource.ts --dump "<index>" <dir>    cleaned text of every linked page + _summary.tsv, for review
 *   tsx scripts/fetch-wikisource.ts --sources <sources.txt>   regenerate chapter files for one book
 *
 * sources.txt lives next to book.json and lists, per chapter, the exact pages used:
 *
 *   # 01-bhaga-1.txt | ಭಾಗ ೧ | blocks
 *   ಚಕೋರಂಗೆ ಚಂದ್ರಮನ              ← each page becomes one block (vachana, kirtane)
 *   # 02-neeti.txt | ನೀತಿ | page | section=ನೀತಿ | max=40
 *   ಸರ್ವಜ್ಞನ ವಚನಗಳು              ← page's own blank-line blocks, only that section
 *   ಸರ್ವಜ್ಞನ ವಚನಗಳು # ಲೇಸು ಪದ್ಧತಿ  ← "title # section" takes one section of a long page
 *   # 03-sandhi-1.txt | ಪೀಠಿಕಾ ಸಂಧಿ | numbered | skip=2
 *   ಆದಿಪರ್ವ: ೦೧. ಪೀಠಿಕಾ ಸಂಧಿ     ← verse lines rejoined, split after each verse number
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { findDisallowedChars, isGarbled, splitBlocks } from "./lib/books";
import {
  cleanWikitext,
  dropNonVerse,
  extractLinks,
  fetchWikitext,
  joinNumberedVerses,
  sectionOf,
} from "./lib/wikisource";

type Mode = "blocks" | "page" | "numbered";

interface ChapterSpec {
  file: string;
  title: string;
  mode: Mode;
  /** Auto-imported vachana pages break lines at (dropped) commas; re-break at sentence ends instead. */
  reflow?: boolean;
  section?: string;
  max?: number;
  skip?: number;
  pages: string[];
}

export function parseSources(text: string): ChapterSpec[] {
  const specs: ChapterSpec[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      if (!line.includes("|")) continue; // plain comment
      const parts = line.slice(1).split("|").map((p) => p.trim());
      const [file, title, ...opts] = parts;
      if (!file || !title) throw new Error(`Bad chapter header: ${line}`);
      const spec: ChapterSpec = { file, title, mode: "blocks", pages: [] };
      for (const opt of opts) {
        if (opt === "blocks" || opt === "page" || opt === "numbered") spec.mode = opt;
        else if (opt === "reflow") spec.reflow = true;
        else if (opt.startsWith("section=")) spec.section = opt.slice(8);
        else if (opt.startsWith("max=")) spec.max = Number(opt.slice(4));
        else if (opt.startsWith("skip=")) spec.skip = Number(opt.slice(5));
        else if (opt) throw new Error(`Unknown option "${opt}" in: ${line}`);
      }
      specs.push(spec);
    } else {
      const spec = specs[specs.length - 1];
      if (!spec) throw new Error(`Page title before any chapter header: ${line}`);
      spec.pages.push(line);
    }
  }
  return specs;
}

/** A page line may be "title # section" to take one section of a long page. */
export function splitPageLine(line: string): [string, string | undefined] {
  const i = line.indexOf(" # ");
  return i === -1 ? [line, undefined] : [line.slice(0, i).trim(), line.slice(i + 3).trim()];
}

/** Turn one page's cleaned text into blocks according to the chapter mode. */
export function pageToBlocks(cleaned: string, spec: ChapterSpec): string[] {
  let text = spec.section ? sectionOf(cleaned, spec.section) : cleaned;
  text = dropNonVerse(text);
  if (spec.mode === "numbered") return splitBlocks(joinNumberedVerses(text));
  const finish = (b: string): string => {
    // Drop leading ("೧. ") and trailing ("… ದೇವಾ. 92") editorial serial numbers, optionally re-flow.
    const stripped = b
      .replace(/^\(?[\u0CE6-\u0CEF0-9]{1,4}[.)]?\s*/, "")
      .replace(/[\s.]*\b\d{1,4}\s*$/, "")
      .trim();
    return spec.reflow ? reflowSentences(stripped) : stripped;
  };
  if (spec.mode === "page") return splitBlocks(text).map(finish).filter(Boolean);
  const joined = finish(splitBlocks(text).join("\n")); // one page = one vachana/kirtane
  return joined ? [joined] : [];
}

const SENTENCE_END = /[.?!;]["”’]?$/;
const MAX_JOINED_LINE = 72;

/** Some imported pages put a <br> after every single word; the "lines" then carry no structure. */
function isWordPerLine(lines: string[]): boolean {
  if (lines.length < 4) return false;
  const bare = lines.filter((l) => !/\s/.test(l.trim())).length;
  return bare / lines.length >= 0.7;
}

/** Greedy wrap for word-per-line blocks: break at sentence ends and at MAX_JOINED_LINE. */
function wrapWords(words: string[]): string {
  const out: string[] = [];
  let line = "";
  for (const word of words) {
    const joined = line ? `${line} ${word}` : word;
    if (line && joined.length > MAX_JOINED_LINE) {
      out.push(line);
      line = word;
    } else {
      line = joined;
    }
    if (SENTENCE_END.test(word)) {
      out.push(line);
      line = "";
    }
  }
  if (line) out.push(line);
  return out.join("\n");
}

/**
 * Auto-imported vachana pages broke lines at commas (and dropped them), so sentences run across
 * lines. When that is detected, rejoin each sentence's clauses into one line if the result is
 * short; otherwise keep the clause lines. Blocks whose lines already end at sentence boundaries
 * (or have no sentence punctuation at all) are returned unchanged.
 */
export function reflowSentences(block: string): string {
  const lines = block.split("\n");
  if (isWordPerLine(lines)) return wrapWords(lines.join(" ").split(/\s+/).filter(Boolean));
  if (!/[.?!;]["”’]?\s+\S/.test(block)) return block;
  const out: string[] = [];
  let buf: string[] = [];
  const flush = (): void => {
    if (buf.length === 0) return;
    const joined = buf.join(" ");
    out.push(...(joined.length <= MAX_JOINED_LINE ? [joined] : buf));
    buf = [];
  };
  for (const line of block.split("\n")) {
    const parts = line.split(/(?<=[.?!;]["”’]?)\s+(?=\S)/);
    parts.forEach((part, i) => {
      buf.push(part);
      if (i < parts.length - 1) flush();
    });
    if (SENTENCE_END.test(line)) flush();
  }
  flush();
  return out.join("\n");
}

async function buildChapter(spec: ChapterSpec, cache: Map<string, string | null>): Promise<string> {
  let blocks: string[] = [];
  for (const line of spec.pages) {
    const [title, section] = splitPageLine(line);
    const raw = cache.get(title);
    if (raw == null) {
      console.warn(`  ! missing page: ${title}`);
      continue;
    }
    blocks.push(...pageToBlocks(cleanWikitext(raw), section ? { ...spec, section } : spec));
  }
  if (spec.skip) blocks = blocks.slice(spec.skip);
  if (spec.max) blocks = blocks.slice(0, spec.max);
  return `${spec.title}\n\n${blocks.join("\n\n")}\n`;
}

async function runSources(path: string): Promise<void> {
  const specs = parseSources(readFileSync(path, "utf8"));
  const titles = [...new Set(specs.flatMap((s) => s.pages.map((p) => splitPageLine(p)[0])))];
  console.log(`fetching ${titles.length} page(s) for ${specs.length} chapter(s)…`);
  const cache = await fetchWikitext(titles);
  const dir = dirname(path);
  for (const spec of specs) {
    const content = await buildChapter(spec, cache);
    writeFileSync(join(dir, spec.file), content);
    const n = splitBlocks(content.slice(content.indexOf("\n"))).length;
    console.log(`  ${spec.file}: ${n} block(s)`);
  }
}

/** Review aid: write every page linked from an index as NNNN.txt plus a TSV of quality flags. */
async function runDump(index: string, dir: string): Promise<void> {
  const idx = (await fetchWikitext([index])).get(index);
  if (idx == null) throw new Error(`page not found: ${index}`);
  const links = extractLinks(idx);
  console.log(`fetching ${links.length} linked page(s)…`);
  const pages = await fetchWikitext(links);
  mkdirSync(dir, { recursive: true });
  const rows = ["n\tblocks\tlines\tflags\ttitle"];
  links.forEach((title, i) => {
    const raw = pages.get(title);
    const n = String(i + 1).padStart(4, "0");
    if (raw == null) return rows.push(`${n}\t0\t0\tmissing\t${title}`);
    const cleaned = dropNonVerse(cleanWikitext(raw));
    const blocks = splitBlocks(cleaned);
    const text = blocks.join("\n");
    const flags = [
      /\)\s*[\u0CE6-\u0CEF0-9]/.test(text) && "song-repeat",
      /ರಾಗ|ತಾಳ/.test(raw) && "raga",
      /PoemHeader/.test(raw) && "poemheader",
      /Remarks\s*=\s*\S|ಅರ್ಥ\s*:|ವಿವರಣೆ/.test(raw) && "commentary",
      /[A-Za-z]{3,}/.test(text) && "latin",
      isGarbled(text) && "garbled",
      findDisallowedChars(text).length > 0 && `bad:${findDisallowedChars(text).join("")}`,
    ].filter(Boolean);
    rows.push(`${n}\t${blocks.length}\t${text.split("\n").length}\t${flags.join(",")}\t${title}`);
    writeFileSync(join(dir, `${n}.txt`), `${title}\n\n${cleaned}\n`);
  });
  writeFileSync(join(dir, "_summary.tsv"), rows.join("\n") + "\n");
  console.log(`wrote ${links.length} file(s) to ${dir}`);
}

async function main(argv: string[]): Promise<void> {
  const [flag, arg, arg2] = argv;
  if (flag === "--sources" && arg) return runSources(arg);
  if (flag === "--dump" && arg && arg2) return runDump(arg, arg2);
  if (flag === "--links" && arg) {
    const raw = (await fetchWikitext([arg])).get(arg);
    if (raw == null) throw new Error(`page not found: ${arg}`);
    for (const t of extractLinks(raw)) console.log(t);
    return;
  }
  if (flag && !flag.startsWith("--")) {
    const raw = (await fetchWikitext([flag])).get(flag);
    if (raw == null) throw new Error(`page not found: ${flag}`);
    console.log(cleanWikitext(raw));
    return;
  }
  console.error("usage: fetch-wikisource.ts <title> | --links <title> | --dump <index> <dir> | --sources <sources.txt>");
  process.exit(2);
}

if (process.argv[1]?.endsWith("fetch-wikisource.ts")) {
  main(process.argv.slice(2)).catch((e: unknown) => {
    console.error((e as Error).message);
    process.exit(1);
  });
}
