import type { TransferCountry } from "../data/countries"

const collator = new Intl.Collator("en", { sensitivity: "base" })

export function normalizeCountrySearch(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

export function searchCountries(
  countries: TransferCountry[],
  query: string,
): TransferCountry[] {
  const normalizedQuery = normalizeCountrySearch(query)
  if (!normalizedQuery) return countries

  return countries
    .map((country) => {
      const codes = [country.code, country.alpha3].map(normalizeCountrySearch)
      const names = [country.name, ...country.localNames].map(normalizeCountrySearch)
      const score = codes.includes(normalizedQuery)
        ? 0
        : names.some((name) => name.startsWith(normalizedQuery))
          ? 1
          : names.some((name) => name.includes(normalizedQuery))
            ? 2
            : null
      return { country, score }
    })
    .filter(
      (result): result is { country: TransferCountry; score: number } =>
        result.score !== null,
    )
    .sort(
      (left, right) =>
        left.score - right.score || collator.compare(left.country.name, right.country.name),
    )
    .map(({ country }) => country)
}

export function orderCountries(
  countries: TransferCountry[],
  currentCountryCode: string,
): TransferCountry[] {
  return [...countries].sort((left, right) => {
    if (left.code === currentCountryCode) return -1
    if (right.code === currentCountryCode) return 1
    return collator.compare(left.name, right.name)
  })
}
