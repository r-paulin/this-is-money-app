import type { AccountDetails } from "../data/mockAccountDetails"

/** Clipboard / share value for bank name + address. */
export function formatBankNameAndAddressCopy(details: AccountDetails): string {
  return `${details.bankName}\n${details.bankAddress}`
}

/** Plain-text payload for Web Share / copy-all fallback. */
export function formatAccountDetailsShareText(details: AccountDetails): string {
  return [
    `Account holder: ${details.accountHolder}`,
    `IBAN: ${details.iban}`,
    `BIC/SWIFT code: ${details.bic}`,
    `Bank name and address: ${formatBankNameAndAddressCopy(details)}`,
  ].join("\n")
}
