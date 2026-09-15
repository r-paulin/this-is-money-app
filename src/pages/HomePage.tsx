import { useCallback } from "react"
import { CardControlsGate } from "@/features/cardControls"
import { HomeScreen } from "@/features/home"
import { HomeScreenProvider } from "@/features/home/HomeScreenProvider"
import { WalletCardsProvider } from "@/features/home/WalletCardsProvider"
import { useWalletCards } from "@/features/home/useWalletCards"
import type { CardType } from "@/features/home/home.types"
import { TransactionsGate } from "@/features/transactions"
import { useOpenTransactionDetail } from "@/features/transactions/useOpenTransactionDetail"
import { SendMoneyGate } from "@/features/sendMoney"
import { NavigationProvider, useNavigationStack } from "@/shared/navigation"

function HomeRoute() {
  const { push } = useNavigationStack()
  const { lastFourByType } = useWalletCards()
  const openTransactionDetail = useOpenTransactionDetail()

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
