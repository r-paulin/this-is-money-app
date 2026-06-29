import { useEffect, useRef } from "react"
import { NumberPopIn } from "../../../shared/components/NumberPopIn"
import { useNumberPopIn } from "../../../shared/components/useNumberPopIn"

interface AnimatedBalanceAmountProps {
  initialAmount?: string
  targetAmount?: string
  /** Delay before the target amount pop-in begins. */
  changeAfterMs?: number
}

export function AnimatedBalanceAmount({
  initialAmount = "€\u202F100.00",
  targetAmount = "€\u202F124.50",
  changeAfterMs = 800,
}: AnimatedBalanceAmountProps) {
  const { groupRef, value, previousValue, playing, setDigits, setDigitsStatic } =
    useNumberPopIn(initialAmount, false)
  const hasChangedRef = useRef(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const timer = window.setTimeout(() => {
      if (hasChangedRef.current) return
      hasChangedRef.current = true

      if (prefersReducedMotion) {
        setDigitsStatic(targetAmount)
        return
      }

      setDigits(targetAmount)
    }, changeAfterMs)

    return () => window.clearTimeout(timer)
  }, [changeAfterMs, setDigits, setDigitsStatic, targetAmount])

  return (
    <p className="ffeature m-0 text-center bolt-font-heading-l-accent text-primary">
      <NumberPopIn
        groupRef={groupRef}
        value={value}
        previousValue={previousValue}
        playing={playing}
      />
    </p>
  )
}
