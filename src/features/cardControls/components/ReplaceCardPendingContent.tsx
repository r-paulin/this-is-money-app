import { Spinner, Typography } from "@bolteu/kalep-react"

export function ReplaceCardPendingContent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-layer-floor-1 px-6">
      <Spinner size={600} color="text-[var(--color-special-brand)]" />
      <div className="pt-6 text-center">
        <Typography variant="heading-m-accent" color="primary" as="h1">
          Replacing your card...
        </Typography>
      </div>
      <div className="pt-2 text-center">
        <Typography variant="body-m-regular" color="secondary" as="p">
          This might take a moment
        </Typography>
      </div>
    </div>
  )
}
