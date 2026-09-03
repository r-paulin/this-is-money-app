import { Typography } from "@bolteu/kalep-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { TextSwap } from "@/shared/components/TextSwap"
import type { AmountDisplayParts, AmountInputState } from "../lib/amountInput"
import { applyAmountKey, amountStateFromRawInput } from "../lib/amountInput"
import { EurCurrencyChip } from "./EurCurrencyChip"
import "./send-money-amount.css"

const SHAKE_MS = 80 * 2 + 60 * 2

export interface AmountHelperParts {
  available: string
  feeLabel: string
}

export interface AmountFieldProps {
  state: AmountInputState
  display: AmountDisplayParts
  disabled?: boolean
  error?: boolean
  helperText?: string
  helperParts?: AmountHelperParts
  shakeRequest?: number
  autoFocus?: boolean
  focusKey?: number
  onStateChange: (state: AmountInputState) => void
  onFocus?: () => void
  onBlur?: () => void
}

export function AmountField({
  state,
  display,
  disabled = false,
  error = false,
  helperText,
  helperParts,
  shakeRequest = 0,
  autoFocus = false,
  focusKey,
  onStateChange,
  onFocus,
  onBlur,
}: AmountFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!autoFocus) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [autoFocus, focusKey])

  useEffect(() => {
    if (!shakeRequest) return
    const field = fieldRef.current
    if (!field) return

    field.classList.remove("is-shaking")
    void field.offsetWidth
    field.classList.add("is-shaking")

    const timer = window.setTimeout(() => {
      field.classList.remove("is-shaking")
    }, SHAKE_MS)

    return () => window.clearTimeout(timer)
  }, [shakeRequest])

  const applyKey = useCallback(
    (key: string) => {
      onStateChange(applyAmountKey(state, key))
    },
    [onStateChange, state],
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (event.key === "Backspace") {
      event.preventDefault()
      applyKey("Backspace")
      return
    }

    if (event.key === "," || event.key === ".") {
      event.preventDefault()
      applyKey(event.key)
      return
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault()
      applyKey(event.key)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return
    event.preventDefault()
    const pasted = event.clipboardData.getData("text")
    if (pasted) {
      onStateChange(amountStateFromRawInput(pasted))
    }
  }

  const borderClass = error
    ? "border-danger-primary"
    : focused
      ? "border-action-primary"
      : "border-transparent"

  const surfaceClass = focused ? "bg-layer-floor-1" : "bg-neutral-secondary"

  const helperId = "amount-field-helper"
  const helperAriaLabel = helperParts
    ? `${helperParts.available} · ${helperParts.feeLabel}`
    : helperText

  return (
    <div className={["t-input-wrap px-6 py-3", error ? "is-error" : ""].filter(Boolean).join(" ")}>
      <div
        ref={fieldRef}
        className={[
          "t-input relative flex min-h-14 items-center gap-3 rounded-compact border-2 px-4 py-2",
          surfaceClass,
          borderClass,
          error ? "is-error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Typography variant="body-s-compact-regular" color="secondary" as="span">
            Amount
          </Typography>
          <div
            className="flex min-h-[25px] items-baseline text-[20px] leading-[25px] tracking-[-0.34px]"
            aria-hidden
          >
            {display.isEmpty ? (
              <span className="text-secondary">{display.ghost}</span>
            ) : (
              <>
                <span className="font-semibold text-primary">{display.entered}</span>
                {display.ghost ? (
                  <span className="font-semibold text-secondary">{display.ghost}</span>
                ) : null}
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label="Amount"
            aria-invalid={error}
            aria-describedby={helperAriaLabel ? helperId : undefined}
            disabled={disabled}
            className="absolute inset-0 opacity-0"
            value=""
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => {
              setFocused(true)
              onFocus?.()
            }}
            onBlur={() => {
              setFocused(false)
              onBlur?.()
            }}
          />
        </div>
        <EurCurrencyChip />
      </div>
      {helperParts ? (
        <p
          id={helperId}
          role={error ? "alert" : undefined}
          aria-label={helperAriaLabel}
          className={[
            "amount-field-helper pt-2 text-body-s-regular",
            error ? "text-danger-primary" : "text-secondary",
          ].join(" ")}
        >
          {helperParts.available} · <TextSwap value={helperParts.feeLabel} />
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          role={error ? "alert" : undefined}
          className={[
            "amount-field-helper pt-2 text-body-s-regular",
            error ? "text-danger-primary" : "text-secondary",
          ].join(" ")}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
