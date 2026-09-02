"use client";

import { useT } from "@/components/providers/AppProviders";

const ALAR = "https://alar.ink";
const ODBL = "https://opendatacommons.org/licenses/odbl/";

export function AlarCredit() {
  const t = useT();
  return (
    <section className="rounded-lg border border-line bg-elevated p-4">
      <h2 className="text-lg font-semibold text-ink">{t("creditsAlarTitle")}</h2>
      <p className="mt-2 text-base text-secondary leading-kannada">{t("creditsAlarBody")}</p>
      <p className="mt-2 text-sm">
        <a className="text-accent underline" href={ALAR} rel="noopener noreferrer">
          alar.ink
        </a>
        {" · "}
        <a className="text-accent underline" href={ODBL} rel="noopener noreferrer">
          {t("licenseODbL")}
        </a>
      </p>
    </section>
  );
}
