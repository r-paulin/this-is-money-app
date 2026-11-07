import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import type { Transaction } from "../data/mockTransactions"
import {
  formatSignedTransactionAmount,
  formatTransactionListEurFromCents,
} from "../lib/formatTransactionAmount"
import { formatTransactionTimestamp } from "../lib/formatTransactionDate"
import { highlightSubstringMatch } from "../lib/highlightSubstringMatch"
import { formatListSecondary, listStatusFromKind, listStatusLabel } from "../lib/listStatus"
import { merchantTitle } from "../lib/merchantTitle"
import { TransactionCategoryIcon } from "./TransactionCategoryIcon"
import "./transaction-row.css"

export interface TransactionRowProps {
  transaction: Transaction
  separator: boolean
  searchQuery?: string
  onSelect?: (transaction: Transaction) => void
}

export function TransactionRow({
  transaction,
  separator,
  searchQuery,
  onSelect,
}: TransactionRowProps) {
  const title = merchantTitle(transaction)
  const amount = formatSignedTransactionAmount({
    amountCents: transaction.amountCents,
    kind: transaction.kind,
    listStatus: transaction.listStatus,
  })
  const timestamp = formatTransactionTimestamp(transaction.occurredAt)
  const secondaryLabel = formatListSecondary({
    timestamp,
    listStatus: transaction.listStatus,
    kind: transaction.kind,
    reservedAmountCents: transaction.reservedAmountCents,
    linkedMerchant: transaction.linkedMerchant,
  })
  const kindStatus = listStatusFromKind(transaction.kind)
  const statusForA11y =
    transaction.listStatus != null
      ? listStatusLabel(transaction.listStatus)
      : transaction.reservedAmountCents != null
        ? `Reserved ${formatTransactionListEurFromCents(transaction.reservedAmountCents)}`
        : (transaction.linkedMerchant ??
          (kindStatus ? listStatusLabel(kindStatus) : null))

  const amountColor =
    amount.tone === "credit"
      ? "action-primary"
      : amount.tone === "declined" || amount.tone === "muted"
        ? "tertiary"
        : amount.tone === "missing"
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

  const serviceFeeLabel =
    transaction.serviceFeeCents != null && transaction.serviceFeeCents > 0
      ? `, Service fee included: ${formatTransactionListEurFromCents(transaction.serviceFeeCents)}`
      : ""
  const secondaryAmountLabel = transaction.secondaryAmountText
    ? `, ${transaction.secondaryAmountText}`
    : ""
  const accessibleLabel = statusForA11y
    ? `${title}, ${timestamp}, ${statusForA11y}, ${amount.text}${secondaryAmountLabel}${serviceFeeLabel}`
    : `${title}, ${timestamp}, ${amount.text}${secondaryAmountLabel}${serviceFeeLabel}`

  return (
    <div className="transaction-row">
      <ListItemLayout
        onClick={onSelect ? () => onSelect(transaction) : undefined}
        primary={
          <span className="line-clamp-3 break-words py-[var(--list-item-label-py)]">
            {primary}
          </span>
        }
        secondary={secondary}
        separator={separator}
        paddingStart={6}
        paddingEnd={6}
        /* Figma size.comp.M vr-padding 8px (9656:41653). */
        paddingTop={2}
        paddingBottom={2}
        primaryTypographyProps={{ variant: "body-m-compact-regular" }}
        secondaryTypographyProps={{ variant: "body-s-regular" }}
        renderStartSlot={() => (
          /* Figma Start Slot: items-start + py 6px around 40px MCC. */
          <div className="self-start py-1.5">
            <TransactionCategoryIcon
              mcc={transaction.mcc}
              kind={transaction.kind}
              themeOverride={transaction.themeOverride}
            />
          </div>
        )}
        renderEndSlot={() => (
          /* Figma End Slot: items-start + pt 4px — amount on the primary line. */
          <div className="flex flex-col items-end self-start pt-1">
            <Typography
              variant="body-m-compact-regular"
              color={amountColor}
              as="span"
              align="end"
              inlineStyle={{ fontVariantNumeric: "lining-nums tabular-nums" }}
            >
              <span
                className={["py-[var(--list-item-label-py)]", amountClass]
                  .filter(Boolean)
                  .join(" ")}
              >
                {amount.text}
              </span>
            </Typography>
            {transaction.secondaryAmountText ? (
              <Typography
                variant="body-s-regular"
                color="secondary"
                as="span"
                align="end"
                inlineStyle={{ fontVariantNumeric: "lining-nums tabular-nums" }}
              >
                {transaction.secondaryAmountText}
              </Typography>
            ) : null}
          </div>
        )}
        aria-label={accessibleLabel}
      />
    </div>
  )
}
