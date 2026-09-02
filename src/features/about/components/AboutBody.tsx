"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { SeeCreditsLink } from "@/features/credits/components/SeeCreditsLink";

const GITHUB = "https://github.com/devudilip/sirigannada";
const WIKISOURCE = "https://kn.wikisource.org";
const ALAR = "https://alar.ink";
const ODBL = "https://opendatacommons.org/licenses/odbl/";

export function AboutBody() {
  const { t, locale } = useApp();
  return (
    <>
      <section className="flex flex-col gap-3 text-base leading-kannada" lang={locale}>
        <p>{t("aboutP1")}</p>
        <p>{t("aboutP2")}</p>
        <p>
          <Link className="text-accent underline" href="/tools">
            {t("navTools")}
          </Link>
        </p>
      </section>

      <section className="flex flex-col gap-3 text-base text-secondary" lang={locale}>
        <h2 className="text-lg font-semibold text-ink">{t("navCredits")}</h2>
        <SeeCreditsLink />
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            {t("creditsAlarBody")}{" "}
            <a className="text-accent underline" href={ALAR}>
              alar.ink
            </a>
            {", "}
            <a className="text-accent underline" href={ODBL}>
              ODC-ODbL 1.0
            </a>
          </li>
          <li>
            {t("aboutWikisource")}{" "}
            <a className="text-accent underline" href={WIKISOURCE}>
              kn.wikisource.org
            </a>
          </li>
          <li>{t("proverbCredit")}</li>
          <li>{t("aboutFonts")}</li>
          <li>
            {t("aboutCode")}{" "}
            <a className="text-accent underline" href={GITHUB}>
              {t("aboutGithub")}
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
