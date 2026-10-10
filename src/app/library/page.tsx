import type { Metadata } from "next";
import { BookShelf } from "@/features/library/components/BookShelf";
import type { ShelfTile } from "@/features/library/components/BookTile";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";
import { StoriesShelfLink } from "@/features/stories/components/StoriesShelfLink";
import { readAdultCollection, readAdultStories } from "@/features/children/lib/catalog";
import { ADULT_STORIES_URL } from "@/features/children/lib/sections";
import { HISTORY_URL, readAllHistoryStories, readHistorySeries } from "@/features/history/lib/catalog";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";
import { strings } from "@/lib/i18n";
import { toKannadaDigits } from "@/lib/kannada";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

/** The ಚಿತ್ರಕಥೆ box (the illustrated 16+ tales), when that section exists. */
function chitrakatheTile(): ShelfTile | undefined {
  const tales = readAdultStories();
  const section = readAdultCollection();
  const first = tales[0];
  if (!section || !first) return undefined;
  return {
    id: "chitrakathe",
    href: ADULT_STORIES_URL,
    title: section.title.kn,
    sub: `${strings.childrenStoryCount.kn.replace("{n}", toKannadaDigits(tales.length))} · ೧೬+`,
    cover: { kind: "storyboard", image: first.image, alt: first.scenes[0]?.imageAlt ?? first.title.kn },
  };
}

/** The ಕರ್ನಾಟಕ ಇತಿಹಾಸ box: its cover is the first published story's picture, or the title until one ships. */
function historyTile(): ShelfTile {
  const series = readHistorySeries();
  const first = readAllHistoryStories()[0];
  return {
    id: "karnataka-itihasa",
    href: HISTORY_URL,
    title: strings.historyTitle.kn,
    sub: strings.historySeriesCount.kn.replace("{n}", toKannadaDigits(series.length)),
    cover: first ? { kind: "picture", image: first.cover, alt: first.title.kn } : { kind: "text" },
  };
}

/**
 * ಗ್ರಂಥಾಲಯ: the search box and form chips, then every book as a box. ಚಿತ್ರಕಥೆ (the illustrated 16+
 * tales) and ಕರ್ನಾಟಕ ಇತಿಹಾಸ (the illustrated history series) are two more boxes on that shelf;
 * children's stories live only under ಮಕ್ಕಳ ಕಥೆಗಳು.
 */
export default function LibraryPage() {
  // Audio stories are linked only once a licensed recording ships (see GH #80).
  const hasStories = readStoriesManifest().stories.length > 0;
  const extras = [chitrakatheTile(), historyTile()].filter((tile): tile is ShelfTile => tile !== undefined);
  return (
    <div className="mx-auto max-w-2xl md:max-w-4xl px-5 pt-6">
      <LibraryHeader />
      {hasStories && <div className="mb-8"><StoriesShelfLink /></div>}
      <BookShelf extras={extras} />
      <div className="mt-8"><DownloadBooksButton /></div>
    </div>
  );
}
