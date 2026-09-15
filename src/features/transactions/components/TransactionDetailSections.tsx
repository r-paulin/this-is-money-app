import { ListItemLayout, Typography, useSnackbar } from "@bolteu/kalep-react"
import CopyOutlined from "@bolteu/kalep-react-icons/dist/CopyOutlined"
import { useCallback } from "react"
import type {
  CardPaymentDetailView,
  PayoutDetailView,
  TransferDetailView,
  TransactionDetailView,
} from "../lib/transactionDetailContent"
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

function CardPaymentSections({ view }: { view: CardPaymentDetailView }) {
  return (
    <div className="transaction-detail__grouped">
      <div className="transaction-detail__section transaction-detail__section--top-rounded">
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title="Transaction details" />
        <DetailInlineRow label="Card" value={view.cardLabel} />
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
            </>
          }
        />
        <DetailStackRow
          label="Status"
          value={
            <>
              {view.status}
              {view.statusSubtext ? (
                <Typography variant="body-s-regular" color="secondary" as="span">
                  {view.statusSubtext}
                </Typography>
              ) : null}
            </>
          }
          separator={false}
        />
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>
    </div>
  )
}

function TransferSections({ view }: { view: TransferDetailView }) {
  const copy = useCopyToClipboard()

  return (
    <div className="transaction-detail__grouped">
      <div className="transaction-detail__section transaction-detail__section--bottom-rounded">
        <div className="transaction-detail__section-padding-top" aria-hidden />
        <DetailSectionHeader title="Recipient" />
        <DetailStackRow label="Account holder name" value={view.accountHolder} />
        <DetailStackRow
          label="IBAN"
          value={
            <>
              {view.ibanDisplay}
              <Typography variant="body-s-regular" color="secondary" as="span">
                {view.bankName}
              </Typography>
            </>
          }
        />
        <ListItemSendAgainRow />
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>

      <div className="transaction-detail__section-separator" aria-hidden />

      <div className="transaction-detail__section transaction-detail__section--top-rounded">
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
        <DetailInlineRow label="Amount" value={view.amount} />
        <DetailInlineRow label="Fee" value={view.fee} />
        <DetailInlineRow
          label="Total"
          value={view.total}
          separator={false}
          valueAccent
        />
        <div className="transaction-detail__section-padding-bottom" aria-hidden />
      </div>
    </div>
  )
}

function ListItemSendAgainRow() {
  return (
    <ListItemLayout
      primary="Send again"
      separator={false}
      paddingStart={6}
      paddingEnd={6}
      onClick={() => console.info("[stub] Send again")}
      primaryTypographyProps={{
        variant: "body-m-compact-regular",
        color: "action-primary",
      }}
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

      <div className="transaction-detail__section transaction-detail__section--top-rounded">
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
        <DetailInlineRow
          label="Amount"
          value={view.amount}
          separator={false}
          valueAccent
        />
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
