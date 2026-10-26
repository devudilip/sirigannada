import { LogoMark } from "./LogoMark";

/**
 * Live-text wordmark: mark + ಸಿರಿಗನ್ನಡ in the serif face, with the tracked Latin SIRIGANNADA
 * beneath when asked. Always text, never an image. Kannada leads; English never sits above it.
 */
export function Wordmark({ size = 32, showLatin = true }: { size?: number; showLatin?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <div className="relative -top-2">
        <LogoMark size={size} />
      </div>
      <span className="flex flex-col leading-none">
        <span className="font-serif font-bold text-ink" style={{ fontSize: size * (showLatin ? 0.6 : 0.78), lineHeight: 1.2 }} lang="kn">
          ಸಿರಿಗನ್ನಡ
        </span>
        {showLatin && (
          <span className="font-latin text-muted tracking-wordmark uppercase leading-none" style={{ fontSize: Math.max(10, size * 0.3), marginTop: Math.round(size * 0.06) }} lang="en">
            Sirigannada
          </span>
        )}
      </span>
    </span>
  );
}
