import { Button, Typography, useSnackbar } from "@bolteu/kalep-react"
import { useState } from "react"
import type { CardType } from "@/features/home/home.types"
import { InlineLabelTextField } from "@/shared/components/InlineLabelTextField"
import { useNavigationStack } from "@/shared/navigation"
import {
  CHANGE_LIMITS_SUBTITLE,
  SPENDING_LIMITS_UPDATED,
  applyLimitEdits,
  changeLimitsHelper,
  formatEurInputFromCents,
  getSpendingLimits,
  parseEurInputToCents,
  setSpendingLimits,
  validateLimitCents,
  type LimitFieldId,
} from "../lib/spendingLimits"
import "./spending-limits.css"

const SAVE_MS = 800

export interface ChangeLimitsScreenProps {
  cardType: CardType
  onSaved?: () => void
}

type FieldValues = Record<LimitFieldId, string>
type FieldErrors = Partial<Record<LimitFieldId, string>>

function EurSuffix() {
  return (
    <Typography variant="body-m-compact-regular" color="secondary" as="span">
      EUR
    </Typography>
  )
}

export function ChangeLimitsScreen({ cardType, onSaved }: ChangeLimitsScreenProps) {
  const { pop } = useNavigationStack()
  const snackbar = useSnackbar()
  const initial = getSpendingLimits(cardType)

  const [values, setValues] = useState<FieldValues>({
    perTransaction: formatEurInputFromCents(initial.perTransactionCents),
    monthly: formatEurInputFromCents(initial.monthlyLimitCents),
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  const setField = (field: LimitFieldId, raw: string) => {
    setValues((current) => ({ ...current, [field]: raw }))
    const cents = parseEurInputToCents(raw)
    if (cents == null) {
      setErrors((current) => ({ ...current, [field]: undefined }))
      return
    }
    const message = validateLimitCents(field, cents)
    setErrors((current) => ({ ...current, [field]: message ?? undefined }))
  }

  const validateAll = (): {
    perTransactionCents: number
    monthlyLimitCents: number
  } | null => {
    const nextErrors: FieldErrors = {}
    const parsed = {
      perTransactionCents: parseEurInputToCents(values.perTransaction),
      monthlyLimitCents: parseEurInputToCents(values.monthly),
    }

    ;(
      [
        ["perTransaction", parsed.perTransactionCents],
        ["monthly", parsed.monthlyLimitCents],
      ] as const
    ).forEach(([field, cents]) => {
      if (cents == null) {
        nextErrors[field] = "Enter a valid amount"
        return
      }
      const message = validateLimitCents(field, cents)
      if (message) nextErrors[field] = message
    })

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return null
    if (parsed.perTransactionCents == null || parsed.monthlyLimitCents == null) {
      return null
    }
    return {
      perTransactionCents: parsed.perTransactionCents,
      monthlyLimitCents: parsed.monthlyLimitCents,
    }
  }

  const handleSave = () => {
    if (saving) return
    const edits = validateAll()
    if (!edits) return

    setSaving(true)
    window.setTimeout(() => {
      const next = applyLimitEdits(getSpendingLimits(cardType), edits)
      setSpendingLimits(cardType, next)
      snackbar.add({
        description: SPENDING_LIMITS_UPDATED,
        dismissible: true,
        timeout: 3000,
      })
      onSaved?.()
      setSaving(false)
      pop()
    }, SAVE_MS)
  }

  const hasError = Boolean(errors.perTransaction || errors.monthly)

  return (
    <div className="change-limits-screen">
      <div className="change-limits-screen__body">
        <div className="flex flex-col gap-2">
          <Typography variant="heading-m-accent" color="primary" as="h1">
            Change limits
          </Typography>
          <Typography variant="body-m-regular" color="secondary" as="p">
            {CHANGE_LIMITS_SUBTITLE}
          </Typography>
        </div>

        <div className="change-limits-screen__fields">
          <InlineLabelTextField
            id="limit-per-transaction"
            label="Per transaction limit"
            inputMode="decimal"
            value={values.perTransaction}
            onChange={(event) => setField("perTransaction", event.target.value)}
            helperText={errors.perTransaction}
            error={Boolean(errors.perTransaction)}
            renderEndSlot={() => <EurSuffix />}
          />
          <InlineLabelTextField
            id="limit-monthly"
            label="Monthly spending limit"
            inputMode="decimal"
            value={values.monthly}
            onChange={(event) => setField("monthly", event.target.value)}
            helperText={errors.monthly}
            error={Boolean(errors.monthly)}
            renderEndSlot={() => <EurSuffix />}
          />
        </div>

        <Typography variant="body-s-regular" color="secondary" as="p">
          {changeLimitsHelper(initial.dailyResetsAt)}
        </Typography>
      </div>

      <div className="change-limits-screen__footer">
        <Button
          size="lg"
          variant="primary"
          fullWidth
          loading={saving}
          disabled={hasError || saving}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
