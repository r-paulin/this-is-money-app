import type { Transaction } from "../data/mockTransactions"

const YEAR_LIMIT_MESSAGE =
  "Statements can cover up to one year. Adjust the start or end date."

export function statementRangeLimitMessage(): string {
  return YEAR_LIMIT_MESSAGE
}

/** True when the inclusive custom range is longer than one calendar year. */
export function isCustomRangeLongerThanOneYear(start: Date, end: Date): boolean {
  const limit = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  return endDay.getTime() > limit.getTime()
}

export type StatementOutcome = "ready" | "empty"

export function prepareStatement(opts: {
  start: Date
  end: Date
  transactions: Transaction[]
  fail?: boolean
}): StatementOutcome {
  if (opts.fail) {
    throw new Error("Statement generation failed")
  }
  const startMs = opts.start.getTime()
  const endMs = opts.end.getTime()
  const count = opts.transactions.filter(
    (transaction) => transaction.occurredAt >= startMs && transaction.occurredAt <= endMs,
  ).length
  return count === 0 ? "empty" : "ready"
}
