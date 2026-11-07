import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  formatHomeBalanceEurFromCents,
  formatSignedTransactionAmount,
  formatTransactionListEurFromCents,
} from "./formatTransactionAmount"

describe("formatHomeBalanceEurFromCents", () => {
  it("formats with euro prefix, thin space, and dot decimals", () => {
    assert.equal(formatHomeBalanceEurFromCents(10_000), "€\u202F100.00")
    assert.equal(formatHomeBalanceEurFromCents(1845), "€\u202F18.45")
  })
})

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

  it("does not double-prefix debits when cents are stored negative", () => {
    const result = formatSignedTransactionAmount({
      amountCents: -10_000,
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

  it("treats cashback as a credit and a fee as a debit", () => {
    assert.equal(
      formatSignedTransactionAmount({ amountCents: 250, kind: "cashback" }).text,
      "+€2.50",
    )
    assert.equal(
      formatSignedTransactionAmount({ amountCents: 100, kind: "fee" }).tone,
      "primary",
    )
    assert.equal(
      formatSignedTransactionAmount({ amountCents: 100, kind: "fee" }).text,
      "-€1.00",
    )
  })

  it("strikethrough tone for reversal without sign", () => {
    const result = formatSignedTransactionAmount({
      amountCents: 15000,
      kind: "reversal",
    })

    assert.equal(result.text, "€150.00")
    assert.equal(result.tone, "declined")
  })

  it("mutes a pending refund while keeping the plus", () => {
    const result = formatSignedTransactionAmount({
      amountCents: 5000,
      kind: "refund",
      listStatus: "refund_pending",
    })

    assert.equal(result.text, "+€50.00")
    assert.equal(result.tone, "muted")
  })

  it("unsigned tertiary amount for returned holds", () => {
    const result = formatSignedTransactionAmount({
      amountCents: 10000,
      kind: "reversal",
      listStatus: "returned",
    })

    assert.equal(result.text, "€100.00")
    assert.equal(result.tone, "declined")
  })
})
