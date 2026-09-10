import type { ReactNode } from "react"
import "@/shared/styles/icon-swap.css"

export type IconSwapState = "a" | "b"

export interface IconSwapProps {
  active: IconSwapState
  iconA: ReactNode
  iconB: ReactNode
  className?: string
}

/** Transitions.dev icon crossfade — blur + scale between two icons. */
export function IconSwap({ active, iconA, iconB, className }: IconSwapProps) {
  return (
    <span
      className={["t-icon-swap", className].filter(Boolean).join(" ")}
      data-state={active}
    >
      <span className="t-icon inline-flex items-center" data-icon="a">
        {iconA}
      </span>
      <span className="t-icon inline-flex items-center" data-icon="b">
        {iconB}
      </span>
    </span>
  )
}
