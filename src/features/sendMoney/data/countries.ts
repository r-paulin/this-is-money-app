import worldCountries from "world-countries"

export interface TransferCountry {
  code: string
  alpha3: string
  name: string
  localNames: string[]
  supported: boolean
  transferRail: "SEPA" | "CANADA_EFT" | null
  flagEmoji: string
}

const SEPA_COUNTRY_CODES = [
  "AD", "AL", "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES",
  "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU",
  "LV", "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS",
  "SE", "SI", "SK", "SM", "VA",
] as const

export const SUPPORTED_TRANSFER_COUNTRY_CODES = new Set<string>([
  ...SEPA_COUNTRY_CODES,
  "CA",
])

const collator = new Intl.Collator("en", { sensitivity: "base" })

function uniqueLocalNames(country: (typeof worldCountries)[number]): string[] {
  const names = Object.values(country.name.native)
    .map(({ common }) => common)
    .filter((name) => name !== country.name.common)

  // Helpful ASCII aliases for names whose common local spelling uses diacritics.
  if (country.cca2 === "ES") names.push("España")

  return [...new Set(names)]
}

export const COUNTRIES: TransferCountry[] = worldCountries
  .filter(({ cca2, cca3 }) => cca2.length === 2 && cca3.length === 3)
  .map((country): TransferCountry => {
    const supported = SUPPORTED_TRANSFER_COUNTRY_CODES.has(country.cca2)
    return {
      code: country.cca2,
      alpha3: country.cca3,
      name: country.name.common,
      localNames: uniqueLocalNames(country),
      supported,
      transferRail: country.cca2 === "CA" ? "CANADA_EFT" : supported ? "SEPA" : null,
      flagEmoji: country.flag,
    }
  })
  .sort((left, right) => collator.compare(left.name, right.name))

const COUNTRIES_BY_CODE = new Map(COUNTRIES.map((country) => [country.code, country]))

export function getCountryByCode(code: string): TransferCountry | undefined {
  return COUNTRIES_BY_CODE.get(code.toUpperCase())
}
