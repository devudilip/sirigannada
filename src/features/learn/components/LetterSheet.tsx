"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { Button, IconButton } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { useT } from "@/components/providers/AppProviders";
import { toIso15919 } from "@/lib/iso15919";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { type ShareCardInput } from "@/features/share/lib/shareCard";
import { hearLetter, letterMedia } from "../lib/letterMedia";
import { renderLetterImage } from "../lib/letterVideo";
import { LetterShare } from "./LetterShare";
import { LETTER_WORDS, wordPictureSrc } from "../lib/letterWords";

/** Popup for one alphabet letter: how it is written (and how it sounds) on the left, words that begin with it on the right. */
export function LetterSheet({ glyph, onClose, onStep }: { glyph: string | null; onClose: () => void; onStep: (by: -1 | 1) => void }) {
  const t = useT();
  const speak = useSpeakKannada();
  const [sharingImage, setSharingImage] = useState(false);
  // Memoised: ShareCardSheet re-renders the PNG whenever `input` changes identity.
  const imageInput = useMemo<ShareCardInput | null>(() => {
    if (glyph === null) return null;
    const words = LETTER_WORDS[glyph] ?? [];
    return {
      kind: "letter",
      main: glyph,
      support: [toIso15919(glyph), ...words.map(({ word, en }) => `${word} — ${en}`)].join("\n"),
      url: `${location.origin}${location.pathname}`,
      size: "portrait",
    };
  }, [glyph]);
  const renderImage = useCallback(
    (canvas: HTMLCanvasElement) => renderLetterImage(canvas, glyph!, `${location.origin}${location.pathname}`),
    [glyph],
  );

  useEffect(() => {
    if (glyph === null || sharingImage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onStep(-1);
      if (event.key === "ArrowRight") onStep(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [glyph, onStep, sharingImage]);

  const media = glyph === null ? null : letterMedia(glyph);
  if (glyph === null || !media) return null;
  const words = LETTER_WORDS[glyph] ?? [];

  // The image share sheet replaces the popup while open (no stacked dialogs); closing it returns here.
  if (sharingImage) return <ShareCardSheet open onClose={() => setSharingImage(false)} input={imageInput} render={renderImage} />;

  return (
    <Sheet open wide onClose={onClose} title={t("letterSheetTitle", { letter: glyph })}>
      <div className="-mx-5 flex items-center">
        <IconButton onClick={() => onStep(-1)} aria-label={t("letterSheetPrevious")} className="w-7 shrink-0">
          <ChevronLeftIcon size={22} />
        </IconButton>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
            <img src={media.gif} alt="" className="letter-card aspect-square w-full max-w-60 rounded-md border border-line object-contain p-2" />
            <span className="text-sm text-muted" lang="en">{toIso15919(glyph)}</span>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => hearLetter(glyph, speak)} data-sheet-initial-focus>
                {t("letterSheetHear")}
              </Button>
              <LetterShare key={glyph} glyph={glyph} onImage={() => setSharingImage(true)} />
            </div>
          </div>
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-secondary">{t("letterSheetWords")}</h3>
            {words.length === 0 ? (
              <p className="text-sm text-secondary">{t("letterSheetNoWords")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {words.map(({ word, en, picture }) => (
                  <li key={word} className="flex items-center gap-3">
                    {picture && (
                      // eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export
                      <img src={wordPictureSrc(picture)} alt="" loading="lazy" className="letter-card size-20 sm:size-24 shrink-0 rounded-md border border-line object-contain" />
                    )}
                    <span className="flex flex-col">
                      <span className="font-serif text-lg font-semibold text-ink" lang="kn">{word}</span>
                      <span className="text-xs text-muted" lang="en">{toIso15919(word)} · {en}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <IconButton onClick={() => onStep(1)} aria-label={t("letterSheetNext")} className="w-7 shrink-0">
          <ChevronRightIcon size={22} />
        </IconButton>
      </div>
      <p className="mt-4 text-2xs text-muted">
        <a className="underline" href={media.gifSource} rel="noopener noreferrer">{t("letterSheetAnimationBy")}</a>
        {" · "}
        <a className="underline" href={media.audioSource} rel="noopener noreferrer">{t("letterSheetVoiceBy")}</a>
        {" · Wikimedia Commons, "}
        <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener noreferrer">CC BY-SA 4.0</a>
      </p>
    </Sheet>
  );
}
