import { GhostButton, Typography } from "@bolteu/kalep-react"
import ChevronCircleLeft from "@bolteu/kalep-react-icons/dist/ChevronCircleLeft"
import { useEffect, useRef } from "react"
import pinReminderCard from "../assets/pin-reminder-card.png"
import {
  formatPinDisplay,
  formatPinReminderCountdown,
  PIN_BOX_MAX_WIDTH,
  PIN_BOX_MIN_HEIGHT,
  PIN_CARD_HEIGHT,
  PIN_CARD_WIDTH,
  PIN_REMINDER_BACK_ICON_SIZE,
  PIN_REMINDER_BACK_LINE_HEIGHT,
  PIN_REMINDER_COUNTDOWN_SECONDS,
  PIN_REMINDER_SUBTITLE_LINE_HEIGHT,
  PIN_REMINDER_TITLE,
  PIN_REMINDER_TITLE_LINE_HEIGHT,
} from "../lib/pinReminder.constants"
import { NumberPopIn } from "@/shared/components/NumberPopIn"
import { SkeletonBar, SkeletonCircle } from "@/shared/components/skeleton/SkeletonPlaceholders"
import "./pin-reveal.css"
import "@/shared/styles/text-stagger.css"

export interface PinReminderContentProps {
  loading?: boolean
  pin?: string
  pinRevealed?: boolean
  secondsRemaining?: number
  onBack?: () => void
}

function BackIconSlot({ loading }: { loading: boolean }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: PIN_REMINDER_BACK_ICON_SIZE, height: PIN_REMINDER_BACK_ICON_SIZE }}
    >
      {loading ? (
        <SkeletonCircle size={PIN_REMINDER_BACK_ICON_SIZE} />
      ) : (
        <ChevronCircleLeft size="lg" className="text-action-primary" />
      )}
    </span>
  )
}

function CardIllustrationSlot({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div
        className="rounded-xl bg-neutral-secondary"
        style={{ width: PIN_CARD_WIDTH, height: PIN_CARD_HEIGHT }}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={pinReminderCard}
      alt=""
      width={PIN_CARD_WIDTH}
      height={PIN_CARD_HEIGHT}
      className="object-contain"
      style={{ width: PIN_CARD_WIDTH, height: PIN_CARD_HEIGHT }}
    />
  )
}

function TextStaggerBlock({
  loading,
  secondsRemaining = PIN_REMINDER_COUNTDOWN_SECONDS,
}: {
  loading: boolean
  secondsRemaining?: number
}) {
  const staggerRef = useRef<HTMLDivElement>(null)
  const countdownLabel = formatPinReminderCountdown(secondsRemaining)

  useEffect(() => {
    const element = staggerRef.current
    if (loading || !element) {
      element?.classList.remove("is-shown")
      return
    }

    element.classList.remove("is-shown")
    const frame = window.requestAnimationFrame(() => {
      element.classList.add("is-shown")
    })

    return () => window.cancelAnimationFrame(frame)
  }, [loading])

  if (loading) {
    return (
      <>
        <div
          className="relative w-full px-6 text-center"
          style={{ minHeight: PIN_REMINDER_TITLE_LINE_HEIGHT }}
        >
          <Typography variant="heading-m-accent" color="primary" as="h1" align="center">
            <span className="invisible">{PIN_REMINDER_TITLE}</span>
          </Typography>
          <SkeletonBar
            width={248}
            height={14}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div
          className="relative w-full px-6 pb-5 pt-1 text-center"
          style={{ minHeight: PIN_REMINDER_SUBTITLE_LINE_HEIGHT + 20 }}
        >
          <Typography variant="body-m-regular" color="secondary" as="p" align="center">
            <span className="invisible">{countdownLabel}</span>
          </Typography>
          <SkeletonBar width="100%" height={14} className="absolute left-6 right-6 top-1" />
        </div>
      </>
    )
  }

  return (
    <div ref={staggerRef} className="t-stagger w-full pb-5 text-center">
      <Typography
        variant="heading-m-accent"
        color="primary"
        as="h1"
        align="center"
      >
        <span className="t-stagger-line t-stagger-line--1">{PIN_REMINDER_TITLE}</span>
      </Typography>
      <Typography variant="body-m-regular" color="secondary" as="p" align="center">
        <span className="t-stagger-line t-stagger-line--2">{countdownLabel}</span>
      </Typography>
    </div>
  )
}

function PinDisplaySlot({
  loading,
  pin = "0000",
  pinRevealed = false,
}: {
  loading: boolean
  pin?: string
  pinRevealed?: boolean
}) {
  const displayPin = formatPinDisplay(pin)

  return (
    <div className="flex w-full justify-center px-6 pb-5">
      <div
        className="flex w-full items-center justify-center rounded-xl bg-neutral-secondary"
        style={{
          minHeight: PIN_BOX_MIN_HEIGHT,
          maxWidth: PIN_BOX_MAX_WIDTH,
        }}
      >
        {loading ? (
          <SkeletonBar width="60%" height={14} />
        ) : pinRevealed ? (
          <div className="pin-reminder-reveal flex items-center justify-center">
            <Typography variant="heading-l-accent" color="primary" as="p" align="center">
              <NumberPopIn
                value={displayPin}
                playing={pinRevealed}
                className="ffeature"
                aria-label={`PIN ${displayPin}`}
              />
            </Typography>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PinReminderContent({
  loading = false,
  pin,
  pinRevealed = false,
  secondsRemaining = PIN_REMINDER_COUNTDOWN_SECONDS,
  onBack,
}: PinReminderContentProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <GhostButton onClick={() => onBack?.()} aria-label="Back">
          <span
            className="relative flex items-center gap-2"
            style={{ minHeight: PIN_REMINDER_BACK_LINE_HEIGHT }}
          >
            <BackIconSlot loading={loading} />
            <span
              className="relative block"
              style={{
                minHeight: PIN_REMINDER_BACK_LINE_HEIGHT,
                lineHeight: `${PIN_REMINDER_BACK_LINE_HEIGHT}px`,
              }}
            >
              <span
                className={
                  loading
                    ? "invisible text-body-m font-semibold text-action-primary"
                    : "text-body-m font-semibold text-action-primary"
                }
              >
                Back
              </span>
              {loading ? (
                <SkeletonBar
                  width={56}
                  height={14}
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                />
              ) : null}
            </span>
          </span>
        </GhostButton>
      </div>

      <div className="flex flex-1 flex-col items-center pt-[140px]">
        <CardIllustrationSlot loading={loading} />
        <div className="w-full pt-6">
          <TextStaggerBlock loading={loading} secondsRemaining={secondsRemaining} />
          <PinDisplaySlot loading={loading} pin={pin} pinRevealed={pinRevealed} />
        </div>
      </div>
    </div>
  )
}
