import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  createMockTransfer,
  resetMockCreateTransferState,
} from "./mockCreateTransfer"

describe("mockCreateTransfer", () => {
  it("marks duplicate submissions for the same request_id", async () => {
    resetMockCreateTransferState()

    const input = {
      requestId: "req-1",
      amountCents: 6000,
      feeCents: 0,
      recipientId: "janis-ozols",
      markTrusted: false,
    }

    const first = await createMockTransfer(input)
    const second = await createMockTransfer(input)

    assert.equal(first.duplicate, false)
    assert.equal(second.duplicate, true)
    assert.equal(first.transferId, second.transferId)
  })
})
