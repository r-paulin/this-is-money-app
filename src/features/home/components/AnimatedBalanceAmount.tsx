import { Typography } from "@bolteu/kalep-react"
import { useCallback, useEffect, useRef } from "react"
import { NumberPopIn } from "@/shared/components/NumberPopIn"
import { useNumberPopIn } from "@/shared/components/useNumberPopIn"

interface AnimatedBalanceAmountProps {
  initialAmount?: string
  targetAmount?: string
  /** Delay before the target amount pop-in begins. */
  changeAfterMs?: number
  /** Increment when refresh fetch completes (resets to initialAmount if changed). */
  refreshTrigger?: number
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function animateToAmount(
  nextAmount: string,
  setDigits: (value: string) => void,
  setDigitsStatic: (value: string) => void,
) {
  if (prefersReducedMotion()) {
    setDigitsStatic(nextAmount)
    return
  }

  setDigits(nextAmount)
}

export function AnimatedBalanceAmount({
  initialAmount = "€\u202F100.00",
  targetAmount = "€\u202F124.50",
  changeAfterMs = 800,
  refreshTrigger = 0,
}: AnimatedBalanceAmountProps) {
  const { groupRef, value, previousValue, playing, setDigits, setDigitsStatic } =
    useNumberPopIn(initialAmount, false)
  const valueRef = useRef(value)
  const hasAutoUpdatedRef = useRef(false)
  const mountTimerRef = useRef<number | null>(null)
  const refreshTimerRef = useRef<number | null>(null)
  const initialAmountRef = useRef(initialAmount)
  const targetAmountRef = useRef(targetAmount)
  const changeAfterMsRef = useRef(changeAfterMs)
  const setDigitsRef = useRef(setDigits)
  const setDigitsStaticRef = useRef(setDigitsStatic)

  initialAmountRef.current = initialAmount
  targetAmountRef.current = targetAmount
  changeAfterMsRef.current = changeAfterMs
  setDigitsRef.current = setDigits
  setDigitsStaticRef.current = setDigitsStatic

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const scheduleTargetAnimation = useCallback(() => {
    if (mountTimerRef.current !== null) {
      window.clearTimeout(mountTimerRef.current)
    }

    mountTimerRef.current = window.setTimeout(() => {
      mountTimerRef.current = null
      hasAutoUpdatedRef.current = true
      animateToAmount(
        targetAmountRef.current,
        setDigitsRef.current,
        setDigitsStaticRef.current,
      )
    }, changeAfterMsRef.current)
  }, [])

  useEffect(() => {
    if (hasAutoUpdatedRef.current) return

    scheduleTargetAnimation()

    return () => {
      if (mountTimerRef.current !== null) {
        window.clearTimeout(mountTimerRef.current)
        mountTimerRef.current = null
      }
    }
  }, [scheduleTargetAnimation])

  useEffect(() => {
    if (refreshTrigger <= 0) return

    if (mountTimerRef.current !== null) {
      window.clearTimeout(mountTimerRef.current)
      mountTimerRef.current = null
    }

    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    const runRefreshCycle = () => {
      if (valueRef.current !== initialAmountRef.current) {
        animateToAmount(
          initialAmountRef.current,
          setDigitsRef.current,
          setDigitsStaticRef.current,
        )
      }

      hasAutoUpdatedRef.current = false
      scheduleTargetAnimation()
    }

    if (valueRef.current === initialAmountRef.current) {
      runRefreshCycle()
      return
    }

    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null
      runRefreshCycle()
    }, 0)

    return () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }
  }, [refreshTrigger, scheduleTargetAnimation])

  return (
    <>
      <Typography variant="body-m-compact-regular" color="secondary" as="p" align="center">
        Available balance
      </Typography>
      <p className="ffeature m-0 text-center bolt-font-heading-l-accent text-primary">
        <NumberPopIn
          groupRef={groupRef}
          value={value}
          previousValue={previousValue}
          playing={playing}
        />
      </p>
    </>
  )
}
