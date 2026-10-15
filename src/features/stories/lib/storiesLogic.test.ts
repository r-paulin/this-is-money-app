import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  clampStoryIndex,
  nextStoryIndex,
  prevStoryIndex,
  storyDwellOutcome,
  storyPageOpacity,
  storySnapIndex,
  storyTapZone,
} from "./storiesLogic"

describe("storiesLogic", () => {
  it("clamps index into the page range", () => {
    assert.equal(clampStoryIndex(-1, 4), 0)
    assert.equal(clampStoryIndex(2, 4), 2)
    assert.equal(clampStoryIndex(9, 4), 3)
    assert.equal(clampStoryIndex(0, 0), 0)
  })

  it("moves next and previous without leaving the range", () => {
    assert.equal(nextStoryIndex(0, 4), 1)
    assert.equal(nextStoryIndex(3, 4), 3)
    assert.equal(prevStoryIndex(0, 4), 0)
    assert.equal(prevStoryIndex(2, 4), 1)
  })

  it("uses the leading third as the previous tap zone", () => {
    assert.equal(storyTapZone(0, 300), "leading")
    assert.equal(storyTapZone(99, 300), "leading")
    assert.equal(storyTapZone(100, 300), "trailing")
    assert.equal(storyTapZone(299, 300), "trailing")
  })

  it("stays after dwell on the last page and advances otherwise", () => {
    assert.equal(storyDwellOutcome(0, 4), "advance")
    assert.equal(storyDwellOutcome(3, 4), "stay")
    assert.equal(storyDwellOutcome(0, 0), "close")
  })

  it("snaps the track when drag passes a quarter of the page width", () => {
    assert.equal(storySnapIndex(0, -80, 300, 4), 1)
    assert.equal(storySnapIndex(0, -70, 300, 4), 0)
    assert.equal(storySnapIndex(1, 80, 300, 4), 0)
    assert.equal(storySnapIndex(0, 80, 300, 4), 0)
  })

  it("cross-fades page opacity across the slide", () => {
    assert.equal(storyPageOpacity(0, 0, 300), 1)
    assert.equal(storyPageOpacity(1, 0, 300), 0)
    assert.equal(storyPageOpacity(0, -150, 300), 0.5)
    assert.equal(storyPageOpacity(1, -150, 300), 0.5)
    assert.equal(storyPageOpacity(1, -300, 300), 1)
  })
})
