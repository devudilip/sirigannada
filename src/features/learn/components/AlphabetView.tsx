"use client";

import { AlphabetLicense } from "./AlphabetLicense";
import { AlphabetSpeakHint } from "./AlphabetSpeakHint";
import { ConsonantChart } from "./ConsonantChart";
import { GunitaksharaChart } from "./GunitaksharaChart";
import { OttaksharaExamples } from "./OttaksharaExamples";
import { VowelChart } from "./VowelChart";
import { KannadaSpeechProvider } from "../lib/SpeakContext";

export function AlphabetView() {
  return (
    <KannadaSpeechProvider>
      <div className="flex flex-col gap-10">
        <AlphabetSpeakHint />
        <VowelChart />
        <ConsonantChart />
        <GunitaksharaChart />
        <OttaksharaExamples />
        <AlphabetLicense />
      </div>
    </KannadaSpeechProvider>
  );
}
