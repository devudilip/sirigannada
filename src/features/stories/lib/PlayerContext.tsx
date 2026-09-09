"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Story } from "@/lib/types";
import { readStorage, writeStorage } from "@/lib/storage";
import { PLAYBACK_RATES, SKIP_SECONDS, type PlaybackRate, type PlayerActions, type PlayerState, type SleepTimer } from "../types";
import { useMediaSession } from "./useMediaSession";
import { nextStory, prevStory } from "./queue";
import { readPosition, resumeAt, writePosition } from "./positions";
import { sleepDeadline } from "./sleep";
import { clamp } from "./time";

type Ctx = PlayerState & PlayerActions;
const PlayerCtx = createContext<Ctx | null>(null);
const PREFS_KEY = "story:prefs";
interface Prefs {
  rate: PlaybackRate;
  autoplay: boolean;
}

/**
 * One <audio> element for the whole app, created on first play so nothing loads until asked.
 * Streams by default (range requests); the service worker serves cached audio when present.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [queue, setQueue] = useState<Story[]>([]);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRateState] = useState<PlaybackRate>(1);
  const [autoplay, setAutoplayState] = useState(true);
  const [stopAfter, setStopAfter] = useState(false);
  const [sleep, setSleepState] = useState<SleepTimer>("off");
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const storyRef = useRef<Story | null>(null);
  const queueRef = useRef<Story[]>([]);
  const stopAfterRef = useRef(false);
  const autoplayRef = useRef(true);
  const sleepRef = useRef<{ timer: SleepTimer; deadline: number | null }>({ timer: "off", deadline: null });
  storyRef.current = story;
  queueRef.current = queue;
  stopAfterRef.current = stopAfter;
  autoplayRef.current = autoplay;

  useEffect(() => {
    const prefs = readStorage<Partial<Prefs>>(PREFS_KEY, {});
    if (prefs.rate && (PLAYBACK_RATES as readonly number[]).includes(prefs.rate)) setRateState(prefs.rate);
    if (typeof prefs.autoplay === "boolean") setAutoplayState(prefs.autoplay);
  }, []);

  const audio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.preload = "metadata";
    audioRef.current = el;
    return el;
  }, []);

  const load = useCallback(
    (next: Story, startAt: number, andPlay: boolean) => {
      if (!next.audio) return;
      const el = audio();
      setStory(next);
      setError(false);
      setPosition(startAt);
      setDuration(next.durationSec);
      setStopAfter(false);
      el.src = next.audio;
      el.playbackRate = rate;
      el.currentTime = startAt;
      if (andPlay) void el.play().catch(() => setError(true));
    },
    [audio, rate],
  );

  const play = useCallback<PlayerActions["play"]>(
    (next, list) => {
      if (list) setQueue(list);
      const current = storyRef.current;
      if (current?.slug === next.slug) {
        void audio().play().catch(() => setError(true));
        return;
      }
      load(next, resumeAt(readPosition(next.slug)), true);
    },
    [audio, load],
  );

  const pause = useCallback(() => audio().pause(), [audio]);
  const toggle = useCallback(() => {
    const el = audio();
    if (el.paused) void el.play().catch(() => setError(true));
    else el.pause();
  }, [audio]);
  const seek = useCallback(
    (seconds: number) => {
      const el = audio();
      const target = clamp(seconds, 0, el.duration || storyRef.current?.durationSec || 0);
      el.currentTime = target;
      setPosition(target);
    },
    [audio],
  );
  const skip = useCallback((delta: number) => seek(audio().currentTime + delta), [audio, seek]);
  const next = useCallback(() => {
    const n = nextStory(queueRef.current, storyRef.current);
    if (n) load(n, resumeAt(readPosition(n.slug)), true);
  }, [load]);
  const prev = useCallback(() => {
    const el = audio();
    if (el.currentTime > 3) return seek(0);
    const p = prevStory(queueRef.current, storyRef.current);
    if (p) load(p, 0, true);
  }, [audio, load, seek]);
  const setRate = useCallback(
    (r: PlaybackRate) => {
      setRateState(r);
      audio().playbackRate = r;
      writeStorage<Partial<Prefs>>(PREFS_KEY, { ...readStorage<Partial<Prefs>>(PREFS_KEY, {}), rate: r });
    },
    [audio],
  );
  const setAutoplay = useCallback((on: boolean) => {
    setAutoplayState(on);
    writeStorage<Partial<Prefs>>(PREFS_KEY, { ...readStorage<Partial<Prefs>>(PREFS_KEY, {}), autoplay: on });
  }, []);
  const setSleep = useCallback((timer: SleepTimer) => {
    sleepRef.current = { timer, deadline: sleepDeadline(timer) };
    setSleepState(timer);
  }, []);
  const stop = useCallback(() => {
    const el = audio();
    el.pause();
    el.removeAttribute("src");
    el.load();
    setStory(null);
    setPlaying(false);
    setPosition(0);
  }, [audio]);

  // Wire the element's events once.
  useEffect(() => {
    const el = audio();
    const onTime = () => {
      const s = storyRef.current;
      setPosition(el.currentTime);
      if (s) writePosition(s.slug, el.currentTime, el.duration || s.durationSec);
      const { deadline } = sleepRef.current;
      if (deadline !== null && Date.now() >= deadline) {
        el.pause();
        sleepRef.current = { timer: "off", deadline: null };
        setSleepState("off");
      }
    };
    const onEnded = () => {
      const s = storyRef.current;
      if (s) writePosition(s.slug, el.duration || s.durationSec, el.duration || s.durationSec);
      const sleepEnd = sleepRef.current.timer === "end";
      if (sleepEnd) {
        sleepRef.current = { timer: "off", deadline: null };
        setSleepState("off");
      }
      if (stopAfterRef.current || sleepEnd || !autoplayRef.current) return;
      const n = nextStory(queueRef.current, s);
      if (n) load(n, resumeAt(readPosition(n.slug)), true);
    };
    const onDuration = () => setDuration(el.duration || storyRef.current?.durationSec || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onReady = () => setBuffering(false);
    const onError = () => {
      setError(true);
      setBuffering(false);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onReady);
    el.addEventListener("canplay", onReady);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onReady);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onError);
    };
  }, [audio, load]);

  useMediaSession({ story, playing, position, duration, toggle, seek, skip, next, prev });

  const value = useMemo<Ctx>(
    () => ({
      story, queue, playing, position, duration, rate, autoplay, stopAfter, sleep, buffering, error,
      play, toggle, pause, seek, skip, next, prev, setRate, setAutoplay, setStopAfter, setSleep, stop,
    }),
    [story, queue, playing, position, duration, rate, autoplay, stopAfter, sleep, buffering, error, play, toggle, pause, seek, skip, next, prev, setRate, setAutoplay, setSleep, stop],
  );

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export function usePlayer(): Ctx {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
