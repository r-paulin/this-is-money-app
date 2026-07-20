import { useCallback, useRef, useState } from "react"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { PullToRefresh } from "@/shared/components/PullToRefresh"
import { useWalletCards } from "../useWalletCards"
import type { CardType, HomeMenuItemId } from "../home.types"
import "../card-replace-fly-in.css"
import { AnimatedBalanceAmount } from "./AnimatedBalanceAmount"
import { CardReplaceFlyIn } from "./CardReplaceFlyIn"
import { GoogleWalletBanner } from "./GoogleWalletBanner"
import { LegalFooter } from "./LegalFooter"
import { ServicesList } from "./ServicesList"
import { WalletCardStack } from "./WalletCardStack"

const REFRESH_STUB_MS = 800

export interface HomeScreenProps {
  onCardClick: (cardType: CardType) => void
  onMenuItemClick?: (id: HomeMenuItemId) => void
}

export function HomeScreen({ onCardClick, onMenuItemClick }: HomeScreenProps) {
  const { replaceAnimation, clearReplaceAnimation } = useWalletCards()
  const physicalCardRef = useRef<HTMLDivElement>(null)
  const virtualCardRef = useRef<HTMLDivElement>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [settlingCardType, setSettlingCardType] = useState<CardType | null>(null)
  const [showWalletBanner, setShowWalletBanner] = useState(true)

  const handleMenuItemClick = (id: HomeMenuItemId) => {
    if (onMenuItemClick) {
      onMenuItemClick(id)
      return
    }
    console.info("[stub] Navigate:", id)
  }

  const handleRefresh = useCallback(async () => {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, REFRESH_STUB_MS)
    })
    setRefreshTrigger((count) => count + 1)
  }, [])

  const handleFlyInComplete = useCallback(() => {
    if (replaceAnimation) {
      setSettlingCardType(replaceAnimation.cardType)
      window.setTimeout(() => {
        setSettlingCardType(null)
      }, 550)
    }
    clearReplaceAnimation()
  }, [clearReplaceAnimation, replaceAnimation])

  const flyInTargetRef =
    replaceAnimation?.cardType === "virtual" ? virtualCardRef : physicalCardRef

  return (
    <>
      <PullToRefresh onRefresh={handleRefresh} className="!bg-layer-floor-1">
        <div className="flex flex-col">
          <header className="w-full px-6 pb-0 pt-6">
            <WalletCardStack
              onCardClick={onCardClick}
              physicalCardRef={physicalCardRef}
              virtualCardRef={virtualCardRef}
              hiddenCardType={replaceAnimation?.cardType ?? null}
              settlingCardType={settlingCardType}
              balanceAmount={<AnimatedBalanceAmount refreshTrigger={refreshTrigger} />}
            />
          </header>

          <section aria-labelledby="services-heading">
            <SectionHeader id="services-heading" variant="heading-s-accent">
              Services
            </SectionHeader>

            {showWalletBanner ? (
              <div className="px-6 pb-3">
                <GoogleWalletBanner onDismiss={() => setShowWalletBanner(false)} />
              </div>
            ) : null}

            <div className="pb-6">
              <ServicesList onMenuItemClick={handleMenuItemClick} />
            </div>
          </section>

          <LegalFooter />
        </div>
      </PullToRefresh>

      {replaceAnimation ? (
        <CardReplaceFlyIn
          cardType={replaceAnimation.cardType}
          newLastFour={replaceAnimation.newLastFour}
          targetRef={flyInTargetRef}
          onComplete={handleFlyInComplete}
        />
      ) : null}
    </>
  )
}
