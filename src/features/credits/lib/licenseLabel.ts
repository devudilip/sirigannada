import type { License } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

const KEYS: Record<License, StringKey> = {
  "public-domain": "licensePublicDomain",
  "CC0-1.0": "licenseCC0",
  "CC-BY-4.0": "licenseCCBY",
  "CC-BY-SA-4.0": "licenseCCBYSA",
  "ODbL-1.0": "licenseODbL",
};

export function licenseLabelKey(license: License): StringKey {
  return KEYS[license];
}
