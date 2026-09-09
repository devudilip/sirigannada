"use client";

import { useEffect } from "react";
import type { Story } from "@/lib/types";
import { SKIP_SECONDS } from "../types";

interface Args {
  story: Story | null;
  playing: boolean;
  position: number;
  duration: number;
  toggle: () => void;
  seek: (s: number) => void;
  skip: (d: number) => void;
  next: () => void;
  prev: () => void;
}

/** Lock-screen and headset controls: title, art, ±15 s, next/previous, and a live position. */
export function useMediaSession({ story, playing, position, duration, toggle, seek, skip, next, prev }: Args): void {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    if (!story) {
      ms.metadata = null;
      return;
    }
    ms.metadata = new MediaMetadata({
      title: story.title,
      artist: story.provenance.narrator ?? story.collection.kn,
      album: "ಸಿರಿಗನ್ನಡ · ಮಕ್ಕಳ ಕಥೆಗಳು",
      artwork: story.art ? [{ src: story.art, sizes: "512x512", type: "image/png" }] : [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
    });
    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ["play", () => toggle()],
      ["pause", () => toggle()],
      ["seekbackward", () => skip(-SKIP_SECONDS)],
      ["seekforward", () => skip(SKIP_SECONDS)],
      ["seekto", (d) => (d.seekTime != null ? seek(d.seekTime) : undefined)],
      ["nexttrack", () => next()],
      ["previoustrack", () => prev()],
    ];
    for (const [action, handler] of handlers) {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        /* action unsupported on this browser */
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          ms.setActionHandler(action, null);
        } catch {
          /* ignore */
        }
      }
    };
  }, [story, toggle, seek, skip, next, prev]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator) || !story) return;
    const ms = navigator.mediaSession;
    ms.playbackState = playing ? "playing" : "paused";
    if (duration > 0 && "setPositionState" in ms) {
      try {
        ms.setPositionState({ duration, position: Math.min(position, duration), playbackRate: 1 });
      } catch {
        /* ignore */
      }
    }
  }, [story, playing, position, duration]);
}
