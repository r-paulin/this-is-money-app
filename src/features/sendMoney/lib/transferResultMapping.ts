export type TransferFailureKind =
  | "invalid_recipient"
  | "insufficient"
  | "retryable"

export type TransferResultUiState =
  | "loading"
  | "submitted"
  | "invalid_recipient"
  | "insufficient"
  | "retryable"

export interface TransferResultCopy {
  heading: string
  body: string
  primaryLabel: string
  secondaryLabel?: string
}

/** Map Airwallex-style failure codes (901XX–904XX) to UI failure kinds. */
export function mapAirwallexFailureCodeToKind(code: string): TransferFailureKind {
  const prefix = code.slice(0, 3)
  if (prefix === "901" || prefix === "902" || prefix === "903" || prefix === "904") {
    return "invalid_recipient"
  }

  if (code === "INSUFFICIENT_BALANCE") {
    return "insufficient"
  }

  return "retryable"
}

export function mapTransferFailureToUi(kind: TransferFailureKind): TransferResultCopy {
  switch (kind) {
    case "invalid_recipient":
      return {
        heading: "Check recipient details",
        body:
          "No money was moved. Check the recipient’s bank details before trying again",
        primaryLabel: "Edit recipient",
        secondaryLabel: "Close",
      }
    case "insufficient":
      return {
        heading: "Not enough balance",
        body:
          "You don’t have enough available balance for this transfer. Your balance will increase as you receive earnings.",
        primaryLabel: "Change amount",
        secondaryLabel: "Close",
      }
    case "retryable":
      return {
        heading: "This transfer didn’t go through",
        body: "No money was moved. Try creating the transfer again.",
        primaryLabel: "Try again",
      }
  }
}
