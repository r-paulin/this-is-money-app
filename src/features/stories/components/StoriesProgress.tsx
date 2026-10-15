export interface StoriesProgressProps {
  pageCount: number
  activeIndex: number
  paused: boolean
  /** Remount key so the active fill restarts after a manual page change. */
  fillKey: number
  onDwellComplete: () => void
}

export function StoriesProgress({
  pageCount,
  activeIndex,
  paused,
  fillKey,
  onDwellComplete,
}: StoriesProgressProps) {
  return (
    <div className="stories-viewer__progress" aria-hidden>
      {Array.from({ length: pageCount }, (_, index) => {
        const isComplete = index < activeIndex
        const isActive = index === activeIndex
        return (
          <div
            key={index}
            className={[
              "stories-viewer__segment",
              isComplete ? "is-complete" : "",
              isActive ? "is-active" : "",
              isActive && paused ? "is-paused" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {isActive ? (
              <span
                key={fillKey}
                className="stories-viewer__segment-fill"
                onAnimationEnd={onDwellComplete}
              />
            ) : (
              <span className="stories-viewer__segment-fill" />
            )}
          </div>
        )
      })}
    </div>
  )
}
