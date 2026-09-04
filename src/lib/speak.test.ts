import { describe, expect, it } from "vitest";
import { pickKannadaVoice } from "./speak";

describe("pickKannadaVoice", () => {
  it("returns null when no Kannada voice is installed", () => {
    expect(pickKannadaVoice([{ lang: "en-IN" }, { lang: "hi-IN" }])).toBeNull();
  });

  it("prefers kn-IN over other kn tags", () => {
    const knIn = { lang: "kn-IN", name: "Google ಕನ್ನಡ" };
    expect(pickKannadaVoice([{ lang: "kn-MY" }, knIn])).toBe(knIn);
  });

  it("accepts kn_IN underscore tags", () => {
    const voice = { lang: "kn_IN", name: "Kannada" };
    expect(pickKannadaVoice([{ lang: "en-GB" }, voice])).toBe(voice);
  });
});
