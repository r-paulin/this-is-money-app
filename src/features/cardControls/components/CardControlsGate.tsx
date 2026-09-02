import { useEffect, useState } from "react"
import type { CardType } from "@/features/home/home.types"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { CardControlsLoadingScreen } from "./CardControlsLoadingScreen"
import { CardControlsScreen } from "./CardControlsScreen"

const LOADER_MS = 800

export interface CardControlsGateProps {
  cardType: CardType
  lastFour?: string
}

export function CardControlsGate({ cardType, lastFour }: CardControlsGateProps) {
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
      aria-label={revealed ? undefined : "Loading card controls"}
      skeleton={<CardControlsLoadingScreen />}
    >
      <CardControlsScreen cardType={cardType} lastFour={lastFour} />
    </SkeletonReveal>
  )
}
