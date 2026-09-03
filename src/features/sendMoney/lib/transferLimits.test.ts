import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  MOCK_DAILY_LIMIT_CENTS,
  MOCK_PER_TRANSACTION_LIMIT_CENTS,
  validateTransferAmountOnSubmit,
} from "./transferLimits"

describe("transferLimits", () => {
  it("returns zero error for empty amount", () => {
    const error = validateTransferAmountOnSubmit(0, 6000)
    assert.equal(error?.kind, "zero")
    assert.equal(error?.message, "Enter an amount greater than 0")
  })

  it("returns negative error", () => {
    const error = validateTransferAmountOnSubmit(-100, 6000)
    assert.equal(error?.kind, "negative")
    assert.equal(
      error?.message,
      "Amounts can't be negative — enter a positive number",
    )
  })

  it("returns per-transaction limit error", () => {
    const error = validateTransferAmountOnSubmit(
      MOCK_PER_TRANSACTION_LIMIT_CENTS + 1,
      MOCK_PER_TRANSACTION_LIMIT_CENTS,
    )
    assert.equal(error?.kind, "per_transaction")
    assert.match(error?.message ?? "", /maximum single transfer/)
  })

  it("returns daily limit error", () => {
    const error = validateTransferAmountOnSubmit(
      MOCK_DAILY_LIMIT_CENTS + 1,
      MOCK_DAILY_LIMIT_CENTS,
    )
    assert.equal(error?.kind, "daily")
    assert.match(error?.message ?? "", /daily limit/)
    assert.match(error?.message ?? "", /remaining today/)
  })

  it("returns insufficient error when over spendable", () => {
    const error = validateTransferAmountOnSubmit(7000, 6000)
    assert.equal(error?.kind, "insufficient")
    assert.equal(error?.message, "Not enough available balance")
  })

  it("passes valid amount", () => {
    const error = validateTransferAmountOnSubmit(1200, 6000)
    assert.equal(error, undefined)
  })
})
