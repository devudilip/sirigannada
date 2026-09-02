"use client";

import { useT } from "@/components/providers/AppProviders";
import { useSpeakKannada } from "../lib/SpeakContext";

export function AlphabetSpeakHint() {
  const t = useT();
  const speak = useSpeakKannada();
  if (!speak) return null;
  return <p className="text-base text-secondary">{t("alphabetSpeakHint")}</p>;
}
