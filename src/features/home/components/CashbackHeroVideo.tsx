import { useEffect, useRef, useState } from "react"
import cashbackCoinsVideo from "../assets/cashback-coins.mp4"
import cashbackCoinsPoster from "../assets/cashback-coins-poster.png"
import "./cashback-screen.css"

export interface CashbackHeroVideoProps {
  /** Start fade + playback after the screen has rendered (post nav transition). */
  play: boolean
  reducedMotion: boolean
}

function freezeLastFrame(video: HTMLVideoElement) {
  video.pause()
  if (Number.isFinite(video.duration) && video.duration > 0) {
    video.currentTime = Math.max(0, video.duration - 0.001)
  }
}

/** Figma 9588:212453 — play once, fade in when `play` becomes true, freeze on last frame. */
export function CashbackHeroVideo({ play, reducedMotion }: CashbackHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playedRef = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!play) return
    const frame = window.requestAnimationFrame(() => {
      setVisible(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [play])

  useEffect(() => {
    if (!visible || reducedMotion || playedRef.current) return
    const video = videoRef.current
    if (!video) return

    playedRef.current = true

    const onEnded = () => {
      freezeLastFrame(video)
    }
    video.addEventListener("ended", onEnded)
    video.currentTime = 0
    void video.play().catch(() => {
      freezeLastFrame(video)
    })

    return () => {
      video.removeEventListener("ended", onEnded)
    }
  }, [visible, reducedMotion])

  return (
    <div
      className={["cashback-hero-video", visible ? "is-visible" : ""].filter(Boolean).join(" ")}
    >
      {reducedMotion ? (
        <img
          src={cashbackCoinsPoster}
          alt=""
          width={200}
          height={130}
          className="cashback-hero-video__media"
          aria-hidden
        />
      ) : (
        <video
          ref={videoRef}
          src={cashbackCoinsVideo}
          poster={cashbackCoinsPoster}
          className="cashback-hero-video__media"
          muted
          playsInline
          preload="auto"
          loop={false}
          aria-hidden
        />
      )}
    </div>
  )
}
