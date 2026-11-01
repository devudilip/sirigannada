"use client";

import { useT } from "@/components/providers/AppProviders";
import { BilingualLabel } from "@/components/ui/BilingualLabel";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** ಗಾದೆ · Finish-the-proverb block of the games hub: a sketch of a half-said saying and its blanks, the pitch, Play. */
export function GadeBlock() {
  const t = useT();
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading k="gadeTitle" />
      <div aria-hidden="true" className="flex items-center gap-2">
        <span className="h-3 w-24 rounded-full bg-ink" />
        {[14, 10, 12].map((w) => (
          <span key={w} style={{ width: `${w * 4}px` }} className="h-8 rounded-md border border-dashed border-line-strong" />
        ))}
      </div>
      <p className="text-base text-secondary">{t("gadeSub")}</p>
      <LinkButton href="/games/gade" variant="secondary" size="md" className="self-start">
        <BilingualLabel k="gamesPlay" />
      </LinkButton>
    </section>
  );
}
