import { formatEurFromCents } from "../../transactions/lib/formatTransactionAmount"

/** Mock spendable balance (Figma: €60.00). */
export const MOCK_SPENDABLE_BALANCE_CENTS = 6000

/** Mock per-transaction cap for validation demos. */
export const MOCK_PER_TRANSACTION_LIMIT_CENTS = 1_000_000_00

/** Mock daily limit total. */
export const MOCK_DAILY_LIMIT_CENTS = 5_000_00

/** Mock amount already sent today. */
export const MOCK_DAILY_USED_CENTS = 0

export type TransferSubmitErrorKind =
  | "zero"
  | "negative"
  | "per_transaction"
  | "daily"
  | "insufficient"

export interface TransferSubmitError {
  kind: TransferSubmitErrorKind
  message: string
}

export function getDailyRemainingCents(): number {
  return Math.max(0, MOCK_DAILY_LIMIT_CENTS - MOCK_DAILY_USED_CENTS)
}

export function validateTransferAmountOnSubmit(
  amountCents: number,
  spendableCents: number,
): TransferSubmitError | undefined {
  if (amountCents < 0) {
    return {
      kind: "negative",
      message: "Amounts can't be negative — enter a positive number",
    }
  }

  if (amountCents === 0) {
    return {
      kind: "zero",
      message: "Enter an amount greater than 0",
    }
  }

  if (amountCents > MOCK_PER_TRANSACTION_LIMIT_CENTS) {
    const limit = formatEurFromCents(MOCK_PER_TRANSACTION_LIMIT_CENTS)
    return {
      kind: "per_transaction",
      message: `This exceeds the maximum single transfer of ${limit} — enter a smaller amount`,
    }
  }

  const dailyRemaining = getDailyRemainingCents()
  if (amountCents > dailyRemaining) {
    const dailyLimit = formatEurFromCents(MOCK_DAILY_LIMIT_CENTS)
    const remaining = formatEurFromCents(dailyRemaining)
    return {
      kind: "daily",
      message: `This exceeds your daily limit of ${dailyLimit} — you have ${remaining} remaining today`,
    }
  }

  if (amountCents > spendableCents) {
    return {
      kind: "insufficient",
      message: "Not enough available balance",
    }
  }

  return undefined
}

export function isOverSpendable(amountCents: number, spendableCents: number): boolean {
  return amountCents > spendableCents
}
