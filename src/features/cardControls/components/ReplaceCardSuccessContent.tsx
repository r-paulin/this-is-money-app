import { Button, Typography } from "@bolteu/kalep-react"
import replaceSuccessCard from "../assets/replace-success-card.png"
import {
  getReplaceSuccessCopy,
  REPLACE_SUCCESS_CARD_HEIGHT,
  REPLACE_SUCCESS_CARD_WIDTH,
} from "../lib/replaceCard.constants"
import type { CardType } from "@/features/home/home.types"

export interface ReplaceCardSuccessContentProps {
  cardType: CardType
  onGotIt: () => void
}

export function ReplaceCardSuccessContent({ cardType, onGotIt }: ReplaceCardSuccessContentProps) {
  const copy = getReplaceSuccessCopy(cardType)

  return (
    <div className="flex min-h-dvh flex-col bg-layer-floor-1">
      <div className="flex flex-1 flex-col items-center px-6 pt-[140px]">
        <img
          src={replaceSuccessCard}
          alt=""
          width={REPLACE_SUCCESS_CARD_WIDTH}
          height={REPLACE_SUCCESS_CARD_HEIGHT}
          className="shrink-0 object-contain"
          aria-hidden
        />

        <div className="w-full pt-6 text-center">
          <Typography variant="heading-m-accent" color="primary" as="h1">
            {copy.title}
          </Typography>
        </div>

        <div className="w-full px-6 pt-3 text-center">
          <Typography variant="body-m-regular" color="secondary" as="p">
            {copy.body}
          </Typography>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3">
        <Button size="lg" variant="primary" onClick={onGotIt} fullWidth>
          Got it
        </Button>
      </div>
    </div>
  )
}
