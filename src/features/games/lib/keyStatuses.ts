import { splitAksharas } from "@/lib/kannada";
import { scoreGuess, type AksharaStatus } from "./wordGameScore";

export type KeyStatusMap = Record<string, AksharaStatus>;

const RANK: Record<AksharaStatus, number> = { absent: 0, present: 1, correct: 2 };

/**
 * Best-known status per keyboard key after the given guesses, for tinting the on-screen
 * keyboard like the tiles. Keys are both the whole akshara ("ಹೂ") and its leading code point
 * ("ಹ"), because the keyboard inserts consonants and vowel signs separately. Correct beats
 * present beats absent, and a status never downgrades.
 */
export function keyStatuses(guesses: readonly string[], target: string): KeyStatusMap {
  const targetAksharas = splitAksharas(target);
  const map: KeyStatusMap = {};
  const bump = (key: string, status: AksharaStatus) => {
    if (!key) return;
    const current = map[key];
    if (!current || RANK[status] > RANK[current]) map[key] = status;
  };
  for (const guess of guesses) {
    const aksharas = splitAksharas(guess);
    const statuses = scoreGuess(aksharas, targetAksharas);
    aksharas.forEach((akshara, i) => {
      const status = statuses[i];
      if (!status) return;
      bump(akshara, status);
      const lead = Array.from(akshara)[0] ?? "";
      if (lead !== akshara) bump(lead, status);
    });
  }
  return map;
}
