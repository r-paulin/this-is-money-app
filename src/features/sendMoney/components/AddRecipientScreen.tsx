import { Button, Typography } from "@bolteu/kalep-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigationStack } from "@/shared/navigation"
import { SkeletonBar } from "@/shared/components/skeleton/SkeletonPlaceholders"
import {
  getCountryByCode,
  type TransferCountry,
} from "../data/countries"
import {
  getIbanCountryCode,
  normalizeIban,
} from "../lib/iban"
import {
  validateAccountHolderName,
  validateCanadaRecipient,
  validateSepaIban,
  validateSepaRecipient,
} from "../lib/recipientFormValidation"
import type {
  Recipient,
  RecipientFormErrors,
  RecipientFormField,
  RecipientFormValues,
  RecipientType,
} from "../sendMoney.types"
import { AmountGate } from "./AmountGate"
import { CountryPickerScreen } from "./CountryPickerScreen"
import { RecipientFormFields } from "./RecipientFormFields"

const FORM_SCHEMA_LOADING_MS = 500
const DEFAULT_COUNTRY_CODE = "FR"

export interface AddRecipientScreenProps {
  prefillName?: string
  prefillIban?: string
}

function initialCountry(prefillIban?: string): TransferCountry {
  const detected = prefillIban ? getIbanCountryCode(prefillIban) : undefined
  const detectedCountry = detected ? getCountryByCode(detected) : undefined
  return (
    (detectedCountry?.transferRail === "SEPA" ? detectedCountry : undefined) ??
    getCountryByCode(DEFAULT_COUNTRY_CODE)!
  )
}

export function AddRecipientScreen({
  prefillName = "",
  prefillIban = "",
}: AddRecipientScreenProps) {
  const { push } = useNavigationStack()
  const [country, setCountry] = useState(() => initialCountry(prefillIban))
  const [recipientType, setRecipientType] = useState<RecipientType>("individual")
  const [schemaLoading, setSchemaLoading] = useState(false)
  const [values, setValues] = useState<RecipientFormValues>({
    iban: prefillIban,
    accountNumber: "",
    transitNumber: "",
    institutionNumber: "",
    accountHolderName: prefillName,
  })
  const [errors, setErrors] = useState<RecipientFormErrors>({})
  const schemaTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (schemaTimerRef.current !== null) {
        window.clearTimeout(schemaTimerRef.current)
      }
    }
  }, [])

  const requiredFields = useMemo<RecipientFormField[]>(
    () =>
      country.transferRail === "SEPA"
        ? ["iban", "accountHolderName"]
        : [
            "accountNumber",
            "transitNumber",
            "institutionNumber",
            "accountHolderName",
          ],
    [country.transferRail],
  )

  const formComplete = requiredFields.every((field) => values[field].trim().length > 0)
  const hasKnownErrors = requiredFields.some((field) => Boolean(errors[field]))
  const canContinue = formComplete && !hasKnownErrors && !schemaLoading

  const updateField = (field: RecipientFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validateField = (field: RecipientFormField) => {
    if (country.transferRail !== "SEPA") return

    if (field === "accountHolderName") {
      setErrors((current) => ({
        ...current,
        accountHolderName: validateAccountHolderName(values.accountHolderName),
      }))
      return
    }

    if (field === "iban") {
      setErrors((current) => ({
        ...current,
        iban: validateSepaIban(values.iban, country.code, country.name),
      }))
      return
    }
  }

  const handleCountrySelect = useCallback((selectedCountry: TransferCountry) => {
    if (selectedCountry.code === country.code) return

    setCountry(selectedCountry)
    setErrors({})
    setSchemaLoading(true)
    if (schemaTimerRef.current !== null) {
      window.clearTimeout(schemaTimerRef.current)
    }
    schemaTimerRef.current = window.setTimeout(() => {
      schemaTimerRef.current = null
      const detectedCode = getIbanCountryCode(values.iban)
      const detectedCountry = detectedCode ? getCountryByCode(detectedCode) : undefined
      setSchemaLoading(false)
      if (
        selectedCountry.transferRail === "SEPA" &&
        detectedCountry &&
        detectedCountry.code !== selectedCountry.code
      ) {
        setErrors((current) => ({
          ...current,
          iban: `Your IBAN is for ${detectedCountry.name}`,
        }))
      }
    }, FORM_SCHEMA_LOADING_MS)
  }, [country.code, values.iban])

  const handleRecipientTypeChange = useCallback((type: RecipientType) => {
    if (type === recipientType) return
    ;(document.activeElement as HTMLElement | null)?.blur()
    setRecipientType(type)
  }, [recipientType])

  const openCountryPicker = useCallback(() => {
    push({
      key: `send-money-country:${country.code}`,
      render: () => (
        <CountryPickerScreen
          currentCountryCode={country.code}
          onSelect={handleCountrySelect}
        />
      ),
    })
  }, [country.code, handleCountrySelect, push])

  const handleContinue = () => {
    const nextErrors: RecipientFormErrors =
      country.transferRail === "SEPA"
        ? validateSepaRecipient({
            bankCountryCode: country.code,
            bankCountryName: country.name,
            iban: values.iban,
            accountHolderName: values.accountHolderName,
          })
        : validateCanadaRecipient(values)

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const accountReference =
      country.transferRail === "SEPA"
        ? normalizeIban(values.iban)
        : values.accountNumber
    const recipient: Recipient = {
      id: `new-${country.code}-${accountReference}`,
      rawName: values.accountHolderName.trim(),
      iban: accountReference,
      recipientType,
      lastAmountCents: 0,
      lastTransferredAt: Date.now(),
      transferCount90d: 0,
      transferCount365d: 0,
      averageAmountCents: 0,
      isLinkedBankAccount: false,
      isTrusted: false,
    }

    push({
      key: `send-money-amount:${recipient.id}`,
      render: () => <AmountGate recipient={recipient} />,
    })
  }

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-layer-floor-1">
        <div className="px-6 py-3">
          <Typography variant="body-s-regular" color="secondary" as="p">
            Step 1 of 3
          </Typography>
          <div className="pt-1">
            <Typography variant="heading-l-accent" color="primary" as="h1">
              Add recipient
            </Typography>
          </div>
        </div>

        <div className="flex-1">
          {schemaLoading ? (
            <RecipientFormSkeleton country={country} />
          ) : (
            <RecipientFormFields
              country={country}
              recipientType={recipientType}
              values={values}
              errors={errors}
              onRecipientTypeChange={handleRecipientTypeChange}
              onCountryClick={openCountryPicker}
              onChange={updateField}
              onBlur={validateField}
            />
          )}
        </div>

        <div className="sticky bottom-0 bg-layer-floor-1 px-6 py-4">
          <Button
            size="lg"
            variant="primary"
            fullWidth
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  )
}

function RecipientFormSkeleton({ country }: { country: TransferCountry }) {
  const fieldCount = country.transferRail === "SEPA" ? 2 : 4
  return (
    <div className="flex flex-col" aria-label="Loading recipient form">
      <div className="flex min-h-12 items-center gap-4 px-6">
        <SkeletonBar width={88} height={20} className="rounded" />
        <SkeletonBar width={72} height={20} className="rounded" />
      </div>
      <div className="flex flex-col gap-4 px-6 pt-4">
        <SkeletonBar width="100%" height={56} className="rounded-compact" />
        {Array.from({ length: fieldCount }, (_, index) => (
          <SkeletonBar key={index} width="100%" height={56} className="rounded-compact" />
        ))}
      </div>
    </div>
  )
}
