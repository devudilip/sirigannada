"use client";

import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { PageTitle } from "@/components/ui/PageTitle";
import { formatGamesDate } from "../lib/gamesDate";

/** "ಆಟಗಳು" over today's date and the "same puzzles for everyone" promise, in the UI locale. */
export function GamesPageTitle() {
  const { locale, t } = useApp();
  const today = useMemo(() => new Date(), []);
  return <PageTitle k="gamesTitle" detail={`${formatGamesDate(today, locale)} · ${t("gamesSamePuzzles")}`} />;
}
