/**
 * Inline brand mark: the letter ಸಿ in ivory on a coral square with one sky bar beneath it — the
 * line you read along. `variant="mono"` draws glyph + bar in currentColor with no square.
 * Glyph outline is Noto Serif Kannada Bold "ಸಿ" (OFL font), traced to a path — identical to
 * public/brand/logo-mark.svg. Below 32 px the bar is dropped (brand rule) and only the square + ಸಿ remain.
 */
const GLYPH =
  "M57 14Q51 -1 46.5 -22.5Q42 -44 42 -67Q42 -125 67.5 -168.5Q93 -212 139.0 -236.5Q185 -261 245 -261Q288 -261 320.5 -250.0Q353 -239 377.0 -220.5Q401 -202 419.0 -178.5Q437 -155 452 -130Q463 -111 473.0 -102.0Q483 -93 498 -93Q524 -93 538.0 -119.5Q552 -146 552 -189Q552 -237 541.0 -279.5Q530 -322 508 -365L552 -386Q582 -344 607.0 -285.0Q632 -226 632 -155Q632 -77 600.0 -32.5Q568 12 516 12Q491 12 474.0 1.5Q457 -9 441 -31Q426 -51 409.0 -66.5Q392 -82 370.0 -93.0Q348 -104 319.5 -109.5Q291 -115 252 -115Q184 -115 143.5 -90.5Q103 -66 103 -19Q103 -12 104.0 -5.0Q105 2 106 8ZM330 -333Q302 -333 285.5 -348.0Q269 -363 269 -389Q331 -413 369.5 -446.0Q408 -479 408 -537Q408 -572 390.5 -598.5Q373 -625 330 -640L373 -634Q380 -624 383.5 -609.0Q387 -594 387 -580Q387 -529 360.0 -496.0Q333 -463 279 -463Q224 -463 192.0 -497.5Q160 -532 160 -589Q160 -643 194.5 -682.0Q229 -721 295 -721Q349 -721 386.0 -693.0Q423 -665 442.5 -620.5Q462 -576 462 -524Q462 -470 443.0 -426.5Q424 -383 394.0 -358.0Q364 -333 330 -333ZM273 -557Q304 -557 318.5 -566.5Q333 -576 333 -592Q333 -606 318.5 -616.5Q304 -627 273 -627Q242 -627 229.0 -616.5Q216 -606 216 -593Q216 -577 229.0 -567.0Q242 -557 273 -557ZM437 -512Q409 -512 392.5 -527.5Q376 -543 376 -568Q438 -592 476.5 -625.5Q515 -659 515 -716Q515 -751 497.5 -777.5Q480 -804 436 -818L480 -813Q487 -803 490.5 -788.0Q494 -773 494 -758Q494 -707 467.0 -674.5Q440 -642 386 -642Q331 -642 299.0 -676.5Q267 -711 267 -768Q267 -822 301.5 -861.0Q336 -900 402 -900Q455 -900 492.5 -872.0Q530 -844 549.5 -799.5Q569 -755 569 -703Q569 -649 550.0 -605.5Q531 -562 501.0 -537.0Q471 -512 437 -512ZM380 -736Q410 -736 424.5 -746.0Q439 -756 439 -771Q439 -786 424.5 -796.0Q410 -806 380 -806Q349 -806 336.0 -796.0Q323 -786 323 -772Q323 -756 336.0 -746.0Q349 -736 380 -736Z";
/** Glyph centred horizontally, ~300 px tall, bar below (viewBox 512). */
const GLYPH_WITH_BAR = "translate(144.79 393.00) scale(0.33)";
/** Larger glyph, no bar, for sizes under 32 px. */
const GLYPH_ALONE = "translate(114.46 442.00) scale(0.42)";

export function LogoMark({ size = 32, variant = "full" }: { size?: number; variant?: "full" | "mono" }) {
  const withBar = size >= 32;
  const glyph = <path d={GLYPH} transform={withBar ? GLYPH_WITH_BAR : GLYPH_ALONE} />;
  const bar = withBar ? <rect x="96" y="400" width="320" height="24" /> : null;

  if (variant === "mono") {
    return (
      <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
        {glyph}
        {bar}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" className="fill-accent" />
      <g className="fill-on-accent">{glyph}</g>
      <g className="fill-gold">{bar}</g>
    </svg>
  );
}
