"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { CheckIcon, CopyIcon, DownloadIcon, LinkIcon, ShareIcon } from "@/components/icons";
import {
  buildCaption,
  canvasToPngBlob,
  downloadPng,
  renderShareCard,
  ShareCardError,
  type ShareCardInput,
} from "../lib/shareCard";

interface ShareCardSheetProps {
  open: boolean;
  onClose: () => void;
  /** Everything the card needs. `null` renders nothing (sheet closed). */
  input: ShareCardInput | null;
}

/** Web Share API Level 2 (file sharing), not just the base `navigator.share`. */
function canShareFiles(file: File): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

type Copied = "image" | "caption" | "link" | null;

/**
 * One share sheet for every "share as image" surface (S-01): renders `input` to a branded PNG on
 * the device, then offers download, native share, copy-image, copy-caption, and copy-link. Shares
 * exactly one unit. Refuses when the renderer rejects the text (empty or fails text-health).
 */
export function ShareCardSheet({ open, onClose, input }: ShareCardSheetProps) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [refused, setRefused] = useState(false);
  const [copied, setCopied] = useState<Copied>(null);

  useEffect(() => {
    if (!open || !input) return;
    let cancelled = false;
    setPngUrl(null);
    setPngBlob(null);
    setRefused(false);
    setCopied(null);

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        await renderShareCard(canvas, input);
      } catch (err) {
        if (!cancelled) setRefused(err instanceof ShareCardError);
        return;
      }
      const blob = await canvasToPngBlob(canvas);
      if (cancelled || !blob) return;
      setPngBlob(blob);
      setPngUrl(URL.createObjectURL(blob));
    })();

    return () => {
      cancelled = true;
    };
  }, [open, input]);

  useEffect(
    () => () => {
      if (pngUrl) URL.revokeObjectURL(pngUrl);
    },
    [pngUrl],
  );

  if (!input) return null;
  const filename = `sirigannada-${input.kind}.png`;

  const flash = (kind: Exclude<Copied, null>) => {
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  };

  const copyText = async (text: string, kind: Exclude<Copied, null>) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(kind);
    } catch {
      /* clipboard unavailable or denied */
    }
  };

  const handleCopyImage = async () => {
    if (!pngBlob || typeof ClipboardItem === "undefined") return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
      flash("image");
    } catch {
      /* browser refused image clipboard write */
    }
  };

  const handleShare = async () => {
    if (!pngBlob) return;
    const file = new File([pngBlob], filename, { type: "image/png" });
    if (!canShareFiles(file)) return;
    try {
      await navigator.share({ files: [file], text: buildCaption(input) });
    } catch {
      /* user cancelled or the browser refused */
    }
  };

  const shareSupported = pngBlob !== null && canShareFiles(new File([pngBlob], filename, { type: "image/png" }));
  const copyImageSupported = typeof ClipboardItem !== "undefined";

  return (
    <Sheet open={open} onClose={onClose} title={t("shareCardSheetTitle")}>
      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        {refused ? (
          <p className="p-6 text-center text-sm font-medium text-accent">{t("shareCardRefused")}</p>
        ) : (
          <>
            <div className="w-full max-w-xs overflow-hidden rounded-md border border-line bg-paper">
              {pngUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element -- static export, local blob URL */
                <img src={pngUrl} alt={t("shareCardPreviewAlt")} className="block w-full" />
              ) : (
                <p className="p-8 text-center text-sm text-secondary">{t("shareCardPreparing")}</p>
              )}
            </div>
            <div className="flex w-full max-w-xs flex-col gap-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => pngBlob && downloadPng(filename, pngBlob)}
                disabled={!pngBlob}
                className="w-full"
              >
                <DownloadIcon size={20} />
                {t("shareCardDownload")}
              </Button>
              {shareSupported && (
                <Button variant="primary" size="lg" onClick={handleShare} disabled={!pngBlob} className="w-full">
                  <ShareIcon size={20} />
                  {t("shareCardShare")}
                </Button>
              )}
              {copyImageSupported && (
                <Button variant="secondary" onClick={handleCopyImage} disabled={!pngBlob} className="w-full">
                  {copied === "image" ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                  {copied === "image" ? t("shareCardCopied") : t("shareCardCopyImage")}
                </Button>
              )}
              <Button variant="secondary" onClick={() => copyText(buildCaption(input), "caption")} className="w-full">
                {copied === "caption" ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                {copied === "caption" ? t("shareCardCopied") : t("shareCardCopyCaption")}
              </Button>
              <Button variant="secondary" onClick={() => copyText(input.url, "link")} className="w-full">
                {copied === "link" ? <CheckIcon size={18} /> : <LinkIcon size={18} />}
                {copied === "link" ? t("shareCardCopied") : t("shareCardCopyLink")}
              </Button>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
