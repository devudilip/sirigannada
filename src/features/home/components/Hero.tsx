"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { useApp } from "@/components/providers/AppProviders";

/** A focused dictionary search with a visible submit action and an honest search scope. */
export function Hero() {
  const { locale, t } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = () => {
    const query = q.trim();
    router.push(
      query ? `/dictionary?q=${encodeURIComponent(query)}` : "/dictionary",
    );
  };

  return (
    <section className="rounded-lg bg-elevated border border-line p-5 md:p-10">
      <div className="mb-5 min-[1033px]:mb-8">
        <h1
          className="font-serif text-2xl md:text-4xl font-bold text-ink leading-tight max-w-3xl"
          lang={locale}
        >
          {t("homeHeroTitle")}
        </h1>
        <p className="mt-4 text-base text-secondary max-w-xl" lang={locale}>
          {t("homeHeroBodyPlain")}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
        <SearchBox
          className="flex-1"
          value={q}
          onChange={setQ}
          size="lg"
          autoFocus={false}
          placeholder={t("homeSearchPlaceholder")}
          aria-label={t("homeSearchPlaceholder")}
        />
        <button type="submit" className="min-h-13 px-6 rounded-md bg-accent-strong text-on-accent font-semibold">{t("navSearch")}</button>
        </div>
        <p className="mt-2 text-sm text-muted" lang={locale}>
          {t("homeSearchHelper")}
        </p>
      </form>
    </section>
  );
}
