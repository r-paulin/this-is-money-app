import type { TransactionKind } from "../data/mccThemes"
import type { TransactionListStatus } from "./listStatus"

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

/** Figma home balance: € 100.00 (symbol prefix, thin space, dot decimals). */
export function formatHomeBalanceEurFromCents(cents: number): string {
  const abs = Math.abs(cents) / 100
  return `€\u202F${abs.toFixed(2)}`
}

/** Figma transaction list amount: €12.00 (symbol prefix, dot decimals). */
export function formatTransactionListEurFromCents(cents: number): string {
  const abs = Math.abs(cents) / 100
  return `€${abs.toFixed(2)}`
}

export type TransactionAmountTone = "primary" | "credit" | "declined" | "muted" | "missing"

function isUnsignedStrike(
  kind: TransactionKind,
  listStatus?: TransactionListStatus,
): boolean {
  if (
    listStatus === "returned" ||
    listStatus === "declined" ||
    listStatus === "failed" ||
    listStatus === "reverted"
  ) {
    return true
  }
  if (listStatus != null) return false
  return kind === "declined" || kind === "failed" || kind === "reversal"
}

function isCreditKind(kind: TransactionKind): boolean {
  return (
    kind === "ride_payout" ||
    kind === "refund" ||
    kind === "transfer_in" ||
    kind === "cashback"
  )
}

export function formatSignedTransactionAmount(opts: {
  amountCents?: number | null
  kind: TransactionKind
  listStatus?: TransactionListStatus
}): { text: string; tone: TransactionAmountTone } {
  if (opts.amountCents == null) {
    return { text: "--", tone: "missing" }
  }

  const formatted = formatTransactionListEurFromCents(Math.abs(opts.amountCents))

  if (isUnsignedStrike(opts.kind, opts.listStatus)) {
    return { text: formatted, tone: "declined" }
  }

  if (opts.listStatus === "refund_pending") {
    return { text: `+${formatted}`, tone: "muted" }
  }

  if (isCreditKind(opts.kind)) {
    return { text: `+${formatted}`, tone: "credit" }
  }

  return { text: `-${formatted}`, tone: "primary" }
}
