import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { formatTransactionTimestamp } from "./formatTransactionDate"

describe("formatTransactionTimestamp", () => {
  const sample = new Date(2026, 9, 11, 16, 30, 0, 0).getTime()

  it("formats a today row as a clock time without the calendar date", () => {
    const formatted = formatTransactionTimestamp(sample, "en-GB")
    assert.match(formatted, /16:30/)
    assert.doesNotMatch(formatted, /Oct/i)
    assert.doesNotMatch(formatted, /11/)
  })
})
