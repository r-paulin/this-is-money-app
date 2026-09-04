import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  mapAirwallexFailureCodeToKind,
  mapTransferFailureToUi,
} from "./transferResultMapping"

describe("transferResultMapping", () => {
  it("maps 901XX–904XX codes to invalid recipient", () => {
    assert.equal(mapAirwallexFailureCodeToKind("90101"), "invalid_recipient")
    assert.equal(mapAirwallexFailureCodeToKind("90499"), "invalid_recipient")
  })

  it("maps insufficient balance code", () => {
    assert.equal(
      mapAirwallexFailureCodeToKind("INSUFFICIENT_BALANCE"),
      "insufficient",
    )
  })

  it("maps other codes to retryable", () => {
    assert.equal(mapAirwallexFailureCodeToKind("90500"), "retryable")
  })

  it("returns UI copy for each failure kind", () => {
    assert.equal(
      mapTransferFailureToUi("invalid_recipient").heading,
      "Check recipient details",
    )
    assert.equal(
      mapTransferFailureToUi("insufficient").primaryLabel,
      "Change amount",
    )
    assert.equal(
      mapTransferFailureToUi("retryable").primaryLabel,
      "Try again",
    )
    assert.equal(mapTransferFailureToUi("retryable").secondaryLabel, undefined)
  })
})
