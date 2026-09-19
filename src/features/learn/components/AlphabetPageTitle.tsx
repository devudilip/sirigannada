"use client";

import { useT } from "@/components/providers/AppProviders";
import { PageTitle } from "@/components/ui/PageTitle";
import { LETTER_COUNT } from "../lib/letterCount";

/** "ವರ್ಣಮಾಲೆ" with the "49 letters · ISO 15919" detail line. */
export function AlphabetPageTitle() {
  const t = useT();
  return <PageTitle k="alphabetTitle" detail={t("alphabetLetterCount", { count: LETTER_COUNT })} />;
}
