"use client";

import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";

/** Daily / practice-round chrome shared by the games: label, "another", and back-to-daily. */
export function RoundHeader({
  round,
  onAnother,
  onBackToDaily,
}: {
  /** 0 = today's shared puzzle; n ≥ 1 = the n-th practice round on this device. */
  round: number;
  onAnother: () => void;
  onBackToDaily: () => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-base font-semibold text-ink" aria-live="polite">
        {round === 0 ? t("gameDailyLabel") : t("gamePracticeLabel", { n: round })}
      </p>
      <div className="flex flex-wrap gap-2">
        {round > 0 && (
          <Button type="button" variant="secondary" size="sm" onClick={onBackToDaily}>
            {t("gameBackToDaily")}
          </Button>
        )}
        <Button type="button" variant="secondary" size="sm" onClick={onAnother}>
          {t("gameAnother")}
        </Button>
      </div>
    </div>
  );
}
