export type PaymentCardCutOffProps = {
  virtual?: boolean
  /** Taller back-card variant — fills the stack depth behind the front card. */
  extended?: boolean
  onClick?: () => void
  className?: string
  "aria-label"?: string
}

const GRADIENT_OVERLAY =
  "linear-gradient(0deg, rgba(0, 17, 11, 0.3) 0%, rgba(0, 17, 11, 0.15) 40%, rgba(225, 253, 241, 0.05) 100%)"

const BASE_COLORS = {
  physical: "rgb(45, 45, 45)",
  virtual: "rgb(22, 22, 22)",
} as const

export const DESIGN_WIDTH = 345
export const DESIGN_HEIGHT_CUT = 80
/** Full stack depth: 2 cut cards minus both 24px overlaps (to balance panel top). */
export const DESIGN_HEIGHT_CUT_EXTENDED = 136
export const CUT_CARD_OVERLAP_PX = 24

export function getCutOffBackground(virtual: boolean): string {
  const color = virtual ? BASE_COLORS.virtual : BASE_COLORS.physical
  return `${GRADIENT_OVERLAY}, linear-gradient(90deg, ${color} 0%, ${color} 100%)`
}

export function getBadgeLabel(virtual: boolean): string {
  return virtual ? "Virtual" : "Physical"
}
