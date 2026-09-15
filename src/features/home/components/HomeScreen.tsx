import { useCallback } from "react"
import { PullToRefresh } from "@/shared/components/PullToRefresh"
import { useHomeScreen } from "../useHomeScreen"
import type { Transaction } from "@/features/transactions/data/mockTransactions"
import type { CardType } from "../home.types"
import { ActivitySection } from "./ActivitySection"
import { BannerSlider } from "./BannerSlider"
import { CardsSection } from "./CardsSection"
import { HomeHeader } from "./HomeHeader"
import { LegalFooter } from "./LegalFooter"

export interface HomeScreenProps {
  onCardClick: (cardType: CardType) => void
  onSendMoney: () => void
  onSeeAll: () => void
  onTransactionSelect: (transaction: Transaction) => void
}

export function HomeScreen({
  onCardClick,
  onSendMoney,
  onSeeAll,
  onTransactionSelect,
}: HomeScreenProps) {
  const {
    balanceCents,
    balanceState,
    notification,
    banners,
    dismissBanner,
    cards,
    cardsState,
    activityState,
    transactionCount,
    asOfMs,
    refresh,
    retryActivity,
  } = useHomeScreen()

  const physicalOrdered = cards.some((card) => card.kind === "physical")

  const handleRefresh = useCallback(async () => {
    await refresh()
  }, [refresh])

  const handleGetPhysical = useCallback(() => {
    console.info("[stub] Order physical card")
  }, [])

  return (
    <PullToRefresh onRefresh={handleRefresh} className="!bg-layer-floor-0-grouped">
      <div className="flex flex-col bg-layer-floor-0-grouped">
        <HomeHeader
          balanceCents={balanceCents}
          balanceState={balanceState}
          notification={notification}
          onSendMoney={onSendMoney}
        />

        <BannerSlider
          bannerIds={banners}
          physicalOrdered={physicalOrdered}
          onDismiss={dismissBanner}
        />

        <ActivitySection
          activityState={activityState}
          transactionCount={transactionCount}
          onSeeAll={onSeeAll}
          onRetry={retryActivity}
          onTransactionSelect={onTransactionSelect}
        />

        <CardsSection
          cards={cards}
          cardsState={cardsState}
          asOfMs={asOfMs}
          onCardClick={onCardClick}
          onGetPhysical={handleGetPhysical}
        />

        <LegalFooter />
      </div>
    </PullToRefresh>
  )
}
