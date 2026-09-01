"use client";

import { useEffect } from "react";

/** Registers public/sw.js once in production. Renders nothing. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* offline support is progressive; failing silently is fine */
    });
  }, []);
  return null;
}
