import { Typography } from "@bolteu/kalep-react"
import { formatEurFromCents } from "@/features/transactions/lib/formatTransactionAmount"
import type { TransferDraft } from "../sendMoney.types"

export interface ReviewPlaceholderScreenProps {
  draft: TransferDraft
}

export function ReviewPlaceholderScreen({ draft }: ReviewPlaceholderScreenProps) {
  const name = draft.recipient.rawName
  const amount = formatEurFromCents(draft.amountCents)

  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="px-6 py-3">
        <Typography variant="body-s-regular" color="secondary" as="p">
          Step 3 of 3
        </Typography>
        <div className="pt-1">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Review payment
          </Typography>
        </div>
        <div className="pt-1">
          <Typography variant="body-m-regular" color="secondary" as="p">
            Review and send for {name} is coming soon. Amount draft: {amount}.
          </Typography>
        </div>
      </div>
    </div>
  )
}
