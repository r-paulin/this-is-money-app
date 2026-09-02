import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  formatSignedTransactionAmount,
  formatTransactionListEurFromCents,
} from "./formatTransactionAmount"

describe("formatTransactionListEurFromCents", () => {
  it("formats with euro prefix and dot decimals", () => {
    assert.equal(formatTransactionListEurFromCents(1200), "€12.00")
    assert.equal(formatTransactionListEurFromCents(1845), "€18.45")
  })
})

describe("formatSignedTransactionAmount", () => {
  it("prefixes credits with plus and figma euro style", () => {
    const result = formatSignedTransactionAmount({
      amountCents: 1845,
      kind: "ride_payout",
    })

    assert.equal(result.text, "+€18.45")
    assert.equal(result.tone, "credit")
  })

  it("prefixes debits with minus", () => {
    const result = formatSignedTransactionAmount({
      amountCents: 10_000,
      kind: "purchase",
    })

    assert.equal(result.text, "-€100.00")
    assert.equal(result.tone, "primary")
  })

  it("returns placeholder when amount is missing", () => {
    const result = formatSignedTransactionAmount({
      amountCents: null,
      kind: "purchase",
    })

    assert.equal(result.text, "--")
    assert.equal(result.tone, "missing")
  })

  it("strikethrough tone for reversal without sign", () => {
    const result = formatSignedTransactionAmount({
      amountCents: 15000,
      kind: "reversal",
    })

    assert.equal(result.text, "€150.00")
    assert.equal(result.tone, "declined")
  })
})
