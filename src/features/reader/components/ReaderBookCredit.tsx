"use client";

import type { Book } from "@/lib/types";
import { useT } from "@/components/providers/AppProviders";
import { licenseLabelKey } from "@/features/credits/lib/licenseLabel";
import { sourceHost } from "../lib/readerFooter";

/**
 * "ಪರವಾನಗಿ: ಸಾರ್ವಜನಿಕ ಸ್ವತ್ತು · ಮೂಲ: kn.wikisource.org" under the chapter list: the book's
 * attribution inside the reader, now that the bottom bar carries only the page count.
 */
export function ReaderBookCredit({ book }: { book: Book }) {
  const t = useT();
  const host = sourceHost(book.provenance.source);
  return (
    <p className="mt-4 border-t border-line pt-3 text-sm text-muted">
      {t("license")}: {t(licenseLabelKey(book.provenance.license))}
      {host ? (
        <>
          {" · "}
          {t("source")}:{" "}
          <a className="text-accent-strong underline" href={book.provenance.source} rel="noopener noreferrer" lang="en">
            {host}
          </a>
        </>
      ) : null}
    </p>
  );
}
