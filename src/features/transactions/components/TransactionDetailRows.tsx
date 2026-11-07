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
  /** Figma List Item bottom slot — e.g. bank name under IBAN. */
  caption?: string
  separator?: boolean
  onClick?: () => void
  endSlot?: ReactNode
  ariaLabel?: string
}

export function DetailStackRow({
  label,
  value,
  caption,
  separator = true,
  onClick,
  endSlot,
  ariaLabel,
}: DetailStackRowProps) {
  // Root must be Typography so Kalep does not wrap again (breaks caption / mask markup).
  const primary = caption ? (
    <Typography variant="body-m-compact-regular" color="primary" as="div">
      <div>{value}</div>
      <Typography variant="body-s-regular" color="secondary" as="div">
        {caption}
      </Typography>
    </Typography>
  ) : typeof value === "string" ? (
    <Typography variant="body-m-compact-regular" color="primary" as="span">
      {value}
    </Typography>
  ) : (
    value
  )

  return (
    <ListItemLayout
      isReverse
      gap={1}
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      paddingTop={3}
      paddingBottom={3}
      onClick={onClick}
      aria-label={ariaLabel}
      secondary={
        <Typography variant="body-s-regular" color="secondary" as="span">
          {label}
        </Typography>
      }
      primary={primary}
      renderEndSlot={endSlot ? () => endSlot : undefined}
    />
  )
}

export interface DetailInlineRowProps {
  label: string
  value: string
  separator?: boolean
  valueAccent?: boolean
  /** When true, value uses secondary color (Figma Fee row). */
  valueMuted?: boolean
  /** size.comp.L (12px) vs default size.comp.M (8px). Total uses L. */
  density?: "m" | "l"
  onClick?: () => void
  endSlot?: ReactNode
  ariaLabel?: string
}

export function DetailInlineRow({
  label,
  value,
  separator = true,
  valueAccent = false,
  valueMuted = false,
  density = "m",
  onClick,
  endSlot,
  ariaLabel,
}: DetailInlineRowProps) {
  const valueVariant = valueAccent ? "body-m-compact-accent" : "body-m-compact-regular"
  const valueColor = valueAccent ? "primary" : valueMuted ? "secondary" : "primary"
  const pad = density === "l" ? 3 : 2

  return (
    <ListItemLayout
      separator={separator}
      paddingStart={6}
      paddingEnd={6}
      paddingTop={pad}
      paddingBottom={pad}
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
          <Typography variant={valueVariant} color={valueColor} as="span" align="end">
            {value}
          </Typography>
          {endSlot}
        </div>
      )}
    />
  )
}
