import { Button, Typography } from "@bolteu/kalep-react"
import ArrowCircleUp from "@bolteu/kalep-react-icons/dist/ArrowCircleUp"
import { SectionHeader } from "@/shared/components/SectionHeader"
import { AnimatedBalanceAmount } from "./AnimatedBalanceAmount"
import { LegalFooter } from "./LegalFooter"
import { MoreForYouList } from "./MoreForYouList"
import { WalletCardStack } from "./WalletCardStack"
import type { CardType, HomeMenuItemId } from "../home.types"

export interface HomeScreenProps {
  onCardClick: (cardType: CardType) => void
}

export function HomeScreen({ onCardClick }: HomeScreenProps) {
  const handleSendMoney = () => {
    console.info("[stub] Send money")
  }

  const handleMenuItemClick = (id: HomeMenuItemId) => {
    console.info("[stub] Navigate:", id)
  }

  return (
    <div className="min-h-dvh bg-layer-floor-0-grouped">
      <div className="flex flex-col">
        <header className="w-full px-6 pb-0 pt-10">
          <WalletCardStack
            onCardClick={onCardClick}
            balanceLabel={
              <Typography variant="body-m-regular" color="secondary" as="p" align="center">
                Available balance
              </Typography>
            }
            balanceAmount={<AnimatedBalanceAmount />}
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
    </div>
  )
}
