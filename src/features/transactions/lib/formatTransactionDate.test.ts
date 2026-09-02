import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { formatTransactionTimestamp } from "./formatTransactionDate"

describe("formatTransactionTimestamp", () => {
  const sample = new Date(2026, 9, 11, 16, 30, 0, 0).getTime()

  it("formats en-GB with day-first short month and 24h time", () => {
    const formatted = formatTransactionTimestamp(sample, "en-GB")
    assert.match(formatted, /11/)
    assert.match(formatted, /Oct/i)
    assert.match(formatted, /16:30/)
  })

  it("formats en-US with month-first label", () => {
    const formatted = formatTransactionTimestamp(sample, "en-US")
    assert.match(formatted, /Oct/i)
    assert.match(formatted, /11/)
  })
})
