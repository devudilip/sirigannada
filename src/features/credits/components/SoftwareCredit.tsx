"use client";

import { useT } from "@/components/providers/AppProviders";

const QRCODE_GENERATOR = "https://github.com/kazuhikoarase/qrcode-generator";
const MIT = "https://opensource.org/license/mit";

export function SoftwareCredit() {
  const t = useT();
  return (
    <section className=" border border-line bg-elevated p-4">
      <h2 className="text-lg font-semibold text-ink">{t("creditsSoftwareTitle")}</h2>
      <p className="mt-2 text-base text-secondary">{t("creditsSoftwareQrBody")}</p>
      <p className="mt-2 text-sm">
        <a className="text-accent underline" href={QRCODE_GENERATOR} rel="noopener noreferrer">
          qrcode-generator
        </a>
        {" · "}
        <a className="text-accent underline" href={MIT} rel="noopener noreferrer">
          MIT
        </a>
      </p>
    </section>
  );
}
