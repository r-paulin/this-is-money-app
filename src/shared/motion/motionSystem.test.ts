import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { duration, ease, getRecipes, reduce, spring } from "./motionSystem"

describe("motionSystem", () => {
  it("reduce maps springs and travel to a short standard fade", () => {
    const reduced = reduce({
      animate: { opacity: 1, y: 8, scale: 0.5, transition: spring.bouncy },
      delay: 0.2,
    })
    assert.deepEqual(reduced, {
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: duration.sm, ease: ease.standard },
      },
      delay: 0,
    })
  })

  it("forks nav recipes per platform", () => {
    assert.equal(getRecipes("ios").nav.parallax, "30%")
    assert.equal(getRecipes("android").nav.parallax, "32px")
    assert.equal(getRecipes("ios").nav.enter.duration, duration.xl)
    assert.equal(getRecipes("android").nav.enter.duration, duration.lg)
  })

  it("forks modal kind per platform", () => {
    assert.equal(getRecipes("ios").modal.kind, "cover")
    assert.equal(getRecipes("android").modal.kind, "fadeScale")
    assert.equal(getRecipes("android").modal.scale, 0.92)
  })
})
