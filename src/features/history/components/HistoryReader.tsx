"use client";

import { useT } from "@/components/providers/AppProviders";
import { BookReaderBottomBar } from "@/features/picturebooks/components/BookReaderBottomBar";
import { BookReaderTopBar } from "@/features/picturebooks/components/BookReaderTopBar";
import { historySeriesUrl } from "../lib/urls";
import { useBookPager } from "../lib/useBookPager";
import type { HistoryStory } from "../types";
import { HistoryFactsPage } from "./HistoryFactsPage";
import { HistoryProsePage } from "./HistoryProsePage";
import { HistoryScenePage } from "./HistoryScenePage";
import { HistorySourcesPage } from "./HistorySourcesPage";
import { HistoryTitlePage } from "./HistoryTitlePage";
import { HistoryVisitPage } from "./HistoryVisitPage";

/** Pages besides the scenes: title, ಪೀಠಿಕೆ, ಸಾರಾಂಶ, ನಿಮಗೆ ಗೊತ್ತೇ?, ಇಂದು ನೋಡಬಹುದು, ಆಧಾರಗಳು. */
const FIXED_PAGES = 6;

/**
 * A history story as a book you turn, like ಚಿತ್ರಕಥೆ: a title page, the introduction, one page per
 * scene with its picture and the evidence behind it, then the summary, the little-known facts,
 * where to see the evidence today, and the full list of sources. Swipe, tap the outer thirds,
 * use ← →, or the bottom bar; Aa cycles the text size.
 */
export function HistoryReader({ story, seriesTitle }: { story: HistoryStory; seriesTitle: string }) {
  const t = useT();
  const back = { href: historySeriesUrl(story.series), label: seriesTitle };
  const total = story.scenes.length + FIXED_PAGES;
  const { page, size, stripRef, goTo, onScroll, onStripClick, cycleSize } = useBookPager(total);

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-surface relative">
      <BookReaderTopBar title={story.title.kn} hasAudio={false} size={size} onCycleSize={cycleSize} back={back} />
      <div
        ref={stripRef}
        onScroll={onScroll}
        onClick={onStripClick}
        className="h-full w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [overscroll-behavior-x:contain]"
      >
        <HistoryTitlePage story={story} seriesTitle={seriesTitle} />
        <HistoryProsePage id="history-intro" heading={t("historyIntroduction")} paragraphs={story.introduction} size={size} />
        {story.scenes.map((scene, index) => (
          <HistoryScenePage key={scene.id} scene={scene} index={index} facts={story.facts} size={size} />
        ))}
        <HistoryProsePage id="history-summary" heading={t("historySummary")} paragraphs={story.summary} size={size} />
        <HistoryFactsPage story={story} />
        <HistoryVisitPage story={story} />
        <HistorySourcesPage story={story} back={back} onReadAgain={() => goTo(0)} />
      </div>
      <BookReaderBottomBar page={page} total={total} onPrev={() => goTo(page - 1)} onNext={() => goTo(page + 1)} />
    </div>
  );
}
