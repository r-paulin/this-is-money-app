import type { CSSProperties } from "react"

export type PaymentCardCutOffProps = {
  virtual?: boolean
  /** Taller back-card variant — fills the stack depth behind the front card. */
  extended?: boolean
  onClick?: () => void
  className?: string
  "aria-label"?: string
}

/** Figma gradient stops for cut-off cards (0deg, bottom to top). */
const GRADIENT_OVERLAY_CUT =
  "linear-gradient(0deg, #00110B4D 0%, #00110B26 40%, #E1FDF10D 100%)"

/** Figma gradient stops for full cards — Card Controls 6582:49816. */
const GRADIENT_OVERLAY_FULL =
  "linear-gradient(0deg, #00110B26 0%, #00110B13 40%, #E1FDF106 100%)"

const BASE_COLORS = {
  physical: "rgb(45, 45, 45)",
  virtual: "rgb(22, 22, 22)",
} as const

export const DESIGN_WIDTH = 345
export const DESIGN_HEIGHT_CUT = 80
export const DESIGN_HEIGHT_FULL = 218
/** Full stack depth: 2 cut cards minus both 24px overlaps (to balance panel top). */
export const DESIGN_HEIGHT_CUT_EXTENDED = 136
export const CUT_CARD_OVERLAP_PX = 24

export type PaymentCardProps = {
  virtual?: boolean
  lastFour?: string
  locked?: boolean
  className?: string
}

export function getCutOffBackground(virtual: boolean): string {
  const color = virtual ? BASE_COLORS.virtual : BASE_COLORS.physical
  return `${GRADIENT_OVERLAY_CUT}, linear-gradient(90deg, ${color} 0%, ${color} 100%)`
}

export function getFullBackgroundStyle(virtual: boolean): CSSProperties {
  const color = virtual ? BASE_COLORS.virtual : BASE_COLORS.physical
  return {
    backgroundImage: `${GRADIENT_OVERLAY_FULL}, linear-gradient(90deg, ${color} 0%, ${color} 100%)`,
  }
}

/** Maps the cut-off gradient to the visible top band on extended back cards. */
export function getCutOffBackgroundStyle(
  virtual: boolean,
  extended = false,
): CSSProperties {
  const color = virtual ? BASE_COLORS.virtual : BASE_COLORS.physical
  const base = `linear-gradient(90deg, ${color} 0%, ${color} 100%)`

  if (!virtual && extended) {
    return {
      backgroundImage: `${GRADIENT_OVERLAY_CUT}, ${base}`,
      backgroundSize: `100% ${DESIGN_HEIGHT_CUT}px, 100% 100%`,
      backgroundPosition: "top, top",
      backgroundRepeat: "no-repeat, no-repeat",
    }
  }

  return {
    backgroundImage: getCutOffBackground(virtual),
  }
}

export function getBadgeLabel(virtual: boolean): string {
  return virtual ? "Virtual" : "Physical"
}
