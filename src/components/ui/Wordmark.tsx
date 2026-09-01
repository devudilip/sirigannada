import { LogoMark } from "./LogoMark";

/** Live-text wordmark: mark + ಸಿರಿಗನ್ನಡ in the serif face. Always text, never an image. */
export function Wordmark({ size = 28, showLatin = false }: { size?: number; showLatin?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span className="font-serif font-bold text-ink" style={{ fontSize: size * 0.72 }} lang="kn">
          ಸಿರಿಗನ್ನಡ
        </span>
        {showLatin && (
          <span className="font-sans text-muted tracking-[0.18em] uppercase" style={{ fontSize: size * 0.3 }} lang="en">
            Sirigannada
          </span>
        )}
      </span>
    </span>
  );
}
