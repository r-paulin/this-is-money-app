import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  COUNTRIES,
  SUPPORTED_TRANSFER_COUNTRY_CODES,
  getCountryByCode,
} from "../data/countries"
import { orderCountries, searchCountries } from "./searchCountries"

describe("transfer country coverage", () => {
  it("contains the complete country catalogue", () => {
    assert.ok(COUNTRIES.length >= 249)
    assert.equal(new Set(COUNTRIES.map(({ code }) => code)).size, COUNTRIES.length)
  })

  it("supports exactly the 41-country EPC SEPA scope plus Canada", () => {
    assert.equal(SUPPORTED_TRANSFER_COUNTRY_CODES.size, 42)
    assert.equal(getCountryByCode("FR")?.supported, true)
    assert.equal(getCountryByCode("RS")?.supported, true)
    assert.equal(getCountryByCode("CA")?.supported, true)
    assert.equal(getCountryByCode("AU")?.supported, false)
    assert.equal(getCountryByCode("US")?.supported, false)
  })
})

describe("country search", () => {
  it("matches English names, local names, and ISO codes without diacritics", () => {
    assert.equal(searchCountries(COUNTRIES, "can")[0]?.code, "CA")
    assert.equal(searchCountries(COUNTRIES, "DEU")[0]?.code, "DE")
    assert.equal(searchCountries(COUNTRIES, "espana")[0]?.code, "ES")
  })

  it("keeps unsupported matches visible", () => {
    const australia = searchCountries(COUNTRIES, "Australia")
    assert.equal(australia[0]?.code, "AU")
    assert.equal(australia[0]?.supported, false)
  })

  it("pins the current country and sorts the remainder alphabetically", () => {
    const ordered = orderCountries(
      [
        getCountryByCode("AT"),
        getCountryByCode("FR"),
        getCountryByCode("AL"),
      ].filter((country) => country !== undefined),
      "FR",
    )

    assert.deepEqual(ordered.map(({ code }) => code), ["FR", "AL", "AT"])
  })
})
