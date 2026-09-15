import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  getTransactionDetailNavKey,
  getTransactionDetailVariant,
  isPayoutTransaction,
  isTransferTransaction,
} from "./transactionDetailRoute"

describe("transactionDetailRoute", () => {
  it("routes kinds to the correct detail variant", () => {
    assert.equal(isTransferTransaction("transfer_out"), true)
    assert.equal(isTransferTransaction("transfer_in"), true)
    assert.equal(isTransferTransaction("purchase"), false)
    assert.equal(isPayoutTransaction("ride_payout"), true)
    assert.equal(isPayoutTransaction("purchase"), false)
    assert.equal(getTransactionDetailVariant("transfer_in"), "transfer")
    assert.equal(getTransactionDetailVariant("ride_payout"), "payout")
    assert.equal(getTransactionDetailVariant("purchase"), "card_payment")
  })

  it("builds stable nav keys", () => {
    assert.equal(
      getTransactionDetailNavKey("tx-1", "transfer"),
      "transfer-detail:tx-1",
    )
    assert.equal(
      getTransactionDetailNavKey("tx-2", "payout"),
      "payout-detail:tx-2",
    )
    assert.equal(
      getTransactionDetailNavKey("tx-3", "card_payment"),
      "card_payment-detail:tx-3",
    )
  })
})
