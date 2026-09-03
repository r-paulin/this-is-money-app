export interface Recipient {
  id: string
  rawName: string
  iban: string
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

export interface TransferDraft {
  recipient: Recipient
  amountCents: number
  feeCents: number
  reference?: string
}
