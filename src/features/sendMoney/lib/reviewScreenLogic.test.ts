import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  getNameConfirmedMessage,
  getPartialMatchBannerMessage,
  getReviewScreenRules,
} from "./reviewScreenLogic"

describe("reviewScreenLogic", () => {
  it("FULL_MATCH enables trusted toggle and confirm CTA", () => {
    const rules = getReviewScreenRules("FULL_MATCH")
    assert.equal(rules.bannerKind, "name-confirmed")
    assert.equal(rules.trustedToggleEnabled, true)
    assert.equal(rules.ctaMode, "confirm")
  })

  it("PARTIAL_MATCH shows warning and disables trusted toggle", () => {
    const rules = getReviewScreenRules("PARTIAL_MATCH")
    assert.equal(rules.bannerKind, "cop-warning")
    assert.equal(rules.trustedToggleEnabled, false)
    assert.equal(rules.ctaMode, "confirm")
  })

  it("PARTIAL_MATCH_INCORRECT_TYPE uses entity-type copy", () => {
    const rules = getReviewScreenRules("PARTIAL_MATCH_INCORRECT_TYPE")
    assert.equal(rules.bannerKind, "cop-warning")
    assert.match(
      getPartialMatchBannerMessage("PARTIAL_MATCH_INCORRECT_TYPE"),
      /account type/,
    )
  })

  it("NOT_MATCHED uses edit-and-send CTA and disables toggle", () => {
    const rules = getReviewScreenRules("NOT_MATCHED")
    assert.equal(rules.bannerKind, "cop-danger")
    assert.equal(rules.trustedToggleEnabled, false)
    assert.equal(rules.ctaMode, "edit-and-send")
  })

  it("UNAVAILABLE shows trust banner and confirm CTA", () => {
    const rules = getReviewScreenRules("UNAVAILABLE")
    assert.equal(rules.bannerKind, "trust")
    assert.equal(rules.trustedToggleEnabled, true)
    assert.equal(rules.ctaMode, "confirm")
  })

  it("linked bank account shows driver profile status and hides trusted toggle", () => {
    const rules = getReviewScreenRules("FULL_MATCH", true)
    assert.equal(rules.bannerKind, "linked-profile")
    assert.equal(rules.trustedToggleEnabled, false)
    assert.equal(rules.ctaMode, "confirm")
  })

  it("name confirmed message uses bank name or fallback", () => {
    assert.equal(
      getNameConfirmedMessage("BNP Paribas"),
      "Name confirmed by BNP Paribas",
    )
    assert.equal(
      getNameConfirmedMessage(),
      "Name confirmed by the recipient's bank",
    )
  })
})
