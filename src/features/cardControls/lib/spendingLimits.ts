import type { CardType } from "../../home/home.types"
import { formatTransactionListEurFromCents } from "../../transactions/lib/formatTransactionAmount"

/** Figma Error note — per-transaction ceiling. */
export const MAX_PER_TRANSACTION_CENTS = 300_000
/** Mock ceiling for monthly edit validation. */
export const MAX_MONTHLY_LIMIT_CENTS = 5_000_000

/** Available today at or below this (and > 0) is “daily limit low”. */
export const DAILY_LOW_THRESHOLD_CENTS = 5_000

export type SpendingLimitsState = {
  perTransactionCents: number
  dailyLimitCents: number
  monthlyLimitCents: number
  spentTodayCents: number
  spentThisMonthCents: number
  /** Unix ms when daily limit resets. */
  dailyResetsAt: number
  /** Unix ms when monthly limit resets. */
  monthlyResetsAt: number
}

export type LimitFieldId = "perTransaction" | "monthly"

export type SpendingWarningKind = "daily_low" | "daily_reached" | "monthly_reached"

export type SpendingLimitsView = {
  state: SpendingLimitsState
  availableTodayCents: number
  availableThisMonthCents: number
  ringRatio: number
  warning: SpendingWarningKind | null
}

const INTRO =
  "The limit determines how much you can spend with this card. Limits don't affect other cards or your available balance."

export const SPENDING_LIMITS_INTRO = INTRO
export const CHANGE_LIMITS_SUBTITLE = "Set limits per transaction and month"
export const SPENDING_LIMITS_UPDATED = "Spending limits updated"

/** Effective-at line for Change limits helper (date + time, en-GB). */
export function formatLimitEffectiveAt(at: number): string {
  const date = new Date(at)
  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  return `${datePart}, ${timePart}`
}

export function changeLimitsHelper(effectiveAt: number): string {
  return `You can spend up to your transaction limit on each card payment or transfer. Your new monthly limit takes effect at ${formatLimitEffectiveAt(effectiveAt)} local time.`
}

/** Figma Default mock relative to `now`. */
export function buildDefaultSpendingLimits(now = new Date()): SpendingLimitsState {
  const endOfDay = new Date(now)
  endOfDay.setHours(24, 0, 0, 0)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return {
    perTransactionCents: 300_000,
    dailyLimitCents: 300_000,
    monthlyLimitCents: 1_500_000,
    spentTodayCents: 30_000,
    spentThisMonthCents: 10_000,
    dailyResetsAt: endOfDay.getTime(),
    monthlyResetsAt: nextMonth.getTime(),
  }
}

export function availableThisMonthCents(state: SpendingLimitsState): number {
  return Math.max(0, state.monthlyLimitCents - state.spentThisMonthCents)
}

export function availableTodayCents(state: SpendingLimitsState): number {
  const dailyLeft = Math.max(0, state.dailyLimitCents - state.spentTodayCents)
  return Math.min(dailyLeft, availableThisMonthCents(state))
}

export function ringRatio(state: SpendingLimitsState): number {
  if (state.monthlyLimitCents <= 0) return 0
  return Math.min(1, Math.max(0, state.spentThisMonthCents / state.monthlyLimitCents))
}

export function resolveSpendingWarning(
  state: SpendingLimitsState,
): SpendingWarningKind | null {
  const monthLeft = availableThisMonthCents(state)
  if (monthLeft <= 0) return "monthly_reached"
  const dayLeft = availableTodayCents(state)
  if (dayLeft <= 0) return "daily_reached"
  if (dayLeft <= DAILY_LOW_THRESHOLD_CENTS) return "daily_low"
  return null
}

export function buildSpendingLimitsView(state: SpendingLimitsState): SpendingLimitsView {
  return {
    state,
    availableTodayCents: availableTodayCents(state),
    availableThisMonthCents: availableThisMonthCents(state),
    ringRatio: ringRatio(state),
    warning: resolveSpendingWarning(state),
  }
}

export function maxCentsForField(field: LimitFieldId): number {
  switch (field) {
    case "perTransaction":
      return MAX_PER_TRANSACTION_CENTS
    case "monthly":
      return MAX_MONTHLY_LIMIT_CENTS
  }
}

export function validateLimitCents(
  field: LimitFieldId,
  cents: number,
): string | null {
  if (!Number.isFinite(cents) || cents < 0) {
    return "Enter a valid amount"
  }
  const max = maxCentsForField(field)
  if (cents > max) {
    return `Enter an amount of ${formatTransactionListEurFromCents(max)} or less`
  }
  return null
}

/** Apply edited caps; spent totals and daily limit are preserved (below-spent → €0 available). */
export function applyLimitEdits(
  current: SpendingLimitsState,
  edits: {
    perTransactionCents: number
    monthlyLimitCents: number
  },
): SpendingLimitsState {
  return {
    ...current,
    perTransactionCents: edits.perTransactionCents,
    monthlyLimitCents: edits.monthlyLimitCents,
  }
}

export function formatDailyResetCountdown(
  resetsAt: number,
  now = Date.now(),
): string {
  const ms = Math.max(0, resetsAt - now)
  const totalMinutes = Math.floor(ms / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours} hr ${minutes} min`
  return `${minutes} min`
}

export function formatMonthlyResetDate(resetsAt: number): string {
  const date = new Date(resetsAt)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Hub secondary under Spending limits row. */
export function spendingLimitsHubSecondary(
  view: SpendingLimitsView,
): string | undefined {
  switch (view.warning) {
    case "daily_low":
      return `Available today: ${formatTransactionListEurFromCents(view.availableTodayCents)}`
    case "daily_reached":
      return "Daily limit reached"
    case "monthly_reached":
      return "Monthly limit reached"
    default:
      return undefined
  }
}

/** Home / Card Controls warning banner copy. */
export function spendingWarningCopy(
  view: SpendingLimitsView,
  now = Date.now(),
): { accent: string; body: string } | null {
  switch (view.warning) {
    case "daily_low":
      return {
        accent: `${formatTransactionListEurFromCents(view.availableTodayCents)} left to spend today`,
        body: ` Your daily limit resets in ${formatDailyResetCountdown(view.state.dailyResetsAt, now)}`,
      }
    case "daily_reached":
      return {
        accent: "Daily limit reached",
        body: ` You can use your card again when your limit resets in ${formatDailyResetCountdown(view.state.dailyResetsAt, now)}.`,
      }
    case "monthly_reached":
      return {
        accent: "Monthly limit reached",
        body: ` You can use your card again when your limit resets in ${formatMonthlyResetDate(view.state.monthlyResetsAt)}.`,
      }
    default:
      return null
  }
}

export function parseEurInputToCents(raw: string): number | null {
  const digits = raw.replace(/[^\d.,]/g, "")
  if (digits.length === 0) return null
  // Drop thousand separators; keep the last comma/dot as decimal.
  const lastSep = Math.max(digits.lastIndexOf("."), digits.lastIndexOf(","))
  let normalized: string
  if (lastSep >= 0 && digits.length - lastSep <= 3) {
    const whole = digits.slice(0, lastSep).replace(/[.,]/g, "")
    const fraction = digits.slice(lastSep + 1)
    normalized = `${whole}.${fraction}`
  } else {
    normalized = digits.replace(/[.,]/g, "")
  }
  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value) || value < 0) return null
  return Math.round(value * 100)
}

export function formatEurInputFromCents(cents: number): string {
  return (cents / 100).toFixed(2)
}

/** Session store — one snapshot per card type. */
const store = new Map<CardType, SpendingLimitsState>()

export function getSpendingLimits(cardType: CardType, now = new Date()): SpendingLimitsState {
  const existing = store.get(cardType)
  if (existing) return existing
  const seeded = buildDefaultSpendingLimits(now)
  store.set(cardType, seeded)
  return seeded
}

export function setSpendingLimits(cardType: CardType, state: SpendingLimitsState): void {
  store.set(cardType, state)
}

/** Test helper — clear session store. */
export function resetSpendingLimitsStore(): void {
  store.clear()
}
