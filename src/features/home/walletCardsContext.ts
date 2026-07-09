import { createContext } from "react"
import type { CardType } from "./home.types"

export type ReplaceAnimationState = {
  cardType: CardType
  newLastFour: string
} | null

type LastFourByType = Record<CardType, string>

export interface WalletCardsContextValue {
  lastFourByType: LastFourByType
  replaceAnimation: ReplaceAnimationState
  completeReplace: (cardType: CardType, newLastFour: string) => void
  clearReplaceAnimation: () => void
}

export const WalletCardsContext = createContext<WalletCardsContextValue | null>(null)
