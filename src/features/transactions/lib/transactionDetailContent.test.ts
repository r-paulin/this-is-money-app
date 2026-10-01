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
    assert.equal(pending.variant, "card_payment")
    if (pending.variant === "card_payment") {
      assert.equal(pending.status, "Pending")
      assert.match(pending.statusSubtext ?? "", /placed a hold/)
    }

    const declined = buildTransactionDetailView({
      ...base,
      kind: "declined",
      declineReason: "insufficient_funds",
    })
    assert.equal(declined.variant, "card_payment")
    if (declined.variant === "card_payment") {
      assert.equal(declined.status, "Declined")
      assert.notEqual(declined.status, "Completed")
      assert.match(declined.statusSubtext ?? "", /not enough balance/)
    }

    const unknownDecline = buildTransactionDetailView({ ...base, kind: "declined" })
    if (unknownDecline.variant === "card_payment") {
      assert.equal(unknownDecline.status, "Declined")
      assert.equal(unknownDecline.statusSubtext, undefined)
    }

    const reversal = buildTransactionDetailView({ ...base, kind: "reversal" })
    if (reversal.variant === "card_payment") {
      assert.equal(reversal.status, "Hold released")
      assert.match(reversal.statusSubtext ?? "", /no money was taken/i)
    }

    const missingLocation = buildTransactionDetailView({ ...base, kind: "purchase" })
    if (missingLocation.variant === "card_payment") {
      assert.equal(missingLocation.merchantLocation, "Location unavailable")
      assert.equal(JSON.stringify(missingLocation).includes("Lyon"), false)
    }

    const online = buildTransactionDetailView({
      ...base,
      kind: "purchase",
      locationOmitted: true,
      merchantDescriptor: "ESSO*1234",
    })
    if (online.variant === "card_payment") {
      assert.equal(online.merchantLocation, undefined)
      assert.match(online.merchantDescriptor ?? "", /ESSO/)
    }

    const unnamed = buildTransactionDetailView({ ...base, merchant: "  ", kind: "purchase" })
    if (unnamed.variant === "card_payment") {
      assert.equal(unnamed.merchantName, "Unknown merchant")
    }

    const transfer = buildTransactionDetailView({ ...base, kind: "transfer_out" })
    assert.equal(transfer.variant, "transfer")
    assert.match(transfer.subtext, /Completed/)

    const payout = buildTransactionDetailView({ ...base, kind: "ride_payout" })
    assert.equal(payout.variant, "payout")
    assert.equal(payout.subtext, "Ride payout")
  })
})
