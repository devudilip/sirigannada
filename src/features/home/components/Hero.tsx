"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { useT } from "@/components/providers/AppProviders";

export function Hero() {
  const t = useT();
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = () => {
    const query = q.trim();
    router.push(query ? `/dictionary?q=${encodeURIComponent(query)}` : "/dictionary");
  };

  return (
    <section className="pt-10 md:pt-16 pb-2">
      <p className="text-sm font-medium tracking-wide text-accent mb-3">{t("tagline")}</p>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink leading-tight max-w-2xl">{t("heroTitle")}</h1>
      <p className="mt-4 text-base md:text-lg text-secondary max-w-xl">{t("heroBody")}</p>

      <form
        className="mt-8 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
      >
        <SearchBox value={q} onChange={setQ} size="lg" autoFocus={false} />
        <p className="mt-2 text-sm text-muted">{t("searchHint")}</p>
      </form>
    </section>
  );
}
