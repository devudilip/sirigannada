"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { lookupInflected, type SearchResult } from "@/features/dictionary/lib/search";
import { StoryWordSheet } from "@/features/stories/components/StoryWordSheet";
import { usePlayer } from "@/features/stories/lib/PlayerContext";
import { bookAsStory } from "../lib/audio";
import { usePicturebook } from "../lib/manifest";
import { saveBookOffline, useBookCached } from "../lib/offline";
import { pageIndexFromScroll, scrollForPage } from "../lib/pageIndex";
import { readProgress, resumePage, writeProgress } from "../lib/progress";
import { DEFAULT_TEXT_SIZE, nextTextSize, readTextSize, writeTextSize, type TextSize } from "../lib/textSize";
import { BookReaderAttributionPage } from "./BookReaderAttributionPage";
import { BookReaderBottomBar } from "./BookReaderBottomBar";
import { BookReaderCoverPage } from "./BookReaderCoverPage";
import { BookReaderStoryPage } from "./BookReaderStoryPage";
import { BookReaderTopBar } from "./BookReaderTopBar";

const CHROME_HIDE_MS = 2000;

/** /picturebooks/[slug] — the full-screen reader: a horizontal, snap-scrolling strip of pages. */
export function BookReader({ slug }: { slug: string }) {
  const { locale, t } = useApp();
  const book = usePicturebook(slug);
  const player = usePlayer();
  const [cacheTick, setCacheTick] = useState(0);
  const cached = useBookCached(book ? slug : null, cacheTick);
  const [saving, setSaving] = useState(false);
  const [size, setSize] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const [page, setPage] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [word, setWord] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null | undefined>(undefined);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const resumedRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => setSize(readTextSize()), []);

  const total = book ? book.pages.length + 2 : 0;
  const isCurrentAudio = Boolean(book) && book?.audio !== null && player.story?.slug === book?.slug;

  const bumpChrome = useCallback(() => {
    setChromeVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChromeVisible(false), CHROME_HIDE_MS);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  // Resume at the saved page once, right after the book loads.
  useEffect(() => {
    if (!book || resumedRef.current || !stripRef.current) return;
    resumedRef.current = true;
    const start = resumePage(readProgress(slug));
    if (start > 0) {
      const width = stripRef.current.clientWidth;
      stripRef.current.scrollLeft = scrollForPage(start, width);
      setPage(start);
    }
    bumpChrome();
  }, [book, slug, bumpChrome]);

  const goTo = useCallback(
    (target: number, smooth: boolean) => {
      const el = stripRef.current;
      if (!el || total === 0) return;
      const next = Math.min(total - 1, Math.max(0, target));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: scrollForPage(next, el.clientWidth), behavior: smooth && !reduced ? "smooth" : "auto" });
    },
    [total],
  );

  const onScroll = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const el = stripRef.current;
      if (!el || total === 0) return;
      const next = pageIndexFromScroll(el.scrollLeft, el.clientWidth, total);
      setPage((prev) => {
        if (prev === next) return prev;
        if (book) writeProgress(slug, next, total);
        return next;
      });
    });
  }, [total, book, slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(page - 1, true);
      else if (e.key === "ArrowRight") goTo(page + 1, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, page]);

  const onStripClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const third = rect.width / 3;
      if (x < third) goTo(page - 1, true);
      else if (x > third * 2) goTo(page + 1, true);
      else setChromeVisible((v) => !v);
      bumpChrome();
    },
    [goTo, page, bumpChrome],
  );

  const cycleSize = useCallback(() => {
    setSize((s) => {
      const n = nextTextSize(s);
      writeTextSize(n);
      return n;
    });
  }, []);

  const onWord = useCallback((raw: string) => {
    setWord(raw);
    setResult(undefined);
    void lookupInflected(raw).then((r) => setResult(r));
  }, []);

  const onSave = useCallback(async () => {
    if (!book) return;
    setSaving(true);
    const ok = await saveBookOffline(book);
    setSaving(false);
    if (ok) setCacheTick((n) => n + 1);
  }, [book]);

  const onTogglePlay = useCallback(() => {
    if (!book || !book.audio) return;
    if (isCurrentAudio) player.toggle();
    else player.play(bookAsStory(book), []);
  }, [book, isCurrentAudio, player]);

  if (book === undefined) {
    return (
      <div className="h-dvh w-dvw flex items-center justify-center bg-surface p-6">
        <Skeleton className="w-full max-w-md h-[70dvh]" />
      </div>
    );
  }
  if (book === null) {
    return (
      <div className="h-dvh w-dvw flex flex-col items-center justify-center gap-4 p-6 text-center bg-surface">
        <p className="text-lg font-semibold text-ink">{t("picturebooksNotFoundTitle")}</p>
        <p className="text-secondary">{t("picturebooksNotFoundBody")}</p>
        <Link href="/picturebooks" className="text-accent-strong font-medium hover:underline">
          ← {t("picturebooksBack")}
        </Link>
      </div>
    );
  }

  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-surface relative">
      <BookReaderTopBar
        title={title}
        size={size}
        onCycleSize={cycleSize}
        visible={chromeVisible}
        hasAudio={book.audio !== null}
        playing={isCurrentAudio && player.playing}
        onTogglePlay={onTogglePlay}
      />
      <div
        ref={stripRef}
        onScroll={onScroll}
        onClick={onStripClick}
        className="h-full w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [overscroll-behavior-x:contain]"
      >
        <BookReaderCoverPage book={book} cached={cached} saving={saving} onSave={() => void onSave()} hasAudio={book.audio !== null} onListen={onTogglePlay} />
        {book.pages.map((p, i) => (
          <BookReaderStoryPage key={p.n} page={p} size={size} eager={Math.abs(i + 1 - page) <= 1} onWord={onWord} />
        ))}
        <BookReaderAttributionPage book={book} onReadAgain={() => goTo(0, true)} />
      </div>
      <BookReaderBottomBar
        page={page}
        total={total}
        onPrev={() => goTo(page - 1, true)}
        onNext={() => goTo(page + 1, true)}
        hasAudio={book.audio !== null}
        playing={isCurrentAudio && player.playing}
        onTogglePlay={onTogglePlay}
      />
      <StoryWordSheet
        word={word}
        result={result}
        onClose={() => setWord(null)}
        onHearAgain={() => {
          if (book.audio) onTogglePlay();
          setWord(null);
        }}
      />
    </div>
  );
}
