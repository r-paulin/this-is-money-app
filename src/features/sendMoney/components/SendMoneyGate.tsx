import { useEffect, useState } from "react"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import {
  hasSendMoneyListRevealed,
  markSendMoneyListRevealed,
} from "../lib/sendMoneySession"
import { RecipientSelectLoadingScreen } from "./RecipientSelectLoadingScreen"
import { RecipientSelectScreen } from "./RecipientSelectScreen"

const LOADER_MS = 800

export function SendMoneyGate() {
  const [revealed, setRevealed] = useState(hasSendMoneyListRevealed)

  useEffect(() => {
    if (revealed) {
      markSendMoneyListRevealed()
      return
    }

    const timer = window.setTimeout(() => {
      setRevealed(true)
      markSendMoneyListRevealed()
    }, LOADER_MS)

    return () => window.clearTimeout(timer)
  }, [revealed])

  return (
    <SkeletonReveal
      revealed={revealed}
      deferContentMount
      className="min-h-dvh bg-layer-floor-1"
      aria-label={revealed ? undefined : "Loading recipients"}
      skeleton={<RecipientSelectLoadingScreen />}
    >
      <RecipientSelectScreen />
    </SkeletonReveal>
  )
}
