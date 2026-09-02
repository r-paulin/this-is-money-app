import Plus from "@bolteu/kalep-react-icons/dist/Plus"
import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import type { AddRecipientRowVariant } from "../sendMoney.types"

export interface AddRecipientRowProps {
  variant: AddRecipientRowVariant
  separator?: boolean
  ibanFormatted?: string
  onSelect: () => void
}

function primaryLabel(variant: AddRecipientRowVariant, ibanFormatted?: string): string {
  if (variant === "send-to-iban" && ibanFormatted) {
    return `Send to ${ibanFormatted}`
  }
  return "Add a new recipient"
}

export function AddRecipientRow({
  variant,
  separator = false,
  ibanFormatted,
  onSelect,
}: AddRecipientRowProps) {
  const secondary =
    variant === "no-results" ? (
      <Typography variant="body-s-regular" color="secondary" as="span">
        No results found
      </Typography>
    ) : undefined

  return (
    <ListItemLayout
      primary={primaryLabel(variant, ibanFormatted)}
      secondary={secondary}
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      onClick={onSelect}
      renderStartSlot={() => (
        <div
          className="flex size-10 items-center justify-center rounded-full bg-neutral-secondary"
          aria-hidden
        >
          <Plus size="lg" className="text-primary" />
        </div>
      )}
      primaryTypographyProps={{ variant: "body-m-compact-regular" }}
    />
  )
}
