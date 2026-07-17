import { GhostButton, Typography } from "@bolteu/kalep-react"
import ChevronCircleLeft from "@bolteu/kalep-react-icons/dist/ChevronCircleLeft"
import Download from "@bolteu/kalep-react-icons/dist/Download"
import { useMemo } from "react"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { useNavigationStack } from "@/shared/navigation"
import { buildMockTransactions } from "../data/mockTransactions"
import {
  formatTransactionSectionLabel,
  groupKeyForTransaction,
} from "../lib/formatTransactionDate"
import { GetStatementGate } from "./GetStatementGate"
import { TransactionRow } from "./TransactionRow"

export interface TransactionsScreenProps {
  onBack?: () => void
}

export function TransactionsScreen({ onBack }: TransactionsScreenProps) {
  const { pop, push } = useNavigationStack()
  const handleBack = onBack ?? pop

  const groups = useMemo(() => {
    const now = new Date()
    const items = [...buildMockTransactions(now)].sort(
      (a, b) => b.occurredAt - a.occurredAt,
    )
    const map = new Map<string, typeof items>()
    for (const tx of items) {
      const key = groupKeyForTransaction(tx.occurredAt, now)
      const list = map.get(key)
      if (list) {
        list.push(tx)
      } else {
        map.set(key, [tx])
      }
    }
    return Array.from(map.entries()).map(([key, transactions]) => ({
      key,
      label: formatTransactionSectionLabel(transactions[0]!.occurredAt, now),
      transactions,
    }))
  }, [])

  const openGetStatement = () => {
    push({
      key: "get-statement",
      render: () => <GetStatementGate />,
    })
  }

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-5 pr-6 pt-6">
          <GhostButton onClick={handleBack} aria-label="Back">
            <span className="flex items-center gap-2">
              <ChevronCircleLeft size="lg" className="text-action-primary" />
              <span className="text-body-m font-semibold text-action-primary">Back</span>
            </span>
          </GhostButton>

          <div className="flex items-center gap-3 pb-3 pt-3">
            <div className="min-w-0 flex-1">
              <Typography variant="heading-l-accent" color="primary" as="h1">
                Transactions
              </Typography>
            </div>
            <button
              type="button"
              onClick={openGetStatement}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-secondary text-primary"
              aria-label="Get statement"
            >
              <Download size="sm" aria-hidden />
            </button>
          </div>
        </div>

        {groups.map((group) => (
          <section key={group.key} aria-label={group.label}>
            <SectionHeader paddingBottom={8}>{group.label}</SectionHeader>
            <ul className="m-0 list-none p-0">
              {group.transactions.map((tx, index) => (
                <li key={tx.id}>
                  <TransactionRow
                    transaction={tx}
                    separator={index < group.transactions.length - 1}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
