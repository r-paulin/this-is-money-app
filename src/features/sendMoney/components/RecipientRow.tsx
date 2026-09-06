import { RecipientAvatar } from "./RecipientAvatar"
import {
  formatRecipientDisplayName,
  formatRecipientListName,
} from "../lib/formatRecipientName"
import { formatRecipientRelativeTime } from "../lib/formatRecipientTime"
import { formatEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import type { Recipient } from "../sendMoney.types"
import { ListItemLayout } from "@bolteu/kalep-react"
import { highlightNameMatch } from "../lib/highlightMatch"

export interface RecipientRowProps {
  recipient: Recipient
  separator: boolean
  searchQuery?: string
  now: number
  onSelect: (recipient: Recipient) => void
}

function formatRecipientSubtitle(recipient: Recipient, now: number): string {
  if (recipient.isLinkedBankAccount) {
    return "Linked bank account"
  }

  const amount = formatEurFromCents(recipient.lastAmountCents)
  const when = formatRecipientRelativeTime(recipient.lastTransferredAt, now)
  return `${amount} · ${when}`
}

export function RecipientRow({
  recipient,
  separator,
  searchQuery,
  now,
  onSelect,
}: RecipientRowProps) {
  const displayName = formatRecipientListName(recipient.rawName)
  const subtitle = formatRecipientSubtitle(recipient, now)
  const accessibleLabel = recipient.isTrusted
    ? `${displayName}, ${subtitle}, trusted`
    : `${displayName}, ${subtitle}`
  const primary =
    searchQuery && searchQuery.trim().length > 0 ? (
      highlightNameMatch(recipient.rawName, searchQuery)
    ) : (
      formatRecipientDisplayName(recipient.rawName)
    )

  return (
    <ListItemLayout
      primary={primary}
      secondary={subtitle}
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      onClick={() => onSelect(recipient)}
      renderStartSlot={() => (
        <RecipientAvatar name={recipient.rawName} trusted={recipient.isTrusted} />
      )}
      primaryTypographyProps={{ variant: "body-m-compact-regular" }}
      secondaryTypographyProps={{ variant: "body-s-regular" }}
      aria-label={accessibleLabel}
    />
  )
}
