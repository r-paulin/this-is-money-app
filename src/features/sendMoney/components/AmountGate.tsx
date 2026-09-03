import { useEffect, useState } from "react"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import type { Recipient } from "../sendMoney.types"
import { fetchMockSpendableBalance } from "../lib/mockTransferQuote"
import { AmountLoadingScreen } from "./AmountLoadingScreen"
import { AmountScreen } from "./AmountScreen"

const LOADER_MS = 800

export interface AmountGateProps {
  recipient: Recipient
}

export function AmountGate({ recipient }: AmountGateProps) {
  const [revealed, setRevealed] = useState(false)
  const [spendableCents, setSpendableCents] = useState<number | undefined>(undefined)
  const [balanceError, setBalanceError] = useState(false)
  const [balanceRetryKey, setBalanceRetryKey] = useState(0)

  useEffect(() => {
    const skeletonTimer = window.setTimeout(() => {
      setRevealed(true)
    }, LOADER_MS)

    return () => window.clearTimeout(skeletonTimer)
  }, [])

  const retryBalance = () => {
    setBalanceError(false)
    setSpendableCents(undefined)
    setBalanceRetryKey((key) => key + 1)
  }

  useEffect(() => {
    let cancelled = false

    fetchMockSpendableBalance()
      .then((result) => {
        if (cancelled) return
        setSpendableCents(result.spendableCents)
      })
      .catch(() => {
        if (cancelled) return
        setBalanceError(true)
      })

    return () => {
      cancelled = true
    }
  }, [balanceRetryKey])

  return (
    <SkeletonReveal
      revealed={revealed}
      deferContentMount
      className="min-h-dvh bg-layer-floor-1"
      aria-label={revealed ? undefined : "Loading amount entry"}
      skeleton={<AmountLoadingScreen />}
    >
      <AmountScreen
        recipient={recipient}
        spendableCents={spendableCents}
        balanceError={balanceError}
        onRetryBalance={retryBalance}
      />
    </SkeletonReveal>
  )
}
