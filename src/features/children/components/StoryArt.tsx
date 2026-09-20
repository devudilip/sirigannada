export function StoryArt({ image, panel, alt }: { image: string; panel: number; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      lang="kn"
      className="aspect-square w-full rounded-lg bg-paper bg-no-repeat"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "200% 300%",
        backgroundPosition: `${(panel % 2) * 100}% ${Math.floor(panel / 2) * 50}%`,
      }}
    />
  );
}
