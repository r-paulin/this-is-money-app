import { useEffect, useState } from "react"
import type { CardType } from "@/features/home/home.types"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { ChangeLimitsScreen } from "./ChangeLimitsScreen"

const LOADER_MS = 400

export interface ChangeLimitsGateProps {
  cardType: CardType
  onSaved?: () => void
}

export function ChangeLimitsGate({ cardType, onSaved }: ChangeLimitsGateProps) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRevealed(true)
    }, LOADER_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <SkeletonReveal
      revealed={revealed}
      deferContentMount
      className="min-h-dvh bg-layer-floor-1"
      aria-label={revealed ? undefined : "Loading change limits"}
      skeleton={
        <div className="change-limits-screen min-h-dvh bg-layer-floor-1" aria-hidden />
      }
    >
      <ChangeLimitsScreen cardType={cardType} onSaved={onSaved} />
    </SkeletonReveal>
  )
}
