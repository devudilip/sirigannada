"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Book } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { lookupInflected } from "@/features/dictionary/lib/search";
import { licenseLabelKey } from "@/features/credits/lib/licenseLabel";
import { useReaderSettings, readProgress, writeProgress, readBookmark, writeBookmark } from "../lib/settings";
import { usePageLayout, textBox } from "../lib/usePageLayout";
import { pagesInView, viewCount as countViews, viewOfPage } from "../lib/flipMath";
import { chapterOfBlock, chapterStarts, firstBlockOnPage, pageOfBlock } from "../lib/blockMap";
import { blockCount, blockText, hashBlock } from "../lib/versePermalink";
import { sourceHost, tickFractions } from "../lib/readerFooter";
import { useVerseLink } from "../lib/useVerseLink";
import { BookStage, type BookStageHandle } from "./BookStage";
import { MeasureFlow } from "./MeasureFlow";
import { ReaderBottomBar, ReaderTopBar } from "./ReaderBars";
import { ReaderOverlays, type ReaderLookup, type ReaderSheet } from "./ReaderOverlays";

const BAR_SPACE = 56;

/** A `#b<index>` permalink wins over saved progress; otherwise resume where the reader left off. */
function initialBlock(slug: string, total: number): number {
  const fromHash = typeof window === "undefined" ? null : hashBlock(window.location.hash, total);
  return fromHash ?? readProgress(slug)?.block ?? 0;
}

export function ReaderView({ book }: { book: Book }) {
  const t = useT();
  const { settings, update, stepFont } = useReaderSettings();
  const stageBoxRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<BookStageHandle | null>(null);
  const layout = usePageLayout(stageBoxRef, measureRef, settings, book.slug);

  const totalBlocks = useMemo(() => blockCount(book), [book]);
  const [view, setView] = useState(0);
  const [activeBlock, setActiveBlock] = useState(() => initialBlock(book.slug, totalBlocks));
  const anchorBlock = useRef<number>(activeBlock);
  const { copiedBlock, copyBlockLink } = useVerseLink(book.slug);
  const [bookmark, setBookmark] = useState<number | null>(null);
  const [chrome, setChrome] = useState(true);
  const [sheet, setSheet] = useState<ReaderSheet>(null);
  const [lookup, setLookup] = useState<ReaderLookup | null>(null);
  const [actionBlock, setActionBlock] = useState<number | null>(null);
  const [shareBlock, setShareBlock] = useState<number | null>(null);
  const [ticks, setTicks] = useState<number[]>([]);

  const starts = useMemo(() => chapterStarts(book), [book]);
  const stride = layout ? textBox(layout).stride : 1;
  const layoutKey = layout
    ? `${layout.mode}:${layout.pageCount}:${layout.pageWidth}:${layout.padding}:${settings.fontScale}:${settings.font}:${settings.lineHeight}`
    : "";

  const pageFor = useCallback((block: number) => pageOfBlock(measureRef.current, block, stride), [stride]);
  const blockOnPage = useCallback((page: number) => firstBlockOnPage(measureRef.current, page, stride), [stride]);

  useEffect(() => setBookmark(readBookmark(book.slug)), [book.slug]);

  // Whenever the layout changes (resize, font size), re-find the page holding the anchor block.
  useEffect(() => {
    if (!layout) return;
    const page = pageFor(anchorBlock.current);
    const views = countViews(layout.pageCount, layout.mode);
    setView(Math.min(viewOfPage(page, layout.mode), views - 1));
    setTicks(tickFractions(starts.map((b) => viewOfPage(pageFor(b), layout.mode)), views));
    writeProgress(book.slug, anchorBlock.current, page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey]);

  const onViewChange = useCallback(
    (next: number) => {
      if (!layout) return;
      setView(next);
      const [first] = pagesInView(next, layout.pageCount, layout.mode);
      anchorBlock.current = blockOnPage(Math.max(0, first));
      setActiveBlock(anchorBlock.current);
      writeProgress(book.slug, anchorBlock.current, Math.max(0, first) + 1);
    },
    [layout, blockOnPage, book.slug]
  );

  const goToBlock = useCallback(
    (block: number) => {
      if (!layout) return;
      anchorBlock.current = block;
      setActiveBlock(block);
      const page = pageFor(block);
      setView(viewOfPage(page, layout.mode));
      writeProgress(book.slug, block, page + 1);
      setSheet(null);
    },
    [layout, pageFor, book.slug]
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
    const next = bookmark !== null && isBookmarkInView ? null : activeBlock;
    setBookmark(next);
    writeBookmark(book.slug, next);
  };

  const onWordTap = useCallback((word: string) => {
    setLookup({ word, result: undefined });
    lookupInflected(word).then((result) => setLookup((cur) => (cur && cur.word === word ? { word, result } : cur)));
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
  const currentChapter = chapterOfBlock(starts, activeBlock);
  const isBookmarkInView =
    bookmark !== null && layout ? currentPages.filter((p) => p >= 0).some((p) => pageFor(bookmark) === p) : false;
  const totalViews = layout ? countViews(layout.pageCount, layout.mode) : 1;
  const licenseLabel = t(licenseLabelKey(book.provenance.license));

  return (
    <div data-paper={settings.paper} className="relative h-dvh w-full overflow-hidden" style={{ background: "var(--sg-paper-edge)" }}>
      <div ref={stageBoxRef} className="absolute inset-x-0 flex items-center justify-center" style={{ top: BAR_SPACE, bottom: BAR_SPACE }}>
        {layout && (
          <>
            <MeasureFlow book={book} layout={layout} settings={settings} flowRef={measureRef} />
            <BookStage
              ref={stageRef}
              book={book}
              layout={layout}
              settings={settings}
              view={view}
              onViewChange={onViewChange}
              onWordTap={onWordTap}
              onCenterTap={() => setChrome((c) => !c)}
              onBlockLongPress={setActionBlock}
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
        onSearch={() => setSheet("search")}
        onChapters={() => setSheet("chapters")}
        onSettings={() => setSheet("settings")}
        saveItem={{ kind: "verse", bookSlug: book.slug, blockIndex: activeBlock }}
      />
      <ReaderBottomBar
        visible={chrome}
        view={view}
        viewCount={totalViews}
        ticks={ticks}
        licenseLabel={licenseLabel}
        sourceHost={sourceHost(book.provenance.source)}
        onPrev={() => stageRef.current?.turn("backward")}
        onNext={() => stageRef.current?.turn("forward")}
        onPassageActions={() => setActionBlock(activeBlock)}
      />

      <section className="sr-only" lang="kn" aria-label={t("currentPassage")} aria-live="polite" aria-atomic="true">
        <h1>{book.title}</h1>
        <h2>{book.chapters[currentChapter]?.title ?? ""}</h2>
        <p>{blockText(book, activeBlock)}</p>
      </section>

      <ReaderOverlays
        book={book}
        sheet={sheet}
        onCloseSheet={() => setSheet(null)}
        settings={settings}
        onStepFont={stepFont}
        onUpdate={update}
        currentChapter={currentChapter}
        bookmark={bookmark}
        starts={starts}
        onGoToBlock={goToBlock}
        lookup={lookup}
        onCloseLookup={() => setLookup(null)}
        actionBlock={actionBlock}
        onCloseAction={() => setActionBlock(null)}
        onCopyLink={copyBlockLink}
        shareBlock={shareBlock}
        onShareBlock={setShareBlock}
        copiedBlock={copiedBlock}
        licenseLabel={licenseLabel}
      />
    </div>
  );
}
