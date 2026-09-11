import { Button, ListItemLayout, Typography } from "@bolteu/kalep-react"
import Alert from "@bolteu/kalep-react-icons/dist/Alert"
import CheckCircle from "@bolteu/kalep-react-icons/dist/CheckCircle"
import HelpCircle from "@bolteu/kalep-react-icons/dist/HelpCircle"
import InfoCircle from "@bolteu/kalep-react-icons/dist/InfoCircle"
import User from "@bolteu/kalep-react-icons/dist/User"
import Verified from "@bolteu/kalep-react-icons/dist/Verified"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useNavigationStack } from "@/shared/navigation"
import { formatEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import { formatRecipientDisplayName } from "../lib/formatRecipientName"
import {
  formatReviewFeeLabel,
  formatReviewReference,
  formatReviewTotalCents,
} from "../lib/formatTransferReview"
import { formatIbanDisplay } from "../lib/iban"
import {
  getNameConfirmedMessage,
  getPartialMatchBannerMessage,
  getReviewScreenRules,
  LINKED_DRIVER_PROFILE_MESSAGE,
} from "../lib/reviewScreenLogic"
import type { TransferDraft } from "../sendMoney.types"
import { TransferResultScreen } from "./TransferResultScreen"
import "./send-money-review.css"

export interface ReviewAndSendScreenProps {
  draft: TransferDraft
  onEditRecipient: () => void
}

interface RecipientDetailRowProps {
  label: string
  value: ReactNode
  separator?: boolean
  valueAccent?: boolean
}

function RecipientDetailRow({
  label,
  value,
  separator = true,
  valueAccent = false,
}: RecipientDetailRowProps) {
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
        typeof value === "string" ? (
          <Typography
            variant={valueAccent ? "body-m-compact-accent" : "body-m-compact-regular"}
            color="primary"
            as="span"
          >
            {value}
          </Typography>
        ) : (
          value
        )
      }
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
    />
  )
}

interface TransferDetailRowProps {
  label: string
  value: string
  separator?: boolean
  valueAccent?: boolean
}

function TransferDetailRow({
  label,
  value,
  separator = true,
  valueAccent = false,
}: TransferDetailRowProps) {
  return (
    <ListItemLayout
      variant="sm"
      primary={
        <Typography
          variant={valueAccent ? "body-m-compact-accent" : "body-m-compact-regular"}
          color={valueAccent ? "primary" : "secondary"}
          as="span"
        >
          {label}
        </Typography>
      }
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      renderEndSlot={() => (
        <Typography
          variant={valueAccent ? "body-m-compact-accent" : "body-m-compact-regular"}
          color="primary"
          as="span"
          align="end"
        >
          {value}
        </Typography>
      )}
    />
  )
}

interface InlineBannerProps {
  tone: "neutral" | "warning" | "danger"
  icon: ReactNode
  title?: string
  body: string
}

function InlineBanner({ tone, icon, title, body }: InlineBannerProps) {
  const toneClass =
    tone === "warning"
      ? "bg-warning-secondary"
      : tone === "danger"
        ? "bg-danger-secondary"
        : "bg-neutral-secondary"

  return (
    <div className={`mx-6 rounded-[var(--dimension-300)] px-4 py-3 ${toneClass}`}>
      <div className="flex items-start gap-4">
        <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          {title ? (
            <Typography variant="body-m-compact-accent" color="primary" as="p">
              {title}
            </Typography>
          ) : null}
          <div className={title ? "pt-0.5" : undefined}>
            <Typography variant="body-s-regular" color="primary" as="p">
              {body}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrustedAccountBanner({
  enabled,
  checked,
  onCheckedChange,
}: {
  enabled: boolean
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const textColor = enabled ? "primary" : "secondary"

  return (
    <div className="px-6 py-2">
      <div
        className={[
          "send-money-trusted-banner",
          checked ? "is-active" : "is-idle",
        ].join(" ")}
      >
        <div className="flex items-start">
          <div className="shrink-0 pr-4 pt-[2px]">
            <Verified
              size="lg"
              className="size-6 shrink-0 text-positive-primary"
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="py-[2px]">
              <Typography variant="body-m-compact-accent" color={textColor} as="p">
                Make this a trusted account
              </Typography>
            </div>
            <Typography variant="body-s-regular" color={textColor} as="p">
              Verify this account once, then send money to it without verifying again.
            </Typography>
          </div>
          <div className="shrink-0 pl-3">
            <button
              type="button"
              role="switch"
              className={[
                "send-money-trusted-toggle",
                checked ? "is-checked" : "",
                enabled ? "" : "is-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-checked={checked}
              aria-label="Make this a trusted account"
              disabled={!enabled}
              onClick={() => {
                if (!enabled) return
                onCheckedChange(!checked)
              }}
            >
              <span className="send-money-trusted-toggle__track" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-6 pb-2 pt-3">
      <Typography variant="heading-xs-accent" color="primary" as="h2">
        {title}
      </Typography>
    </div>
  )
}

interface RecipientCopStatusProps {
  rules: ReturnType<typeof getReviewScreenRules>
  payeeVerification: TransferDraft["payeeVerification"]
  bankName: string
}

function LinkedDriverProfileStatus() {
  return (
    <div className="flex items-center gap-2 pt-1">
      <User size="sm" className="shrink-0 text-positive-primary" aria-hidden />
      <Typography variant="body-s-regular" color="positive-primary" as="p">
        {LINKED_DRIVER_PROFILE_MESSAGE}
      </Typography>
    </div>
  )
}

function RecipientCopStatus({
  rules,
  payeeVerification,
  bankName,
}: RecipientCopStatusProps) {
  if (rules.bannerKind === "linked-profile") {
    return <LinkedDriverProfileStatus />
  }

  if (rules.bannerKind === "name-confirmed") {
    return (
      <div className="flex items-center gap-2 pt-1">
        <CheckCircle size="sm" className="shrink-0 text-positive-primary" aria-hidden />
        <Typography variant="body-s-regular" color="positive-primary" as="p">
          {getNameConfirmedMessage(payeeVerification.resolvedBankName ?? bankName)}
        </Typography>
      </div>
    )
  }

  if (rules.bannerKind === "cop-warning") {
    return (
      <div className="pt-2">
        <div className="rounded-[var(--dimension-300)] bg-warning-secondary px-4 py-3">
          <div className="flex items-start gap-4">
            <HelpCircle size="md" className="mt-0.5 shrink-0" aria-hidden />
            <Typography variant="body-s-regular" color="primary" as="p">
              {getPartialMatchBannerMessage(payeeVerification.status)}
            </Typography>
          </div>
        </div>
        {payeeVerification.maskedAccountName ? (
          <div className="pt-2">
            <Typography variant="body-s-regular" color="secondary" as="p">
              Bank record: {payeeVerification.maskedAccountName}
            </Typography>
          </div>
        ) : null}
      </div>
    )
  }

  if (rules.bannerKind === "cop-danger") {
    return (
      <div className="pt-2">
        <div className="rounded-[var(--dimension-300)] bg-danger-secondary px-4 py-3">
          <div className="flex items-start gap-4">
            <Alert size="md" className="mt-0.5 shrink-0" aria-hidden />
            <Typography variant="body-s-regular" color="primary" as="p">
              Name doesn&apos;t match the bank records. Make sure the details are
              correct before continuing.
            </Typography>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function ReviewAndSendScreen({
  draft,
  onEditRecipient,
}: ReviewAndSendScreenProps) {
  const { push, isTransitioning, stack } = useNavigationStack()
  const hasSubmittedRef = useRef(false)
  const { recipient, amountCents, feeCents, reference, payeeVerification } = draft
  const reviewKey = `send-money-review:${recipient.id}`
  const isReviewTop = stack[stack.length - 1]?.key === reviewKey

  useEffect(() => {
    if (isReviewTop) {
      hasSubmittedRef.current = false
    }
  }, [isReviewTop])
  const rules = getReviewScreenRules(
    payeeVerification.status,
    recipient.isLinkedBankAccount,
  )
  const [markTrusted, setMarkTrusted] = useState(recipient.isTrusted)
  const displayName = formatRecipientDisplayName(recipient.rawName)
  const ibanDisplay = formatIbanDisplay(recipient.iban)
  const bankName =
    payeeVerification.resolvedBankName ??
    resolveMockBankNameFallback(recipient.iban)
  const trustedToggleEnabled =
    rules.trustedToggleEnabled && !recipient.isTrusted
  const trustedToggleChecked = recipient.isTrusted || markTrusted

  const handleSend = useCallback(() => {
    if (hasSubmittedRef.current || isTransitioning) return
    hasSubmittedRef.current = true

    const requestId = crypto.randomUUID()
    const draftWithRequest: TransferDraft = {
      ...draft,
      requestId,
      markTrusted: trustedToggleChecked,
    }

    push({
      key: `send-money-result:${requestId}`,
      render: () => <TransferResultScreen draft={draftWithRequest} />,
    })
  }, [draft, isTransitioning, push, trustedToggleChecked])

  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <Typography variant="body-s-regular" color="secondary" as="p">
          Step 3 of 3
        </Typography>
        <div className="pt-2">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Review and send
          </Typography>
        </div>
      </div>

      <div className="flex flex-1 flex-col pb-4">
        {rules.bannerKind === "trust" ? (
          <div className="pb-2">
            <InlineBanner
              tone="neutral"
              icon={<InfoCircle size="md" aria-hidden />}
              title="Only transfer money to someone you trust"
              body="If you're unsure, stop — the payment may not be reversible. Scammers can impersonate others, and we'll never ask you to send a payment."
            />
          </div>
        ) : null}

        <div className="send-money-review__grouped">
          <div className="send-money-review__section send-money-review__section--bottom-rounded">
            <div className="send-money-review__section-padding-top" aria-hidden />
            <SectionHeader title="Recipient details" />
            <RecipientDetailRow
              label="Recipient"
              value={
                <div>
                  <Typography variant="body-m-compact-regular" color="primary" as="p">
                    {displayName}
                  </Typography>
                  <RecipientCopStatus
                    rules={rules}
                    payeeVerification={payeeVerification}
                    bankName={bankName}
                  />
                </div>
              }
            />
            <RecipientDetailRow label="IBAN" value={ibanDisplay} />
            <RecipientDetailRow label="Bank" value={bankName} />
            <RecipientDetailRow
              label="Reference"
              value={formatReviewReference(reference)}
              separator={false}
            />
            <div className="send-money-review__section-padding-bottom" aria-hidden />
          </div>

          <div className="send-money-review__section-separator" aria-hidden />

          <div className="send-money-review__section send-money-review__section--top-rounded">
            <div className="send-money-review__section-padding-top" aria-hidden />
            <SectionHeader title="Transfer details" />
            <TransferDetailRow
              label="Recipient gets"
              value={formatEurFromCents(amountCents)}
            />
            <TransferDetailRow
              label="Fee"
              value={formatReviewFeeLabel(feeCents)}
            />
            <TransferDetailRow
              label="Total"
              value={formatReviewTotalCents(amountCents, feeCents)}
              separator={false}
              valueAccent
            />
            <div className="send-money-review__section-padding-bottom" aria-hidden />
          </div>
        </div>

        {!recipient.isLinkedBankAccount ? (
          <TrustedAccountBanner
            enabled={trustedToggleEnabled}
            checked={trustedToggleChecked}
            onCheckedChange={setMarkTrusted}
          />
        ) : null}
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 bg-layer-floor-1 px-6 py-4">
        {rules.ctaMode === "edit-and-send" ? (
          <>
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onClick={onEditRecipient}
            >
              Edit recipient
            </Button>
            <Button
              size="lg"
              variant="secondary"
              fullWidth
              onClick={handleSend}
            >
              Send anyway
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            variant="primary"
            fullWidth
            onClick={handleSend}
          >
            Confirm and send
          </Button>
        )}
      </div>
    </div>
  )
}

function resolveMockBankNameFallback(iban: string): string {
  const country = iban.trim().slice(0, 2).toUpperCase()
  if (country === "FR") return "BNP Paribas"
  if (country === "LV") return "Swedbank"
  return "Recipient bank"
}
