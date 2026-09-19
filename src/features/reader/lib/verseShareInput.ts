import type { Book } from "@/lib/types";
import type { Locale } from "@/lib/types";
import type { ShareCardInput } from "@/features/share/lib/shareCard";
import { CANONICAL_ORIGIN, blockText, versePermalinkUrl } from "./versePermalink";

/** Share-card payload for one verse: text, "title — author" in the UI locale, permalink, licence line. */
export function verseShareInput(book: Book, block: number, locale: Locale, licenseLine: string): ShareCardInput {
  const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
  const author = locale === "en" && book.authorEn ? book.authorEn : book.author;
  return {
    kind: "verse",
    main: blockText(book, block),
    support: `${title} — ${author}`,
    url: versePermalinkUrl(book.slug, block, CANONICAL_ORIGIN),
    source: licenseLine,
    size: "portrait",
  };
}
