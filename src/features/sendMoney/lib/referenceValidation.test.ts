import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  isValidReference,
  sanitizeReferenceInput,
} from "./referenceValidation"

describe("referenceValidation", () => {
  it("allows SEPA characters and trims length", () => {
    const value = sanitizeReferenceInput("Invoice 12/2024")
    assert.equal(value, "Invoice 12/2024")
    assert.equal(isValidReference(value), true)
  })

  it("strips rejected characters", () => {
    const value = sanitizeReferenceInput("Pay@ment #1")
    assert.equal(value, "Payment 1")
  })

  it("caps at 140 characters", () => {
    const value = sanitizeReferenceInput("a".repeat(200))
    assert.equal(value.length, 140)
  })
})
