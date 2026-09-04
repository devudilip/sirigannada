import type { PadabandhaPuzzle } from "../types";

/** Original beginner puzzle and clues, released with Sirigannada under CC BY-SA 4.0. */
export const BEGINNER_PADABANDHA: PadabandhaPuzzle = {
  id: "namma-nadu-01",
  title: { kn: "ನಮ್ಮ ನಾಡು · ೧", en: "Our world · 1" },
  rows: 6,
  columns: 8,
  entries: [
    { id: "mavina-hannu", answer: "ಮಾವಿನಹಣ್ಣು", clue: { kn: "ಮಾವಿನ ಮರದಲ್ಲಿ ಬೆಳೆಯುವ ಸಿಹಿಯಾದ ಹಣ್ಣು.", en: "The sweet fruit that grows on a mango tree." }, row: 0, column: 3, direction: "across" },
    { id: "nagara", answer: "ನಗರ", clue: { kn: "ಹಳ್ಳಿಗಿಂತ ದೊಡ್ಡದಾದ ಜನವಸತಿ.", en: "A settlement larger than a village." }, row: 0, column: 5, direction: "down" },
    { id: "pustaka", answer: "ಪುಸ್ತಕ", clue: { kn: "ಪುಟಗಳನ್ನು ಸೇರಿಸಿ ಮಾಡಿದ ಓದುವ ಕೃತಿ.", en: "A work made of pages for reading." }, row: 2, column: 0, direction: "down" },
    { id: "aramane", answer: "ಅರಮನೆ", clue: { kn: "ರಾಜ ಅಥವಾ ರಾಣಿ ವಾಸಿಸುವ ದೊಡ್ಡ ಮನೆ.", en: "The large home of a king or queen." }, row: 2, column: 4, direction: "across" },
    { id: "adige", answer: "ಅಡಿಗೆ", clue: { kn: "ಊಟ ತಯಾರಿಸುವ ಕೆಲಸ.", en: "The work of preparing a meal." }, row: 2, column: 4, direction: "down" },
    { id: "karadi", answer: "ಕರಡಿ", clue: { kn: "ದಟ್ಟ ಕೂದಲುಳ್ಳ ಕಾಡುಪ್ರಾಣಿ.", en: "A wild animal with thick fur." }, row: 3, column: 2, direction: "across" },
    { id: "kadale", answer: "ಕಡಲೆ", clue: { kn: "ಹುರಿದು ಅಥವಾ ಬೇಯಿಸಿ ತಿನ್ನುವ ಒಂದು ಕಾಳು.", en: "A pulse eaten roasted or cooked." }, row: 3, column: 2, direction: "down" },
    { id: "kannada", answer: "ಕನ್ನಡ", clue: { kn: "ಕರ್ನಾಟಕದ ಮುಖ್ಯ ಭಾಷೆ.", en: "The principal language of Karnataka." }, row: 4, column: 0, direction: "across" },
  ],
  provenance: {
    creator: { kn: "ಸಿರಿಗನ್ನಡ ಸಂಪಾದಕರು", en: "Sirigannada contributors" },
    license: "CC-BY-SA-4.0",
  },
};
