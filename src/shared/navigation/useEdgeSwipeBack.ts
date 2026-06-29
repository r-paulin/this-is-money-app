import { useCallback, useRef } from "react"

const EDGE_ZONE_PX = 20
const COMMIT_THRESHOLD = 0.5

interface UseEdgeSwipeBackOptions {
  enabled: boolean
  containerRef: React.RefObject<HTMLElement | null>
  onCommitPop: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onDragMove: (offsetPx: number) => void
}

export function useEdgeSwipeBack({
  enabled,
  containerRef,
  onCommitPop,
  onDragStart,
  onDragEnd,
  onDragMove,
}: UseEdgeSwipeBackOptions) {
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    locked: false,
    horizontal: false,
  })

  const resetDrag = useCallback(() => {
    dragRef.current = {
      active: false,
      pointerId: -1,
      startX: 0,
      startY: 0,
      locked: false,
      horizontal: false,
    }
    onDragEnd()
    onDragMove(0)
  }, [onDragEnd, onDragMove])

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0) return

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const localX = event.clientX - rect.left

      if (localX > EDGE_ZONE_PX) return

      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        locked: false,
        horizontal: false,
      }

      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [containerRef, enabled],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag.active || event.pointerId !== drag.pointerId) return

      const deltaX = event.clientX - drag.startX
      const deltaY = event.clientY - drag.startY

      if (!drag.locked) {
        if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          drag.active = false
          event.currentTarget.releasePointerCapture(event.pointerId)
          return
        }

        if (deltaX <= 0) {
          drag.active = false
          event.currentTarget.releasePointerCapture(event.pointerId)
          return
        }

        drag.locked = true
        drag.horizontal = true
        onDragStart()
      }

      const container = containerRef.current
      const width = container?.getBoundingClientRect().width ?? window.innerWidth
      const clamped = Math.max(0, Math.min(deltaX, width))

      onDragMove(clamped)
    },
    [containerRef, onDragMove, onDragStart],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag.active || event.pointerId !== drag.pointerId) return

      if (drag.horizontal) {
        const container = containerRef.current
        const width = container?.getBoundingClientRect().width ?? window.innerWidth
        const deltaX = event.clientX - drag.startX
        const progress = deltaX / width

        if (progress >= COMMIT_THRESHOLD) {
          onCommitPop()
        } else {
          resetDrag()
        }
      }

      dragRef.current.active = false
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    [containerRef, onCommitPop, resetDrag],
  )

  const onPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag.active || event.pointerId !== drag.pointerId) return

      resetDrag()
      dragRef.current.active = false

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    [resetDrag],
  )

  return {
    edgeSwipeHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
    resetDrag,
  }
}

export function getInteractiveTransforms(
  dragOffset: number,
  containerWidth: number,
  parallaxRatio = 0.33,
): { top: string; below: string } {
  const parallaxPx = containerWidth * parallaxRatio
  const progress = containerWidth > 0 ? dragOffset / containerWidth : 0

  return {
    top: `translateX(${dragOffset}px)`,
    below: `translateX(${-parallaxPx + progress * parallaxPx}px)`,
  }
}
