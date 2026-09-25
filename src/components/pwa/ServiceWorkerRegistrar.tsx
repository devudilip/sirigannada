"use client";

import { useEffect } from "react";
import { PICTUREBOOK_ASSET_BASE } from "@/lib/assetBase";

/** The worker is a plain script, so the asset base it must cache is passed in its URL. */
export const SERVICE_WORKER_URL = `/sw.js?assets=${encodeURIComponent(PICTUREBOOK_ASSET_BASE)}`;

/** Registers public/sw.js once in production. Renders nothing. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: "/" }).catch(() => {
      /* offline support is progressive; failing silently is fine */
    });
  }, []);
  return null;
}
