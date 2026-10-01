import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { Transaction } from "../data/mockTransactions"
import {
  isCustomRangeLongerThanOneYear,
  prepareStatement,
  statementRangeLimitMessage,
} from "./statementPlan"

const ROW: Transaction = {
  id: "1",
  merchant: "Esso",
  occurredAt: new Date(2026, 8, 12).getTime(),
  amountCents: 5000,
  currency: "EUR",
  mcc: 5541,
  kind: "purchase",
}

describe("statementPlan", () => {
  it("blocks a custom range longer than one year and keeps the limit message", () => {
    assert.equal(
      isCustomRangeLongerThanOneYear(new Date(2024, 0, 1), new Date(2025, 0, 2)),
      true,
    )
    assert.equal(
      isCustomRangeLongerThanOneYear(new Date(2024, 0, 1), new Date(2025, 0, 1)),
      false,
    )
    assert.match(statementRangeLimitMessage(), /one year/i)
  })

  it("treats an empty period as success and a thrown generation as a distinct failure", () => {
    assert.equal(
      prepareStatement({
        start: new Date(2020, 0, 1),
        end: new Date(2020, 0, 31),
        transactions: [ROW],
      }),
      "empty",
    )
    assert.equal(
      prepareStatement({
        start: new Date(2026, 8, 1),
        end: new Date(2026, 8, 30),
        transactions: [ROW],
      }),
      "ready",
    )
    assert.throws(
      () =>
        prepareStatement({
          start: new Date(2026, 8, 1),
          end: new Date(2026, 8, 30),
          transactions: [ROW],
          fail: true,
        }),
      /generation failed/i,
    )
  })
})
