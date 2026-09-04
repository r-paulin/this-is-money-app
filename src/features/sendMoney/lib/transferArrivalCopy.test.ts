import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getTransferArrivalCopy, resolveTransferArrivalRail } from "./transferArrivalCopy"

describe("transferArrivalCopy", () => {
  it("resolves SEPA instant for Latvian IBAN", () => {
    assert.equal(
      resolveTransferArrivalRail("LV80HABA0551234567857"),
      "SEPA_INSTANT",
    )
    assert.equal(
      getTransferArrivalCopy("SEPA_INSTANT"),
      "It should arrive within minutes",
    )
  })

  it("returns copy for each rail", () => {
    assert.equal(
      getTransferArrivalCopy("SEPA"),
      "It should arrive within 2 business days",
    )
    assert.equal(
      getTransferArrivalCopy("SEPA_INSTANT_FALLBACK"),
      "It should arrive within 2 business days",
    )
    assert.equal(
      getTransferArrivalCopy("CANADA_EFT"),
      "It should arrive within 1–2 business days",
    )
    assert.equal(
      getTransferArrivalCopy("SWIFT"),
      "It should arrive within 3 business days",
    )
  })
})
