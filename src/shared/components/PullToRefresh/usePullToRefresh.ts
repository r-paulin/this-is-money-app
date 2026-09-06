import { useCallback, useEffect, useRef, useState } from "react"

const PULL_RESISTANCE = 0.45
const PULL_MAX_PX = 80
const COMMIT_THRESHOLD_PX = 60
const PILL_EXIT_MS = 250
const MIN_PILL_VISIBLE_MS = 800
const DRAG_ARM_THRESHOLD_PX = 10
const EDGE_ZONE_PX = 20

const INTERACTIVE_SELECTOR =
  "button, a, input, textarea, select, label, [role='button'], [contenteditable='true']"

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(target.closest(INTERACTIVE_SELECTOR))
}

function applyResistance(rawDelta: number) {
  return Math.min(rawDelta * PULL_RESISTANCE, PULL_MAX_PX)
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export type PullToRefreshPhase = "idle" | "pulling" | "refreshing" | "exit"
export type PillVisibility = "hidden" | "enter" | "visible" | "exit"

function waitForNextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  disabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  disabled = false,
}: UsePullToRefreshOptions) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [phase, setPhase] = useState<PullToRefreshPhase>("idle")
  const [pillVisibility, setPillVisibility] = useState<PillVisibility>("hidden")

  const dragRef = useRef({
    pending: false,
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    currentPullDistance: 0,
  })
  const refreshingRef = useRef(false)
  const mountedRef = useRef(true)
  const phaseRef = useRef<PullToRefreshPhase>("idle")

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      refreshingRef.current = false
    }
  }, [])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const resetPull = useCallback(() => {
    if (!mountedRef.current) return
    setPullDistance(0)
    setPhase("idle")
    setPillVisibility("hidden")
  }, [])

  const releaseCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    [],
  )

  const abortDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      drag.pending = false
      drag.active = false
      releaseCapture(event)

      if (!mountedRef.current || refreshingRef.current) return

      setPullDistance(0)
      if (phaseRef.current === "pulling") {
        setPhase("idle")
      }
    },
    [releaseCapture],
  )

  const runRefresh = useCallback(async () => {
    if (refreshingRef.current) return
    refreshingRef.current = true
    setPhase("refreshing")
    setPullDistance(COMMIT_THRESHOLD_PX)
    setPillVisibility("enter")
    await waitForNextFrame()
    if (!mountedRef.current) {
      refreshingRef.current = false
      return
    }
    setPillVisibility("visible")

    const refreshStartedAt = Date.now()

    try {
      await onRefresh()
    } catch {
      // Prototype: ignore refresh errors and still hide the pill.
    }

    if (!mountedRef.current) {
      refreshingRef.current = false
      return
    }

    const elapsed = Date.now() - refreshStartedAt
    if (elapsed < MIN_PILL_VISIBLE_MS) {
      await wait(MIN_PILL_VISIBLE_MS - elapsed)
    }

    if (!mountedRef.current) {
      refreshingRef.current = false
      return
    }

    if (prefersReducedMotion()) {
      resetPull()
      refreshingRef.current = false
      return
    }

    setPhase("exit")
    setPillVisibility("exit")
    setPullDistance(0)
    await wait(PILL_EXIT_MS)

    if (!mountedRef.current) {
      refreshingRef.current = false
      return
    }
    resetPull()
    refreshingRef.current = false
  }, [onRefresh, resetPull])

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || refreshingRef.current || event.button !== 0) return
      if (isInteractiveTarget(event.target)) return
      if (event.clientX <= EDGE_ZONE_PX) return

      const scrollEl = scrollRef.current
      if (!scrollEl || scrollEl.scrollTop > 0) return

      dragRef.current = {
        pending: true,
        active: false,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        currentPullDistance: 0,
      }
    },
    [disabled],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (event.pointerId !== drag.pointerId) return
      if (!drag.pending && !drag.active) return

      const scrollEl = scrollRef.current
      if (!scrollEl || scrollEl.scrollTop > 0) {
        abortDrag(event)
        return
      }

      const deltaX = event.clientX - drag.startX
      const rawDelta = event.clientY - drag.startY

      if (!drag.active) {
        if (Math.abs(deltaX) < DRAG_ARM_THRESHOLD_PX && Math.abs(rawDelta) < DRAG_ARM_THRESHOLD_PX) {
          return
        }

        if (Math.abs(deltaX) > Math.abs(rawDelta)) {
          drag.pending = false
          return
        }

        if (rawDelta <= 0) {
          drag.pending = false
          return
        }

        drag.active = true
        drag.pending = false
        event.currentTarget.setPointerCapture(event.pointerId)
      }

      if (rawDelta <= 0) {
        drag.currentPullDistance = 0
        setPullDistance(0)
        if (phaseRef.current === "pulling") {
          setPhase("idle")
        }
        return
      }

      event.preventDefault()

      const distance = prefersReducedMotion()
        ? rawDelta >= COMMIT_THRESHOLD_PX
          ? COMMIT_THRESHOLD_PX
          : rawDelta
        : applyResistance(rawDelta)

      drag.currentPullDistance = distance
      setPullDistance(distance)
      setPhase("pulling")
    },
    [abortDrag],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (event.pointerId !== drag.pointerId) return
      if (!drag.pending && !drag.active) return

      const wasActive = drag.active
      drag.pending = false
      drag.active = false
      releaseCapture(event)

      if (!wasActive) return

      const distance = drag.currentPullDistance
      if (distance >= COMMIT_THRESHOLD_PX) {
        void runRefresh()
      } else {
        setPullDistance(0)
        setPhase("idle")
      }
    },
    [releaseCapture, runRefresh],
  )

  const onPointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current
      if (event.pointerId !== drag.pointerId) return
      if (!drag.pending && !drag.active) return

      abortDrag(event)
    },
    [abortDrag],
  )

  const isDragging = phase === "pulling"
  const isRefreshing = phase === "refreshing" || phase === "exit"

  return {
    scrollRef,
    pullDistance,
    phase,
    pillVisibility,
    isDragging,
    isRefreshing,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  }
}
