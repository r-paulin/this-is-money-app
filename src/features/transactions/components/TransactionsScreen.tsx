import { TextField, Typography, useSnackbar } from "@bolteu/kalep-react"
import ArrowCircleRightDown from "@bolteu/kalep-react-icons/dist/ArrowCircleRightDown"
import ArrowCircleRightUp from "@bolteu/kalep-react-icons/dist/ArrowCircleRightUp"
import Clear from "@bolteu/kalep-react-icons/dist/Clear"
import Filters from "@bolteu/kalep-react-icons/dist/Filters"
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import "./activity-list-stagger.css"
import spilledMug from "@/features/home/assets/illustration-spilled-mug.svg"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { useNavigationStack } from "@/shared/navigation"
import longDocument from "../assets/illustration-long-document.png"
import { useOpenTransactionDetail } from "../useOpenTransactionDetail"
import { buildMockTransactions, type Transaction } from "../data/mockTransactions"
import {
  EMPTY_ACTIVITY_FILTERS,
  type ActivityFilterSelection,
  appliedChips,
  badgeCount,
  formatResultCount,
  formatSummaryTotal,
  loadFilteredTransactions,
  removeAppliedChip,
  summaryFlowCents,
} from "../lib/activityFilters"
import { formatTransactionListEurFromCents } from "../lib/formatTransactionAmount"
import {
  formatTransactionSectionLabel,
  groupKeyForTransaction,
} from "../lib/formatTransactionDate"
import { applyActivitySearch } from "../lib/searchTransactions"
import { ActivityFiltersScreen } from "./ActivityFiltersScreen"
import {
  ActivitySearchRetryButton,
  ActivitySearchStatus,
} from "./ActivitySearchStatus"
import { TransactionRow } from "./TransactionRow"
import { TransactionSearchSkeleton } from "./TransactionsLoadingScreen"

/** Matches `--motion-duration-sm`. */
const SEARCH_DEBOUNCE_MS = 200
const PAGE_SIZE = 20
/** Matches `--motion-duration-lg`. */
const NEXT_PAGE_MS = 400
const END_SNACKBAR = "You have reached the end of your activity list"

function selectionKey(selection: ActivityFilterSelection): string {
  return [
    selection.date,
    selection.customStart?.getTime() ?? "",
    selection.customEnd?.getTime() ?? "",
    selection.moneyFlow,
    selection.types.join(","),
  ].join("|")
}

function scrollPort(node: HTMLElement | null): HTMLElement | null {
  const root = node?.closest(".nav-layer__body")
  return root instanceof HTMLElement ? root : null
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function TransactionsScreen({
  initialFilters,
}: {
  initialFilters?: ActivityFilterSelection
} = {}) {
  const { push } = useNavigationStack()
  const snackbar = useSnackbar()
  const openTransactionDetail = useOpenTransactionDetail()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [applied, setApplied] = useState(initialFilters ?? EMPTY_ACTIVITY_FILTERS)
  const [page, setPage] = useState({ key: "", count: PAGE_SIZE })
  const [loadingPage, setLoadingPage] = useState(false)
  const [searchAttempt, setSearchAttempt] = useState(0)
  const [filterAttempt, setFilterAttempt] = useState(0)
  const [filterSettling, setFilterSettling] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const endNoticeSent = useRef(false)
  const userScrolled = useRef(false)
  const previousQuery = useRef("")
  const settleTimer = useRef<number | null>(null)
  const programScrollActive = useRef(false)
  const programScrollCleanup = useRef<(() => void) | null>(null)
  const enterBatchRef = useRef<{ key: string; count: number } | null>(null)
  const [enterBatch, setEnterBatch] = useState<{ key: string; count: number } | null>(
    null,
  )

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
  const appliedKey = selectionKey(applied)

  const loaded = useMemo(() => {
    void filterAttempt
    return loadFilteredTransactions(allItems, applied, now)
  }, [allItems, applied, filterAttempt, now])

  const search = useMemo(() => {
    void searchAttempt
    if (loaded.status !== "results") return { status: "idle" as const, items: [] }
    return applyActivitySearch(loaded.items, debouncedQuery)
  }, [debouncedQuery, loaded, searchAttempt])

  const chips = appliedChips(applied)
  const filtersActive = badgeCount(applied) > 0
  const searchSettling =
    query.trim().length >= 3 && query.trim() !== debouncedQuery.trim()
  const waiting = filterSettling || searchSettling
  const filterFailed = loaded.status === "error"
  const filterEmpty = filtersActive && loaded.status === "empty"
  const listKey = `${appliedKey}::${debouncedQuery}`
  const visibleCount = page.key === listKey ? page.count : PAGE_SIZE
  const visibleItems = search.items.slice(0, visibleCount)
  const hasMore = visibleCount < search.items.length
  const showList =
    !waiting &&
    !filterFailed &&
    !filterEmpty &&
    search.status !== "empty" &&
    search.status !== "error"

  useEffect(() => {
    return () => {
      if (settleTimer.current != null) window.clearTimeout(settleTimer.current)
      programScrollCleanup.current?.()
    }
  }, [])

  const scrollListToTop = () => {
    const root = scrollPort(rootRef.current)
    if (!root) return
    programScrollCleanup.current?.()
    const smooth = !prefersReducedMotion()
    if (!smooth || root.scrollTop === 0) {
      programScrollActive.current = false
      root.scrollTo({ top: 0 })
      return
    }
    programScrollActive.current = true
    const finish = () => {
      programScrollActive.current = false
      root.removeEventListener("scrollend", finish)
      root.removeEventListener("scroll", onScroll)
      programScrollCleanup.current = null
    }
    const onScroll = () => {
      if (root.scrollTop === 0) finish()
    }
    root.addEventListener("scrollend", finish)
    root.addEventListener("scroll", onScroll, { passive: true })
    programScrollCleanup.current = finish
    root.scrollTo({ top: 0, behavior: "smooth" })
  }

  const beginFilteredLoad = () => {
    setFilterSettling(true)
    endNoticeSent.current = false
    userScrolled.current = false
    scrollListToTop()
    if (settleTimer.current != null) window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => {
      settleTimer.current = null
      setFilterSettling(false)
    }, NEXT_PAGE_MS)
  }

  const applySelection = (next: ActivityFilterSelection) => {
    setApplied(next)
    beginFilteredLoad()
  }

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (previousQuery.current.length > 0 && trimmed.length === 0) {
      scrollListToTop()
    }
    previousQuery.current = trimmed
    endNoticeSent.current = false
    userScrolled.current = false
  }, [debouncedQuery])

  useLayoutEffect(() => {
    if (waiting) {
      enterBatchRef.current = null
      return
    }
    if (!showList) return
    if (enterBatchRef.current?.key === listKey) return
    const batch = { key: listKey, count: visibleCount }
    enterBatchRef.current = batch
    setEnterBatch(batch)
  }, [waiting, showList, listKey, visibleCount])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || loadingPage || waiting || !showList) return
    const root = scrollPort(rootRef.current)
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (programScrollActive.current) return
        if (!entries.some((entry) => entry.isIntersecting)) return
        setLoadingPage(true)
        window.setTimeout(() => {
          setPage((current) => {
            const count = current.key === listKey ? current.count : PAGE_SIZE
            return { key: listKey, count: count + PAGE_SIZE }
          })
          setLoadingPage(false)
        }, NEXT_PAGE_MS)
      },
      { root },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, listKey, loadingPage, showList, waiting])

  useEffect(() => {
    if (hasMore || !showList || search.items.length === 0) return
    const root = scrollPort(rootRef.current)
    if (!root) return

    const onScroll = () => {
      if (programScrollActive.current) return
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
    const map = new Map<string, Transaction[]>()
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

  /** First five rows stagger; later rows in the enter batch share the fifth delay. Pagination skips this. */
  const enterStagger = useMemo(() => {
    if (!enterBatch || enterBatch.key !== listKey) return null
    const delays = new Map<string, number>()
    let index = 0
    for (const group of groups) {
      for (const tx of group.transactions) {
        if (index >= enterBatch.count) return delays
        delays.set(tx.id, Math.min(index, 4))
        index += 1
      }
    }
    return delays
  }, [enterBatch, groups, listKey])

  const openFilters = () => {
    const current = applied
    push({
      key: "activity-filters",
      render: () => <ActivityFiltersScreen applied={current} onApply={applySelection} />,
    })
  }

  const retryFilters = () => {
    setFilterAttempt((attempt) => attempt + 1)
    beginFilteredLoad()
  }

  const count = badgeCount(applied)
  const filtering = search.status === "results" || search.status === "empty"

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
          onClick={openFilters}
          className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-neutral-secondary text-primary"
          aria-label={count > 0 ? `Filters, ${count} applied` : "Filters"}
        >
          <Filters size="lg" aria-hidden />
          {count > 0 ? (
            <span
              className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-positive-primary text-static-key-light"
              aria-hidden
            >
              {count}
            </span>
          ) : null}
        </button>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-3 px-6 pb-2 pt-6">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              aria-label={`Remove ${chip.label}`}
              onClick={() => applySelection(removeAppliedChip(applied, chip))}
              className="inline-flex min-h-7 items-center gap-1 rounded-badge bg-positive-secondary px-1.5 py-1"
            >
              <span className="px-0.5" aria-hidden>
                <Typography variant="body-s-accent" color="positive-primary" as="span">
                  {chip.label}
                </Typography>
              </span>
              <Clear size="sm" className="text-positive-primary" aria-hidden />
            </button>
          ))}
        </div>
      ) : null}

      {filtersActive && showList ? <ActivitySummary items={search.items} /> : null}

      {waiting ? <TransactionSearchSkeleton /> : null}

      {!waiting && filterEmpty ? (
        <ActivitySearchStatus
          imageSrc={longDocument}
          title="No matching activity"
          body="Try changing or removing your filters to see more activity"
        />
      ) : null}

      {!waiting && filterFailed ? (
        <ActivitySearchStatus
          imageSrc={spilledMug}
          title="Couldn't load activity"
          body="We couldn't load activity with these filters. Try again"
          action={<ActivitySearchRetryButton onRetry={retryFilters} />}
        />
      ) : null}

      {!waiting && !filterEmpty && !filterFailed && search.status === "empty" ? (
        <ActivitySearchStatus
          imageSrc={longDocument}
          title="We couldn't find a match"
          body="Try searching with a different name, amount, or reference"
        />
      ) : null}

      {!waiting && !filterFailed && search.status === "error" ? (
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
                {group.transactions.map((tx, index) => {
                  const staggerI = enterStagger?.get(tx.id)
                  return (
                    <li
                      key={tx.id}
                      className={staggerI != null ? "activity-row-enter" : undefined}
                      style={
                        staggerI != null
                          ? ({ "--stagger-i": staggerI } as CSSProperties)
                          : undefined
                      }
                    >
                      <TransactionRow
                        transaction={tx}
                        separator={index < group.transactions.length - 1}
                        searchQuery={filtering ? debouncedQuery : undefined}
                        onSelect={openTransactionDetail}
                      />
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        : null}

      {loadingPage && showList ? <TransactionSearchSkeleton label="Loading more activity" /> : null}
      {showList && search.items.length > 0 ? (
        <div ref={sentinelRef} className={hasMore ? "h-8" : "h-24"} aria-hidden />
      ) : null}
    </div>
  )
}

function ActivitySummary({ items }: { items: Transaction[] }) {
  const flow = summaryFlowCents(items)
  const zero = flow.in === 0 && flow.out === 0
  return (
    <div className="flex flex-col px-6 py-2">
      <Typography variant="body-m-accent" color="primary" as="p">
        {formatResultCount(items.length)}
      </Typography>
      <div className="pt-1">
        {zero ? (
          <Typography variant="body-m-regular" color="primary" as="p">
            {formatSummaryTotal(0).text}
          </Typography>
        ) : (
          <div className="flex items-center gap-4">
            {flow.in > 0 ? (
              <span className="inline-flex items-center gap-1">
                <ArrowCircleRightDown size="sm" className="text-positive-primary" aria-hidden />
                <Typography variant="body-m-regular" color="primary" as="p">
                  +{formatTransactionListEurFromCents(flow.in)}
                </Typography>
              </span>
            ) : null}
            {flow.out > 0 ? (
              <span className="inline-flex items-center gap-1">
                <ArrowCircleRightUp size="sm" className="text-danger-primary" aria-hidden />
                <Typography variant="body-m-regular" color="primary" as="p">
                  -{formatTransactionListEurFromCents(flow.out)}
                </Typography>
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
