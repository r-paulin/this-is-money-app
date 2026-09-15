import type { TransactionKind } from "../data/mccThemes"

export type TransactionDetailVariant = "card_payment" | "transfer" | "payout"

export function isTransferTransaction(kind: TransactionKind): boolean {
  return kind === "transfer_out" || kind === "transfer_in"
}

export function isPayoutTransaction(kind: TransactionKind): boolean {
  return kind === "ride_payout"
}

export function getTransactionDetailVariant(kind: TransactionKind): TransactionDetailVariant {
  if (isTransferTransaction(kind)) return "transfer"
  if (isPayoutTransaction(kind)) return "payout"
  return "card_payment"
}

export function getTransactionDetailNavKey(
  transactionId: string,
  variant: TransactionDetailVariant,
): string {
  return `${variant}-detail:${transactionId}`
}
