import type { Locale } from "@/lib/types";

/** "Monday 8 September" / "ಸೋಮವಾರ, 8 ಸೆಪ್ಟೆಂಬರ್" — the games hub date line, in the reader's UI language. */
export function formatGamesDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "kn" ? "kn-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** "8 Sep" / "8 ಸೆಪ್ಟೆಂ" — the short date in the word-game kicker. */
export function formatShortDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "kn" ? "kn-IN" : "en-IN", { day: "numeric", month: "short" }).format(date);
}
