import dotPattern from "./assets/dot-pattern.svg"

/** Dot mesh for virtual cards — Figma 6582:49108 pattern layer. */
export function PaymentCardDotPattern({ full = false }: { full?: boolean }) {
  const positionClass = full
    ? "left-[calc(50%+0.5px)] top-[calc(50%-0.5px)]"
    : "left-[calc(50%+0.5px)] top-[calc(50%+50.5px)]"

  return (
    <img
      src={dotPattern}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute ${positionClass} h-[225px] w-[103.2%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover`}
    />
  )
}
