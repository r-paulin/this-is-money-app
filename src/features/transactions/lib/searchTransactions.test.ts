import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { Transaction } from "../data/mockTransactions"
import { applyActivitySearch, searchTransactions } from "./searchTransactions"

const SAMPLE: Transaction[] = [
  {
    id: "1",
    merchant: "Léon de Bruxelles",
    occurredAt: 0,
    amountCents: -1000,
    currency: "EUR",
    mcc: 5812,
    kind: "purchase",
  },
  {
    id: "2",
    merchant: "Esso",
    occurredAt: 0,
    amountCents: 10000,
    currency: "EUR",
    mcc: 5541,
    kind: "purchase",
    reference: "Fuel stop",
    transferId: "P260820-ESSO",
  },
  {
    id: "3",
    merchant: "Élodie Moreau",
    occurredAt: 0,
    amountCents: -5000,
    currency: "EUR",
    mcc: 6011,
    kind: "declined",
  },
  {
    id: "4",
    merchant: "Ride payout",
    occurredAt: 0,
    amountCents: 2500,
    currency: "EUR",
    mcc: 0,
    kind: "ride_payout",
  },
]

describe("searchTransactions", () => {
  it("returns all transactions when query is empty", () => {
    assert.equal(searchTransactions(SAMPLE, "").length, 4)
    assert.equal(searchTransactions(SAMPLE, "   ").length, 4)
  })

  it("matches a word at its start, including without diacritics", () => {
    assert.deepEqual(
      searchTransactions(SAMPLE, "elodie").map((tx) => tx.id),
      ["3"],
    )
    assert.deepEqual(
      searchTransactions(SAMPLE, "Moreau").map((tx) => tx.id),
      ["3"],
    )
    assert.deepEqual(
      searchTransactions(SAMPLE, "oreau").map((tx) => tx.id),
      [],
    )
  })

  it("matches 100.00 regardless of the displayed sign", () => {
    assert.deepEqual(
      searchTransactions(SAMPLE, "100.00").map((tx) => tx.id),
      ["2"],
    )
    assert.deepEqual(
      searchTransactions(SAMPLE, "€100").map((tx) => tx.id),
      ["2"],
    )
  })

  it("keeps declined rows and matches reference, type, and transfer id", () => {
    assert.deepEqual(
      searchTransactions(SAMPLE, "Elodie").map((tx) => tx.id),
      ["3"],
    )
    assert.ok(searchTransactions(SAMPLE, "fuel").some((tx) => tx.id === "2"))
    assert.ok(searchTransactions(SAMPLE, "Ride payout").some((tx) => tx.id === "4"))
    assert.deepEqual(
      searchTransactions(SAMPLE, "P260820-ESSO").map((tx) => tx.id),
      ["2"],
    )
  })

  it("matches fallback titles when merchant is empty", () => {
    const transactions: Transaction[] = [
      {
        id: "5",
        merchant: "",
        occurredAt: 0,
        amountCents: -3000,
        currency: "EUR",
        mcc: 6011,
        kind: "declined",
      },
    ]

    assert.deepEqual(
      searchTransactions(transactions, "card payment").map((tx) => tx.id),
      ["5"],
    )
  })
})

describe("applyActivitySearch", () => {
  it("does not apply a one- or two-character query", () => {
    const one = applyActivitySearch(SAMPLE, "e")
    assert.equal(one.status, "idle")
    assert.equal(one.items.length, SAMPLE.length)

    const two = applyActivitySearch(SAMPLE, "el")
    assert.equal(two.status, "idle")
    assert.equal(two.items.length, SAMPLE.length)
  })

  it("returns results and empty for queries of three or more characters", () => {
    const hit = applyActivitySearch(SAMPLE, "elo")
    assert.equal(hit.status, "results")
    assert.deepEqual(
      hit.items.map((tx) => tx.id),
      ["3"],
    )

    const miss = applyActivitySearch(SAMPLE, "zzz")
    assert.equal(miss.status, "empty")
    assert.deepEqual(miss.items, [])
  })

  it("returns the error branch when the filter throws", () => {
    const result = applyActivitySearch(SAMPLE, "esso", () => {
      throw new Error("search failed")
    })
    assert.equal(result.status, "error")
    assert.deepEqual(result.items, [])
  })
})
