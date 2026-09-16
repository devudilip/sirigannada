import type { Metadata } from "next";
import { BookShelf } from "@/features/library/components/BookShelf";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";
import { PicturebooksShelf } from "@/features/picturebooks/components/PicturebooksShelf";
import { StoriesShelfLink } from "@/features/stories/components/StoriesShelfLink";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

export default function LibraryPage() {
  // Audio stories are linked only once a licensed recording ships (see GH #80).
  const hasStories = readStoriesManifest().stories.length > 0;
  return (
    <div className="mx-auto max-w-2xl md:max-w-4xl px-5 pt-6">
      <LibraryHeader />
      <div className="mb-8 flex flex-col gap-6">
        <PicturebooksShelf limit={6} />
        {hasStories && <StoriesShelfLink />}
      </div>
      <BookShelf />
      <DownloadBooksButton />
    </div>
  );
}
