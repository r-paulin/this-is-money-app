import { useCallback } from "react"
import { useNavigationStack } from "@/shared/navigation"
import { TransactionDetailScreen } from "./components/TransactionDetailScreen"
import type { Transaction } from "./data/mockTransactions"
import {
  getTransactionDetailNavKey,
  getTransactionDetailVariant,
} from "./lib/transactionDetailRoute"

export function useOpenTransactionDetail() {
  const { push } = useNavigationStack()

  return useCallback(
    (transaction: Transaction) => {
      const variant = getTransactionDetailVariant(transaction.kind)
      push({
        key: getTransactionDetailNavKey(transaction.id, variant),
        render: () => <TransactionDetailScreen transaction={transaction} />,
      })
    },
    [push],
  )
}
