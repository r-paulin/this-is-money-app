import {
  Button,
  ListItemLayout,
  Typography,
  useSnackbar,
} from "@bolteu/kalep-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAfterNavigationTransition, useNavigationStack } from "@/shared/navigation"
import { formatRecipientDisplayName } from "../lib/formatRecipientName"
import {
  amountCentsFromState,
  EMPTY_AMOUNT_STATE,
  formatAmountDisplay,
  type AmountInputState,
} from "../lib/amountInput"
import {
  buildAmountHelperParts,
  fetchMockFeeQuote,
  type FeeQuote,
} from "../lib/mockTransferQuote"
import { sanitizeReferenceInput } from "../lib/referenceValidation"
import {
  isOverSpendable,
  validateTransferAmountOnSubmit,
} from "../lib/transferLimits"
import { resolveMockPayeeVerification } from "../lib/mockPayeeVerification"
import type { Recipient, TransferDraft } from "../sendMoney.types"
import { AddRecipientScreen } from "./AddRecipientScreen"
import { AmountField } from "./AmountField"
import { ReferenceField } from "./ReferenceField"
import { ReviewAndSendScreen } from "./ReviewAndSendScreen"
import "./send-money-amount.css"

const MIN_AMOUNT_CENTS = 1

export interface AmountScreenProps {
  recipient: Recipient
  spendableCents?: number
  balanceError: boolean
  onRetryBalance: () => void
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function AmountScreen({
  recipient,
  spendableCents,
  balanceError,
  onRetryBalance,
}: AmountScreenProps) {
  const { push, pop } = useNavigationStack()
  const snackbar = useSnackbar()
  const navigationReady = useAfterNavigationTransition()

  const [amountState, setAmountState] = useState<AmountInputState>(EMPTY_AMOUNT_STATE)
  const [referenceExpanded, setReferenceExpanded] = useState(false)
  const [reference, setReference] = useState("")
  const [feeQuote, setFeeQuote] = useState<FeeQuote | undefined>(undefined)
  const [shakeRequest, setShakeRequest] = useState(0)
  const [insufficientAttempts, setInsufficientAttempts] = useState(0)
  const [overBalanceErrorVisible, setOverBalanceErrorVisible] = useState(false)

  const displayName = formatRecipientDisplayName(recipient.rawName)
  const amountCents = amountCentsFromState(amountState)
  const display = formatAmountDisplay(amountState)

  const balanceKnown = spendableCents !== undefined && !balanceError
  const overBalance =
    balanceKnown && isOverSpendable(amountCents, spendableCents ?? 0)

  const helperParts = useMemo(() => {
    if (balanceError || !balanceKnown) {
      return undefined
    }
    return buildAmountHelperParts(spendableCents!, feeQuote)
  }, [balanceError, balanceKnown, spendableCents, feeQuote])

  const helperErrorText = balanceError ? "Balance unavailable. Try again." : undefined

  useEffect(() => {
    if (!balanceKnown) {
      return
    }

    let cancelled = false

    fetchMockFeeQuote(amountCents).then((quote) => {
      if (!cancelled) {
        setFeeQuote(quote)
      }
    })

    return () => {
      cancelled = true
    }
  }, [amountCents, balanceKnown])

  const triggerShake = useCallback(() => {
    if (prefersReducedMotion()) return
    setShakeRequest((request) => request + 1)
  }, [])

  const showOverBalanceError = overBalance && overBalanceErrorVisible

  const revealOverBalanceError = useCallback(
    (shouldWobble: boolean) => {
      if (!overBalance) return
      const wasVisible = overBalanceErrorVisible
      setOverBalanceErrorVisible(true)
      if (shouldWobble && !wasVisible) {
        triggerShake()
      }
    },
    [overBalance, overBalanceErrorVisible, triggerShake],
  )

  const handleAmountChange = (state: AmountInputState) => {
    setAmountState(state)
    setInsufficientAttempts(0)

    if (!balanceKnown) {
      setOverBalanceErrorVisible(false)
      return
    }

    const cents = amountCentsFromState(state)
    const nowOver = isOverSpendable(cents, spendableCents!)
    const wasVisible = overBalanceErrorVisible
    setOverBalanceErrorVisible(nowOver)
    if (nowOver && !wasVisible) {
      triggerShake()
    }
  }

  const handleAmountFocus = () => {
    setInsufficientAttempts(0)
    setOverBalanceErrorVisible(false)
  }

  const handleAmountBlur = () => {
    revealOverBalanceError(true)
  }

  const handleReview = () => {
    if (!balanceKnown) return

    const error = validateTransferAmountOnSubmit(amountCents, spendableCents!)
    if (error) {
      if (error.kind === "insufficient") {
        revealOverBalanceError(false)
        if (insufficientAttempts === 0) {
          triggerShake()
          setInsufficientAttempts(1)
          return
        }
        snackbar.add({
          description: error.message,
          dismissible: false,
          timeout: 4000,
        })
        return
      }
      snackbar.add({
        description: error.message,
        dismissible: false,
        timeout: 4000,
      })
      return
    }

    const draft: TransferDraft = {
      recipient,
      amountCents,
      feeCents: feeQuote?.status === "ready" ? feeQuote.feeCents : 0,
      reference: reference.trim() ? reference.trim() : undefined,
      payeeVerification: resolveMockPayeeVerification(recipient),
    }

    const handleEditRecipient = () => {
      pop()
      push({
        key: `send-money-edit-recipient:${recipient.id}`,
        render: () => (
          <AddRecipientScreen
            prefillName={recipient.rawName}
            prefillIban={recipient.iban}
          />
        ),
      })
    }

    push({
      key: `send-money-review:${recipient.id}`,
      render: () => (
        <ReviewAndSendScreen draft={draft} onEditRecipient={handleEditRecipient} />
      ),
    })
  }

  const canReview = balanceKnown && amountCents >= MIN_AMOUNT_CENTS
  const amountDisabled = !balanceKnown
  const shouldAutoFocusAmount = navigationReady && balanceKnown

  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <Typography variant="body-s-regular" color="secondary" as="p">
          Step 2 of 3
        </Typography>
        <div className="pt-2">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Enter an amount
          </Typography>
        </div>
        <span className="line-clamp-2 pt-2">
          <Typography variant="body-m-regular" color="secondary" as="span">
            Sending to {displayName}
          </Typography>
        </span>
      </div>

      <div className="flex-1">
        <AmountField
          state={amountState}
          display={display}
          disabled={amountDisabled}
          error={showOverBalanceError}
          helperParts={helperParts}
          helperText={helperErrorText}
          shakeRequest={shakeRequest}
          autoFocus={shouldAutoFocusAmount}
          focusKey={spendableCents}
          onStateChange={handleAmountChange}
          onFocus={handleAmountFocus}
          onBlur={handleAmountBlur}
        />

        {balanceError ? (
          <div className="px-6 pb-2">
            <Button size="sm" variant="secondary" onClick={onRetryBalance}>
              Retry balance
            </Button>
          </div>
        ) : null}

        <div className="send-money-reference">
          <div
            className={[
              "send-money-reference__panel",
              referenceExpanded ? "is-visible" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <ReferenceField
              value={reference}
              autoFocus={referenceExpanded}
              onChange={(value) => setReference(sanitizeReferenceInput(value))}
              onClear={() => {
                setReference("")
                setReferenceExpanded(false)
              }}
            />
          </div>
          <div
            className={[
              "send-money-reference__panel",
              !referenceExpanded ? "is-visible" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <ListItemLayout
              primary={
                <Typography variant="body-m-compact-accent" color="link-primary" as="span">
                  Add reference
                </Typography>
              }
              paddingStart={6}
              paddingEnd={6}
              paddingTop={3}
              paddingBottom={3}
              onClick={() => setReferenceExpanded(true)}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-layer-floor-1 px-6 py-4">
        <Button
          size="lg"
          variant="primary"
          fullWidth
          disabled={!canReview}
          onClick={handleReview}
        >
          Review payment
        </Button>
      </div>
    </div>
  )
}
