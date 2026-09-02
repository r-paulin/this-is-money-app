const IBAN_LENGTH_BY_COUNTRY: Record<string, number> = {
  AD: 24,
  AL: 28,
  AT: 20,
  BE: 16,
  BG: 22,
  CH: 21,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  EE: 20,
  ES: 24,
  FI: 18,
  FR: 27,
  GB: 22,
  GR: 27,
  HR: 21,
  HU: 28,
  IE: 22,
  IS: 26,
  IT: 27,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MD: 24,
  ME: 22,
  MK: 19,
  MT: 31,
  NL: 18,
  NO: 15,
  PL: 28,
  PT: 25,
  RO: 24,
  RS: 22,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  VA: 22,
}

function ibanToNumeric(iban: string): string {
  return iban
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code >= 48 && code <= 57) return char
      if (code >= 65 && code <= 90) return String(code - 55)
      return ""
    })
    .join("")
}

export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase()
}

export function getIbanCountryCode(value: string): string | undefined {
  const code = normalizeIban(value).slice(0, 2)
  return /^[A-Z]{2}$/.test(code) ? code : undefined
}

export function getIbanExpectedLength(countryCode: string): number | undefined {
  return IBAN_LENGTH_BY_COUNTRY[countryCode.toUpperCase()]
}

export function isValidIban(value: string): boolean {
  const iban = normalizeIban(value)
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
    return false
  }

  const country = iban.slice(0, 2)
  const expectedLength = IBAN_LENGTH_BY_COUNTRY[country]
  if (expectedLength != null && iban.length !== expectedLength) {
    return false
  }

  const rearranged = iban.slice(4) + iban.slice(0, 4)
  const numeric = ibanToNumeric(rearranged)

  let remainder = 0
  for (let index = 0; index < numeric.length; index += 7) {
    const block = String(remainder) + numeric.slice(index, index + 7)
    remainder = Number(BigInt(block) % 97n)
  }

  return remainder === 1
}

export function isValidIbanForCountry(value: string, countryCode: string): boolean {
  const normalized = normalizeIban(value)
  return (
    normalized.startsWith(countryCode.toUpperCase()) &&
    normalized.length === getIbanExpectedLength(countryCode) &&
    isValidIban(normalized)
  )
}

/** Display format with groups of four, e.g. LV80 BANK 0000 4351 9500 1 */
export function formatIbanDisplay(iban: string): string {
  const normalized = normalizeIban(iban)
  const country = normalized.slice(0, 2)
  const check = normalized.slice(2, 4)
  const rest = normalized.slice(4)
  const groups = rest.match(/.{1,4}/g) ?? []
  return [country + check, ...groups].join(" ")
}

/** Truncate for CTA label, e.g. LV80 1000… */
export function formatIbanTruncated(iban: string): string {
  const normalized = normalizeIban(iban)
  if (normalized.length <= 8) {
    return formatIbanDisplay(normalized)
  }
  const prefix = formatIbanDisplay(normalized.slice(0, 8))
  return `${prefix}…`
}
