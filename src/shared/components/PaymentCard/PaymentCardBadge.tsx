import { Typography } from "@bolteu/kalep-react"

interface PaymentCardBadgeProps {
  label: string
}

export function PaymentCardBadge({ label }: PaymentCardBadgeProps) {
  return (
    <div className="absolute right-[11px] top-[11px]">
      <div className="relative flex min-h-5 min-w-5 items-center justify-center rounded-sm bg-layer-floor-0-grouped px-1 py-0.5">
        <Typography variant="body-xs-accent" color="primary" as="span">
          {label}
        </Typography>
      </div>
    </div>
  )
}
