/** One panel of the six-panel storyboard, cropped with background positioning. Panels are square; `className` sets size and placement. */
export function StoryArt({ image, panel, alt, className = "aspect-square w-full" }: { image: string; panel: number; alt: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      lang="kn"
      className={`rounded-lg bg-paper bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "200% 300%",
        backgroundPosition: `${(panel % 2) * 100}% ${Math.floor(panel / 2) * 50}%`,
      }}
    />
  );
}
