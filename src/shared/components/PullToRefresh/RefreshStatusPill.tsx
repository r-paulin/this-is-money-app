import { Spinner, Typography } from "@bolteu/kalep-react"

export function RefreshStatusPill() {
  return (
    <div className="pull-to-refresh__pill-surface" role="status" aria-live="polite" aria-label="Updating">
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        <Spinner size={400} color="text-[var(--color-special-brand)]" />
      </span>
      <Typography variant="body-s-compact-accent" color="primary-inverted" as="span">
        Updating...
      </Typography>
    </div>
  )
}
