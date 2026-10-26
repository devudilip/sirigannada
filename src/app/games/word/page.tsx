import type { Metadata } from "next";
import { WordGame } from "@/features/games/components/WordGame";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.wordGameTitle.kn,
  alternates: { canonical: "/games/word" },
};

export default function WordGamePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <WordGame />
    </div>
  );
}
