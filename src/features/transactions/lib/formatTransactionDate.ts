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

/** Secondary line date/time: “2 Jul, 10:30”. */
export function formatTransactionTimestamp(occurredAt: number): string {
  const date = new Date(occurredAt)
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}, ${hh}:${mm}`
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
