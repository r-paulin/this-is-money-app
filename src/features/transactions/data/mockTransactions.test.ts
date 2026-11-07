import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { TransactionListStatus } from "../lib/listStatus"
import { MOCK_HISTORY_DAYS, buildMockTransactions } from "./mockTransactions"

const REQUIRED_STATUSES: readonly TransactionListStatus[] = [
  "pending",
  "partially_returned",
  "partially_charged",
  "charged_later",
  "returned",
  "declined",
  "refund_pending",
  "refund",
  "partially_refunded",
]

describe("buildMockTransactions", () => {
  const now = new Date(2026, 10, 6, 12, 0, 0)

  it("keeps ride payouts at about 60% of the feed", () => {
    const items = buildMockTransactions(now)
    const payouts = items.filter((tx) => tx.kind === "ride_payout").length
    const share = payouts / items.length
    assert.ok(share >= 0.58 && share <= 0.62, `expected ~60% payouts, got ${(share * 100).toFixed(1)}%`)
  })

  it("includes Activity list statuses and excludes disputes", () => {
    const items = buildMockTransactions(now)
    const present = new Set(
      items.map((tx) => tx.listStatus).filter((status): status is TransactionListStatus => status != null),
    )
    for (const status of REQUIRED_STATUSES) {
      assert.ok(present.has(status), `missing listStatus ${status}`)
    }
    for (const status of present) {
      assert.ok(!status.startsWith("dispute") && status !== "under_review", `unexpected ${status}`)
    }
  })

  it("stays inside the last 7 days relative to now", () => {
    const items = buildMockTransactions(now)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (MOCK_HISTORY_DAYS - 1)).getTime()
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    ).getTime()
    assert.ok(items.length > 0)
    for (const tx of items) {
      assert.ok(tx.occurredAt >= start, `${tx.id} is before the 7-day window`)
      assert.ok(tx.occurredAt <= end, `${tx.id} is after today`)
    }
  })

  it("spreads Neste and Virši fuel across multiple days", () => {
    const items = buildMockTransactions(now)
    const fuelDays = new Set(
      items
        .filter((tx) => tx.merchant === "Neste" || tx.merchant === "Virši")
        .map((tx) => {
          const date = new Date(tx.occurredAt)
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        }),
    )
    assert.ok(fuelDays.size >= 4, `expected fuel on 4+ days, got ${fuelDays.size}`)
  })

  it("uses Latvian merchants for fuel, shopping, transfers, and utilities", () => {
    const items = buildMockTransactions(now)
    const names = new Set(items.map((tx) => tx.merchant))
    assert.ok(names.has("Neste"))
    assert.ok(names.has("Virši"))
    assert.ok(names.has("Lidl"))
    assert.ok(names.has("RIMI"))
    assert.ok(names.has("Edgars Kokins"))
    assert.ok(names.has("Joonas Mengel"))
    assert.ok(names.has("LMT"))
  })
})
