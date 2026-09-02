const PARTICLES = new Set(["de", "van", "von", "del", "da", "le", "al", "der", "den"])
const LEGAL_PREFIXES = new Set([
  "sia",
  "as",
  "ou",
  "oü",
  "gmbh",
  "ltd",
  "llc",
  "uab",
  "ab",
])

function isAllCaps(value: string): boolean {
  const letters = value.replace(/[^A-Za-zÀ-ž]/g, "")
  return letters.length > 0 && letters === letters.toUpperCase()
}

function titleCaseToken(token: string): string {
  if (!token) return token
  if (/^[\dA-Z]{1,3}$/.test(token)) {
    return token
  }

  const parts = token.split("-")
  return parts
    .map((part) => {
      if (!part) return part
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })
    .join("-")
}

export function formatRecipientDisplayName(rawName: string): string {
  const trimmed = rawName.trim().replace(/\s+/g, " ")
  if (!trimmed) return trimmed

  if (isAllCaps(trimmed)) {
    return trimmed
      .split(" ")
      .map(titleCaseToken)
      .join(" ")
  }

  return trimmed
      .split(" ")
      .map((token) => {
        const lower = token.toLowerCase()
        if (LEGAL_PREFIXES.has(lower) || PARTICLES.has(lower)) {
          return lower === "oü" ? "OÜ" : lower.toUpperCase() === lower ? lower : titleCaseToken(token)
        }
        return titleCaseToken(token)
      })
      .join(" ")
}

/** Long names: full first name, surname abbreviated to initial + period */
export function formatRecipientListName(rawName: string): string {
  const displayName = formatRecipientDisplayName(rawName)
  const tokens = displayName.split(/\s+/).filter(Boolean)
  if (tokens.length <= 3) {
    return displayName
  }

  const first = tokens[0]!
  const last = tokens[tokens.length - 1]!
  return `${first} ${last.charAt(0)}.`
}
