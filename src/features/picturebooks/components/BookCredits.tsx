"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { CHILDREN_URL } from "@/features/children/lib/sections";
import { PageTitle } from "@/components/ui/PageTitle";
import { Skeleton } from "@/components/ui/Card";
import { usePicturebook } from "../lib/manifest";

/** /picturebooks/[slug]/credits — the full CC BY 4.0 attribution for one book. */
export function BookCredits({ slug }: { slug: string }) {
  const { locale, t } = useApp();
  const book = usePicturebook(slug);

  if (book === undefined) return <Skeleton className="h-64" />;
  if (book === null) {
    return (
      <p className="text-secondary">
        {t("picturebooksNotFoundBody")}{" "}
        <Link href={CHILDREN_URL} className="text-accent-strong underline">{t("picturebooksBack")}</Link>
      </p>
    );
  }
  const p = book.provenance;
  return (
    <div className="flex flex-col gap-5">
      <PageTitle k="picturebooksAttributionTitle" />
      <h2 lang={locale} className="font-serif text-xl font-bold text-ink -mt-3">
        {locale === "en" && book.titleEn ? book.titleEn : book.title}
      </h2>
      <p className="text-base text-ink">{p.attributionLine}</p>
      <p className="text-sm text-secondary break-all">
        <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">{p.source}</a>
      </p>
      <p className="text-sm text-secondary">
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
          {t("licenseCCBY")}
        </a>
      </p>
      {p.copyrightNotice && <p className="text-sm text-muted">{p.copyrightNotice}</p>}
      {p.imageCredits.length > 0 && (
        <section className="rule-section pt-3">
          <h3 className="kicker text-accent-strong mb-2">{t("picturebooksImageCredits")}</h3>
          <ul className="flex flex-col text-sm text-muted">
            {p.imageCredits.map((c) => (
              <li key={c.page} className="rule-row py-2">
                {c.title} — {c.illustrator} · © {c.holder}, {c.year}
              </li>
            ))}
          </ul>
        </section>
      )}
      <Link href={`/picturebooks/${slug}`} className="min-h-11 inline-flex items-center text-accent-strong font-semibold hover:underline">
        ← {t("picturebooksCreditsBack")}
      </Link>
    </div>
  );
}
