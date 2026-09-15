import { ListItemLayout, Typography } from "@bolteu/kalep-react"
import type { ReactNode } from "react"

export interface DetailSectionHeaderProps {
  title: string
}

export function DetailSectionHeader({ title }: DetailSectionHeaderProps) {
  return (
    <div className="transaction-detail__section-header">
      <Typography variant="body-l-compact-accent" color="primary" as="h2">
        {title}
      </Typography>
    </div>
  )
}

export interface DetailStackRowProps {
  label: string
  value: ReactNode
  separator?: boolean
  onClick?: () => void
  endSlot?: ReactNode
  ariaLabel?: string
}

export function DetailStackRow({
  label,
  value,
  separator = true,
  onClick,
  endSlot,
  ariaLabel,
}: DetailStackRowProps) {
  return (
    <ListItemLayout
      isReverse
      gap={1}
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      onClick={onClick}
      aria-label={ariaLabel}
      primaryTypographyProps={{ variant: "body-m-compact-regular", color: "primary" }}
      secondary={
        <Typography variant="body-s-regular" color="secondary" as="span">
          {label}
        </Typography>
      }
      primary={value}
      renderEndSlot={endSlot ? () => endSlot : undefined}
    />
  )
}

export interface DetailInlineRowProps {
  label: string
  value: string
  separator?: boolean
  valueAccent?: boolean
  onClick?: () => void
  endSlot?: ReactNode
  ariaLabel?: string
}

export function DetailInlineRow({
  label,
  value,
  separator = true,
  valueAccent = false,
  onClick,
  endSlot,
  ariaLabel,
}: DetailInlineRowProps) {
  const valueVariant = valueAccent ? "body-m-compact-accent" : "body-m-compact-regular"

  return (
    <ListItemLayout
      variant="sm"
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      onClick={onClick}
      aria-label={ariaLabel}
      primary={
        <Typography
          variant={valueAccent ? "body-m-compact-accent" : "body-m-compact-regular"}
          color={valueAccent ? "primary" : "secondary"}
          as="span"
        >
          {label}
        </Typography>
      }
      renderEndSlot={() => (
        <div className="flex items-center gap-2">
          <Typography variant={valueVariant} color="primary" as="span" align="end">
            {value}
          </Typography>
          {endSlot}
        </div>
      )}
    />
  )
}
