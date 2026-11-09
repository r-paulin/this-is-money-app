export interface AccountDetails {
  accountHolder: string
  /** IBAN without spaces. */
  iban: string
  bic: string
  bankName: string
  bankAddress: string
}

/** Prototype EUR receive account (Figma Account details). */
export const MOCK_ACCOUNT_DETAILS: AccountDetails = {
  accountHolder: "Reini Paulins",
  iban: "NL24AINH0123456789",
  bic: "AINHNL22",
  bankName: "Airwallex B.V.",
  bankAddress: "Vijzelstraat 68-78, 1017 HL Amsterdam, Netherlands",
}
