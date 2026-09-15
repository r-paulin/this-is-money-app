import { Button } from "@bolteu/kalep-react"
import type { Transaction } from "../data/mockTransactions"
import { buildTransactionDetailView } from "../lib/transactionDetailContent"
import { TransactionDetailSections } from "./TransactionDetailSections"
import { TransactionDetailSummary } from "./TransactionDetailSummary"
import "./transaction-detail.css"

export interface TransactionDetailScreenProps {
  transaction: Transaction
}

function DetailFooter({ view }: { view: ReturnType<typeof buildTransactionDetailView> }) {
  const handleGetHelp = () => console.info("[stub] Get help")
  const handleDownloadReceipt = () => console.info("[stub] Download receipt")

  if (view.variant === "transfer") {
    return (
      <div className="transaction-detail__footer">
        <Button size="lg" variant="secondary" fullWidth onClick={handleDownloadReceipt}>
          Download receipt
        </Button>
        <Button size="lg" variant="secondary" fullWidth onClick={handleGetHelp}>
          Get help
        </Button>
      </div>
    )
  }

  return (
    <div className="transaction-detail__footer">
      <Button size="lg" variant="secondary" fullWidth onClick={handleGetHelp}>
        Get help
      </Button>
    </div>
  )
}

export function TransactionDetailScreen({ transaction }: TransactionDetailScreenProps) {
  const view = buildTransactionDetailView(transaction)

  return (
    <div className="transaction-detail min-h-dvh">
      <div className="transaction-detail__scroll">
        <TransactionDetailSummary transaction={transaction} view={view} />
        <TransactionDetailSections view={view} />
      </div>
      <DetailFooter view={view} />
    </div>
  )
}
