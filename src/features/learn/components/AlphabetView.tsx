"use client";

import { AlphabetLicense } from "./AlphabetLicense";
import { AlphabetSpeakHint } from "./AlphabetSpeakHint";
import { ConsonantChart } from "./ConsonantChart";
import { GunitaksharaChart } from "./GunitaksharaChart";
import { OttaksharaExamples } from "./OttaksharaExamples";
import { VowelChart } from "./VowelChart";

export function AlphabetView() {
  return (
    <div className="flex flex-col gap-10">
      <AlphabetSpeakHint />
      <VowelChart />
      <ConsonantChart />
      <GunitaksharaChart />
      <OttaksharaExamples />
      <AlphabetLicense />
    </div>
  );
}
