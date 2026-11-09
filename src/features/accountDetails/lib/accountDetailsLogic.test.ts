import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { MOCK_ACCOUNT_DETAILS } from "../data/mockAccountDetails"
import {
  formatAccountDetailsShareText,
  formatBankNameAndAddressCopy,
} from "./accountDetailsLogic"

describe("accountDetailsLogic", () => {
  it("joins bank name and address for a single copy value", () => {
    assert.equal(
      formatBankNameAndAddressCopy(MOCK_ACCOUNT_DETAILS),
      "Airwallex B.V.\nVijzelstraat 68-78, 1017 HL Amsterdam, Netherlands",
    )
  })

  it("builds a plain-text share payload with all fields", () => {
    const text = formatAccountDetailsShareText(MOCK_ACCOUNT_DETAILS)
    assert.match(text, /^Account holder: Reini Paulins\n/)
    assert.match(text, /\nIBAN: NL24AINH0123456789\n/)
    assert.match(text, /\nBIC\/SWIFT code: AINHNL22\n/)
    assert.match(
      text,
      /\nBank name and address: Airwallex B\.V\.\nVijzelstraat 68-78, 1017 HL Amsterdam, Netherlands$/,
    )
  })
})
