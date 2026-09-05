/**
 * Build-time Kannada crossword generator (roadmap G-01). Pure and deterministic: the same word
 * list and seed always produce the same puzzle, so every device shows the same daily grid with no
 * network call. Words are placed one akshara per cell, each new word crossing an existing one at
 * a shared akshara, with the usual crossword hygiene (no touching parallel words, empty cells
 * before and after every word). The grid is cropped to its bounding box at the end.
 */
import { splitAksharas } from "../../src/lib/kannada";
import { mulberry32 } from "../../src/lib/prng";
import type { ClueSource, LocalizedText, PadabandhaDirection, PadabandhaEntry, PadabandhaPuzzle } from "../../src/lib/types";

export interface PadabandhaWord {
  word: string;
  clue: LocalizedText;
  clueSource: ClueSource;
}

export interface GenerateOptions {
  /** Working canvas is `size × size`; the result is cropped. */
  size: number;
  /** Stop once this many words are placed. */
  target: number;
  /** Reject puzzles with fewer words than this. */
  minimum: number;
}

export const DEFAULT_OPTIONS: GenerateOptions = { size: 9, target: 8, minimum: 5 };
export const MIN_AKSHARAS = 2;
export const MAX_AKSHARAS = 6;

interface Placed {
  word: string;
  aksharas: string[];
  row: number;
  column: number;
  direction: PadabandhaDirection;
}

type Canvas = Map<string, { akshara: string; directions: Set<PadabandhaDirection> }>;

const key = (r: number, c: number): string => `${r}:${c}`;

function cellsOf(p: Placed): Array<[number, number]> {
  return p.aksharas.map((_, i) => (p.direction === "across" ? [p.row, p.column + i] : [p.row + i, p.column]));
}

/** Crossword hygiene for one candidate placement. */
function canPlace(canvas: Canvas, p: Placed, size: number): boolean {
  const cells = cellsOf(p);
  let crossings = 0;
  for (const [r, c] of cells) {
    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    const existing = canvas.get(key(r, c));
    if (existing) {
      if (existing.akshara !== p.aksharas[cells.findIndex(([rr, cc]) => rr === r && cc === c)]) return false;
      if (existing.directions.has(p.direction)) return false; // would overlap a parallel word
      crossings += 1;
      continue;
    }
    // Empty cell: its neighbours perpendicular to our direction must be empty, or we would
    // silently form an unintended adjacent word.
    const [n1, n2] = p.direction === "across" ? [key(r - 1, c), key(r + 1, c)] : [key(r, c - 1), key(r, c + 1)];
    if (canvas.has(n1) || canvas.has(n2)) return false;
  }
  if (crossings === 0) return false;
  const [fr, fc] = cells[0]!;
  const [lr, lc] = cells[cells.length - 1]!;
  const before = p.direction === "across" ? key(fr, fc - 1) : key(fr - 1, fc);
  const after = p.direction === "across" ? key(lr, lc + 1) : key(lr + 1, lc);
  return !canvas.has(before) && !canvas.has(after);
}

function commit(canvas: Canvas, p: Placed): void {
  cellsOf(p).forEach(([r, c], i) => {
    const cell = canvas.get(key(r, c));
    if (cell) cell.directions.add(p.direction);
    else canvas.set(key(r, c), { akshara: p.aksharas[i]!, directions: new Set([p.direction]) });
  });
}

/** Every way `candidate` could cross `anchor` perpendicular to it at a shared akshara. */
function crossings(anchor: Placed, candidate: string[]): Placed[] {
  const out: Placed[] = [];
  const direction: PadabandhaDirection = anchor.direction === "across" ? "down" : "across";
  anchor.aksharas.forEach((a, ai) => {
    candidate.forEach((b, bi) => {
      if (a !== b) return;
      const [ar, ac] = cellsOf(anchor)[ai]!;
      out.push(
        direction === "down"
          ? { word: candidate.join(""), aksharas: candidate, row: ar - bi, column: ac, direction }
          : { word: candidate.join(""), aksharas: candidate, row: ar, column: ac - bi, direction },
      );
    });
  });
  return out;
}

export function isPlayableWord(word: string): boolean {
  const n = splitAksharas(word).length;
  return n >= MIN_AKSHARAS && n <= MAX_AKSHARAS && !/\s/.test(word);
}

/**
 * Crossword clues want one short sense, not a whole dictionary entry: keep the text before the
 * first ";" or full stop, drop leading "(fig.)"-style brackets, and cap the length at a word
 * boundary.
 */
const ABBREVIATION = /\b(usu|esp|etc|lit|fig|colloq|abbr|cf|viz|gen|pl|sing)$/i;

export function shortClue(definition: string, max = 90): string {
  let text = definition.replace(/^\s*\([^)]*\)\s*/, "").trim();
  for (const m of text.matchAll(/[;.](?=\s|$)/g)) {
    const before = text.slice(0, m.index);
    if (m[0] === "." && ABBREVIATION.test(before)) continue; // "usu." / "esp." are not sentence ends
    if (m.index > 0) text = before;
    break;
  }
  if (text.length > max) {
    const head = text.slice(0, max);
    text = `${head.slice(0, Math.max(head.lastIndexOf(" "), 40))}…`;
  }
  return text.replace(/[.;,\s]+$/, "").trim();
}

const KN_DIGITS = ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"];
export function kannadaDigits(n: number): string {
  return String(n).split("").map((d) => KN_DIGITS[Number(d)] ?? d).join("");
}

/**
 * One puzzle from `words` and `seed`, or null when the shuffle did not yield `minimum` crossing
 * words. `number` is only used for the title.
 */
export function generatePuzzle(
  words: readonly PadabandhaWord[],
  seed: number,
  number: number,
  options: GenerateOptions = DEFAULT_OPTIONS,
): PadabandhaPuzzle | null {
  const rand = mulberry32(seed);
  const pool = words.filter((w) => isPlayableWord(w.word));
  const order = [...pool].sort(() => rand() - 0.5);
  const byWord = new Map(pool.map((w) => [w.word, w]));
  const canvas: Canvas = new Map();
  const placed: Placed[] = [];

  const first = order.find((w) => splitAksharas(w.word).length >= 3) ?? order[0];
  if (!first) return null;
  const firstAk = splitAksharas(first.word);
  const start: Placed = {
    word: first.word,
    aksharas: firstAk,
    row: Math.floor(options.size / 2),
    column: Math.floor((options.size - firstAk.length) / 2),
    direction: "across",
  };
  commit(canvas, start);
  placed.push(start);

  for (const w of order) {
    if (placed.length >= options.target) break;
    if (placed.some((p) => p.word === w.word)) continue;
    const aks = splitAksharas(w.word);
    const anchors = [...placed].sort(() => rand() - 0.5);
    let done = false;
    for (const anchor of anchors) {
      for (const candidate of crossings(anchor, aks)) {
        if (!canPlace(canvas, candidate, options.size)) continue;
        commit(canvas, candidate);
        placed.push(candidate);
        done = true;
        break;
      }
      if (done) break;
    }
  }
  if (placed.length < options.minimum) return null;

  const rows = placed.flatMap((p) => cellsOf(p).map(([r]) => r));
  const cols = placed.flatMap((p) => cellsOf(p).map(([, c]) => c));
  const minR = Math.min(...rows);
  const minC = Math.min(...cols);
  const entries: PadabandhaEntry[] = placed
    .map((p) => {
      const src = byWord.get(p.word)!;
      return {
        id: p.word,
        answer: p.word,
        clue: src.clue,
        clueSource: src.clueSource,
        row: p.row - minR,
        column: p.column - minC,
        direction: p.direction,
      };
    })
    .sort((a, b) => a.row - b.row || a.column - b.column || a.direction.localeCompare(b.direction));

  return {
    id: `gen-${seed}`,
    title: { kn: `ಪದಬಂಧ · ${kannadaDigits(number)}`, en: `Padabandha · ${number}` },
    rows: Math.max(...rows) - minR + 1,
    columns: Math.max(...cols) - minC + 1,
    entries,
    provenance: {
      creator: { kn: "ಸಿರಿಗನ್ನಡ · ಸ್ವಯಂಚಾಲಿತ ಜೋಡಣೆ", en: "Sirigannada · generated grid" },
      license: "CC-BY-SA-4.0",
    },
  };
}

/** `count` distinct puzzles; seeds advance until the quota is met or `maxSeeds` is exhausted. */
export function generatePuzzleSet(
  words: readonly PadabandhaWord[],
  count: number,
  seedBase = 1,
  maxSeeds = count * 20,
  options: GenerateOptions = DEFAULT_OPTIONS,
): PadabandhaPuzzle[] {
  const out: PadabandhaPuzzle[] = [];
  const seen = new Set<string>();
  for (let seed = seedBase; out.length < count && seed < seedBase + maxSeeds; seed += 1) {
    const puzzle = generatePuzzle(words, seed, out.length + 1, options);
    if (!puzzle) continue;
    const signature = puzzle.entries.map((e) => e.answer).sort().join("|");
    if (seen.has(signature)) continue;
    seen.add(signature);
    out.push(puzzle);
  }
  return out;
}
