import { GhostButton, Typography } from "@bolteu/kalep-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import "@/shared/styles/text-stagger.css"
import "./activity-search-states.css"

/** Figma 8845:53428 Long Document / spilled-mug leaf display size. */
const ILLUSTRATION_WIDTH = 200
const ILLUSTRATION_HEIGHT = 148
/** Matches `--motion-duration-sm` — beat before the hero starts rising. */
const IMAGE_DELAY_MS = 200
/** Matches `--motion-duration-md` — text stagger after the image has begun. */
const TEXT_DELAY_MS = 300

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export interface ActivitySearchStatusProps {
  imageSrc: string
  title: string
  body: string
  action?: ReactNode
}

/** Empty / error illustration block — Figma 8845:53239 layout + motion tokens. */
export function ActivitySearchStatus({
  imageSrc,
  title,
  body,
  action,
}: ActivitySearchStatusProps) {
  const staggerRef = useRef<HTMLDivElement>(null)
  const [imageVisible, setImageVisible] = useState(false)

  useEffect(() => {
    const reduced = prefersReducedMotion()

    if (reduced) {
      const frame = window.requestAnimationFrame(() => {
        setImageVisible(true)
        staggerRef.current?.classList.add("is-shown")
      })
      return () => window.cancelAnimationFrame(frame)
    }

    const imageTimer = window.setTimeout(() => {
      setImageVisible(true)
    }, IMAGE_DELAY_MS)

    const textTimer = window.setTimeout(() => {
      const element = staggerRef.current
      if (!element) return
      element.classList.remove("is-shown", "is-hiding")
      window.requestAnimationFrame(() => {
        element.classList.add("is-shown")
      })
    }, TEXT_DELAY_MS)

    return () => {
      window.clearTimeout(imageTimer)
      window.clearTimeout(textTimer)
    }
  }, [imageSrc, title])

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-8">
      <img
        src={imageSrc}
        alt=""
        width={ILLUSTRATION_WIDTH}
        height={ILLUSTRATION_HEIGHT}
        className={[
          "activity-search-hero shrink-0 object-contain",
          imageVisible ? "activity-search-hero--visible" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden
      />
      <div ref={staggerRef} className="t-stagger flex w-full flex-col gap-1 py-4 text-center">
        <Typography variant="heading-xs-accent" color="primary" as="p" align="center">
          <span className="t-stagger-line t-stagger-line--1">{title}</span>
        </Typography>
        <Typography variant="body-m-regular" color="secondary" as="p" align="center">
          <span className="t-stagger-line t-stagger-line--2">{body}</span>
        </Typography>
        {action ? <div className="pt-3">{action}</div> : null}
      </div>
    </div>
  )
}

export function ActivitySearchRetryButton({ onRetry }: { onRetry: () => void }) {
  return <GhostButton onClick={onRetry}>Try again</GhostButton>
}
