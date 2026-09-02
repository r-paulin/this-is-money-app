import { TextField, Typography } from "@bolteu/kalep-react"
import Download from "@bolteu/kalep-react-icons/dist/Download"
import { useEffect, useMemo, useState } from "react"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { useNavigationStack } from "@/shared/navigation"
import { buildMockTransactions } from "../data/mockTransactions"
import {
  formatTransactionSectionLabel,
  groupKeyForTransaction,
} from "../lib/formatTransactionDate"
import { searchTransactions } from "../lib/searchTransactions"
import { GetStatementGate } from "./GetStatementGate"
import { TransactionRow } from "./TransactionRow"

const SEARCH_DEBOUNCE_MS = 200

export function TransactionsScreen() {
  const { push } = useNavigationStack()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [query])

  const groups = useMemo(() => {
    const now = new Date()
    const allItems = [...buildMockTransactions(now)].sort(
      (a, b) => b.occurredAt - a.occurredAt,
    )
    const items = searchTransactions(allItems, debouncedQuery)
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
  }, [debouncedQuery])

  const isSearching = debouncedQuery.trim().length > 0
  const hasResults = groups.length > 0

  const openGetStatement = () => {
    push({
      key: "get-statement",
      render: () => <GetStatementGate />,
    })
  }

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-6 py-3">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Transactions
          </Typography>
        </div>

        <div className="flex items-start pr-6">
          <div className="min-w-0 flex-1 pl-6 pr-3">
            <TextField
              type="search"
              size="lg"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              fullWidth
            />
          </div>
          <button
            type="button"
            onClick={openGetStatement}
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-compact bg-neutral-secondary text-primary"
            aria-label="Get statement"
          >
            <Download size="lg" aria-hidden />
          </button>
        </div>

        {isSearching && !hasResults ? (
          <div className="px-6 py-4">
            <Typography variant="body-m-regular" color="secondary" as="p">
              No transactions found
            </Typography>
          </div>
        ) : null}

        {groups.map((group) => (
          <section key={group.key} aria-label={group.label}>
            <SectionHeader paddingBottom={8}>{group.label}</SectionHeader>
            <ul className="m-0 list-none p-0">
              {group.transactions.map((tx, index) => (
                <li key={tx.id}>
                  <TransactionRow
                    transaction={tx}
                    separator={index < group.transactions.length - 1}
                    searchQuery={isSearching ? debouncedQuery : undefined}
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
