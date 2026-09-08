"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";

/** Footer of the offline manager: one coral-text "Clear all" with a single inline confirmation. */
export function OfflineClearAll({ disabled, onClearAll }: { disabled: boolean; onClearAll: () => void }) {
  const t = useT();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="rule-section flex flex-col gap-3 py-4">
      <Button variant="ghost" size="sm" className="self-start" disabled={disabled} onClick={() => setConfirm(true)}>
        {t("offlineClearAll")}
      </Button>
      {confirm && (
        <div className="border border-line p-3">
          <p className="text-sm text-ink">{t("offlineClearAllConfirm")}</p>
          <div className="mt-2 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setConfirm(false);
                onClearAll();
              }}
            >
              {t("offlineClearConfirmAction")}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirm(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
