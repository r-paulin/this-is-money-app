import { useCallback } from "react"
import { CardControlsGate } from "@/features/cardControls"
import { HomeScreen } from "@/features/home"
import { WalletCardsProvider } from "@/features/home/WalletCardsProvider"
import { useWalletCards } from "@/features/home/useWalletCards"
import type { CardType } from "@/features/home/home.types"
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

  return <HomeScreen onCardClick={openCardControls} />
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
