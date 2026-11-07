import { ListItemLayout, Typography, useSnackbar } from "@bolteu/kalep-react"
import CopyOutlined from "@bolteu/kalep-react-icons/dist/CopyOutlined"
import { useCallback } from "react"
import { AmountGate } from "@/features/sendMoney"
import { MaskedIban } from "@/features/sendMoney/components/MaskedIban"
import type { Recipient } from "@/features/sendMoney/sendMoney.types"
import { useNavigationStack } from "@/shared/navigation"
import { buildMockTransactions } from "../data/mockTransactions"
import type {
  CardPaymentDetailView,
  DetailRelatedPaymentView,
  PayoutDetailView,
  TransferDetailView,
  TransactionDetailView,
} from "../lib/transactionDetailContent"
import { useOpenTransactionDetail } from "../useOpenTransactionDetail"
import { TransactionCategoryIcon } from "./TransactionCategoryIcon"
import {
  DetailInlineRow,
  DetailSectionHeader,
  DetailStackRow,
} from "./TransactionDetailRows"
import "./transaction-detail.css"

function CopyEndSlot() {
  return <CopyOutlined size="lg" className="text-secondary" aria-hidden />
}

function useCopyToClipboard() {
  const snackbar = useSnackbar()

  return useCallback(
    async (value: string, message: string) => {
      try {
        await navigator.clipboard.writeText(value)
        snackbar.add({ description: message, dismissible: true, timeout: 3000 })
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
}

function truncateId(id: string): string {
  if (id.length <= 14) return id
  return `${id.slice(0, 6)}...${id.slice(-4)}`
}

function sectionClass(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function RelatedPaymentSection({
  related,
  bottomRounded,
}: {
  related: DetailRelatedPaymentView
  bottomRounded: boolean
}) {
  const openDetail = useOpenTransactionDetail()
  const isCashbackRow = related.amountText != null

  const openRelated = () => {
    if (!related.targetId) return
    const match = buildMockTransactions().find(
      (row) => row.transactionId === related.targetId || row.id === related.targetId,
    )
    if (match) openDetail(match)
  }

  return (
    <>
      <div className="transaction-detail__section-separator" aria-hidden />
      <div
        className={sectionClass(
          "transaction-detail__section",
          bottomRounded && "transaction-detail__section--bottom-rounded",
        )}
      >
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title={related.label} />
        {isCashbackRow ? (
          <ListItemLayout
            onClick={related.targetId ? openRelated : undefined}
            primary={related.merchant}
            secondary={related.secondary}
            separator={false}
            paddingStart={6}
            paddingEnd={6}
            paddingTop={2}
            paddingBottom={2}
            primaryTypographyProps={{ variant: "body-m-compact-regular" }}
            secondaryTypographyProps={{ variant: "body-s-regular" }}
            renderStartSlot={() => (
              <div className="self-start py-1.5">
                <TransactionCategoryIcon mcc={related.mcc ?? 0} kind="purchase" />
              </div>
            )}
            renderEndSlot={() => (
              <div className="self-start pt-1">
                <Typography
                  variant="body-m-compact-regular"
                  color="primary"
                  as="span"
                  align="end"
                  inlineStyle={{ fontVariantNumeric: "lining-nums tabular-nums" }}
                >
                  {related.amountText}
                </Typography>
              </div>
            )}
            aria-label={`${related.merchant}, ${related.secondary ?? ""}, ${related.amountText}`}
          />
        ) : (
          <DetailStackRow
            label="Payment"
            value={
              <>
                {related.merchant}
                {related.secondary ? (
                  <Typography variant="body-s-regular" color="secondary" as="span">
                    {related.secondary}
                  </Typography>
                ) : null}
              </>
            }
            separator={false}
          />
        )}
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>
    </>
  )
}

function CardPaymentSections({ view }: { view: CardPaymentDetailView }) {
  const copy = useCopyToClipboard()
  const lastSection = view.cashback
    ? "cashback"
    : view.dispute
      ? "dispute"
      : view.relatedPayment
        ? "related"
        : view.feeMeta
          ? "fee"
          : view.currency
            ? "currency"
            : "details"

  return (
    <div className="transaction-detail__grouped">
      <div
        className={sectionClass(
          "transaction-detail__section",
          "transaction-detail__section--top-rounded",
          lastSection === "details" && "transaction-detail__section--bottom-rounded",
        )}
      >
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title={view.detailsTitle} />
        {view.cashbackCredit ? (
          view.amountRows?.map((row, index) => (
            <DetailInlineRow
              key={row.label}
              label={row.label}
              value={row.value}
              valueAccent={row.accent}
              separator={index < (view.amountRows?.length ?? 0) - 1}
            />
          ))
        ) : (
          <>
            <DetailInlineRow label="Paid with" value={view.paidWith} />
            {view.chargedOn ? (
              <DetailInlineRow label="Charged on" value={view.chargedOn} />
            ) : null}
            <DetailInlineRow
              label="Transaction ID"
              value={truncateId(view.transactionId)}
              onClick={() => void copy(view.transactionId, "Transaction ID copied")}
              endSlot={<CopyEndSlot />}
              ariaLabel="Copy transaction ID"
            />
            {view.amountRows?.map((row, index) => (
              <DetailInlineRow
                key={row.label}
                label={row.label}
                value={row.value}
                valueAccent={row.accent}
                separator={
                  index < (view.amountRows?.length ?? 0) - 1 ||
                  view.merchantName.length > 0
                }
              />
            ))}
            <DetailStackRow
              label="Merchant"
              value={
                <>
                  {view.merchantName}
                  {view.merchantLocation ? (
                    <Typography variant="body-s-regular" color="secondary" as="span">
                      {view.merchantLocation}
                    </Typography>
                  ) : null}
                  {view.merchantDescriptor ? (
                    <Typography variant="body-s-regular" color="secondary" as="span">
                      Also appears as: {view.merchantDescriptor}
                    </Typography>
                  ) : null}
                </>
              }
              separator={false}
            />
          </>
        )}
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>

      {view.currency ? (
        <>
          <div className="transaction-detail__section-separator" aria-hidden />
          <div
            className={sectionClass(
              "transaction-detail__section",
              lastSection === "currency" && "transaction-detail__section--bottom-rounded",
            )}
          >
            <div className="transaction-detail__section-padding-top" aria-hidden />
            <DetailSectionHeader title="Currency" />
            <DetailStackRow label="Paid" value={view.currency.paidText} />
            <DetailStackRow label="Exchange rate" value={view.currency.rateText} />
            <DetailStackRow label="Fee" value={view.currency.feeNote} separator={false} />
            <div className="transaction-detail__section-padding-bottom" aria-hidden />
          </div>
        </>
      ) : null}

      {view.feeMeta ? (
        <>
          <div className="transaction-detail__section-separator" aria-hidden />
          <div
            className={sectionClass(
              "transaction-detail__section",
              lastSection === "fee" && "transaction-detail__section--bottom-rounded",
            )}
          >
            <div className="transaction-detail__section-padding-top" aria-hidden />
            <DetailSectionHeader title="Fee details" />
            <DetailStackRow label="What for" value={view.feeMeta.purpose} />
            <DetailStackRow label="How calculated" value={view.feeMeta.calculation} separator={false} />
            <div className="transaction-detail__section-padding-bottom" aria-hidden />
          </div>
        </>
      ) : null}

      {view.relatedPayment ? (
        <RelatedPaymentSection
          related={view.relatedPayment}
          bottomRounded={lastSection === "related"}
        />
      ) : null}

      {view.dispute ? (
        <>
          <div className="transaction-detail__section-separator" aria-hidden />
          <div
            className={sectionClass(
              "transaction-detail__section",
              lastSection === "dispute" && "transaction-detail__section--bottom-rounded",
            )}
          >
            <div className="transaction-detail__section-padding-top" aria-hidden />
            <DetailSectionHeader title="Dispute" />
            <DetailInlineRow label="Opened" value={view.dispute.openedLabel} />
            <DetailInlineRow
              label="Reference"
              value={view.dispute.reference}
              onClick={() => void copy(view.dispute!.reference, "Dispute reference copied")}
              endSlot={<CopyEndSlot />}
              ariaLabel="Copy dispute reference"
              separator={false}
            />
            <div className="transaction-detail__section-padding-bottom" aria-hidden />
          </div>
        </>
      ) : null}

      {view.cashback ? (
        <>
          <div className="transaction-detail__section-separator" aria-hidden />
          <div className="transaction-detail__section transaction-detail__section--bottom-rounded">
            <div className="transaction-detail__section-padding-top" aria-hidden />
            <DetailSectionHeader title="Cashback" />
            <ListItemLayout
              primary={view.cashback.title}
              secondary={view.cashback.secondary}
              separator={false}
              paddingStart={6}
              paddingEnd={6}
              primaryTypographyProps={{ variant: "body-m-compact-regular" }}
              secondaryTypographyProps={{ variant: "body-s-regular" }}
              renderStartSlot={() => (
                <div className="self-start py-1.5">
                  <TransactionCategoryIcon
                    mcc={0}
                    kind="cashback"
                    themeOverride="cashback"
                    surface="detail"
                  />
                </div>
              )}
              renderEndSlot={() => (
                <Typography
                  variant="body-m-compact-regular"
                  color={view.cashback!.state === "received" ? "primary" : "secondary"}
                  as="span"
                  align="end"
                >
                  {view.cashback!.endText}
                </Typography>
              )}
              aria-label={`${view.cashback.title}, ${view.cashback.endText}`}
            />
            <div className="transaction-detail__section-padding-bottom" aria-hidden />
          </div>
        </>
      ) : null}
    </div>
  )
}

function TransferSections({ view }: { view: TransferDetailView }) {
  const copy = useCopyToClipboard()
  const { push } = useNavigationStack()
  const partyTitle = view.direction === "in" ? "Sender" : "Recipient"

  const handleSendAgain = useCallback(() => {
    if (!view.recipientIban) return
    const recipient: Recipient = {
      id: `send-again:${view.transferId}`,
      rawName: view.accountHolder,
      iban: view.recipientIban,
      lastAmountCents: 0,
      lastTransferredAt: Date.now(),
      transferCount90d: 1,
      transferCount365d: 1,
      averageAmountCents: 0,
      isLinkedBankAccount: false,
      isTrusted: false,
    }
    push({
      key: `send-money-amount:${recipient.id}`,
      render: () => <AmountGate recipient={recipient} />,
    })
  }, [push, view.accountHolder, view.recipientIban, view.transferId])

  return (
    <div className="transaction-detail__grouped">
      <div className="transaction-detail__section transaction-detail__section--bottom-rounded">
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title={partyTitle} />
        <DetailStackRow label="Account holder name" value={view.accountHolder} />
        <DetailStackRow
          label="IBAN"
          value={
            <MaskedIban
              iban={view.recipientIban ?? ""}
              fallbackDisplay={view.ibanDisplay}
            />
          }
          caption={view.bankName}
          separator={view.showSendAgain}
        />
        {view.showSendAgain ? <ListItemSendAgainRow onClick={handleSendAgain} /> : null}
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>

      <div className="transaction-detail__section-separator" aria-hidden />

      {view.sentSection ? (
        <>
          <div className="transaction-detail__section">
            <div className="transaction-detail__section-padding-top" aria-hidden />
            <DetailSectionHeader title={view.sentSection.title} />
            {view.sentSection.rows.map((row, index) => (
              <DetailInlineRow
                key={row.label}
                label={row.label}
                value={row.value}
                valueAccent={row.accent}
                density={row.accent ? "l" : "m"}
                separator={index < view.sentSection!.rows.length - 1}
              />
            ))}
            <div className="transaction-detail__section-padding-bottom" aria-hidden />
          </div>
          <div className="transaction-detail__section-separator" aria-hidden />
        </>
      ) : null}

      {view.returnedSection ? (
        <>
          <div className="transaction-detail__section">
            <div className="transaction-detail__section-padding-top" aria-hidden />
            <DetailSectionHeader title={view.returnedSection.title} />
            {view.returnedSection.rows.map((row, index) => (
              <DetailInlineRow
                key={row.label}
                label={row.label}
                value={row.value}
                valueAccent={row.accent}
                density={row.accent ? "l" : "m"}
                separator={index < view.returnedSection!.rows.length - 1}
              />
            ))}
            <div className="transaction-detail__section-padding-bottom" aria-hidden />
          </div>
          <div className="transaction-detail__section-separator" aria-hidden />
        </>
      ) : null}

      <div className="transaction-detail__section transaction-detail__section--top-rounded transaction-detail__section--bottom-rounded">
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title="Transfer details" />
        <DetailStackRow label="Reference" value={view.reference} />
        <DetailInlineRow label="Date" value={view.date} />
        <DetailInlineRow
          label="Transfer ID"
          value={view.transferId}
          onClick={() => void copy(view.transferId, "Transfer ID copied")}
          endSlot={<CopyEndSlot />}
          ariaLabel="Copy transfer ID"
        />
        {view.currencyRows?.map((row) => (
          <DetailInlineRow
            key={row.label}
            label={row.label}
            value={row.value}
            valueAccent={row.accent}
          />
        ))}
        <DetailInlineRow label="Amount" value={view.amount} />
        <DetailInlineRow label="Fee" value={view.fee} valueMuted />
        <DetailInlineRow
          label="Total"
          value={view.total}
          separator={false}
          valueAccent
          density="l"
        />
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>
    </div>
  )
}

function ListItemSendAgainRow({ onClick }: { onClick: () => void }) {
  return (
    <ListItemLayout
      primary={
        <Typography variant="body-m-compact-accent" color="action-primary" as="span">
          Send again
        </Typography>
      }
      separator={false}
      paddingStart={6}
      paddingEnd={6}
      paddingTop={3}
      paddingBottom={3}
      onClick={onClick}
      aria-label="Send again"
    />
  )
}

function PayoutSections({ view }: { view: PayoutDetailView }) {
  const copy = useCopyToClipboard()

  return (
    <div className="transaction-detail__grouped">
      <div className="transaction-detail__section transaction-detail__section--bottom-rounded">
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title="Sender" />
        <DetailStackRow label="Account holder name" value={view.senderName} separator={false} />
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>

      <div className="transaction-detail__section-separator" aria-hidden />

      <div className="transaction-detail__section transaction-detail__section--top-rounded transaction-detail__section--bottom-rounded">
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title="Transfer details" />
        <DetailStackRow
          label="Reference"
          value={
            <Typography variant="body-m-compact-regular" color="primary" as="span">
              {view.reference}
            </Typography>
          }
        />
        <DetailInlineRow label="Date" value={view.date} />
        <DetailInlineRow
          label="Transfer ID"
          value={view.transferId}
          onClick={() => void copy(view.transferId, "Transfer ID copied")}
          endSlot={<CopyEndSlot />}
          ariaLabel="Copy transfer ID"
        />
        <DetailInlineRow label="Amount" value={view.amount} separator={false} valueAccent />
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>
    </div>
  )
}

export interface TransactionDetailSectionsProps {
  view: TransactionDetailView
}

export function TransactionDetailSections({ view }: TransactionDetailSectionsProps) {
  switch (view.variant) {
    case "card_payment":
      return <CardPaymentSections view={view} />
    case "transfer":
      return <TransferSections view={view} />
    case "payout":
      return <PayoutSections view={view} />
  }
}
