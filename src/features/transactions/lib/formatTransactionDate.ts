const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Section header: “Today” or “1 Jul, 2026”. */
export function formatTransactionSectionLabel(occurredAt: number, now = new Date()): string {
  const date = new Date(occurredAt)
  if (isSameLocalDay(date, now)) {
    return "Today"
  }
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${date.getFullYear()}`
}

const TIMESTAMP_FORMAT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
}

/** Secondary line date/time — locale-aware, e.g. `11 Oct, 16:30` or `Oct 7, 7:05 PM`. */
export function formatTransactionTimestamp(
  occurredAt: number,
  locales?: string | string[],
): string {
  const date = new Date(occurredAt)
  const formatter = new Intl.DateTimeFormat(locales, TIMESTAMP_FORMAT)
  return formatter.format(date)
}

export function groupKeyForTransaction(occurredAt: number, now = new Date()): string {
  const date = new Date(occurredAt)
  if (isSameLocalDay(date, now)) {
    return "today"
  }
  const day = startOfLocalDay(date)
  return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
}

export { isSameLocalDay, MONTHS_SHORT }
