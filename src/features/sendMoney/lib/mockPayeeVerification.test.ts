import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { Recipient } from "../sendMoney.types"
import {
  maskAccountName,
  resolveMockPayeeVerification,
} from "./mockPayeeVerification"

function makeRecipient(overrides: Partial<Recipient> = {}): Recipient {
  return {
    id: "janis-ozols",
    rawName: "Jānis Ozols",
    iban: "LV80HABA0551234567857",
    lastAmountCents: 0,
    lastTransferredAt: Date.now(),
    transferCount90d: 0,
    transferCount365d: 0,
    averageAmountCents: 0,
    isLinkedBankAccount: false,
    isTrusted: false,
    ...overrides,
  }
}

describe("mockPayeeVerification", () => {
  it("maps known recipients to demo CoP states", () => {
    assert.equal(
      resolveMockPayeeVerification(makeRecipient({ id: "kristaps-kalnins" }))
        .status,
      "PARTIAL_MATCH",
    )
    assert.equal(
      resolveMockPayeeVerification(makeRecipient({ id: "liga-vitola" })).status,
      "NOT_MATCHED",
    )
    assert.equal(
      resolveMockPayeeVerification(makeRecipient({ id: "sia-lmt" })).status,
      "UNAVAILABLE",
    )
  })

  it("resolves linked bank accounts to Revolut with FULL_MATCH", () => {
    const verification = resolveMockPayeeVerification(
      makeRecipient({ id: "linked-account", isLinkedBankAccount: true }),
    )
    assert.equal(verification.status, "FULL_MATCH")
    assert.equal(verification.resolvedBankName, "Revolut Bank UAB")
  })

  it("defaults to FULL_MATCH with resolved bank name", () => {
    const verification = resolveMockPayeeVerification(
      makeRecipient({ iban: "FR1420041010050500013M02606" }),
    )
    assert.equal(verification.status, "FULL_MATCH")
    assert.equal(verification.resolvedBankName, "BNP Paribas")
  })

  it("masks account names for partial match", () => {
    assert.equal(maskAccountName("Élodie Moreau"), "É*** M***")
  })
})
