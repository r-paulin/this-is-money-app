import { useCallback } from "react"
import { CardControlsScreen } from "@/features/cardControls"
import { HomeScreen } from "@/features/home"
import type { CardType } from "@/features/home/home.types"
import { NavigationProvider, useNavigationStack } from "@/shared/navigation"

function HomeRoute() {
  const { push } = useNavigationStack()

  const openCardControls = useCallback(
    (cardType: CardType) => {
      push({
        key: `card-controls:${cardType}`,
        render: () => <CardControlsScreen cardType={cardType} />,
      })
    },
    [push],
  )

  return <HomeScreen onCardClick={openCardControls} />
}

export function HomePage() {
  return (
    <NavigationProvider
      initialScreen={{
        key: "home",
        render: () => <HomeRoute />,
      }}
    />
  )
}
