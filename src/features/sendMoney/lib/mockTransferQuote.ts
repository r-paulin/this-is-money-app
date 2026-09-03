export type FeeQuoteStatus = "pending" | "ready" | "error"

export interface FeeQuote {
  status: FeeQuoteStatus
  feeCents: number
}

const FEE_DELAY_MS = 400

/** Mock Airwallex fee lookup — zero for most amounts, non-zero demo above threshold. */
export function fetchMockFeeQuote(amountCents: number): Promise<FeeQuote> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const feeCents = amountCents >= 10_000 ? 150 : 0
      resolve({ status: "ready", feeCents })
    }, FEE_DELAY_MS)
  })
}

export interface SpendableBalanceResult {
  spendableCents: number
}

export function fetchMockSpendableBalance(
  shouldFail = false,
): Promise<SpendableBalanceResult> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Balance unavailable"))
        return
      }
      resolve({ spendableCents: 6000 })
    }, 500)
  })
}

export function buildAmountHelperParts(
  spendableCents: number,
  feeQuote: FeeQuote | undefined,
): { available: string; feeLabel: string } {
  const available = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(spendableCents / 100)

  const resolvedFee = feeQuote?.status === "ready" ? feeQuote.feeCents : 0

  if (resolvedFee === 0) {
    return {
      available: `Available: ${available}`,
      feeLabel: "No fees",
    }
  }

  const fee = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(resolvedFee / 100)

  return {
    available: `Available: ${available}`,
    feeLabel: `Fee: ${fee}`,
  }
}

export function buildAmountHelperLine(
  spendableCents: number,
  feeQuote: FeeQuote | undefined,
): string {
  const { available, feeLabel } = buildAmountHelperParts(spendableCents, feeQuote)
  return `${available} · ${feeLabel}`
}
