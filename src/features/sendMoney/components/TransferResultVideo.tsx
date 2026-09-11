import { useEffect, useRef, useState } from "react"

const VIDEO_ENTER_DELAY_MS = 100

export interface TransferResultVideoProps {
  src: string
  reducedMotion: boolean
}

/** Autoplaying result illustration — enters after a short delay, no loop. */
export function TransferResultVideo({ src, reducedMotion }: TransferResultVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return

    const timer = window.setTimeout(() => {
      setVisible(true)
    }, VIDEO_ENTER_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    if (!visible) return
    const video = videoRef.current
    if (!video) return

    void video.play().catch(() => {
      // Autoplay may be blocked; first frame still shows after enter animation.
    })
  }, [visible, src])

  return (
    <div
      className={[
        "send-money-result__video-frame",
        visible ? "is-visible" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <video
        ref={videoRef}
        src={src}
        className="send-money-result__video"
        muted
        playsInline
        preload="auto"
        loop={false}
        aria-hidden
      />
    </div>
  )
}
