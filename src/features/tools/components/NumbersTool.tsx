"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import {
  arabicToKannadaDigits,
  kannadaToArabicDigits,
  numberToKannadaWords,
  parseNonNegativeInteger,
} from "../lib/numerals";

export function NumbersTool() {
  const t = useT();
  const [input, setInput] = useState("");

  const parsed = useMemo(() => parseNonNegativeInteger(input), [input]);
  const trimmed = input.trim();
  const kannadaDigits = arabicToKannadaDigits(kannadaToArabicDigits(input));
  const arabicDigits = kannadaToArabicDigits(input);
  const words = parsed === null ? "" : numberToKannadaWords(parsed);
  const invalid = trimmed !== "" && parsed === null;

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-base font-medium text-ink">
        {t("numbersInput")}
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          className="h-12 rounded-md border border-line-strong bg-elevated px-4 font-serif text-lg text-ink"
          lang="kn"
          value={input}
          placeholder={t("numbersPlaceholder")}
          onChange={(event) => setInput(event.target.value)}
          autoFocus
        />
      </label>

      {invalid && (
        <p className="text-base text-secondary" role="status">
          {t("numbersOutOfRange")}
        </p>
      )}

      <p className="flex flex-col gap-1 text-base text-ink">
        <span className="font-medium">{t("numbersKannadaDigits")}</span>
        <span className="font-serif text-lg" lang="kn">
          {trimmed ? kannadaDigits : "—"}
        </span>
      </p>

      <p className="flex flex-col gap-1 text-base text-ink">
        <span className="font-medium">{t("numbersArabicDigits")}</span>
        <span className="font-serif text-lg">{trimmed ? arabicDigits : "—"}</span>
      </p>

      <p className="flex flex-col gap-1 text-base text-ink">
        <span className="font-medium">{t("numbersWords")}</span>
        <span className="font-serif text-xl leading-kannada" lang="kn" aria-live="polite">
          {words || "—"}
        </span>
      </p>
    </div>
  );
}
