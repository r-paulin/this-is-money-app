import type { ReactNode } from "react"
import "./skeleton-reveal.css"

export interface SkeletonRevealProps {
  revealed: boolean
  skeleton: ReactNode
  children: ReactNode
  className?: string
  /** When true, children mount only after the first reveal (sensitive / heavy content). */
  deferContentMount?: boolean
  "aria-busy"?: boolean
  "aria-label"?: string
}

export function SkeletonReveal({
  revealed,
  skeleton,
  children,
  className = "",
  deferContentMount = false,
  "aria-busy": ariaBusy,
  "aria-label": ariaLabel,
}: SkeletonRevealProps) {
  const shouldMountContent = revealed || !deferContentMount

  return (
    <div
      className={["t-skel", revealed ? "is-revealed" : "", className].filter(Boolean).join(" ")}
      data-state={revealed ? "revealed" : "loading"}
      aria-busy={ariaBusy ?? !revealed}
      aria-label={ariaLabel}
    >
      <div className="t-skel-skeleton is-pulsing" aria-hidden={revealed}>
        {skeleton}
      </div>
      {shouldMountContent ? (
        <div className="t-skel-content" aria-hidden={!revealed}>
          {children}
        </div>
      ) : null}
    </div>
  )
}
