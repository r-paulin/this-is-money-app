import type { Transaction } from "../data/mockTransactions"
import { formatEurFromCents, formatSignedTransactionAmount } from "./formatTransactionAmount"
import { formatTransactionDetailDate } from "./formatTransactionDetailDate"
import { getTransactionDetailVariant } from "./transactionDetailRoute"

export type TransferDetailStatus = "completed" | "on_the_way" | "overdue"

export interface CardPaymentDetailView {
  variant: "card_payment"
  amountText: string
  amountTone: "primary" | "credit" | "declined" | "missing"
  subtext: string
  cardLabel: string
  merchantName: string
  merchantLocation?: string
  merchantDescriptor?: string
  status: string
  statusSubtext?: string
}

export interface TransferDetailView {
  variant: "transfer"
  amountText: string
  amountTone: "primary" | "credit" | "declined" | "missing"
  subtext: string
  transferStatus: TransferDetailStatus
  accountHolder: string
  ibanDisplay: string
  bankName: string
  reference: string
  date: string
  transferId: string
  amount: string
  fee: string
  total: string
}

export interface PayoutDetailView {
  variant: "payout"
  amountText: string
  amountTone: "primary" | "credit" | "declined" | "missing"
  subtext: string
  senderName: string
  reference: string
  date: string
  transferId: string
  amount: string
}

export type TransactionDetailView =
  | CardPaymentDetailView
  | TransferDetailView
  | PayoutDetailView

function transferIdFromTransaction(transaction: Transaction): string {
  const suffix = transaction.id.replace(/[^a-zA-Z0-9]/g, "").slice(-7).toUpperCase()
  return `P260820-${suffix || "K4M2QX9"}`
}

const DECLINE_SENTENCE: Record<NonNullable<Transaction["declineReason"]>, string> = {
  insufficient_funds: "There was not enough balance to complete the payment.",
  inactive_card: "This card is inactive or closed.",
  expired_card: "This card has expired.",
  suspected_fraud: "This payment was declined because it looked unusual.",
  transaction_not_allowed: "This type of payment is not allowed.",
  velocity_limit: "Too many payments were attempted in a short time.",
  amount_limit: "This payment is above the amount limit.",
  blocked_mcc: "This merchant category is blocked.",
  blocked_region: "Payments in this region are blocked.",
  invalid_card_details: "The card details are not valid.",
  issuer_unavailable: "The card issuer is unavailable.",
  technical_issue: "A technical issue stopped this payment.",
  failed_verification: "Cardholder verification failed.",
}

function holdReleaseDate(occurredAt: number): string {
  const date = new Date(occurredAt)
  date.setDate(date.getDate() + 7)
  return formatTransactionDetailDate(date.getTime()).split(",")[0] ?? ""
}

function cardMerchantName(transaction: Transaction): string {
  if (transaction.merchant.trim().length > 0) return transaction.merchant
  return "Unknown merchant"
}

function cardStatus(transaction: Transaction): { status: string; statusSubtext?: string } {
  if (transaction.kind === "declined" || transaction.kind === "failed") {
    const reason = transaction.declineReason
    return {
      status: "Declined",
      statusSubtext: reason ? DECLINE_SENTENCE[reason] : undefined,
    }
  }
  if (transaction.kind === "reversal") {
    return { status: "Hold released", statusSubtext: "No money was taken." }
  }
  if (transaction.kind === "refund") {
    return {
      status: "Refunded",
      statusSubtext: "The merchant refunded the payment.",
    }
  }
  const pending =
    transaction.kind === "authorization" || transaction.paymentStatus === "pending"
  if (pending) {
    return {
      status: "Pending",
      statusSubtext:
        transaction.statusSubtext ??
        `The merchant has placed a hold. It will be released on ${holdReleaseDate(transaction.occurredAt)} if the merchant does not collect the payment.`,
    }
  }
  return { status: "Completed" }
}

function buildCardPaymentView(transaction: Transaction): CardPaymentDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
  })
  const status = cardStatus(transaction)
  const descriptor = transaction.merchantDescriptor?.trim()
  const descriptorDiffers =
    descriptor != null &&
    descriptor.length > 0 &&
    descriptor.toLowerCase() !== transaction.merchant.trim().toLowerCase()

  return {
    variant: "card_payment",
    amountText: amount.text,
    amountTone: amount.tone,
    subtext: formatTransactionDetailDate(transaction.occurredAt),
    cardLabel: "VISA, ·· 4231",
    merchantName: cardMerchantName(transaction),
    merchantLocation: transaction.locationOmitted
      ? undefined
      : transaction.merchantLocation?.trim() || "Location unavailable",
    merchantDescriptor: descriptorDiffers ? descriptor : undefined,
    status: status.status,
    statusSubtext: status.statusSubtext,
  }
}

function buildTransferView(transaction: Transaction): TransferDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
  })
  const cents = Math.abs(transaction.amountCents ?? 0)
  const status = transaction.status ?? "completed"

  const statusLabel =
    status === "on_the_way"
      ? "On the way"
      : status === "overdue"
        ? "Overdue"
        : "Completed"

  return {
    variant: "transfer",
    amountText: amount.text,
    amountTone: amount.tone,
    subtext: `${statusLabel} · ${formatTransactionDetailDate(transaction.occurredAt)}`,
    transferStatus: status as TransferDetailStatus,
    accountHolder: transaction.recipientName ?? "Élodie Moreau",
    ibanDisplay: "FR14 ●●●● ●●●● ●●●● ●●●● 2606",
    bankName: transaction.bankName ?? "BNP Paribas",
    reference:
      transaction.reference ??
      "Payment for the apartment rental for August. Please ensure timely processing to avoid any late fees. Thank you!",
    date: formatTransactionDetailDate(transaction.occurredAt),
    transferId: transaction.transferId ?? transferIdFromTransaction(transaction),
    amount: formatEurFromCents(cents),
    fee: formatEurFromCents(0),
    total: formatEurFromCents(cents),
  }
}

function buildPayoutView(transaction: Transaction): PayoutDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
  })
  const cents = Math.abs(transaction.amountCents ?? 0)

  return {
    variant: "payout",
    amountText: amount.text,
    amountTone: amount.tone,
    subtext: "Ride payout",
    senderName: transaction.senderName ?? "BOLT SERVICES CA INC.",
    reference:
      transaction.reference ??
      `Order #16556454 ${formatTransactionDetailDate(transaction.occurredAt)}`,
    date: formatTransactionDetailDate(transaction.occurredAt),
    transferId: transaction.transferId ?? transferIdFromTransaction(transaction),
    amount: formatEurFromCents(cents),
  }
}

export function buildTransactionDetailView(transaction: Transaction): TransactionDetailView {
  const variant = getTransactionDetailVariant(transaction.kind)

  switch (variant) {
    case "transfer":
      return buildTransferView(transaction)
    case "payout":
      return buildPayoutView(transaction)
    case "card_payment":
      return buildCardPaymentView(transaction)
  }
}
