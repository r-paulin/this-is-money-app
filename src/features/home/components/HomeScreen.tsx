import { Button } from "@bolteu/kalep-react"
import ArrowCircleUp from "@bolteu/kalep-react-icons/dist/ArrowCircleUp"
import { useCallback, useRef, useState } from "react"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { PullToRefresh } from "@/shared/components/PullToRefresh"
import { useWalletCards } from "../useWalletCards"
import type { CardType, HomeMenuItemId } from "../home.types"
import "../card-replace-fly-in.css"
import { AnimatedBalanceAmount } from "./AnimatedBalanceAmount"
import { CardReplaceFlyIn } from "./CardReplaceFlyIn"
import { LegalFooter } from "./LegalFooter"
import { MoreForYouList } from "./MoreForYouList"
import { WalletCardStack } from "./WalletCardStack"

const REFRESH_STUB_MS = 800

export interface HomeScreenProps {
  onCardClick: (cardType: CardType) => void
}

export function HomeScreen({ onCardClick }: HomeScreenProps) {
  const { replaceAnimation, clearReplaceAnimation } = useWalletCards()
  const physicalCardRef = useRef<HTMLDivElement>(null)
  const virtualCardRef = useRef<HTMLDivElement>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [settlingCardType, setSettlingCardType] = useState<CardType | null>(null)

  const handleSendMoney = () => {
    console.info("[stub] Send money")
  }

  const handleMenuItemClick = (id: HomeMenuItemId) => {
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
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex flex-col">
          <header className="w-full px-6 pb-0 pt-10">
            <WalletCardStack
              onCardClick={onCardClick}
              physicalCardRef={physicalCardRef}
              virtualCardRef={virtualCardRef}
              hiddenCardType={replaceAnimation?.cardType ?? null}
              settlingCardType={settlingCardType}
              balanceAmount={<AnimatedBalanceAmount refreshTrigger={refreshTrigger} />}
              sendMoneyButton={
                <Button
                  size="md"
                  variant="secondary"
                  startIcon={<ArrowCircleUp />}
                  onClick={handleSendMoney}
                >
                  Send money
                </Button>
              }
            />
          </header>

          <section aria-labelledby="more-for-you-heading">
            <SectionHeader id="more-for-you-heading">More for you</SectionHeader>

            <div className="px-6 pb-6">
              <MoreForYouList onMenuItemClick={handleMenuItemClick} />
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
