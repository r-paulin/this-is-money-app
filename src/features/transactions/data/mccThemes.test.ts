import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { resolveCategoryMark, resolveThemeForTransaction } from "./mccThemes"

describe("resolveCategoryMark", () => {
  it("uses the Bolt circle for a ride payout and the money circle for a transfer out", () => {
    const payout = resolveCategoryMark({ mcc: 0, kind: "ride_payout" })
    assert.equal(payout.kind, "theme")
    if (payout.kind === "theme") assert.equal(payout.theme.id, "bolt")

    const transfer = resolveCategoryMark({ mcc: 6012, kind: "transfer_out" })
    assert.equal(transfer.kind, "theme")
    if (transfer.kind === "theme") assert.equal(transfer.theme.id, "money")
  })

  it("uses the withdrawal circle for ATM, not a full-size arrow", () => {
    const atm = resolveCategoryMark({ mcc: 6011, kind: "atm" })
    assert.equal(atm.kind, "theme")
    if (atm.kind === "theme") {
      assert.equal(atm.theme.id, "withdrawal")
      assert.equal(atm.theme.bgClass, "bg-mcc-money")
    }
  })

  it("maps EV charging MCC 5552 onto the fuel brown circle", () => {
    const ev = resolveThemeForTransaction({ mcc: 5552, kind: "purchase" })
    assert.equal(ev.id, "ev_charging")
    assert.equal(ev.bgClass, "bg-mcc-fuel")
  })

  it("keeps the grocery circle when a payment is declined", () => {
    const declined = resolveCategoryMark({ mcc: 5411, kind: "declined" })
    assert.equal(declined.kind, "theme")
    if (declined.kind === "theme") assert.equal(declined.theme.id, "groceries")
  })

  it("keeps cashback as an override and leaves unknown MCC on other", () => {
    const cashback = resolveCategoryMark({
      mcc: 5411,
      kind: "purchase",
      themeOverride: "cashback",
    })
    assert.equal(cashback.kind, "theme")
    if (cashback.kind === "theme") {
      assert.equal(cashback.theme.id, "cashback")
      assert.equal(cashback.theme.bgClass, "bg-positive-secondary")
    }

    const unknown = resolveCategoryMark({ mcc: 9999, kind: "purchase" })
    assert.equal(unknown.kind, "theme")
    if (unknown.kind === "theme") {
      assert.equal(unknown.theme.bgClass, "bg-mcc-other")
    }
  })
})
