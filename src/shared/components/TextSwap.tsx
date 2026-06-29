import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

// Transitions.dev — Text states swap (React, self-contained)
// https://transitions.dev

const TEXT_SWAP_DURATION_MS = 150

const __TEXT_SWAP_STYLES = `
:root {
  --text-swap-dur: 150ms;
  --text-swap-translate-y: 4px;
  --text-swap-blur: 2px;
  --text-swap-ease: ease-in-out;
}

.t-text-swap {
  display: inline-block;
  transform: translateY(0);
  filter: blur(0);
  opacity: 1;
  transition:
    transform var(--text-swap-dur) var(--text-swap-ease),
    filter var(--text-swap-dur) var(--text-swap-ease),
    opacity var(--text-swap-dur) var(--text-swap-ease);
  will-change: transform, filter, opacity;
}
.t-text-swap.is-exit {
  transform: translateY(calc(var(--text-swap-translate-y) * -1));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
}
.t-text-swap.is-enter-start {
  transform: translateY(var(--text-swap-translate-y));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .t-text-swap { transition: none !important; }
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
    }, TEXT_SWAP_DURATION_MS)

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
