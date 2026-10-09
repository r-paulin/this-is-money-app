import { useCallback } from "react"
import { CardControlsGate } from "@/features/cardControls"
import { HomeScreen } from "@/features/home"
import { HomeScreenProvider } from "@/features/home/HomeScreenProvider"
import { WalletCardsProvider } from "@/features/home/WalletCardsProvider"
import { useHomeScreen } from "@/features/home/useHomeScreen"
import { useWalletCards } from "@/features/home/useWalletCards"
import type { CardType } from "@/features/home/home.types"
import { TransactionsGate } from "@/features/transactions"
import { useOpenTransactionDetail } from "@/features/transactions/useOpenTransactionDetail"
import { SendMoneyGate } from "@/features/sendMoney"
import { NavigationProvider, useNavigationStack } from "@/shared/navigation"

function HomeRoute() {
  const { push } = useNavigationStack()
  const { lastFourByType } = useWalletCards()
  const { cards, setCardLocked } = useHomeScreen()
  const openTransactionDetail = useOpenTransactionDetail()

  const openCardControls = useCallback(
    (cardType: CardType) => {
      const card = cards.find((row) => row.kind === cardType)
      const initialLocked = Boolean(card?.locked)
      push({
        key: `card-controls:${cardType}`,
        render: () => (
          <CardControlsGate
            cardType={cardType}
            lastFour={lastFourByType[cardType]}
            initialLocked={initialLocked}
            onLockedChange={(locked) => setCardLocked(cardType, locked)}
          />
        ),
      })
    },
    [cards, lastFourByType, push, setCardLocked],
  )

  const openTransactions = useCallback(() => {
    push({
      key: "transactions",
      render: () => <TransactionsGate />,
    })
  }, [push])

  const openSendMoney = useCallback(() => {
    push({
      key: "send-money",
      render: () => <SendMoneyGate />,
    })
  }, [push])

  return (
    <HomeScreen
      onCardClick={openCardControls}
      onSendMoney={openSendMoney}
      onSeeAll={openTransactions}
      onTransactionSelect={openTransactionDetail}
      onUnlockCard={openCardControls}
    />
  )
}

export function HomePage() {
  return (
    <WalletCardsProvider>
      <HomeScreenProvider>
        <NavigationProvider
          initialScreen={{
            key: "home",
            render: () => <HomeRoute />,
          }}
        />
      </HomeScreenProvider>
    </WalletCardsProvider>
  )
}
