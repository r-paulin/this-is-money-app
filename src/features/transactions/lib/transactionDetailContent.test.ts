import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildTransactionDetailView } from "./transactionDetailContent"

describe("transactionDetailContent", () => {
  const base = {
    id: "tx-1",
    merchant: "Esso",
    occurredAt: new Date(2026, 8, 12, 15, 0).getTime(),
    amountCents: 5000,
    currency: "EUR" as const,
    mcc: 5541,
  }

  it("builds card payment, transfer, and payout views", () => {
    const card = buildTransactionDetailView({ ...base, kind: "purchase" })
    assert.equal(card.variant, "card_payment")
    assert.equal(card.status, "Completed")
    assert.equal(card.statusSubtext, undefined)

    const pending = buildTransactionDetailView({
      ...base,
      kind: "purchase",
      paymentStatus: "pending",
    })
    assert.equal(pending.status, "Pending")
    assert.match(pending.statusSubtext ?? "", /automatically reversed/)

    const transfer = buildTransactionDetailView({ ...base, kind: "transfer_out" })
    assert.equal(transfer.variant, "transfer")
    assert.match(transfer.subtext, /Completed/)

    const payout = buildTransactionDetailView({ ...base, kind: "ride_payout" })
    assert.equal(payout.variant, "payout")
    assert.equal(payout.subtext, "Ride payout")
  })
})
