import type { Transaction } from "../data/mockTransactions"
import type { TransactionKind } from "../data/mccThemes"
import { merchantTitle } from "./merchantTitle"

const MIN_QUERY_LENGTH = 3

const TYPE_LABEL: Record<TransactionKind, string> = {
  purchase: "Card payment",
  authorization: "Card payment",
  refund: "Refund",
  reversal: "Reversal",
  declined: "Declined",
  failed: "Failed",
  atm: "ATM",
  transfer_in: "Transfer",
  transfer_out: "Transfer",
  ride_payout: "Ride payout",
}

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

function nameMatches(title: string, normalizedQuery: string, stripDiacritics: boolean): boolean {
  const normalized = normalizeForMatch(title, stripDiacritics)
  const words = normalized.split(/\s+/).filter(Boolean)
  return words.some((_, index) => words.slice(index).join(" ").startsWith(normalizedQuery))
}

function amountSign(kind: TransactionKind): -1 | 1 | 0 {
  if (kind === "declined" || kind === "failed" || kind === "reversal") return 0
  if (kind === "ride_payout" || kind === "refund" || kind === "transfer_in") return 1
  return -1
}

function parseAmountQuery(query: string): { euros: number; sign: -1 | 1 | 0 } | null {
  const compact = query.replace(/\s+/g, "")
  const match = /^([+-])?€?(\d+(?:[.,]\d{1,2})?)€?$/.exec(compact)
  if (!match?.[2]) return null
  const euros = Number(match[2].replace(",", "."))
  if (!Number.isFinite(euros)) return null
  const sign = match[1] === "-" ? -1 : match[1] === "+" ? 1 : 0
  return { euros, sign }
}

function amountMatches(transaction: Transaction, query: string): boolean {
  if (transaction.amountCents == null) return false
  const parsed = parseAmountQuery(query)
  if (!parsed) return false
  const euros = Math.abs(transaction.amountCents) / 100
  if (Math.abs(euros - parsed.euros) > 0.001) return false
  if (parsed.sign === 0) return true
  return parsed.sign === amountSign(transaction.kind)
}

export function searchTransactions(
  transactions: Transaction[],
  query: string,
): Transaction[] {
  const trimmed = query.trim()
  if (!trimmed) return transactions

  const stripDiacritics = !queryHasDiacritics(trimmed)
  const normalizedQuery = normalizeForMatch(trimmed, stripDiacritics)

  return transactions.filter((transaction) => {
    const names = [merchantTitle(transaction), transaction.recipientName, transaction.senderName]
    if (names.some((name) => name && nameMatches(name, normalizedQuery, stripDiacritics))) {
      return true
    }
    if (amountMatches(transaction, trimmed)) return true
    if (
      transaction.reference &&
      normalizeForMatch(transaction.reference, stripDiacritics).includes(normalizedQuery)
    ) {
      return true
    }
    if (normalizeForMatch(TYPE_LABEL[transaction.kind], stripDiacritics).includes(normalizedQuery)) {
      return true
    }
    return (
      transaction.transferId != null &&
      normalizeForMatch(transaction.transferId, stripDiacritics) === normalizedQuery
    )
  })
}

export type ActivitySearchStatus = "idle" | "results" | "empty" | "error"

export function applyActivitySearch(
  transactions: Transaction[],
  query: string,
  filter: (transactions: Transaction[], query: string) => Transaction[] = searchTransactions,
): { status: ActivitySearchStatus; items: Transaction[] } {
  if (query.trim().length < MIN_QUERY_LENGTH) {
    return { status: "idle", items: transactions }
  }
  try {
    const items = filter(transactions, query)
    return { status: items.length === 0 ? "empty" : "results", items }
  } catch {
    return { status: "error", items: [] }
  }
}
