import { useEffect, useMemo, useState } from "react"
import { DEFAULT_CARD_LAST_FOUR, generateCardDetails } from "../lib/generateCardDetails"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { CardDetailsContent } from "./CardDetailsContent"

const LOADER_MS = 800

export interface CardDetailsGateProps {
  lastFour?: string
}

export function CardDetailsGate({ lastFour = DEFAULT_CARD_LAST_FOUR }: CardDetailsGateProps) {
  const [revealed, setRevealed] = useState(false)
  const details = useMemo(() => {
    if (!revealed) {
      return undefined
    }
    return generateCardDetails(lastFour)
  }, [lastFour, revealed])

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
      aria-label={revealed ? undefined : "Loading card details"}
      skeleton={<CardDetailsContent loading />}
    >
      <CardDetailsContent details={details} />
    </SkeletonReveal>
  )
}
