import Alert from "@bolteu/kalep-react-icons/dist/Alert"
import Clear from "@bolteu/kalep-react-icons/dist/Clear"
import { useState } from "react"
import { InlineLabelTextField } from "@/shared/components/InlineLabelTextField"
import type { RecipientFormField } from "../sendMoney.types"

export interface RecipientTextFieldProps {
  field: RecipientFormField
  inputId?: string
  label: string
  value: string
  error?: string
  focusWhenReady?: boolean
  placeholder?: string
  autoCapitalize?: "none" | "off" | "sentences" | "on" | "words" | "characters"
  autoComplete?: string
  inputMode?: "text" | "numeric"
  maxLength?: number
  onChange: (value: string) => void
  onBlur: () => void
  onClear: () => void
}

export function RecipientTextField({
  field,
  inputId,
  label,
  value,
  error,
  focusWhenReady = false,
  placeholder,
  autoCapitalize,
  autoComplete,
  inputMode,
  maxLength,
  onChange,
  onBlur,
  onClear,
}: RecipientTextFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <InlineLabelTextField
      id={inputId ?? `recipient-${field}`}
      label={label}
      value={value}
      placeholder={placeholder}
      error={Boolean(error)}
      helperText={
        error ? (
          <span className="flex items-center gap-1">
            <Alert size="sm" aria-hidden />
            <span>{error}</span>
          </span>
        ) : undefined
      }
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={maxLength}
      focusWhenReady={focusWhenReady}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        onBlur()
      }}
      onChange={(event) => onChange(event.target.value)}
      renderEndSlot={() => (
        <button
          type="button"
          className={[
            "flex size-8 items-center justify-center rounded-full border-0 bg-transparent p-0",
            "transition-opacity duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
            focused && value
              ? "opacity-100"
              : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-label={`Clear ${label.toLowerCase()}`}
          aria-hidden={!(focused && value)}
          tabIndex={focused && value ? 0 : -1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClear}
        >
          <Clear size="md" className="text-tertiary" />
        </button>
      )}
    />
  )
}
