import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  formatReviewFeeLabel,
  formatReviewReference,
  formatReviewTotalCents,
} from "./formatTransferReview"

describe("formatTransferReview", () => {
  it("formats reference fallback", () => {
    assert.equal(formatReviewReference(undefined), "None")
    assert.equal(formatReviewReference("  "), "None")
    assert.equal(formatReviewReference("For the lunch"), "For the lunch")
  })

  it("formats fee and total", () => {
    assert.equal(formatReviewFeeLabel(0), "0,00\u00a0€")
    assert.equal(formatReviewFeeLabel(150), "1,50\u00a0€")
    assert.equal(formatReviewTotalCents(6000, 150), "61,50\u00a0€")
  })
})
