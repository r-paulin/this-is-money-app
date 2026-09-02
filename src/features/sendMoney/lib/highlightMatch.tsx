import type { ReactNode } from "react"
import { formatRecipientDisplayName } from "./formatRecipientName"

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

function getWords(name: string): string[] {
  return formatRecipientDisplayName(name).split(/\s+/).filter(Boolean)
}

export function getNameMatchTier(
  rawName: string,
  query: string,
  stripDiacritics: boolean,
): number | null {
  const normalizedQuery = normalizeForMatch(query, stripDiacritics)
  if (!normalizedQuery) return null

  const words = getWords(rawName)
  if (words.length === 0) return null

  const firstWord = normalizeForMatch(words[0]!, stripDiacritics)
  if (firstWord.startsWith(normalizedQuery)) {
    return 1
  }

  for (let index = 1; index < words.length; index += 1) {
    const word = normalizeForMatch(words[index]!, stripDiacritics)
    if (word.startsWith(normalizedQuery)) {
      return 2
    }
  }

  return null
}

function findMatchedPrefixLength(
  word: string,
  query: string,
  stripDiacritics: boolean,
): number {
  const normalizedWord = normalizeForMatch(word, stripDiacritics)
  const normalizedQuery = normalizeForMatch(query, stripDiacritics)
  if (!normalizedQuery || !normalizedWord.startsWith(normalizedQuery)) {
    return 0
  }

  let normalizedCount = 0
  for (let index = 0; index < word.length; index += 1) {
    normalizedCount += normalizeForMatch(word[index]!, stripDiacritics).length
    if (normalizedCount >= normalizedQuery.length) {
      return index + 1
    }
  }

  return word.length
}

export function highlightNameMatch(
  rawName: string,
  query: string,
): ReactNode {
  const displayName = formatRecipientDisplayName(rawName)
  const stripDiacritics = !queryHasDiacritics(query)
  const normalizedQuery = normalizeForMatch(query, stripDiacritics)

  if (!normalizedQuery) {
    return displayName
  }

  const words = displayName.split(/(\s+)/)
  const nodes: ReactNode[] = []
  let matched = false

  for (const segment of words) {
    if (/^\s+$/.test(segment)) {
      nodes.push(segment)
      continue
    }

    const matchLength = findMatchedPrefixLength(segment, query, stripDiacritics)
    if (!matched && matchLength > 0) {
      const matchText = segment.slice(0, matchLength)
      const restText = segment.slice(matchLength)
      nodes.push(
        <span key={`${segment}-match`}>
          <span className="font-semibold text-primary">{matchText}</span>
          {restText ? <span className="text-secondary">{restText}</span> : null}
        </span>,
      )
      matched = true
      continue
    }

    nodes.push(
      <span key={segment} className="text-secondary">
        {segment}
      </span>,
    )
  }

  if (!matched) {
    return <span className="text-primary">{displayName}</span>
  }

  return <>{nodes}</>
}
