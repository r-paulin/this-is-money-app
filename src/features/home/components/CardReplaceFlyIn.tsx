import { useLayoutEffect, useRef } from "react"
import { PaymentCard } from "@/shared/components/PaymentCard"
import { DESIGN_WIDTH } from "@/shared/components/PaymentCard/paymentCard.config"
import type { CardType } from "../home.types"

const FLY_IN_DURATION_MS = 550
const FLY_IN_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"
const CARD_WIDTH = DESIGN_WIDTH
const CARD_HEIGHT = 218
const START_SCALE = 200 / CARD_WIDTH

export interface CardReplaceFlyInProps {
  cardType: CardType
  newLastFour: string
  targetRef: React.RefObject<HTMLElement | null>
  onComplete: () => void
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function CardReplaceFlyIn({
  cardType,
  newLastFour,
  targetRef,
  onComplete,
}: CardReplaceFlyInProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const target = targetRef.current

    const finish = () => {
      if (completedRef.current) {
        return
      }
      completedRef.current = true
      onComplete()
    }

    if (!overlay || !target || prefersReducedMotion()) {
      finish()
      return
    }

    const targetRect = target.getBoundingClientRect()
    const startWidth = CARD_WIDTH * START_SCALE
    const startHeight = CARD_HEIGHT * START_SCALE
    const startLeft = window.innerWidth / 2 - startWidth / 2
    const startTop = window.innerHeight / 2 - startHeight / 2
    const endScale = targetRect.width / CARD_WIDTH
    const endWidth = CARD_WIDTH * endScale
    const endHeight = CARD_HEIGHT * endScale
    const endLeft = targetRect.left + targetRect.width / 2 - endWidth / 2
    const endTop = targetRect.top + targetRect.height / 2 - endHeight / 2

    overlay.style.setProperty("--card-replace-duration", `${FLY_IN_DURATION_MS}ms`)
    overlay.style.setProperty("--card-replace-ease", FLY_IN_EASE)
    overlay.style.left = `${startLeft}px`
    overlay.style.top = `${startTop}px`
    overlay.style.width = `${CARD_WIDTH}px`
    overlay.style.height = `${CARD_HEIGHT}px`
    overlay.style.transform = `scale(${START_SCALE})`
    overlay.style.transformOrigin = "top left"
    overlay.style.opacity = "1"

    const frame = window.requestAnimationFrame(() => {
      overlay.style.left = `${endLeft}px`
      overlay.style.top = `${endTop}px`
      overlay.style.transform = `scale(${endScale})`
    })

    const timer = window.setTimeout(finish, FLY_IN_DURATION_MS)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [onComplete, targetRef])

  if (prefersReducedMotion()) {
    return null
  }

  return (
    <div ref={overlayRef} className="card-replace-fly-in card-replace-fly-in--from">
      <PaymentCard virtual={cardType === "virtual"} lastFour={newLastFour} className="max-w-none" />
    </div>
  )
}
