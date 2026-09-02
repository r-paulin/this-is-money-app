import type { Transaction } from "../data/mockTransactions"

export function merchantTitle(transaction: Transaction): string {
  if (transaction.merchant.trim().length > 0) {
    return transaction.merchant
  }
  if (transaction.kind === "transfer_out" || transaction.kind === "transfer_in") {
    return "Transfer"
  }
  return "Card payment"
}
