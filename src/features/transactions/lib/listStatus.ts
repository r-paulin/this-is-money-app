import type { TransactionKind } from "../data/mccThemes"
import { formatTransactionListEurFromCents } from "./formatTransactionAmount"

/** Activity list secondary-line statuses from Figma Flow / Activity (no disputes). */
export type TransactionListStatus =
  | "pending"
  | "partially_returned"
  | "partially_charged"
  | "charged_later"
  | "returned"
  | "declined"
  | "refund_pending"
  | "refund"
  | "partially_refunded"
  | "failed"
  | "reverted"

const LIST_STATUS_LABEL: Record<TransactionListStatus, string> = {
  pending: "Pending",
  partially_returned: "Partially returned",
  partially_charged: "Partially charged",
  charged_later: "Charged later",
  returned: "Returned",
  declined: "Declined",
  refund_pending: "Refund pending",
  refund: "Refund",
  partially_refunded: "Partially refunded",
  failed: "Failed",
  reverted: "Reverted",
}

export function listStatusLabel(status: TransactionListStatus): string {
  return LIST_STATUS_LABEL[status]
}

/** Fallback when the mock does not set `listStatus`. */
export function listStatusFromKind(kind: TransactionKind): TransactionListStatus | null {
  switch (kind) {
    case "declined":
      return "declined"
    case "refund":
      return "refund"
    case "authorization":
      return "pending"
    case "reversal":
      return "reverted"
    case "failed":
      return "failed"
    default:
      return null
  }
}

export function formatListSecondary(opts: {
  timestamp: string
  listStatus?: TransactionListStatus | null
  kind: TransactionKind
  reservedAmountCents?: number
  linkedMerchant?: string
}): string {
  if (opts.reservedAmountCents != null) {
    return `${opts.timestamp} · Reserved ${formatTransactionListEurFromCents(opts.reservedAmountCents)}`
  }
  if (opts.linkedMerchant) {
    return `${opts.timestamp} · ${opts.linkedMerchant}`
  }
  const status = opts.listStatus ?? listStatusFromKind(opts.kind)
  return status ? `${opts.timestamp} · ${listStatusLabel(status)}` : opts.timestamp
}
