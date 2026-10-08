"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { BookReaderBottomBar } from "@/features/picturebooks/components/BookReaderBottomBar";
import { BookReaderTopBar } from "@/features/picturebooks/components/BookReaderTopBar";
import { pageIndexFromScroll, scrollForPage } from "@/features/picturebooks/lib/pageIndex";
import { DEFAULT_TEXT_SIZE, nextTextSize, readTextSize, writeTextSize, type TextSize } from "@/features/picturebooks/lib/textSize";
import { toKannadaDigits } from "@/lib/kannada";
import { sectionUrl } from "../lib/sections";
import type { ChildStory } from "../types";
import { StoryArt } from "./StoryArt";

const PAGE = "h-full w-full shrink-0 snap-center overflow-y-auto";

/**
 * ಚಿತ್ರಕಥೆ (16+) as a book you turn, like every other book in the library: a title page, one page
 * per chapter (the picture as a plate, the text beside it on wide screens and below it on phones),
 * and an end page with the source. Swipe, tap the outer thirds, use ← →, or the bottom bar.
 * The children's scaffolding (pause question, word list, discussion, parents' note) is left out.
 */
export function BookStoryReader({ story, sectionTitle }: { story: ChildStory; sectionTitle: string }) {
  const { t, locale } = useApp();
  const back = { href: sectionUrl(story.collection), label: sectionTitle };
  const total = story.scenes.length + 2;
  const [page, setPage] = useState(0);
  const [size, setSize] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => setSize(readTextSize()), []);
  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const goTo = useCallback((target: number) => {
    const el = stripRef.current;
    if (!el) return;
    const next = Math.min(total - 1, Math.max(0, target));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: scrollForPage(next, el.clientWidth), behavior: reduced ? "auto" : "smooth" });
  }, [total]);

  const onScroll = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const el = stripRef.current;
      if (el) setPage(pageIndexFromScroll(el.scrollLeft, el.clientWidth, total));
    });
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(page - 1);
      else if (e.key === "ArrowRight") goTo(page + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, page]);

  const onStripClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, summary, details")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goTo(page - 1);
    else if (x > (rect.width * 2) / 3) goTo(page + 1);
  }, [goTo, page]);

  const cycleSize = useCallback(() => {
    setSize((s) => {
      const n = nextTextSize(s);
      writeTextSize(n);
      return n;
    });
  }, []);

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-surface relative">
      <BookReaderTopBar title={story.title.kn} hasAudio={false} size={size} onCycleSize={cycleSize} back={back} />
      <div
        ref={stripRef}
        onScroll={onScroll}
        onClick={onStripClick}
        className="h-full w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [overscroll-behavior-x:contain]"
      >
        <section className={`${PAGE} flex flex-col items-center justify-center px-6 pt-14 pb-reader-bar text-center`} lang="kn">
          <div className="w-full max-w-sm border border-line bg-paper p-2 shadow-elevated">
            <StoryArt image={story.image} panel={0} alt={story.scenes[0]?.imageAlt ?? story.title.kn} className="aspect-square w-full rounded-none" />
          </div>
          <p className="mt-8 text-sm tracking-widest text-muted">{t("bookStorySource")}</p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold leading-tight text-ink">{story.title.kn}</h1>
          <p className="mt-3 text-sm text-muted">{toKannadaDigits(story.age)}</p>
        </section>

        {story.scenes.map((scene, index) => (
          <section key={scene.id} aria-labelledby={`${scene.id}-title`} className={`${PAGE} pt-14 md:flex md:flex-row`} lang="kn">
            <div className="bg-elevated p-4 md:w-1/2 md:h-full md:flex md:items-center md:justify-center md:pb-16">
              <StoryArt image={story.image} panel={scene.panel} alt={scene.imageAlt} className="mx-auto aspect-square w-full max-w-md rounded-none shadow-elevated" />
            </div>
            <div className="px-6 pt-6 pb-reader-bar md:w-1/2 md:h-full md:overflow-y-auto md:pt-10">
              <p className="font-serif text-base text-muted">{toKannadaDigits(index + 1)}</p>
              <h2 id={`${scene.id}-title`} className="font-serif text-2xl font-semibold text-ink">{scene.title}</h2>
              <div className="mt-4 font-serif text-ink" style={{ fontSize: `${size}px`, lineHeight: 1.8 }}>
                {scene.paragraphs.map((paragraph, i) => (
                  <p key={i} className={`text-pretty ${i === 0 ? "" : "indent-8"}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className={`${PAGE} flex items-center justify-center px-6 pt-14 pb-reader-bar`}>
          <div className="w-full max-w-md text-base text-secondary">
            <p className="text-center font-serif text-2xl font-semibold text-ink" lang="kn">{story.title.kn}</p>
            <div className="mt-6 flex flex-col gap-3">
              <p>{story.adaptation.credit[locale]}</p>
              <p>{story.adaptation.note[locale]}</p>
              <p>{story.illustrations.disclosure[locale]}</p>
              <a className="underline text-accent" href="https://creativecommons.org/licenses/by-sa/4.0/">{t("childrenLicense")}</a>
              <a className="underline text-accent" href={story.provenance.source}>{t("childrenSource")}</a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => goTo(0)} className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-elevated px-5 font-semibold text-ink hover:border-ink">
                {t("picturebooksReadAgain")}
              </button>
              <a href={back.href} className="inline-flex min-h-11 items-center rounded-full bg-accent-strong px-5 font-semibold text-on-accent">
                {sectionTitle}
              </a>
            </div>
          </div>
        </section>
      </div>
      <BookReaderBottomBar page={page} total={total} onPrev={() => goTo(page - 1)} onNext={() => goTo(page + 1)} />
    </div>
  );
}
