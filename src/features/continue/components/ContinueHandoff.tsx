"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { CheckIcon, CopyIcon } from "@/components/icons";
import type { ProgressBlob } from "../types";
import { isEmptyBlob } from "../lib/buildProgress";
import { fitContinueUrl } from "../lib/blobCodec";
import { QrCode } from "./QrCode";

/** Body of the "Continue on another device" sheet: QR + link + copy. Nothing is uploaded. */
export function ContinueHandoff({ blob }: { blob: ProgressBlob }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const { url, trimmed } = useMemo(
    () => fitContinueUrl(typeof window === "undefined" ? "" : window.location.origin, blob),
    [blob],
  );

  if (isEmptyBlob(blob)) {
    return <p className="text-base text-secondary">{t("continueNothing")}</p>;
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the link is still selectable below */
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-1 pb-4">
      <p className="text-sm text-secondary">{t("continueIntro")}</p>

      <div className="mx-auto rounded-md bg-white p-3 text-black">
        <QrCode value={url} className="h-40 w-40 sm:h-48 sm:w-48" />
      </div>
      <p className="text-center text-sm text-muted">{t("continueScanHint")}</p>

      <Button type="button" variant="primary" onClick={copy}>
        {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        {copied ? t("copied") : t("copyLink")}
      </Button>

      <label htmlFor="continue-url" className="text-sm font-medium text-ink">
        {t("continueLinkLabel")}
      </label>
      <input
        id="continue-url"
        readOnly
        value={url}
        onFocus={(event) => event.currentTarget.select()}
        className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      {trimmed && <p className="text-sm text-muted">{t("continueTooLarge")}</p>}
    </div>
  );
}
