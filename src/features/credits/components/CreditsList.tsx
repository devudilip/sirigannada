"use client";

import type { BookMeta } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { BookCredit } from "./BookCredit";

export function CreditsList({ books }: { books: BookMeta[] }) {
  const t = useT();
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">{t("creditsBooks")}</h2>
      <ul className="mt-2">
        {books.map((book) => (
          <BookCredit key={book.slug} book={book} />
        ))}
      </ul>
    </section>
  );
}
