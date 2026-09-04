/**
 * Per-akshara feedback for one guess against the target, for the daily akshara-guess game
 * (L-05). Operates on already-split akshara arrays (see `splitAksharas` in `src/lib/kannada.ts`)
 * — a "letter" here may be several codepoints (e.g. "ನ್ನ").
 */
export type AksharaStatus = "correct" | "present" | "absent";

/**
 * Two-pass Wordle-style scoring: first mark every exact positional match, then mark "present
 * elsewhere" from the aksharas that remain unmatched, decrementing a per-akshara count as each
 * is claimed. This is deliberately not a single-pass `includes()` check — that double-counts a
 * target akshara that appears once but is guessed in two positions, marking both "present" when
 * only one guess should get credit.
 */
export function scoreGuess(guess: readonly string[], target: readonly string[]): AksharaStatus[] {
  const n = target.length;
  const statuses: AksharaStatus[] = new Array(n).fill("absent") as AksharaStatus[];
  const remaining = new Map<string, number>();

  for (let i = 0; i < n; i++) {
    if (guess[i] === target[i]) {
      statuses[i] = "correct";
    } else {
      const t = target[i]!;
      remaining.set(t, (remaining.get(t) ?? 0) + 1);
    }
  }

  for (let i = 0; i < n; i++) {
    if (statuses[i] === "correct") continue;
    const g = guess[i]!;
    const left = remaining.get(g) ?? 0;
    if (left > 0) {
      statuses[i] = "present";
      remaining.set(g, left - 1);
    }
  }

  return statuses;
}

export function isWin(statuses: readonly AksharaStatus[]): boolean {
  return statuses.length > 0 && statuses.every((s) => s === "correct");
}
