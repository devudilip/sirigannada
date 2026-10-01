"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import { translate, type StringKey } from "@/lib/i18n";
import { toKannadaDigits } from "@/lib/kannada";

/**
 * End of a practice session: the score large, the mode it was for, and a share sheet that renders
 * it as a branded image card (download, the device's own share menu, copy) — made on the device.
 */
export function PracticeScoreCard({ score, total, titleKey, onRestart }: {
  score: number;
  total: number;
  /** The mode's hub title, e.g. "practiceModeHearLetter"; named on the card in both languages. */
  titleKey: StringKey;
  onRestart: () => void;
}) {
  const t = useT();
  const { locale } = useApp();
  const [shareOpen, setShareOpen] = useState(false);
  // Both languages on the card, whichever the sharer reads in: "I played … and got 8 out of 10 right!"
  const brag = [
    translate("kn", "practiceShareBrag", { mode: translate("kn", titleKey), score: toKannadaDigits(score), total: toKannadaDigits(total) }),
    translate("en", "practiceShareBrag", { mode: translate("en", titleKey), score, total }),
    "",
    `${translate("kn", "practiceShareInvite")} ${translate("en", "practiceShareInvite")}`,
  ].join("\n");

  return (
    <div className="flex flex-col items-center gap-3 border border-line bg-elevated p-6 text-center">
      <p role="status" className="text-lg font-semibold text-ink">{t("practiceDone")}</p>
      <p className="font-serif text-6xl font-semibold text-accent" aria-label={t("practiceDoneScore", { correct: score, total })}>
        {locale === "kn" ? `${toKannadaDigits(score)} / ${toKannadaDigits(total)}` : `${score} / ${total}`}
      </p>
      <p className="text-base text-secondary">{t(titleKey)}</p>
      <div className="flex w-full max-w-xs flex-col gap-2 pt-2">
        <Button onClick={() => setShareOpen(true)} className="w-full">
          <ShareIcon size={18} />
          {t("shareCardAction")}
        </Button>
        <Button variant="secondary" onClick={onRestart} className="w-full">{t("practiceRestart")}</Button>
      </div>
      <ShareCardSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        input={
          shareOpen
            ? {
                kind: "practice",
                main: `${toKannadaDigits(score)} / ${toKannadaDigits(total)}`,
                support: brag,
                url: `${CANONICAL_ORIGIN}/learn/practice`,
                size: "portrait",
              }
            : null
        }
      />
    </div>
  );
}
