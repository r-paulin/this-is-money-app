export type RecipientType = "individual" | "business"

export interface Recipient {
  id: string
  rawName: string
  iban: string
  recipientType?: RecipientType
  lastAmountCents: number
  lastTransferredAt: number
  transferCount90d: number
  transferCount365d: number
  averageAmountCents: number
  isLinkedBankAccount: boolean
  isTrusted: boolean
}

export type AddRecipientRowVariant = "default" | "no-results" | "send-to-iban"

export interface RecipientSearchResult {
  recipients: Recipient[]
  addRowVariant: AddRecipientRowVariant
  addRowPrefill?: string
  ibanFormatted?: string
}

export interface RecipientFormValues {
  iban: string
  accountNumber: string
  transitNumber: string
  institutionNumber: string
  accountHolderName: string
}

export type RecipientFormField = keyof RecipientFormValues
export type RecipientFormErrors = Partial<Record<RecipientFormField, string>>

export const RECIPIENT_RETENTION_DAYS = 180
export const DEFAULT_RECIPIENT_LIST_MAX = 10

export type PayeeVerificationStatus =
  | "FULL_MATCH"
  | "PARTIAL_MATCH"
  | "PARTIAL_MATCH_INCORRECT_TYPE"
  | "NOT_MATCHED"
  | "UNAVAILABLE"

export interface PayeeVerification {
  status: PayeeVerificationStatus
  resolvedBankName?: string
  /** Bank's version of the account name, masked for close-match warnings. */
  maskedAccountName?: string
}

export interface TransferDraft {
  recipient: Recipient
  amountCents: number
  feeCents: number
  reference?: string
  payeeVerification: PayeeVerification
  /** Set per submit attempt — used for idempotent create-transfer. */
  requestId?: string
  markTrusted?: boolean
}
