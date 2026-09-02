import { AlphabetLicense } from "./AlphabetLicense";
import { ConsonantChart } from "./ConsonantChart";
import { GunitaksharaChart } from "./GunitaksharaChart";
import { OttaksharaExamples } from "./OttaksharaExamples";
import { VowelChart } from "./VowelChart";

export function AlphabetView() {
  return (
    <div className="flex flex-col gap-10">
      <VowelChart />
      <ConsonantChart />
      <GunitaksharaChart />
      <OttaksharaExamples />
      <AlphabetLicense />
    </div>
  );
}
