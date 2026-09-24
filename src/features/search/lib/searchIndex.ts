import type { Book } from "@/lib/types";
import { hasKannada, latinToKannada } from "@/lib/kannada";
import { normaliseBookSearchText } from "@/features/reader/lib/bookSearch";
import type { BookHits, SearchIndex, SearchIndexMeta, SearchShard, SearchShardFile } from "../types";

const WORD = /[\p{L}\p{M}]+/gu;
const MAX_SHARED = 35;

/** Distinct normalised words of a text, the same way for book blocks and for queries. */
export function wordsOf(text: string): string[] {
  return [...new Set(normaliseBookSearchText(text).match(WORD) ?? [])];
}

/** Query words; a Latin-only query is read as phonetic Kannada ("basava" → ಬಸವ). */
export function queryWords(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed || hasKannada(trimmed) || !/[A-Za-z]/.test(trimmed)) return wordsOf(trimmed);
  return trimmed.split(/\s+/).flatMap((part) => wordsOf(latinToKannada(part)));
}

function sharedPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && i < MAX_SHARED && a[i] === b[i]) i += 1;
  return i;
}

function packDeltas(blocks: readonly number[]): string {
  let last = 0;
  return blocks
    .map((block) => {
      const delta = block - last;
      last = block;
      return delta.toString(36);
    })
    .join(",");
}

/** Shard a word belongs to: its first letter's code point in hex (ಕ → "c95"). */
export function shardKey(word: string): string {
  return (word.codePointAt(0) ?? 0).toString(16);
}

/** Shards a query needs loaded before `searchCorpus` can answer it. */
export function shardKeysFor(query: string): string[] {
  return [...new Set(queryWords(query).map(shardKey))].sort();
}

function frontCode(sorted: readonly string[], postings: ReadonlyMap<string, number[]>): SearchShardFile {
  const words: string[] = [];
  const refs: string[] = [];
  let previous = "";
  for (const word of sorted) {
    const shared = sharedPrefix(previous, word);
    words.push(shared.toString(36) + word.slice(shared));
    refs.push(packDeltas(postings.get(word) ?? []));
    previous = word;
  }
  return { words: words.join("\n"), refs: refs.join("\n") };
}

/** Build the index for books in shelf order. Pure: the build script only writes the result. */
export function buildSearchIndex(books: readonly Pick<Book, "slug" | "chapters">[]): {
  meta: SearchIndexMeta;
  shards: Record<string, SearchShardFile>;
} {
  const postings = new Map<string, number[]>();
  const starts: number[] = [];
  let corpusBlock = 0;
  for (const book of books) {
    starts.push(corpusBlock);
    for (const chapter of book.chapters) {
      for (const text of chapter.blocks) {
        for (const word of wordsOf(text)) {
          const list = postings.get(word);
          if (list) list.push(corpusBlock);
          else postings.set(word, [corpusBlock]);
        }
        corpusBlock += 1;
      }
    }
  }
  starts.push(corpusBlock);

  const byShard = new Map<string, string[]>();
  for (const word of [...postings.keys()].sort()) {
    const key = shardKey(word);
    const list = byShard.get(key);
    if (list) list.push(word);
    else byShard.set(key, [word]);
  }
  const keys = [...byShard.keys()].sort();
  const shards: Record<string, SearchShardFile> = {};
  for (const key of keys) shards[key] = frontCode(byShard.get(key) ?? [], postings);
  return { meta: { v: 2, slugs: books.map((b) => b.slug), starts, shards: keys }, shards };
}

export function decodeShard(file: SearchShardFile): SearchShard {
  const words: string[] = [];
  let previous = "";
  for (const line of file.words.split("\n")) {
    previous = previous.slice(0, parseInt(line[0] ?? "0", 36)) + line.slice(1);
    words.push(previous);
  }
  return { words, refs: file.refs.split("\n") };
}

/** First index in the sorted word list that is ≥ `prefix`. */
function lowerBound(words: readonly string[], prefix: string): number {
  let lo = 0;
  let hi = words.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((words[mid] ?? "") < prefix) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function unpack(line: string): number[] {
  let block = 0;
  return line ? line.split(",").map((delta) => (block += parseInt(delta, 36))) : [];
}

/** Corpus blocks holding any word that starts with `prefix` (Kannada words carry their suffixes). */
function blocksForPrefix(index: SearchIndex, prefix: string): Set<number> {
  const blocks = new Set<number>();
  const shard = index.shards.get(shardKey(prefix));
  if (!shard) return blocks;
  for (let i = lowerBound(shard.words, prefix); i < shard.words.length; i += 1) {
    if (!shard.words[i]?.startsWith(prefix)) break;
    for (const block of unpack(shard.refs[i] ?? "")) blocks.add(block);
  }
  return blocks;
}

/**
 * Blocks containing every query word (as a word prefix), grouped by book, most hits first.
 * A word whose shard is not in `index.shards` matches nothing; load `shardKeysFor(query)` first.
 */
export function searchCorpus(index: SearchIndex, query: string): BookHits[] {
  const terms = queryWords(query);
  if (terms.length === 0) return [];
  let found = blocksForPrefix(index, terms[0] ?? "");
  for (const term of terms.slice(1)) {
    if (found.size === 0) break;
    const blocks = blocksForPrefix(index, term);
    found = new Set([...found].filter((b) => blocks.has(b)));
  }

  const byBook = new Map<number, number[]>();
  let book = 0;
  for (const corpusBlock of [...found].sort((a, b) => a - b)) {
    while (book + 1 < index.starts.length && (index.starts[book + 1] ?? 0) <= corpusBlock) book += 1;
    const list = byBook.get(book) ?? [];
    list.push(corpusBlock - (index.starts[book] ?? 0));
    byBook.set(book, list);
  }
  return [...byBook.entries()]
    .map(([book, blocks]) => ({ slug: index.slugs[book] ?? "", blocks }))
    .sort((a, b) => b.blocks.length - a.blocks.length);
}
