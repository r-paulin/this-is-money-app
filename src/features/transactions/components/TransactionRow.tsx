import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import type { Transaction } from "../data/mockTransactions"
import type { TransactionKind } from "../data/mccThemes"
import {
  formatSignedTransactionAmount,
  formatTransactionListEurFromCents,
} from "../lib/formatTransactionAmount"
import { formatTransactionTimestamp } from "../lib/formatTransactionDate"
import { highlightSubstringMatch } from "../lib/highlightSubstringMatch"
import { merchantTitle } from "../lib/merchantTitle"
import { TransactionCategoryIcon } from "./TransactionCategoryIcon"

export interface TransactionRowProps {
  transaction: Transaction
  separator: boolean
  searchQuery?: string
}

function statusSuffix(kind: TransactionKind): string | null {
  switch (kind) {
    case "declined":
      return "Declined"
    case "refund":
      return "Refund"
    case "authorization":
      return "Authorization"
    case "reversal":
      return "Reverted"
    case "failed":
      return "Failed"
    default:
      return null
  }
}

export function TransactionRow({ transaction, separator, searchQuery }: TransactionRowProps) {
  const title = merchantTitle(transaction)
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
  })
  const status = statusSuffix(transaction.kind)
  const timestamp = formatTransactionTimestamp(transaction.occurredAt)
  const secondaryLabel = status ? `${timestamp} · ${status}` : timestamp

  const amountColor =
    amount.tone === "credit"
      ? "action-primary"
      : amount.tone === "declined" || amount.tone === "missing"
        ? "secondary"
        : "primary"

  const amountClass = amount.tone === "declined" ? "line-through" : undefined

  const primary =
    searchQuery && searchQuery.trim().length > 0 ? (
      highlightSubstringMatch(title, searchQuery)
    ) : (
      title
    )

  const secondary =
    transaction.serviceFeeCents != null && transaction.serviceFeeCents > 0 ? (
      <>
        {secondaryLabel}
        <br />
        {`Service fee included: ${formatTransactionListEurFromCents(transaction.serviceFeeCents)}`}
      </>
    ) : (
      secondaryLabel
    )

  return (
    <ListItemLayout
      primary={
        <span className="line-clamp-3 break-words">
          {primary}
        </span>
      }
      secondary={secondary}
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      primaryTypographyProps={{ variant: "body-m-compact-regular" }}
      secondaryTypographyProps={{ variant: "body-s-regular" }}
      renderStartSlot={() => (
        <div className="self-start">
          <TransactionCategoryIcon
            mcc={transaction.mcc}
            kind={transaction.kind}
            themeOverride={transaction.themeOverride}
          />
        </div>
      )}
      renderEndSlot={() => (
        <div className="self-start">
          <Typography
            variant="body-m-compact-regular"
            color={amountColor}
            as="span"
            align="end"
          >
            <span className={amountClass}>{amount.text}</span>
          </Typography>
        </div>
      )}
      aria-label={title}
    />
  )
}
