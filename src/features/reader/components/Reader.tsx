"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { useBook } from "../lib/useBook";
import { ReaderView } from "./ReaderView";

/** Route-level component: loads the book, then hands over to the full-screen ReaderView. */
export function Reader({ slug }: { slug: string }) {
  const t = useT();
  const state = useBook(slug);

  if (state.status === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-paper">
        <Skeleton className="w-full max-w-md h-[70dvh]" />
      </div>
    );
  }
  if (state.status === "missing") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-secondary">{t("noResults")}</p>
        <Link href="/library" className="text-accent font-medium hover:underline">
          ← {t("navLibrary")}
        </Link>
      </div>
    );
  }
  return <ReaderView book={state.book} />;
}
