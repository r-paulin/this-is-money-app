import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { formatListSecondary, listStatusFromKind, listStatusLabel } from "./listStatus"

describe("listStatus", () => {
  it("formats reserved and linked-merchant secondary lines", () => {
    assert.equal(
      formatListSecondary({
        timestamp: "11:20",
        kind: "purchase",
        reservedAmountCents: 10000,
      }),
      "11:20 · Reserved €100.00",
    )
    assert.equal(
      formatListSecondary({
        timestamp: "09:30",
        kind: "fee",
        linkedMerchant: "Neste",
      }),
      "09:30 · Neste",
    )
  })

  it("falls back from kind when listStatus is omitted", () => {
    assert.equal(listStatusFromKind("declined"), "declined")
    assert.equal(listStatusLabel("partially_charged"), "Partially charged")
    assert.equal(
      formatListSecondary({
        timestamp: "11:40",
        kind: "authorization",
        listStatus: "pending",
      }),
      "11:40 · Pending",
    )
  })
})
