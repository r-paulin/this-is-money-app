import { useCallback, useState } from "react"
import { AccountDetailsScreen } from "@/features/accountDetails"
import { CardControlsGate, SpendingLimitsGate } from "@/features/cardControls"
import { HomeScreen } from "@/features/home"
import { HomeScreenProvider } from "@/features/home/HomeScreenProvider"
import { WalletCardsProvider } from "@/features/home/WalletCardsProvider"
import { useHomeScreen } from "@/features/home/useHomeScreen"
import { useWalletCards } from "@/features/home/useWalletCards"
import type { CardType, HomeNotification } from "@/features/home/home.types"
import { OnboardingScreen } from "@/features/onboarding"
import { TransactionsGate } from "@/features/transactions"
import { GetStatementToolbarButton } from "@/features/transactions/components/GetStatementToolbarButton"
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

  const openSpendingLimits = useCallback(
    (cardType: CardType) => {
      push({
        key: `card-controls:${cardType}`,
        render: () => (
          <CardControlsGate
            cardType={cardType}
            lastFour={lastFourByType[cardType]}
            initialLocked={Boolean(cards.find((row) => row.kind === cardType)?.locked)}
            onLockedChange={(locked) => setCardLocked(cardType, locked)}
          />
        ),
      })
      push({
        key: `spending-limits:${cardType}`,
        render: () => <SpendingLimitsGate cardType={cardType} />,
      })
    },
    [cards, lastFourByType, push, setCardLocked],
  )

  const handleNotificationAction = useCallback(
    (notification: HomeNotification) => {
      if (notification.action === "spending-limits") {
        openSpendingLimits(notification.cardType)
        return
      }
      openCardControls(notification.cardType)
    },
    [openCardControls, openSpendingLimits],
  )

  const openTransactions = useCallback(() => {
    push({
      key: "transactions",
      toolbarEnd: <GetStatementToolbarButton />,
      render: () => <TransactionsGate />,
    })
  }, [push])

  const openSendMoney = useCallback(() => {
    push({
      key: "send-money",
      render: () => <SendMoneyGate />,
    })
  }, [push])

  const openAccountDetails = useCallback(() => {
    push({
      key: "account-details",
      render: () => <AccountDetailsScreen />,
    })
  }, [push])

  return (
    <HomeScreen
      onCardClick={openCardControls}
      onSendMoney={openSendMoney}
      onAccountDetails={openAccountDetails}
      onSeeAll={openTransactions}
      onTransactionSelect={openTransactionDetail}
      onNotificationAction={handleNotificationAction}
    />
  )
}

export function HomePage() {
  const [onboardingDone, setOnboardingDone] = useState(false)
  const finishOnboarding = useCallback(() => setOnboardingDone(true), [])

  return (
    <WalletCardsProvider>
      <HomeScreenProvider>
        {onboardingDone ? (
          <NavigationProvider
            initialScreen={{
              key: "home",
              render: () => <HomeRoute />,
            }}
          />
        ) : (
          <OnboardingScreen onContinue={finishOnboarding} />
        )}
      </HomeScreenProvider>
    </WalletCardsProvider>
  )
}
