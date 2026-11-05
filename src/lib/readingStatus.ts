import { readStorage, writeStorage } from "./storage";

export type ReadingFilter = "unread" | "read" | "all";
export type ReadingStates = Record<string, "read" | "unread">;
export const READING_CHANGED = "sg-reading-changed";

export function readReadingStates(): ReadingStates {
  const value = readStorage<unknown>("reading:states", {});
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, state]) => state === "read" || state === "unread")) as ReadingStates;
}

export function isRead(id: string, states: ReadingStates, inferred = false): boolean {
  return states[id] ? states[id] === "read" : inferred;
}

export function setRead(id: string, finished: boolean): void {
  writeStorage("reading:states", { ...readReadingStates(), [id]: finished ? "read" : "unread" });
  window.dispatchEvent(new Event(READING_CHANGED));
}

export function matchesReadingFilter(finished: boolean, filter: ReadingFilter): boolean {
  return filter === "all" || (filter === "read" ? finished : !finished);
}

/** Explicitly marking unread wins over automatic completion, including on reader reload. */
export function finishReading(id: string): void {
  if (readReadingStates()[id] === undefined) setRead(id, true);
}
