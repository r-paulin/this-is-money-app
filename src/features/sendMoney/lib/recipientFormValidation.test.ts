import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  getIbanCountryCode,
  isValidIbanForCountry,
} from "./iban"
import {
  validateAccountHolderName,
  validateCanadaRecipient,
  validateSepaRecipient,
} from "./recipientFormValidation"

describe("country-aware IBAN validation", () => {
  it("accepts valid IBANs with the selected country and country-specific length", () => {
    assert.equal(isValidIbanForCountry("FR14 2004 1010 0505 0001 3M02 606", "FR"), true)
    assert.equal(isValidIbanForCountry("DE89 3704 0044 0532 0130 00", "DE"), true)
    assert.equal(isValidIbanForCountry("NL91 ABNA 0417 1643 00", "NL"), true)
  })

  it("rejects a valid IBAN when its prefix differs from the selected country", () => {
    assert.equal(isValidIbanForCountry("DE89 3704 0044 0532 0130 00", "FR"), false)
    assert.equal(getIbanCountryCode("de89 3704"), "DE")
  })
})

describe("account-holder validation", () => {
  it("allows Latin letters, spaces, apostrophes, hyphens, and periods", () => {
    assert.equal(validateAccountHolderName("Jean-Luc O'Neill Jr."), undefined)
  })

  it("rejects unsupported characters and names outside Airwallex length limits", () => {
    assert.equal(
      validateAccountHolderName("Jean Dunt@£"),
      "Check the name for unsupported characters",
    )
    assert.equal(validateAccountHolderName("J"), "Enter at least 2 characters")
    assert.equal(
      validateAccountHolderName("A".repeat(201)),
      "Enter no more than 200 characters",
    )
  })
})

describe("SEPA recipient validation", () => {
  it("reports independent IBAN country and account-holder errors together", () => {
    assert.deepEqual(
      validateSepaRecipient({
        bankCountryCode: "FR",
        bankCountryName: "France",
        iban: "DE89 3704 0044 0532 0130 00",
        accountHolderName: "Jean Dunt@£",
      }),
      {
        iban: "This IBAN isn't from France",
        accountHolderName: "Check the name for unsupported characters",
      },
    )
  })
})

describe("Canada EFT recipient validation", () => {
  it("accepts Airwallex-compatible Canadian EFT details", () => {
    assert.deepEqual(
      validateCanadaRecipient({
        accountNumber: "1234567",
        transitNumber: "12345",
        institutionNumber: "001",
        accountHolderName: "Mark Collins",
      }),
      {},
    )
  })

  it("checks every Canadian EFT field independently", () => {
    assert.deepEqual(
      validateCanadaRecipient({
        accountNumber: "FR761234",
        transitNumber: "165",
        institutionNumber: "1221",
        accountHolderName: "M",
      }),
      {
        accountNumber: "This account number isn't from Canada",
        transitNumber: "Must be 5 digits",
        institutionNumber: "Must be 3 digits",
        accountHolderName: "Enter at least 2 characters",
      },
    )
  })
})
