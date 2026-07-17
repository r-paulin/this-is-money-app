import { Spinner, Typography } from "@bolteu/kalep-react"
import { useEffect, useRef, useState } from "react"
import "@/shared/styles/text-stagger.css"
import "./statement-creating.css"

const CREATING_HOLD_MS = 8000
/** Soft text fade before the screen starts leaving. */
const TEXT_HIDE_MS = 280
/** Must match statement-creating.css exit duration. */
const SCREEN_EXIT_MS = 620

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export interface GetStatementCreatingContentProps {
  /** Fired after the screen has finished exiting. */
  onExitComplete: () => void
  /** Fired when exit begins so the ready screen can mount underneath. */
  onExitStart?: () => void
}

export function GetStatementCreatingContent({
  onExitComplete,
  onExitStart,
}: GetStatementCreatingContentProps) {
  const staggerRef = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const element = staggerRef.current
    if (!element) return

    if (prefersReducedMotion()) {
      element.classList.add("is-shown")
      return
    }

    element.classList.remove("is-shown", "is-hiding")
    const frame = window.requestAnimationFrame(() => {
      element.classList.add("is-shown")
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const reduced = prefersReducedMotion()
    let textHideTimer = 0

    const hold = window.setTimeout(() => {
      const element = staggerRef.current
      onExitStart?.()

      if (reduced) {
        setExiting(true)
        onExitComplete()
        return
      }

      if (element) {
        element.classList.remove("is-shown")
        element.classList.add("is-hiding")
      }

      textHideTimer = window.setTimeout(() => {
        setExiting(true)
      }, TEXT_HIDE_MS)
    }, CREATING_HOLD_MS)

    return () => {
      window.clearTimeout(hold)
      window.clearTimeout(textHideTimer)
    }
  }, [onExitComplete, onExitStart])

  useEffect(() => {
    if (!exiting || prefersReducedMotion()) return

    const timer = window.setTimeout(() => {
      onExitComplete()
    }, SCREEN_EXIT_MS)

    return () => window.clearTimeout(timer)
  }, [exiting, onExitComplete])

  return (
    <div
      className={[
        "statement-creating-screen flex flex-col items-center justify-center bg-layer-floor-1 px-6",
        exiting ? "is-exiting" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-live="polite"
      aria-busy={!exiting}
    >
      <Spinner size={600} color="text-[var(--color-special-brand)]" />
      <div ref={staggerRef} className="t-stagger w-full pt-6 text-center">
        <Typography variant="heading-m-accent" color="primary" as="h1" align="center">
          <span className="t-stagger-line t-stagger-line--1">Creating statement…</span>
        </Typography>
        <div className="pt-2">
          <Typography variant="body-m-regular" color="secondary" as="p" align="center">
            <span className="t-stagger-line t-stagger-line--2">This might take a moment</span>
          </Typography>
        </div>
      </div>
    </div>
  )
}
