import {
  getIbanCountryCode,
  getIbanExpectedLength,
  isValidIban,
  isValidIbanForCountry,
  normalizeIban,
} from "./iban"

export interface SepaRecipientValues {
  bankCountryCode: string
  bankCountryName: string
  iban: string
  accountHolderName: string
}

export interface CanadaRecipientValues {
  accountNumber: string
  transitNumber: string
  institutionNumber: string
  accountHolderName: string
}

export type SepaRecipientErrors = Partial<Record<"iban" | "accountHolderName", string>>
export type CanadaRecipientErrors = Partial<
  Record<
    "accountNumber" | "transitNumber" | "institutionNumber" | "accountHolderName",
    string
  >
>

const ACCOUNT_HOLDER_NAME_PATTERN = /^[\p{Script=Latin}\p{M} .'-]+$/u

export function validateAccountHolderName(value: string): string | undefined {
  const name = value.trim()
  if (name.length < 2) return "Enter at least 2 characters"
  if (name.length > 200) return "Enter no more than 200 characters"
  if (!ACCOUNT_HOLDER_NAME_PATTERN.test(name)) {
    return "Check the name for unsupported characters"
  }
  return undefined
}

export function validateSepaIban(
  ibanValue: string,
  countryCode: string,
  countryName: string,
): string | undefined {
  const iban = normalizeIban(ibanValue)
  const detectedCountry = getIbanCountryCode(iban)
  if (detectedCountry && detectedCountry !== countryCode) {
    return `This IBAN isn't from ${countryName}`
  }

  const expectedLength = getIbanExpectedLength(countryCode)
  if (!expectedLength || iban.length !== expectedLength || !isValidIban(iban)) {
    return "Enter a valid IBAN"
  }
  if (!isValidIbanForCountry(iban, countryCode)) {
    return `This IBAN isn't from ${countryName}`
  }
  return undefined
}

export function validateSepaRecipient(
  values: SepaRecipientValues,
): SepaRecipientErrors {
  const errors: SepaRecipientErrors = {}
  const ibanError = validateSepaIban(
    values.iban,
    values.bankCountryCode,
    values.bankCountryName,
  )
  const accountHolderNameError = validateAccountHolderName(values.accountHolderName)
  if (ibanError) errors.iban = ibanError
  if (accountHolderNameError) errors.accountHolderName = accountHolderNameError
  return errors
}

export function validateCanadaRecipient(
  values: CanadaRecipientValues,
): CanadaRecipientErrors {
  const errors: CanadaRecipientErrors = {}
  if (!/^\d{7,21}$/.test(values.accountNumber)) {
    errors.accountNumber = /[A-Za-z]/.test(values.accountNumber)
      ? "This account number isn't from Canada"
      : "Enter 7 to 21 digits"
  }
  if (!/^\d{5}$/.test(values.transitNumber)) {
    errors.transitNumber = "Must be 5 digits"
  }
  if (!/^\d{3}$/.test(values.institutionNumber)) {
    errors.institutionNumber = "Must be 3 digits"
  }
  const accountHolderNameError = validateAccountHolderName(values.accountHolderName)
  if (accountHolderNameError) errors.accountHolderName = accountHolderNameError
  return errors
}
