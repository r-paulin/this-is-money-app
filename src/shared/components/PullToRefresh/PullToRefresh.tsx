import type { ReactNode } from "react"
import { RefreshStatusPill } from "./RefreshStatusPill"
import "./pull-to-refresh.css"
import { usePullToRefresh } from "./usePullToRefresh"

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function PullToRefresh({
  onRefresh,
  children,
  className = "",
  disabled = false,
}: PullToRefreshProps) {
  const { scrollRef, pullDistance, pillVisibility, isDragging, isRefreshing, handlers } =
    usePullToRefresh({ onRefresh, disabled })

  const showPill = pillVisibility !== "hidden"

  return (
    <div
      ref={scrollRef}
      className={[
        "h-dvh touch-pan-y overflow-y-auto overscroll-y-contain bg-layer-floor-0-grouped",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-busy={isRefreshing}
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
    >
      <div className="pull-to-refresh__pill-host" aria-hidden={!showPill}>
        <div
          className={[
            "pull-to-refresh__pill",
            pillVisibility === "visible" ? "pull-to-refresh__pill--visible" : "",
            pillVisibility === "exit" ? "pull-to-refresh__pill--exit" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {showPill ? <RefreshStatusPill /> : null}
        </div>
      </div>

      <div
        className={[
          "pull-to-refresh__content",
          isDragging ? "pull-to-refresh__content--dragging" : "",
          isRefreshing ? "pull-to-refresh__content--refreshing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}