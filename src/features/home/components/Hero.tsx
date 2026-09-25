"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { InstallButton } from "@/components/pwa/InstallButton";
import { useApp } from "@/components/providers/AppProviders";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { loadProverbs } from "@/features/proverbs/lib/load";
import { formatCount } from "../lib/heroCounts";

/**
 * The serif headline leads on every width: 32 px on phones, 44 px on md+. The muted subline shows
 * on md+ only so the phone reaches the search field within the first screen. Submitting routes
 * to the dictionary. The subline's book and proverb counts come from the precached data files.
 */
export function Hero() {
  const { locale, t } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const books = useBooksManifest()?.books.length ?? 0;
  const [proverbs, setProverbs] = useState(0);

  useEffect(() => {
    let alive = true;
    void loadProverbs().then((file) => {
      if (alive && file) setProverbs(file.proverbs.length);
    });
    return () => {
      alive = false;
    };
  }, []);

  const go = () => {
    const query = q.trim();
    router.push(query ? `/dictionary?q=${encodeURIComponent(query)}` : "/dictionary");
  };

  return (
    <section className="pt-5 md:pt-10">
      <div className="mb-5 md:mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink leading-tight max-w-3xl" lang={locale}>
          {t("homeHeroTitle")}
        </h1>
        <p className="hidden md:block mt-6 text-base text-secondary max-w-xl" lang={locale}>
          {books > 0 && proverbs > 0
            ? t("homeHeroBody", { books: formatCount(books, locale), proverbs: formatCount(proverbs, locale) })
            : t("homeHeroBodyPlain")}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <SearchBox
          value={q}
          onChange={setQ}
          size="lg"
          autoFocus={false}
          placeholder={t("homeSearchPlaceholder")}
          aria-label={t("homeSearchPlaceholder")}
        />
        <p className="mt-2 text-sm text-muted" lang={locale}>
          {t("homeSearchHelper")}
        </p>
      </form>
      <InstallButton className="mt-4 md:hidden" />
    </section>
  );
}
