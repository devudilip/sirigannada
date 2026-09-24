import type { Metadata } from "next";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { BookShelf } from "@/features/library/components/BookShelf";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";
import { PicturebooksShelf } from "@/features/picturebooks/components/PicturebooksShelf";
import { StoriesShelfLink } from "@/features/stories/components/StoriesShelfLink";
import { readChildStories, storyUrl } from "@/features/children/lib/catalog";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

export default function LibraryPage() {
  // Audio stories are linked only once a licensed recording ships (see GH #80).
  const hasStories = readStoriesManifest().stories.length > 0;
  const children = readChildStories();
  const first = children[0];
  const lead = first && { href: storyUrl(first), image: first.image, alt: first.scenes[0]?.imageAlt ?? first.title.kn, title: first.title.kn };
  return (
    <div className="mx-auto max-w-2xl md:max-w-4xl px-5 pt-6">
      <LibraryHeader />
      <div className="mb-8 flex flex-col gap-6">
        <PicturebooksShelf limit={6} lead={lead} leadCount={children.length} />
        {hasStories && <StoriesShelfLink />}
      </div>
      <ul className="mb-6">
        <li><DestinationLink href="/search" titleKey="corpusSearchLibraryLink" subKey="corpusSearchHint" compact /></li>
      </ul>
      <BookShelf />
      <DownloadBooksButton />
    </div>
  );
}
