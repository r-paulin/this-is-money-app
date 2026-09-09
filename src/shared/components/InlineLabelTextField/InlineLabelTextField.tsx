import { TextField } from "@bolteu/kalep-react"
import type { TextFieldProps, TextFieldRenderProps } from "@bolteu/kalep-react"
import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react"
import "./inline-label-text-field.css"

const INPUT_CLASS =
  "inline-label-text-field__input m-0 h-5 w-full border-0 bg-transparent p-0 outline-none bolt-font-body-m-compact-regular text-primary placeholder:text-secondary disabled:cursor-not-allowed disabled:placeholder:text-tertiary"

const WRAPPER_CLASS =
  "!h-14 !min-h-14 !max-h-14 !items-center !justify-start !py-0 !rounded-compact"

export interface InlineLabelTextFieldProps
  extends Omit<TextFieldProps, "renderLabel" | "size"> {
  label: string
  required?: boolean
  /** Defer focus until after navigation transition (e.g. push animation). */
  focusWhenReady?: boolean
}

/* eslint-disable @typescript-eslint/no-unused-vars -- strip Kalep render props before spreading to <input> */
function pickInputElementProps(
  props: TextFieldRenderProps,
): InputHTMLAttributes<HTMLInputElement> {
  const {
    renderEndSlot: _renderEndSlot,
    renderHelperText: _renderHelperText,
    renderInput: _renderInput,
    renderLabel: _renderLabel,
    renderStartSlot: _renderStartSlot,
    helperTextId: _helperTextId,
    inputId: _inputId,
    labelId: _labelId,
    prefixId: _prefixId,
    suffixId: _suffixId,
    fullWidth: _fullWidth,
    clearTextLabel: _clearTextLabel,
    showPasswordLabel: _showPasswordLabel,
    inputWrapperRef: _inputWrapperRef,
    size: _size,
    ...inputProps
  } = props

  return inputProps
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export function InlineLabelTextField({
  label,
  required = false,
  value = "",
  overrideClassName,
  onFocus,
  onBlur,
  renderEndSlot,
  focusWhenReady = false,
  id,
  ...rest
}: InlineLabelTextFieldProps) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0
  const didAutoFocusRef = useRef(false)

  useEffect(() => {
    if (!focusWhenReady || !id || didAutoFocusRef.current) return
    const input = document.getElementById(id)
    if (!input) return
    didAutoFocusRef.current = true
    input.focus({ preventScroll: true })
  }, [focusWhenReady, id])

  return (
    <TextField
      {...rest}
      id={id}
      label={label}
      value={value}
      size="lg"
      fullWidth
      overrideClassName={[WRAPPER_CLASS, overrideClassName]
        .filter(Boolean)
        .join(" ")}
      renderLabel={() => null}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      renderEndSlot={(fieldProps, defaultEndSlot) => {
        const content =
          renderEndSlot?.(fieldProps, defaultEndSlot) ??
          defaultEndSlot(fieldProps)
        if (!content) return null

        return (
          <div className="inline-label-text-field__end-slot flex size-8 items-center justify-center">
            {content}
          </div>
        )
      }}
      renderInput={(fieldProps) => {
        const inputProps = pickInputElementProps(fieldProps)
        const labelText = required ? `${label} *` : label

        return (
          <div
            className="inline-label-text-field__content"
            data-floated={floated ? "true" : "false"}
          >
            <label
              id={fieldProps.labelId}
              htmlFor={fieldProps.inputId}
              className="inline-label-text-field__label bolt-font-body-s-compact-regular text-secondary"
            >
              {labelText}
            </label>
            <input
              {...inputProps}
              ref={fieldProps.ref}
              id={fieldProps.inputId}
              aria-labelledby={fieldProps.labelId}
              aria-describedby={
                fieldProps.helperText ? fieldProps.helperTextId : undefined
              }
              aria-invalid={fieldProps.error}
              className={INPUT_CLASS}
            />
          </div>
        )
      }}
    />
  )
}

export interface FormPickerFieldProps {
  label: string
  value: string
  onClick: () => void
  ariaLabel: string
  startSlot?: ReactNode
  endSlot?: ReactNode
  required?: boolean
}

/** Tappable form row with inline label + value (e.g. bank country). Figma 7507:106517 */
export function FormPickerField({
  label,
  value,
  onClick,
  ariaLabel,
  startSlot,
  endSlot,
  required = false,
}: FormPickerFieldProps) {
  const labelText = required ? `${label} *` : label

  return (
    <button
      type="button"
      className="flex min-h-14 w-full items-center gap-4 rounded-compact border-0 bg-neutral-secondary px-4 py-2 text-left"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {startSlot}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate bolt-font-body-s-compact-regular text-secondary">
          {labelText}
        </span>
        <span className="truncate bolt-font-body-m-compact-regular text-primary">
          {value}
        </span>
      </span>
      {endSlot ? (
        <span className="flex size-8 shrink-0 items-center justify-center">
          {endSlot}
        </span>
      ) : null}
    </button>
  )
}
