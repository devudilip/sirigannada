"use client";

import { useT } from "@/components/providers/AppProviders";
import { BilingualLabel } from "@/components/ui/BilingualLabel";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Every daily word is three aksharas; three empty tiles preview the board without a fetch. */
const TILE_COUNT = 3;

/** ಪದ · Daily word block of the games hub: three empty tiles, the one-line pitch, Play. */
export function DailyWordBlock() {
  const t = useT();
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading k="wordGameTitle" />
      <div aria-hidden="true" className="flex gap-2">
        {Array.from({ length: TILE_COUNT }, (_, i) => (
          <span key={i} className="size-11 border border-line-strong" />
        ))}
      </div>
      <p className="text-base text-secondary">{t("gamesWordSub")}</p>
      <LinkButton href="/games/word" variant="primary" size="md" className="self-start">
        <BilingualLabel k="gamesPlay" />
      </LinkButton>
    </section>
  );
}
