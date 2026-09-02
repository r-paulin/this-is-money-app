import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { isNavLayerAnimationEvent } from "./navAnimation"
import {
  getInteractiveTransforms,
  useEdgeSwipeBack,
} from "./useEdgeSwipeBack"
import { useNavigationStack } from "./useNavigationStack"

type LayerRole = "top" | "below" | "cached"

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
    pop,
    dragOffset,
    setDragOffset,
    isDragging,
    setIsDragging,
  } = useNavigationStack()

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const topIndex = stack.length - 1
  const belowIndex = stack.length - 2
  const showBelow = isTransitioning || isDragging

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
    }, 150)

    return () => window.clearTimeout(timer)
  }, [completeTransition, direction, isTransitioning, reducedMotion, stack.length])

  const handleAnimationEnd = useCallback(
    (event: React.AnimationEvent<HTMLElement>) => {
      if (reducedMotion) return
      if (!isTransitioning || isDragging) return
      if (event.currentTarget.dataset.layerRole !== "top") return
      if (!isNavLayerAnimationEvent(event)) return

      completeTransition()
    },
    [completeTransition, isDragging, isTransitioning, reducedMotion],
  )

  const handleCommitPop = useCallback(() => {
    setIsDragging(false)
    setDragOffset(0)
    pop()
  }, [pop, setDragOffset, setIsDragging])

  const { edgeSwipeHandlers, resetDrag } = useEdgeSwipeBack({
    enabled: canPop && !isTransitioning,
    containerRef,
    onCommitPop: handleCommitPop,
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
    onDragMove: setDragOffset,
  })

  const stackDirection = isDragging
    ? "drag"
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

    if (isDragging && dragOffset > 0) {
      const width = containerRef.current?.getBoundingClientRect().width ?? 0
      const progress = width > 0 ? dragOffset / width : 0

      if (progress < 0.5) {
        resetDrag()
      }
    }
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
