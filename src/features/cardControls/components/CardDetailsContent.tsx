import { GhostButton, ListItemLayout, Typography, useSnackbar } from "@bolteu/kalep-react"
import ChevronCircleLeft from "@bolteu/kalep-react-icons/dist/ChevronCircleLeft"
import CopyOutlined from "@bolteu/kalep-react-icons/dist/CopyOutlined"
import { useCallback } from "react"
import type { CardDetailsData } from "../lib/generateCardDetails"
import { useNavigationStack } from "@/shared/navigation"
import { SkeletonBar, SkeletonCircle } from "@/shared/components/skeleton/SkeletonPlaceholders"
import {
  CARD_DETAILS_BACK_LINE_HEIGHT,
  CARD_DETAILS_COPY_ICON_SIZE,
  CARD_DETAILS_LABEL_LINE_HEIGHT,
  CARD_DETAILS_ROW_TEMPLATES,
  CARD_DETAILS_VALUE_LINE_HEIGHT,
  type CardDetailsRowId,
} from "./cardDetailsLayout.constants"

export interface CardDetailsContentProps {
  details?: CardDetailsData
  loading?: boolean
  onBack?: () => void
}

function DetailLabelSlot({
  loading,
  label,
  skeletonWidth,
}: {
  loading: boolean
  label: string
  skeletonWidth: number
}) {
  return (
    <span
      className="relative block"
      style={{ minHeight: CARD_DETAILS_LABEL_LINE_HEIGHT, lineHeight: `${CARD_DETAILS_LABEL_LINE_HEIGHT}px` }}
    >
      <span className={loading ? "invisible" : undefined}>{label}</span>
      {loading ? (
        <SkeletonBar
          width={skeletonWidth}
          height={14}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
      ) : null}
    </span>
  )
}

function DetailValueSlot({
  loading,
  value,
  skeletonWidth,
}: {
  loading: boolean
  value: string
  skeletonWidth: number
}) {
  return (
    <span
      className="ffeature relative block"
      style={{ minHeight: CARD_DETAILS_VALUE_LINE_HEIGHT, lineHeight: `${CARD_DETAILS_VALUE_LINE_HEIGHT}px` }}
    >
      <span className={loading ? "invisible" : undefined}>{value}</span>
      {loading ? (
        <SkeletonBar
          width={skeletonWidth}
          height={14}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
      ) : null}
    </span>
  )
}

function BackIconSlot({ loading }: { loading: boolean }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: CARD_DETAILS_COPY_ICON_SIZE, height: CARD_DETAILS_COPY_ICON_SIZE }}
    >
      {loading ? (
        <SkeletonCircle size={CARD_DETAILS_COPY_ICON_SIZE} />
      ) : (
        <ChevronCircleLeft size="lg" className="text-action-primary" />
      )}
    </span>
  )
}

function CopyIconSlot({ loading }: { loading: boolean }) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: CARD_DETAILS_COPY_ICON_SIZE, height: CARD_DETAILS_COPY_ICON_SIZE }}
    >
      {loading ? (
        <SkeletonBar width={20} height={20} className="rounded-sm" />
      ) : (
        <CopyOutlined size="lg" className="text-secondary" aria-hidden />
      )}
    </span>
  )
}

export function CardDetailsContent({
  details,
  loading = false,
  onBack,
}: CardDetailsContentProps) {
  const { pop } = useNavigationStack()
  const handleBack = onBack ?? pop
  const snackbar = useSnackbar()

  const handleCopy = useCallback(
    async (value: string, message: string) => {
      try {
        await navigator.clipboard.writeText(value)
        snackbar.add({
          description: message,
          dismissible: true,
          timeout: 3000,
        })
      } catch {
        snackbar.add({
          description: "Could not copy to clipboard",
          dismissible: true,
          timeout: 3000,
        })
      }
    },
    [snackbar],
  )

  const resolveValue = (id: CardDetailsRowId, placeholder: string) => {
    if (loading || !details) {
      return placeholder
    }

    switch (id) {
      case "card-number":
        return details.cardNumber
      case "expiry-date":
        return details.expiryDate
      case "cvv":
        return details.cvv
    }
  }

  const resolveCopyValue = (id: CardDetailsRowId) => {
    if (!details) {
      return ""
    }

    switch (id) {
      case "card-number":
        return details.cardNumberRaw
      case "expiry-date":
        return details.expiryDateRaw
      case "cvv":
        return details.cvv
    }
  }

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-5 pr-6 pt-6">
          <GhostButton onClick={handleBack} aria-label="Back">
            <span
              className="relative flex items-center gap-2"
              style={{ minHeight: CARD_DETAILS_BACK_LINE_HEIGHT }}
            >
              <BackIconSlot loading={loading} />
              <span
                className="relative block"
                style={{ minHeight: CARD_DETAILS_BACK_LINE_HEIGHT, lineHeight: `${CARD_DETAILS_BACK_LINE_HEIGHT}px` }}
              >
                <span className={loading ? "invisible text-body-m font-semibold text-action-primary" : "text-body-m font-semibold text-action-primary"}>
                  Back
                </span>
                {loading ? (
                  <SkeletonBar
                    width={56}
                    height={14}
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                  />
                ) : null}
              </span>
            </span>
          </GhostButton>

          <div className="pb-4 pt-6">
            <div className="relative">
              <Typography
                variant="heading-l-accent"
                color="primary"
                as="h1"
                aria-hidden={loading}
              >
                <span className={loading ? "invisible" : undefined}>Card details</span>
              </Typography>
              {loading ? (
                <SkeletonBar
                  width={160}
                  height={14}
                  className="absolute left-0 top-1/2 -translate-y-1/2"
                />
              ) : null}
            </div>
          </div>
        </div>

        <ul className="m-0 list-none p-0">
          {CARD_DETAILS_ROW_TEMPLATES.map((row, index) => {
            const isLast = index === CARD_DETAILS_ROW_TEMPLATES.length - 1
            const value = resolveValue(row.id, row.placeholderValue)
            const copyValue = resolveCopyValue(row.id)

            return (
              <li key={row.id}>
                <ListItemLayout
                  isReverse
                  gap={1}
                  secondary={
                    <DetailLabelSlot
                      loading={loading}
                      label={row.label}
                      skeletonWidth={row.skeletonLabelWidth}
                    />
                  }
                  primary={
                    <DetailValueSlot
                      loading={loading}
                      value={value}
                      skeletonWidth={row.skeletonValueWidth}
                    />
                  }
                  separator={!isLast}
                  paddingStart={6}
                  paddingEnd={6}
                  onClick={
                    loading
                      ? undefined
                      : () => {
                          if (!copyValue) return
                          void handleCopy(copyValue, row.snackbarMessage)
                        }
                  }
                  aria-label={loading ? undefined : `Copy ${row.label}`}
                  renderEndSlot={() => <CopyIconSlot loading={loading} />}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
