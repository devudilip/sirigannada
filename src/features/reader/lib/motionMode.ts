/**
 * Which page-turn the device gets. Pure: no DOM, unit-tested.
 *
 * "flip" is the 3D leaf (perspective + rotateY + two back-to-back faces). It costs a
 * composited 3D layer per face, which a budget phone cannot afford.
 * "slide" is a flat 2D translate of a single sheet — no perspective, no backface, no shade.
 */
export type MotionMode = "flip" | "slide";

/** Below this much RAM (GiB, as reported by `navigator.deviceMemory`) we drop the 3D leaf. */
export const LOW_MEMORY_GB = 2;

export interface MotionInputs {
  /** `(prefers-reduced-motion: reduce)` matches. */
  reduceMotion: boolean;
  /** Device RAM in GiB, or undefined where the browser does not report it. */
  deviceMemory?: number;
}

export function motionMode({ reduceMotion, deviceMemory }: MotionInputs): MotionMode {
  if (reduceMotion) return "slide";
  if (deviceMemory !== undefined && deviceMemory < LOW_MEMORY_GB) return "slide";
  return "flip";
}

/** Chrome-only hint; absent in Safari and Firefox, where we keep the flip. */
interface DeviceMemoryNavigator {
  deviceMemory?: number;
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Read the inputs from the browser. Call only from an effect (never during render). */
export function readMotionInputs(): MotionInputs {
  const nav: Navigator & DeviceMemoryNavigator = navigator;
  return {
    reduceMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
    deviceMemory: typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined,
  };
}
