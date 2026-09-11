import { Button, ListItemLayout, Typography } from "@bolteu/kalep-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { formatEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import {
  useNavigationStack,
  useNavbarBack,
  useNavigationLock,
} from "@/shared/navigation"
import failedTransferVideo from "../assets/failed-transfer-light.mp4"
import successfulTransferVideo from "../assets/successful-transfer-light.mp4"
import { formatRecipientDisplayName } from "../lib/formatRecipientName"
import { formatReviewReference } from "../lib/formatTransferReview"
import { formatIbanDisplay } from "../lib/iban"
import {
  createMockTransfer,
  type MockCreateTransferResult,
} from "../lib/mockCreateTransfer"
import { playSuccessHaptic } from "../lib/playSuccessHaptic"
import { getTransferArrivalCopy } from "../lib/transferArrivalCopy"
import {
  mapTransferFailureToUi,
  type TransferResultUiState,
} from "../lib/transferResultMapping"
import type { TransferDraft } from "../sendMoney.types"
import { AddRecipientScreen } from "./AddRecipientScreen"
import { TransferResultLoadingContent } from "./TransferResultLoadingContent"
import { TransferResultVideo } from "./TransferResultVideo"
import "./send-money-result.css"

export interface TransferResultScreenProps {
  draft: TransferDraft
}

interface ResultDetailRowProps {
  label: string
  value: string
  separator?: boolean
}

function ResultDetailRow({ label, value, separator = true }: ResultDetailRowProps) {
  return (
    <ListItemLayout
      isReverse
      gap={1}
      secondary={
        <Typography variant="body-s-regular" color="secondary" as="span">
          {label}
        </Typography>
      }
      primary={
        <Typography variant="body-m-compact-regular" color="primary" as="span">
          {value}
        </Typography>
      }
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
    />
  )
}

export function TransferResultScreen({ draft }: TransferResultScreenProps) {
  const {
    push,
    pop,
    popTo,
    popToRoot,
    reducedMotion,
    runAfterTransition,
    setNavigationLocked,
  } = useNavigationStack()
  const requestIdRef = useRef(draft.requestId ?? crypto.randomUUID())
  const [result, setResult] = useState<MockCreateTransferResult | null>(null)
  const hapticPlayedRef = useRef(false)

  const { recipient, amountCents, feeCents, reference } = draft
  const displayName = formatRecipientDisplayName(recipient.rawName)
  const ibanDisplay = formatIbanDisplay(recipient.iban)
  const referenceDisplay = formatReviewReference(reference)

  const uiState: TransferResultUiState = result == null
    ? "loading"
    : result.status === "failed"
      ? result.kind
      : "submitted"

  const isLoading = uiState === "loading"

  // Keep the confirmation screen up until the user taps an explicit action.
  useNavigationLock(true)

  const releaseNavigationLock = useCallback(() => {
    setNavigationLocked(false)
  }, [setNavigationLocked])

  const goToRecipientSelect = useCallback(() => {
    releaseNavigationLock()
    popTo("send-money")
  }, [popTo, releaseNavigationLock])

  const goToAmount = useCallback(() => {
    releaseNavigationLock()
    popTo(`send-money-amount:${recipient.id}`)
  }, [popTo, recipient.id, releaseNavigationLock])

  const goHome = useCallback(() => {
    releaseNavigationLock()
    popToRoot()
  }, [popToRoot, releaseNavigationLock])

  const goToReview = useCallback(() => {
    releaseNavigationLock()
    pop()
  }, [pop, releaseNavigationLock])

  const handleEditRecipient = useCallback(() => {
    releaseNavigationLock()
    runAfterTransition(() => {
      push({
        key: `send-money-edit-recipient:${recipient.id}`,
        render: () => (
          <AddRecipientScreen
            prefillName={recipient.rawName}
            prefillIban={recipient.iban}
          />
        ),
      })
    })
    popTo(`send-money-amount:${recipient.id}`)
  }, [
    popTo,
    push,
    recipient.id,
    recipient.iban,
    recipient.rawName,
    releaseNavigationLock,
    runAfterTransition,
  ])

  const handlePrimaryAction = useCallback(() => {
    switch (uiState) {
      case "submitted":
        goHome()
        break
      case "invalid_recipient":
        handleEditRecipient()
        break
      case "insufficient":
        goToAmount()
        break
      case "retryable":
        goToReview()
        break
      default:
        break
    }
  }, [
    goToAmount,
    goToReview,
    goHome,
    handleEditRecipient,
    uiState,
  ])

  const handleSecondaryAction = useCallback(() => {
    goHome()
  }, [goHome])

  useEffect(() => {
    let cancelled = false

    createMockTransfer({
      requestId: requestIdRef.current,
      amountCents,
      feeCents,
      recipientId: recipient.id,
      recipientIban: recipient.iban,
      markTrusted: draft.markTrusted ?? recipient.isTrusted,
    }).then((nextResult) => {
      if (!cancelled) {
        setResult(nextResult)
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    amountCents,
    draft.markTrusted,
    feeCents,
    recipient.id,
    recipient.iban,
    recipient.isTrusted,
  ])

  useEffect(() => {
    if (uiState !== "submitted" || hapticPlayedRef.current) return
    hapticPlayedRef.current = true
    playSuccessHaptic(reducedMotion)
  }, [reducedMotion, uiState])

  const navbarBackHandler = useCallback(() => {
    if (isLoading) return

    switch (uiState) {
      case "submitted":
        goHome()
        break
      case "invalid_recipient":
      case "insufficient":
        goHome()
        break
      case "retryable":
        goToReview()
        break
      default:
        break
    }
  }, [goHome, goToReview, isLoading, uiState])

  useNavbarBack(isLoading ? null : navbarBackHandler)

  const failureCopy =
    result?.status === "failed" ? mapTransferFailureToUi(result.kind) : null

  const arrivalCopy =
    result?.status === "submitted"
      ? getTransferArrivalCopy(result.arrivalRail)
      : null

  const showSecondary =
    uiState === "submitted" ||
    uiState === "invalid_recipient" ||
    uiState === "insufficient"

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-layer-floor-1">
      {isLoading ? (
        <TransferResultLoadingContent />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
          <div className="flex flex-col items-center">
            <TransferResultVideo
              src={
                uiState === "submitted"
                  ? successfulTransferVideo
                  : failedTransferVideo
              }
              reducedMotion={reducedMotion}
            />

            <div className="w-full px-6 pt-6 text-center">
              <Typography variant="heading-l-accent" color="primary" as="h1">
                {uiState === "submitted"
                  ? `You’ve sent ${formatEurFromCents(amountCents)}`
                  : failureCopy?.heading}
              </Typography>
            </div>

            <div className="w-full px-6 pt-1 text-center">
              <Typography variant="body-m-regular" color="secondary" as="p">
                {uiState === "submitted" ? arrivalCopy : failureCopy?.body}
              </Typography>
            </div>
          </div>

          {uiState === "submitted" ? (
            <div className="w-full shrink-0 pt-2">
              <ResultDetailRow label="Recipient" value={displayName} />
              <ResultDetailRow
                label="IBAN"
                value={ibanDisplay}
                separator={Boolean(reference?.trim())}
              />
              {reference?.trim() ? (
                <ResultDetailRow
                  label="Reference"
                  value={referenceDisplay}
                  separator={false}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      {!isLoading ? (
        <div className="shrink-0 flex flex-col gap-3 bg-layer-floor-1 px-6 py-4">
          <Button size="lg" variant="primary" fullWidth onClick={handlePrimaryAction}>
            {uiState === "submitted"
              ? "Done"
              : failureCopy?.primaryLabel}
          </Button>
          {showSecondary ? (
            <Button
              size="lg"
              variant="secondary"
              fullWidth
              onClick={
                uiState === "submitted" ? goToRecipientSelect : handleSecondaryAction
              }
            >
              {uiState === "submitted"
                ? "Make another transfer"
                : failureCopy?.secondaryLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
