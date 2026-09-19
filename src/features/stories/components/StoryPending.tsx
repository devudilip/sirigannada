"use client";

import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { PendingStorySource } from "@/lib/types";

/**
 * "12 more stories awaiting permission", with the catalogues and their titles folded into a
 * <details>. Purely informational: nothing here plays.
 */
export function StoryPending({ pending }: { pending: PendingStorySource[] }) {
  const { locale, t } = useApp();
  const n = pending.reduce((sum, src) => sum + src.titles.length, 0);
  if (n === 0) return null;

  return (
    <details className="rule-section pt-4 text-sm text-muted">
      <summary className="min-h-11 flex items-center cursor-pointer select-none">{t("storiesPending", { n: localiseDigits(n, locale) })}</summary>
      <div className="mt-3 flex flex-col gap-5">
        {pending.map((src) => (
          <section key={src.source}>
            <h3 className="kicker text-secondary">
              {t("storiesPendingFrom")} · <span lang={locale}>{src.name[locale] || src.name.kn}</span>
            </h3>
            <ul className="mt-2">
              {src.titles.map((item) => (
                <li key={item.title} className="rule-row py-2 font-serif text-[15px] leading-snug text-secondary">
                  <span lang="kn">{item.title}</span>
                  {item.titleEn ? (
                    <span lang="en" className="font-latin text-muted text-sm">
                      {" "}
                      · {item.titleEn}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}
