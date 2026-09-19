"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { formatShortDate } from "../lib/gamesDate";
import { MAX_GUESSES } from "../lib/wordGameSession";

/** Header row of the word game: back to /games, "ಪದ · #n · date" kicker, "{guess} / 6" at right. */
export function WordGameHeader({ dayNumber, date, guessNumber }: { dayNumber: number; date: Date; guessNumber: number }) {
  const { locale, t } = useApp();
  return (
    <div className="mb-5 flex items-center justify-between gap-4 border-b-2 border-line-strong pb-3">
      <Link href="/games" aria-label={t("navGames")} className="inline-flex size-11 items-center justify-center text-ink hover:bg-elevated">
        <ChevronLeftIcon size={22} />
      </Link>
      <div className="flex min-w-0 flex-col">
        <h1 className="text-xl font-bold text-ink leading-tight">{t("wordGameTitle")}</h1>
        <p className="kicker text-muted">{t("wordGameDayKicker", { n: dayNumber, date: formatShortDate(date, locale) })}</p>
      </div>
      <p className="shrink-0 text-sm text-muted" aria-label={t("wordGameGuessCount", { n: guessNumber, total: MAX_GUESSES })}>
        {guessNumber} / {MAX_GUESSES}
      </p>
    </div>
  );
}
