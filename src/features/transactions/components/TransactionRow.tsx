import { Typography } from "@bolteu/kalep-react"
import type { Transaction } from "../data/mockTransactions"
import { formatEurFromCents, formatSignedTransactionAmount } from "../lib/formatTransactionAmount"
import { formatTransactionTimestamp } from "../lib/formatTransactionDate"
import { TransactionCategoryIcon } from "./TransactionCategoryIcon"

export interface TransactionRowProps {
  transaction: Transaction
  separator: boolean
}

function statusSuffix(kind: Transaction["kind"]): string | null {
  if (kind === "declined") return "Declined"
  if (kind === "refund") return "Refund"
  return null
}

export function TransactionRow({ transaction, separator }: TransactionRowProps) {
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
  })
  const status = statusSuffix(transaction.kind)
  const timestamp = formatTransactionTimestamp(transaction.occurredAt)
  const secondaryLabel = status ? `${timestamp} · ${status}` : timestamp

  const amountClass =
    amount.tone === "credit"
      ? "text-action-primary"
      : amount.tone === "declined"
        ? "text-secondary line-through"
        : "text-primary"

  return (
    <div
      className={`flex w-full items-start gap-3 px-6 py-3 ${
        separator ? "border-0 border-b border-solid border-separator" : ""
      }`}
    >
      <div className="flex shrink-0 items-center">
        <TransactionCategoryIcon
          mcc={transaction.mcc}
          kind={transaction.kind}
          themeOverride={transaction.themeOverride}
        />
      </div>

      <div className="min-w-0 flex-1">
        <Typography variant="body-m-regular" color="primary" as="div">
          {transaction.merchant}
        </Typography>
        <Typography variant="body-s-regular" color="secondary" as="div">
          {secondaryLabel}
        </Typography>
        {transaction.serviceFeeCents != null && transaction.serviceFeeCents > 0 ? (
          <Typography variant="body-s-regular" color="secondary" as="div">
            {`Service fee included: ${formatEurFromCents(transaction.serviceFeeCents)}`}
          </Typography>
        ) : null}
      </div>

      <div className="shrink-0">
        <Typography
          variant="body-m-regular"
          color={amount.tone === "credit" ? "action-primary" : "primary"}
          as="span"
          align="end"
        >
          <span className={amountClass}>{amount.text}</span>
        </Typography>
      </div>
    </div>
  )
}
