import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TransitionEvent } from "react"
import { Typography } from "@bolteu/kalep-react"
import Cross from "@bolteu/kalep-react-icons/dist/Cross"
import {
  HOME_BANNER_CONTENT,
  bannerBodyPlainText,
} from "../data/homeBannerContent"
import type { HomeBannerId } from "../home.types"
import "./home-banner.css"

export interface HomeBannerProps {
  id: HomeBannerId
  onDismiss: () => void
  className?: string
}

type MediaPhase = "primary" | "placeholder" | "gone"

/** Matches --banner-dismiss-dur / --motion-duration-sm; fallback if transitionend is skipped. */
const DISMISS_MS = 200

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function prefersStaticMedia(): boolean {
  if (typeof window === "undefined") return false
  const reduceMotion = prefersReducedMotion()
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection
  return reduceMotion || Boolean(connection?.saveData)
}

export function HomeBanner({ id, onDismiss, className = "" }: HomeBannerProps) {
  const content = HOME_BANNER_CONTENT[id]
  const plainText = bannerBodyPlainText(content.body)
  const [mediaPhase, setMediaPhase] = useState<MediaPhase>("primary")
  const [staticOnly, setStaticOnly] = useState(prefersStaticMedia)
  const [videoFailed, setVideoFailed] = useState(false)
  const [closing, setClosing] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const dismissTimerRef = useRef<number | null>(null)
  const dismissedRef = useRef(false)

  const useVideo =
    Boolean(content.media.videoSrc) && !staticOnly && !videoFailed && mediaPhase === "primary"

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setStaticOnly(prefersStaticMedia())
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const root = rootRef.current
    if (!useVideo || !video || !root || closing) return

    // React does not always apply the muted DOM property; autoplay requires it.
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true

    const tryPlay = () => {
      void video.play().catch(() => {
        video.muted = true
        void video.play().catch(() => setVideoFailed(true))
      })
    }

    const scrollRoot = root.closest(".banner-slider__viewport")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          tryPlay()
        } else {
          video.pause()
        }
      },
      { root: scrollRoot, threshold: [0, 0.35, 0.5, 1] },
    )
    observer.observe(root)

    const onReady = () => tryPlay()
    video.addEventListener("loadeddata", onReady)
    if (video.readyState >= 2) tryPlay()

    return () => {
      observer.disconnect()
      video.removeEventListener("loadeddata", onReady)
    }
  }, [useVideo, id, closing])

  const finishDismiss = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
    onDismiss()
  }

  const activate = () => {
    if (closing) return
    console.info("[stub] Banner action:", id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      activate()
    }
  }

  const handleDismiss = (event: MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    if (closing || dismissedRef.current) return

    setClosing(true)
    dismissTimerRef.current = window.setTimeout(finishDismiss, DISMISS_MS)
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (!closing) return
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== "opacity" && event.propertyName !== "transform") return
    finishDismiss()
  }

  const handleImageError = () => {
    setMediaPhase((current) => (current === "primary" ? "placeholder" : "gone"))
  }

  const imageSrc =
    mediaPhase === "placeholder" ? content.media.placeholderSrc : content.media.imageSrc

  return (
    <article
      ref={rootRef}
      role="link"
      tabIndex={closing ? -1 : 0}
      aria-hidden={closing || undefined}
      aria-label={plainText}
      onClick={activate}
      onKeyDown={handleKeyDown}
      onTransitionEnd={handleTransitionEnd}
      className={[
        "home-banner relative flex w-full overflow-hidden rounded-card bg-layer-floor-1",
        closing ? "is-closing" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {content.backgroundClass ? (
        <div
          className={["pointer-events-none absolute inset-0 rounded-[inherit]", content.backgroundClass].join(
            " ",
          )}
          aria-hidden
        />
      ) : null}
      <div className="home-banner__text-col relative">
        {/* Single wrapper so -webkit-line-clamp wraps continuous text, not each segment */}
        <p className="home-banner__body m-0">
          <span>
            {content.body.map((segment, index) => (
              <Typography
                key={`${id}-${index}`}
                variant={
                  segment.bold ? "body-m-compact-accent" : "body-m-compact-regular"
                }
                color="primary"
                as="span"
                inline
              >
                {segment.text}
              </Typography>
            ))}
          </span>
        </p>
      </div>

      {mediaPhase !== "gone" ? (
        <div className="home-banner__media-wrap relative" aria-hidden>
          {useVideo && content.media.videoSrc ? (
            <video
              ref={videoRef}
              className="home-banner__media"
              src={content.media.videoSrc}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              poster={content.media.imageSrc}
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <img
              src={imageSrc}
              alt=""
              className="home-banner__media"
              width={100}
              height={92}
              onError={handleImageError}
            />
          )}
        </div>
      ) : null}

      <button
        type="button"
        className="home-banner__close-hit"
        aria-label="Dismiss"
        disabled={closing}
        onClick={handleDismiss}
      >
        <span className="home-banner__close-fill">
          <Cross className="home-banner__close-icon text-secondary" aria-hidden />
        </span>
      </button>
    </article>
  )
}
