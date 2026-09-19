"use client";

import { useEffect, useState } from "react";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { fetchTodaysPadabandhaId } from "@/features/padabandha/lib/today";
import { decodeBlob } from "../lib/blobCodec";
import { applyProgress } from "../lib/applyProgress";
import type { ProgressBlob } from "../types";

type Phase =
  | { k: "working" }
  | { k: "confirm"; blob: ProgressBlob }
  | { k: "applying" }
  | { k: "done"; route: string }
  | { k: "bad" };

/**
 * Landing screen for a continue link. The blob rides in the hash (`/continue#<blob>`), so there
 * is never a server round-trip. Decode -> show what it would change -> apply only on a tap ->
 * redirect. A missing, malformed, or expired blob shows a bilingual error instead. Anyone can
 * mint a link (nothing is signed), so nothing is written to this device until the user confirms.
 */
export function ContinuePage() {
  const t = useT();
  const { locale } = useApp();
  const manifest = useBooksManifest();
  const [phase, setPhase] = useState<Phase>({ k: "working" });

  useEffect(() => {
    const code = window.location.hash.replace(/^#/, "");
    const blob = code ? decodeBlob(code) : null;
    setPhase(blob ? { k: "confirm", blob } : { k: "bad" });
  }, []);

  const confirm = async () => {
    if (phase.k !== "confirm") return;
    const { blob } = phase;
    setPhase({ k: "applying" });
    const todaysPadabandhaId = blob.padabandha ? await fetchTodaysPadabandhaId(locale) : undefined;
    const { route } = applyProgress(blob, { todaysPadabandhaId });
    setPhase({ k: "done", route });
    // Full navigation, not the SPA router: the target pages are static and this must not depend
    // on the client router having hydrated (mobile / dev-server first loads were flaky).
    window.setTimeout(() => window.location.replace(route), 500);
  };

  const book = phase.k === "confirm" && phase.blob.library ? manifest?.books.find((b) => b.slug === phase.blob.library!.bookId) : undefined;
  const bookLabel = phase.k === "confirm" && phase.blob.library ? (book ? (locale === "kn" ? book.title : (book.titleEn ?? book.title)) : phase.blob.library.bookId) : "";
  const games =
    phase.k === "confirm"
      ? [phase.blob.padabandha && t("padabandhaTitle"), phase.blob.dailyWord && t("wordGameTitle")].filter((g): g is string => Boolean(g))
      : [];
  const starCount = phase.k === "confirm" && phase.blob.stars ? phase.blob.stars.words.length + phase.blob.stars.gade.length : 0;

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      {phase.k === "working" && <p className="text-base text-secondary">{t("continueApplying")}</p>}

      {phase.k === "confirm" && (
        <>
          <p className="text-lg font-semibold text-ink">{t("continueConfirmTitle")}</p>
          <p className="text-base text-secondary">{t("continueConfirmIntro")}</p>
          <ul className="flex flex-col gap-1 text-base text-ink">
            {phase.blob.library && (
              <li>{t("continueConfirmReading", { book: bookLabel, page: phase.blob.library.page ?? 1 })}</li>
            )}
            {games.length > 0 && <li>{t("continueConfirmGames", { games: games.join(" · ") })}</li>}
            {starCount > 0 && <li>{t("continueConfirmStars", { n: starCount })}</li>}
          </ul>
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={() => void confirm()}>
              {t("continueConfirmApply")}
            </Button>
            <a href="/" className="inline-flex min-h-11 items-center px-3 text-base text-secondary hover:text-ink">
              {t("continueConfirmCancel")}
            </a>
          </div>
        </>
      )}

      {phase.k === "applying" && <p className="text-base text-secondary">{t("continueApplying")}</p>}

      {phase.k === "done" && (
        <>
          <p className="text-base text-ink">{t("continueDone")}</p>
          <a href={phase.route} className="font-medium text-accent hover:underline">
            {t("continueOpenManually")}
          </a>
        </>
      )}

      {phase.k === "bad" && (
        <>
          <p className="text-lg font-semibold text-ink">{t("continueBadLink")}</p>
          <p className="text-base text-secondary">{t("continueBadLinkHelp")}</p>
          <a href="/" className="font-medium text-accent hover:underline">
            {t("navHome")}
          </a>
        </>
      )}
    </div>
  );
}
