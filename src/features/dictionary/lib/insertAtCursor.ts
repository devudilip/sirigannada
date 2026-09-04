/**
 * Pure helpers for the on-screen Kannada keyboard: insert or delete text at a
 * tracked cursor position instead of always appending to the end. `cursor` is
 * a UTF-16 code-unit offset (as `HTMLInputElement.selectionStart` reports);
 * `null` or an out-of-range value falls back to the end of `value`.
 */

export interface CursorEditResult {
  text: string;
  cursor: number;
}

function clampCursor(value: string, cursor: number | null): number {
  if (cursor === null || Number.isNaN(cursor)) return value.length;
  return Math.min(Math.max(cursor, 0), value.length);
}

/** Inserts `insert` at `cursor`, returning the new text and the cursor position just after it. */
export function insertAtCursor(value: string, insert: string, cursor: number | null): CursorEditResult {
  const pos = clampCursor(value, cursor);
  return { text: value.slice(0, pos) + insert + value.slice(pos), cursor: pos + insert.length };
}

/** Removes one code point before `cursor` (a no-op at position 0). */
export function backspaceAtCursor(value: string, cursor: number | null): CursorEditResult {
  const pos = clampCursor(value, cursor);
  if (pos === 0) return { text: value, cursor: 0 };
  const before = Array.from(value.slice(0, pos));
  before.pop();
  const newBefore = before.join("");
  return { text: newBefore + value.slice(pos), cursor: newBefore.length };
}
