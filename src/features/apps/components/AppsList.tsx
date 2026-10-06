"use client";

import { ArrowRightIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { SIBLING_APPS } from "../lib/catalog";

/** This site first, then one rule-separated outbound row per sibling app, then the storage note. */
export function AppsList() {
  const { t, locale } = useApp();
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2 text-base leading-kannada" lang={locale}>
        <h2 className="text-lg font-semibold text-ink">{t("appsHereTitle")}</h2>
        <p className="text-secondary">{t("appsHereBody")}</p>
      </section>
      <section className="flex flex-col gap-3 border-t-2 border-line-strong pt-6">
        <h2 className="text-lg font-semibold text-ink leading-snug">{t("appsOthersTitle")}</h2>
        <ul className="rule-section">
          {SIBLING_APPS.map((app) => (
            <li key={app.id}>
              <a
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rule-row group flex items-center justify-between gap-4 py-4 min-h-14 hover:bg-elevated active:bg-paper-edge"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-lg font-semibold text-ink leading-snug" lang={app.lang}>{t(app.titleKey)}</span>
                  <span className="text-sm text-secondary">{t(app.subKey)}</span>
                  <span className="mt-1 text-sm font-semibold text-accent-strong">
                    {t("appsOpen")} · <span lang="en">{new URL(app.href).hostname}</span>
                  </span>
                </span>
                <ArrowRightIcon size={20} className="shrink-0 text-ink" />
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-sm text-muted">{t("appsNote")}</p>
    </div>
  );
}
