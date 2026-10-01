import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

// Transitions.dev — Text states swap (React, self-contained)
// https://transitions.dev

function textSwapDurationMs(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--motion-text-swap-duration",
  )
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : 0
}

const __TEXT_SWAP_STYLES = `
.t-text-swap {
  display: inline-block;
  transform: translateY(0);
  filter: blur(0);
  opacity: 1;
  transition:
    transform var(--motion-text-swap-duration) ease-in-out,
    filter var(--motion-text-swap-duration) ease-in-out,
    opacity var(--motion-text-swap-duration) ease-in-out;
  will-change: transform, filter, opacity;
}
.t-text-swap.is-exit {
  transform: translateY(calc(var(--motion-offset-xs) * -1));
  filter: blur(var(--motion-blur-xs));
  opacity: 0;
}
.t-text-swap.is-enter-start {
  transform: translateY(var(--motion-offset-xs));
  filter: blur(var(--motion-blur-xs));
  opacity: 0;
  transition: none;
}
`

if (typeof document !== "undefined" && !document.getElementById("transitions-text-swap")) {
  const style = document.createElement("style")
  style.id = "transitions-text-swap"
  style.textContent = __TEXT_SWAP_STYLES
  document.head.appendChild(style)
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function clearSwapClasses(el: HTMLElement) {
  el.classList.remove("is-exit", "is-enter-start")
}

function useTextSwap(value: string) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(value)
  const timerRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (value === displayValue) return

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const el = ref.current
    if (el) {
      clearSwapClasses(el)
    }

    if (prefersReducedMotion()) {
      timerRef.current = window.setTimeout(() => {
        setDisplayValue(value)
      }, 0)

      return () => {
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current)
          timerRef.current = null
        }
      }
    }

    el?.classList.add("is-exit")

    timerRef.current = window.setTimeout(() => {
      setDisplayValue(value)

      if (!el) return

      el.classList.remove("is-exit")
      el.classList.add("is-enter-start")

      requestAnimationFrame(() => {
        void el.offsetHeight
        el.classList.remove("is-enter-start")
      })
    }, textSwapDurationMs())

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (el) {
        clearSwapClasses(el)
      }
    }
  }, [displayValue, value])

  return { ref, displayValue, className: "t-text-swap" }
}

interface TextSwapProps {
  value: string
  className?: string
}

export function TextSwap({ value, className }: TextSwapProps) {
  const { ref, displayValue, className: swapClass } = useTextSwap(value)

  return (
    <span
      ref={ref}
      className={[swapClass, className].filter(Boolean).join(" ")}
    >
      {displayValue}
    </span>
  )
}

interface SwapSlotProps<T extends string> {
  value: T
  children: (displayValue: T) => ReactNode
  className?: string
}

export function SwapSlot<T extends string>({
  value,
  children,
  className,
}: SwapSlotProps<T>) {
  const { ref, displayValue, className: swapClass } = useTextSwap(value)

  return (
    <span
      ref={ref}
      className={[swapClass, className].filter(Boolean).join(" ")}
    >
      {children(displayValue as T)}
    </span>
  )
}
