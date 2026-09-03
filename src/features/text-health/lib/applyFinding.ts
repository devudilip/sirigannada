import type { TextHealthFinding } from "../types";

/** Applies one reviewed suggestion only if the finding still matches the current text. */
export function applyFinding(text: string, finding: TextHealthFinding): string {
  if (finding.replacement === undefined) return text;
  const { start, end } = finding.location;
  if (text.slice(start, end) !== finding.excerpt) return text;
  return text.slice(0, start) + finding.replacement + text.slice(end);
}
