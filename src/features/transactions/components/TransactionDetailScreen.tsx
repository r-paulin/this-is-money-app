import { Button } from "@bolteu/kalep-react"
import type { Transaction } from "../data/mockTransactions"
import {
  buildTransactionDetailView,
  type DetailFooterAction,
  type TransactionDetailView,
} from "../lib/transactionDetailContent"
import { DetailNotice } from "./DetailNotice"
import { TransactionDetailSections } from "./TransactionDetailSections"
import { TransactionDetailSummary } from "./TransactionDetailSummary"
import "./transaction-detail.css"

export interface TransactionDetailScreenProps {
  transaction: Transaction
}

function footerLabel(action: DetailFooterAction): string {
  switch (action) {
    case "dispute":
      return "Dispute"
    case "download_receipt":
      return "Download receipt"
    case "get_help":
      return "Get help"
  }
}

function DetailFooter({ view }: { view: TransactionDetailView }) {
  return (
    <div className="transaction-detail__footer">
      {view.footer.actions.map((action) => (
        <Button
          key={action}
          size="lg"
          variant="secondary"
          fullWidth
          onClick={() => console.info(`[stub] ${footerLabel(action)}`)}
        >
          {footerLabel(action)}
        </Button>
      ))}
    </div>
  )
}

export function TransactionDetailScreen({ transaction }: TransactionDetailScreenProps) {
  const view = buildTransactionDetailView(transaction)

  return (
    <div className="transaction-detail">
      <div className="transaction-detail__scroll">
        <TransactionDetailSummary transaction={transaction} view={view} />
        {view.notice ? (
          <DetailNotice
            tone={view.notice.tone}
            title={view.notice.title}
            body={view.notice.body}
          />
        ) : null}
        <TransactionDetailSections view={view} />
        <DetailFooter view={view} />
      </div>
    </div>
  )
}
