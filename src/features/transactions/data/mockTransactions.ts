import type { MccThemeId, TransactionKind } from "./mccThemes"

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
  /** Optional service fee in cents (ATM) */
  serviceFeeCents?: number
}

function atLocal(year: number, monthIndex: number, day: number, hour: number, minute: number) {
  return new Date(year, monthIndex, day, hour, minute, 0, 0).getTime()
}

function payout(
  id: string,
  occurredAt: number,
  amountCents: number,
): Transaction {
  return {
    id,
    merchant: "Ride payout",
    occurredAt,
    amountCents,
    currency: "EUR",
    mcc: 4829,
    kind: "ride_payout",
  }
}

/**
 * Mock feed: 8 calendar days relative to the device clock.
 * Each day includes at least 3 ride payouts, plus a mix of MCC categories.
 */
export function buildMockTransactions(now = new Date()): Transaction[] {
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()

  const onDay = (daysAgo: number, hour: number, minute: number) =>
    atLocal(y, m, d - daysAgo, hour, minute)

  const payoutAmounts = [2500, 3120, 1845, 4200, 2750, 1590, 3340, 1980, 4560, 2210]

  const items: Transaction[] = []

  for (let day = 0; day < 8; day++) {
    // ≥3 ride payouts per day
    for (let i = 0; i < 3; i++) {
      const hour = 9 + i * 3
      const amount = payoutAmounts[(day * 3 + i) % payoutAmounts.length]!
      items.push(payout(`tx-payout-d${day}-${i}`, onDay(day, hour, 10 + i * 7), amount))
    }
  }

  // Extra variety across days (MCC edge cases from Figma)
  items.push(
    {
      id: "tx-fuel-esso",
      merchant: "Esso",
      occurredAt: onDay(0, 14, 22),
      amountCents: -10000,
      currency: "EUR",
      mcc: 5541,
      kind: "purchase",
    },
    {
      id: "tx-food-leon",
      merchant: "Léon de Bruxelles",
      occurredAt: onDay(0, 13, 15),
      amountCents: -4560,
      currency: "EUR",
      mcc: 5812,
      kind: "purchase",
    },
    {
      id: "tx-decline-carrefour",
      merchant: "Carrefour",
      occurredAt: onDay(0, 10, 30),
      amountCents: -3000,
      currency: "EUR",
      mcc: 5411,
      kind: "declined",
    },
    {
      id: "tx-decline-transfer",
      merchant: "Élodie Moreau",
      occurredAt: onDay(0, 9, 56),
      amountCents: -5000,
      currency: "EUR",
      mcc: 6011,
      kind: "declined",
    },
    {
      id: "tx-transfer-out",
      merchant: "John Walker",
      occurredAt: onDay(0, 9, 30),
      amountCents: -7500,
      currency: "EUR",
      mcc: 6011,
      kind: "transfer_out",
    },
    {
      id: "tx-transfer-in",
      merchant: "Anna Kask",
      occurredAt: onDay(0, 9, 15),
      amountCents: 3200,
      currency: "EUR",
      mcc: 6011,
      kind: "transfer_in",
    },
    {
      id: "tx-auth-hertz",
      merchant: "Hertz",
      occurredAt: onDay(0, 8, 45),
      amountCents: -15000,
      currency: "EUR",
      mcc: 7512,
      kind: "authorization",
    },
    {
      id: "tx-reversal-hertz",
      merchant: "Hertz",
      occurredAt: onDay(0, 8, 50),
      amountCents: -15000,
      currency: "EUR",
      mcc: 7512,
      kind: "reversal",
    },
    {
      id: "tx-failed-no-mcc",
      merchant: "",
      occurredAt: onDay(0, 8, 40),
      amountCents: -2500,
      currency: "EUR",
      mcc: 0,
      kind: "failed",
    },
    {
      id: "tx-failed-groceries",
      merchant: "Maxima",
      occurredAt: onDay(0, 8, 35),
      amountCents: -1890,
      currency: "EUR",
      mcc: 5411,
      kind: "failed",
    },
    {
      id: "tx-unknown-mcc",
      merchant: "Mystery Shop",
      occurredAt: onDay(0, 8, 25),
      amountCents: -999,
      currency: "EUR",
      mcc: 9999,
      kind: "purchase",
    },
    {
      id: "tx-missing-amount",
      merchant: "Pending merchant",
      occurredAt: onDay(0, 8, 15),
      amountCents: null,
      currency: "EUR",
      mcc: 5812,
      kind: "purchase",
    },
    {
      id: "tx-atm-swed",
      merchant: "ATM, Swedbank",
      occurredAt: onDay(0, 8, 5),
      amountCents: -5210,
      currency: "EUR",
      mcc: 6011,
      kind: "atm",
      serviceFeeCents: 210,
    },
    {
      id: "tx-refund-decathlon",
      merchant: "Decathlon",
      occurredAt: onDay(1, 19, 40),
      amountCents: 8999,
      currency: "EUR",
      mcc: 5941,
      kind: "refund",
    },
    {
      id: "tx-shopping-zara",
      merchant: "Zara",
      occurredAt: onDay(2, 15, 0),
      amountCents: -6290,
      currency: "EUR",
      mcc: 5311,
      kind: "purchase",
    },
    {
      id: "tx-bar-noir",
      merchant: "Bar Noir",
      occurredAt: onDay(2, 22, 10),
      amountCents: -2800,
      currency: "EUR",
      mcc: 5813,
      kind: "purchase",
    },
    {
      id: "tx-cinema",
      merchant: "Cinestar",
      occurredAt: onDay(3, 20, 15),
      amountCents: -1500,
      currency: "EUR",
      mcc: 7832,
      kind: "purchase",
    },
    {
      id: "tx-hotel",
      merchant: "Hilton Tallinn",
      occurredAt: onDay(3, 11, 0),
      amountCents: -18900,
      currency: "EUR",
      mcc: 7011,
      kind: "purchase",
    },
    {
      id: "tx-parking",
      merchant: "EuroPark",
      occurredAt: onDay(4, 16, 45),
      amountCents: -450,
      currency: "EUR",
      mcc: 7523,
      kind: "purchase",
    },
    {
      id: "tx-bus",
      merchant: "Tallinna Transport",
      occurredAt: onDay(4, 8, 20),
      amountCents: -200,
      currency: "EUR",
      mcc: 4111,
      kind: "purchase",
    },
    {
      id: "tx-pharmacy",
      merchant: "Apotheka",
      occurredAt: onDay(5, 12, 30),
      amountCents: -1875,
      currency: "EUR",
      mcc: 5912,
      kind: "purchase",
    },
    {
      id: "tx-utilities",
      merchant: "Elektrilevi",
      occurredAt: onDay(5, 10, 0),
      amountCents: -4520,
      currency: "EUR",
      mcc: 4900,
      kind: "purchase",
    },
    {
      id: "tx-auto",
      merchant: "Bosch Car Service",
      occurredAt: onDay(6, 14, 0),
      amountCents: -12500,
      currency: "EUR",
      mcc: 7538,
      kind: "purchase",
    },
    {
      id: "tx-gov",
      merchant: "e-MTA",
      occurredAt: onDay(6, 9, 30),
      amountCents: -3500,
      currency: "EUR",
      mcc: 9311,
      kind: "purchase",
    },
    {
      id: "tx-rental",
      merchant: "Bolt Drive",
      occurredAt: onDay(7, 17, 20),
      amountCents: -3200,
      currency: "EUR",
      mcc: 7512,
      kind: "purchase",
    },
    {
      id: "tx-grocery",
      merchant: "Rimi",
      occurredAt: onDay(7, 12, 5),
      amountCents: -5430,
      currency: "EUR",
      mcc: 5411,
      kind: "purchase",
    },
  )

  return items
}
