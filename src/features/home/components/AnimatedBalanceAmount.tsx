import { Typography } from "@bolteu/kalep-react"
import { useEffect, useRef } from "react"
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

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const scheduleTargetAnimation = () => {
    if (mountTimerRef.current !== null) {
      window.clearTimeout(mountTimerRef.current)
    }

    mountTimerRef.current = window.setTimeout(() => {
      mountTimerRef.current = null
      hasAutoUpdatedRef.current = true
      animateToAmount(targetAmount, setDigits, setDigitsStatic)
    }, changeAfterMs)
  }

  useEffect(() => {
    if (hasAutoUpdatedRef.current) return

    scheduleTargetAnimation()

    return () => {
      if (mountTimerRef.current !== null) {
        window.clearTimeout(mountTimerRef.current)
        mountTimerRef.current = null
      }
    }
  }, [changeAfterMs, setDigits, setDigitsStatic, targetAmount])

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
      if (valueRef.current !== initialAmount) {
        animateToAmount(initialAmount, setDigits, setDigitsStatic)
      }

      hasAutoUpdatedRef.current = false
      scheduleTargetAnimation()
    }

    if (valueRef.current === initialAmount) {
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
  }, [changeAfterMs, initialAmount, refreshTrigger, setDigits, setDigitsStatic, targetAmount])

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
