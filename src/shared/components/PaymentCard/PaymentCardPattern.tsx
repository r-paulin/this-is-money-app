import dotPattern from "./assets/dot-pattern.svg"

/** Dot mesh for virtual cut-off cards — Figma 6582:20906 pattern layer. */
export function PaymentCardDotPattern() {
  return (
    <img
      src={dotPattern}
      alt=""
      aria-hidden
      className="pointer-events-none absolute left-[calc(50%+0.5px)] top-[calc(50%+50.5px)] h-[225px] w-[103.2%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
    />
  )
}
