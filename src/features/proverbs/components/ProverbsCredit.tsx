"use client";

import { useT } from "@/components/providers/AppProviders";

const WIKIQUOTE = "https://kn.wikiquote.org/";
const CC = "https://creativecommons.org/licenses/by-sa/4.0/";

export function ProverbsCredit({ source }: { source: string }) {
  const t = useT();
  return (
    <section className="mt-8 rule-section pt-3">
      <p className="text-base text-secondary leading-kannada">{t("proverbCredit")}</p>
      <p className="mt-2 text-sm">
        <a className="text-accent-strong underline" href={source} rel="noopener noreferrer">
          {t("source")}
        </a>
        {" · "}
        <a className="text-accent-strong underline" href={CC} rel="noopener noreferrer">
          {t("licenseCCBYSA")}
        </a>
        {" · "}
        <a className="text-accent-strong underline" href={WIKIQUOTE} rel="noopener noreferrer">
          kn.wikiquote.org
        </a>
      </p>
    </section>
  );
}
