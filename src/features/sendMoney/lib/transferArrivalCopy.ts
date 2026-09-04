import { getCountryByCode } from "../data/countries"
import { getIbanCountryCode } from "./iban"

export type TransferArrivalRail =
  | "SEPA_INSTANT"
  | "SEPA"
  | "SEPA_INSTANT_FALLBACK"
  | "CANADA_EFT"
  | "SWIFT"

export function resolveTransferArrivalRail(iban: string): TransferArrivalRail {
  const countryCode = getIbanCountryCode(iban)
  const country = countryCode ? getCountryByCode(countryCode) : undefined

  if (country?.transferRail === "CANADA_EFT") {
    return "CANADA_EFT"
  }

  return "SEPA_INSTANT"
}

export function getTransferArrivalCopy(rail: TransferArrivalRail): string {
  switch (rail) {
    case "SEPA_INSTANT":
      return "It should arrive within minutes"
    case "SEPA":
    case "SEPA_INSTANT_FALLBACK":
      return "It should arrive within 2 business days"
    case "CANADA_EFT":
      return "It should arrive within 1–2 business days"
    case "SWIFT":
      return "It should arrive within 3 business days"
  }
}
