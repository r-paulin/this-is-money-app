import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  buildTransactionDetailView,
  holdReturnDays,
} from "./transactionDetailContent"

describe("transactionDetailContent", () => {
  const base = {
    id: "tx-1",
    merchant: "Esso",
    occurredAt: new Date(2026, 8, 12, 15, 0).getTime(),
    amountCents: 5000,
    currency: "EUR" as const,
    mcc: 5541,
  }

  it("builds completed card with Paid with, Transaction ID, Dispute footer, and Status · date", () => {
    const card = buildTransactionDetailView({ ...base, kind: "purchase" })
    assert.equal(card.variant, "card_payment")
    if (card.variant !== "card_payment") return
    assert.equal(card.summaryStatus, "Completed")
    assert.match(card.subtext, /^Completed · /)
    assert.match(card.paidWith, /Virtual card/)
    assert.ok(card.transactionId.length > 0)
    assert.equal(card.notice, undefined)
    assert.deepEqual(card.footer.actions, ["dispute"])
  })

  it("builds pending card with reserved notice and Get help footer", () => {
    const pending = buildTransactionDetailView({
      ...base,
      kind: "authorization",
      listStatus: "pending",
      paymentStatus: "pending",
      cashback: { state: "pending", percent: 1 },
    })
    assert.equal(pending.variant, "card_payment")
    if (pending.variant !== "card_payment") return
    assert.equal(pending.summaryStatus, "Pending")
    assert.equal(pending.notice?.tone, "warning")
    assert.match(pending.notice?.title ?? "", /pending/i)
    assert.match(pending.notice?.body ?? "", /reserved/i)
    assert.deepEqual(pending.footer.actions, ["get_help"])
    assert.equal(pending.cashback?.state, "pending")
  })

  it("builds declined card with danger notice and no Completed status", () => {
    const declined = buildTransactionDetailView({
      ...base,
      kind: "declined",
      listStatus: "declined",
      declineReason: "insufficient_funds",
      cardType: "physical",
      cardLastFour: "8872",
    })
    assert.equal(declined.variant, "card_payment")
    if (declined.variant !== "card_payment") return
    assert.equal(declined.summaryStatus, "Declined")
    assert.notEqual(declined.summaryStatus, "Completed")
    assert.equal(declined.notice?.tone, "danger")
    assert.match(declined.notice?.body ?? "", /not enough balance/)
    assert.match(declined.paidWith, /Physical card/)
    assert.equal(declined.amountStrike, true)
  })

  it("maps refund pending from listStatus instead of Refunded", () => {
    const pending = buildTransactionDetailView({
      ...base,
      kind: "refund",
      listStatus: "refund_pending",
      relatedTransactionId: "P26091-X",
    })
    if (pending.variant !== "card_payment") return
    assert.equal(pending.summaryStatus, "Pending")
    assert.equal(pending.notice?.title, "Refund pending")
    assert.equal(pending.relatedPayment?.secondary, "P26091-X")
    assert.equal(pending.amountTone, "muted")
  })

  it("maps returned holds to Credited with struck amount", () => {
    const returned = buildTransactionDetailView({
      ...base,
      kind: "reversal",
      listStatus: "returned",
      returnKind: "expired",
    })
    if (returned.variant !== "card_payment") return
    assert.equal(returned.summaryStatus, "Credited")
    assert.equal(returned.amountStrike, true)
    assert.match(returned.notice?.body ?? "", /didn’t charge|didn't charge/i)
  })

  it("builds cashback credit with Cashback details and Related payment", () => {
    const cashback = buildTransactionDetailView({
      ...base,
      merchant: "Cashback",
      kind: "cashback",
      amountCents: 50,
      mcc: 0,
      linkedMerchant: "Neste",
      relatedTransactionId: "P26091-COMPLT",
      relatedPaymentAmountCents: 5000,
      relatedPaymentOccurredAt: base.occurredAt - 10 * 60_000,
      relatedPaymentMcc: 5541,
      cashbackChargedCents: 5000,
      cashbackRatePercent: 1,
    })
    assert.equal(cashback.variant, "card_payment")
    if (cashback.variant !== "card_payment") return
    assert.equal(cashback.cashbackCredit, true)
    assert.equal(cashback.detailsTitle, "Cashback details")
    assert.deepEqual(
      cashback.amountRows?.map((row) => row.label),
      ["Charged", "Cashback rate", "Cashback received"],
    )
    assert.equal(cashback.relatedPayment?.merchant, "Neste")
    assert.equal(cashback.relatedPayment?.amountText, "-€50.00")
    assert.equal(cashback.relatedPayment?.mcc, 5541)
    assert.equal(cashback.relatedPayment?.targetId, "P26091-COMPLT")
    assert.deepEqual(cashback.footer.actions, ["get_help"])
  })

  it("builds foreign currency and fee detail sections", () => {
    const fx = buildTransactionDetailView({
      ...base,
      kind: "purchase",
      secondaryAmountText: "-550.00 kr",
      exchangeRateText: "1 EUR = 11.00 SEK",
    })
    if (fx.variant !== "card_payment") return
    assert.match(fx.currency?.paidText ?? "", /550/)
    assert.match(fx.currency?.rateText ?? "", /11\.00/)

    const fee = buildTransactionDetailView({
      ...base,
      merchant: "Currency conversion fee",
      kind: "fee",
      amountCents: 50,
      linkedMerchant: "Espresso House",
      feePurpose: "Currency conversion",
      feeCalculation: "1% of the converted amount",
    })
    if (fee.variant !== "card_payment") return
    assert.equal(fee.feeMeta?.purpose, "Currency conversion")
    assert.equal(fee.relatedPayment?.merchant, "Espresso House")
    assert.deepEqual(fee.footer.actions, ["get_help"])
  })

  it("builds dispute open detail with dispute section", () => {
    const dispute = buildTransactionDetailView({
      ...base,
      kind: "purchase",
      dispute: {
        state: "open",
        openedAt: base.occurredAt,
        reference: "DSP-1",
        maxDays: 100,
      },
    })
    if (dispute.variant !== "card_payment") return
    assert.equal(dispute.summaryStatus, "Dispute open")
    assert.equal(dispute.dispute?.reference, "DSP-1")
    assert.match(dispute.notice?.body ?? "", /100 days/)
    assert.deepEqual(dispute.footer.actions, ["get_help"])
  })

  it("builds transfer phases with matching banners and footers", () => {
    const completed = buildTransactionDetailView({ ...base, kind: "transfer_out" })
    assert.equal(completed.variant, "transfer")
    if (completed.variant === "transfer") {
      assert.equal(completed.transferPhase, "completed")
      assert.equal(completed.showSendAgain, true)
      assert.deepEqual(completed.footer.actions, ["download_receipt", "get_help"])
      assert.equal(completed.notice, undefined)
    }

    const processing = buildTransactionDetailView({
      ...base,
      kind: "transfer_out",
      status: "on_the_way",
      transferPhase: "processing",
    })
    if (processing.variant === "transfer") {
      assert.equal(processing.transferPhase, "processing")
      assert.equal(processing.notice?.title, "Processing")
      assert.deepEqual(processing.footer.actions, ["get_help"])
      assert.equal(processing.showSendAgain, true)
    }

    const delayed = buildTransactionDetailView({
      ...base,
      kind: "transfer_out",
      status: "overdue",
      transferPhase: "delayed",
    })
    if (delayed.variant === "transfer") {
      assert.equal(delayed.transferPhase, "delayed")
      assert.match(delayed.notice?.title ?? "", /taking longer/i)
    }

    const returned = buildTransactionDetailView({
      ...base,
      kind: "transfer_out",
      transferPhase: "returned",
      returnReason: "Bad IBAN",
      transferSentSection: {
        title: "You sent",
        rows: [{ label: "Total", value: "€50.00", accent: true }],
      },
      transferReturnedSection: {
        title: "Returned to you",
        rows: [{ label: "Credited", value: "€49.00", accent: true }],
      },
    })
    if (returned.variant === "transfer") {
      assert.equal(returned.transferPhase, "returned")
      assert.equal(returned.notice?.tone, "danger")
      assert.equal(returned.sentSection?.title, "You sent")
      assert.equal(returned.returnedSection?.title, "Returned to you")
      assert.equal(returned.showSendAgain, false)
    }
  })

  it("keeps merchant recognition rules", () => {
    const missingLocation = buildTransactionDetailView({ ...base, kind: "purchase" })
    if (missingLocation.variant === "card_payment") {
      assert.equal(missingLocation.merchantLocation, "Location unavailable")
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
  })

  it("uses hold return day rules", () => {
    assert.equal(holdReturnDays({ ...base, kind: "purchase", holdCategory: "in_person" }), 5)
    assert.equal(holdReturnDays({ ...base, kind: "purchase", holdCategory: "online" }), 10)
    assert.equal(holdReturnDays({ ...base, kind: "purchase", mcc: 7512 }), 30)
  })

  it("builds payout with Completed · date subtext", () => {
    const payout = buildTransactionDetailView({ ...base, kind: "ride_payout" })
    assert.equal(payout.variant, "payout")
    assert.match(payout.subtext, /^Completed · /)
    assert.deepEqual(payout.footer.actions, ["get_help"])
  })
})
