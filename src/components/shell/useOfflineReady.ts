"use client";

import { useEffect, useState } from "react";

/** True once a service worker controls this page, i.e. the shell will open without a network. */
export function useOfflineReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const sw = navigator.serviceWorker;
    const check = () => setReady(Boolean(sw.controller));
    check();
    sw.addEventListener("controllerchange", check);
    return () => sw.removeEventListener("controllerchange", check);
  }, []);
  return ready;
}
