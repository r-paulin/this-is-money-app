import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { Transaction } from "../data/mockTransactions"
import { searchTransactions } from "./searchTransactions"

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
    amountCents: -2000,
    currency: "EUR",
    mcc: 5541,
    kind: "purchase",
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
]

describe("searchTransactions", () => {
  it("returns all transactions when query is empty", () => {
    assert.equal(searchTransactions(SAMPLE, "").length, 3)
    assert.equal(searchTransactions(SAMPLE, "   ").length, 3)
  })

  it("matches merchant names case-insensitively", () => {
    assert.deepEqual(
      searchTransactions(SAMPLE, "esso").map((tx) => tx.id),
      ["2"],
    )
  })

  it("matches without diacritics when query has none", () => {
    assert.deepEqual(
      searchTransactions(SAMPLE, "leon").map((tx) => tx.id),
      ["1"],
    )
    assert.deepEqual(
      searchTransactions(SAMPLE, "elodie").map((tx) => tx.id),
      ["3"],
    )
  })

  it("matches partial merchant substrings", () => {
    assert.deepEqual(
      searchTransactions(SAMPLE, "Moreau").map((tx) => tx.id),
      ["3"],
    )
    assert.deepEqual(
      searchTransactions(SAMPLE, "oreau").map((tx) => tx.id),
      ["3"],
    )
  })

  it("matches fallback titles when merchant is empty", () => {
    const transactions: Transaction[] = [
      {
        id: "4",
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
      ["4"],
    )
  })
})
