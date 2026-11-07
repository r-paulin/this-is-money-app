import { formatIbanMasked } from "../../sendMoney/lib/iban"
import type { Transaction } from "../data/mockTransactions"
import {
  formatEurFromCents,
  formatSignedTransactionAmount,
  formatTransactionListEurFromCents,
  type TransactionAmountTone,
} from "./formatTransactionAmount"
import { formatTransactionDetailDate } from "./formatTransactionDetailDate"
import { MONTHS_SHORT } from "./formatTransactionDate"
import { getTransactionDetailVariant } from "./transactionDetailRoute"

const DEFAULT_TRANSFER_IBAN = "FR1420041010050500013M02606"

export type DetailNoticeTone = "warning" | "danger" | "neutral"

export type DetailFooterAction = "dispute" | "get_help" | "download_receipt"

export interface DetailNoticeView {
  tone: DetailNoticeTone
  title: string
  body: string
}

export interface DetailAmountRow {
  label: string
  value: string
  accent?: boolean
}

export interface DetailCashbackView {
  state: "pending" | "received"
  title: string
  secondary?: string
  endText: string
}

export interface DetailCurrencyView {
  paidText: string
  rateText: string
  feeNote: string
}

export interface DetailFeeMetaView {
  purpose: string
  calculation: string
}

export interface DetailRelatedPaymentView {
  label: string
  merchant: string
  secondary?: string
  /** Cashback related payment: signed amount on the trailing side. */
  amountText?: string
  /** Cashback related payment: MCC for the list icon. */
  mcc?: number
  /** Lookup key: matches `transactionId` or `id` on the linked purchase. */
  targetId?: string
}

export interface DetailDisputeView {
  openedLabel: string
  reference: string
}

export type TransferPhase = "completed" | "processing" | "delayed" | "returned"

export interface DetailFooterView {
  actions: DetailFooterAction[]
}

export interface CardPaymentDetailView {
  variant: "card_payment"
  amountText: string
  amountTone: TransactionAmountTone
  amountStrike: boolean
  subtext: string
  summaryStatus: string
  notice?: DetailNoticeView
  /** Cashback credits use "Cashback details" instead of card chrome. */
  detailsTitle: "Transaction details" | "Cashback details"
  /** When true, first section is only `amountRows` (no Paid with / Merchant). */
  cashbackCredit: boolean
  paidWith: string
  chargedOn?: string
  transactionId: string
  merchantName: string
  merchantLocation?: string
  merchantDescriptor?: string
  amountRows?: DetailAmountRow[]
  currency?: DetailCurrencyView
  feeMeta?: DetailFeeMetaView
  relatedPayment?: DetailRelatedPaymentView
  cashback?: DetailCashbackView
  dispute?: DetailDisputeView
  footer: DetailFooterView
}

export interface TransferDetailView {
  variant: "transfer"
  amountText: string
  amountTone: TransactionAmountTone
  amountStrike: boolean
  subtext: string
  transferPhase: TransferPhase
  notice?: DetailNoticeView
  direction: "out" | "in"
  accountHolder: string
  ibanDisplay: string
  /** Full IBAN for Send again — omitted for inbound when unknown. */
  recipientIban?: string
  bankName: string
  showSendAgain: boolean
  reference: string
  date: string
  transferId: string
  amount: string
  fee: string
  total: string
  currencyRows?: DetailAmountRow[]
  sentSection?: { title: string; rows: DetailAmountRow[] }
  returnedSection?: { title: string; rows: DetailAmountRow[] }
  footer: DetailFooterView
}

export interface PayoutDetailView {
  variant: "payout"
  amountText: string
  amountTone: TransactionAmountTone
  amountStrike: boolean
  subtext: string
  notice?: DetailNoticeView
  senderName: string
  reference: string
  date: string
  transferId: string
  amount: string
  footer: DetailFooterView
}

export type TransactionDetailView =
  | CardPaymentDetailView
  | TransferDetailView
  | PayoutDetailView

function transferIdFromTransaction(transaction: Transaction): string {
  if (transaction.transactionId) return transaction.transactionId
  if (transaction.transferId) return transaction.transferId
  const suffix = transaction.id.replace(/[^a-zA-Z0-9]/g, "").slice(-7).toUpperCase()
  return `P26091-${suffix || "2ZN4"}`
}

const DECLINE_SENTENCE: Record<NonNullable<Transaction["declineReason"]>, string> = {
  insufficient_funds: "There was not enough balance to complete the payment.",
  inactive_card: "This card is inactive or closed.",
  expired_card: "This card has expired.",
  suspected_fraud: "This payment was declined because it looked unusual.",
  transaction_not_allowed: "This type of payment is not allowed.",
  velocity_limit: "Too many payments were attempted in a short time.",
  amount_limit: "This payment exceeds your cards spending limit",
  blocked_mcc: "This merchant category is blocked.",
  blocked_region: "Payments in this region are blocked.",
  invalid_card_details: "The card details are not valid.",
  issuer_unavailable: "The card issuer is unavailable.",
  technical_issue: "A technical issue stopped this payment.",
  failed_verification: "Cardholder verification failed.",
}

/** Hold release days: in-person 5, online 10, rental-class 30. */
export function holdReturnDays(transaction: Transaction): number {
  if (transaction.holdCategory === "rental_class") return 30
  if (transaction.holdCategory === "online" || transaction.locationOmitted) return 10
  if (transaction.holdCategory === "in_person") return 5
  const rentalMccs = new Set([7512, 7011, 5812, 5813, 5814, 4111, 4112, 4131, 4121])
  if (rentalMccs.has(transaction.mcc)) return 30
  return 5
}

function formatShortDate(occurredAt: number): string {
  const date = new Date(occurredAt)
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

function holdReturnDateLabel(transaction: Transaction): string {
  const date = new Date(transaction.occurredAt)
  date.setDate(date.getDate() + holdReturnDays(transaction))
  return formatShortDate(date.getTime())
}

function cardMerchantName(transaction: Transaction): string {
  if (transaction.merchant.trim().length > 0) return transaction.merchant
  return "Unknown merchant"
}

function paidWithLabel(transaction: Transaction): string {
  if (transaction.paidWith) return transaction.paidWith
  const last4 = transaction.cardLastFour ?? "4231"
  if (transaction.cardType === "physical") return `Physical card (·· ${last4})`
  return `Virtual card (··· ${last4})`
}

function summarySubtext(status: string, occurredAt: number): string {
  return `${status} · ${formatTransactionDetailDate(occurredAt)}`
}

function isPendingCard(transaction: Transaction): boolean {
  if (transaction.listStatus === "pending") return true
  if (transaction.listStatus === "partially_returned") return true
  if (transaction.listStatus === "partially_charged") return true
  if (transaction.listStatus === "refund_pending") return true
  return (
    transaction.kind === "authorization" || transaction.paymentStatus === "pending"
  )
}

function resolveCardSummaryStatus(transaction: Transaction): string {
  if (transaction.dispute) {
    switch (transaction.dispute.state) {
      case "open":
        return "Dispute open"
      case "won":
        return "Dispute won"
      case "lost":
        return "Dispute lost"
      case "rejected":
        return "Dispute rejected"
      case "reported_not_me":
        return "Reported"
    }
  }
  if (transaction.listStatus === "returned" || transaction.kind === "reversal") {
    return "Credited"
  }
  if (transaction.listStatus === "refund_pending") return "Pending"
  if (transaction.listStatus === "refund" || transaction.listStatus === "partially_refunded") {
    return "Refunded"
  }
  if (transaction.listStatus === "partially_returned") return "Partially returned"
  if (transaction.listStatus === "partially_charged") return "Partially charged"
  if (transaction.listStatus === "charged_later") return "Charged later"
  if (transaction.kind === "declined" || transaction.kind === "failed") return "Declined"
  if (transaction.kind === "refund") return "Refunded"
  if (isPendingCard(transaction)) return "Pending"
  return "Completed"
}

function cardNotice(transaction: Transaction): DetailNoticeView | undefined {
  if (transaction.dispute) {
    const days = transaction.dispute.maxDays ?? 100
    switch (transaction.dispute.state) {
      case "open":
      case "reported_not_me":
        return {
          tone: "warning",
          title: "Dispute in progress",
          body: `A decision can take up to ${days} days. We'll update you when there's news.`,
        }
      case "won":
        return {
          tone: "neutral",
          title: "Dispute won",
          body: "The disputed amount was returned to your available balance.",
        }
      case "lost":
        return {
          tone: "danger",
          title: "Dispute lost",
          body: "The merchant's charge stands. The amount stays on your account.",
        }
      case "rejected":
        return {
          tone: "danger",
          title: "Dispute rejected",
          body: "This payment can't be disputed. Contact the merchant for a refund.",
        }
    }
  }

  if (transaction.kind === "declined" || transaction.kind === "failed") {
    const reason = transaction.declineReason
    return {
      tone: "danger",
      title: "Declined",
      body: reason ? DECLINE_SENTENCE[reason] : "This payment was declined.",
    }
  }

  if (transaction.listStatus === "returned" || transaction.kind === "reversal") {
    if (transaction.returnKind === "merchant_cancelled") {
      return {
        tone: "neutral",
        title: "Payment cancelled",
        body: `${cardMerchantName(transaction)} cancelled the payment.`,
      }
    }
    const days = holdReturnDays(transaction)
    return {
      tone: "neutral",
      title: "Amount returned",
      body: `${cardMerchantName(transaction)} didn’t charge within ${days} days, so the reserved amount was returned.`,
    }
  }

  if (transaction.listStatus === "refund_pending") {
    return {
      tone: "warning",
      title: "Refund pending",
      body: "This refund is on the way. It isn’t in your available balance yet.",
    }
  }

  if (transaction.kind === "fee") {
    const linked = transaction.linkedMerchant ?? "this payment"
    return {
      tone: "neutral",
      title: "Currency conversion fee",
      body: `This fee belongs to your payment at ${linked}.`,
    }
  }

  if (
    transaction.listStatus === "pending" ||
    transaction.kind === "authorization" ||
    transaction.paymentStatus === "pending"
  ) {
    if (transaction.listStatus === "partially_returned") {
      return {
        tone: "warning",
        title: "Partially returned",
        body: "Part of the reserved amount was returned. The rest stays reserved until the merchant finishes the charge.",
      }
    }
    if (transaction.listStatus === "partially_charged") {
      return {
        tone: "warning",
        title: "Charged in parts",
        body: "The merchant charged part of the reserved amount. More charges may follow.",
      }
    }
    return {
      tone: "warning",
      title: "Payment pending",
      body: `This amount is reserved until the merchant completes the charge or the reservation expires. The final amount may differ. Returned by ${holdReturnDateLabel(transaction)} if not charged.`,
    }
  }

  if (transaction.listStatus === "charged_later") {
    return {
      tone: "neutral",
      title: "Charged after hold",
      body: "The merchant charged this payment after the original reservation window.",
    }
  }

  if (transaction.reservedAmountCents != null && transaction.amountCents != null) {
    if (transaction.reservedAmountCents > transaction.amountCents) {
      return {
        tone: "neutral",
        title: "Final amount differs",
        body: `Reserved ${formatTransactionListEurFromCents(transaction.reservedAmountCents)}. Charged ${formatTransactionListEurFromCents(transaction.amountCents)}.`,
      }
    }
    if (transaction.reservedAmountCents < transaction.amountCents) {
      return {
        tone: "neutral",
        title: "Charged more than hold",
        body: `Reserved ${formatTransactionListEurFromCents(transaction.reservedAmountCents)}. Charged ${formatTransactionListEurFromCents(transaction.amountCents)}.`,
      }
    }
  }

  return undefined
}

function cardAmountRows(transaction: Transaction): DetailAmountRow[] | undefined {
  if (transaction.detailAmountRows?.length) return transaction.detailAmountRows
  if (
    transaction.reservedAmountCents != null &&
    transaction.amountCents != null &&
    transaction.reservedAmountCents !== transaction.amountCents &&
    transaction.kind !== "authorization"
  ) {
    return [
      {
        label: "Reserved",
        value: formatTransactionListEurFromCents(transaction.reservedAmountCents),
      },
      {
        label: "Charged",
        value: formatTransactionListEurFromCents(transaction.amountCents),
        accent: true,
      },
    ]
  }
  if (transaction.listStatus === "partially_refunded" && transaction.amountCents != null) {
    return [
      {
        label: "Refunded",
        value: formatTransactionListEurFromCents(transaction.amountCents),
        accent: true,
      },
    ]
  }
  return undefined
}

function cardCurrency(transaction: Transaction): DetailCurrencyView | undefined {
  if (!transaction.secondaryAmountText && !transaction.exchangeRateText) return undefined
  const foreign = transaction.secondaryAmountText?.replace(/^[-+]/, "") ?? ""
  return {
    paidText: foreign ? `Paid ${foreign}` : "Paid in foreign currency",
    rateText: transaction.exchangeRateText ?? "Exchange rate applied at clearing",
    feeNote: "Currency conversion fee is charged separately.",
  }
}

function cardCashback(transaction: Transaction): DetailCashbackView | undefined {
  if (!transaction.cashback) return undefined
  if (transaction.cashback.state === "pending") {
    return {
      state: "pending",
      title: "Cashback pending",
      endText: `${transaction.cashback.percent ?? 1}%`,
    }
  }
  return {
    state: "received",
    title: "Cashback received",
    secondary: transaction.cashback.occurredAt
      ? formatTransactionDetailDate(transaction.cashback.occurredAt)
      : undefined,
    endText: formatSignedTransactionAmount({
      amountCents: transaction.cashback.amountCents ?? 50,
      kind: "cashback",
    }).text,
  }
}

function cardRelated(transaction: Transaction): DetailRelatedPaymentView | undefined {
  if (!transaction.relatedTransactionId && !transaction.linkedMerchant) return undefined
  if (transaction.kind === "fee") {
    return {
      label: "Related payment",
      merchant: transaction.linkedMerchant ?? "Payment",
      secondary: transaction.relatedTransactionId,
      targetId: transaction.relatedTransactionId,
    }
  }
  if (transaction.kind === "cashback") {
    const amount =
      transaction.relatedPaymentAmountCents != null
        ? formatSignedTransactionAmount({
            amountCents: transaction.relatedPaymentAmountCents,
            kind: "purchase",
          }).text
        : undefined
    return {
      label: "Related payment",
      merchant: transaction.linkedMerchant ?? "Payment",
      secondary:
        transaction.relatedPaymentOccurredAt != null
          ? formatTransactionDetailDate(transaction.relatedPaymentOccurredAt)
          : transaction.relatedTransactionId,
      amountText: amount,
      mcc: transaction.relatedPaymentMcc ?? 0,
      targetId: transaction.relatedTransactionId,
    }
  }
  if (
    transaction.kind === "refund" ||
    transaction.listStatus === "refund_pending" ||
    transaction.listStatus === "refund" ||
    transaction.listStatus === "partially_refunded"
  ) {
    return {
      label: "Related payment",
      merchant: cardMerchantName(transaction),
      secondary: transaction.relatedTransactionId,
      targetId: transaction.relatedTransactionId,
    }
  }
  return undefined
}

function cashbackCreditRows(transaction: Transaction): DetailAmountRow[] | undefined {
  if (transaction.kind !== "cashback") return undefined
  if (transaction.detailAmountRows?.length) return transaction.detailAmountRows
  const chargedCents = transaction.cashbackChargedCents
  const rate = transaction.cashbackRatePercent ?? 1
  const received = formatSignedTransactionAmount({
    amountCents: transaction.amountCents ?? 0,
    kind: "cashback",
  }).text
  if (chargedCents == null) return undefined
  return [
    { label: "Charged", value: formatTransactionListEurFromCents(chargedCents) },
    { label: "Cashback rate", value: `${rate}%` },
    { label: "Cashback received", value: received, accent: true },
  ]
}

function cardFeeMeta(transaction: Transaction): DetailFeeMetaView | undefined {
  if (transaction.kind !== "fee") return undefined
  return {
    purpose: transaction.feePurpose ?? "Currency conversion",
    calculation: transaction.feeCalculation ?? "1% of the converted amount",
  }
}

function cardDispute(transaction: Transaction): DetailDisputeView | undefined {
  if (!transaction.dispute) return undefined
  return {
    openedLabel: formatTransactionDetailDate(transaction.dispute.openedAt),
    reference: transaction.dispute.reference,
  }
}

function cardFooter(transaction: Transaction): DetailFooterView {
  if (transaction.dispute) return { actions: ["get_help"] }
  if (transaction.kind === "declined" || transaction.kind === "failed") {
    return { actions: ["get_help"] }
  }
  if (isPendingCard(transaction) && !transaction.dispute) {
    return { actions: ["get_help"] }
  }
  if (transaction.listStatus === "returned" || transaction.kind === "reversal") {
    return { actions: ["get_help"] }
  }
  if (transaction.kind === "fee" || transaction.kind === "cashback") {
    return { actions: ["get_help"] }
  }
  // Completed (and similar settled) card payments: Dispute
  return { actions: ["dispute"] }
}

function chargedOnLabel(transaction: Transaction): string | undefined {
  if (transaction.chargedAt == null) return undefined
  const purchaseDay = new Date(transaction.occurredAt).toDateString()
  const chargedDay = new Date(transaction.chargedAt).toDateString()
  if (purchaseDay === chargedDay) return undefined
  return formatTransactionDetailDate(transaction.chargedAt)
}

function buildCardPaymentView(transaction: Transaction): CardPaymentDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
    listStatus: transaction.listStatus,
  })
  const summaryStatus = resolveCardSummaryStatus(transaction)
  const descriptor = transaction.merchantDescriptor?.trim()
  const descriptorDiffers =
    descriptor != null &&
    descriptor.length > 0 &&
    descriptor.toLowerCase() !== transaction.merchant.trim().toLowerCase()
  const cashbackCredit = transaction.kind === "cashback"

  return {
    variant: "card_payment",
    amountText: amount.text,
    amountTone: amount.tone,
    amountStrike: amount.tone === "declined",
    subtext: summarySubtext(summaryStatus, transaction.occurredAt),
    summaryStatus,
    notice: cardNotice(transaction),
    detailsTitle: cashbackCredit ? "Cashback details" : "Transaction details",
    cashbackCredit,
    paidWith: paidWithLabel(transaction),
    chargedOn: chargedOnLabel(transaction),
    transactionId: transferIdFromTransaction(transaction),
    merchantName: cardMerchantName(transaction),
    merchantLocation: transaction.locationOmitted
      ? undefined
      : transaction.merchantLocation?.trim() || "Location unavailable",
    merchantDescriptor: descriptorDiffers ? descriptor : undefined,
    amountRows: cashbackCredit
      ? cashbackCreditRows(transaction)
      : cardAmountRows(transaction),
    currency: cardCurrency(transaction),
    feeMeta: cardFeeMeta(transaction),
    relatedPayment: cardRelated(transaction),
    cashback: cardCashback(transaction),
    dispute: cardDispute(transaction),
    footer: cardFooter(transaction),
  }
}

function resolveTransferPhase(transaction: Transaction): TransferPhase {
  if (transaction.transferPhase) return transaction.transferPhase
  if (transaction.status === "on_the_way") return "processing"
  if (transaction.status === "overdue") return "delayed"
  if (transaction.listStatus === "returned" || transaction.listStatus === "reverted") {
    return "returned"
  }
  return "completed"
}

function transferNotice(
  phase: TransferPhase,
  transaction: Transaction,
): DetailNoticeView | undefined {
  if (phase === "processing") {
    return {
      tone: "warning",
      title: "Processing",
      body: transaction.statusSubtext ?? "Expected within 2 business days",
    }
  }
  if (phase === "delayed") {
    return {
      tone: "warning",
      title: "Transfer is taking longer",
      body:
        transaction.statusSubtext ??
        "It hasn’t arrived within the expected time. We’ll update you when there’s new information.",
    }
  }
  if (phase === "returned") {
    return {
      tone: "danger",
      title: "Check recipient details",
      body:
        transaction.returnReason ??
        "The transfer was returned. Check the recipient details and try again.",
    }
  }
  return undefined
}

function transferFooter(phase: TransferPhase): DetailFooterView {
  if (phase === "completed") {
    return { actions: ["download_receipt", "get_help"] }
  }
  return { actions: ["get_help"] }
}

function transferSummaryStatus(phase: TransferPhase): string {
  switch (phase) {
    case "processing":
      return "Pending"
    case "delayed":
      return "Delayed"
    case "returned":
      return "Returned"
    default:
      return "Completed"
  }
}

function buildTransferView(transaction: Transaction): TransferDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
    listStatus: transaction.listStatus,
  })
  const cents = Math.abs(transaction.amountCents ?? 0)
  const feeCents = transaction.serviceFeeCents ?? 0
  const phase = resolveTransferPhase(transaction)
  const direction = transaction.kind === "transfer_in" ? "in" : "out"
  const statusLabel = transferSummaryStatus(phase)

  return {
    variant: "transfer",
    amountText: amount.text,
    amountTone: amount.tone,
    amountStrike: amount.tone === "declined",
    subtext:
      phase === "processing" || phase === "delayed"
        ? summarySubtext(statusLabel, transaction.occurredAt)
        : summarySubtext(statusLabel, transaction.occurredAt),
    transferPhase: phase,
    notice: transferNotice(phase, transaction),
    direction,
    accountHolder:
      direction === "in"
        ? (transaction.senderName ?? "BOLT SERVICES CA INC.")
        : (transaction.recipientName ?? "Élodie Moreau"),
    ibanDisplay:
      transaction.ibanDisplay ??
      formatIbanMasked(transaction.recipientIban ?? DEFAULT_TRANSFER_IBAN),
    recipientIban:
      direction === "out"
        ? (transaction.recipientIban ?? DEFAULT_TRANSFER_IBAN)
        : transaction.recipientIban,
    bankName: transaction.bankName ?? "BNP Paribas",
    showSendAgain: direction === "out" && phase !== "returned",
    reference:
      transaction.reference ??
      "Payment for the apartment rental for August. Please ensure timely processing to avoid any late fees. Thank you!",
    date: formatTransactionDetailDate(transaction.occurredAt),
    transferId: transferIdFromTransaction(transaction),
    amount: formatEurFromCents(cents),
    fee: formatEurFromCents(feeCents),
    total: formatEurFromCents(cents + feeCents),
    currencyRows: transaction.transferCurrencyRows,
    sentSection: transaction.transferSentSection,
    returnedSection: transaction.transferReturnedSection,
    footer: transferFooter(phase),
  }
}

function buildPayoutView(transaction: Transaction): PayoutDetailView {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
    listStatus: transaction.listStatus,
  })
  const cents = Math.abs(transaction.amountCents ?? 0)

  return {
    variant: "payout",
    amountText: amount.text,
    amountTone: amount.tone,
    amountStrike: false,
    subtext: summarySubtext("Completed", transaction.occurredAt),
    senderName: transaction.senderName ?? "BOLT SERVICES CA INC.",
    reference:
      transaction.reference ??
      `Order #16556454 ${formatTransactionDetailDate(transaction.occurredAt)}`,
    date: formatTransactionDetailDate(transaction.occurredAt),
    transferId: transferIdFromTransaction(transaction),
    amount: formatEurFromCents(cents),
    footer: { actions: ["get_help"] },
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
