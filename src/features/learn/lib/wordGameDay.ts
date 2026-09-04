/**
 * Deterministic "which puzzle is today" logic for the daily akshara-guess game (L-05). Pure
 * functions of a `Date` and the pool size — no network, no account, same puzzle for everyone on
 * the same local calendar date. `Date` is only ever read for its local year/month/day; callers
 * pass `new Date()` at the call site so these stay easy to test with fixed dates.
 */

/** Arbitrary but fixed epoch — only its distance from "today" in local calendar days matters. */
const EPOCH_YEAR = 2024;
const EPOCH_MONTH = 0;
const EPOCH_DAY = 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function localMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Whole local-calendar days between the fixed epoch and `date` (may be negative for the past). */
export function daysSinceEpoch(date: Date): number {
  const epoch = new Date(EPOCH_YEAR, EPOCH_MONTH, EPOCH_DAY).getTime();
  return Math.round((localMidnight(date) - epoch) / MS_PER_DAY);
}

/**
 * Deterministic index into a pool of `poolLength` words for `date`'s local calendar day.
 * Same (date, poolLength) always yields the same index; different local dates almost always
 * yield different indices (they cycle back to the same puzzle every `poolLength` days).
 */
export function dailyPoolIndex(date: Date, poolLength: number): number {
  if (poolLength <= 0) return 0;
  const days = daysSinceEpoch(date);
  return ((days % poolLength) + poolLength) % poolLength;
}

/** YYYY-MM-DD for `date` in the local timezone — used as the localStorage key for today's state. */
export function dateKey(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
