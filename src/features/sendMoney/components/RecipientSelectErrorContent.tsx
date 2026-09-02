import { Button, Typography } from "@bolteu/kalep-react"
import spilledMug from "../assets/spilled-mug.png"

export interface RecipientSelectErrorContentProps {
  onTryAgain?: () => void
  onAddRecipient?: () => void
}

export function RecipientSelectErrorContent({
  onTryAgain,
  onAddRecipient,
}: RecipientSelectErrorContentProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 pt-10">
        <img
          src={spilledMug}
          alt=""
          width={200}
          height={148}
          className="shrink-0 object-contain"
          aria-hidden
        />

        <div className="w-full pt-6 text-center">
          <Typography variant="heading-s-accent" color="primary" as="h1">
            We couldn&apos;t load recipients
          </Typography>
        </div>

        <div className="w-full px-2 pt-3 text-center">
          <Typography variant="body-m-regular" color="secondary" as="p">
            Try again to see people you&apos;ve sent money to before
          </Typography>
        </div>

        <div className="flex w-full flex-col gap-3 pt-8">
          <Button size="lg" variant="primary" onClick={() => onTryAgain?.()} fullWidth>
            Try again
          </Button>
          <Button size="lg" variant="secondary" onClick={() => onAddRecipient?.()} fullWidth>
            Add recipient
          </Button>
        </div>
      </div>
    </div>
  )
}
