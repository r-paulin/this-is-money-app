import { useEffect, useState } from "react"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import type { ActivityFilterSelection } from "../lib/activityFilters"
import { TransactionsLoadingScreen } from "./TransactionsLoadingScreen"
import { TransactionsScreen } from "./TransactionsScreen"

const LOADER_MS = 800

/**
 * Each navigation push mounts a fresh Gate. With `deferContentMount`,
 * TransactionsScreen mounts after the loader — leave/return clears search state.
 */
export function TransactionsGate({
  initialFilters,
}: {
  initialFilters?: ActivityFilterSelection
} = {}) {
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
      aria-label={revealed ? undefined : "Loading transactions"}
      skeleton={<TransactionsLoadingScreen />}
    >
      <TransactionsScreen initialFilters={initialFilters} />
    </SkeletonReveal>
  )
}
