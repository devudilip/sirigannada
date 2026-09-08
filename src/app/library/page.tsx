import type { Metadata } from "next";
import { BookShelf } from "@/features/library/components/BookShelf";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { LibraryHeader } from "@/features/library/components/LibraryHeader";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-2xl md:max-w-4xl px-5 pt-6">
      <LibraryHeader />
      <BookShelf />
      <DownloadBooksButton />
    </div>
  );
}
