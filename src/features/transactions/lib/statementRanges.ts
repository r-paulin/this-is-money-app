import { MONTHS_SHORT } from "./formatTransactionDate"

export type StatementRangeId =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "custom"

export type StatementFileFormat = "pdf" | "csv"

export interface StatementRangeOption {
  id: StatementRangeId
  label: string
  /** Secondary subtitle; omitted for custom until dates are shown separately */
  subtitle?: string
  start: Date
  end: Date
}

export interface StatementFileFormatOption {
  id: StatementFileFormat
  label: string
}

export const STATEMENT_FILE_FORMAT_OPTIONS: StatementFileFormatOption[] = [
  { id: "pdf", label: "PDF" },
  { id: "csv", label: "CSV" },
]


const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

function formatDayMonthLong(d: Date): string {
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`
}

function formatDayMonthYear(d: Date): string {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

function formatMonthYearLong(d: Date): string {
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`
}

/** Build radio options from device “now”. Order matches Figma 6875:54184. */
export function buildStatementRangeOptions(now = new Date()): StatementRangeOption[] {
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthSubtitle =
    now.getDate() === 1
      ? formatDayMonthLong(now)
      : `${formatDayMonthLong(thisMonthStart)}–${formatDayMonthLong(now)}`

  const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthStart = new Date(lastMonthRef.getFullYear(), lastMonthRef.getMonth(), 1)
  const lastMonthEnd = endOfDay(
    new Date(lastMonthRef.getFullYear(), lastMonthRef.getMonth() + 1, 0),
  )

  // Current month + previous two calendar months (e.g. May–July when now is mid-July)
  const last3Start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
  const last3Subtitle =
    last3Start.getFullYear() === now.getFullYear()
      ? `${MONTHS_LONG[last3Start.getMonth()]}–${MONTHS_LONG[now.getMonth()]} ${now.getFullYear()}`
      : `${MONTHS_LONG[last3Start.getMonth()]} ${last3Start.getFullYear()}–${MONTHS_LONG[now.getMonth()]} ${now.getFullYear()}`

  return [
    {
      id: "this_month",
      label: "This month",
      subtitle: thisMonthSubtitle,
      start: thisMonthStart,
      end: todayEnd,
    },
    {
      id: "last_month",
      label: "Last month",
      subtitle: formatMonthYearLong(lastMonthRef),
      start: lastMonthStart,
      end: lastMonthEnd,
    },
    {
      id: "last_3_months",
      label: "Last 3 months",
      subtitle: last3Subtitle,
      start: last3Start,
      end: todayEnd,
    },
    {
      id: "custom",
      label: "Custom range",
      start: todayStart,
      end: todayEnd,
    },
  ]
}

export function toDateInputValue(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function parseDateInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

/** Figma date chip: “16 June 2026” (full month, no comma). */
export function formatCustomRangeChip(d: Date): string {
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`
}

export function clampDateToMax(date: Date, max: Date): Date {
  const day = startOfDay(date)
  const maxDay = startOfDay(max)
  return day.getTime() > maxDay.getTime() ? maxDay : day
}

export { formatDayMonthYear, startOfDay, endOfDay }
