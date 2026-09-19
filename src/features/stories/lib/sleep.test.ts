import { describe, expect, it } from "vitest";
import { nextSleepTimer, sleepDeadline } from "./sleep";

describe("sleep timer", () => {
  it("cycles off → end → 15 → 30 → off", () => {
    expect(nextSleepTimer("off")).toBe("end");
    expect(nextSleepTimer("end")).toBe(15);
    expect(nextSleepTimer(15)).toBe(30);
    expect(nextSleepTimer(30)).toBe("off");
  });
  it("only minute timers have a deadline", () => {
    expect(sleepDeadline("off", 1000)).toBeNull();
    expect(sleepDeadline("end", 1000)).toBeNull();
    expect(sleepDeadline(15, 1000)).toBe(1000 + 15 * 60_000);
  });
});
