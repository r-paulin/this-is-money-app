import { useEffect, useMemo, useState } from "react"
import { generatePin } from "../lib/generatePin"
import {
  PIN_REMINDER_COUNTDOWN_SECONDS,
  PIN_REMINDER_PIN_DELAY_MS,
  PIN_REMINDER_SKELETON_MS,
} from "../lib/pinReminder.constants"
import { SkeletonReveal } from "@/shared/components/SkeletonReveal"
import { useNavigationStack } from "@/shared/navigation"
import { PinReminderContent } from "./PinReminderContent"

export function PinReminderGate() {
  const { pop } = useNavigationStack()
  const [skeletonRevealed, setSkeletonRevealed] = useState(false)
  const [pinRevealed, setPinRevealed] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(PIN_REMINDER_COUNTDOWN_SECONDS)
  const pin = useMemo(() => generatePin(), [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSkeletonRevealed(true)
    }, PIN_REMINDER_SKELETON_MS)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!skeletonRevealed) {
      return
    }

    const timer = window.setTimeout(() => {
      setPinRevealed(true)
    }, PIN_REMINDER_PIN_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [skeletonRevealed])

  useEffect(() => {
    if (!skeletonRevealed) {
      return
    }

    const interval = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [skeletonRevealed])

  useEffect(() => {
    if (!skeletonRevealed || secondsRemaining > 0) {
      return
    }

    pop()
  }, [skeletonRevealed, secondsRemaining, pop])

  return (
    <SkeletonReveal
      revealed={skeletonRevealed}
      deferContentMount
      className="min-h-dvh bg-layer-floor-1"
      aria-label={skeletonRevealed ? undefined : "Loading PIN reminder"}
      skeleton={<PinReminderContent loading />}
    >
      <PinReminderContent
        pin={pin}
        pinRevealed={pinRevealed}
        secondsRemaining={secondsRemaining}
      />
    </SkeletonReveal>
  )
}
