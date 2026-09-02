"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Book, DictEntry } from "@/lib/types";
import { lookupInflected } from "@/features/dictionary/lib/search";
import { useReaderSettings, readProgress, writeProgress, readBookmark, writeBookmark } from "../lib/settings";
import { usePageLayout, textBox } from "../lib/usePageLayout";
import { pagesInView, viewCount as countViews, viewOfPage } from "../lib/flipMath";
import { chapterOfBlock, chapterStarts, firstBlockOnPage, pageOfBlock } from "../lib/blockMap";
import { blockCount, hashBlock } from "../lib/versePermalink";
import { useVerseLink } from "../lib/useVerseLink";
import { BookFlow } from "./BookFlow";
import { BookStage, type BookStageHandle } from "./BookStage";
import { CopiedToast } from "./CopiedToast";
import { ReaderBottomBar, ReaderTopBar } from "./ReaderBars";
import { ChaptersSheet, LookupSheet, SettingsSheet } from "./ReaderSheets";

const BAR_SPACE = 56;

/** A `#b<index>` permalink wins over saved progress; otherwise resume where the reader left off. */
function initialBlock(slug: string, total: number): number {
  const fromHash = typeof window === "undefined" ? null : hashBlock(window.location.hash, total);
  return fromHash ?? readProgress(slug)?.block ?? 0;
}

export function ReaderView({ book }: { book: Book }) {
  const { settings, update, stepFont } = useReaderSettings();
  const stageBoxRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<BookStageHandle | null>(null);
  const layout = usePageLayout(stageBoxRef, measureRef, settings, book.slug);

  const totalBlocks = useMemo(() => blockCount(book), [book]);
  const [view, setView] = useState(0);
  const anchorBlock = useRef<number>(initialBlock(book.slug, totalBlocks));
  const { copiedBlock, copyBlockLink } = useVerseLink(book.slug);
  const [bookmark, setBookmark] = useState<number | null>(null);
  const [chrome, setChrome] = useState(true);
  const [sheet, setSheet] = useState<"settings" | "chapters" | null>(null);
  const [lookup, setLookup] = useState<{ word: string; entry: DictEntry | null | undefined } | null>(null);

  const starts = useMemo(() => chapterStarts(book), [book]);
  const stride = layout ? textBox(layout).stride : 1;
  const layoutKey = layout
    ? `${layout.mode}:${layout.pageCount}:${layout.pageWidth}:${layout.padding}:${settings.fontScale}:${settings.font}:${settings.lineHeight}`
    : "";

  useEffect(() => setBookmark(readBookmark(book.slug)), [book.slug]);

  // Whenever the layout changes (resize, font size), re-find the page holding the anchor block.
  useEffect(() => {
    if (!layout) return;
    const page = pageOfBlock(measureRef.current, anchorBlock.current, stride);
    setView(Math.min(viewOfPage(page, layout.mode), countViews(layout.pageCount, layout.mode) - 1));
    writeProgress(book.slug, anchorBlock.current, page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey]);

  const onViewChange = useCallback(
    (next: number) => {
      if (!layout) return;
      setView(next);
      const [first] = pagesInView(next, layout.pageCount, layout.mode);
      anchorBlock.current = firstBlockOnPage(measureRef.current, Math.max(0, first), stride);
      writeProgress(book.slug, anchorBlock.current, Math.max(0, first) + 1);
    },
    [layout, stride, book.slug]
  );

  const goToBlock = useCallback(
    (block: number) => {
      if (!layout) return;
      anchorBlock.current = block;
      const page = pageOfBlock(measureRef.current, block, stride);
      const next = viewOfPage(page, layout.mode);
      setView(next);
      writeProgress(book.slug, block, page + 1);
      setSheet(null);
    },
    [layout, stride, book.slug]
  );

  // A permalink pasted into the address bar of an open reader (same page, new hash).
  useEffect(() => {
    const onHashChange = () => {
      const block = hashBlock(window.location.hash, totalBlocks);
      if (block !== null) goToBlock(block);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [goToBlock, totalBlocks]);

  const toggleBookmark = () => {
    const next = bookmark !== null && isBookmarkInView ? null : anchorBlock.current;
    setBookmark(next);
    writeBookmark(book.slug, next);
  };

  const onWordTap = useCallback((word: string) => {
    setLookup({ word, entry: undefined });
    lookupInflected(word).then((entry) => setLookup((cur) => (cur && cur.word === word ? { word, entry } : cur)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sheet || lookup) return;
      if (e.key === "ArrowRight" || e.key === " ") stageRef.current?.turn("forward");
      if (e.key === "ArrowLeft") stageRef.current?.turn("backward");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, lookup]);

  const currentPages = layout ? pagesInView(view, layout.pageCount, layout.mode) : [0, -1];
  const currentChapter = chapterOfBlock(starts, anchorBlock.current);
  const isBookmarkInView =
    bookmark !== null && layout
      ? currentPages.filter((p) => p >= 0).some((p) => pageOfBlock(measureRef.current, bookmark, stride) === p)
      : false;
  const totalViews = layout ? countViews(layout.pageCount, layout.mode) : 1;

  return (
    <div data-paper={settings.paper} className="relative h-dvh w-full overflow-hidden" style={{ background: "var(--sg-paper-edge)" }}>
      <div ref={stageBoxRef} className="absolute inset-x-0 flex items-center justify-center" style={{ top: BAR_SPACE, bottom: BAR_SPACE }}>
        {layout && (
          <>
            <div className="absolute left-0 top-0 pointer-events-none" aria-hidden="true">
              <BookFlow
                ref={measureRef}
                book={book}
                pageWidth={textBox(layout).width}
                pageHeight={textBox(layout).height}
                gap={layout.gap}
                fontScale={settings.fontScale}
                font={settings.font}
                lineHeight={settings.lineHeight}
                page={0}
                measuring
              />
            </div>
            <BookStage
              ref={stageRef}
              book={book}
              layout={layout}
              settings={settings}
              view={view}
              onViewChange={onViewChange}
              onWordTap={onWordTap}
              onCenterTap={() => setChrome((c) => !c)}
              onBlockLongPress={copyBlockLink}
            />
          </>
        )}
      </div>

      <ReaderTopBar
        visible={chrome}
        title={book.title}
        chapterTitle={book.chapters[currentChapter]?.title ?? ""}
        bookmarked={isBookmarkInView}
        onBookmark={toggleBookmark}
        onChapters={() => setSheet("chapters")}
        onSettings={() => setSheet("settings")}
      />
      <ReaderBottomBar
        visible={chrome}
        view={view}
        viewCount={totalViews}
        onPrev={() => stageRef.current?.turn("backward")}
        onNext={() => stageRef.current?.turn("forward")}
      />

      <SettingsSheet open={sheet === "settings"} onClose={() => setSheet(null)} settings={settings} onStepFont={stepFont} onUpdate={update} />
      <ChaptersSheet
        open={sheet === "chapters"}
        onClose={() => setSheet(null)}
        book={book}
        currentChapter={currentChapter}
        hasBookmark={bookmark !== null}
        onSelect={(i) => goToBlock(starts[i] ?? 0)}
        onGoToBookmark={() => bookmark !== null && goToBlock(bookmark)}
      />
      <LookupSheet word={lookup?.word ?? null} entry={lookup?.entry} onClose={() => setLookup(null)} />
      <CopiedToast visible={copiedBlock !== null} />
    </div>
  );
}
