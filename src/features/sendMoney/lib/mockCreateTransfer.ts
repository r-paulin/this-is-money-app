import { MOCK_SPENDABLE_BALANCE_CENTS } from "./transferLimits"
import {
  resolveTransferArrivalRail,
  type TransferArrivalRail,
} from "./transferArrivalCopy"
import type { TransferFailureKind } from "./transferResultMapping"

const CREATE_TRANSFER_DELAY_MS = 900

const submittedRequestIds = new Set<string>()

/** Demo: send to this recipient to surface invalid-recipient error (901XX–904XX stand-in). */
export const MOCK_INVALID_RECIPIENT_ID = "wang-wei"

/** Demo: use this amount in cents to surface retryable failure. */
export const MOCK_RETRYABLE_AMOUNT_CENTS = 7_777

export function resetMockCreateTransferState(): void {
  submittedRequestIds.clear()
}

export interface MockCreateTransferInput {
  requestId: string
  amountCents: number
  feeCents: number
  recipientId: string
  recipientIban: string
  markTrusted: boolean
}

export type MockCreateTransferSuccess = {
  status: "submitted"
  transferId: string
  duplicate: false
  arrivalRail: TransferArrivalRail
}

export type MockCreateTransferDuplicate = {
  status: "submitted"
  transferId: string
  duplicate: true
  arrivalRail: TransferArrivalRail
}

export type MockCreateTransferFailed = {
  status: "failed"
  duplicate: false
  kind: TransferFailureKind
  airwallexCode?: string
}

export type MockCreateTransferResult =
  | MockCreateTransferSuccess
  | MockCreateTransferDuplicate
  | MockCreateTransferFailed

function resolveMockFailureKind(input: MockCreateTransferInput): TransferFailureKind | null {
  if (input.recipientId === MOCK_INVALID_RECIPIENT_ID) {
    return "invalid_recipient"
  }

  if (input.amountCents === MOCK_RETRYABLE_AMOUNT_CENTS) {
    return "retryable"
  }

  const totalCents = input.amountCents + input.feeCents
  if (totalCents > MOCK_SPENDABLE_BALANCE_CENTS) {
    return "insufficient"
  }

  return null
}

function failureCodeForKind(kind: TransferFailureKind): string {
  switch (kind) {
    case "invalid_recipient":
      return "90101"
    case "insufficient":
      return "INSUFFICIENT_BALANCE"
    case "retryable":
      return "90500"
  }
}

/** Mock Airwallex Create a transfer — idempotent per request_id. */
export function createMockTransfer(
  input: MockCreateTransferInput,
): Promise<MockCreateTransferResult> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => {
      const duplicate = submittedRequestIds.has(input.requestId)
      const transferId = `mock-transfer-${input.requestId}`
      const arrivalRail = resolveTransferArrivalRail(input.recipientIban)

      if (duplicate) {
        resolve({
          status: "submitted",
          transferId,
          duplicate: true,
          arrivalRail,
        })
        return
      }

      const failureKind = resolveMockFailureKind(input)
      if (failureKind) {
        resolve({
          status: "failed",
          duplicate: false,
          kind: failureKind,
          airwallexCode: failureCodeForKind(failureKind),
        })
        return
      }

      submittedRequestIds.add(input.requestId)
      resolve({
        status: "submitted",
        transferId,
        duplicate: false,
        arrivalRail,
      })
    }, CREATE_TRANSFER_DELAY_MS)
  })
}
