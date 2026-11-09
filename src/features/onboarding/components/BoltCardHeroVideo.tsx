import { useEffect, useRef, useState } from "react"
import heroVideo from "../assets/bolt-card-hero.mp4"
import heroCover from "../assets/bolt-card-hero-cover.jpg"

function prefersStaticMedia(): boolean {
  if (typeof window === "undefined") return false
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection
  return reduceMotion || Boolean(connection?.saveData)
}

export function BoltCardHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [staticOnly, setStaticOnly] = useState(prefersStaticMedia)
  const [videoFailed, setVideoFailed] = useState(false)

  const useVideo = !staticOnly && !videoFailed

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setStaticOnly(prefersStaticMedia())
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!useVideo || !video) return

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

    const onReady = () => tryPlay()
    video.addEventListener("loadeddata", onReady)
    if (video.readyState >= 2) tryPlay()

    return () => {
      video.removeEventListener("loadeddata", onReady)
      video.pause()
    }
  }, [useVideo])

  if (!useVideo) {
    return (
      <img
        src={heroCover}
        alt=""
        className="onboarding-hero__media"
        draggable={false}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className="onboarding-hero__media"
      src={heroVideo}
      poster={heroCover}
      muted
      playsInline
      loop
      autoPlay
      preload="metadata"
      aria-hidden
      onError={() => setVideoFailed(true)}
    />
  )
}
