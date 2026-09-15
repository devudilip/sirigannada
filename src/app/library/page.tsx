import type { Metadata } from "next";
import { BookShelf } from "@/features/library/components/BookShelf";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";
import { PicturebooksShelfLink } from "@/features/picturebooks/components/PicturebooksShelfLink";
import { StoriesShelfLink } from "@/features/stories/components/StoriesShelfLink";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-2xl md:max-w-4xl px-5 pt-6">
      <LibraryHeader />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <StoriesShelfLink />
        </div>
        <div className="flex-1">
          <PicturebooksShelfLink />
        </div>
      </div>
      <BookShelf />
      <DownloadBooksButton />
    </div>
  );
}
