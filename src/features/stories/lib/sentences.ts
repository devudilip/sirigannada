/**
 * Which sentence is being spoken at `time`, given each sentence's start second. Binary search;
 * -1 before the first sentence. Times past the last start map to the last sentence.
 */
export function sentenceAt(timings: readonly number[], time: number): number {
  if (timings.length === 0 || time < (timings[0] ?? 0)) return -1;
  let lo = 0;
  let hi = timings.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if ((timings[mid] ?? 0) <= time) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Start second of sentence `index`, clamped into range. */
export function sentenceStart(timings: readonly number[], index: number): number {
  if (timings.length === 0) return 0;
  const i = Math.min(timings.length - 1, Math.max(0, index));
  return timings[i] ?? 0;
}

/** Words of a sentence for tap-to-look-up, keeping Kannada punctuation off the token. */
export function words(sentence: string): string[] {
  return sentence.split(/\s+/).filter(Boolean);
}

export function stripPunctuation(token: string): string {
  return token.replace(/^[“"'(\[]+|[”"'.,!?;:)\]।]+$/g, "");
}
