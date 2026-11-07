import type { Transaction } from "../data/mockTransactions"
import type { TransactionKind } from "../data/mccThemes"
import { MONTHS_SHORT } from "./formatTransactionDate"
import { formatTransactionListEurFromCents } from "./formatTransactionAmount"

export const ACTIVITY_TYPES = [
  "payouts",
  "transfers",
  "card_payments",
  "refunds",
  "reversals",
  "cashback",
  "fees",
] as const

export type ActivityTypeId = (typeof ACTIVITY_TYPES)[number]

export const DATE_PRESETS = ["all", "this_week", "this_month", "last_month", "custom"] as const

export type DatePresetId = (typeof DATE_PRESETS)[number]

export const MONEY_FLOWS = ["all", "in", "out"] as const

export type MoneyFlowId = (typeof MONEY_FLOWS)[number]

export type ActivityFilterSelection = {
  date: DatePresetId
  customStart: Date | null
  customEnd: Date | null
  moneyFlow: MoneyFlowId
  /** Empty means All. */
  types: ActivityTypeId[]
}

export const EMPTY_ACTIVITY_FILTERS: ActivityFilterSelection = {
  date: "all",
  customStart: null,
  customEnd: null,
  moneyFlow: "all",
  types: [],
}

export const RANGE_ERROR = "End date must be on or after the start date"

export const ACTIVITY_TYPE_LABEL: Record<ActivityTypeId, string> = {
  payouts: "Payouts",
  transfers: "Transfers",
  card_payments: "Card payments",
  refunds: "Refunds",
  reversals: "Reversals",
  cashback: "Cashback",
  fees: "Fees",
}

const DATE_LABEL = {
  this_week: "This week",
  this_month: "This month",
  last_month: "Last month",
} as const

/** Types that can add to the balance. Reversals never do. */
const ADDS = new Set<ActivityTypeId>(["payouts", "transfers", "refunds", "cashback"])
/** Types that can take from the balance. */
const TAKES = new Set<ActivityTypeId>(["transfers", "card_payments", "fees"])

const DAY_MS = 86_400_000

export type AppliedChip =
  | { id: "date"; label: string; group: "date" }
  | { id: "flow"; label: string; group: "flow" }
  | { id: `type:${ActivityTypeId}`; label: string; group: "type"; type: ActivityTypeId }

export type SummaryDirection = "in" | "out" | "none"

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function inclusiveDayCount(start: Date, end: Date): number {
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime()
  return Math.round(ms / DAY_MS) + 1
}

function activityTypeForKind(kind: TransactionKind): ActivityTypeId {
  switch (kind) {
    case "ride_payout":
      return "payouts"
    case "transfer_in":
    case "transfer_out":
      return "transfers"
    case "refund":
      return "refunds"
    case "reversal":
      return "reversals"
    case "cashback":
      return "cashback"
    case "fee":
      return "fees"
    case "purchase":
    case "authorization":
    case "atm":
    case "declined":
    case "failed":
      return "card_payments"
  }
}

function isPendingRefund(transaction: Transaction): boolean {
  return transaction.kind === "refund" && transaction.paymentStatus === "pending"
}

/** Whether the row changes the balance. Pending refunds, declines, failures, reversals, and missing amounts do not. */
function balanceDeltaCents(transaction: Transaction): number {
  if (transaction.amountCents == null) return 0
  if (
    transaction.kind === "declined" ||
    transaction.kind === "failed" ||
    transaction.kind === "reversal" ||
    isPendingRefund(transaction)
  ) {
    return 0
  }
  const amount = Math.abs(transaction.amountCents)
  if (
    transaction.kind === "ride_payout" ||
    transaction.kind === "refund" ||
    transaction.kind === "transfer_in" ||
    transaction.kind === "cashback"
  ) {
    return amount
  }
  return -amount
}

/** Directed-flow membership. A pending refund is listed under Money in but does not change the total. */
function matchesMoneyFlow(transaction: Transaction, flow: MoneyFlowId): boolean {
  if (flow === "all") return true
  if (isPendingRefund(transaction)) return flow === "in"
  const delta = balanceDeltaCents(transaction)
  if (delta === 0) return false
  return flow === "in" ? delta > 0 : delta < 0
}

export function enabledActivityTypes(flow: MoneyFlowId): ReadonlySet<ActivityTypeId> {
  if (flow === "in") return ADDS
  if (flow === "out") return TAKES
  return new Set(ACTIVITY_TYPES)
}

export function isActivityTypeQuiet(flow: MoneyFlowId, type: ActivityTypeId): boolean {
  return !enabledActivityTypes(flow).has(type)
}

export function selectMoneyFlow(
  selection: ActivityFilterSelection,
  moneyFlow: MoneyFlowId,
): ActivityFilterSelection {
  const enabled = enabledActivityTypes(moneyFlow)
  return {
    ...selection,
    moneyFlow,
    types: selection.types.filter((type) => enabled.has(type)),
  }
}

export function toggleActivityType(
  selection: ActivityFilterSelection,
  type: ActivityTypeId,
): ActivityFilterSelection {
  if (isActivityTypeQuiet(selection.moneyFlow, type)) return selection
  const selected = selection.types.includes(type)
  return {
    ...selection,
    types: selected
      ? selection.types.filter((item) => item !== type)
      : [...selection.types, type],
  }
}

export function customRangeError(start: Date | null, end: Date | null): string | null {
  if (!start || !end) return null
  if (startOfDay(end).getTime() < startOfDay(start).getTime()) return RANGE_ERROR
  return null
}

export function canApplyActivityFilters(selection: ActivityFilterSelection): boolean {
  if (selection.date !== "custom") return true
  if (!selection.customStart || !selection.customEnd) return false
  return customRangeError(selection.customStart, selection.customEnd) == null
}

/** Keep the inclusive length when the start moves and an end is already set. */
export function slideCustomEnd(start: Date, end: Date, nextStart: Date): Date {
  const length = inclusiveDayCount(start, end)
  const next = startOfDay(nextStart)
  next.setDate(next.getDate() + length - 1)
  return next
}

export function dateBounds(
  selection: ActivityFilterSelection,
  now = new Date(),
): { start: number; end: number } | null {
  if (selection.date === "all") return null
  if (selection.date === "this_week") {
    const sunday = startOfDay(now)
    sunday.setDate(sunday.getDate() - sunday.getDay())
    return { start: sunday.getTime(), end: endOfDay(now).getTime() }
  }
  if (selection.date === "this_month") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
      end: endOfDay(now).getTime(),
    }
  }
  if (selection.date === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0))
    return { start: start.getTime(), end: end.getTime() }
  }
  if (!selection.customStart || !selection.customEnd) return null
  if (customRangeError(selection.customStart, selection.customEnd)) return null
  return {
    start: startOfDay(selection.customStart).getTime(),
    end: endOfDay(selection.customEnd).getTime(),
  }
}

function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

export function formatCustomRangeLabel(start: Date, end: Date): string {
  return `${formatDayMonth(start)} - ${formatDayMonth(end)}, ${end.getFullYear()}`
}

export function appliedChips(selection: ActivityFilterSelection): AppliedChip[] {
  const chips: AppliedChip[] = []
  if (
    selection.date === "this_week" ||
    selection.date === "this_month" ||
    selection.date === "last_month"
  ) {
    chips.push({ id: "date", label: DATE_LABEL[selection.date], group: "date" })
  } else if (selection.date === "custom" && selection.customStart && selection.customEnd) {
    if (!customRangeError(selection.customStart, selection.customEnd)) {
      chips.push({
        id: "date",
        label: formatCustomRangeLabel(selection.customStart, selection.customEnd),
        group: "date",
      })
    }
  }
  if (selection.moneyFlow === "in") {
    chips.push({ id: "flow", label: "Money in", group: "flow" })
  } else if (selection.moneyFlow === "out") {
    chips.push({ id: "flow", label: "Money out", group: "flow" })
  }
  for (const type of selection.types) {
    chips.push({
      id: `type:${type}`,
      label: ACTIVITY_TYPE_LABEL[type],
      group: "type",
      type,
    })
  }
  return chips
}

export function badgeCount(selection: ActivityFilterSelection): number {
  return appliedChips(selection).length
}

export function removeAppliedChip(
  selection: ActivityFilterSelection,
  chip: AppliedChip,
): ActivityFilterSelection {
  if (chip.group === "date") {
    return { ...selection, date: "all", customStart: null, customEnd: null }
  }
  if (chip.group === "flow") return selectMoneyFlow(selection, "all")
  return {
    ...selection,
    types: selection.types.filter((type) => type !== chip.type),
  }
}

export function transactionMatchesFilters(
  transaction: Transaction,
  selection: ActivityFilterSelection,
  now = new Date(),
): boolean {
  const bounds = dateBounds(selection, now)
  if (bounds && (transaction.occurredAt < bounds.start || transaction.occurredAt > bounds.end)) {
    return false
  }
  const type = activityTypeForKind(transaction.kind)
  if (selection.types.length > 0 && !selection.types.includes(type)) return false
  return matchesMoneyFlow(transaction, selection.moneyFlow)
}

export function filterTransactions(
  transactions: Transaction[],
  selection: ActivityFilterSelection,
  now = new Date(),
): Transaction[] {
  return transactions.filter((transaction) =>
    transactionMatchesFilters(transaction, selection, now),
  )
}

export function loadFilteredTransactions(
  transactions: Transaction[],
  selection: ActivityFilterSelection,
  now = new Date(),
  run: typeof filterTransactions = filterTransactions,
): { status: "results" | "empty" | "error"; items: Transaction[] } {
  try {
    const items = run(transactions, selection, now)
    return { status: items.length === 0 ? "empty" : "results", items }
  } catch {
    return { status: "error", items: [] }
  }
}

export function summaryTotalCents(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + balanceDeltaCents(transaction), 0)
}

/** Absolute credits and debits for the Activity summary money-flow row (Figma 11473:242466). */
export function summaryFlowCents(transactions: Transaction[]): { in: number; out: number } {
  let inbound = 0
  let outbound = 0
  for (const transaction of transactions) {
    const delta = balanceDeltaCents(transaction)
    if (delta > 0) inbound += delta
    else if (delta < 0) outbound += -delta
  }
  return { in: inbound, out: outbound }
}

export function formatResultCount(count: number): string {
  return count === 1 ? "1 result" : `${count} results`
}

export function formatSummaryTotal(cents: number): {
  text: string
  direction: SummaryDirection
} {
  if (cents === 0) {
    return { text: formatTransactionListEurFromCents(0), direction: "none" }
  }
  const text = formatTransactionListEurFromCents(Math.abs(cents))
  if (cents > 0) return { text: `+${text}`, direction: "in" }
  return { text: `-${text}`, direction: "out" }
}
