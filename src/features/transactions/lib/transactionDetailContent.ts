import type { Transaction } from "../data/mockTransactions"
import { formatEurFromCents, formatSignedTransactionAmount } from "./formatTransactionAmount"
import { formatTransactionDetailDate } from "./formatTransactionDetailDate"
import { getTransactionDetailVariant } from "./transactionDetailRoute"
import { merchantTitle } from "./merchantTitle"

export type TransferDetailStatus = "completed" | "on_the_way" | "overdue"

export interface CardPaymentDetailView {
  variant: "card_payment"
  amountText: string
  amountTone: "primary" | "credit" | "declined" | "missing"
  subtext: string
  cardLabel: string
  merchantName: string
  merchantLocation?: string
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

function buildCardPaymentView(transaction: Transaction): CardPaymentDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
  })
  const paymentStatus = transaction.paymentStatus ?? "completed"

  return {
    variant: "card_payment",
    amountText: amount.text,
    amountTone: amount.tone,
    subtext: formatTransactionDetailDate(transaction.occurredAt),
    cardLabel: "VISA, ·· 4231",
    merchantName: merchantTitle(transaction),
    merchantLocation: transaction.merchantLocation ?? "Lyon, Auvergne-Rhône-Alpes",
    status: paymentStatus === "pending" ? "Pending" : "Completed",
    statusSubtext:
      transaction.statusSubtext ??
      (paymentStatus === "pending"
        ? "Will be automatically reversed on 19 Nov 2026 if unclaimed by the merchant."
        : undefined),
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
