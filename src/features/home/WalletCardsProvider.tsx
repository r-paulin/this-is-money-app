import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { DEFAULT_CARD_LAST_FOUR } from "@/features/cardControls/lib/generateCardDetails"
import type { CardType } from "./home.types"
import {
  WalletCardsContext,
  type ReplaceAnimationState,
} from "./walletCardsContext"

export interface WalletCardsProviderProps {
  children: ReactNode
}

export function WalletCardsProvider({ children }: WalletCardsProviderProps) {
  const [lastFourByType, setLastFourByType] = useState<Record<CardType, string>>({
    physical: DEFAULT_CARD_LAST_FOUR,
    virtual: DEFAULT_CARD_LAST_FOUR,
  })
  const [replaceAnimation, setReplaceAnimation] = useState<ReplaceAnimationState>(null)

  const completeReplace = useCallback((cardType: CardType, newLastFour: string) => {
    setLastFourByType((current) => ({
      ...current,
      [cardType]: newLastFour,
    }))
    setReplaceAnimation({ cardType, newLastFour })
  }, [])

  const clearReplaceAnimation = useCallback(() => {
    setReplaceAnimation(null)
  }, [])

  const value = useMemo(
    () => ({
      lastFourByType,
      replaceAnimation,
      completeReplace,
      clearReplaceAnimation,
    }),
    [lastFourByType, replaceAnimation, completeReplace, clearReplaceAnimation],
  )

  return (
    <WalletCardsContext.Provider value={value}>{children}</WalletCardsContext.Provider>
  )
}
