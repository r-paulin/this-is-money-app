import { formatRecipientDisplayName } from "./formatRecipientName"

const HONORIFICS = new Set(["dr", "prof", "mr", "mrs", "ms", "miss"])
const SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv"])
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

function stripEmoji(value: string): string {
  return value.replace(/\p{Extended_Pictographic}/gu, "").trim()
}

function isCjk(char: string): boolean {
  return /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/u.test(char)
}

function isCyrillic(char: string): boolean {
  return /\p{Script=Cyrillic}/u.test(char)
}

function isThai(char: string): boolean {
  return /\p{Script=Thai}/u.test(char)
}

function firstGrapheme(value: string): string {
  return [...value][0] ?? ""
}

function isLegalPrefixToken(token: string): boolean {
  const lower = token.toLowerCase().replace(/\./g, "")
  return LEGAL_PREFIXES.has(lower)
}

function initialFromToken(token: string): string {
  const hyphenParts = token.split("-").filter(Boolean)
  if (hyphenParts.length > 1) {
    return hyphenParts.map((part) => part.charAt(0).toUpperCase()).join("")
  }

  const firstAlpha = token.match(/[\p{L}0-9]/u)?.[0]
  return firstAlpha ? firstAlpha.toUpperCase() : ""
}

function normalizeTokens(rawName: string): string[] {
  const cleaned = stripEmoji(formatRecipientDisplayName(rawName))
  return cleaned
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}0-9-&.]/gu, ""))
    .filter(Boolean)
}

function filterMeaningfulTokens(tokens: string[]): string[] {
  return tokens.filter((token) => {
    const lower = token.toLowerCase().replace(/\./g, "")
    return (
      !HONORIFICS.has(lower) &&
      !SUFFIXES.has(lower) &&
      !PARTICLES.has(lower) &&
      !LEGAL_PREFIXES.has(lower) &&
      !/^\d+$/.test(token)
    )
  })
}

function getBusinessInitials(tokens: string[]): string {
  let startIndex = 0
  while (startIndex < tokens.length && isLegalPrefixToken(tokens[startIndex]!)) {
    startIndex += 1
  }

  let businessTokens = filterMeaningfulTokens(tokens.slice(startIndex))

  if (
    businessTokens.length > 1 &&
    /^[A-Za-z]{2}$/.test(businessTokens[businessTokens.length - 1]!)
  ) {
    businessTokens = businessTokens.slice(0, -1)
  }

  while (businessTokens.length > 1 && /^\d+$/.test(businessTokens[0]!)) {
    businessTokens = businessTokens.slice(1)
  }

  if (businessTokens.length === 0) {
    const fallback = tokens[startIndex]
    return fallback ? initialFromToken(fallback) : ""
  }

  const firstToken = businessTokens[0]!
  if (/^[A-Z0-9]{2,3}$/i.test(firstToken) && /\d/.test(firstToken)) {
    return firstToken.toUpperCase().slice(0, 2)
  }

  return initialFromToken(firstToken)
}

export function getRecipientInitials(rawName: string): string {
  const cleaned = stripEmoji(formatRecipientDisplayName(rawName))
  if (!cleaned) return ""

  const firstChar = firstGrapheme(cleaned)
  if (firstChar && isCjk(firstChar)) {
    return firstChar
  }

  const scriptTokens = cleaned.split(/\s+/).filter(Boolean)
  if (scriptTokens.length > 0) {
    const scriptFirst = firstGrapheme(scriptTokens[0]!)
    if (scriptFirst && (isCyrillic(scriptFirst) || isThai(scriptFirst))) {
      if (scriptTokens.length === 1) {
        return scriptFirst
      }
      const scriptLast = firstGrapheme(scriptTokens[scriptTokens.length - 1]!)
      return `${scriptFirst}${scriptLast}`.slice(0, 2)
    }
  }

  const tokens = normalizeTokens(rawName)
  if (tokens.length === 0) {
    return ""
  }

  if (isLegalPrefixToken(tokens[0]!)) {
    return getBusinessInitials(tokens)
  }

  const meaningful = filterMeaningfulTokens(tokens)

  if (meaningful.length === 0) {
    return initialFromToken(tokens[0] ?? cleaned)
  }

  if (meaningful.length === 1) {
    const token = meaningful[0]!
    if (/^[A-Z0-9]{2,3}$/i.test(token)) {
      return token.toUpperCase().slice(0, 2)
    }
    return initialFromToken(token)
  }

  const first = initialFromToken(meaningful[0]!)
  const last = initialFromToken(meaningful[meaningful.length - 1]!)
  return `${first}${last}`.slice(0, 2)
}
