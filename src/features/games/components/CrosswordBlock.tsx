"use client";

import { useT } from "@/components/providers/AppProviders";
import { BilingualLabel } from "@/components/ui/BilingualLabel";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Decorative 8×3 pattern. Today's real grid needs `/data/dict/padabandha.json`, so the hub
 * shows a fixed sketch instead of fetching: b = black cell, s = solved, o = open.
 */
type CellKind = "b" | "s" | "o";
const PREVIEW = ["bssbboob", "obobbobo", "oobsboob"] as const;
const CELL: Record<CellKind, string> = {
  b: "bg-ink",
  s: "bg-accent",
  o: "border border-line",
};
const kindOf = (ch: string): CellKind => (ch === "b" ? "b" : ch === "s" ? "s" : "o");

/** ಪದಬಂಧ · Crossword block of the games hub: mini grid, the pitch, Play. */
export function CrosswordBlock() {
  const t = useT();
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading k="padabandhaTitle" />
      <div aria-hidden="true" className="grid w-fit grid-cols-8 gap-px">
        {PREVIEW.flatMap((row, r) =>
          Array.from(row, (ch, c) => <span key={`${r}-${c}`} className={`size-5 ${CELL[kindOf(ch)]}`} />),
        )}
      </div>
      <p className="text-base text-secondary">{t("padabandhaSub")}</p>
      <LinkButton href="/games/padabandha" variant="secondary" size="md" className="self-start">
        <BilingualLabel k="gamesPlay" />
      </LinkButton>
    </section>
  );
}
