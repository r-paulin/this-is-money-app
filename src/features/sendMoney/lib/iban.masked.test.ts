import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { formatIbanMasked, getIbanMaskParts, IBAN_MASK_GROUP } from "./iban"

describe("formatIbanMasked", () => {
  it("keeps the country/check prefix and last four digits with middot groups", () => {
    assert.equal(
      formatIbanMasked("FR1420041010050500013M02606"),
      `FR14 ${IBAN_MASK_GROUP} ${IBAN_MASK_GROUP} ${IBAN_MASK_GROUP} ${IBAN_MASK_GROUP} 2606`,
    )
  })

  it("exposes structured parts for masked markup", () => {
    const parts = getIbanMaskParts("FR1420041010050500013M02606")
    assert.deepEqual(parts, {
      prefix: "FR14",
      maskedGroups: [IBAN_MASK_GROUP, IBAN_MASK_GROUP, IBAN_MASK_GROUP, IBAN_MASK_GROUP],
      suffix: "2606",
    })
  })
})
