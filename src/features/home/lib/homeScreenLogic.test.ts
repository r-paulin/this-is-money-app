import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  bannerSliderIsSingle,
  filterEligibleBanners,
  getActivityBodyState,
  getPhysicalCardStatusLine,
  isSendMoneyDisabled,
  shouldShowPhysicalOffer,
  shouldShowSeeAll,
} from "./homeScreenLogic"
import type { HomeCardRow } from "../home.types"

describe("homeScreenLogic", () => {
  it("shows See all only when count > 4", () => {
    assert.equal(shouldShowSeeAll(0), false)
    assert.equal(shouldShowSeeAll(4), false)
    assert.equal(shouldShowSeeAll(5), true)
  })

  it("disables Send money when balance is zero or loading", () => {
    assert.equal(isSendMoneyDisabled(0, "ready"), true)
    assert.equal(isSendMoneyDisabled(100, "ready"), false)
    assert.equal(isSendMoneyDisabled(100, "loading"), true)
  })

  it("single banner mode for 0–1 visible banners", () => {
    assert.equal(bannerSliderIsSingle(0), true)
    assert.equal(bannerSliderIsSingle(1), true)
    assert.equal(bannerSliderIsSingle(2), false)
  })

  it("hides GetPhysicalCard banner when physical is not ordered", () => {
    const filtered = filterEligibleBanners(
      ["GoogleWallet", "GetPhysicalCard"],
      false,
    )
    assert.deepEqual(filtered, ["GoogleWallet"])
  })

  it("shows physical offer row only when no physical card exists", () => {
    assert.equal(
      shouldShowPhysicalOffer([{ kind: "virtual", color: "green" }]),
      true,
    )
    assert.equal(
      shouldShowPhysicalOffer([
        { kind: "virtual", color: "green" },
        { kind: "physical", color: "black" },
      ]),
      false,
    )
  })

  it("maps activity body states", () => {
    assert.equal(getActivityBodyState("loading", 0), "loading")
    assert.equal(getActivityBodyState("failed", 10), "failed")
    assert.equal(getActivityBodyState("ready", 0), "empty")
    assert.equal(getActivityBodyState("ready", 3), "few")
    assert.equal(getActivityBodyState("ready", 8), "maximum")
  })

  it("maps physical delivery status lines", () => {
    const base: HomeCardRow = {
      kind: "physical",
      color: "black",
      deliveryPhase: "in_delivery",
      deliveryMinEta: Date.now() + 5 * 86_400_000,
      deliveryMaxEta: Date.now() + 12 * 86_400_000,
    }
    assert.equal(
      getPhysicalCardStatusLine(base, Date.now()),
      "On its way · 6–12 working days",
    )
    assert.equal(
      getPhysicalCardStatusLine(
        { ...base, deliveryMaxEta: Date.now() - 1 },
        Date.now(),
      ),
      "Card hasn't arrived?",
    )
    assert.equal(
      getPhysicalCardStatusLine({ kind: "physical", color: "black", blocked: true }, 0),
      "Blocked",
    )
  })
})
