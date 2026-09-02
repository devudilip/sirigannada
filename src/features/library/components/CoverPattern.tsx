import type { ReactNode } from "react";
import type { CoverPatternId, CoverSpec } from "../lib/coverFromSlug";

function tileShapes(kind: CoverPatternId, tile: number): ReactNode {
  const m = tile / 2;
  const w = Math.max(1.5, tile / 12);
  switch (kind) {
    case "bands":
      return <rect x="0" y="0" width={tile} height={tile * 0.38} fill="currentColor" />;
    case "stripes":
      return <rect x="0" y="0" width={tile * 0.32} height={tile} fill="currentColor" />;
    case "hatch":
      return (
        <line x1="0" y1={tile} x2={tile} y2="0" stroke="currentColor" strokeWidth={w} />
      );
    case "dots":
      return <circle cx={m} cy={m} r={w * 1.15} fill="currentColor" />;
    case "diamonds":
      return (
        <rect
          x={m - tile * 0.18}
          y={m - tile * 0.18}
          width={tile * 0.36}
          height={tile * 0.36}
          fill="currentColor"
          transform={`rotate(45 ${m} ${m})`}
        />
      );
    case "chevrons":
      return (
        <polyline
          points={`0,${tile * 0.72} ${m},${tile * 0.22} ${tile},${tile * 0.72}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={w}
        />
      );
    case "arcs":
      return (
        <path
          d={`M0 ${tile} A${tile} ${tile} 0 0 1 ${tile} 0`}
          fill="none"
          stroke="currentColor"
          strokeWidth={w}
        />
      );
    case "grid":
      return (
        <>
          <line x1="0" y1="0" x2="0" y2={tile} stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="0" x2={tile} y2="0" stroke="currentColor" strokeWidth="1" />
        </>
      );
  }
}

/** Tiled SVG texture. Colour comes from `currentColor` (token class on the svg). */
export function CoverPattern({ spec, id, className }: { spec: CoverSpec; id: string; className: string }) {
  const tile = spec.dense ? 16 : 24;
  return (
    <svg className={`absolute inset-0 h-full w-full opacity-25 ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
          {tileShapes(spec.pattern, tile)}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
