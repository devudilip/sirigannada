"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { pickKannadaVoice, speakKannada } from "./speak";

type SpeakFn = (text: string) => void;

const SpeakCtx = createContext<SpeakFn | null>(null);

export function KannadaSpeechProvider({ children }: { children: ReactNode }) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const refresh = () => setVoice(pickKannadaVoice(synth.getVoices()));
    refresh();
    synth.addEventListener("voiceschanged", refresh);
    return () => {
      synth.removeEventListener("voiceschanged", refresh);
      synth.cancel();
    };
  }, []);

  const speak = useMemo<SpeakFn | null>(() => {
    if (!voice) return null;
    return (text: string) => speakKannada(text, voice);
  }, [voice]);

  return <SpeakCtx.Provider value={speak}>{children}</SpeakCtx.Provider>;
}

export function useSpeakKannada(): SpeakFn | null {
  return useContext(SpeakCtx);
}
