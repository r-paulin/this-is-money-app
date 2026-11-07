import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { Transaction } from "../data/mockTransactions"
import { buildMockTransactions } from "../data/mockTransactions"
import { applyActivitySearch } from "./searchTransactions"
import {
  EMPTY_ACTIVITY_FILTERS,
  RANGE_ERROR,
  appliedChips,
  badgeCount,
  canApplyActivityFilters,
  customRangeError,
  dateBounds,
  enabledActivityTypes,
  filterTransactions,
  formatCustomRangeLabel,
  formatResultCount,
  formatSummaryTotal,
  isActivityTypeQuiet,
  loadFilteredTransactions,
  removeAppliedChip,
  selectMoneyFlow,
  slideCustomEnd,
  summaryFlowCents,
  summaryTotalCents,
  toggleActivityType,
  type ActivityFilterSelection,
} from "./activityFilters"

function tx(partial: Partial<Transaction> & Pick<Transaction, "id" | "kind">): Transaction {
  return {
    merchant: partial.id,
    occurredAt: partial.occurredAt ?? Date.parse("2026-10-21T12:00:00"),
    amountCents: partial.amountCents === undefined ? 1000 : partial.amountCents,
    currency: "EUR",
    mcc: 5411,
    ...partial,
  }
}

function filters(partial: Partial<ActivityFilterSelection> = {}): ActivityFilterSelection {
  return { ...EMPTY_ACTIVITY_FILTERS, ...partial }
}

const at = (year: number, monthIndex: number, day: number, hour = 12, minute = 0) =>
  new Date(year, monthIndex, day, hour, minute, 0, 0).getTime()

describe("money flow availability", () => {
  it("quiets types that cannot add to the balance when money is in", () => {
    const enabled = enabledActivityTypes("in")
    assert.deepEqual(
      [...enabled].sort(),
      ["cashback", "payouts", "refunds", "transfers"],
    )
    assert.equal(isActivityTypeQuiet("in", "card_payments"), true)
    assert.equal(isActivityTypeQuiet("in", "fees"), true)
    assert.equal(isActivityTypeQuiet("in", "reversals"), true)
  })

  it("quiets types that cannot take from the balance when money is out", () => {
    const enabled = enabledActivityTypes("out")
    assert.deepEqual([...enabled].sort(), ["card_payments", "fees", "transfers"])
    assert.equal(isActivityTypeQuiet("out", "payouts"), true)
    assert.equal(isActivityTypeQuiet("out", "refunds"), true)
    assert.equal(isActivityTypeQuiet("out", "cashback"), true)
    assert.equal(isActivityTypeQuiet("out", "reversals"), true)
  })

  it("restores every type when money flow returns to all", () => {
    for (const type of ["card_payments", "fees", "reversals", "payouts"] as const) {
      assert.equal(isActivityTypeQuiet("all", type), false)
    }
  })

  it("drops a selected card payment when money in is chosen", () => {
    const next = selectMoneyFlow(filters({ types: ["card_payments"] }), "in")
    assert.equal(next.moneyFlow, "in")
    assert.deepEqual(next.types, [])
  })

  it("keeps payouts and drops card payments when money in is chosen", () => {
    const next = selectMoneyFlow(filters({ types: ["payouts", "card_payments"] }), "in")
    assert.deepEqual(next.types, ["payouts"])
  })

  it("ignores a press on a quiet type", () => {
    const current = filters({ moneyFlow: "in", types: ["payouts"] })
    assert.deepEqual(toggleActivityType(current, "card_payments"), current)
  })
})

describe("date bounds", () => {
  it("limits this week to Sunday through the end of a Sunday", () => {
    const sunday = new Date(2026, 0, 4, 15, 0, 0)
    assert.equal(sunday.getDay(), 0)
    const bounds = dateBounds(filters({ date: "this_week" }), sunday)
    assert.ok(bounds)
    assert.equal(bounds.start, new Date(2026, 0, 4).getTime())
    assert.equal(bounds.end, new Date(2026, 0, 4, 23, 59, 59, 999).getTime())
  })

  it("uses the whole previous month in January", () => {
    const now = new Date(2026, 0, 15, 10, 0, 0)
    const bounds = dateBounds(filters({ date: "last_month" }), now)
    assert.ok(bounds)
    assert.equal(bounds.start, new Date(2025, 11, 1).getTime())
    assert.equal(bounds.end, new Date(2025, 11, 31, 23, 59, 59, 999).getTime())
  })

  it("includes both ends of a custom range and excludes the next day", () => {
    const selection = filters({
      date: "custom",
      customStart: new Date(2026, 9, 20),
      customEnd: new Date(2026, 9, 22),
    })
    const rows = [
      tx({ id: "start", kind: "purchase", occurredAt: at(2026, 9, 20, 0, 0) }),
      tx({ id: "end", kind: "purchase", occurredAt: at(2026, 9, 22, 23, 59) }),
      tx({ id: "next", kind: "purchase", occurredAt: at(2026, 9, 23, 0, 0) }),
    ]
    assert.deepEqual(
      filterTransactions(rows, selection).map((row) => row.id),
      ["start", "end"],
    )
  })

  it("slides the end date when the start moves", () => {
    const next = slideCustomEnd(new Date(2026, 9, 20), new Date(2026, 9, 22), new Date(2026, 9, 25))
    assert.equal(next.getFullYear(), 2026)
    assert.equal(next.getMonth(), 9)
    assert.equal(next.getDate(), 27)
  })

  it("refuses a reversed or incomplete custom range", () => {
    const start = new Date(2026, 9, 20)
    const end = new Date(2026, 9, 19)
    assert.equal(customRangeError(start, end), RANGE_ERROR)
    assert.equal(customRangeError(start, null), null)
    assert.equal(
      canApplyActivityFilters(filters({ date: "custom", customStart: start, customEnd: null })),
      false,
    )
    assert.equal(
      canApplyActivityFilters(filters({ date: "custom", customStart: start, customEnd: end })),
      false,
    )
    assert.equal(canApplyActivityFilters(filters({ date: "this_month" })), true)
  })
})

describe("row matching and totals", () => {
  const rows = [
    tx({ id: "payout", kind: "ride_payout", amountCents: 120000 }),
    tx({ id: "card", kind: "purchase", merchant: "Esso", amountCents: 3000 }),
    tx({ id: "hold", kind: "authorization", amountCents: 15000 }),
    tx({ id: "declined", kind: "declined", amountCents: 5000 }),
    tx({ id: "failed", kind: "failed", amountCents: 2500 }),
    tx({ id: "reversal", kind: "reversal", amountCents: 15000 }),
    tx({ id: "in", kind: "transfer_in", amountCents: 3200 }),
    tx({ id: "out", kind: "transfer_out", amountCents: 7500 }),
    tx({ id: "refund", kind: "refund", amountCents: 8999 }),
    tx({
      id: "pending-refund",
      kind: "refund",
      amountCents: 4000,
      paymentStatus: "pending",
    }),
    tx({ id: "missing", kind: "purchase", amountCents: null }),
    tx({ id: "fee", kind: "fee", amountCents: 100 }),
    tx({ id: "cashback", kind: "cashback", amountCents: 250 }),
  ]

  it("keeps credits for money in and payouts", () => {
    const matched = filterTransactions(
      rows,
      filters({ moneyFlow: "in", types: ["payouts"] }),
    ).map((row) => row.id)
    assert.deepEqual(matched, ["payout"])
  })

  it("keeps a pending hold for money out and card payments", () => {
    const matched = filterTransactions(
      rows,
      filters({ moneyFlow: "out", types: ["card_payments"] }),
    ).map((row) => row.id)
    assert.deepEqual(matched, ["card", "hold"])
  })

  it("keeps only inbound transfers", () => {
    const matched = filterTransactions(
      rows,
      filters({ moneyFlow: "in", types: ["transfers"] }),
    ).map((row) => row.id)
    assert.deepEqual(matched, ["in"])
  })

  it("lists a pending refund under money in and leaves it out of the total", () => {
    const matched = filterTransactions(
      rows,
      filters({ moneyFlow: "in", types: ["refunds"] }),
    )
    assert.deepEqual(
      matched.map((row) => row.id),
      ["refund", "pending-refund"],
    )
    const pendingOnly = matched.filter((row) => row.id === "pending-refund")
    assert.equal(summaryTotalCents(pendingOnly), 0)
    assert.equal(formatSummaryTotal(0).text, "€0.00")
    assert.equal(formatSummaryTotal(0).direction, "none")
  })

  it("unions payouts and transfers when money flow is all", () => {
    const matched = filterTransactions(
      rows,
      filters({ types: ["payouts", "transfers"] }),
    ).map((row) => row.id)
    assert.deepEqual(matched, ["payout", "in", "out"])
  })

  it("shows declined and failed card payments only when money flow is all", () => {
    const directed = filterTransactions(
      rows,
      filters({ moneyFlow: "out", types: ["card_payments"] }),
    ).map((row) => row.id)
    assert.equal(directed.includes("declined"), false)
    assert.equal(directed.includes("failed"), false)

    const allFlow = filterTransactions(rows, filters({ types: ["card_payments"] })).map(
      (row) => row.id,
    )
    assert.ok(allFlow.includes("declined"))
    assert.ok(allFlow.includes("failed"))
    assert.equal(summaryTotalCents(rows.filter((row) => row.id === "declined")), 0)
  })

  it("excludes reversals from both directed flows", () => {
    assert.equal(
      filterTransactions(rows, filters({ moneyFlow: "in" })).some((row) => row.id === "reversal"),
      false,
    )
    assert.equal(
      filterTransactions(rows, filters({ moneyFlow: "out" })).some((row) => row.id === "reversal"),
      false,
    )
    assert.equal(
      filterTransactions(rows, filters({ types: ["reversals"] })).some((row) => row.id === "reversal"),
      true,
    )
  })

  it("ignores a missing amount in the total", () => {
    const matched = filterTransactions(rows, filters({ types: ["card_payments"] }))
    assert.ok(matched.some((row) => row.id === "missing"))
    assert.equal(summaryTotalCents(matched.filter((row) => row.id === "missing")), 0)
  })

  it("signs the summary for money in and money out", () => {
    const incoming = formatSummaryTotal(120000)
    assert.equal(incoming.text, "+€1200.00")
    assert.equal(incoming.direction, "in")
    const outgoing = formatSummaryTotal(-3000)
    assert.equal(outgoing.text, "-€30.00")
    assert.equal(outgoing.direction, "out")
    assert.equal(formatResultCount(1), "1 result")
    assert.equal(formatResultCount(80), "80 results")
  })

  it("splits summary flow into credits and debits", () => {
    const mixed = [
      tx({ id: "in-a", kind: "ride_payout", amountCents: 20000 }),
      tx({ id: "out-a", kind: "purchase", amountCents: 6000 }),
      tx({ id: "skip", kind: "declined", amountCents: 5000 }),
    ]
    assert.deepEqual(summaryFlowCents(mixed), { in: 20000, out: 6000 })
    assert.deepEqual(
      summaryFlowCents([tx({ id: "only-in", kind: "ride_payout", amountCents: 120000 })]),
      { in: 120000, out: 0 },
    )
    assert.deepEqual(summaryFlowCents([]), { in: 0, out: 0 })
  })
})

describe("chips, badge, and search", () => {
  it("labels a preset and a custom range, and ignores All", () => {
    assert.equal(
      formatCustomRangeLabel(new Date(2026, 9, 20), new Date(2026, 9, 22)),
      "20 Oct - 22 Oct, 2026",
    )
    const custom = filters({
      date: "custom",
      customStart: new Date(2026, 9, 20),
      customEnd: new Date(2026, 9, 22),
      types: ["payouts", "transfers"],
    })
    assert.deepEqual(
      appliedChips(custom).map((chip) => chip.label),
      ["20 Oct - 22 Oct, 2026", "Payouts", "Transfers"],
    )
    assert.equal(badgeCount(custom), 3)
    assert.equal(badgeCount(EMPTY_ACTIVITY_FILTERS), 0)
    assert.deepEqual(
      appliedChips(filters({ date: "this_month" })).map((chip) => chip.label),
      ["This month"],
    )
  })

  it("drops one type chip and the badge count", () => {
    const selection = filters({ types: ["payouts", "transfers"] })
    const chips = appliedChips(selection)
    const next = removeAppliedChip(selection, chips[0]!)
    assert.deepEqual(next.types, ["transfers"])
    assert.equal(badgeCount(next), 1)
  })

  it("searches only inside the filtered rows", () => {
    const rows = [
      tx({ id: "payout", kind: "ride_payout", merchant: "Ride payout" }),
      tx({ id: "esso", kind: "purchase", merchant: "Esso" }),
    ]
    const filtered = filterTransactions(rows, filters({ types: ["payouts"] }))
    const search = applyActivitySearch(filtered, "Esso")
    assert.equal(search.status, "empty")
    assert.deepEqual(search.items, [])
  })

  it("returns the error branch when filtering throws", () => {
    const result = loadFilteredTransactions([], EMPTY_ACTIVITY_FILTERS, new Date(), () => {
      throw new Error("filter failed")
    })
    assert.equal(result.status, "error")
    assert.deepEqual(result.items, [])
  })
})

describe("mock feed", () => {
  it("classifies the cashback row as money in and the fee row as money out", () => {
    const now = new Date()
    const feed = buildMockTransactions(now)
    const cashback = filterTransactions(feed, filters({ moneyFlow: "in", types: ["cashback"] }), now)
    const fees = filterTransactions(feed, filters({ moneyFlow: "out", types: ["fees"] }), now)
    assert.equal(cashback.length, 1)
    assert.equal(cashback[0]?.kind, "cashback")
    assert.equal(fees.length, 1)
    assert.equal(fees[0]?.kind, "fee")
  })
})
