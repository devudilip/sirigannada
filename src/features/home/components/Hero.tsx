"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { InstallButton } from "@/components/pwa/InstallButton";
import { useApp } from "@/components/providers/AppProviders";

/**
 * Search leads. On md+ a serif 44 px headline and a muted subline sit above the field; on mobile
 * the field comes straight after the header row. Submitting routes to the dictionary.
 */
export function Hero() {
  const { locale, t } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = () => {
    const query = q.trim();
    router.push(query ? `/dictionary?q=${encodeURIComponent(query)}` : "/dictionary");
  };

  return (
    <section className="pt-5 md:pt-10">
      <div className="hidden md:block mb-8">
        <h1 className="font-serif text-4xl font-bold text-ink leading-tight max-w-3xl" lang={locale}>
          {t("homeHeroTitle")}
        </h1>
        <p className="mt-6 text-base text-secondary max-w-xl" lang={locale}>
          {t("homeHeroBody")}
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
