"use client";

import { useEffect, useMemo, useState } from "react";
import { ShareIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { ContinueButton } from "@/features/continue/components/ContinueButton";
import { loadProverbs } from "@/features/proverbs/lib/load";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import type { Proverb } from "@/lib/types";
import { gadeOutcome, gadePool, gadeTiles, keptSlots, todaysGade } from "../lib/gadePurna";
import { MAX_TRIES, loadGadeState, saveGadeState, type GadeState } from "../lib/gadeState";
import { dateKey } from "../lib/wordGameDay";

const TILE = "min-h-11 rounded-md border px-3 py-2 font-serif text-lg";

/**
 * ಗಾದೆ ಪೂರ್ಣ · Finish the proverb (#135). The day's ಗಾದೆ comes from the precached proverbs file,
 * so it plays offline; the tries for the day stay on this device (and travel in a continue link).
 */
export function GadePurna() {
  const t = useT();
  const [proverbs, setProverbs] = useState<Proverb[] | null>(null);
  const [state, setState] = useState<GadeState | null>(null);
  /** One entry per blank: the index into `tiles` placed there, or null while empty. */
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    loadProverbs().then((file) => setProverbs(file?.proverbs ?? []));
    setState(loadGadeState(dateKey(today)));
  }, [today]);

  const pool = useMemo(() => (proverbs ? gadePool(proverbs) : []), [proverbs]);
  const puzzle = useMemo(() => todaysGade(pool, today), [pool, today]);
  const tiles = useMemo(() => (puzzle ? gadeTiles(puzzle, pool, today) : []), [puzzle, pool, today]);

  // Coming back mid-game: start from the last try's right-place words, as a fresh miss would.
  useEffect(() => {
    const last = state?.tries.at(-1);
    if (puzzle && last && gadeOutcome(state!, puzzle.answer) === "playing") setSlots(keptSlots(last, puzzle.answer, tiles));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when today's tiles are known
  }, [puzzle, tiles]);

  if (proverbs === null || state === null) return <Skeleton className="h-64 w-full" />;
  if (!puzzle) return <p className="text-base text-secondary">{t("noResults")}</p>;

  const outcome = gadeOutcome(state, puzzle.answer);
  const lastMiss = outcome === "playing" ? state.tries.at(-1) : undefined;
  const blanks = puzzle.answer.map((_, i) => slots[i] ?? null);
  const used = new Set(blanks.filter((i): i is number => i !== null));
  const full = !blanks.includes(null);

  const place = (tile: number) => {
    const at = blanks.indexOf(null);
    if (at >= 0) setSlots(blanks.map((v, i) => (i === at ? tile : v)));
  };

  const check = () => {
    const attempt = blanks.map((i) => tiles[i!]!);
    const next = { ...state, tries: [...state.tries, attempt] };
    saveGadeState(next);
    setState(next);
    setSlots(keptSlots(attempt, puzzle.answer, tiles));
  };

  return (
    <div className="flex flex-col gap-5">
      <p lang="kn" className="font-serif text-2xl font-semibold text-ink leading-kannada">
        {puzzle.first}{" "}
        {outcome === "playing" ? (
          <span className="text-muted">…</span>
        ) : (
          <span className="text-accent">{puzzle.answer.join(" ")}</span>
        )}
      </p>

      {outcome === "playing" ? (
        <>
          <p className="text-sm text-secondary">{t("gadeHowTo")}</p>
          <div className="flex flex-wrap gap-2">
            {blanks.map((tile, slot) => {
              const kept = tile !== null && lastMiss?.[slot] === puzzle.answer[slot] && tiles[tile] === puzzle.answer[slot];
              return (
                <button
                  key={slot}
                  type="button"
                  lang="kn"
                  aria-label={tile === null ? t("gadeSlot", { n: slot + 1 }) : undefined}
                  disabled={tile === null}
                  onClick={() => setSlots(blanks.map((v, i) => (i === slot ? null : v)))}
                  className={`${TILE} min-w-16 text-ink ${
                    kept ? "border-accent bg-accent-soft" : tile === null ? "border-dashed border-line-strong" : "border-line-strong bg-elevated"
                  }`}
                >
                  {tile === null ? "" : tiles[tile]}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label={t("gadeTiles")} className="flex flex-wrap gap-2">
            {tiles.map((word, i) => (
              <button
                key={i}
                type="button"
                lang="kn"
                disabled={used.has(i) || full}
                onClick={() => place(i)}
                className={`${TILE} border-line bg-elevated text-ink disabled:opacity-40`}
              >
                {word}
              </button>
            ))}
          </div>
          {lastMiss && <p role="status" className="text-base text-ink">{t("gadeMissHint")}</p>}
          <p className="text-sm text-muted">{t("gadeTriesLeft", { n: MAX_TRIES - state.tries.length })}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={check} disabled={!full}>{t("gadeCheck")}</Button>
            <Button variant="secondary" onClick={() => setSlots([])} disabled={used.size === 0}>{t("gadeClear")}</Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3 border border-line bg-elevated p-4">
          <p role="status" className="text-lg font-semibold text-ink">{t(outcome === "won" ? "gadeWon" : "gadeLost")}</p>
          <p lang="kn" className="font-serif text-xl text-ink">{puzzle.proverb.text}</p>
          <p className="text-base text-muted">{t("gamesTomorrowNote")}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setShareOpen(true)}>
              <ShareIcon size={18} />
              {t("shareCardAction")}
            </Button>
            <LinkButton href="/proverbs" variant="secondary" size="md">{t("gadeAllProverbs")}</LinkButton>
          </div>
          <ShareCardSheet
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            input={
              shareOpen
                ? { kind: "gade", main: puzzle.proverb.text, url: `${CANONICAL_ORIGIN}/games/gade`, source: "Wikiquote", size: "portrait" }
                : null
            }
          />
        </div>
      )}

      <ContinueButton />
      <p className="text-2xs text-muted">{t("gadeCredit")}</p>
    </div>
  );
}
