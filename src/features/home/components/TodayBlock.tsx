"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { formatShortDate, todayWordStatus, type WordGameStatus } from "../lib/todayStatus";

/**
 * "ಇಂದು · Today": two bordered cells for the daily word and the crossword. Storage is read after
 * mount so the server never guesses at the player's state. The crossword's "today" puzzle needs
 * the network to identify, so its cell always offers Play.
 */
export function TodayBlock() {
  const { locale, t } = useApp();
  const [date, setDate] = useState<string | undefined>(undefined);
  const [word, setWord] = useState<WordGameStatus>({ kind: "play" });

  useEffect(() => {
    const now = new Date();
    setDate(formatShortDate(now, locale));
    setWord(todayWordStatus(now));
  }, [locale]);

  const wordAction =
    word.kind === "done"
      ? t("homeDoneSeeAnswer")
      : word.kind === "resume"
        ? t("homeGuessesResume", { n: localiseDigits(word.guesses, locale), total: localiseDigits(word.total, locale) })
        : t("homePlay");

  const cell = "flex min-h-11 flex-col gap-1 p-4";
  const action = "mt-3 inline-flex min-h-11 items-center text-base font-semibold text-accent-strong";

  return (
    <section>
      <SectionHeading k="homeToday" detail={date} href="/games" linkKey="homeAllGames" />
      <div className="grid grid-cols-2 border border-line">
        <Link href="/games/word" className={`${cell} border-r border-line hover:bg-elevated active:bg-paper-edge`}>
          <span className="font-serif font-semibold text-lg leading-snug text-ink" lang="kn">
            {t("homeDailyWord")}
          </span>
          <span className="text-sm text-muted">{t("homeDailyWordSub")}</span>
          <span className={action}>{wordAction} →</span>
        </Link>
        <Link href="/games/padabandha" className={`${cell} hover:bg-elevated active:bg-paper-edge`}>
          <span className="font-serif font-semibold text-lg leading-snug text-ink" lang="kn">
            {t("homeCrossword")}
          </span>
          <span className="text-sm text-muted">{t("homeCrosswordSub")}</span>
          <span className={action}>{t("homePlay")} →</span>
        </Link>
      </div>
    </section>
  );
}
