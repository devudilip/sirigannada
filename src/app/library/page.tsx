import type { Metadata } from "next";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { BookShelf } from "@/features/library/components/BookShelf";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";
import { StoriesShelfLink } from "@/features/stories/components/StoriesShelfLink";
import { readAdultCollection, readAdultStories } from "@/features/children/lib/catalog";
import { ADULT_STORIES_URL } from "@/features/children/lib/sections";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";
import { strings } from "@/lib/i18n";
import { toKannadaDigits } from "@/lib/kannada";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

/**
 * ಗ್ರಂಥಾಲಯ: the search box and form chips, then every book as a box. ಚಿತ್ರಕಥೆ (the illustrated 16+
 * tales) is one more box on that shelf; children's stories live only under ಮಕ್ಕಳ ಕಥೆಗಳು.
 */
export default function LibraryPage() {
  // Audio stories are linked only once a licensed recording ships (see GH #80).
  const hasStories = readStoriesManifest().stories.length > 0;
  const tales = readAdultStories();
  const section = readAdultCollection();
  const first = tales[0];
  const extra = section && first ? {
    href: ADULT_STORIES_URL,
    title: section.title.kn,
    sub: `${strings.childrenStoryCount.kn.replace("{n}", toKannadaDigits(tales.length))} · ೧೬+`,
    image: first.image,
    alt: first.scenes[0]?.imageAlt ?? first.title.kn,
  } : undefined;
  return (
    <div className="mx-auto max-w-2xl md:max-w-4xl px-5 pt-6">
      <LibraryHeader />
      {hasStories && <div className="mb-8"><StoriesShelfLink /></div>}
      <BookShelf extra={extra} />
      <ul className="mt-8 mb-6">
        <li><DestinationLink href="/search" titleKey="corpusSearchLibraryLink" subKey="corpusSearchHint" compact /></li>
      </ul>
      <DownloadBooksButton />
    </div>
  );
}
