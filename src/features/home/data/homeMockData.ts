import { buildMockTransactions } from "@/features/transactions/data/mockTransactions"
import type { HomeBannerId, HomeCardRow, HomeNotification } from "../home.types"

export const HOME_FETCH_STUB_MS = 800
export const HOME_FETCH_TIMEOUT_MS = 10_000

/** Default demo: Home (Full) / Active */
export const MOCK_BALANCE_CENTS = 10_000

export const MOCK_BANNER_IDS: HomeBannerId[] = ["GoogleWallet", "PayWithPhone"]

export const MOCK_NOTIFICATION: HomeNotification | null = null

export function buildMockHomeCards(now = Date.now()): HomeCardRow[] {
  return [
    {
      kind: "virtual",
      color: "green",
      lastFour: "4231",
      expiry: "10/28",
    },
    {
      kind: "physical",
      color: "black",
      lastFour: "8820",
      expiry: "03/29",
      deliveryPhase: "in_delivery",
      deliveryMinEta: now + 5 * 86_400_000,
      deliveryMaxEta: now + 12 * 86_400_000,
    },
  ]
}

export function buildMockHomeCardsWithOffer(): HomeCardRow[] {
  return [
    {
      kind: "virtual",
      color: "green",
      lastFour: "4231",
      expiry: "10/28",
    },
    {
      kind: "offer",
      color: "green",
    },
  ]
}

export function getMockTransactionCount(): number {
  return buildMockTransactions().length
}
