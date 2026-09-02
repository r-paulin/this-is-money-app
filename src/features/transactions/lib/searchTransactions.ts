import type { Transaction } from "../data/mockTransactions"
import { merchantTitle } from "./merchantTitle"

function queryHasDiacritics(query: string): boolean {
  return /\p{M}/u.test(query.normalize("NFD"))
}

function normalizeForMatch(value: string, stripDiacritics: boolean): string {
  let result = value.toLowerCase()
  if (stripDiacritics) {
    result = result.normalize("NFD").replace(/\p{M}/gu, "")
  }
  return result
}

export function searchTransactions(
  transactions: Transaction[],
  query: string,
): Transaction[] {
  const trimmed = query.trim()
  if (!trimmed) {
    return transactions
  }

  const stripDiacritics = !queryHasDiacritics(trimmed)
  const normalizedQuery = normalizeForMatch(trimmed, stripDiacritics)

  return transactions.filter((transaction) => {
    const title = merchantTitle(transaction)
    const normalizedTitle = normalizeForMatch(title, stripDiacritics)
    return normalizedTitle.includes(normalizedQuery)
  })
}
