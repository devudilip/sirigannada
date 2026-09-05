import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { GamesIndex } from "@/features/games/components/GamesIndex";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.gamesTitle.kn, alternates: { canonical: "/games" } };

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <PageTitle k="gamesTitle" sub="gamesSub" />
      <GamesIndex />
    </div>
  );
}
