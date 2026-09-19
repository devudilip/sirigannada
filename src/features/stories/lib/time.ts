/** m:ss for a number of seconds; negative input renders with a leading minus (time left). */
export function formatClock(seconds: number): string {
  const sign = seconds < 0 ? "−" : "";
  const s = Math.max(0, Math.round(Math.abs(seconds)));
  const m = Math.floor(s / 60);
  return `${sign}${m}:${String(s % 60).padStart(2, "0")}`;
}

/** "3 h 10 min" / "9 min" style total for a shelf. */
export function formatTotal(seconds: number, locale: "kn" | "en"): string {
  const m = Math.round(seconds / 60);
  const h = Math.floor(m / 60);
  const min = m % 60;
  const hLabel = locale === "kn" ? "ಗಂ" : "h";
  const mLabel = locale === "kn" ? "ನಿಮಿಷ" : "min";
  return h > 0 ? `${h} ${hLabel} ${min} ${mLabel}` : `${min} ${mLabel}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
