import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import {
  bannerSliderIsSingle,
  bannerSnapIndex,
  filterEligibleBanners,
} from "../lib/homeScreenLogic"
import type { HomeBannerId } from "../home.types"
import { HomeBanner } from "./HomeBanner"
import "./home-banner.css"

export interface BannerSliderProps {
  bannerIds: HomeBannerId[]
  physicalOrdered: boolean
  onDismiss: (id: HomeBannerId) => void
}

export function BannerSlider({
  bannerIds,
  physicalOrdered,
  onDismiss,
}: BannerSliderProps) {
  const visible = filterEligibleBanners(bannerIds, physicalOrdered)
  const single = bannerSliderIsSingle(visible.length)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({
    active: false,
    axis: "" as "" | "x" | "y",
    startX: 0,
    startY: 0,
    startOffset: 0,
    moved: false,
  })
  const suppressClick = useRef(false)
  const placedX = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Dot spacing follows the pill after it arrives. Updating both at once
  // slides the circles back through the pill.
  const [dotShiftIndex, setDotShiftIndex] = useState(0)

  const measureStep = useCallback(() => {
    const track = trackRef.current
    const slide = track?.querySelector<HTMLElement>("[data-banner-slide]")
    const width = slide?.offsetWidth ?? 0
    const gap = track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0
    return width + gap
  }, [])

  const writeOffset = useCallback((px: number) => {
    trackRef.current?.style.setProperty("--banner-x", `${px}px`)
  }, [])

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(visible.length - 1, 0)))
  }, [visible.length])

  useEffect(() => {
    if (single || dragRef.current.active) return
    const track = trackRef.current
    if (!track) return
    const x = -activeIndex * measureStep()
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const firstPlace = placedX.current === null
    const unchanged = placedX.current === x
    placedX.current = x
    if (unchanged) return
    if (!reduced || firstPlace) {
      writeOffset(x)
      return
    }
    track.style.opacity = "0"
    const ms =
      parseFloat(getComputedStyle(track).getPropertyValue("--motion-duration-sm")) || 0
    const timer = window.setTimeout(() => {
      writeOffset(x)
      track.style.opacity = "1"
    }, ms)
    return () => window.clearTimeout(timer)
  }, [activeIndex, measureStep, single, visible.length, writeOffset])

  useEffect(() => {
    const node = viewportRef.current
    if (!node || single) return
    let locked = false
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      if (locked || Math.abs(event.deltaX) < 8) return
      const track = trackRef.current
      if (!track) return
      locked = true
      const step = measureStep()
      setActiveIndex((current) =>
        bannerSnapIndex(current, event.deltaX > 0 ? -step : step, step, visible.length),
      )
      const ms = parseFloat(
        getComputedStyle(track).getPropertyValue("--motion-spring-smooth-duration"),
      )
      window.setTimeout(() => {
        locked = false
      }, ms || 0)
    }
    node.addEventListener("wheel", onWheel, { passive: false })
    return () => node.removeEventListener("wheel", onWheel)
  }, [measureStep, single, visible.length])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (single) return
    if ((event.target as HTMLElement).closest("button")) return
    const drag = dragRef.current
    drag.active = true
    drag.axis = ""
    drag.startX = event.clientX
    drag.startY = event.clientY
    drag.startOffset = -activeIndex * measureStep()
    drag.moved = false
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
      drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      if (drag.axis === "y") {
        drag.active = false
        return
      }
      trackRef.current?.classList.add("is-dragging")
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (drag.axis !== "x") return
    drag.moved = true
    const last = Math.max(visible.length - 1, 0)
    const step = measureStep()
    const min = -last * step
    writeOffset(Math.min(0, Math.max(min, drag.startOffset + dx)))
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active && drag.axis !== "x") return
    const wasDragging = drag.axis === "x"
    const dx = event.clientX - drag.startX
    drag.active = false
    drag.axis = ""
    trackRef.current?.classList.remove("is-dragging")
    if (!wasDragging) return
    if (drag.moved) suppressClick.current = true
    const track = trackRef.current
    const step = measureStep()
    const next = bannerSnapIndex(activeIndex, dx, step, visible.length)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (track && !reduced) {
      const min = -Math.max(visible.length - 1, 0) * step
      const dragged = Math.min(0, Math.max(min, drag.startOffset + dx))
      track.classList.add("is-dragging")
      writeOffset(dragged)
      track.getBoundingClientRect()
      track.classList.remove("is-dragging")
      track.getBoundingClientRect()
      writeOffset(-next * step)
      placedX.current = -next * step
    }
    setActiveIndex(next)
  }

  if (visible.length === 0) return null

  return (
    <section aria-label="Promotions" className="bg-layer-floor-0-grouped">
      <div
        ref={viewportRef}
        className={[
          "banner-slider__viewport",
          single ? "banner-slider__viewport--single" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (!suppressClick.current) return
          suppressClick.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <div
          ref={trackRef}
          className={[
            "banner-slider__track",
            single ? "" : "banner-slider__track--multi",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {visible.map((id) => (
            <div
              key={id}
              data-banner-slide
              className={[
                "banner-slider__slide",
                single ? "banner-slider__slide--single" : "banner-slider__slide--multi",
              ].join(" ")}
            >
              <HomeBanner
                id={id}
                onDismiss={() => onDismiss(id)}
                className="h-full w-full flex-1"
              />
            </div>
          ))}
        </div>

        {!single ? (
          <div className="banner-slider__dots" aria-hidden>
            <div
              className="banner-slider__indicator"
              style={{ "--dot-index": activeIndex } as CSSProperties}
              onTransitionEnd={(event) => {
                if (event.propertyName !== "transform") return
                setDotShiftIndex(activeIndex)
              }}
            />
            {visible.map((id, index) => (
              <div
                key={id}
                className={[
                  "banner-slider__dot",
                  index === activeIndex ? "banner-slider__dot--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ "--dot-shift": index > dotShiftIndex ? 1 : 0 } as CSSProperties}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
