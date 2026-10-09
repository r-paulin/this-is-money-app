import { TextField, Typography, useSnackbar } from "@bolteu/kalep-react"
import Download from "@bolteu/kalep-react-icons/dist/Download"
import { useEffect, useMemo, useRef, useState } from "react"
import spilledMug from "@/features/home/assets/illustration-spilled-mug.svg"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { useNavigationStack } from "@/shared/navigation"
import longDocument from "../assets/illustration-long-document.png"
import { useOpenTransactionDetail } from "../useOpenTransactionDetail"
import { buildMockTransactions } from "../data/mockTransactions"
import {
  formatTransactionSectionLabel,
  groupKeyForTransaction,
} from "../lib/formatTransactionDate"
import { applyActivitySearch } from "../lib/searchTransactions"
import {
  ActivitySearchRetryButton,
  ActivitySearchStatus,
} from "./ActivitySearchStatus"
import { GetStatementGate } from "./GetStatementGate"
import { TransactionRow } from "./TransactionRow"
import {
  TransactionSearchSkeleton,
  TransactionSkeletonRows,
} from "./TransactionsLoadingScreen"

/** Matches `--motion-duration-sm`. */
const SEARCH_DEBOUNCE_MS = 200
const PAGE_SIZE = 20
/** Matches `--motion-duration-lg`. */
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
  const userScrolled = useRef(false)
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
  const showList =
    !settling && search.status !== "empty" && search.status !== "error"

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (previousQuery.current.length > 0 && trimmed.length === 0) {
      rootRef.current?.closest(".nav-layer")?.scrollTo({ top: 0 })
    }
    previousQuery.current = trimmed
    endNoticeSent.current = false
    userScrolled.current = false
  }, [debouncedQuery])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loadingPage || settling || !showList) return
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
  }, [debouncedQuery, hasMore, loadingPage, settling, showList])

  useEffect(() => {
    // End toast only when the driver scrolls to the bottom — not when a short
    // filtered list fits on screen or auto-pagination exhausts the set.
    if (hasMore || !showList || search.items.length === 0) return
    const root = rootRef.current?.closest(".nav-layer")
    if (!(root instanceof Element)) return

    const onScroll = () => {
      if (root.scrollTop > 0) userScrolled.current = true
      if (!userScrolled.current || endNoticeSent.current) return
      const remaining = root.scrollHeight - root.scrollTop - root.clientHeight
      if (remaining > 8) return
      endNoticeSent.current = true
      snackbar.add({ description: END_SNACKBAR, dismissible: true, timeout: 4000 })
    }

    root.addEventListener("scroll", onScroll, { passive: true })
    return () => root.removeEventListener("scroll", onScroll)
  }, [hasMore, search.items.length, showList, snackbar])

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
    <div
      ref={rootRef}
      className="flex min-h-[calc(var(--app-h)-var(--app-navbar-offset))] flex-col bg-layer-floor-1"
    >
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

      {settling ? <TransactionSearchSkeleton /> : null}

      {!settling && search.status === "empty" ? (
        <ActivitySearchStatus
          imageSrc={longDocument}
          title="We couldn't find a match"
          body="Try searching with a different name, amount, or reference"
        />
      ) : null}

      {!settling && search.status === "error" ? (
        <ActivitySearchStatus
          imageSrc={spilledMug}
          title="Search didn't work"
          body="Try again in a moment"
          action={
            <ActivitySearchRetryButton
              onRetry={() => setSearchAttempt((attempt) => attempt + 1)}
            />
          }
        />
      ) : null}

      {showList
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
      {showList && search.items.length > 0 ? (
        <div ref={sentinelRef} className={hasMore ? "h-8" : "h-24"} aria-hidden />
      ) : null}
    </div>
  )
}
