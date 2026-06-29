import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  getInteractiveTransforms,
  useEdgeSwipeBack,
} from "./useEdgeSwipeBack"
import { useNavigationStack } from "./useNavigationStack"

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
      {showBelow && belowIndex >= 0 ? (
        <div
          key={stack[belowIndex].key}
          className="nav-layer nav-layer--below"
          data-layer-role="below"
          aria-hidden
          style={getLayerStyle("below")}
        >
          {stack[belowIndex].render()}
        </div>
      ) : null}

      <div
        key={stack[topIndex].key}
        className="nav-layer nav-layer--top"
        data-layer-role="top"
        style={getLayerStyle("top")}
        onAnimationEnd={handleAnimationEnd}
      >
        {stack[topIndex].render()}
      </div>
    </div>
  )
}
