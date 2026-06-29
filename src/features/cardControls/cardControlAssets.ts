import physicalCardFull from "@/assets/card-full-physical.png"
import virtualCardFull from "@/assets/card-full-virtual.png"
import type { CardType } from "@/features/home/home.types"

export function getCardControlImage(cardType: CardType): string {
  return cardType === "virtual" ? virtualCardFull : physicalCardFull
}
