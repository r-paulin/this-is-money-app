import { useCallback } from "react"
import { CardControlsGate } from "@/features/cardControls"
import { HomeScreen } from "@/features/home"
import { WalletCardsProvider } from "@/features/home/WalletCardsProvider"
import { useWalletCards } from "@/features/home/useWalletCards"
import type { CardType, HomeMenuItemId } from "@/features/home/home.types"
import { TransactionsGate } from "@/features/transactions"
import { SendMoneyGate } from "@/features/sendMoney"
import { NavigationProvider, useNavigationStack } from "@/shared/navigation"

function HomeRoute() {
  const { push } = useNavigationStack()
  const { lastFourByType } = useWalletCards()

  const openCardControls = useCallback(
    (cardType: CardType) => {
      push({
        key: `card-controls:${cardType}`,
        render: () => (
          <CardControlsGate cardType={cardType} lastFour={lastFourByType[cardType]} />
        ),
      })
    },
    [lastFourByType, push],
  )

  const openMenuItem = useCallback(
    (id: HomeMenuItemId) => {
      if (id === "transactions") {
        push({
          key: "transactions",
          render: () => <TransactionsGate />,
        })
        return
      }
      if (id === "send-money") {
        push({
          key: "send-money",
          render: () => <SendMoneyGate />,
        })
        return
      }
      console.info("[stub] Navigate:", id)
    },
    [push],
  )

  return (
    <HomeScreen onCardClick={openCardControls} onMenuItemClick={openMenuItem} />
  )
}

export function HomePage() {
  return (
    <WalletCardsProvider>
      <NavigationProvider
        initialScreen={{
          key: "home",
          render: () => <HomeRoute />,
        }}
      />
    </WalletCardsProvider>
  )
}
