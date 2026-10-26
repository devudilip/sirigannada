import type { Metadata } from "next";
import { GamesIndex } from "@/features/games/components/GamesIndex";
import { GamesPageTitle } from "@/features/games/components/GamesPageTitle";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.gamesTitle.kn,
  alternates: { canonical: "/games" },
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <GamesPageTitle />
      <GamesIndex />
    </div>
  );
}
