import { useEffect, useState } from "react"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { AddRecipientLoadingScreen } from "./AddRecipientLoadingScreen"
import {
  AddRecipientScreen,
  type AddRecipientScreenProps,
} from "./AddRecipientScreen"

const LOADER_MS = 800

export function AddRecipientGate({
  prefillName,
  prefillIban,
}: AddRecipientScreenProps) {
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
      aria-label={revealed ? undefined : "Loading recipient form"}
      skeleton={<AddRecipientLoadingScreen />}
    >
      <AddRecipientScreen prefillName={prefillName} prefillIban={prefillIban} />
    </SkeletonReveal>
  )
}
