import { Typography } from "@bolteu/kalep-react"
import Bin from "@bolteu/kalep-react-icons/dist/Bin"
import { useEffect, useRef, useState } from "react"

export interface ReferenceFieldProps {
  value: string
  maxLength?: number
  autoFocus?: boolean
  onChange: (value: string) => void
  onClear: () => void
}

export function ReferenceField({
  value,
  maxLength = 140,
  autoFocus = false,
  onChange,
  onClear,
}: ReferenceFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!autoFocus) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [autoFocus])

  const borderClass = focused ? "border-action-primary" : "border-transparent"
  const surfaceClass = focused ? "bg-layer-floor-1" : "bg-neutral-secondary"

  return (
    <div className="px-6">
      <div
        className={[
          "t-input flex min-h-14 w-full items-center rounded-compact border-2 border-solid px-4 py-2",
          surfaceClass,
          borderClass,
        ].join(" ")}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[2px]">
          <Typography variant="body-s-compact-regular" color="secondary" as="span">
            Reference
          </Typography>
          <div className="flex min-h-5 w-full items-baseline">
            <input
              ref={inputRef}
              id="transfer-reference"
              type="text"
              value={value}
              maxLength={maxLength}
              placeholder="Add a reference for this transfer"
              autoComplete="off"
              className="m-0 w-full min-w-0 border-0 bg-transparent p-0 text-[16px] leading-5 tracking-[-0.176px] text-primary outline-none placeholder:text-secondary caret-action-primary"
              onChange={(event) => onChange(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end pl-3">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border-0 bg-transparent p-0"
            aria-label="Remove reference"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClear}
          >
            <Bin size="md" className="text-primary" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
