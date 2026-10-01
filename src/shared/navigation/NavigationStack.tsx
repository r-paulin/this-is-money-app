import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { isNavLayerAnimationEvent } from "./navAnimation"
import {
  getInteractiveTransforms,
  NAV_PARALLAX_RATIO,
  useEdgeSwipeBack,
} from "./useEdgeSwipeBack"
import { useNavigationStack } from "./useNavigationStack"

type LayerRole = "top" | "below" | "cached"

/** Matches --motion-duration-sm. The fade does not end the stack transition. */
const REDUCED_MOTION_NAV_MS = 200

function parallaxOffset(offsetPx: number, width: number): number {
  const progress = width > 0 ? offsetPx / width : 0
  return -width * NAV_PARALLAX_RATIO + progress * width * NAV_PARALLAX_RATIO
}

function layerClassName(role: LayerRole): string {
  switch (role) {
    case "top":
      return "nav-layer nav-layer--top"
    case "below":
      return "nav-layer nav-layer--below"
    case "cached":
      return "nav-layer nav-layer--cached"
  }
}

export function NavigationStack() {
  const {
    stack,
    direction,
    isTransitioning,
    completeTransition,
    reducedMotion,
    canPop,
    commitDragPop,
    dragOffset,
    setDragOffset,
    isDragging,
    setIsDragging,
  } = useNavigationStack()

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [settling, setSettling] = useState(false)

  const topIndex = stack.length - 1
  const belowIndex = stack.length - 2
  const showBelow = isTransitioning || isDragging || settling

  const clearNavOrigin = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.style.removeProperty("--nav-pop-top-from")
    el.style.removeProperty("--nav-pop-below-from")
    el.style.removeProperty("--nav-settle-top-from")
    el.style.removeProperty("--nav-settle-below-from")
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateWidth = () => {
      setContainerWidth(container.getBoundingClientRect().width)
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!isTransitioning || !direction || !reducedMotion) return

    const timer = window.setTimeout(() => {
      completeTransition()
    }, REDUCED_MOTION_NAV_MS)

    return () => window.clearTimeout(timer)
  }, [completeTransition, direction, isTransitioning, reducedMotion, stack.length])

  const handleAnimationEnd = useCallback(
    (event: React.AnimationEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.animationName === "nav-settle-top") {
        setSettling(false)
        clearNavOrigin()
        return
      }
      if (reducedMotion) return
      if (!isTransitioning || isDragging) return
      if (event.currentTarget.dataset.layerRole !== "top") return
      if (!isNavLayerAnimationEvent(event)) return

      clearNavOrigin()
      completeTransition()
    },
    [clearNavOrigin, completeTransition, isDragging, isTransitioning, reducedMotion],
  )

  const handleCommitPop = useCallback(
    (offsetPx: number) => {
      const el = containerRef.current
      const width = el?.getBoundingClientRect().width ?? 0
      if (el && width > 0 && offsetPx > 0) {
        el.style.setProperty("--nav-pop-top-from", `${offsetPx}px`)
        el.style.setProperty("--nav-pop-below-from", `${parallaxOffset(offsetPx, width)}px`)
      }
      commitDragPop()
    },
    [commitDragPop],
  )

  const handleCancelDrag = useCallback(
    (offsetPx: number) => {
      const el = containerRef.current
      const width = el?.getBoundingClientRect().width ?? 0
      if (reducedMotion || !el || width <= 0 || offsetPx <= 0) {
        setIsDragging(false)
        setDragOffset(0)
        return
      }
      el.style.setProperty("--nav-settle-top-from", `${offsetPx}px`)
      el.style.setProperty("--nav-settle-below-from", `${parallaxOffset(offsetPx, width)}px`)
      setSettling(true)
      setIsDragging(false)
      setDragOffset(0)
    },
    [reducedMotion, setDragOffset, setIsDragging],
  )

  const { edgeSwipeHandlers } = useEdgeSwipeBack({
    enabled: canPop && !isTransitioning && !settling,
    containerRef,
    onCommitPop: handleCommitPop,
    onCancelDrag: handleCancelDrag,
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
    onDragMove: setDragOffset,
  })

  const stackDirection = isDragging
    ? "drag"
    : settling
      ? "settle"
      : isTransitioning && direction
        ? direction
        : "idle"

  const interactiveTransforms =
    isDragging && containerWidth > 0
      ? getInteractiveTransforms(dragOffset, containerWidth)
      : null

  const getLayerStyle = (
    role: "top" | "below",
  ): React.CSSProperties | undefined => {
    if (!interactiveTransforms) return undefined

    return {
      transform: role === "top" ? interactiveTransforms.top : interactiveTransforms.below,
      transition: "none",
      animation: "none",
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    edgeSwipeHandlers.onPointerUp(event)
  }

  const getLayerRole = (index: number): LayerRole => {
    if (index === topIndex) return "top"
    if (showBelow && index === belowIndex) return "below"
    return "cached"
  }

  return (
    <div
      ref={containerRef}
      className="nav-stack"
      data-direction={stackDirection}
      onPointerDown={edgeSwipeHandlers.onPointerDown}
      onPointerMove={edgeSwipeHandlers.onPointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={edgeSwipeHandlers.onPointerCancel}
    >
      {stack.map((entry, index) => {
        const role = getLayerRole(index)
        const layerRole = role === "cached" ? undefined : role

        return (
          <div
            key={entry.key}
            className={layerClassName(role)}
            data-layer-role={layerRole}
            aria-hidden={role === "below" || role === "cached" ? true : undefined}
            style={layerRole ? getLayerStyle(layerRole) : undefined}
            onAnimationEnd={role === "top" ? handleAnimationEnd : undefined}
          >
            {entry.render()}
          </div>
        )
      })}
    </div>
  )
}
