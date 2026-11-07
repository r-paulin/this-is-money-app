import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  formatTransactionSectionLabel,
  formatTransactionTimestamp,
} from "./formatTransactionDate"

describe("formatTransactionSectionLabel", () => {
  const now = new Date(2026, 10, 6, 12, 0, 0)

  it("uses Today for the current local day", () => {
    assert.equal(formatTransactionSectionLabel(now.getTime(), now), "Today")
  })

  it("uses weekday and short date without the year", () => {
    const earlier = new Date(2026, 10, 2, 17, 30, 0).getTime()
    assert.equal(formatTransactionSectionLabel(earlier, now), "Mon, 2 Nov")
  })
})

describe("formatTransactionTimestamp", () => {
  const sample = new Date(2026, 9, 11, 16, 30, 0, 0).getTime()

  it("formats a today row as a clock time without the calendar date", () => {
    const formatted = formatTransactionTimestamp(sample, "en-GB")
    assert.match(formatted, /16:30/)
    assert.doesNotMatch(formatted, /Oct/i)
    assert.doesNotMatch(formatted, /11/)
  })
})
