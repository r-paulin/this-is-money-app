import { useCallback, useRef, useState } from "react"
import { bannerSliderIsSingle } from "../lib/homeScreenLogic"
import type { HomeBannerId } from "../home.types"
import { filterEligibleBanners } from "../lib/homeScreenLogic"
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
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || single) return

    const slide = track.querySelector<HTMLElement>("[data-banner-slide]")
    const slideWidth = slide?.offsetWidth ?? 1
    const gap = 12
    const edgeInset = 12
    const index = Math.round((track.scrollLeft - edgeInset) / (slideWidth + gap))
    setActiveIndex(Math.min(Math.max(index, 0), visible.length - 1))
  }, [single, visible.length])

  if (visible.length === 0) return null

  return (
    <section aria-label="Promotions" className="bg-layer-floor-0-grouped">
      <div
        className={[
          "banner-slider__viewport",
          single ? "banner-slider__viewport--single" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          ref={trackRef}
          className="banner-slider__track"
          onScroll={handleScroll}
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
            {visible.map((id, index) => (
              <div
                key={id}
                className={[
                  "banner-slider__dot",
                  index === activeIndex ? "banner-slider__dot--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
