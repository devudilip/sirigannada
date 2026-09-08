import { LogoMark } from "./LogoMark";

/**
 * Live-text wordmark: mark + ಸಿರಿಗನ್ನಡ in the serif face, with the tracked Latin SIRIGANNADA
 * beneath when asked. Always text, never an image. Kannada leads; English never sits above it.
 */
export function Wordmark({ size = 28, showLatin = false }: { size?: number; showLatin?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none gap-1">
        <span className="font-serif font-bold text-ink" style={{ fontSize: size * 0.78 }} lang="kn">
          ಸಿರಿಗನ್ನಡ
        </span>
        {showLatin && (
          <span className="font-latin text-muted tracking-wordmark uppercase" style={{ fontSize: Math.max(10, size * 0.3) }} lang="en">
            Sirigannada
          </span>
        )}
      </span>
    </span>
  );
}
