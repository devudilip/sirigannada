"use client";

import { useT } from "@/components/providers/AppProviders";

const CC_BY_SA = "https://creativecommons.org/licenses/by-sa/4.0/";

export function AlphabetLicense() {
  const t = useT();
  return (
    <p className="text-sm text-muted">
      {t("alphabetLicense")}{" "}
      <a className="text-accent underline" href={CC_BY_SA} rel="noopener noreferrer">
        {t("licenseCCBYSA")}
      </a>
    </p>
  );
}
