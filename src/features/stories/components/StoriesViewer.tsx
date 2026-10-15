import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { createPortal } from "react-dom"
import { Button, GhostButton, Typography } from "@bolteu/kalep-react"
import ArrowBackward from "@bolteu/kalep-react-icons/dist/ArrowBackward"
import { DeviceShellContext } from "@/shared/context/deviceShellContext"
import batteryIcon from "@/shared/assets/status-bar/battery.svg"
import cellularIcon from "@/shared/assets/status-bar/cellular.svg"
import wifiIcon from "@/shared/assets/status-bar/wifi.svg"
import {
  clampStoryIndex,
  nextStoryIndex,
  prevStoryIndex,
  storyDwellOutcome,
  storyPageOpacity,
  storySnapIndex,
  storyTapZone,
} from "../lib/storiesLogic"
import type { StoryPage, StorySequence } from "../stories.types"
import { StoriesProgress } from "./StoriesProgress"
import "../stories.css"

export interface StoriesViewerProps {
  sequence: StorySequence
  onClose: () => void
  onCta?: (page: StoryPage) => void
}

const TAP_MAX_MS = 220

type ViewerPhase = "enter" | "idle" | "exit"

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function StoriesStatusBar() {
  return (
    <div className="stories-viewer__status" aria-hidden>
      <div className="stories-viewer__status-time">12:00</div>
      <div className="stories-viewer__status-island" />
      <div className="stories-viewer__status-levels">
        <img
          src={cellularIcon}
          alt=""
          className="stories-viewer__status-icon stories-viewer__status-icon--cellular"
        />
        <img
          src={wifiIcon}
          alt=""
          className="stories-viewer__status-icon stories-viewer__status-icon--wifi"
        />
        <img
          src={batteryIcon}
          alt=""
          className="stories-viewer__status-icon stories-viewer__status-icon--battery"
        />
      </div>
    </div>
  )
}

export function StoriesViewer({ sequence, onClose, onCta }: StoriesViewerProps) {
  const { portalRoot } = useContext(DeviceShellContext)
  const pages = sequence.pages
  const pageCount = pages.length
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<ViewerPhase>("enter")
  const [paused, setPaused] = useState(true)
  const [fillKey, setFillKey] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [trackOffset, setTrackOffset] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())
  const closingRef = useRef(false)
  const dragRef = useRef({
    active: false,
    axis: "" as "" | "x" | "y",
    startX: 0,
    startY: 0,
    startOffset: 0,
    moved: false,
    startedAt: 0,
  })
  const reducedRef = useRef(prefersReducedMotion())

  const writeOffset = useCallback((px: number) => {
    trackRef.current?.style.setProperty("--stories-x", `${px}px`)
    setTrackOffset(px)
  }, [])

  const pageWidth = () => viewportRef.current?.clientWidth ?? 0

  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setPaused(true)
    setPhase("exit")
  }, [])

  const goTo = useCallback(
    (next: number) => {
      if (closingRef.current) return
      const clamped = clampStoryIndex(next, pageCount)
      setIndex(clamped)
      setFillKey((key) => key + 1)
      setPaused(false)
      if (!reducedRef.current) {
        writeOffset(-clamped * pageWidth())
      }
    },
    [pageCount, writeOffset],
  )

  useEffect(() => {
    reducedRef.current = prefersReducedMotion()
    if (!reducedRef.current) {
      writeOffset(-index * pageWidth())
    }
  }, [index, writeOffset])

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (i === index && !paused && phase === "idle") {
        void video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [index, paused, phase])

  const handleDwellComplete = useCallback(() => {
    if (paused || phase !== "idle") return
    const outcome = storyDwellOutcome(index, pageCount)
    if (outcome === "close") {
      requestClose()
      return
    }
    if (outcome === "stay") return
    goTo(nextStoryIndex(index, pageCount))
  }, [goTo, index, pageCount, paused, phase, requestClose])

  const handlePhaseAnimationEnd = (event: ReactAnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (phase === "enter") {
      setPhase("idle")
      setPaused(false)
      setFillKey((key) => key + 1)
      return
    }
    if (phase === "exit") {
      onClose()
    }
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (phase !== "idle") return
    if ((event.target as HTMLElement).closest("[data-stories-control]")) {
      return
    }
    const width = pageWidth()
    dragRef.current = {
      active: true,
      axis: "",
      startX: event.clientX,
      startY: event.clientY,
      startOffset: -index * width,
      moved: false,
      startedAt: performance.now(),
    }
    setPaused(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
      drag.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y"
      if (drag.axis === "x") setDragging(true)
    }
    if (drag.axis !== "x" || reducedRef.current) return
    drag.moved = Math.abs(dx) > 8
    writeOffset(drag.startOffset + dx)
  }

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active) return
    drag.active = false
    setDragging(false)

    const dx = event.clientX - drag.startX
    const width = pageWidth()
    const elapsed = performance.now() - drag.startedAt

    if (drag.axis === "x" && drag.moved && !reducedRef.current) {
      goTo(storySnapIndex(index, dx, width, pageCount))
      return
    }

    if (!drag.moved && elapsed <= TAP_MAX_MS) {
      const localX =
        event.clientX - (viewportRef.current?.getBoundingClientRect().left ?? 0)
      const zone = storyTapZone(localX, width)
      if (zone === "leading") {
        goTo(prevStoryIndex(index, pageCount))
      } else if (index < pageCount - 1) {
        goTo(nextStoryIndex(index, pageCount))
      } else {
        // Last page: content tap must not close — only CTA or back.
        setPaused(false)
      }
      return
    }

    setPaused(false)
  }

  const activePage = pages[index]
  if (!activePage || pageCount === 0) return null

  const handleCta = () => {
    if (onCta) {
      onCta(activePage)
      return
    }
    if (index >= pageCount - 1) requestClose()
    else goTo(nextStoryIndex(index, pageCount))
  }

  const content = (
    <div
      className="stories-viewer"
      data-tone={activePage.tone}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label={activePage.title}
      onAnimationEnd={handlePhaseAnimationEnd}
    >
      <div className="stories-viewer__chrome">
        <StoriesStatusBar />
        <div className="stories-viewer__toolbar">
          <div data-stories-control>
            <GhostButton onClick={requestClose} aria-label="Back">
              <ArrowBackward size="lg" className="stories-viewer__back-icon" />
            </GhostButton>
          </div>
        </div>
        <StoriesProgress
          pageCount={pageCount}
          activeIndex={index}
          paused={paused || phase !== "idle"}
          fillKey={fillKey}
          onDwellComplete={handleDwellComplete}
        />
      </div>

      <div className="stories-viewer__sheet">
        <div
          ref={viewportRef}
          className="stories-viewer__viewport"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
        >
          <div
            ref={trackRef}
            className={["stories-viewer__track", dragging ? "is-dragging" : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {pages.map((page, pageIndex) => {
              const width = pageWidth()
              const opacity = reducedRef.current
                ? pageIndex === index
                  ? 1
                  : 0
                : storyPageOpacity(pageIndex, trackOffset, width)
              return (
                <div
                  key={page.id}
                  className={[
                    "stories-viewer__page",
                    pageIndex === index ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    {
                      "--stories-page-opacity": String(opacity),
                    } as CSSProperties
                  }
                >
                  <div className="stories-viewer__body">
                    <div className="stories-viewer__copy">
                      <Typography
                        variant="heading-l-accent"
                        color="primary"
                        as="h1"
                      >
                        {page.title}
                      </Typography>
                      <Typography
                        variant="body-l-regular"
                        color="primary"
                        as="p"
                      >
                        {page.body}
                      </Typography>
                    </div>
                    <div className="stories-viewer__media">
                      {page.media.kind === "image" ? (
                        <img
                          src={page.media.src}
                          alt={page.media.alt}
                          draggable={false}
                        />
                      ) : null}
                      {page.media.kind === "video" ? (
                        <video
                          ref={(el) => {
                            if (el) videoRefs.current.set(pageIndex, el)
                            else videoRefs.current.delete(pageIndex)
                          }}
                          src={page.media.src}
                          poster={page.media.poster}
                          muted
                          playsInline
                          loop
                          preload="metadata"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {activePage.ctaLabel ? (
          <div className="stories-viewer__cta" data-stories-control>
            <Button size="lg" variant="primary" fullWidth onClick={handleCta}>
              {activePage.ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )

  if (portalRoot) {
    return createPortal(content, portalRoot)
  }
  return content
}
