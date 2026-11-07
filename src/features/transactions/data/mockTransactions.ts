import type { MccThemeId, TransactionKind } from "./mccThemes"
import type { TransactionListStatus } from "../lib/listStatus"

/** Inclusive day count: today through 6 days ago. */
export const MOCK_HISTORY_DAYS = 7

export type TransferPhase = "completed" | "processing" | "delayed" | "returned"

export type HoldCategory = "in_person" | "online" | "rental_class"

export interface TransactionCashback {
  state: "pending" | "received"
  percent?: number
  amountCents?: number
  occurredAt?: number
}

export interface TransactionDispute {
  state: "open" | "won" | "lost" | "rejected" | "reported_not_me"
  openedAt: number
  reference: string
  maxDays?: number
}

export interface Transaction {
  id: string
  merchant: string
  /** Unix ms */
  occurredAt: number
  /** Minor units (cents). Sign is implied by kind for display. Omit for `--` amount. */
  amountCents?: number | null
  currency: "EUR"
  mcc: number
  kind: TransactionKind
  themeOverride?: MccThemeId
  /** Activity list secondary status from Figma Flow / Activity. */
  listStatus?: TransactionListStatus
  /** When set, secondary shows `Reserved €X` instead of a status label. */
  reservedAmountCents?: number
  /** Fee rows: merchant that the fee belongs to (`09:30 · Neste`). */
  linkedMerchant?: string
  /** Foreign / original currency line under the EUR amount (e.g. `-550.00 kr`). */
  secondaryAmountText?: string
  exchangeRateText?: string
  /** Optional service fee in cents (ATM) */
  serviceFeeCents?: number
  /** Detail screen — optional overrides for mock content */
  merchantLocation?: string
  /** Card payment detail status */
  paymentStatus?: "completed" | "pending"
  statusSubtext?: string
  declineReason?:
    | "insufficient_funds"
    | "inactive_card"
    | "expired_card"
    | "suspected_fraud"
    | "transaction_not_allowed"
    | "velocity_limit"
    | "amount_limit"
    | "blocked_mcc"
    | "blocked_region"
    | "invalid_card_details"
    | "issuer_unavailable"
    | "technical_issue"
    | "failed_verification"
  merchantDescriptor?: string
  /** Online merchant: omit the location row instead of "Location unavailable". */
  locationOmitted?: boolean
  status?: "completed" | "on_the_way" | "overdue"
  transferPhase?: TransferPhase
  reference?: string
  transferId?: string
  transactionId?: string
  recipientName?: string
  bankName?: string
  senderName?: string
  ibanDisplay?: string
  /** Full IBAN for Send again / masked display. */
  recipientIban?: string
  paidWith?: string
  cardType?: "virtual" | "physical"
  cardLastFour?: string
  chargedAt?: number
  holdCategory?: HoldCategory
  returnKind?: "expired" | "merchant_cancelled"
  returnReason?: string
  relatedTransactionId?: string
  /** Cashback / fee list+detail: linked purchase amount (cents). */
  relatedPaymentAmountCents?: number
  /** Cashback detail: linked purchase timestamp. */
  relatedPaymentOccurredAt?: number
  /** Cashback detail: linked purchase MCC for the Related payment row icon. */
  relatedPaymentMcc?: number
  /** Cashback credit detail: amount the rate was applied to. */
  cashbackChargedCents?: number
  /** Cashback credit detail: percent rate (e.g. 1). */
  cashbackRatePercent?: number
  cashback?: TransactionCashback
  feePurpose?: string
  feeCalculation?: string
  dispute?: TransactionDispute
  detailAmountRows?: { label: string; value: string; accent?: boolean }[]
  transferCurrencyRows?: { label: string; value: string; accent?: boolean }[]
  transferSentSection?: {
    title: string
    rows: { label: string; value: string; accent?: boolean }[]
  }
  transferReturnedSection?: {
    title: string
    rows: { label: string; value: string; accent?: boolean }[]
  }
}

function atLocal(year: number, monthIndex: number, day: number, hour: number, minute: number) {
  return new Date(year, monthIndex, day, hour, minute, 0, 0).getTime()
}

function payout(id: string, occurredAt: number, amountCents: number): Transaction {
  return {
    id,
    merchant: "Ride payout",
    occurredAt,
    amountCents,
    currency: "EUR",
    mcc: 0,
    kind: "ride_payout",
  }
}

/**
 * Mock feed relative to `now` (app open time): last {@link MOCK_HISTORY_DAYS} days,
 * ~60% ride payouts, fuel mainly Neste / Virši spread across those days.
 */
export function buildMockTransactions(now = new Date()): Transaction[] {
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()

  const onDay = (daysAgo: number, hour: number, minute: number) =>
    atLocal(y, m, d - daysAgo, hour, minute)

  const edgeCases: Transaction[] = [
    // Day 0 — today
    {
      id: "tx-pending-neste",
      merchant: "Neste",
      occurredAt: onDay(0, 11, 40),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "authorization",
      listStatus: "pending",
      paymentStatus: "pending",
      merchantLocation: "Rīga, Latvia",
      holdCategory: "in_person",
      cashback: { state: "pending", percent: 1 },
      transactionId: "P26091-PENDING",
    },
    {
      id: "tx-completed-neste",
      merchant: "Neste",
      occurredAt: onDay(0, 11, 50),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      merchantLocation: "Rīga, Latvia",
      chargedAt: onDay(-1, 9, 15),
      cashback: { state: "received", amountCents: 50, occurredAt: onDay(-1, 9, 15) },
      transactionId: "P26091-COMPLT",
    },
    {
      id: "tx-cashback",
      merchant: "Cashback",
      occurredAt: onDay(0, 12, 0),
      amountCents: 50,
      currency: "EUR",
      mcc: 0,
      kind: "cashback",
      linkedMerchant: "Neste",
      relatedTransactionId: "P26091-COMPLT",
      relatedPaymentAmountCents: 5000,
      relatedPaymentOccurredAt: onDay(0, 11, 50),
      relatedPaymentMcc: 5541,
      cashbackChargedCents: 5000,
      cashbackRatePercent: 1,
    },
    {
      id: "tx-transfer-edgars",
      merchant: "Edgars Kokins",
      occurredAt: onDay(0, 8, 30),
      amountCents: 7500,
      currency: "EUR",
      mcc: 6012,
      kind: "transfer_out",
      reference: "August rent",
      transferId: "P260820-EDGARS",
      transferPhase: "completed",
      recipientName: "Edgars Kokins",
      status: "completed",
    },
    {
      id: "tx-transfer-processing",
      merchant: "Māra Liepiņa",
      occurredAt: onDay(0, 21, 40),
      amountCents: 5000,
      currency: "EUR",
      mcc: 6012,
      kind: "transfer_out",
      reference: "Rent payment for August. Please process promptly to avoid late fees. Thanks!",
      transferId: "P260820-K4M2QX9",
      transferPhase: "processing",
      status: "on_the_way",
      recipientName: "Élodie Moreau",
    },
    {
      id: "tx-declined-neste",
      merchant: "Neste",
      occurredAt: onDay(0, 11, 25),
      amountCents: 300000,
      currency: "EUR",
      mcc: 5541,
      kind: "declined",
      listStatus: "declined",
      declineReason: "amount_limit",
      cardType: "physical",
      cardLastFour: "8872",
      merchantLocation: "Rīga, Latvia",
    },

    // Day 1
    {
      id: "tx-partially-returned-virsi",
      merchant: "Virši",
      occurredAt: onDay(1, 10, 15),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "authorization",
      listStatus: "partially_returned",
      paymentStatus: "pending",
    },
    {
      id: "tx-shopping-lidl",
      merchant: "Lidl",
      occurredAt: onDay(1, 18, 22),
      amountCents: 5430,
      currency: "EUR",
      mcc: 5411,
      kind: "purchase",
      merchantLocation: "Rīga, Latvia",
    },
    {
      id: "tx-atm-swed",
      merchant: "ATM, Swedbank",
      occurredAt: onDay(1, 8, 5),
      amountCents: 5210,
      currency: "EUR",
      mcc: 6011,
      kind: "atm",
      serviceFeeCents: 210,
    },
    {
      id: "tx-transfer-joonas",
      merchant: "Joonas Mengel",
      occurredAt: onDay(1, 14, 10),
      amountCents: 3200,
      currency: "EUR",
      mcc: 6012,
      kind: "transfer_out",
      reference: "Shared fuel",
      transferPhase: "delayed",
      status: "overdue",
      recipientName: "Joonas Mengel",
    },
    {
      id: "tx-transfer-returned-fx",
      merchant: "Wang Wei",
      occurredAt: onDay(1, 16, 0),
      amountCents: 8200,
      currency: "EUR",
      mcc: 6012,
      kind: "transfer_out",
      transferPhase: "returned",
      listStatus: "returned",
      recipientName: "Wang Wei",
      returnReason: "The recipient bank could not credit the account. Check the details and try again.",
      transferSentSection: {
        title: "You sent",
        rows: [
          { label: "Amount", value: "CA$120.00" },
          { label: "Rate", value: "1 EUR = 1.46 CAD" },
          { label: "Total", value: "€82.00", accent: true },
        ],
      },
      transferReturnedSection: {
        title: "Returned to you",
        rows: [
          { label: "Returned by bank", value: "CA$118.50" },
          { label: "Rate", value: "1 EUR = 1.45 CAD" },
          { label: "Credited", value: "€81.72", accent: true },
        ],
      },
    },
    {
      id: "tx-utilities-lmt",
      merchant: "LMT",
      occurredAt: onDay(1, 10, 0),
      amountCents: 2499,
      currency: "EUR",
      mcc: 4814,
      kind: "purchase",
      locationOmitted: true,
    },

    // Day 2
    {
      id: "tx-partially-charged-rental",
      merchant: "Bolt Drive",
      occurredAt: onDay(2, 9, 50),
      amountCents: 12000,
      currency: "EUR",
      mcc: 7512,
      kind: "authorization",
      listStatus: "partially_charged",
      paymentStatus: "pending",
      holdCategory: "rental_class",
      reservedAmountCents: 20000,
      detailAmountRows: [
        { label: "Reserved", value: "€200.00" },
        { label: "Charged so far", value: "€120.00", accent: true },
      ],
    },
    {
      id: "tx-charged-later-virsi",
      merchant: "Virši",
      occurredAt: onDay(2, 10, 5),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      listStatus: "charged_later",
      chargedAt: onDay(2, 10, 5),
    },
    {
      id: "tx-dispute-open-neste",
      merchant: "Neste",
      occurredAt: onDay(2, 13, 0),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      merchantLocation: "Rīga, Latvia",
      dispute: {
        state: "open",
        openedAt: onDay(1, 10, 0),
        reference: "DSP-2609-88421",
        maxDays: 100,
      },
    },
    {
      id: "tx-ev-elektrum",
      merchant: "Elektrum Drive",
      occurredAt: onDay(2, 16, 40),
      amountCents: 1850,
      currency: "EUR",
      mcc: 5552,
      kind: "purchase",
      merchantLocation: "Rīga, Latvia",
    },
    {
      id: "tx-missing-amount",
      merchant: "Neste",
      occurredAt: onDay(2, 8, 15),
      amountCents: null,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
    },

    // Day 3
    {
      id: "tx-reserved-lower-neste",
      merchant: "Neste",
      occurredAt: onDay(3, 11, 20),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      reservedAmountCents: 10000,
    },
    {
      id: "tx-refund-pending-neste",
      merchant: "Neste",
      occurredAt: onDay(3, 11, 45),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "refund",
      listStatus: "refund_pending",
      relatedTransactionId: "P26091-COMPLT",
    },
    {
      id: "tx-dispute-won-virsi",
      merchant: "Virši",
      occurredAt: onDay(3, 15, 0),
      amountCents: 6200,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      merchantLocation: "Jelgava, Latvia",
      dispute: {
        state: "won",
        openedAt: onDay(5, 9, 0),
        reference: "DSP-2609-77102",
        maxDays: 70,
      },
    },
    {
      id: "tx-fuel-virsi-plain",
      merchant: "Virši",
      occurredAt: onDay(3, 7, 45),
      amountCents: 6200,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      merchantLocation: "Jelgava, Latvia",
    },

    // Day 4
    {
      id: "tx-reserved-higher-rimi",
      merchant: "RIMI",
      occurredAt: onDay(4, 10, 40),
      amountCents: 5500,
      currency: "EUR",
      mcc: 5411,
      kind: "purchase",
      reservedAmountCents: 5000,
    },
    {
      id: "tx-refund-neste",
      merchant: "Neste",
      occurredAt: onDay(4, 11, 0),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "refund",
      listStatus: "refund",
      relatedTransactionId: "P26091-COMPLT",
    },
    {
      id: "tx-dispute-lost-lidl",
      merchant: "Lidl",
      occurredAt: onDay(4, 12, 0),
      amountCents: 5430,
      currency: "EUR",
      mcc: 5411,
      kind: "purchase",
      merchantLocation: "Rīga, Latvia",
      dispute: {
        state: "lost",
        openedAt: onDay(6, 11, 0),
        reference: "DSP-2608-55210",
        maxDays: 100,
      },
    },
    {
      id: "tx-shopping-rimi",
      merchant: "RIMI",
      occurredAt: onDay(4, 17, 30),
      amountCents: 3120,
      currency: "EUR",
      mcc: 5411,
      kind: "purchase",
    },
    {
      id: "tx-fuel-neste-plain",
      merchant: "Neste",
      occurredAt: onDay(4, 19, 10),
      amountCents: 4800,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
    },

    // Day 5
    {
      id: "tx-returned-virsi",
      merchant: "Virši",
      occurredAt: onDay(5, 11, 10),
      amountCents: 10000,
      currency: "EUR",
      mcc: 5541,
      kind: "reversal",
      listStatus: "returned",
      returnKind: "expired",
      holdCategory: "in_person",
    },
    {
      id: "tx-partially-refunded-virsi",
      merchant: "Virši",
      occurredAt: onDay(5, 10, 30),
      amountCents: 2000,
      currency: "EUR",
      mcc: 5541,
      kind: "refund",
      listStatus: "partially_refunded",
      relatedTransactionId: "P26091-VIRSI1",
    },
    {
      id: "tx-fx-fee-espresso-house",
      merchant: "Currency conversion fee",
      occurredAt: onDay(5, 9, 30),
      amountCents: 50,
      currency: "EUR",
      mcc: 0,
      kind: "fee",
      linkedMerchant: "Espresso House",
      relatedTransactionId: "P26091-FXEH01",
      feePurpose: "Currency conversion",
      feeCalculation: "1% of the converted amount",
      transactionId: "P26091-FXFEE1",
    },
    {
      id: "tx-fx-espresso-house",
      merchant: "Espresso House",
      occurredAt: onDay(5, 9, 30),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5812,
      kind: "purchase",
      secondaryAmountText: "-550.00 kr",
      exchangeRateText: "1 EUR = 11.00 SEK",
      merchantLocation: "Stockholm, Sweden",
      merchantDescriptor: "ESPRESSO HOUSE AB",
      transactionId: "P26091-FXEH01",
    },
    {
      id: "tx-dispute-rejected-rimi",
      merchant: "RIMI",
      occurredAt: onDay(5, 14, 0),
      amountCents: 3120,
      currency: "EUR",
      mcc: 5411,
      kind: "purchase",
      dispute: {
        state: "rejected",
        openedAt: onDay(4, 10, 0),
        reference: "DSP-2609-11002",
      },
    },
    {
      id: "tx-reported-not-me",
      merchant: "LMT",
      occurredAt: onDay(5, 18, 0),
      amountCents: 2499,
      currency: "EUR",
      mcc: 4814,
      kind: "purchase",
      locationOmitted: true,
      dispute: {
        state: "reported_not_me",
        openedAt: onDay(4, 12, 0),
        reference: "DSP-2609-99110",
        maxDays: 70,
      },
    },

    // Day 6 — oldest day in the window
    {
      id: "tx-declined-transfer",
      merchant: "Edgars Kokins",
      occurredAt: onDay(6, 9, 56),
      amountCents: 5000,
      currency: "EUR",
      mcc: 6012,
      kind: "declined",
      listStatus: "declined",
      themeOverride: "money",
    },
    {
      id: "tx-refund-fx-virsi",
      merchant: "Virši",
      occurredAt: onDay(6, 9, 40),
      amountCents: 4920,
      currency: "EUR",
      mcc: 5541,
      kind: "refund",
      listStatus: "refund",
      secondaryAmountText: "+£42.00",
    },
    {
      id: "tx-refund-unpaired-neste",
      merchant: "Neste",
      occurredAt: onDay(6, 9, 0),
      amountCents: 5000,
      currency: "EUR",
      mcc: 5541,
      kind: "refund",
      listStatus: "refund",
    },
    {
      id: "tx-missing-name",
      merchant: "",
      occurredAt: onDay(6, 8, 40),
      amountCents: 2500,
      currency: "EUR",
      mcc: 0,
      kind: "purchase",
    },
    {
      id: "tx-long-name",
      merchant:
        "Metropolitan Drive — Urban Car Rental and Fleet Services Latvia Riga Branch Central",
      occurredAt: onDay(6, 12, 5),
      amountCents: 18900,
      currency: "EUR",
      mcc: 7512,
      kind: "purchase",
    },
    {
      id: "tx-fuel-virsi-oldest",
      merchant: "Virši",
      occurredAt: onDay(6, 7, 20),
      amountCents: 4100,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
      merchantLocation: "Liepāja, Latvia",
    },
  ]

  const payoutAmounts = [2500, 3120, 1845, 4200, 2750, 1590, 3340, 1980, 4560, 2210]
  const payoutCount = Math.round((edgeCases.length * 0.6) / 0.4)
  const items: Transaction[] = [...edgeCases]

  for (let i = 0; i < payoutCount; i++) {
    const day = i % MOCK_HISTORY_DAYS
    const hour = 8 + (i % 10)
    const minute = (i * 7) % 60
    const amount = payoutAmounts[i % payoutAmounts.length]!
    items.push(payout(`tx-payout-${i}`, onDay(day, hour, minute), amount))
  }

  return items
}
