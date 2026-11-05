"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Preserve a shelf during this tab's browsing session, including its loaded batch and scroll. */
export function useDiscoveryState<T extends Record<string, string | number>>(initial: T, ready = true) {
  const pathname = usePathname();
  const key = `sg:discovery:${pathname}`;
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  const start = useRef(initial);
  const scroll = useRef(0);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) ?? "null");
      if (saved?.value && Object.keys(start.current).every((k) => typeof saved.value[k] === typeof start.current[k])) {
        setValue(saved.value);
        scroll.current = Number(saved.scroll) || 0;
      }
    } catch { /* Browsing still works when session storage is unavailable. */ }
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded || !ready) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => window.scrollTo(0, scroll.current));
    });
    const remember = () => {
      scroll.current = window.scrollY;
      try { sessionStorage.setItem(key, JSON.stringify({ value, scroll: scroll.current })); } catch { /* Optional persistence. */ }
    };
    window.addEventListener("scroll", remember, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", remember); };
  }, [key, loaded, ready, value]);
  const update = useCallback((patch: Partial<T>) => {
    setValue((previous) => {
      const next = { ...previous, ...patch };
      try { sessionStorage.setItem(key, JSON.stringify({ value: next, scroll: window.scrollY })); } catch { /* Optional persistence. */ }
      return next;
    });
  }, [key]);
  return [value, update] as const;
}
