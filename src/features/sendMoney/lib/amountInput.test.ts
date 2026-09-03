import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  amountCentsFromState,
  applyAmountBackspace,
  applyAmountKey,
  formatAmountDisplay,
  isEmptyAmountState,
} from "./amountInput"

describe("amountInput", () => {
  it("starts empty with ghost 0,00", () => {
    const state = applyAmountKey(
      { majorDigits: "", minorDigits: "", inDecimal: false },
      "Backspace",
    )
    assert.equal(isEmptyAmountState(state), true)
    const display = formatAmountDisplay(state)
    assert.equal(display.entered, "")
    assert.equal(display.ghost, "0,00")
    assert.equal(amountCentsFromState(state), 0)
  })

  it("builds whole-number cents and enables grouping", () => {
    let state = applyAmountKey(
      { majorDigits: "", minorDigits: "", inDecimal: false },
      "1",
    )
    state = applyAmountKey(state, "2")
    assert.equal(amountCentsFromState(state), 1200)
    assert.equal(formatAmountDisplay(state).entered, "12")
    assert.equal(formatAmountDisplay(state).ghost, "")
  })

  it("backspace from single digit returns to empty state", () => {
    let state = applyAmountKey(
      { majorDigits: "", minorDigits: "", inDecimal: false },
      "5",
    )
    state = applyAmountBackspace(state)
    assert.equal(isEmptyAmountState(state), true)
  })

  it("caps fraction digits at two", () => {
    let state = applyAmountKey(
      { majorDigits: "12", minorDigits: "", inDecimal: true },
      "1",
    )
    state = applyAmountKey(state, "2")
    state = applyAmountKey(state, "3")
    assert.equal(state.minorDigits, "12")
    assert.equal(amountCentsFromState(state), 1212)
  })

  it("shows ghost zeros in decimal intermediate state", () => {
    const state = { majorDigits: "12", minorDigits: "5", inDecimal: true }
    const display = formatAmountDisplay(state)
    assert.equal(display.entered, "12,5")
    assert.equal(display.ghost, "0")
    assert.equal(amountCentsFromState(state), 1250)
  })

  it("accepts comma to enter decimal mode", () => {
    const state = applyAmountKey(
      { majorDigits: "12", minorDigits: "", inDecimal: false },
      ",",
    )
    assert.equal(state.inDecimal, true)
    const display = formatAmountDisplay(state)
    assert.equal(display.entered, "12,")
    assert.equal(display.ghost, "00")
  })
})
