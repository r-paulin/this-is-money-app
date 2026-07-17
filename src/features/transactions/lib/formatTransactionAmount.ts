/** Format euro amounts for transaction list end slot. */
export function formatEurFromCents(cents: number): string {
  const abs = Math.abs(cents) / 100
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs)
}

export function formatSignedTransactionAmount(opts: {
  amountCents: number
  kind: "purchase" | "ride_payout" | "atm" | "refund" | "declined"
}): { text: string; tone: "primary" | "credit" | "declined" } {
  const formatted = formatEurFromCents(opts.amountCents)

  if (opts.kind === "declined") {
    return { text: formatted, tone: "declined" }
  }

  if (opts.kind === "ride_payout" || opts.kind === "refund" || opts.amountCents > 0) {
    return { text: `+${formatted}`, tone: "credit" }
  }

  return { text: `-${formatted}`, tone: "primary" }
}
