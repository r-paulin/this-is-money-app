import { formatEurFromCents } from "../../transactions/lib/formatTransactionAmount"

export function formatReviewReference(reference?: string): string {
  const trimmed = reference?.trim()
  return trimmed ? trimmed : "None"
}

export function formatReviewFeeLabel(feeCents: number): string {
  return formatEurFromCents(feeCents)
}

export function formatReviewTotalCents(amountCents: number, feeCents: number): string {
  return formatEurFromCents(amountCents + feeCents)
}
