import { Typography } from "@bolteu/kalep-react"
import { formatRecipientDisplayName } from "../lib/formatRecipientName"
import type { Recipient } from "../sendMoney.types"

export interface AmountPlaceholderScreenProps {
  recipient: Recipient
}

export function AmountPlaceholderScreen({ recipient }: AmountPlaceholderScreenProps) {
  const name = formatRecipientDisplayName(recipient.rawName)

  return (
    <div className="min-h-dvh bg-layer-floor-1">
      <div className="flex flex-col">
        <div className="px-6 py-3">
          <Typography variant="heading-l-accent" color="primary" as="h1">
            Enter amount
          </Typography>
        </div>

        <div className="px-6">
          <Typography variant="body-m-regular" color="secondary" as="p">
            Amount entry for {name} is coming soon. This placeholder confirms recipient
            selection from the previous step.
          </Typography>
        </div>
      </div>
    </div>
  )
}
