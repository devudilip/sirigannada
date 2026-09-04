import type { Metadata } from "next";
import { BookShelf } from "@/features/library/components/BookShelf";
import { DownloadBooksButton } from "@/features/library/components/DownloadBooksButton";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = { title: "ಗ್ರಂಥಾಲಯ", alternates: { canonical: "/library" } };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8">
      <PageTitle k="navLibrary" />
      <DownloadBooksButton />
      <BookShelf />
    </div>
  );
}
