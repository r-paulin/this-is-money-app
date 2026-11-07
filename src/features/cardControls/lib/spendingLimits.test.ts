import assert from "node:assert/strict"
import { describe, it, beforeEach } from "node:test"
import {
  applyLimitEdits,
  availableTodayCents,
  availableThisMonthCents,
  buildDefaultSpendingLimits,
  buildSpendingLimitsView,
  formatDailyResetCountdown,
  getSpendingLimits,
  parseEurInputToCents,
  resetSpendingLimitsStore,
  resolveSpendingWarning,
  ringRatio,
  setSpendingLimits,
  spendingLimitsHubSecondary,
  validateLimitCents,
  type SpendingLimitsState,
} from "./spendingLimits"

function base(partial: Partial<SpendingLimitsState> = {}): SpendingLimitsState {
  return {
    ...buildDefaultSpendingLimits(new Date(2026, 10, 6, 12, 0)),
    ...partial,
  }
}

describe("spendingLimits", () => {
  beforeEach(() => {
    resetSpendingLimitsStore()
  })

  it("computes available today as the min of daily and monthly remaining", () => {
    const state = base({
      dailyLimitCents: 300_000,
      spentTodayCents: 30_000,
      monthlyLimitCents: 1_500_000,
      spentThisMonthCents: 10_000,
    })
    assert.equal(availableTodayCents(state), 270_000)
    assert.equal(availableThisMonthCents(state), 1_490_000)
  })

  it("caps available today by monthly remaining when monthly is lower", () => {
    const state = base({
      dailyLimitCents: 300_000,
      spentTodayCents: 0,
      monthlyLimitCents: 1_500_000,
      spentThisMonthCents: 1_480_000,
    })
    assert.equal(availableTodayCents(state), 20_000)
  })

  it("fills the ring from spent / monthly", () => {
    assert.equal(ringRatio(base({ spentThisMonthCents: 750_000, monthlyLimitCents: 1_500_000 })), 0.5)
    assert.equal(ringRatio(base({ spentThisMonthCents: 0, monthlyLimitCents: 0 })), 0)
  })

  it("classifies daily low, daily reached, and monthly reached", () => {
    assert.equal(
      resolveSpendingWarning(base({ spentTodayCents: 295_000 })),
      "daily_low",
    )
    assert.equal(
      resolveSpendingWarning(base({ spentTodayCents: 300_000 })),
      "daily_reached",
    )
    assert.equal(
      resolveSpendingWarning(base({ spentThisMonthCents: 1_500_000 })),
      "monthly_reached",
    )
    assert.equal(resolveSpendingWarning(base()), null)
  })

  it("rejects amounts above the per-transaction max", () => {
    assert.match(
      validateLimitCents("perTransaction", 500_000) ?? "",
      /€3000\.00 or less/,
    )
    assert.equal(validateLimitCents("perTransaction", 300_000), null)
  })

  it("treats a monthly limit below spent as zero available after apply", () => {
    const next = applyLimitEdits(base({ spentThisMonthCents: 50_000 }), {
      perTransactionCents: 300_000,
      monthlyLimitCents: 40_000,
    })
    assert.equal(availableThisMonthCents(next), 0)
    assert.equal(resolveSpendingWarning(next), "monthly_reached")
  })

  it("preserves daily limit when applying per-transaction and monthly edits", () => {
    const next = applyLimitEdits(base({ dailyLimitCents: 250_000 }), {
      perTransactionCents: 200_000,
      monthlyLimitCents: 1_000_000,
    })
    assert.equal(next.dailyLimitCents, 250_000)
    assert.equal(next.perTransactionCents, 200_000)
    assert.equal(next.monthlyLimitCents, 1_000_000)
  })

  it("builds hub secondary for warning states only", () => {
    const low = buildSpendingLimitsView(base({ spentTodayCents: 295_000 }))
    assert.equal(spendingLimitsHubSecondary(low), "Available today: €50.00")
    assert.equal(
      spendingLimitsHubSecondary(
        buildSpendingLimitsView(base({ spentThisMonthCents: 1_500_000 })),
      ),
      "Monthly limit reached",
    )
    assert.equal(spendingLimitsHubSecondary(buildSpendingLimitsView(base())), undefined)
  })

  it("parses eur input and formats countdown", () => {
    assert.equal(parseEurInputToCents("3,000.00"), 300_000)
    assert.equal(parseEurInputToCents("50"), 5_000)
    assert.equal(parseEurInputToCents(""), null)
    const resetsAt = Date.UTC(2026, 10, 6, 14, 5)
    const now = Date.UTC(2026, 10, 6, 12, 0)
    assert.equal(formatDailyResetCountdown(resetsAt, now), "2 hr 5 min")
  })

  it("stores limits per card type for the session", () => {
    const edited = applyLimitEdits(getSpendingLimits("virtual"), {
      perTransactionCents: 200_000,
      monthlyLimitCents: 1_000_000,
    })
    setSpendingLimits("virtual", edited)
    assert.equal(getSpendingLimits("virtual").perTransactionCents, 200_000)
    assert.equal(getSpendingLimits("physical").perTransactionCents, 300_000)
  })
})
