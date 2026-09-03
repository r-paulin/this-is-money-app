const CREATE_TRANSFER_DELAY_MS = 600

const submittedRequestIds = new Set<string>()

export function resetMockCreateTransferState(): void {
  submittedRequestIds.clear()
}

export interface MockCreateTransferInput {
  requestId: string
  amountCents: number
  feeCents: number
  recipientId: string
  markTrusted: boolean
}

export interface MockCreateTransferResult {
  transferId: string
  duplicate: boolean
}

/** Mock Airwallex Create a transfer — idempotent per request_id. */
export function createMockTransfer(
  input: MockCreateTransferInput,
): Promise<MockCreateTransferResult> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => {
      const duplicate = submittedRequestIds.has(input.requestId)
      if (!duplicate) {
        submittedRequestIds.add(input.requestId)
      }

      resolve({
        transferId: `mock-transfer-${input.requestId}`,
        duplicate,
      })
    }, CREATE_TRANSFER_DELAY_MS)
  })
}
