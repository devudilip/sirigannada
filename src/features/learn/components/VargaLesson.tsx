"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSpeakKannada } from "@/lib/SpeakContext";
import { hearLetter, letterMedia } from "../lib/letterMedia";
import { OpenLetterContext } from "../lib/openLetter";
import { AVARGIYA_LETTERS, MEANING_PAIRS, VARGA_COLUMNS, VARGA_LESSON_LETTERS, VARGA_ROWS, VARGA_VIDEO_URL } from "../lib/varga";
import { LetterCell } from "./LetterCell";
import { LetterSheet } from "./LetterSheet";

const POPUP_LETTERS = VARGA_LESSON_LETTERS.filter((letter) => letterMedia(letter));

function LetterRow({ letters }: { letters: readonly string[] }) {
  return (
    <div className="grid grid-cols-5 gap-1 sm:max-w-sm">
      {letters.map((glyph) => <LetterCell key={glyph} glyph={glyph} />)}
    </div>
  );
}

/** ವ್ಯಂಜನ ವರ್ಗ: why the consonants run ಕ to ಪ, read as a short lesson with tappable letters. */
export function VargaLesson() {
  const { t, locale } = useApp();
  const speak = useSpeakKannada();
  const [glyph, setGlyph] = useState<string | null>(null);
  const open = (next: string) => {
    hearLetter(next, speak);
    setGlyph(next);
  };
  const step = (by: -1 | 1) => {
    if (glyph === null) return;
    const n = POPUP_LETTERS.length;
    open(POPUP_LETTERS[(POPUP_LETTERS.indexOf(glyph) + by + n) % n]!);
  };
  const lang = locale === "kn" ? "kn" : "en";

  return (
    <OpenLetterContext.Provider value={open}>
      <div className="flex flex-col gap-10" lang={lang}>
        <p className="text-base leading-relaxed text-ink">{t("vargaIntro")}</p>

        <section>
          <SectionHeading k="vargaFivePlaces" />
          <ol className="flex flex-col gap-6">
            {VARGA_ROWS.map((row, i) => (
              <li key={row.letters[0]} className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-ink">
                  <span className="text-muted">{locale === "kn" ? "೧೨೩೪೫"[i] : i + 1}. </span>
                  <span lang="kn">{row.letters[0]}-ವರ್ಗ</span> · {row.place[lang]}
                </h3>
                <LetterRow letters={row.letters} />
                <p className="text-base leading-relaxed text-secondary">{row.how[lang]}</p>
                <p className="text-sm text-muted">{row.words[lang]}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionHeading k="vargaColumnsTitle" />
          <p className="mb-4 text-base leading-relaxed text-secondary">{t("vargaColumnsIntro")}</p>
          <ul className="flex flex-col gap-3">
            {VARGA_COLUMNS.map((column) => (
              <li key={column.example} className="flex items-start gap-3">
                <div className="w-14 shrink-0"><LetterCell glyph={column.example} /></div>
                <div>
                  <p className="text-base font-semibold text-ink">{column.name[lang]}</p>
                  <p className="text-base leading-relaxed text-secondary">{column.tip[lang]}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading k="vargaMeaningTitle" />
          <p className="mb-4 text-base leading-relaxed text-secondary">{t("vargaMeaningIntro")}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {MEANING_PAIRS.map((pair) => (
              <li key={pair.a + pair.b} className="rounded-md border border-line bg-elevated p-3">
                <p className="font-serif text-2xl font-semibold text-ink" lang="kn">
                  {pair.a} <span className="text-muted">/</span> {pair.b}
                </p>
                <p className="text-sm text-muted" lang="kn">{pair.sounds}</p>
                <p className="mt-1 text-base text-secondary">{pair.meaning[lang]}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading k="vargaAvargiyaTitle" />
          <div className="mb-3 grid grid-cols-5 gap-1 sm:max-w-md sm:grid-cols-9">
            {AVARGIYA_LETTERS.map((g) => <LetterCell key={g} glyph={g} />)}
          </div>
          <p className="text-base leading-relaxed text-secondary">{t("vargaAvargiyaBody")}</p>
        </section>

        <a
          href={VARGA_VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-line px-3 py-2 text-base text-ink hover:border-accent"
        >
          {t("vargaVideo")}
        </a>
      </div>
      <LetterSheet glyph={glyph} onClose={() => setGlyph(null)} onStep={step} />
    </OpenLetterContext.Provider>
  );
}
