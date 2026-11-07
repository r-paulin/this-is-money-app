import { Typography } from "@bolteu/kalep-react"
import { useLayoutEffect, useRef, useState } from "react"
import { formatTransactionListEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import type { CardType } from "@/features/home/home.types"
import { NumberPopIn } from "@/shared/components/NumberPopIn"
import { useNumberPopIn } from "@/shared/components/useNumberPopIn"
import "./spending-limits.css"

const SIZE = 240
const STROKE = 16
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** Open-bottom horseshoe: 270° of track, 90° gap. */
const ARC_LENGTH = CIRCUMFERENCE * 0.75
/** Rotate so the gap sits at the bottom (start at bottom-left). */
const ARC_ROTATE_DEG = 135

type SessionSnapshot = { ratio: number; spentCents: number }

/** Last rendered ratio/spent per card — skips re-animation on revisit. */
const lastByCard = new Map<CardType, SessionSnapshot>()

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function dashOffsetForRatio(ratio: number): number {
  return ARC_LENGTH * (1 - Math.min(1, Math.max(0, ratio)))
}

export interface SpendingLimitsProgressRingProps {
  cardType: CardType
  /** 0–1 spent / monthly. */
  ratio: number
  spentCents: number
  /** Empty track only (loading). */
  empty?: boolean
}

export function SpendingLimitsProgressRing({
  cardType,
  ratio,
  spentCents,
  empty = false,
}: SpendingLimitsProgressRingProps) {
  const clamped = empty ? 0 : Math.min(1, Math.max(0, ratio))
  const formatted = formatTransactionListEurFromCents(spentCents)

  const [displayRatio, setDisplayRatio] = useState(clamped)
  const [arcTransition, setArcTransition] = useState(false)
  const {
    groupRef,
    value,
    previousValue,
    playing,
    setDigits,
    setDigitsStatic,
    replay,
  } = useNumberPopIn(formatted, false)

  const setDigitsRef = useRef(setDigits)
  const setDigitsStaticRef = useRef(setDigitsStatic)
  const replayRef = useRef(replay)
  setDigitsRef.current = setDigits
  setDigitsStaticRef.current = setDigitsStatic
  replayRef.current = replay

  useLayoutEffect(() => {
    if (empty) return

    const prev = lastByCard.get(cardType)
    const unchanged =
      prev != null && prev.ratio === clamped && prev.spentCents === spentCents
    const reduced = prefersReducedMotion()

    lastByCard.set(cardType, { ratio: clamped, spentCents })

    if (unchanged || reduced) {
      setArcTransition(false)
      setDisplayRatio(clamped)
      setDigitsStaticRef.current(formatted)
      return
    }

    const fromRatio = prev?.ratio ?? 0
    const fromSpent = prev?.spentCents
    const spentChanged = fromSpent == null || fromSpent !== spentCents

    setArcTransition(false)
    setDisplayRatio(fromRatio)
    if (fromSpent != null) {
      setDigitsStaticRef.current(formatTransactionListEurFromCents(fromSpent))
    } else {
      setDigitsStaticRef.current(formatted)
    }

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setArcTransition(true)
        setDisplayRatio(clamped)
        if (!spentChanged) return
        if (fromSpent == null) {
          replayRef.current()
        } else {
          setDigitsRef.current(formatted)
        }
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [empty, cardType, clamped, spentCents, formatted])

  const offset = dashOffsetForRatio(displayRatio)

  return (
    <div className="spending-limits-ring" aria-hidden={empty}>
      <svg
        className="spending-limits-ring__svg"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={empty ? undefined : `${formatted} spent this month`}
      >
        <circle
          className="spending-limits-ring__track"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          transform={`rotate(${ARC_ROTATE_DEG} ${SIZE / 2} ${SIZE / 2})`}
        />
        {!empty ? (
          <circle
            className={
              arcTransition
                ? "spending-limits-ring__fill spending-limits-ring__fill--animate"
                : "spending-limits-ring__fill"
            }
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(${ARC_ROTATE_DEG} ${SIZE / 2} ${SIZE / 2})`}
          />
        ) : null}
      </svg>
      {!empty ? (
        <div className="spending-limits-ring__center">
          <Typography variant="heading-s-accent" color="primary" as="p" align="center">
            <NumberPopIn
              groupRef={groupRef}
              value={value}
              previousValue={previousValue}
              playing={playing}
              aria-label={formatted}
            />
          </Typography>
          <Typography variant="body-s-regular" color="secondary" as="p" align="center">
            Spent this month
          </Typography>
        </div>
      ) : null}
    </div>
  )
}
