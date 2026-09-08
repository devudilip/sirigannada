import type { BookForm } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

/** i18n key for each literary form label. */
export const FORM_KEYS: Record<BookForm, StringKey> = {
  vachana: "formVachana",
  tripadi: "formTripadi",
  shatpadi: "formShatpadi",
  kirtane: "formKirtane",
  prose: "formProse",
  poem: "formPoem",
  mixed: "formMixed",
};
