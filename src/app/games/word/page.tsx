import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { WordGame } from "@/features/games/components/WordGame";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.wordGameTitle.kn, alternates: { canonical: "/games/word" } };

export default function WordGamePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <PageTitle k="wordGameTitle" sub="gamesWordSub" />
      <WordGame />
    </div>
  );
}
