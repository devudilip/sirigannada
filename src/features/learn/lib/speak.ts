/** Pick a Kannada TTS voice from the device list. `kn_IN` and `kn-IN` both count. */
export function pickKannadaVoice<T extends { lang: string }>(voices: readonly T[]): T | null {
  const tag = (lang: string) => lang.replaceAll("_", "-").toLowerCase();
  const kn = voices.filter((v) => tag(v.lang).startsWith("kn"));
  return kn.find((v) => tag(v.lang).startsWith("kn-in")) ?? kn[0] ?? null;
}

/** Speak one akshara or word. Cancels any utterance already in flight. */
export function speakKannada(text: string, voice: SpeechSynthesisVoice): void {
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice.lang || "kn-IN";
  utterance.voice = voice;
  utterance.rate = 0.85;
  synth.speak(utterance);
}
