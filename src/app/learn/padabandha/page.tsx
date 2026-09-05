import type { Metadata } from "next";
import { RedirectNotice } from "@/components/ui/RedirectNotice";
import { strings } from "@/lib/i18n";

/** Old address kept so shared links still work; the crossword now lives under /games. */
export const metadata: Metadata = {
  title: strings.padabandhaTitle.kn,
  alternates: { canonical: "/games/padabandha" },
  robots: { index: false },
};

export default function OldPadabandhaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-12 pt-8">
      <RedirectNotice href="/games/padabandha" noteKey="gamesMovedNote" linkKey="padabandhaTitle" />
    </div>
  );
}
