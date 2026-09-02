import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildMockRecipients } from "../data/mockRecipients"
import type { Recipient } from "../sendMoney.types"
import { RECIPIENT_RETENTION_DAYS } from "../sendMoney.types"
import { searchRecipients } from "./searchRecipients"
import {
  compareRecipients,
  getDefaultRecipients,
  isRecipientEligible,
  scoreRecipient,
} from "./scoreRecipients"

const MS_PER_DAY = 1000 * 60 * 60 * 24
const NOW = Date.UTC(2026, 8, 2, 12, 0, 0)

function makeRecipient(overrides: Partial<Recipient> & Pick<Recipient, "id" | "rawName">): Recipient {
  return {
    iban: "LV80BANK0000435195001",
    lastAmountCents: 1_000,
    lastTransferredAt: NOW - 2 * MS_PER_DAY,
    transferCount90d: 1,
    transferCount365d: 1,
    averageAmountCents: 1_000,
    isLinkedBankAccount: false,
    isTrusted: false,
    ...overrides,
  }
}

describe("isRecipientEligible", () => {
  it("includes payees within the 180-day retention window", () => {
    const recipient = makeRecipient({
      id: "recent",
      rawName: "Recent Payee",
      lastTransferredAt: NOW - 180 * MS_PER_DAY,
    })

    assert.equal(isRecipientEligible(recipient, NOW), true)
  })

  it("excludes payees older than the 180-day retention window", () => {
    const recipient = makeRecipient({
      id: "old",
      rawName: "Old Payee",
      lastTransferredAt: NOW - (RECIPIENT_RETENTION_DAYS + 1) * MS_PER_DAY,
    })

    assert.equal(isRecipientEligible(recipient, NOW), false)
  })
})

describe("scoreRecipient", () => {
  it("weights recency highest when other signals are equal", () => {
    const recent = makeRecipient({
      id: "recent",
      rawName: "Recent Payee",
      lastTransferredAt: NOW - 1 * MS_PER_DAY,
    })
    const older = makeRecipient({
      id: "older",
      rawName: "Older Payee",
      lastTransferredAt: NOW - 90 * MS_PER_DAY,
    })

    assert.ok(scoreRecipient(recent, NOW) > scoreRecipient(older, NOW))
  })

  it("weights 90-day frequency above 365-day frequency at equal recency", () => {
    const frequent90 = makeRecipient({
      id: "frequent-90",
      rawName: "Frequent 90",
      transferCount90d: 12,
      transferCount365d: 12,
    })
    const frequent365Only = makeRecipient({
      id: "frequent-365",
      rawName: "Frequent 365",
      transferCount90d: 0,
      transferCount365d: 24,
    })

    assert.ok(scoreRecipient(frequent90, NOW) > scoreRecipient(frequent365Only, NOW))
  })
})

describe("compareRecipients", () => {
  it("breaks ties by most recent transfer", () => {
    const moreRecent = makeRecipient({
      id: "more-recent",
      rawName: "More Recent",
      lastTransferredAt: NOW - 1 * MS_PER_DAY,
      transferCount90d: 1,
      transferCount365d: 1,
      averageAmountCents: 1_000,
    })
    const lessRecent = makeRecipient({
      id: "less-recent",
      rawName: "Less Recent",
      lastTransferredAt: NOW - 30 * MS_PER_DAY,
      transferCount90d: 1,
      transferCount365d: 1,
      averageAmountCents: 1_000,
    })

    assert.ok(compareRecipients(moreRecent, lessRecent, NOW) < 0)
  })

  it("breaks recency ties by higher average amount", () => {
    const higherAmount = makeRecipient({
      id: "higher-amount",
      rawName: "Higher Amount",
      lastTransferredAt: NOW - 5 * MS_PER_DAY,
      transferCount90d: 1,
      transferCount365d: 1,
      averageAmountCents: 50_000,
    })
    const lowerAmount = makeRecipient({
      id: "lower-amount",
      rawName: "Lower Amount",
      lastTransferredAt: NOW - 5 * MS_PER_DAY,
      transferCount90d: 1,
      transferCount365d: 1,
      averageAmountCents: 1_000,
    })

    assert.ok(compareRecipients(higherAmount, lowerAmount, NOW) < 0)
  })
})

describe("default list vs search retention", () => {
  it("excludes old payees from the default list but allows search matches", () => {
    const allRecipients = buildMockRecipients(NOW)
    const defaultList = getDefaultRecipients(allRecipients, NOW, 10)
    const searchResult = searchRecipients(allRecipients, "Markus", NOW)

    assert.equal(
      defaultList.some((recipient) => recipient.id === "old-payee"),
      false,
    )
    assert.equal(
      searchResult.recipients.some((recipient) => recipient.id === "old-payee"),
      true,
    )
  })
})
