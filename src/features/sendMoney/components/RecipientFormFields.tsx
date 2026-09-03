import Alert from "@bolteu/kalep-react-icons/dist/Alert"
import ChevronDown from "@bolteu/kalep-react-icons/dist/ChevronDown"
import Clear from "@bolteu/kalep-react-icons/dist/Clear"
import { useState } from "react"
import {
  FormPickerField,
  InlineLabelTextField,
} from "@/shared/components/InlineLabelTextField"
import { useAfterNavigationTransition } from "@/shared/navigation/useAfterNavigationTransition"
import type { TransferCountry } from "../data/countries"
import { formatIbanDisplay } from "../lib/iban"
import type {
  RecipientFormErrors,
  RecipientFormField,
  RecipientFormValues,
} from "../sendMoney.types"
import { CountryFlag } from "./CountryFlag"

export interface RecipientFormFieldsProps {
  country: TransferCountry
  values: RecipientFormValues
  errors: RecipientFormErrors
  onCountryClick: () => void
  onChange: (field: RecipientFormField, value: string) => void
  onBlur: (field: RecipientFormField) => void
}

export function RecipientFormFields({
  country,
  values,
  errors,
  onCountryClick,
  onChange,
  onBlur,
}: RecipientFormFieldsProps) {
  const navigationReady = useAfterNavigationTransition()

  return (
    <div className="flex flex-col gap-4 px-6 pt-4">
      <FormPickerField
        label="Bank country"
        value={country.name}
        onClick={onCountryClick}
        ariaLabel={`Bank country, ${country.name}. Change country`}
        startSlot={<CountryFlag country={country} />}
        endSlot={<ChevronDown size="lg" className="shrink-0 text-primary" aria-hidden />}
      />

      {country.transferRail === "SEPA" ? (
        <RecipientTextField
          field="iban"
          label="IBAN"
          value={values.iban}
          error={errors.iban}
          focusWhenReady={navigationReady}
          placeholder="Enter or paste the IBAN"
          autoCapitalize="characters"
          onChange={(value) => onChange("iban", formatIbanDisplay(value))}
          onBlur={() => onBlur("iban")}
          onClear={() => onChange("iban", "")}
        />
      ) : (
        <>
          <RecipientTextField
            field="accountNumber"
            label="Account number"
            value={values.accountNumber}
            error={errors.accountNumber}
            inputMode="numeric"
            onChange={(value) => onChange("accountNumber", value)}
            onBlur={() => onBlur("accountNumber")}
            onClear={() => onChange("accountNumber", "")}
          />
          <RecipientTextField
            field="transitNumber"
            label="Transit number"
            value={values.transitNumber}
            error={errors.transitNumber}
            inputMode="numeric"
            onChange={(value) => onChange("transitNumber", value)}
            onBlur={() => onBlur("transitNumber")}
            onClear={() => onChange("transitNumber", "")}
          />
          <RecipientTextField
            field="institutionNumber"
            label="Institution number"
            value={values.institutionNumber}
            error={errors.institutionNumber}
            inputMode="numeric"
            onChange={(value) => onChange("institutionNumber", value)}
            onBlur={() => onBlur("institutionNumber")}
            onClear={() => onChange("institutionNumber", "")}
          />
        </>
      )}

      <RecipientTextField
        field="accountHolderName"
        label="Account holder name"
        value={values.accountHolderName}
        error={errors.accountHolderName}
        maxLength={200}
        autoComplete="name"
        onChange={(value) => onChange("accountHolderName", value)}
        onBlur={() => onBlur("accountHolderName")}
        onClear={() => onChange("accountHolderName", "")}
      />
    </div>
  )
}

interface RecipientTextFieldProps {
  field: RecipientFormField
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

function RecipientTextField({
  field,
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
      id={`recipient-${field}`}
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
