import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  createMockTransfer,
  MOCK_INVALID_RECIPIENT_ID,
  MOCK_RETRYABLE_AMOUNT_CENTS,
  resetMockCreateTransferState,
} from "./mockCreateTransfer"
import { MOCK_SPENDABLE_BALANCE_CENTS } from "./transferLimits"

describe("mockCreateTransfer", () => {
  it("marks duplicate submissions for the same request_id", async () => {
    resetMockCreateTransferState()

    const input = {
      requestId: "req-1",
      amountCents: 6000,
      feeCents: 0,
      recipientId: "janis-ozols",
      recipientIban: "LV80HABA0551234567857",
      markTrusted: false,
    }

    const first = await createMockTransfer(input)
    const second = await createMockTransfer(input)

    assert.equal(first.status, "submitted")
    assert.equal(first.duplicate, false)
    assert.equal(second.duplicate, true)
    assert.equal(first.transferId, second.transferId)
  })

  it("returns invalid recipient for demo fixture recipient", async () => {
    resetMockCreateTransferState()

    const result = await createMockTransfer({
      requestId: "req-invalid",
      amountCents: 1000,
      feeCents: 0,
      recipientId: MOCK_INVALID_RECIPIENT_ID,
      recipientIban: "LV80BOLT0000999888777",
      markTrusted: false,
    })

    assert.equal(result.status, "failed")
    if (result.status === "failed") {
      assert.equal(result.kind, "invalid_recipient")
      assert.equal(result.airwallexCode, "90101")
    }
  })

  it("returns retryable for demo sentinel amount", async () => {
    resetMockCreateTransferState()

    const result = await createMockTransfer({
      requestId: "req-retry",
      amountCents: MOCK_RETRYABLE_AMOUNT_CENTS,
      feeCents: 0,
      recipientId: "janis-ozols",
      recipientIban: "LV80HABA0551234567857",
      markTrusted: false,
    })

    assert.equal(result.status, "failed")
    if (result.status === "failed") {
      assert.equal(result.kind, "retryable")
    }
  })

  it("returns insufficient when total exceeds spendable balance", async () => {
    resetMockCreateTransferState()

    const result = await createMockTransfer({
      requestId: "req-low",
      amountCents: MOCK_SPENDABLE_BALANCE_CENTS,
      feeCents: 1,
      recipientId: "janis-ozols",
      recipientIban: "LV80HABA0551234567857",
      markTrusted: false,
    })

    assert.equal(result.status, "failed")
    if (result.status === "failed") {
      assert.equal(result.kind, "insufficient")
    }
  })
})
