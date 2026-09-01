"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";
import { DEFAULT_SETTINGS, FONT_SCALE_MAX, FONT_SCALE_MIN, FONT_SCALE_STEP, type Progress, type ReaderSettings } from "../types";

const SETTINGS_KEY = "reader:settings";

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings({ ...DEFAULT_SETTINGS, ...readStorage<Partial<ReaderSettings>>(SETTINGS_KEY, {}) });
  }, []);

  const update = useCallback((patch: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeStorage(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const stepFont = useCallback(
    (dir: 1 | -1) => {
      setSettings((prev) => {
        const raw = prev.fontScale + dir * FONT_SCALE_STEP;
        const fontScale = Math.round(Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, raw)) * 100) / 100;
        const next = { ...prev, fontScale };
        writeStorage(SETTINGS_KEY, next);
        return next;
      });
    },
    []
  );

  return { settings, update, stepFont };
}

export function readProgress(slug: string): Progress | null {
  return readStorage<Progress | null>(`reader:progress:${slug}`, null);
}

export function writeProgress(slug: string, block: number): void {
  writeStorage<Progress>(`reader:progress:${slug}`, { block, updatedAt: Date.now() });
}

export function readBookmark(slug: string): number | null {
  return readStorage<number | null>(`reader:bookmark:${slug}`, null);
}

export function writeBookmark(slug: string, block: number | null): void {
  writeStorage(`reader:bookmark:${slug}`, block);
}
