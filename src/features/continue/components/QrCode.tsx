import qrcode from "qrcode-generator";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Inline SVG QR of `value` with the Sirigannada mark punched into the centre. No canvas, no
 * network — `qrcode-generator` is a pure encoder. Error correction is forced to "H" (~30%
 * recovery) so the ~26%-wide logo knockout never stops it scanning. `currentColor` fill so the
 * caller controls contrast (it sits on a white plate).
 */
export function QrCode({ value, className }: { value: string; className?: string }) {
  const qr = qrcode(0, "H");
  qr.addData(value);
  qr.make();

  const count = qr.getModuleCount();
  const margin = 4;
  const size = count + margin * 2;

  const logo = Math.round(count * 0.26);
  const hole = logo + 2;
  const center = size / 2;

  let path = "";
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) path += `M${col + margin} ${row + margin}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d={path} fill="currentColor" />
      <rect
        x={center - hole / 2}
        y={center - hole / 2}
        width={hole}
        height={hole}
        rx={hole * 0.18}
        fill="#fff"
      />
      <g transform={`translate(${center - logo / 2} ${center - logo / 2})`}>
        <LogoMark size={logo} />
      </g>
    </svg>
  );
}
