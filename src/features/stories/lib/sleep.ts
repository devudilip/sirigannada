import type { SleepTimer } from "../types";

/** Absolute deadline (ms since epoch) for a minutes timer; null for off / end-of-story. */
export function sleepDeadline(timer: SleepTimer, now = Date.now()): number | null {
  return typeof timer === "number" ? now + timer * 60_000 : null;
}

/** Next timer in the cycle a single button walks through: off → end → 15 → 30 → off. */
export function nextSleepTimer(timer: SleepTimer): SleepTimer {
  switch (timer) {
    case "off":
      return "end";
    case "end":
      return 15;
    case 15:
      return 30;
    case 30:
      return "off";
  }
}
