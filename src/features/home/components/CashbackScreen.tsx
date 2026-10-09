import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import { useMemo } from "react"
import { SectionHeader } from "@/shared/components/SectionHeader"
import {
  useAfterNavigationTransition,
  useNavigationStack,
} from "@/shared/navigation"
import { TransactionCategoryIcon } from "@/features/transactions/components/TransactionCategoryIcon"
import {
  formatSignedTransactionAmount,
  formatTransactionListEurFromCents,
} from "@/features/transactions/lib/formatTransactionAmount"
import {
  formatTransactionTimestamp,
  groupKeyForTransaction,
  isSameLocalDay,
  MONTHS_SHORT,
} from "@/features/transactions/lib/formatTransactionDate"
import {
  buildMockCashbackEarnings,
  CASHBACK_TOTAL_CENTS,
  type CashbackEarning,
} from "../data/mockCashbackEarnings"
import { CashbackHeroVideo } from "./CashbackHeroVideo"

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

/** Figma Cashback / Earned — “Today” or “Fri, 4 Sep”. */
function formatCashbackSectionLabel(occurredAt: number, now = new Date()): string {
  const date = new Date(occurredAt)
  if (isSameLocalDay(date, now)) return "Today"
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

function CashbackRow({
  earning,
  separator,
}: {
  earning: CashbackEarning
  separator: boolean
}) {
  const amount = formatSignedTransactionAmount({
    amountCents: earning.amountCents,
    kind: "refund",
  })
  const time = formatTransactionTimestamp(earning.occurredAt)
  const secondary = `${time} · ${earning.merchant}`

  return (
    <ListItemLayout
      primary="Cashback"
      secondary={secondary}
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      /* Figma list item M vr-padding 8px (8676:87745), not base py-3. */
      paddingTop={2}
      paddingBottom={2}
      primaryTypographyProps={{ variant: "body-m-compact-regular" }}
      secondaryTypographyProps={{ variant: "body-s-regular" }}
      renderStartSlot={() => (
        <div className="self-start">
          <TransactionCategoryIcon
            mcc={0}
            kind="refund"
            themeOverride="cashback"
          />
        </div>
      )}
      renderEndSlot={() => (
        <div className="self-start">
          <Typography
            variant="body-m-compact-regular"
            color="action-primary"
            as="span"
            align="end"
          >
            {amount.text}
          </Typography>
        </div>
      )}
      aria-label={`Cashback, ${secondary}, ${amount.text}`}
    />
  )
}

export function CashbackScreen() {
  const { reducedMotion } = useNavigationStack()
  const screenReady = useAfterNavigationTransition()
  const now = useMemo(() => new Date(), [])
  const earnings = useMemo(() => buildMockCashbackEarnings(now), [now])

  const groups = useMemo(() => {
    const map = new Map<string, CashbackEarning[]>()
    for (const earning of earnings) {
      const key = groupKeyForTransaction(earning.occurredAt, now)
      const list = map.get(key)
      if (list) list.push(earning)
      else map.set(key, [earning])
    }
    return Array.from(map.entries()).map(([key, items]) => ({
      key,
      label: formatCashbackSectionLabel(items[0]!.occurredAt, now),
      items,
    }))
  }, [earnings, now])

  const totalLabel = formatTransactionListEurFromCents(CASHBACK_TOTAL_CENTS)

  return (
    <div className="min-h-[calc(var(--app-h)-var(--app-navbar-offset))] bg-layer-floor-1 pb-10">
      {/* Figma: video flush under WebViewTop; text py-12 gap-4; list follows. */}
      <div className="flex flex-col items-center px-6">
        <CashbackHeroVideo play={screenReady} reducedMotion={reducedMotion} />
        <div className="flex w-full flex-col gap-1 py-3 text-center">
          <Typography variant="heading-l-accent" color="primary" as="p" align="center">
            {totalLabel}
          </Typography>
          <Typography variant="body-m-regular" color="secondary" as="p" align="center">
            Total cashback earned
          </Typography>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.key} aria-label={group.label}>
          <SectionHeader paddingTop={20} paddingBottom={8}>
            {group.label}
          </SectionHeader>
          <ul className="m-0 list-none p-0">
            {group.items.map((earning, index) => (
              <li key={earning.id}>
                <CashbackRow
                  earning={earning}
                  separator={index < group.items.length - 1}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
