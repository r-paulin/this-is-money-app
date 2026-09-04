import { useAfterNavigationTransition } from "@/shared/navigation/useAfterNavigationTransition"
import type { TransferCountry } from "../data/countries"
import type {
  RecipientFormErrors,
  RecipientFormField,
  RecipientFormValues,
  RecipientType,
} from "../sendMoney.types"
import { RecipientTypeFormPanels } from "./RecipientTypeFormPanels"
import { RecipientTypeTabs } from "./RecipientTypeTabs"

export interface RecipientFormFieldsProps {
  country: TransferCountry
  recipientType: RecipientType
  values: RecipientFormValues
  errors: RecipientFormErrors
  onRecipientTypeChange: (type: RecipientType) => void
  onCountryClick: () => void
  onChange: (field: RecipientFormField, value: string) => void
  onBlur: (field: RecipientFormField) => void
}

export function RecipientFormFields({
  country,
  recipientType,
  values,
  errors,
  onRecipientTypeChange,
  onCountryClick,
  onChange,
  onBlur,
}: RecipientFormFieldsProps) {
  const navigationReady = useAfterNavigationTransition()

  return (
    <div className="flex flex-col">
      <RecipientTypeTabs value={recipientType} onChange={onRecipientTypeChange} />
      <RecipientTypeFormPanels
        recipientType={recipientType}
        country={country}
        values={values}
        errors={errors}
        navigationReady={navigationReady}
        onCountryClick={onCountryClick}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  )
}
