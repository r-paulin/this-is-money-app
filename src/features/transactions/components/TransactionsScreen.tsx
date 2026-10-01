import { GhostButton, TextField, Typography, useSnackbar } from "@bolteu/kalep-react"
import Download from "@bolteu/kalep-react-icons/dist/Download"
import { useEffect, useMemo, useRef, useState } from "react"
import receipt from "@/features/home/assets/illustration-receipt.svg"
import spilledMug from "@/features/home/assets/illustration-spilled-mug.svg"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { useNavigationStack } from "@/shared/navigation"
import { useOpenTransactionDetail } from "../useOpenTransactionDetail"
import { buildMockTransactions } from "../data/mockTransactions"
import {
  formatTransactionSectionLabel,
  groupKeyForTransaction,
} from "../lib/formatTransactionDate"
import { applyActivitySearch } from "../lib/searchTransactions"
import { GetStatementGate } from "./GetStatementGate"
import { TransactionRow } from "./TransactionRow"
import { TransactionSkeletonRows } from "./TransactionsLoadingScreen"

const SEARCH_DEBOUNCE_MS = 200
const PAGE_SIZE = 20
const NEXT_PAGE_MS = 400
const END_SNACKBAR = "You have reached the end of your activity list"

export function TransactionsScreen() {
  const { push } = useNavigationStack()
  const snackbar = useSnackbar()
  const openTransactionDetail = useOpenTransactionDetail()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [page, setPage] = useState({ query: "", count: PAGE_SIZE })
  const [loadingPage, setLoadingPage] = useState(false)
  const [searchAttempt, setSearchAttempt] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const endNoticeSent = useRef(false)
  const previousQuery = useRef("")

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  const now = useMemo(() => new Date(), [])
  const allItems = useMemo(
    () => [...buildMockTransactions(now)].sort((a, b) => b.occurredAt - a.occurredAt),
    [now],
  )

  const search = useMemo(() => {
    void searchAttempt
    return applyActivitySearch(allItems, debouncedQuery)
  }, [allItems, debouncedQuery, searchAttempt])

  const settling =
    query.trim().length >= 3 && query.trim() !== debouncedQuery.trim()
  const filtering = search.status === "results" || search.status === "empty"
  const visibleCount = page.query === debouncedQuery ? page.count : PAGE_SIZE
  const visibleItems = search.items.slice(0, visibleCount)
  const hasMore = visibleCount < search.items.length

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (previousQuery.current.length > 0 && trimmed.length === 0) {
      rootRef.current?.closest(".nav-layer")?.scrollTo({ top: 0 })
    }
    previousQuery.current = trimmed
  }, [debouncedQuery])

  useEffect(() => {
    if (hasMore || filtering || search.items.length === 0 || endNoticeSent.current) return
    endNoticeSent.current = true
    snackbar.add({ description: END_SNACKBAR, dismissible: true, timeout: 4000 })
  }, [filtering, hasMore, search.items.length, snackbar])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loadingPage || settling || search.status === "error") return
    const root = rootRef.current?.closest(".nav-layer")
    if (!(root instanceof Element)) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setLoadingPage(true)
        window.setTimeout(() => {
          setPage((current) => {
            const count = current.query === debouncedQuery ? current.count : PAGE_SIZE
            return { query: debouncedQuery, count: count + PAGE_SIZE }
          })
          setLoadingPage(false)
        }, NEXT_PAGE_MS)
      },
      { root },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [debouncedQuery, hasMore, loadingPage, search.status, settling])

  const groups = useMemo(() => {
    const map = new Map<string, typeof visibleItems>()
    for (const tx of visibleItems) {
      const key = groupKeyForTransaction(tx.occurredAt, now)
      const list = map.get(key)
      if (list) list.push(tx)
      else map.set(key, [tx])
    }
    return Array.from(map.entries()).map(([key, transactions]) => ({
      key,
      label: formatTransactionSectionLabel(transactions[0]!.occurredAt, now),
      transactions,
    }))
  }, [now, visibleItems])

  const openGetStatement = () => {
    push({
      key: "get-statement",
      render: () => <GetStatementGate />,
    })
  }

  return (
    <div ref={rootRef} className="min-h-dvh bg-layer-floor-1">
      <div className="px-6 py-3">
        <Typography variant="heading-l-accent" color="primary" as="h1">
          Activity
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
            aria-label="Search transactions"
            fullWidth
            overrideClassName="!rounded-full"
          />
        </div>
        <button
          type="button"
          onClick={openGetStatement}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-neutral-secondary text-primary"
          aria-label="Get statement"
        >
          <Download size="lg" aria-hidden />
        </button>
      </div>

      {settling ? <TransactionSkeletonRows /> : null}

      {!settling && search.status === "empty" ? (
        <div className="flex flex-col items-center px-6 pb-8 pt-8">
          <img src={receipt} alt="" width={80} height={80} className="mb-3" />
          <Typography variant="body-m-accent" color="primary" as="p" align="center">
            We couldn&apos;t find a match
          </Typography>
          <Typography variant="body-m-regular" color="secondary" as="p" align="center">
            Try searching with a different name, amount, or reference
          </Typography>
        </div>
      ) : null}

      {!settling && search.status === "error" ? (
        <div className="flex flex-col items-center px-6 pb-8 pt-8">
          <img src={spilledMug} alt="" width={80} height={80} className="mb-3" />
          <Typography variant="body-m-accent" color="primary" as="p" align="center">
            Search didn&apos;t work
          </Typography>
          <Typography variant="body-m-regular" color="secondary" as="p" align="center">
            Try again in a moment
          </Typography>
          <div className="pt-4">
            <GhostButton onClick={() => setSearchAttempt((attempt) => attempt + 1)}>
              Try again
            </GhostButton>
          </div>
        </div>
      ) : null}

      {!settling && search.status !== "empty" && search.status !== "error"
        ? groups.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <SectionHeader paddingBottom={8}>{group.label}</SectionHeader>
              <ul className="m-0 list-none p-0">
                {group.transactions.map((tx, index) => (
                  <li key={tx.id}>
                    <TransactionRow
                      transaction={tx}
                      separator={index < group.transactions.length - 1}
                      searchQuery={filtering ? debouncedQuery : undefined}
                      onSelect={openTransactionDetail}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        : null}

      {loadingPage ? <TransactionSkeletonRows /> : null}
      {hasMore && !settling && search.status !== "error" ? (
        <div ref={sentinelRef} className="h-8" aria-hidden />
      ) : null}
      {!hasMore && !filtering && search.items.length > 0 ? (
        <div className="h-24" aria-hidden />
      ) : null}
    </div>
  )
}
