"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import type { StringKey } from "@/lib/i18n";

const SECTIONS: ReadonlyArray<{ title: StringKey; body: StringKey }> = [
  { title: "privacyDeviceTitle", body: "privacyDeviceBody" },
  { title: "privacyContinueTitle", body: "privacyContinueBody" },
  { title: "privacyWebTitle", body: "privacyWebBody" },
  { title: "privacyAppTitle", body: "privacyAppBody" },
  { title: "privacyFormsTitle", body: "privacyFormsBody" },
  { title: "privacyChildrenTitle", body: "privacyChildrenBody" },
  { title: "privacyChangesTitle", body: "privacyChangesBody" },
];

/** The privacy policy: one 2 px-ruled section per topic. Also the Play Store privacy policy URL. */
export function PrivacyBody() {
  const { t, locale } = useApp();
  return (
    <div className="flex flex-col gap-6 text-base leading-kannada" lang={locale}>
      <p className="text-secondary">{t("privacyWho")}</p>
      {SECTIONS.map((s) => (
        <section key={s.title} className="border-t-2 border-line-strong pt-4 flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-ink">{t(s.title)}</h2>
          <p>{t(s.body)}</p>
        </section>
      ))}
      <p>
        <Link className="text-accent underline" href="/contact">
          {t("navContact")}
        </Link>
      </p>
    </div>
  );
}
