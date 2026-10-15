import type { StoryDwellOutcome, StoryTapZone } from "../stories.types"

/** Clamp page index into `[0, pageCount - 1]` (or `0` when empty). */
export function clampStoryIndex(index: number, pageCount: number): number {
  if (pageCount <= 0) return 0
  return Math.min(Math.max(index, 0), pageCount - 1)
}

export function nextStoryIndex(index: number, pageCount: number): number {
  return clampStoryIndex(index + 1, pageCount)
}

export function prevStoryIndex(index: number, pageCount: number): number {
  return clampStoryIndex(index - 1, pageCount)
}

/** Leading third → previous; trailing two-thirds → next (IG-style). */
export function storyTapZone(x: number, width: number): StoryTapZone {
  if (width <= 0) return "trailing"
  return x < width / 3 ? "leading" : "trailing"
}

/**
 * After dwell completes on `index`: advance, or stay on the last page.
 * Empty sequences close.
 */
export function storyDwellOutcome(
  index: number,
  pageCount: number,
): StoryDwellOutcome {
  if (pageCount <= 0) return "close"
  if (index >= pageCount - 1) return "stay"
  return "advance"
}

/** Commit horizontal page change when drag passes 25% of viewport width. */
export function storySnapIndex(
  current: number,
  deltaX: number,
  pageWidth: number,
  pageCount: number,
): number {
  if (pageCount <= 0 || pageWidth <= 0) return 0
  const threshold = pageWidth * 0.25
  if (deltaX <= -threshold) return nextStoryIndex(current, pageCount)
  if (deltaX >= threshold) return prevStoryIndex(current, pageCount)
  return clampStoryIndex(current, pageCount)
}

/**
 * Cross-fade opacity while the track slides: full at the settled page,
 * falls off linearly across one page width (Apple-style push/pop feel).
 */
export function storyPageOpacity(
  pageIndex: number,
  offsetX: number,
  pageWidth: number,
): number {
  if (pageWidth <= 0) return pageIndex === 0 ? 1 : 0
  const progress = -offsetX / pageWidth
  return Math.max(0, Math.min(1, 1 - Math.abs(progress - pageIndex)))
}
