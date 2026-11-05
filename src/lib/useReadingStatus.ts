"use client";

import { useEffect, useState } from "react";
import { readReadingStates, READING_CHANGED, type ReadingStates } from "./readingStatus";

/** Updates every open shelf when a book is marked; persists only on this device. */
export function useReadingStatus() {
  const [states, setStates] = useState<ReadingStates>({});
  useEffect(() => {
    const refresh = () => setStates(readReadingStates());
    refresh();
    window.addEventListener(READING_CHANGED, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(READING_CHANGED, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return states;
}
