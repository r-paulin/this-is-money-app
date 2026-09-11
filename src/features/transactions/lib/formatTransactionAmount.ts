import type { TransactionKind } from "../data/mccThemes"

/** General euro display (e.g. recipient subtitles). */
export function formatEurFromCents(cents: number): string {
  const abs = Math.abs(cents) / 100
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs)
}

/** Figma transaction list amount: €12.00 (symbol prefix, dot decimals). */
export function formatTransactionListEurFromCents(cents: number): string {
  const abs = Math.abs(cents) / 100
  return `€${abs.toFixed(2)}`
}

export type TransactionAmountTone = "primary" | "credit" | "declined" | "missing"

export function formatSignedTransactionAmount(opts: {
  amountCents?: number | null
  kind: TransactionKind
}): { text: string; tone: TransactionAmountTone } {
  if (opts.amountCents == null) {
    return { text: "--", tone: "missing" }
  }

  const formatted = formatTransactionListEurFromCents(Math.abs(opts.amountCents))

  if (opts.kind === "declined" || opts.kind === "failed" || opts.kind === "reversal") {
    return { text: formatted, tone: "declined" }
  }

  if (opts.kind === "ride_payout" || opts.kind === "refund" || opts.kind === "transfer_in") {
    return { text: `+${formatted}`, tone: "credit" }
  }

  return { text: `-${formatted}`, tone: "primary" }
}
