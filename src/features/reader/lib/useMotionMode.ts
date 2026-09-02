"use client";

import { useEffect, useState } from "react";
import { REDUCED_MOTION_QUERY, motionMode, readMotionInputs, type MotionMode } from "./motionMode";

/**
 * The page-turn this device should get, re-evaluated when the reduced-motion preference changes.
 *
 * Starts at "flip" so the prerendered HTML and the first client render agree; the real value
 * lands in the mount effect, long before any turn can start.
 */
export function useMotionMode(): MotionMode {
  const [mode, setMode] = useState<MotionMode>("flip");

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setMode(motionMode(readMotionInputs()));
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mode;
}
