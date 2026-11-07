import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  buildDefaultSpendingLimits,
  resetSpendingLimitsStore,
  setSpendingLimits,
} from "../../cardControls/lib/spendingLimits"
import {
  bannerSliderIsSingle,
  bannerSnapIndex,
  filterEligibleBanners,
  getActivityBodyState,
  getCardStatusLine,
  getHomeNotification,
  getLockedCardNotification,
  getSpendingLimitNotification,
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

  it("snaps the banner slider one page when the drag passes a fifth of a slide", () => {
    assert.equal(bannerSnapIndex(0, -20, 100, 3), 1)
    assert.equal(bannerSnapIndex(0, 20, 100, 3), 0)
    assert.equal(bannerSnapIndex(1, 20, 100, 3), 0)
    assert.equal(bannerSnapIndex(1, -10, 100, 3), 1)
  })

  it("hides GetPhysicalCard banner when physical is not ordered", () => {
    const filtered = filterEligibleBanners(
      ["GoogleWallet", "GetPhysicalCard"],
      false,
    )
    assert.deepEqual(filtered, ["GoogleWallet"])
  })

  it("keeps GetPhysicalCard when physical is ordered", () => {
    const filtered = filterEligibleBanners(
      ["GoogleWallet", "GetPhysicalCard"],
      true,
    )
    assert.deepEqual(filtered, ["GoogleWallet", "GetPhysicalCard"])
  })

  it("returns an empty list when no banners are eligible", () => {
    assert.deepEqual(filterEligibleBanners([], false), [])
    assert.deepEqual(filterEligibleBanners(["GetPhysicalCard"], false), [])
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

  it("shows Locked status for a locked virtual card", () => {
    assert.equal(
      getCardStatusLine(
        { kind: "virtual", color: "green", lastFour: "4231", locked: true },
        0,
      ),
      "Locked",
    )
    assert.equal(
      getCardStatusLine({ kind: "virtual", color: "green", lastFour: "4231" }, 0),
      undefined,
    )
  })

  it("builds a locked-card notification preferring virtual", () => {
    assert.equal(getLockedCardNotification([]), null)
    assert.equal(
      getLockedCardNotification([{ kind: "virtual", color: "green", lastFour: "4231" }]),
      null,
    )

    const notification = getLockedCardNotification([
      {
        kind: "physical",
        color: "black",
        lastFour: "3131",
        locked: true,
      },
      {
        kind: "virtual",
        color: "green",
        lastFour: "4231",
        locked: true,
      },
    ])
    assert.ok(notification)
    assert.equal(notification.tone, "warning")
    assert.equal(notification.accent, "Your card ·· 4231 is locked.")
    assert.equal(notification.body, " Unlock it to start making payments again")
    assert.equal(notification.actionLabel, "Unlock the card")
    assert.equal(notification.action, "unlock")
    assert.equal(notification.cardType, "virtual")
  })

  it("prefers locked-card notification over spending-limit warnings", () => {
    const cards = [
      { kind: "virtual" as const, color: "green" as const, lastFour: "4231", locked: true },
    ]
    const notification = getHomeNotification(cards)
    assert.ok(notification)
    assert.equal(notification.action, "unlock")
  })

  it("builds a spending-limit notification when available today is low", () => {
    resetSpendingLimitsStore()
    const state = buildDefaultSpendingLimits(new Date(2026, 10, 6, 12, 0))
    setSpendingLimits("virtual", { ...state, spentTodayCents: 295_000 })

    const notification = getSpendingLimitNotification(
      [{ kind: "virtual", color: "green", lastFour: "4231" }],
      Date.UTC(2026, 10, 6, 12, 0),
    )
    assert.ok(notification)
    assert.equal(notification.action, "spending-limits")
    assert.match(notification.accent, /€50\.00 left to spend today/)
    resetSpendingLimitsStore()
  })
})
