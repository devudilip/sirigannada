import type { License } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

const KEYS: Record<License, StringKey> = {
  "public-domain": "licensePublicDomain",
  "CC0-1.0": "licenseCC0",
  "CC-BY-2.0": "licenseCCBY20",
  "CC-BY-2.5": "licenseCCBY25",
  "CC-BY-3.0": "licenseCCBY30",
  "CC-BY-4.0": "licenseCCBY",
  "CC-BY-SA-2.0": "licenseCCBYSA20",
  "CC-BY-SA-2.5": "licenseCCBYSA25",
  "CC-BY-SA-3.0": "licenseCCBYSA30",
  "CC-BY-SA-4.0": "licenseCCBYSA",
  "ODbL-1.0": "licenseODbL",
};

export function licenseLabelKey(license: License): StringKey {
  return KEYS[license];
}
