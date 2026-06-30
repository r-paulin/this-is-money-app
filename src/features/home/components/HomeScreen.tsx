import { Button } from "@bolteu/kalep-react"
import ArrowCircleUp from "@bolteu/kalep-react-icons/dist/ArrowCircleUp"
import { useCallback, useState } from "react"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { PullToRefresh } from "@/shared/components/PullToRefresh"
import { AnimatedBalanceAmount } from "./AnimatedBalanceAmount"
import { LegalFooter } from "./LegalFooter"
import { MoreForYouList } from "./MoreForYouList"
import { WalletCardStack } from "./WalletCardStack"
import type { CardType, HomeMenuItemId } from "../home.types"

const REFRESH_STUB_MS = 800

export interface HomeScreenProps {
  onCardClick: (cardType: CardType) => void
}

export function HomeScreen({ onCardClick }: HomeScreenProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex flex-col">
        <header className="w-full px-6 pb-0 pt-10">
          <WalletCardStack
            onCardClick={onCardClick}
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
  )
}
