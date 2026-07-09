import { useContext } from "react"
import { WalletCardsContext, type WalletCardsContextValue } from "./walletCardsContext"

export function useWalletCards(): WalletCardsContextValue {
  const context = useContext(WalletCardsContext)
  if (!context) {
    throw new Error("useWalletCards must be used within WalletCardsProvider")
  }
  return context
}
