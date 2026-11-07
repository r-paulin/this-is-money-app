import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  CARD_CONTROL_ITEMS,
  CARD_LOCKED_SNACKBAR_MESSAGE,
  getLockPrimary,
  getLockSecondary,
  getLockStatusAnnouncement,
  isControlDisabled,
  isLockSwitchOn,
  showLockedCaption,
  showsLockedSnackbarOnTap,
  type CardControlActionId,
  type LockPhase,
} from "./cardControlItems"

const PHASES: LockPhase[] = ["unlocked", "locking", "locked", "unlocking"]

describe("cardControlItems copy", () => {
  it("lists wallet before spending limits with Figma labels", () => {
    assert.deepEqual(
      CARD_CONTROL_ITEMS.map((item) => item.id),
      ["lock", "card-details", "pin-reminder", "apple-wallet", "spending-limits", "replace"],
    )
    assert.equal(
      CARD_CONTROL_ITEMS.find((item) => item.id === "apple-wallet")?.primary,
      "Add to Apple Wallet",
    )
    assert.equal(
      CARD_CONTROL_ITEMS.find((item) => item.id === "spending-limits")?.primary,
      "Spending limits",
    )
  })

  it("uses Figma locked snackbar copy without a Card locked prefix", () => {
    assert.equal(
      CARD_LOCKED_SNACKBAR_MESSAGE,
      "This feature isn't available while your card is locked.",
    )
  })
})

describe("getLockPrimary / secondary", () => {
  it("keeps Unlocked through locking and Card locked through unlocking", () => {
    assert.equal(getLockPrimary("unlocked"), "Unlocked")
    assert.equal(getLockPrimary("locking"), "Unlocked")
    assert.equal(getLockPrimary("locked"), "Card locked")
    assert.equal(getLockPrimary("unlocking"), "Card locked")
  })

  it("maps secondary status lines", () => {
    assert.equal(getLockSecondary("unlocked"), "Lock card to stop payments")
    assert.equal(getLockSecondary("locking"), "Locking card...")
    assert.equal(getLockSecondary("locked"), "Unlock your card to use it again")
    assert.equal(getLockSecondary("unlocking"), "Unlocking card...")
  })

  it("announces status for aria-live", () => {
    assert.equal(getLockStatusAnnouncement("locking"), "Locking card")
    assert.equal(getLockStatusAnnouncement("locked"), "Card locked")
  })
})

describe("isControlDisabled matrix", () => {
  const softLocked: CardControlActionId[] = [
    "card-details",
    "pin-reminder",
    "apple-wallet",
  ]

  it("disables only details, PIN, and Apple Wallet while locking or locked", () => {
    for (const phase of ["locking", "locked"] as const) {
      for (const id of softLocked) {
        assert.equal(isControlDisabled(id, phase), true, `${id} @ ${phase}`)
      }
      assert.equal(isControlDisabled("spending-limits", phase), false)
      assert.equal(isControlDisabled("replace", phase), false)
      assert.equal(isControlDisabled("lock", phase), false)
    }
  })

  it("disables every action row while unlocking", () => {
    for (const item of CARD_CONTROL_ITEMS) {
      if (item.id === "lock") {
        assert.equal(isControlDisabled(item.id, "unlocking"), false)
        continue
      }
      assert.equal(isControlDisabled(item.id, "unlocking"), true, item.id)
    }
  })

  it("enables all non-lock rows when unlocked", () => {
    for (const item of CARD_CONTROL_ITEMS) {
      assert.equal(isControlDisabled(item.id, "unlocked"), false)
    }
  })

  it("shows snackbar only for soft-locked rows while locked", () => {
    for (const phase of PHASES) {
      for (const item of CARD_CONTROL_ITEMS) {
        const expected =
          phase === "locked" && softLocked.includes(item.id)
        assert.equal(
          showsLockedSnackbarOnTap(item.id, phase),
          expected,
          `${item.id} @ ${phase}`,
        )
      }
    }
  })
})

describe("lock switch and caption", () => {
  it("treats locking and locked as switch on", () => {
    assert.equal(isLockSwitchOn("locking"), true)
    assert.equal(isLockSwitchOn("locked"), true)
    assert.equal(isLockSwitchOn("unlocked"), false)
    assert.equal(isLockSwitchOn("unlocking"), false)
  })

  it("shows locked caption while locked or unlocking", () => {
    assert.equal(showLockedCaption("locked"), true)
    assert.equal(showLockedCaption("unlocking"), true)
    assert.equal(showLockedCaption("locking"), false)
    assert.equal(showLockedCaption("unlocked"), false)
  })
})
