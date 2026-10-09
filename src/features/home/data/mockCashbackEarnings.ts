export interface CashbackEarning {
  id: string
  /** Unix ms */
  occurredAt: number
  /** Minor units (cents), always a credit. */
  amountCents: number
  merchant: string
}

/** Figma Cashback / Earned `9588:212216` sample feed + total. */
export const CASHBACK_TOTAL_CENTS = 3420

export function buildMockCashbackEarnings(now = new Date()): CashbackEarning[] {
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()

  const at = (daysAgo: number, hour: number, minute: number) =>
    new Date(y, m, d - daysAgo, hour, minute, 0, 0).getTime()

  return [
    {
      id: "cb-today-totalenergies",
      occurredAt: at(0, 11, 35),
      amountCents: 50,
      merchant: "TotalEnergies",
    },
    {
      id: "cb-today-esso",
      occurredAt: at(0, 11, 35),
      amountCents: 50,
      merchant: "Esso",
    },
    {
      id: "cb-sep-totalenergies-1",
      occurredAt: at(5, 11, 35),
      amountCents: 50,
      merchant: "TotalEnergies",
    },
    {
      id: "cb-sep-totalenergies-2",
      occurredAt: at(5, 11, 35),
      amountCents: 50,
      merchant: "TotalEnergies",
    },
  ]
}
