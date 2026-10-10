"use client";

/**
 * A 16:9 cover frame: the first story's picture when one exists, otherwise the title set in
 * serif on paper, so a series (or the whole box) can be shelved before its first story ships.
 */
export function HistoryCover({ image, alt, title, className = "" }: { image?: string; alt?: string; title: string; className?: string }) {
  if (image) {
    return (
      <span className={`block overflow-hidden bg-elevated ${className}`}>
        <img src={image} alt={alt ?? title} width={1280} height={720} loading="lazy" decoding="async" className="aspect-video h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={`flex aspect-video items-center justify-center bg-gold-soft px-4 text-center font-serif text-xl font-bold leading-tight text-ink ${className}`} lang="kn">
      {title}
    </span>
  );
}
