import { MONTHS_SHORT } from "./formatTransactionDate"

/** Detail screens — day-first, 24h: `12 Sep 2026, 15:00`. */
export function formatTransactionDetailDate(occurredAt: number): string {
  const date = new Date(occurredAt)
  const day = date.getDate()
  const month = MONTHS_SHORT[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}
