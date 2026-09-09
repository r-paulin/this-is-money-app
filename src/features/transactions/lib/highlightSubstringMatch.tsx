import type { ReactNode } from "react"

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

function findSubstringMatchRange(
  text: string,
  query: string,
  stripDiacritics: boolean,
): { start: number; end: number } | null {
  const normalizedQuery = normalizeForMatch(query.trim(), stripDiacritics)
  if (!normalizedQuery) return null

  let normalized = ""
  const indexMap: number[] = []

  for (let index = 0; index < text.length; index += 1) {
    const charNorm = normalizeForMatch(text[index]!, stripDiacritics)
    for (let charIndex = 0; charIndex < charNorm.length; charIndex += 1) {
      normalized += charNorm[charIndex]
      indexMap.push(index)
    }
  }

  const matchIndex = normalized.indexOf(normalizedQuery)
  if (matchIndex < 0) return null

  const start = indexMap[matchIndex]!
  const end = indexMap[matchIndex + normalizedQuery.length - 1]! + 1
  return { start, end }
}

export function highlightSubstringMatch(text: string, query: string): ReactNode {
  const stripDiacritics = !queryHasDiacritics(query)
  const range = findSubstringMatchRange(text, query, stripDiacritics)

  if (!range) {
    return <span className="text-primary">{text}</span>
  }

  const { start, end } = range
  const before = text.slice(0, start)
  const match = text.slice(start, end)
  const after = text.slice(end)

  return (
    <>
      {before ? <span className="text-secondary">{before}</span> : null}
      <span className="text-primary">{match}</span>
      {after ? <span className="text-secondary">{after}</span> : null}
    </>
  )
}
