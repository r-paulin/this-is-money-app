import ChevronDown from "@bolteu/kalep-react-icons/dist/ChevronDown"
import { FormPickerField } from "@/shared/components/InlineLabelTextField"
import type { TransferCountry } from "../data/countries"
import { formatIbanDisplay } from "../lib/iban"
import type {
  RecipientFormErrors,
  RecipientFormField,
  RecipientFormValues,
  RecipientType,
} from "../sendMoney.types"
import { CountryFlag } from "./CountryFlag"
import { RECIPIENT_TYPE_TAB_IDS } from "./recipientTypeConstants"
import { RecipientTextField } from "./RecipientTextField"
import "./recipient-type-tabs.css"

export interface RecipientTypeFormPanelsProps {
  recipientType: RecipientType
  country: TransferCountry
  values: RecipientFormValues
  errors: RecipientFormErrors
  navigationReady: boolean
  onCountryClick: () => void
  onChange: (field: RecipientFormField, value: string) => void
  onBlur: (field: RecipientFormField) => void
}

const PANELS: {
  type: RecipientType
  nameLabel: string
  nameAutoComplete: string
}[] = [
  { type: "individual", nameLabel: "Account holder name", nameAutoComplete: "name" },
  { type: "business", nameLabel: "Business name", nameAutoComplete: "organization" },
]

/** iOS tab-view: entire form swipes horizontally between Individual and Business. */
export function RecipientTypeFormPanels({
  recipientType,
  country,
  values,
  errors,
  navigationReady,
  onCountryClick,
  onChange,
  onBlur,
}: RecipientTypeFormPanelsProps) {
  return (
    <div className="recipient-type-form-panel">
      <div
        className={[
          "recipient-type-form-panel__track",
          recipientType === "business"
            ? "recipient-type-form-panel__track--business"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {PANELS.map((panel) => {
          const isActive = recipientType === panel.type
          return (
            <RecipientFormPanel
              key={panel.type}
              recipientType={panel.type}
              isActive={isActive}
              nameLabel={panel.nameLabel}
              nameAutoComplete={panel.nameAutoComplete}
              country={country}
              values={values}
              errors={errors}
              navigationReady={navigationReady && isActive}
              onCountryClick={onCountryClick}
              onChange={onChange}
              onBlur={onBlur}
            />
          )
        })}
      </div>
    </div>
  )
}

interface RecipientFormPanelProps {
  recipientType: RecipientType
  isActive: boolean
  nameLabel: string
  nameAutoComplete: string
  country: TransferCountry
  values: RecipientFormValues
  errors: RecipientFormErrors
  navigationReady: boolean
  onCountryClick: () => void
  onChange: (field: RecipientFormField, value: string) => void
  onBlur: (field: RecipientFormField) => void
}

function RecipientFormPanel({
  recipientType,
  isActive,
  nameLabel,
  nameAutoComplete,
  country,
  values,
  errors,
  navigationReady,
  onCountryClick,
  onChange,
  onBlur,
}: RecipientFormPanelProps) {
  const panelId = `recipient-type-panel-${recipientType}`
  const nameInputId = `recipient-accountHolderName-${recipientType}`

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={RECIPIENT_TYPE_TAB_IDS[recipientType]}
      aria-hidden={!isActive}
      inert={isActive ? undefined : true}
      className="recipient-type-form-panel__pane"
    >
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
            inputId={`recipient-iban-${recipientType}`}
            label="IBAN"
            value={values.iban}
            error={errors.iban}
            focusWhenReady={
              navigationReady && recipientType === "individual" && isActive
            }
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
              inputId={`recipient-accountNumber-${recipientType}`}
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
              inputId={`recipient-transitNumber-${recipientType}`}
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
              inputId={`recipient-institutionNumber-${recipientType}`}
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
          inputId={nameInputId}
          label={nameLabel}
          value={values.accountHolderName}
          error={errors.accountHolderName}
          maxLength={200}
          autoComplete={nameAutoComplete}
          onChange={(value) => onChange("accountHolderName", value)}
          onBlur={() => onBlur("accountHolderName")}
          onClear={() => onChange("accountHolderName", "")}
        />
      </div>
    </div>
  )
}
