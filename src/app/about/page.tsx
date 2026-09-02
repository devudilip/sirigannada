import type { Metadata } from "next";
import { LogoMark } from "@/components/ui/LogoMark";
import { SeeCreditsLink } from "@/features/credits/components/SeeCreditsLink";
import { TransliterateLink } from "@/features/tools/components/TransliterateLink";

export const metadata: Metadata = { title: "ಕುರಿತು" };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 pt-10 flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <LogoMark size={56} />
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink" lang="kn">ಸಿರಿಗನ್ನಡ</h1>
          <p className="text-sm tracking-[0.18em] uppercase text-muted">Sirigannada</p>
        </div>
      </header>

      <section className="flex flex-col gap-3 text-base leading-kannada" lang="kn">
        <p>
          ಕನ್ನಡದ ನಿಘಂಟು, ಶಾಸ್ತ್ರೀಯ ಸಾಹಿತ್ಯ ಮತ್ತು ಭಾಷಾ ಸಲಕರಣೆಗಳನ್ನು ಒಂದೇ ಕಡೆ, ಮುಕ್ತವಾಗಿ, ಸದಾ ಲಭ್ಯವಾಗಿಸುವ ಪ್ರಯತ್ನ. ಇಲ್ಲಿರುವ ಪ್ರತಿಯೊಂದು ಪಠ್ಯವೂ ಸಾರ್ವಜನಿಕ ಸ್ವತ್ತು (ಪಬ್ಲಿಕ್ ಡೊಮೇನ್) ಅಥವಾ ಮುಕ್ತ ಪರವಾನಗಿಯ ಮೂಲದಿಂದ ಬಂದದ್ದು; ಪ್ರತಿ ಪುಸ್ತಕದಲ್ಲಿ ಅದರ ಮೂಲ ಮತ್ತು ಪರವಾನಗಿಯ ದಾಖಲೆ ಇದೆ.
        </p>
        <p>
          ಇದು ಮುಕ್ತ ತಂತ್ರಾಂಶ (AGPL-3.0). ಯಾರೂ ಇದನ್ನು ಮುಚ್ಚಿಡಲಾರರು. ಈ ಜಾಲತಾಣ ನಿಂತರೂ, ಯಾರೇ ಆಗಲಿ ಮೂಲ ಸಂಗ್ರಹದಿಂದ ಮತ್ತೆ ನಿಲ್ಲಿಸಬಹುದು.
        </p>
        <p className="flex flex-col gap-2">
          <TransliterateLink />
        </p>
      </section>

      <section className="flex flex-col gap-3 text-base text-secondary" lang="en">
        <h2 className="text-lg font-semibold text-ink">Credits and licenses</h2>
        <SeeCreditsLink />
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            <span className="text-ink font-medium">Alar</span> Kannada–English dictionary © V. Krishna, licensed{" "}
            <a className="text-accent underline" href="https://opendatacommons.org/licenses/odbl/">ODC-ODbL 1.0</a>.{" "}
            <a className="text-accent underline" href="https://alar.ink">alar.ink</a>
          </li>
          <li>
            Classic texts from <a className="text-accent underline" href="https://kn.wikisource.org">Kannada Wikisource</a> (public domain; authors died before 1966) — see each book&apos;s source note.
          </li>
          <li>Fonts: Noto Serif Kannada and Anek Kannada (SIL Open Font License).</li>
          <li>
            Code: AGPL-3.0-or-later. Original content: CC BY-SA 4.0. Source on GitHub.
          </li>
        </ul>
      </section>
    </article>
  );
}
