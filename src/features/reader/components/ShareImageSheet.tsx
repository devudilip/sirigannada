"use client";

import { useEffect, useRef, useState } from "react";
import type { Book } from "@/lib/types";
import { useApp, useT } from "@/components/providers/AppProviders";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { DownloadIcon, ShareIcon } from "@/components/icons";
import { licenseLabelKey } from "@/features/credits/lib/licenseLabel";
import { attributionLines, canvasToPngBlob, downloadPng, renderVerseImage } from "../lib/shareImage";
import { blockText } from "../lib/versePermalink";

interface ShareImageSheetProps {
  book: Book;
  /** Global block index to render, or null when the sheet is closed. */
  block: number | null;
  onClose: () => void;
}

/** Feature-detects Web Share API Level 2 (file sharing), not just the base `navigator.share`. */
function canShareFiles(file: File): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/**
 * Renders one verse block to a branded canvas image and offers a PNG download, plus a native
 * share sheet on browsers that support sharing files (mostly mobile).
 */
export function ShareImageSheet({ book, block, onClose }: ShareImageSheetProps) {
  const t = useT();
  const { locale } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (block === null) return;
    let cancelled = false;
    setPngUrl(null);
    setPngBlob(null);

    const title = locale === "en" && book.titleEn ? book.titleEn : book.title;
    const author = locale === "en" && book.authorEn ? book.authorEn : book.author;
    const licenseAndSource = `${t("license")}: ${t(licenseLabelKey(book.provenance.license))} · sirigannada.in`;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      await renderVerseImage(canvas, {
        verseText: blockText(book, block),
        brandName: t("appName"),
        attributionLines: attributionLines(title, author, licenseAndSource),
      });
      const blob = await canvasToPngBlob(canvas);
      if (cancelled || !blob) return;
      setPngBlob(blob);
      setPngUrl(URL.createObjectURL(blob));
    })();

    return () => {
      cancelled = true;
    };
  }, [book, block, locale, t]);

  useEffect(() => () => {
    if (pngUrl) URL.revokeObjectURL(pngUrl);
  }, [pngUrl]);

  const filename = `${book.slug}-b${block ?? 0}.png`;

  const handleDownload = () => {
    if (pngBlob) downloadPng(filename, pngBlob);
  };

  const handleShare = async () => {
    if (!pngBlob) return;
    const file = new File([pngBlob], filename, { type: "image/png" });
    if (!canShareFiles(file)) return;
    try {
      await navigator.share({ files: [file], title: book.title, text: book.title });
    } catch {
      /* user cancelled the share sheet, or the browser refused — nothing to recover from */
    }
  };

  const shareSupported = pngBlob !== null && canShareFiles(new File([pngBlob], filename, { type: "image/png" }));

  return (
    <Sheet open={block !== null} onClose={onClose} title={t("shareImageSheetTitle")}>
      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
        <div className="w-full max-w-xs overflow-hidden rounded-md border border-line bg-paper">
          {pngUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element -- static export, local blob URL, not an optimizable remote image */
            <img src={pngUrl} alt={t("shareImagePreviewAlt")} className="block w-full" />
          ) : (
            <p className="p-8 text-center text-sm text-secondary">{t("shareImagePreparing")}</p>
          )}
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Button variant="secondary" size="lg" onClick={handleDownload} disabled={!pngBlob} className="w-full">
            <DownloadIcon size={20} />
            {t("shareImageDownload")}
          </Button>
          {shareSupported && (
            <Button variant="primary" size="lg" onClick={handleShare} disabled={!pngBlob} className="w-full">
              <ShareIcon size={20} />
              {t("shareImageShare")}
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
