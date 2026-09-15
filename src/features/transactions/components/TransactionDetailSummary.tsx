import { Typography } from "@bolteu/kalep-react"
import type { Transaction } from "../data/mockTransactions"
import type { TransactionDetailView } from "../lib/transactionDetailContent"
import { TransactionCategoryIcon } from "./TransactionCategoryIcon"
import "./transaction-detail.css"

export interface TransactionDetailSummaryProps {
  transaction: Transaction
  view: TransactionDetailView
}

function amountColor(
  tone: TransactionDetailView["amountTone"],
): "primary" | "action-primary" | "secondary" {
  if (tone === "credit") return "action-primary"
  if (tone === "declined" || tone === "missing") return "secondary"
  return "primary"
}

export function TransactionDetailSummary({ transaction, view }: TransactionDetailSummaryProps) {
  return (
    <div className="transaction-detail__summary-wrap">
      <div className="transaction-detail__summary-card">
        <TransactionCategoryIcon
          mcc={transaction.mcc}
          kind={transaction.kind}
          themeOverride={transaction.themeOverride}
        />
        <div className="transaction-detail__summary-amount">
          <Typography variant="heading-l-accent" color={amountColor(view.amountTone)} as="p" align="center">
            {view.amountText}
          </Typography>
        </div>
        <div className="transaction-detail__summary-subtext">
          <Typography variant="body-s-regular" color="secondary" as="p" align="center">
            {view.subtext}
          </Typography>
        </div>
      </div>
    </div>
  )
}
